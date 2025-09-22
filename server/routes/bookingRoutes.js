const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

// ✅ dynamic import for node-fetch (fix ESM issue)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 * @route   POST /api/bookings/:eventId
 * @desc    Book a ticket for an event
 * @access  Private (Users only)
 */
router.post("/:eventId", protect, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Pick first available ticket (later we can extend to user selection)
    let ticket = event.tickets[0];
    if (!ticket || ticket.available <= 0) {
      return res.status(400).json({ message: "Tickets sold out!" });
    }

    // Prevent double booking
    const existingBooking = await Booking.findOne({ user: userId, event: eventId });
    if (existingBooking) {
      return res.status(400).json({ message: "You already booked this event!" });
    }

    // Create new booking
    const booking = new Booking({
      user: userId,
      event: eventId,
      ticketType: ticket.type,
    });

    // Generate QR Code using GoQR API
    const qrResponse = await fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Booking-${booking._id}`
    );
    const qrBuffer = await qrResponse.arrayBuffer();
    const qrBase64 = `data:image/png;base64,${Buffer.from(qrBuffer).toString("base64")}`;

    booking.qrCode = qrBase64;
    await booking.save();

    // Reduce availability
    ticket.available -= 1;
    await event.save();

    res.json({ booking });
  } catch (err) {
    console.error("Booking error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route   GET /api/bookings/my
 * @desc    Get logged-in user's bookings
 * @access  Private
 */
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date location image");
    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/bookings/event/:eventId
 * @desc    Organizer can see attendees list
 * @access  Private
 */
router.get("/event/:eventId", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ event: req.params.eventId })
      .populate("user", "name email");
    res.json(bookings);
  } catch (err) {
    console.error("Fetch attendees error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
