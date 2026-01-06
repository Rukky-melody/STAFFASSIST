const jwt = require('jsonwebtoken'); 
const db = require('../db'); // <-- Ensure this points to your mysql2 connection pool
const JWT_SECRET = process.env.JWT_SECRET;

let announcements = []; 

// 1. ADMIN LOGIN
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    if (username === 'ITAdmin' && password === 'adminpass') {
        const token = jwt.sign({ userId: username, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: 'Admin login successful!', token, role: 'admin' });
    }
    return res.status(401).json({ message: 'Invalid admin credentials.' });
};

// 2. CREATE EMPLOYEE ID (Connected to MySQL)
exports.createEmployeeId = async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;

    // Check required fields based on your DB "NO" NULL status
    if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: 'First name, last name, and email are required.' });
    }

    // Generate ID matching your E1002 format
    const newEmployeeId = 'E' + Math.floor(1000 + Math.random() * 9000); 

    try {
        // We MUST use 'await' and 'db.query'
        // We pass 'NULL' for password so the employee can set it later
        await db.query(
            'INSERT INTO employees (employeeId, firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?, NULL)',
            [newEmployeeId, firstName, lastName, email, phone || null]
        );

        return res.status(201).json({ 
            message: 'Employee ID created successfully in database.', 
            employeeId: newEmployeeId 
        });

    } catch (error) {
        console.error('DATABASE ERROR:', error);
        return res.status(500).json({ 
            message: 'Could not save employee to database.', 
            details: error.message 
        });
    }
};

// 3. ADD ANNOUNCEMENT
exports.addAnnouncement = (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Missing fields' });
    
    const newAnnouncement = {
        id: Date.now(),
        title,
        content,
        postedBy: req.user?.userId || 'Admin',
        date: new Date().toISOString()
    };
    announcements.push(newAnnouncement);
    return res.status(201).json({ message: 'Announcement posted!', announcement: newAnnouncement });
};

// 4. GET ANNOUNCEMENTS
exports.getAnnouncements = (req, res) => {
    res.status(200).json({ announcements: [...announcements].reverse() });
};