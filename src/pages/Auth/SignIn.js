import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { setLoggedInUser } from "../../UserDataManager";
const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Simulate a successful login
    alert("Login successful! (demo)");

    // 🧠 Save user info in localStorage (so all pages can access it)
    const userData = {
      id: Date.now(), // unique fake ID (for demo purpose)
      name: email.split("@")[0], // username part
      email: email,
      joined: "March 2024",
      plan: "Premium",
      balance: 10000, // optional: demo balance
      transactions: [], // demo array for future use
    };

    localStorage.setItem("user", JSON.stringify(userData));

    // Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">
          Welcome back! Please login to your account.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot-password">
            <span onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
