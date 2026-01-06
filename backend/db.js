// backend/db.js (MySQL Connection)

// Import the driver and dotenv to load environment variables
const mysql = require('mysql2/promise');
require('dotenv').config(); 

console.log('--- DB.JS IS RUNNING SUCCESSFULLY ---'); // <-- NEW CHECK

// Create the connection pool (uses variables from your .env file)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Max number of concurrent connections
    queueLimit: 0
});

// Test the connection when the application starts
pool.getConnection()
    .then(connection => {
        console.log('DEBUG DB_PASSWORD:', process.env.DB_PASSWORD); // <-- ADD THIS LINE
        console.log('✅ Database connection successful! (MySQL)');
        connection.release(); // Release the test connection back to the pool
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        console.error('Check your DB_HOST, DB_USER, and DB_PASSWORD in .env');
        // In a real scenario, you might want to stop the server if the database is critical:
        // process.exit(1); 
    });

module.exports = pool; // Export the pool so controllers can query the database