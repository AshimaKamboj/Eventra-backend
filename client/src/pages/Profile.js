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
  const [myEvents, setMyEvents] = useState([]);
  const [attendees, setAttendees] = useState({});
  const [stats, setStats] = useState({ totalEvents: 0, totalAttendees: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user) navigate("/login");
  }, [auth.user, navigate]);

  // Fetch bookings for users
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
        .catch(() => setLoading(false));
    }
  }, [auth]);

  // Fetch organizer’s events and stats
  useEffect(() => {
    if (auth.user?.role === "organizer") {
      axios
        .get("/api/events", {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then(async (res) => {
          const mine = res.data.filter((e) => e.organizer?._id === auth.user._id);
          setMyEvents(mine);

          // fetch attendees for stats
          let totalAttendees = 0;
          let revenue = 0;

          for (const event of mine) {
            const res2 = await axios.get(`/api/bookings/event/${event._id}`, {
              headers: { Authorization: `Bearer ${auth.token}` },
            });
            totalAttendees += res2.data.length;
            revenue += res2.data.length * (event.tickets?.[0]?.price || 0);
          }

          setStats({ totalEvents: mine.length, totalAttendees, revenue });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [auth]);

  const fetchAttendees = async (eventId) => {
    try {
      const res = await axios.get(`/api/bookings/event/${eventId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setAttendees((prev) => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      console.error("Error fetching attendees:", err);
    }
  };

  if (!auth.user) return null;

  return (
    <div className="profile-page">
      {/* Header */}
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
          <span className="role-badge">
            {auth.user.role === "organizer" ? "Event Organizer" : "Attendee"}
          </span>
        </div>
        <button className="logout-btn" onClick={logout}>
          ⎋ Logout
        </button>
      </div>

      {/* User Bookings */}
      {auth.user.role === "user" && (
        <div className="profile-section">
          <h3>🎟 My Bookings</h3>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length > 0 ? (
            <ul className="booking-list">
              {bookings.map((b) => (
                <li key={b._id} className="booking-card">
                  <img src={b.event.image} alt={b.event.title} className="booking-img" />
                  <div>
                    <h4>{b.event.title}</h4>
                    <p>
                      📅 {new Date(b.event.date).toLocaleDateString()} | 📍{" "}
                      {b.event.location.city}
                    </p>
                    <p>Ticket: {b.ticketType}</p>
                    <img src={b.qrCode} alt="QR" className="qr-small" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet.</p>
          )}
        </div>
      )}

      {/* Organizer Dashboard */}
      {auth.user.role === "organizer" && (
        <div className="profile-section">
          <h3>📊 Organizer Dashboard</h3>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card green">
              <h2>{stats.totalEvents}</h2>
              <p>Total Events</p>
            </div>
            <div className="stat-card purple">
              <h2>{stats.totalAttendees}</h2>
              <p>Total Attendees</p>
            </div>
            <div className="stat-card orange">
              <h2>${stats.revenue}</h2>
              <p>Revenue</p>
            </div>
          </div>

          <button className="event-btn" onClick={() => navigate("/create-event")}>
            ➕ Create Event
          </button>

          <h3 className="mt-4">📋 My Events</h3>
          {myEvents.length === 0 ? (
            <p>You haven’t created any events yet.</p>
          ) : (
            myEvents.map((event) => (
              <div key={event._id} className="event-card-small">
                <h4>{event.title}</h4>
                <p>
                  📅 {new Date(event.date).toLocaleDateString()} | 📍{" "}
                  {event.location.city}
                </p>
                <button
                  className="small-btn"
                  onClick={() => fetchAttendees(event._id)}
                >
                  👥 View Attendees
                </button>

                {attendees[event._id] && (
                  <ul className="attendee-list">
                    {attendees[event._id].length > 0 ? (
                      attendees[event._id].map((a) => (
                        <li key={a._id} className="attendee-card">
                          {a.user.name} ({a.user.email}) — 🎟 {a.ticketType}
                        </li>
                      ))
                    ) : (
                      <li>No attendees yet</li>
                    )}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
