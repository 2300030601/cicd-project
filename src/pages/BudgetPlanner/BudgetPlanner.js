// Developed by Teammate 1 - Dashboard and Finance Modules

import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./BudgetPlanner.css";
import { SettingsContext } from "../../context/SettingsContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PIE_COLORS = {
  Remaining: "#00C49F",
  Spent: "#FF8042",
  Food: "#FFBB28",
  Travel: "#0088FE",
  Utilities: "#AF19FF",
  Entertainment: "#FF4560",
  Misc: "#666666",
};

const DEFAULT_CATEGORIES = ["Food", "Travel", "Utilities", "Entertainment"];

const BudgetPlanner = () => {
  const { theme } = useContext(SettingsContext);

  // ✅ Get current logged-in user (consistent with AddTransaction & ViewHistory)
  const [username] = useState(() => localStorage.getItem("loggedUser") || "guest");

  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [newBudget, setNewBudget] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState({
    category: DEFAULT_CATEGORIES[0],
    amount: "",
  });
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [categorySpending, setCategorySpending] = useState({});

  // ✅ Load user-specific transactions
  useEffect(() => {
    const loadTransactions = () => {
      const transactions =
        JSON.parse(localStorage.getItem(`transactions_${username}`)) || [];
      let totalSpent = 0;
      const spendingMap = {};

      transactions.forEach((t) => {
        if (t.type === "expense" && t.amount > 0) {
          const amount = Number(t.amount);
          totalSpent += amount;
          const category = t.category || "Misc";
          spendingMap[category] = (spendingMap[category] || 0) + amount;
        }
      });

      setSpent(totalSpent);
      setCategorySpending(spendingMap);
    };

    loadTransactions();

    // ✅ Auto-refresh when new transactions are added
    const handleUpdate = (e) => {
      if (
        e.key === `transactions_${username}` ||
        e.type === "transactionsUpdated"
      ) {
        loadTransactions();
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("transactionsUpdated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("transactionsUpdated", handleUpdate);
    };
  }, [username]);

  // ✅ Load user’s saved budgets
  useEffect(() => {
    const savedBudget = localStorage.getItem(`budget_${username}`);
    if (savedBudget) setBudget(Number(savedBudget));

    const savedCategoryBudgets = JSON.parse(
      localStorage.getItem(`categoryBudgets_${username}`)
    );
    if (savedCategoryBudgets) setCategoryBudgets(savedCategoryBudgets);
  }, [username]);

  // ✅ Update total budget
  const handleAddBudget = (e) => {
    e.preventDefault();
    const value = Number(newBudget);
    if (value > 0) {
      localStorage.setItem(`budget_${username}`, value);
      setBudget(value);
      alert("✅ Total budget updated!");
      setNewBudget("");
    }
  };

  // ✅ Update category-specific budget
  const handleAddCategoryBudget = (e) => {
    e.preventDefault();
    const { category, amount } = newCategoryBudget;
    const value = Number(amount);
    if (category && value > 0) {
      const updatedBudgets = { ...categoryBudgets, [category]: value };
      localStorage.setItem(
        `categoryBudgets_${username}`,
        JSON.stringify(updatedBudgets)
      );
      setCategoryBudgets(updatedBudgets);
      alert(`✅ ${category} budget updated!`);
      setNewCategoryBudget({ ...newCategoryBudget, amount: "" });
    }
  };

  // ✅ Calculate totals
  const remaining = Math.max(budget - spent, 0);

  const overallData = [
    { name: "Remaining", value: remaining, color: PIE_COLORS.Remaining },
    { name: "Spent", value: spent, color: PIE_COLORS.Spent },
  ];

  const categoryChartData = Object.keys({
    ...categoryBudgets,
    ...categorySpending,
  })
    .map((cat) => ({
      name: cat,
      spent: categorySpending[cat] || 0,
      budget: categoryBudgets[cat] || 0,
      remaining: (categoryBudgets[cat] || 0) - (categorySpending[cat] || 0),
      color: PIE_COLORS[cat] || PIE_COLORS.Misc,
    }))
    .filter((data) => data.spent > 0 || data.budget > 0);

  // ✅ UI Component for category card
  const CategoryCard = ({ category, budget, spent, remaining }) => {
    const isOver = remaining < 0;
    const percentage = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
    const progressColor = isOver
      ? "#FF4560"
      : percentage > 75
      ? "#FFBB28"
      : "#00C49F";

    return (
      <div className="budget-card category-card">
        <h3>{category}</h3>
        <p>Budget: ₹{budget.toLocaleString()}</p>
        <p>Spent: ₹{spent.toLocaleString()}</p>
        <p className={isOver ? "over-budget" : ""}>
          {isOver ? "Over by: " : "Remaining: "}₹
          {Math.abs(remaining).toLocaleString()}
        </p>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${percentage}%`,
              backgroundColor: progressColor,
            }}
          ></div>
        </div>
      </div>
    );
  };

  // ✅ Theme styling
  const themeStyles =
    theme === "light"
      ? { backgroundColor: "#f5f5f5", color: "#111" }
      : { backgroundColor: "#0a0f1f", color: "#f2f2f2" };

  return (
    <div className="budget-page" style={themeStyles}>
      <Sidebar />
      <div className="budget-content">
        <div className="sticky-header">
          <h1 className="blue-title">💰 Budget Planner</h1>
          <p>Set your budget, track your spending, and visualize progress!</p>
          <p className="user-label">👤 User: {username}</p>
        </div>

        {/* --- Budget Overview --- */}
        <div className="budget-summary">
          <div className="budget-card">
            <h3>Total Budget</h3>
            <p>₹{budget.toLocaleString()}</p>
          </div>
          <div className="budget-card">
            <h3>Spent</h3>
            <p>₹{spent.toLocaleString()}</p>
          </div>
          <div className="budget-card">
            <h3>Remaining</h3>
            <p>₹{remaining.toLocaleString()}</p>
          </div>
        </div>

        {/* --- Charts --- */}
        <div className="budget-charts-and-categories">
          <div className="budget-chart chart-half-size">
            <h2 className="blue-title">Overall Spending</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={overallData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {overallData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {categoryChartData.length > 0 && (
            <div className="budget-chart chart-half-size">
              <h2 className="blue-title">Spending by Category</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    dataKey="spent"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* --- Category Budgets --- */}
        <div className="category-budgets-section">
          <h2 className="blue-title">🎯 Category Budgets</h2>
          <div className="budget-summary category-summary">
            {categoryChartData.length > 0 ? (
              categoryChartData.map((data) => (
                <CategoryCard
                  key={data.name}
                  category={data.name}
                  budget={data.budget}
                  spent={data.spent}
                  remaining={data.remaining}
                />
              ))
            ) : (
              <p className="no-data-msg">
                Set a category budget to start tracking progress.
              </p>
            )}
          </div>
        </div>

        {/* --- Add/Update Budgets --- */}
        <div className="add-budget-section">
          <h2 className="blue-title">Set or Update Total Budget</h2>
          <form onSubmit={handleAddBudget} className="budget-form">
            <input
              type="number"
              placeholder="Enter total budget amount (e.g., 50000)"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              required
              min="1"
            />
            <button type="submit">Update Total Budget</button>
          </form>
        </div>

        <div className="add-budget-section">
          <h2 className="blue-title">Set or Update Category Budget</h2>
          <form onSubmit={handleAddCategoryBudget} className="budget-form">
            <select
              value={newCategoryBudget.category}
              onChange={(e) =>
                setNewCategoryBudget({
                  ...newCategoryBudget,
                  category: e.target.value,
                })
              }
              required
            >
              {[...new Set([...DEFAULT_CATEGORIES, ...Object.keys(categorySpending)])].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
            <input
              type="number"
              placeholder={`Budget for ${newCategoryBudget.category}`}
              value={newCategoryBudget.amount}
              onChange={(e) =>
                setNewCategoryBudget({
                  ...newCategoryBudget,
                  amount: e.target.value,
                })
              }
              required
              min="1"
            />
            <button type="submit">Update Category Budget</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
