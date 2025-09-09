import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link
import "./../style.css";

function TrendingEvents() {
  const events = [
    {
      id: 1,
      title: "Coldplay Live Concert",
      date: "Sep 10, 2025",
      location: "Mumbai, India",
      image:
        "https://www.sganalytics.com/wp-content/uploads/2024/12/0958a-coldplay-concert-in-india.jpg",
    },
    {
      id: 2,
      title: "Tech Conference 2025",
      date: "Oct 2, 2025",
      location: "Bangalore, India",
      image:
        "https://images.stockcake.com/public/2/9/2/292f8e62-8891-41bb-9d82-cf81027244bf_large/tech-conference-speech-stockcake.jpg",
    },
    {
      id: 3,
      title: "Food Carnival",
      date: "Sep 18, 2025",
      location: "Delhi, India",
      image: "https://c8.alamy.com/comp/E6G8JN/state-fair-food-concessions-E6G8JN.jpg",
    },
    {
      id: 4,
      title: "Art & Culture Fest",
      date: "Nov 5, 2025",
      location: "Goa, India",
      image:
        "https://img2.chinadaily.com.cn/images/201911/04/5dbf7da3a310cf3e97a4200f.jpeg",
    },
    {
      id: 5,
      title: "Avengers Movie Premiere",
      date: "Sep 25, 2025",
      location: "PVR Cinemas, Hyderabad",
      image:
        "https://i.pinimg.com/originals/66/1a/46/661a4665ba5206df10782b1d6131b606.jpg",
    },
    {
      id: 6,
      title: "Fashion Week 2025",
      date: "Dec 12, 2025",
      location: "Delhi, India",
      image:
        "https://www.azafashions.com/blog/wp-content/uploads/2025/02/Paris-Fashion-Week-2025-Featured-Image.jpg",
    },
  ];

  return (
    <section className="trending-section">
      <h2 className="section-title">🔥 Trending Events Near You</h2>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <img src={event.image} alt={event.title} className="event-img" />
            <div className="event-info">
              <h3>{event.title}</h3>
              <p>{event.date}</p>
              <p>{event.location}</p>
              {/* ✅ Link to Event Details Page */}
              <Link to={`/event/${event.id}`}>
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
