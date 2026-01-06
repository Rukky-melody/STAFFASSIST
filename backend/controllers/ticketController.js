const db = require('../db'); // Import your MySQL connection

// Helper to generate a clean ID (e.g., T-123456)
const generateTicketId = () => {
    return 'T-' + Date.now().toString().slice(-6);
};

exports.submitITTicket = async (req, res) => {
    // Get employeeId from the 'protect' middleware (req.user)
    const employeeId = req.user.employeeId; 
    const { issueType, description } = req.body;

    if (!issueType || !description) {
        return res.status(400).json({ message: 'Issue type and description are required.' });
    }

    const ticketId = generateTicketId();

    try {
        // SAVE TO MYSQL
        await db.query(
            'INSERT INTO tickets (id, employeeId, issueType, description, status) VALUES (?, ?, ?, ?, ?)',
            [ticketId, employeeId, issueType, description, 'Open']
        );

        console.log(`✅ [TICKET SAVED TO DB] ID: ${ticketId} by ${employeeId}`);

        res.status(201).json({ 
            message: 'IT Support Ticket submitted successfully!',
            ticketId: ticketId
        });
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        res.status(500).json({ message: 'Failed to save ticket to database.' });
    }
};

exports.getITTickets = async (req, res) => {
    try {
        // FETCH FROM MYSQL
        const [rows] = await db.query('SELECT * FROM tickets ORDER BY createdAt DESC');
        
        res.status(200).json({ 
            message: 'All current IT tickets:',
            tickets: rows // This matches your frontend .map()
        });
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        res.status(500).json({ message: 'Failed to fetch tickets.' });
    }
};