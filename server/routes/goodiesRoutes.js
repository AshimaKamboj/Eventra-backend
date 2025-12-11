const express = require("express");
const router = express.Router();
const { createGoodiesOrder } = require("../controllers/goodiesController");

// Public checkout endpoint for goodies
router.post("/checkout", createGoodiesOrder);

module.exports = router;
