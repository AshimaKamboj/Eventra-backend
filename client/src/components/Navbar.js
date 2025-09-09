// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./../style.css";

function Navbar({ sessionUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // optional clear
    sessionUser.setUser(null);       // clear session
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <img src="/logo.ico" alt="Eventra Logo" className="logo-img" />
          <span className="logo-text">Eventra</span>
        </Link>
      </div>

      <div className="nav-center">
        <Link to="/explore">Explore</Link>
        <Link to="/create-event">Create Event</Link>
        <Link to="/venues">Venues</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/support">Support</Link>
      </div>

      <div className="nav-right">
        {sessionUser.user ? (
          <>
            <Link to="/profile">
              {sessionUser.user.photo && sessionUser.user.photo.trim() !== "" ? (
                <img
                  src={sessionUser.user.photo}
                  alt="Profile"
                  className="nav-profile-icon"
                />
              ) : (
                <FaUserCircle className="nav-profile-icon" />
              )}
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/signup">
              <button className="signup-btn">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
