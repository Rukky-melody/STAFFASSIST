// backend/routes/admin.js

const express = require('express');
const router = express.Router();

// Import the admin controller functions
const adminController = require('../controllers/adminController');
const { protect } = require('../authMiddleware'); // Use the existing middleware
router.post('/employee-id', protect, adminController.createEmployeeId); // <-- NEW ROUTE

// POST route for IT Team login (not protected by middleware)
router.post('/login', adminController.adminLogin);

// NEW: POST route for IT Team to post an announcement (Protected)
router.post('/announcement', protect, adminController.addAnnouncement);
// Routes below this line will be protected (admin access required)
// Example: POST /api/admin/employee-id (will be implemented next)
// router.post('/employee-id', protect, adminController.createEmployeeId);

// Export the router
module.exports = router;