// backend/controllers/authController.js
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 
const db = require('../db'); 

const JWT_SECRET = process.env.JWT_SECRET;

// --- 1. SET PASSWORD / ACTIVATE ACCOUNT ---
exports.setPassword = async (req, res) => {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the employee ID exists and if a password is already set
        const [rows] = await db.query('SELECT password FROM employees WHERE employeeId = ?', [employeeId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Employee ID not found. Contact IT.' });
        }

        if (rows[0].password) {
            return res.status(400).json({ message: 'Account already activated. Please login.' });
        }

        // Hash the new password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the employee record with the new password
        await db.query('UPDATE employees SET password = ? WHERE employeeId = ?', [hashedPassword, employeeId]);

        console.log(`✅ Account activated for: ${employeeId}`);
        res.status(200).json({ message: 'Account activated successfully!' });

    } catch (error) {
        console.error('ACTIVATION ERROR:', error);
        res.status(500).json({ message: 'Database error during activation.', details: error.message });
    }
};

// --- 2. STAFF LOGIN ---
exports.staffLogin = async (req, res) => {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
        return res.status(400).json({ message: 'Employee ID and password are required.' });
    }

    try {
        const [rows] = await db.query('SELECT employeeId, password FROM employees WHERE employeeId = ?', [employeeId]);
        const user = rows[0];

        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials or account not activated.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid employee ID or password.' });
        }

        const token = jwt.sign(
            { employeeId: user.employeeId, role: 'staff' }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful!', token, employeeId: user.employeeId });

    } catch (error) {
        console.error('DATABASE CONNECTION FAILED DURING LOGIN:', error); 
        res.status(500).json({ message: 'Database Connection Error.', details: error.message });
    }
};