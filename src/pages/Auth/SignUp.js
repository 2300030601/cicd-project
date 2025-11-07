import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Send signup data to backend
      const response = await axios.post("http://localhost:8080/api/users/register", {
        name,
        email,
        password,
      });

      console.log("✅ Registered successfully:", response.data);

      // ✅ Also save in localStorage (to keep your app logic working)
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push(response.data);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Account created successfully! You can now sign in.");
      navigate("/signin");
    } catch (error) {
      console.error("❌ Registration failed:", error);
      alert("Failed to register user. Check your backend connection.");
    }
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
