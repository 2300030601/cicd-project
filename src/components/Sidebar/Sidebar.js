// ✅ Developed by Teammate 2 - UI & Navigation (Theme-Responsive Sidebar)
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { SettingsContext } from "../../context/SettingsContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Theme-aware
  const { settings } = useContext(SettingsContext);
  const theme = settings.theme || "dark";

  const [showDetails, setShowDetails] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    joined: "",
    plan: "",
  });

  const isActive = (path) =>
    location.pathname === path ? "menu-item active" : "menu-item";

  // ✅ Load user info
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email) {
      setUser({
        name: storedUser.name || "User",
        email: storedUser.email,
        joined:
          storedUser.joined ||
          new Date(storedUser.id || Date.now()).toLocaleDateString(),
        plan: storedUser.plan || "Free",
      });
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  // ✅ Update sidebar theme dynamically (no refresh needed)
  useEffect(() => {
    document.querySelector(".sidebar")?.classList.remove("light", "dark");
    document.querySelector(".sidebar")?.classList.add(theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${theme}`}>
        <div className="sidebar-top">
          <h2 className="sidebar-logo">Expense Tracker</h2>

          <div className="sidebar-menu">
            <p className="menu-title">NAVIGATION</p>
            <Link to="/dashboard" className={isActive("/dashboard")}>
              Dashboard
            </Link>
            <Link
              to="/add-transaction"
              className={isActive("/add-transaction")}
            >
              Add Transaction
            </Link>
            <Link to="/view-history" className={isActive("/view-history")}>
              View History
            </Link>
            <Link to="/budget-planner" className={isActive("/budget-planner")}>
              Budget Planner
            </Link>
            <Link to="/data-management" className={isActive("/data-management")}>
              Reports
            </Link>
            <Link to="/investments" className={isActive("/investments")}>
              Investments
            </Link>
            <Link to="/debt-goals" className={isActive("/debt-goals")}>
              Debt & Goals
            </Link>
            <Link to="/categories" className={isActive("/categories")}>
              Categories
            </Link>
            <Link to="/settings" className={isActive("/settings")}>
              Settings
            </Link>
          </div>
        </div>

        <div className="sidebar-footer">
          <p className="user-name clickable" onClick={() => setShowDetails(true)}>
            {user.name || "Guest User"}
          </p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {showDetails && (
        <div className="blur-overlay" onClick={() => setShowDetails(false)} />
      )}

      {/* User Details Popup */}
      {showDetails && (
        <div className="user-details-popup">
          <h3>👤 User Details</h3>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Joined:</strong> {user.joined}
          </p>
          <p>
            <strong>Plan:</strong> {user.plan}
          </p>

          <button className="close-btn" onClick={() => setShowDetails(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
