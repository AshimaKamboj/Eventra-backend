// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./../style.css";

function Login({ sessionUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("signupUser"));

    if (savedUser && savedUser.email === form.email && savedUser.password === form.password) {
      const loggedInUser = {
        name: savedUser.name,
        email: savedUser.email,
        role: "Member",
        photo: "" // default icon
      };
      localStorage.setItem("user", JSON.stringify(loggedInUser)); // optional persistence
      sessionUser.setUser(loggedInUser); // set session for navbar
      navigate("/"); // redirect to homepage
    } else {
      alert("Invalid credentials.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Eventra</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" className="auth-input" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="auth-input" value={form.password} onChange={handleChange} required />
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p className="auth-link">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
