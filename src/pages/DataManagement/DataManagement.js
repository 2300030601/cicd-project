// ✅ Developed by Teammate 1 - Dashboard and Finance Modules (User-Specific Version)

import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./DataManagement.css";

const DataManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState({ income: 0, expense: 0 });

  // ✅ Load current logged-in user from localStorage
  const [currentUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser || { name: "Guest", id: "guest" };
  });

  const username = currentUser.name || "Guest";

  // 🔄 Load user-specific transactions
  const loadData = () => {
    const storedTransactions =
      JSON.parse(localStorage.getItem(`transactions_${username}`)) || [];
    setTransactions(storedTransactions);

    const totalIncome = storedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = storedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setBudget({ income: totalIncome, expense: totalExpense });
  };

  // ✅ Load initially and auto-refresh on updates
  useEffect(() => {
    loadData();

    const handleUpdate = (event) => {
      if (
        event.key === `transactions_${username}` ||
        event.type === "transactionsUpdated"
      ) {
        loadData();
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("transactionsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("transactionsUpdated", handleUpdate);
    };
  }, [username]);

  // 🧹 Clear user-specific transactions
  const handleClearTransactions = () => {
    localStorage.removeItem(`transactions_${username}`);
    setTransactions([]);
    setBudget({ income: 0, expense: 0 });
    window.dispatchEvent(new Event("transactionsUpdated"));
    alert(`🧹 All transactions cleared for ${username}!`);
  };

  // 🧹 Clear all user-specific data (budget + transactions)
  const handleClearAll = () => {
    localStorage.removeItem(`transactions_${username}`);
    localStorage.removeItem(`budget_${username}`);
    localStorage.removeItem(`categoryBudgets_${username}`);
    setTransactions([]);
    setBudget({ income: 0, expense: 0 });
    window.dispatchEvent(new Event("transactionsUpdated"));
    alert(`🗑️ All data cleared for ${username}!`);
  };

  // 💾 Download user data as JSON
  const handleDownloadData = () => {
    const allData = { username, transactions, budget };
    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${username}_budget_data_backup.json`;
    link.click();
  };

  // 💰 Budget totals
  const income = Number(budget.income ?? 0);
  const expense = Number(budget.expense ?? 0);
  const totalRemaining = income - expense;

  return (
    <div className="data-management-container">
      <Sidebar />

      <div className="data-management-content">
        <h1 className="data-title">📊 Data Management</h1>
        <p className="data-subtitle">
          View, export, or clear your saved transactions.
        </p>
        <p className="user-label">👤 User: {username}</p>

        {/* Budget Summary */}
        <div className="budget-summary">
          <div className="summary-card income">
            <h3>Income</h3>
            <p>₹{income.toLocaleString()}</p>
          </div>
          <div className="summary-card expense">
            <h3>Expense</h3>
            <p>₹{expense.toLocaleString()}</p>
          </div>
          <div className="summary-card remaining">
            <h3>Remaining</h3>
            <p>₹{totalRemaining.toLocaleString()}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <h2 className="table-title">Your Transactions</h2>
        {transactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Category</th>
                <th>Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={index}>
                  <td className={t.type === "income" ? "income" : "expense"}>
                    {t.type}
                  </td>
                  <td>{t.amount}</td>
                  <td>{t.category}</td>
                  <td>{t.date}</td>
                  <td>{t.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No transactions found for {username}.</p>
        )}

        {/* Action Buttons */}
        <div className="data-actions">
          <button className="btn download" onClick={handleDownloadData}>
            ⬇️ Download Data
          </button>
          <button className="btn clear" onClick={handleClearTransactions}>
            🧾 Clear Transactions
          </button>
          <button className="btn clear-all" onClick={handleClearAll}>
            🗑️ Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
