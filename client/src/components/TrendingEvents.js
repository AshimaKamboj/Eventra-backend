import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./../style.css";

function TrendingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch events from backend
  useEffect(() => {
    axios
      .get("/api/events")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading trending events...</h2>;
  if (events.length === 0) return <h2>No events available</h2>;

  return (
    <section className="trending-section">
      <h2 className="section-title">🔥 Trending Events Near You</h2>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <img src={event.image} alt={event.title} className="event-img" />
            <div className="event-info">
              <h3>{event.title}</h3>
              <p>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p>📍 {event.location?.city || "Unknown"}</p>
              {/* ✅ Dynamic link to EventDetails */}
              <Link to={`/event/${event._id}`}>
                <button className="event-btn">Book Now</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrendingEvents;
