// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./../style.css";

function Profile() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // redirect to login if not logged in
  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
    }
  }, [auth.user, navigate]);

  // fetch bookings for normal users
  useEffect(() => {
    if (auth.user?.role === "user") {
      axios
        .get("/api/bookings/my", {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((res) => {
          setBookings(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching bookings:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [auth]);

  if (!auth.user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={
            auth.user.photo ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="Profile"
          className="profile-avatar"
        />
        <div>
          <h2>{auth.user.name}</h2>
          <p>{auth.user.email}</p>
          <p>Role: {auth.user.role}</p>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {auth.user.role === "user" && (
        <div className="profile-section">
          <h3>🎟 My Bookings</h3>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length > 0 ? (
            <ul className="booking-list">
              {bookings.map((b) => (
                <li key={b._id} className="booking-card">
                  <img
                    src={b.event.image}
                    alt={b.event.title}
                    className="booking-img"
                  />
                  <div>
                    <h4>{b.event.title}</h4>
                    <p>
                      📅 {new Date(b.event.date).toLocaleDateString()} | 📍{" "}
                      {b.event.location.city}
                    </p>
                    <p>Ticket: {b.ticketType}</p>
                    <img
                      src={b.qrCode}
                      alt="QR"
                      className="qr-small"
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet.</p>
          )}
        </div>
      )}

      {auth.user.role === "organizer" && (
        <div className="profile-section">
          <h3>📢 Organizer Dashboard</h3>
          <p>
            As an organizer, you can create events and check attendees from the
            events page.
          </p>
          <button
            className="event-btn"
            onClick={() => navigate("/create-event")}
          >
            ➕ Create Event
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
