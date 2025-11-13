// Developed by Teammate 2 - UI & Navigation

import React from "react";
import "./AboutPage.css";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      {/* Background glowing overlay */}
      <div className="about-overlay"></div>

      {/* Main content */}
      <div className="about-content">
        <h1 className="about-title">About Expense Tracker</h1>
        <p className="about-description">
          Expense Tracker helps you stay financially aware — track your income,
          expenses, and savings all in one clean, smart dashboard.
        </p>

        <div className="about-sections">
          <div className="about-card">
            <h2>💰 Track Every Expense</h2>
            <p>
              Log daily transactions and keep your spending transparent and under control.
            </p>
          </div>

          <div className="about-card">
            <h2>📊 Visualize Spending</h2>
            <p>
              Get powerful insights through visual charts and analytics to improve your budgeting.
            </p>
          </div>

          <div className="about-card">
            <h2>🎯 Set Financial Goals</h2>
            <p>
              Plan budgets and savings goals and measure progress easily toward financial success.
            </p>
          </div>
        </div>

        <div className="about-buttons">
          <button className="btn primary" onClick={() => navigate("/SignIn")}>
            Start Tracking
          </button>

          {/* ✅ Back to Welcome Page */}
          <button className="btn secondary" onClick={() => navigate("/welcome")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
