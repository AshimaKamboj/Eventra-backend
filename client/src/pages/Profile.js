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
  const [loading, setLoading] = useState(true);

  // redirect if not logged in
  useEffect(() => {
    if (!auth.user) navigate("/login");
  }, [auth.user, navigate]);

  // fetch bookings for users
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

  // fetch organizer's events
  useEffect(() => {
    if (auth.user?.role === "organizer") {
      axios
        .get("/api/events", {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((res) => {
          // filter events created by this organizer
          const mine = res.data.filter(
            (event) => event.organizer?._id === auth.user._id
          );
          setMyEvents(mine);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [auth]);

  // fetch attendees for a specific event
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

      {/* Normal User Bookings */}
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
          <h3>📢 Organizer Dashboard</h3>
          <button
            className="event-btn"
            onClick={() => navigate("/create-event")}
          >
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
