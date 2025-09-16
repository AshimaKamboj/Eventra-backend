// src/pages/EventDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import "./../style.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  // Fetch event by ID
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

  // Convert image URL → Base64 for PDF
  const getBase64FromUrl = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  // Handle ticket booking
  const handleBook = async (ticketType = "General") => {
  try {
    const res = await axios.post(
      `/api/bookings/${id}`,
      { ticketType },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );

    // ✅ Correct: backend sends { booking }
    setBooking(res.data.booking);
    alert("🎉 Ticket booked successfully!");

    // Generate PDF Ticket
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("🎟 Eventra Ticket", 20, 20);
    doc.setFontSize(12);
    doc.text(`Event: ${event.title}`, 20, 40);
    doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`, 20, 55);
    doc.text(`Venue: ${event.location?.venue}, ${event.location?.city}`, 20, 70);

    // QR Code
    const qrBase64 = res.data.booking.qrCode;
    doc.addImage(qrBase64, "PNG", 20, 90, 100, 100);

    doc.save("ticket.pdf");
  } catch (err) {
    console.error("Booking error:", err);
    alert(err.response?.data?.message || "❌ Error booking ticket");
  }
};

  //     // QR Code
  //     const qrBase64 = await getBase64FromUrl(res.data.booking.qrCode);
  //     doc.addImage(qrBase64, "PNG", 20, 90, 100, 100);

  //     doc.save("ticket.pdf");
  //   } catch (err) {
  //     console.error("Booking error:", err);
  //     alert(err.response?.data?.message || "❌ Error booking ticket");
  //   }
  // };

  if (loading) return <h2>⏳ Loading event details...</h2>;
  if (!event) return <h2>❌ Event not found</h2>;

  return (
    <div className="event-details">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="event-card-large">
        <img src={event.image} alt={event.title} className="event-banner" />

        <div className="event-info-block">
          <h1 className="event-title">{event.title}</h1>
          <p className="event-meta">
            📅 {new Date(event.date).toLocaleDateString()} | 📍{" "}
            {event.location?.city}
          </p>
          <p className="event-attendees">👥 {event.attendees || "N/A"} going</p>

          <div className="event-section">
            <h2>📖 Description</h2>
            <p>{event.description}</p>
          </div>

          <div className="event-section">
            <h2>📍 Location</h2>
            <p>
              {event.location?.venue}, {event.location?.address},{" "}
              {event.location?.city}
            </p>
          </div>

          <div className="event-section">
            <h2>💰 Tickets</h2>
            <ul className="ticket-list">
              {event.tickets?.map((ticket, idx) => (
                <li key={idx} className="ticket-item">
                  {ticket.type} - ${ticket.price} ({ticket.available} left)
                  {auth.user?.role === "user" && ticket.available > 0 && (
                    <button
                      className="small-book-btn"
                      onClick={() => handleBook(ticket.type)}
                    >
                      Book {ticket.type}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Show booked QR */}
          {booking && (
            <div className="ticket-preview">
              <h3> Your Ticket</h3>
              <img src={booking.qrCode} alt="Ticket QR" className="qr-img" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
