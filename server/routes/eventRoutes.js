// routes/eventRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected routes (organizer only)
router.post("/", auth, authorizeRole("organizer"), createEvent);
router.put("/:id", auth, authorizeRole("organizer"), updateEvent);
router.delete("/:id", auth, authorizeRole("organizer"), deleteEvent);

module.exports = router;
