const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const axios = require("axios");

// ✅ Book Ticket
router.post("/:eventId", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Prevent overbooking
    const totalBooked = await Booking.countDocuments({ event: event._id });
    if (totalBooked >= event.tickets[0].available) {
      return res.status(400).json({ message: "Tickets sold out!" });
    }

    // Generate QR code with GoQR API
    const qrData = `Event: ${event.title}, User: ${req.user.name}, Date: ${event.date}`;
    const qrResponse = await axios.get(
      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`,
      { responseType: "arraybuffer" }
    );
    const qrBase64 = `data:image/png;base64,${Buffer.from(qrResponse.data).toString("base64")}`;

    const booking = new Booking({
      user: req.user._id,
      event: event._id,
      ticketType: req.body.ticketType || "General",
      qrCode: qrBase64,
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get bookings for logged-in user
router.get("/my", protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("event");
  res.json(bookings);
});

// ✅ Get attendees for organizer
router.get("/event/:eventId", protect, async (req, res) => {
  const bookings = await Booking.find({ event: req.params.eventId }).populate("user", "name email");
  res.json(bookings);
});

module.exports = router;
