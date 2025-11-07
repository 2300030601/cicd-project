import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ManageCategories.css";
import { TransactionContext } from "../../context/TransactionContext";
import axios from "axios";

const ManageCategories = () => {
  const { currentUser } = useContext(TransactionContext);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
  });

  const loadCategories = async () => {
    if (!currentUser || !currentUser.name) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/categories/${currentUser.name}`
      );
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("⚠️ Please enter a category name.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/categories", {
        userName: currentUser.name,
        name: formData.name,
        type: formData.type,
      });

      setCategories([...categories, res.data]);
      setFormData({ name: "", type: "expense" });
      alert("✅ Category added successfully!");
    } catch (err) {
      console.error("❌ Error adding category:", err);
      alert("❌ Failed to add category.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`);
      setCategories(categories.filter((cat) => cat.id !== id));
      alert("🗑️ Category deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting category:", err);
      alert("❌ Failed to delete category.");
    }
  };

  return (
    <div className="manage-categories-container">
      <Sidebar />
      <div className="manage-categories-content">
        <h1 className="manage-categories-title">Manage Categories</h1>
        <p className="manage-categories-subtitle">
          Add or remove your personal income and expense categories.
        </p>

        {/* Add Category Form */}
        <form className="category-form" onSubmit={handleAdd}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="add-btn">
            Add Category
          </button>
        </form>

        {/* Display Categories */}
        <table className="categories-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-categories">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td
                    className={
                      cat.type === "income" ? "income-type" : "expense-type"
                    }
                  >
                    {cat.type}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;
