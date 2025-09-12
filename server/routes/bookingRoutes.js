// server/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

// ✅ dynamic import for node-fetch
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

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    let ticket = event.tickets[0];
    if (!ticket || ticket.available <= 0) {
      return res.status(400).json({ message: "Tickets sold out!" });
    }

    const existingBooking = await Booking.findOne({ user: userId, event: eventId });
    if (existingBooking) {
      return res.status(400).json({ message: "You already booked this event!" });
    }

    const booking = new Booking({
      user: userId,
      event: eventId,
      ticketType: ticket.type,
    });

    // Generate QR Code
    const qrResponse = await fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Booking-${booking._id}`
    );
    const qrBuffer = await qrResponse.arrayBuffer();
    const qrBase64 = `data:image/png;base64,${Buffer.from(qrBuffer).toString("base64")}`;

    booking.qrCode = qrBase64;
    await booking.save();

    // reduce ticket availability
    ticket.available -= 1;
    await event.save();

    res.json({ booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date location image");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/event/:eventId", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ event: req.params.eventId })
      .populate("user", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
