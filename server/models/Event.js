// models/Event.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  type: { type: String, required: true },     // e.g. VIP, Gold, Silver
  price: { type: Number, required: true },
  available: { type: Number, default: 0 }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  date: Date,
  location: {
    venue: String,
    address: String,
    city: String,
    lat: Number,
    lng: Number
  },
  image: String, // can store URL
  tickets: [ticketSchema],
  createdAt: { type: Date, default: Date.now },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional later
});

module.exports = mongoose.model('Event', EventSchema);
