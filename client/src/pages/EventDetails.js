import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./../style.css";

function EventDetails() {
  const { id } = useParams(); // get event ID from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event by ID from backend
  useEffect(() => {
    axios
      .get(`/api/events/${id}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching event:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h2>⏳ Loading event details...</h2>;
  }

  if (!event) {
    return <h2>❌ Event not found</h2>;
  }

  return (
    <div className="event-details">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back to Events
      </button>

      <div className="event-header">
        <img src={event.image} alt={event.title} className="event-banner" />
        <h1>{event.title}</h1>
        <p>
          📅 {new Date(event.date).toLocaleDateString()} | 📍{" "}
          {event.location?.city}
        </p>
        <p>👥 {event.attendees || "N/A"} going</p>
      </div>

      <div className="event-body">
        <h2>📖 Description</h2>
        <p>{event.description}</p>

        <h2>📍 Location</h2>
        <p>
          {event.location?.venue}, {event.location?.address},{" "}
          {event.location?.city}
        </p>

        <h2>💰 Tickets</h2>
        <ul>
          {event.tickets?.map((ticket, idx) => (
            <li key={idx}>
              {ticket.type} - ${ticket.price} ({ticket.available} available)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventDetails;
