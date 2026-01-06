// backend/routes/hr.js

const express = require('express');
const router = express.Router();

// Import the middleware to protect the route
const { protect } = require('../authMiddleware'); 

// Import the controller function for handling email submission
const { submitHRComplaint } = require('../controllers/hrController');

// POST route for staff to submit an HR complaint (protected)
router.post('/complaint', protect, submitHRComplaint);

// Export the router
module.exports = router;