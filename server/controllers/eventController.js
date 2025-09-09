// controllers/eventController.js
const Event = require('../models/Event');

// create event
exports.createEvent = async (req, res) => {
  try {
    const data = req.body;
    const ev = new Event(data);
    await ev.save();
    res.status(201).json(ev);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all events (with filters later)
exports.getEvents = async (req, res) => {
  try {
    const { city, category } = req.query;
    const filter = {};
    if (city) filter['location.city'] = city;
    if (category) filter.category = category;
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get event by id
exports.getEventById = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json(ev);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update
exports.updateEvent = async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ev);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
