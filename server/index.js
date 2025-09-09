// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON body

// routes
app.use('/api/events', eventRoutes);

// health
app.get('/', (req, res) => res.send('Eventra API running'));

// connect to mongodb
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}).catch(err => {
  console.error('DB connection error:', err);
});
