import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Call backend to verify login
      const response = await axios.post("http://localhost:8080/api/users/login", {
        email,
        password,
      });

      // ✅ Backend returns user if login success
      if (response.data && response.data.id) {
        console.log("✅ Logged in user:", response.data);

        // Save in localStorage so the frontend context works
        localStorage.setItem("user", JSON.stringify(response.data));

        alert(`Welcome back, ${response.data.name}!`);
        navigate("/dashboard");
      } else {
        alert("Invalid email or password!");
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
      alert("Login failed. Please check your credentials or server.");
    }
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
