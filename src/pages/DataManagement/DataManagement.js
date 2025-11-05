// Developed by Teammate 1 - Dashboard and Finance Modules

import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./DataManagement.css";

const DataManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState({ income: 0, expense: 0 });

  // 🔄 Load all data from localStorage
  const loadData = () => {
    const storedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);

    // ✅ Dynamically calculate income/expense from transactions
    const totalIncome = storedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = storedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setBudget({ income: totalIncome, expense: totalExpense });
  };

  // ✅ Load once + listen for changes (from AddTransaction or any tab)
  useEffect(() => {
    loadData();

    const handleUpdate = (event) => {
      if (
        event.key === "transactions" ||
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
  }, []);

  // 🧹 Clear data handlers
  const handleClearTransactions = () => {
    localStorage.removeItem("transactions");
    setTransactions([]);
    setBudget({ income: 0, expense: 0 });
    window.dispatchEvent(new Event("transactionsUpdated"));
    alert("🧹 All transactions cleared!");
  };

  const handleClearAll = () => {
    localStorage.removeItem("transactions");
    setTransactions([]);
    setBudget({ income: 0, expense: 0 });
    window.dispatchEvent(new Event("transactionsUpdated"));
    alert("🗑️ All data cleared!");
  };

  // 💾 Download as JSON
  const handleDownloadData = () => {
    const allData = { transactions, budget };
    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "budget_data_backup.json";
    link.click();
  };

  // 💰 Totals
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

        {/* Budget Summary */}
        <div className="budget-summary">
          <div className="summary-card income">
            <h3>Income</h3>
            <p>₹{income.toFixed(2)}</p>
          </div>
          <div className="summary-card expense">
            <h3>Expense</h3>
            <p>₹{expense.toFixed(2)}</p>
          </div>
          <div className="summary-card remaining">
            <h3>Remaining</h3>
            <p>₹{totalRemaining.toFixed(2)}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <h2 className="table-title">All Transactions</h2>
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
          <p className="no-data">No transactions available.</p>
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
