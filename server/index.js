// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const venueRoutes = require("./routes/venueRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" Mongo connect error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);

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
