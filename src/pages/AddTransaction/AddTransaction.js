import React, { useState, useContext } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./AddTransaction.css";
import { TransactionContext } from "../../context/TransactionContext";

const AddTransaction = () => {
  const { setTransactions, currentUser } = useContext(TransactionContext);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  // ✅ Handle input change safely
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    // ✅ Get logged user from context or localStorage
    const loggedUsername = currentUser?.name || localStorage.getItem("loggedUser");
    if (!loggedUsername) {
      alert("⚠️ Please login first!");
      return;
    }

    // ✅ Prepare new transaction
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now(),
    };

    // ✅ Fetch and update user-specific transactions
    const key = `transactions_${loggedUsername}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    const updated = [...existing, transactionData];
    localStorage.setItem(key, JSON.stringify(updated));

    // ✅ Update context and refresh listeners
    setTransactions(updated);
    window.dispatchEvent(new Event("transactionsUpdated"));

    alert("✅ Transaction added successfully!");

    // Reset form
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      date: "",
      note: "",
    });
  };

  return (
    <div className="add-transaction-container">
      <Sidebar />
      <div className="add-transaction-content">
        <h1 className="add-transaction-title">Add New Transaction</h1>
        <p className="add-transaction-subtitle">
          Log your income or expenses to keep track of your finances.
        </p>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Transaction Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="Enter amount"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g. Food, Rent, Shopping"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Optional note..."
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
