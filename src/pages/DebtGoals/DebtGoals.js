// Developed by Teammate 1 - Dashboard and Finance Modules

import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./DebtGoals.css";

const DebtGoals = () => {
  const [debts] = useState([
    { id: 1, name: "Home Loan", amount: 1500000, interest: 6.8, status: "Ongoing" },
    { id: 2, name: "Car Loan", amount: 400000, interest: 8.5, status: "Ongoing" },
    { id: 3, name: "Credit Card Dues", amount: 60000, interest: 15, status: "Pending" },
  ]);

  const [goals] = useState([
    { id: 1, name: "Buy a New Car", target: 800000, progress: 45 },
    { id: 2, name: "Emergency Fund", target: 300000, progress: 80 },
    { id: 3, name: "Vacation to Europe", target: 250000, progress: 60 },
  ]);

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const activeLoans = debts.length;

  return (
    <div className="debtgoals-page">
      <Sidebar />
      <div className="debtgoals-content">
        <header className="debtgoals-header">
          <h2>💰 Debt & Financial Goals</h2>
          <p>Track your debts and set realistic goals for your financial growth.</p>
        </header>

        <div className="debtgoals-summary">
          <div className="summary-card">
            <h3>Total Debt</h3>
            <p className="summary-value">₹{totalDebt.toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h3>Active Loans</h3>
            <p className="summary-value">{activeLoans}</p>
          </div>
        </div>

        <div className="current-debts">
          <h3>📋 Current Debts</h3>
          <table>
            <thead>
              <tr>
                <th>Debt Name</th>
                <th>Amount (₹)</th>
                <th>Interest (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt) => (
                <tr key={debt.id}>
                  <td>{debt.name}</td>
                  <td>{debt.amount.toLocaleString()}</td>
                  <td>{debt.interest}</td>
                  <td>
                    <span className={`status ${debt.status.toLowerCase()}`}>
                      {debt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="financial-goals">
          <h3>🎯 Financial Goals</h3>
          <div className="goals-list">
            {goals.map((goal) => (
              <div key={goal.id} className="goal-card">
                <h4>{goal.name}</h4>
                <p>Target: ₹{goal.target.toLocaleString()}</p>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="progress-text">{goal.progress}% achieved</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtGoals;
