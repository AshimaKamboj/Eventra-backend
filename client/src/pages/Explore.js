// src/pages/Explore.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style.css";
function Explore() {
  // Static/demo events
  const demoEvents = [
    {
      id: "static-1",
      title: "Coldplay Live Concert",
      date: "Sep 10, 2025",
      location: "Mumbai, India",
      image: "https://www.sganalytics.com/wp-content/uploads/2024/12/0958a-coldplay-concert-in-india.jpg",
    },
    {
      id: "static-2",
      title: "Tech Conference 2025",
      date: "Oct 2, 2025",
      location: "Bangalore, India",
      image: "https://images.stockcake.com/public/2/9/2/292f8e62-8891-41bb-9d82-cf81027244bf_large/tech-conference-speech-stockcake.jpg",
    },
    {
      id: "static-3",
      title: "Food Carnival",
      date: "Sep 18, 2025",
      location: "Delhi, India",
      image: "https://c8.alamy.com/comp/E6G8JN/state-fair-food-concessions-E6G8JN.jpg",
    },
    {
      id: "static-4",
      title: "Art & Culture Fest",
      date: "Nov 5, 2025",
      location: "Goa, India",
      image: "https://img2.chinadaily.com.cn/images/201911/04/5dbf7da3a310cf3e97a4200f.jpeg",
    },
    {
      id: "static-5",
      title: "Avengers Movie Premiere",
      date: "Sep 25, 2025",
      location: "PVR Cinemas, Hyderabad",
      image: "https://i.pinimg.com/originals/66/1a/46/661a4665ba5206df10782b1d6131b606.jpg",
    },
    {
      id: "static-6",
      title: "Fashion Week 2025",
      date: "Dec 12, 2025",
      location: "Delhi, India",
      image: "https://www.azafashions.com/blog/wp-content/uploads/2025/02/Paris-Fashion-Week-2025-Featured-Image.jpg",
    },
  ];

  const [dbEvents, setDbEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // placeholder state (no organizer controls on this page)
  // no organizer controls on this page

  // Fetch events from backend
  useEffect(() => {
    axios
      .get("/api/events")
      .then((res) => {
        setDbEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>⏳ Loading events...</h2>;

  // Merge static + db events
  const allEvents = [...demoEvents, ...dbEvents];

  return (
    <section className="explore-page">
      <h1 className="section-title">Discover Events</h1>

      <div className="event-filter">
        <input type="text" placeholder="Search events..." />
      </div>

      <div className="events-grid">
        {allEvents.map((event) => (
          <div key={event._id || event.id} className="event-card">
            <img src={event.image} alt={event.title} className="event-img" />
            <div className="event-info">
              <h3>{event.title}</h3>
              <p>
                📅{" "}
                {event.date
                  ? new Date(event.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : event.date}
                {" • "}📍 {event.location?.city || event.location}
              </p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Link to={`/event/${event._id || event.id}`}>
                  <button className="event-btn">View Details</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Explore;
