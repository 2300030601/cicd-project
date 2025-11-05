// Developed by Teammate 1 - Dashboard and Finance Modules

import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Investments.css";

const Investments = () => {
  const [investments] = useState([
    { id: 1, name: "Stocks - TCS", amount: 50000, returns: 8.5, type: "Equity" },
    { id: 2, name: "Mutual Fund - Axis Bluechip", amount: 30000, returns: 10.2, type: "Mutual Fund" },
    { id: 3, name: "Gold ETF", amount: 20000, returns: 6.8, type: "Commodity" },
    { id: 4, name: "Fixed Deposit", amount: 40000, returns: 7.1, type: "Fixed Income" },
    { id: 5, name: "Crypto - Bitcoin", amount: 15000, returns: 12.4, type: "Crypto" },
  ]);

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const avgReturn =
    investments.reduce((sum, inv) => sum + inv.returns, 0) / investments.length;

  const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#845EC2"];

  return (
    <div className="investments-page">
      <Sidebar />
      <div className="investments-content">
        <header className="investments-header">
          <h2>📈 My Investment Portfolio</h2>
          <p>Analyze your investments and overall returns at a glance.</p>
        </header>

        {/* Portfolio Overview Row */}
        <div className="portfolio-overview">
          <div className="portfolio-summary">
            <div className="summary-card">
              <h3>Total Investment</h3>
              <p className="value">₹{totalInvestment.toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h3>Average Return</h3>
              <p className="value">{avgReturn.toFixed(2)}%</p>
            </div>
          </div>

          <div className="chart-section">
            <h3>📊 Portfolio Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={investments}
                  dataKey="amount"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {investments.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="investments-table">
          <h3>📋 Detailed Investments</h3>
          <table>
            <thead>
              <tr>
                <th>Investment</th>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Return (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.name}</td>
                  <td>{inv.type}</td>
                  <td>{inv.amount.toLocaleString()}</td>
                  <td>{inv.returns}%</td>
                  <td>
                    <span
                      className={`status ${
                        inv.returns > 8 ? "profit" : "moderate"
                      }`}
                    >
                      {inv.returns > 8 ? "Profit" : "Moderate"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="investments-footer">
          <button className="btn-add">➕ Add New Investment</button>
        </div>
      </div>
    </div>
  );
};

export default Investments;
