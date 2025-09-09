import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./../style.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch event details from backend
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

  if (loading) return <h2>Loading event...</h2>;
  if (!event) return <h2>❌ Event not found</h2>;

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
          {event.location?.city}, {event.location?.venue}
        </p>
        <p>👥 Capacity: {event.capacity || "Not specified"}</p>
      </div>

      <div className="event-body">
        <h2>Description</h2>
        <p>{event.description}</p>

        <h2>Tickets</h2>
        {event.tickets && event.tickets.length > 0 ? (
          <ul>
            {event.tickets.map((ticket, idx) => (
              <li key={idx}>
                {ticket.type} - {event.currency || "$"} {ticket.price} (
                {ticket.available} available)
              </li>
            ))}
          </ul>
        ) : (
          <p>No tickets listed</p>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
