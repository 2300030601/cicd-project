// src/components/WelcomePage.jsx
// Developed by Teammate 2 - UI & Navigation

import React from "react";
import "./WelcomePage.css";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Expense Tracker</h1>
        <p className="welcome-subtitle">
          Take control of your finances — track your income, expenses, and savings effortlessly.
        </p>
        <div className="welcome-buttons">
          <button className="btn primary" onClick={() => navigate("/SignIn")}>
            Get Started
          </button>
          {/* ✅ Link to About Page */}
          <button className="btn secondary" onClick={() => navigate("/About")}>
            About
          </button>
        </div>
      </div>
      <div className="bg-overlay"></div>
    </div>
  );
};

export default WelcomePage;
