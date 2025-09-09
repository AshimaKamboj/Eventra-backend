import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./../style.css";

function TrendingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("/api/events") // ✅ Will hit backend (proxy must be set in client/package.json)
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
      });
  }, []);

  return (
    <section className="trending-section">
      <h2 className="section-title">🔥 Trending Events Near You</h2>
      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <img
                src={event.image || "https://via.placeholder.com/300"} // fallback image
                alt={event.title}
                className="event-img"
              />
              <div className="event-info">
                <h3>{event.title}</h3>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.location?.city || "Location not set"}</p>

                {/* ✅ Link to Event Details Page */}
                <Link to={`/event/${event._id}`}>
                  <button className="event-btn">Book Now</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No trending events available right now.</p>
        )}
      </div>
    </section>
  );
}

export default TrendingEvents;
