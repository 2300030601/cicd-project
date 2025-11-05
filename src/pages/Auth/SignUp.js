import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Fetch existing users from localStorage or create empty array
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ❌ Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      alert("An account with this email already exists!");
      return;
    }

    // ✅ Create new user object
    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // NOTE: Plain text for demo only
      joined: new Date().toLocaleDateString(),
      plan: "Free",
      balance: 0,
      transactions: [],
    };

    // ✅ Save new user in users array and store back
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully! You can now sign in.");
    navigate("/signin");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <p className="auth-subtitle">
          Create your account and start managing your expenses easily.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button type="submit">Create Account</button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/signin")}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
