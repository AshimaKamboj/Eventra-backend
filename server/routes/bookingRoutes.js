// server/routes/bookingRoutes.js
const express = require("express");
const axios = require("axios");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 POST: Book a ticket
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { ticketType } = req.body;
    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Find ticket type
    const ticket = event.tickets.find(t => t.type === ticketType);
    if (!ticket) return res.status(400).json({ message: "Invalid ticket type" });

    // Prevent overbooking
    if (ticket.available <= 0) {
      return res.status(400).json({ message: "No tickets available" });
    }

    // Reduce availability
    ticket.available -= 1;
    await event.save();

    // Generate QR Code using GoQR API
    const qrData = `Event: ${event.title}, User: ${req.user.id}, Ticket: ${ticketType}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

    // Save booking
    const booking = new Booking({
      user: req.user.id,
      event: event._id,
      ticketType,
      qrCode: qrUrl,
    });

    await booking.save();

    res.json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 GET: My bookings
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("event");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 GET: Attendees for an event (organizer only)
router.get("/event/:eventId", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ event: req.params.eventId }).populate("user", "name email");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
