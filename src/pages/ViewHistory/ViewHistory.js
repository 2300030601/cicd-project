import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ViewHistory.css";
import { TransactionContext } from "../../context/TransactionContext";

const ViewHistory = () => {
  const { currentUser } = useContext(TransactionContext);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currency, setCurrency] = useState("₹");

  const loadTransactions = () => {
    if (!currentUser || !currentUser.name) return;

    const key = `transactions_${currentUser.name}`;
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    setTransactions(stored);

    // ✅ Notify BudgetPlanner whenever transactions are updated or loaded
    window.dispatchEvent(new Event("transactionsUpdated"));
    window.localStorage.setItem("transactions_sync", Date.now());
  };

  const loadCurrency = () => {
    if (!currentUser || !currentUser.name) return;

    const settingsKey = `settings_${currentUser.name}`;
    const savedSettings = JSON.parse(localStorage.getItem(settingsKey));
    if (savedSettings && savedSettings.currency) {
      setCurrency(savedSettings.currency);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadCurrency();

    const handleUpdate = () => {
      loadTransactions();
      loadCurrency();
    };

    window.addEventListener("transactionsUpdated", handleUpdate);
    window.addEventListener("dashboardUpdated", handleUpdate);
    window.addEventListener("settingsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("transactionsUpdated", handleUpdate);
      window.removeEventListener("dashboardUpdated", handleUpdate);
      window.removeEventListener("settingsUpdated", handleUpdate);
    };
  }, [currentUser]);

  const clearHistory = () => {
    if (!currentUser || !currentUser.name) return;

    const key = `transactions_${currentUser.name}`;
    if (window.confirm("Are you sure you want to clear all transactions?")) {
      localStorage.removeItem(key);
      setTransactions([]);

      // ✅ Trigger all updates and local sync
      window.dispatchEvent(new Event("transactionsUpdated"));
      window.dispatchEvent(new Event("dashboardUpdated"));
      window.localStorage.setItem("transactions_sync", Date.now());

      alert("✅ All transactions cleared successfully!");
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (filterType === "all") return true;
    return txn.type === filterType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortOption === "newest") return new Date(b.date) - new Date(a.date);
    if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortOption === "high") return b.amount - a.amount;
    if (sortOption === "low") return a.amount - b.amount;
    return 0;
  });

  return (
    <div className="view-history-container">
      <Sidebar />
      <div className="view-history-content">
        <h1 className="view-history-title">Transaction History</h1>
        <p className="view-history-subtitle">
          Review, filter, and sort your income and expense records.
        </p>

        <div className="filter-sort-bar">
          <div>
            <label>Filter by Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label>Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="high">Highest Amount</option>
              <option value="low">Lowest Amount</option>
            </select>
          </div>
        </div>

        {sortedTransactions.length === 0 ? (
          <p className="no-transactions">No transactions found.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount ({currency})</th>
                <th>Category</th>
                <th>Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((txn, index) => (
                <tr
                  key={index}
                  className={txn.type === "income" ? "income-row" : "expense-row"}
                >
                  <td>{txn.type}</td>
                  <td>
                    {currency}
                    {txn.amount}
                  </td>
                  <td>{txn.category}</td>
                  <td>{txn.date}</td>
                  <td>{txn.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={clearHistory} className="clear-history-btn">
          Clear All Transactions
        </button>
      </div>
    </div>
  );
};

export default ViewHistory;
