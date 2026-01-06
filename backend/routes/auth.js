// backend/routes/auth.js

const express = require('express');
const router = express.Router();

// Import the controller that contains the logic
const authController = require('../controllers/authController');

// --- NEW ROUTE: Account Activation ---
// This handles the first-time password setup for new employees
router.post('/set-password', authController.setPassword);

// --- EXISTING ROUTE: Staff Login ---
// The authController.staffLogin function handles standard logins
router.post('/login', authController.staffLogin);

// Export the router so server.js can use it
module.exports = router;