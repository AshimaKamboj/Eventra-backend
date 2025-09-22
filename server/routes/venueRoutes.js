const express = require('express');
const router = express.Router();
const {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue
} = require('../controllers/venueController');
const protect = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllVenues);
router.get('/:id', getVenueById);

// Protected routes (require authentication)
router.post('/', protect, createVenue);
router.put('/:id', protect, updateVenue);
router.delete('/:id', protect, deleteVenue);

module.exports = router;
