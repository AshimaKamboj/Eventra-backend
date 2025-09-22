import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style.css";

function Venues() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get("/api/venues");
      setVenues(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setError("Failed to load venues");
      setLoading(false);
    }
  };

  // fallback placeholder if image fails
  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";

  if (loading) {
    return (
      <section className="venues-section">
        <h2 className="section-title">🏛 Popular Venues</h2>
        <div className="loading">Loading venues...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="venues-section">
        <h2 className="section-title">🏛 Popular Venues</h2>
        <div className="error">{error}</div>
      </section>
    );
  }

  return (
    <section className="venues-section">
      <h2 className="section-title">🏛 Popular Venues</h2>
      <div className="venues-grid">
        {venues.map((venue) => (
          <div key={venue._id} className="venue-card">
            <img
              src={venue.images && venue.images[0] ? venue.images[0] : placeholder}
              alt={venue.name}
              className="venue-img"
              onError={(e) => {
                e.currentTarget.src = placeholder;
              }}
            />
            <div className="venue-info">
              <h3>{venue.name}</h3>
              <p>{venue.location.address}, {venue.location.city}</p>
              <p>
                <strong>Capacity:</strong> {venue.capacity.min} - {venue.capacity.max} Guests
              </p>
              <p className="venue-description">{venue.description}</p>
              <div className="venue-amenities">
                {venue.amenities && venue.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="amenity-tag">{amenity}</span>
                ))}
              </div>
              <button
                className="venue-btn"
                onClick={() => navigate(`/venues/${venue._id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Venues;

