import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import StarRating from "../components/StarRating";
import EventLocationMap from "../components/EventLocationMap";
import "./../style.css";

function EventDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { auth } = useAuth();

  const [event, setEvent] = useState(null);

  const [loading, setLoading] = useState(true);

  const [booking, setBooking] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewStats, setReviewStats] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [ticketQuantities, setTicketQuantities] = useState({});

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
  }, [id]); // Handle ticket booking

  const handleBook = async (ticketType = "General", quantity = 1) => {
    if (quantity < 1) {
      alert('Please select at least 1 ticket');
      return;
    }
    try {
      // 1) create booking
      const res = await axios.post(
        `/api/bookings/${id}`,
        { ticketType, quantity },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      const newBooking = res.data.booking;
      setBooking(newBooking);

      // 2) create payment link for this booking and immediately redirect
      try {
        const payRes = await fetch(`/api/payment/${newBooking._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const payData = await payRes.json();
        if (payRes.ok && payData.payment_link_url) {
          // redirect user to Razorpay payment page
          window.location.href = payData.payment_link_url;
        } else {
          // Inform user and keep them on page so they can retry
          alert(payData.message || 'Failed to create payment link.');
        }
      } catch (err) {
        console.error('Payment link creation failed', err);
        alert('Failed to initiate payment. Please try again.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      const msg = err.response?.data?.message || '❌ Error booking ticket';
      // If user already booked, show a popup instead of an alert
      if (msg.toLowerCase().includes('already booked') || msg.toLowerCase().includes('already booked this event') || msg.toLowerCase().includes('you already booked')) {
        setPopup({ show: true, message: msg });
      } else {
        alert(msg);
      }
    }
  };

  if (loading) return <h2>⏳ Loading event details...</h2>;

  if (!event) return <h2>❌ Event not found</h2>;

  return (
    <div className="event-details">
       {/* Left: Banner */} {" "}
      <div className="event-banner-container">
        <img src={event.image} alt={event.title} className="event-banner" /> {" "}
      </div>
       {/* Right: Content */} {" "}
      <div className="event-content">
        <button onClick={() => navigate(-1)} className="btn colorful-button">
          ⬅ Back
        </button>
        <div className="event-card-large">
          <div className="event-info-block">
            <h1 className="event-title">{event.title}</h1>

            <p className="event-meta">
              📅 {new Date(event.date).toLocaleDateString()} | 📍{" "}
              {event.location?.city}
            </p>

            <p className="event-attendees">
              👥 {event.attendees || "N/A"} going
            </p>

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

              {event.location?.coordinates?.lat && event.location?.coordinates?.lng && (
                <EventLocationMap
                  latitude={event.location.coordinates.lat}
                  longitude={event.location.coordinates.lng}
                  title={event.title}
                  address={event.location.address}
                  city={event.location.city}
                />
              )}
            </div>

            <div className="event-section">
              <h2>💰 Tickets</h2>

              <ul className="ticket-list">
                {event.tickets?.map((ticket, idx) => (
                  <li key={idx} className="ticket-item">
                    <div className="ticket-left">
                      {ticket.type} - ${ticket.price} ({ticket.available} left)
                    </div>

                    {ticket.available > 0 && (
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        {auth.user?.role === "user" && (
                          <>
                            <label style={{ fontSize: '14px', fontWeight: '500' }}>
                              Quantity:
                              <input
                                type="number"
                                min="1"
                                max={ticket.available}
                                value={ticketQuantities[ticket.type] || 1}
                                onChange={(e) => setTicketQuantities({
                                  ...ticketQuantities,
                                  [ticket.type]: parseInt(e.target.value) || 1
                                })}
                                style={{
                                  width: '60px',
                                  marginLeft: '8px',
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '14px'
                                }}
                              />
                            </label>
                            <button
                              className="btn colorful-button"
                              onClick={() => handleBook(ticket.type, ticketQuantities[ticket.type] || 1)}
                            >
                              🎟 Book {ticket.type}
                            </button>
                          </>
                        )}

                        {!auth.user && (
                          <button
                            className="btn colorful-button"
                            onClick={() => navigate('/login')}
                          >
                            🎟 Book {ticket.type}
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div> 

            {/* ✅ Show booked QR only after payment confirmation */}
            {booking && (booking.paymentDetails?.status === 'Paid' || booking.status === 'Confirmed') && (
              <div className="ticket-preview">
                <h3> Your Ticket</h3>

                <img src={booking.qrCode} alt="Ticket QR" className="qr-img" />
              </div>
            )}

            {/* Reviews Section */}
            <div className="event-section">
              <div className="reviews-header">
                <h2>⭐ Reviews & Ratings</h2>
                {reviewStats && (
                  <div className="review-summary">
                    <div className="rating-display">
                      <span className="rating-number">{reviewStats.averageRating?.toFixed(1) || '0.0'}</span>
                      <StarRating rating={reviewStats.averageRating || 0} readOnly={true} size="large" />
                      <span className="review-count">({reviewStats.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Write Review Button */}
              {auth.user && (
                <div className="review-actions">
                  {userReview ? (
                    <button
                      className="btn-outline"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      {showReviewForm ? 'Cancel Edit' : 'Edit Your Review'}
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      Write a Review
                    </button>
                  )}
                </div>
              )}

              {/* Review Form */}
              {showReviewForm && auth.user && (
                <div className="review-form-container">
                  <ReviewForm
                    reviewType="event"
                    itemId={id}
                    existingReview={userReview}
                    onReviewSubmitted={(review) => {
                      setUserReview(review);
                      setShowReviewForm(false);
                    }}
                  />
                </div>
              )}

              {/* Reviews List */}
              <ReviewList
                reviewType="event"
                itemId={id}
                onReviewStats={setReviewStats}
              />
            </div>


          </div>
        </div>
        {" "}
      </div>
      {" "}
      {/* Simple popup for messages like 'already booked' */}
      {popup.show && (
        <div style={{ position: 'fixed', right: 20, top: 20, zIndex: 1200 }}>
          <div style={{ background: '#fff', border: '1px solid #ddd', padding: 16, borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>{popup.message}</p>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setPopup({ show: false, message: '' })}>Close</button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}

export default EventDetails;

