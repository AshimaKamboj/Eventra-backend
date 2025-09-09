// server/controllers/eventController.js
const Event = require('../models/Event');

// Create
exports.createEvent = async (req, res) => {
  try {
    const payload = req.body;
    // if tickets not provided, create a default ticket
    if (!payload.tickets) {
      payload.tickets = [{ type: 'General', price: payload.price || 0, available: 100 }];
    }
    const event = new Event(payload);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Read all (with optional filters: city, category, q)
exports.getEvents = async (req, res) => {
  try {
    const { city, category, q } = req.query;
    const filter = {};
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (category) filter.category = new RegExp(category, 'i');
    if (q) filter.$or = [
      { title: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') }
    ];

    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Read one
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
   
  }}