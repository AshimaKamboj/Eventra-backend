// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Event = require("./models/Event");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const venueRoutes = require("./routes/venueRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const goodiesRoutes = require("./routes/goodiesRoutes");

const app = express();

// Sample events for seeding
const sampleEvents = [
  {
    title: "Tech Conference 2025",
    description: "Join us for an exciting tech conference featuring the latest innovations in AI and cloud computing.",
    category: "Conference",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    date: new Date('2025-02-15'),
    location: {
      venue: "Tech Hub Auditorium",
      address: "789 Electronic City",
      city: "Bangalore",
      country: "India"
    },
    tickets: [
      { type: "Early Bird", price: 1999, available: 100 },
      { type: "Regular", price: 2999, available: 200 }
    ],
    price: 1999,
    createdBy: "system"
  },
  {
    title: "Music Festival 2025",
    description: "Experience amazing live music from international and local artists.",
    category: "Music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60",
    date: new Date('2025-03-20'),
    location: {
      venue: "Open Air Park",
      address: "Marathahalli",
      city: "Bangalore",
      country: "India"
    },
    tickets: [
      { type: "VIP", price: 4999, available: 50 },
      { type: "General", price: 2499, available: 500 }
    ],
    price: 2499,
    createdBy: "system"
  },
  {
    title: "Web Development Workshop",
    description: "Learn modern web development with React, Node.js, and MongoDB.",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    date: new Date('2025-01-25'),
    location: {
      venue: "Grand Convention Center",
      address: "MG Road",
      city: "Bangalore",
      country: "India"
    },
    tickets: [
      { type: "Student", price: 999, available: 30 },
      { type: "Professional", price: 1999, available: 70 }
    ],
    price: 999,
    createdBy: "system"
  },
  {
    title: "Startup Networking Event",
    description: "Connect with entrepreneurs, investors, and industry leaders.",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    date: new Date('2025-02-01'),
    location: {
      venue: "Royal Banquet Hall",
      address: "Koramangala",
      city: "Bangalore",
      country: "India"
    },
    tickets: [
      { type: "Founder", price: 2999, available: 100 },
      { type: "Investor", price: 4999, available: 50 }
    ],
    price: 2999,
    createdBy: "system"
  },
  {
    title: "Yoga & Wellness Retreat",
    description: "A rejuvenating weekend of yoga, meditation, and wellness activities.",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60",
    date: new Date('2025-03-08'),
    location: {
      venue: "Lakeside Resort",
      address: "Devanahalli",
      city: "Bangalore",
      country: "India"
    },
    tickets: [
      { type: "Weekend Pass", price: 3999, available: 100 },
      { type: "Full Week", price: 7999, available: 50 }
    ],
    price: 3999,
    createdBy: "system"
  },
  {
    title: "Art Exhibition Opening",
    description: "Contemporary art exhibition featuring works from emerging artists.",
    category: "Art",
    image: "https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=800&auto=format&fit=crop&q=60",
    date: new Date('2025-02-10'),
    location: {
      venue: "Art Gallery Downtown",
      address: "Brigade Road",
      city: "Bangalore",
      country: "India"
    },
    tickets: [
      { type: "General Admission", price: 499, available: 300 },
      { type: "VIP Tour", price: 1499, available: 50 }
    ],
    price: 499,
    createdBy: "system"
  }
];

const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection - Use In-Memory Server for development
async function connectDB() {
  try {
    const mongoUri = process.env.NODE_ENV === 'development' 
      ? (await MongoMemoryServer.create()).getUri()
      : process.env.MONGO_URI;
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(" ✅ MongoDB connected (In-Memory for Development)");
    
    // Seed events if in development
    if (process.env.NODE_ENV === 'development') {
      const eventCount = await Event.countDocuments();
      if (eventCount === 0) {
        await Event.insertMany(sampleEvents);
        console.log(" ✅ Sample events seeded successfully!");
      }
    }
  } catch (err) {
    console.error(" ❌ Mongo connect error:", err);
    process.exit(1);
  }
}

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/goodies", goodiesRoutes);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// Health Check
app.get("/", (req, res) => res.send(" Eventra API running"));

// Start Server with error handling
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`\nError: Port ${PORT} is already in use.\n` +
      `- Either stop the process currently using the port or set PORT to a different value.\n` +
      `- On Windows (PowerShell) you can run:\n` +
      `    Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Format-List Id,ProcessName\n` +
      `    Stop-Process -Id <PID>\n` +
      `- Or start this server with a different port:\n` +
      `    $env:PORT=3001; npm start\n`);
    process.exit(1);
  }

  console.error('Server error:', err);
  process.exit(1);
});