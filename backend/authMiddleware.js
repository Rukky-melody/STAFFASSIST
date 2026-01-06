// backend/authMiddleware.js

const jwt = require('jsonwebtoken');

// IMPORTANT: This key MUST match the JWT_SECRET you set in your .env file
const JWT_SECRET = process.env.JWT_SECRET; 

exports.protect = (req, res, next) => {
    let token;

    // 1. Check if the token is present in the request header
    // It should be sent in the format: Authorization: Bearer TOKEN
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token part (the actual TOKEN string after 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // For testing purposes, we use jwt.decode() to skip full verification 
            // since we haven't implemented the database/hashing yet.
            const decoded = jwt.decode(token); 

            // Attach the user's information (like employeeId) from the token payload 
            // to the request object so the controller can use it.
            req.user = decoded; 

            next(); // Move to the next function (the controller)
        } catch (error) {
            console.error('Token Error:', error);
            // If the token is malformed or expired (in a real app), send 401
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    // 2. If no token is provided in the header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
};