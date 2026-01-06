// backend/routes/staff.js

const express = require('express');
const router = express.Router();

// Import the necessary middleware and controller functions
const { protect } = require('../authMiddleware'); 
const { getAnnouncements } = require('../controllers/adminController'); // Reuses the function from admin controller

// GET route for staff to view announcements on the dashboard (Protected)
// This endpoint will be accessed at: /api/staff/announcements
router.get('/announcements', protect, getAnnouncements);

module.exports = router;