import React from "react";
import { Link } from "react-router-dom";
import "./../style.css";

function Hero() {
  return (
    <section className="hero">
      <p className="hero-tag">✨ Discover Amazing Events ✨</p>
      <h1 className="hero-title">
        Find Your Next <span>Amazing Experience</span>
      </h1>
      <p className="hero-subtitle">
        From concerts to conferences, workshops to festivals — discover, create, 
        and book incredible events that inspire and connect.
      </p>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="🔍 What are you looking for?" />
        <input type="date" />
        <input type="text" placeholder="📍 City or venue" />
        <button className="btn search-btn">Search Events</button>
      </div>

      {/* Buttons below search */}
      <div className="hero-buttons">
        <Link to="/explore" className="btn-outline">🎫 Explore Events</Link>
        <Link to="/create-event" className="btn-outline">➕ Create Event</Link>
      </div>
    </section>
  );
}

export default Hero;
