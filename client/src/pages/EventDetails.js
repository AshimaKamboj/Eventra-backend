import React from "react";
import { useParams } from "react-router-dom";
import "./../style.css";

const events = [
  {
    id: 1,
    title: "Coldplay Live Concert",
    date: "Sep 10, 2025",
    location: "Mumbai, India",
    image:
      "https://www.sganalytics.com/wp-content/uploads/2024/12/0958a-coldplay-concert-in-india.jpg",
    organizer: "LiveNation India",
    attendees: "5000 going",
    schedule: [
      { time: "6:00 PM", activity: "Gates Open" },
      { time: "7:00 PM", activity: "Opening Act" },
      { time: "8:30 PM", activity: "Coldplay Live Performance" },
      { time: "10:30 PM", activity: "Closing Fireworks" },
    ],
    tickets: [
      { type: "VIP", price: 250, available: 50 },
      { type: "Gold", price: 150, available: 200 },
      { type: "Silver", price: 100, available: 500 },
    ],
  },
    {
    id: 2,
    title: "Tech Conference 2025",
    date: "Oct 2, 2025",
    location: "Bangalore, India",
    image:
      "https://images.stockcake.com/public/2/9/2/292f8e62-8891-41bb-9d82-cf81027244bf_large/tech-conference-speech-stockcake.jpg",
    organizer: "TechWorld Co.",
    attendees: "1200 going",
    schedule: [
      { time: "9:00 AM", activity: "Keynote Speech" },
      { time: "11:00 AM", activity: "AI & ML Session" },
      { time: "1:00 PM", activity: "Lunch Break" },
      { time: "2:00 PM", activity: "Cloud Computing Panel" },
      { time: "5:00 PM", activity: "Networking Session" },
    ],
    tickets: [
      { type: "Standard", price: 80, available: 300 },
      { type: "Premium", price: 150, available: 150 },
      { type: "Student", price: 40, available: 200 },
    ],
  },
  {
    id: 3,
    title: "Food Carnival",
    date: "Sep 18, 2025",
    location: "Delhi, India",
    image: "https://c8.alamy.com/comp/E6G8JN/state-fair-food-concessions-E6G8JN.jpg",
    organizer: "Delhi Foodies Club",
    attendees: "3000 going",
    schedule: [
      { time: "12:00 PM", activity: "Carnival Opens" },
      { time: "2:00 PM", activity: "Live Cooking Show" },
      { time: "4:00 PM", activity: "Street Food Contest" },
      { time: "6:00 PM", activity: "Food & Music Night" },
    ],
    tickets: [
      { type: "General Entry", price: 20, available: 1000 },
      { type: "VIP Entry", price: 50, available: 200 },
    ],
  },
  {
    id: 4,
    title: "Art & Culture Fest",
    date: "Nov 5, 2025",
    location: "Goa, India",
    image:
      "https://img2.chinadaily.com.cn/images/201911/04/5dbf7da3a310cf3e97a4200f.jpeg",
    organizer: "Goa Arts Council",
    attendees: "2000 going",
    schedule: [
      { time: "10:00 AM", activity: "Exhibition Opening" },
      { time: "1:00 PM", activity: "Cultural Dance Performance" },
      { time: "3:00 PM", activity: "Art Workshop" },
      { time: "6:00 PM", activity: "Live Music Evening" },
    ],
    tickets: [
      { type: "One-Day Pass", price: 30, available: 500 },
      { type: "Full Event Pass", price: 70, available: 300 },
    ],
  },
  {
    id: 5,
    title: "Avengers Movie Premiere",
    date: "Sep 25, 2025",
    location: "PVR Cinemas, Hyderabad",
    image:
      "https://i.pinimg.com/originals/66/1a/46/661a4665ba5206df10782b1d6131b606.jpg",
    organizer: "Marvel Studios",
    attendees: "800 going",
    schedule: [
      { time: "6:30 PM", activity: "Red Carpet Entry" },
      { time: "7:30 PM", activity: "Movie Screening" },
      { time: "10:30 PM", activity: "Fan Meet & Greet" },
    ],
    tickets: [
      { type: "Platinum", price: 500, available: 50 },
      { type: "Gold", price: 300, available: 100 },
      { type: "Regular", price: 150, available: 200 },
    ],
  },
  {
    id: 6,
    title: "Fashion Week 2025",
    date: "Dec 12, 2025",
    location: "Delhi, India",
    image:
      "https://www.azafashions.com/blog/wp-content/uploads/2025/02/Paris-Fashion-Week-2025-Featured-Image.jpg",
    organizer: "Delhi Fashion Council",
    attendees: "1500 going",
    schedule: [
      { time: "2:00 PM", activity: "Designer Showcase" },
      { time: "4:00 PM", activity: "Runway Show" },
      { time: "6:00 PM", activity: "Fashion Awards" },
      { time: "8:00 PM", activity: "Closing Gala" },
    ],
    tickets: [
      { type: "Front Row", price: 400, available: 50 },
      { type: "VIP", price: 250, available: 100 },
      { type: "Standard", price: 120, available: 300 },
    ],
  },
];


function EventDetails() {
  const { id } = useParams();
  const event = events.find((e) => e.id === parseInt(id));

  if (!event) {
    return <h2>Event not found</h2>;
  }

  return (
    <div className="event-details">
      <button onClick={() => window.history.back()} className="back-btn">
        ← Back to Events
      </button>

      <div className="event-header">
        <img src={event.image} alt={event.title} className="event-banner" />
        <h1>{event.title}</h1>
        <p>
          📅 {event.date} | 📍 {event.location}
        </p>
        <p>👥 {event.attendees}</p>
      </div>

      <div className="event-body">
        <h2>Schedule</h2>
        <ul>
          {event.schedule.map((item, idx) => (
            <li key={idx}>
              <b>{item.time}</b> - {item.activity}
            </li>
          ))}
        </ul>

        <h2>Tickets</h2>
        <ul>
          {event.tickets.map((ticket, idx) => (
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
