import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { TransactionContext } from "../../context/TransactionContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useContext(TransactionContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  // 🟢 Fetch from backend
  const fetchFromBackend = async (userName) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/transactions/${userName.toLowerCase()}`
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setTransactions(data);
        localStorage.setItem(`transactions_${userName}`, JSON.stringify(data));
      } else {
        console.warn("⚠️ Unexpected response:", data);
      }
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
      // fallback to localStorage if offline
      const cached = localStorage.getItem(`transactions_${userName}`);
      if (cached) setTransactions(JSON.parse(cached));
    }
  };

  const loadTransactions = async () => {
    const user = currentUser || JSON.parse(localStorage.getItem("user"));
    if (!user || !user.name) {
      navigate("/signin");
      return;
    }

    await fetchFromBackend(user.name);
  };

  useEffect(() => {
    loadTransactions();

    // ✅ Refresh when transaction is added or dashboardUpdated event fires
    const handleUpdate = () => loadTransactions();
    window.addEventListener("transactionsUpdated", handleUpdate);
    window.addEventListener("dashboardUpdated", handleUpdate);

    return () => {
      window.removeEventListener("transactionsUpdated", handleUpdate);
      window.removeEventListener("dashboardUpdated", handleUpdate);
    };
  }, [currentUser]);

  const user = currentUser || JSON.parse(localStorage.getItem("user"));
  if (!user) return null;

  const username = user.name;

  // ✅ Financial Calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;
  const netSavingsRate =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // ✅ Prepare Monthly Chart Data
  const monthlyData = {};
  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    monthlyData[month] =
      (monthlyData[month] || 0) + (t.type === "expense" ? Number(t.amount) : 0);
  });

  const chartData = Object.keys(monthlyData).map((month) => ({
    month,
    expenses: monthlyData[month],
  }));

  // ✅ Get 5 Most Recent Transactions
  const recentTxns = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Welcome, {username} 👋</h1>
        <p className="dashboard-subtitle">
          Here’s your personal financial overview.
        </p>

        {/* Summary Cards */}
        <div className="cards-container">
          <div className="card card1">
            <h3>💰 Current Balance</h3>
            <h2>₹{balance.toLocaleString()}</h2>
            <p className={balance >= 0 ? "positive" : "negative"}>
              {balance >= 0 ? "In Profit" : "In Debt"}
            </p>
          </div>

          <div className="card card2">
            <h3>📈 Total Income</h3>
            <h2>₹{totalIncome.toLocaleString()}</h2>
            <p className="neutral">This Month</p>
          </div>

          <div className="card card3">
            <h3>🔥 Total Expenses</h3>
            <h2>₹{totalExpenses.toLocaleString()}</h2>
            <p className="neutral">This Month</p>
          </div>

          <div className="card card4">
            <h3>📊 Net Savings Rate</h3>
            <h2>{netSavingsRate}%</h2>
            <p className="positive">Overall</p>
          </div>
        </div>

        {/* Charts & Recent Activity */}
        <div className="chart-section">
          <div className="chart-card">
            <h3>Spending Breakdown</h3>
            {chartData.length === 0 ? (
              <p>No expense data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2b45" />
                  <XAxis dataKey="month" stroke="#00ffff" />
                  <YAxis stroke="#00ffff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0f1f",
                      border: "1px solid #00ffff",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#00ffff"
                    strokeWidth={2.5}
                    dot={{
                      r: 5,
                      stroke: "#00ffff",
                      strokeWidth: 2,
                      fill: "#0a0f1f",
                    }}
                    activeDot={{ r: 7, fill: "#00ffff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <h3>Recent Transactions</h3>
            {recentTxns.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              <ul className="transaction-list">
                {recentTxns.map((txn) => (
                  <li key={txn.id}>
                    {txn.category || txn.note || "Transaction"}{" "}
                    <span
                      className={txn.type === "income" ? "positive" : "negative"}
                    >
                      {txn.type === "income" ? "+" : "-"}₹
                      {Number(txn.amount).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="view-btn"
              onClick={() => navigate("/view-history")}
            >
              View Full History →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
