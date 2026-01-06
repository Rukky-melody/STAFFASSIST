const express = require('express');
const router = express.Router();

// Import the middleware
const { protect } = require('../authMiddleware'); 
const { submitITTicket, getITTickets } = require('../controllers/ticketController');

// 1. Staff side: Submit a ticket
// POST http://localhost:3000/api/tickets/it
router.post('/it', protect, submitITTicket); 

// 2. IT Admin side: View all tickets
// GET http://localhost:3000/api/tickets/it-desk
router.get('/it-desk', getITTickets); 

module.exports = router;