// backend/setup-db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    console.log('Connecting to the database...');
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }
        });

        console.log('✅ Connected successfully!');

        // 1. Create Employees Table
        console.log('Creating `employees` table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS employees (
                employeeId VARCHAR(10) PRIMARY KEY,
                firstName VARCHAR(100) NOT NULL,
                lastName VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                phone VARCHAR(20),
                password VARCHAR(255) NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ `employees` table ready!');

        // 2. Create Tickets Table
        console.log('Creating `tickets` table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tickets (
                id VARCHAR(20) PRIMARY KEY,
                employeeId VARCHAR(10) NOT NULL,
                issueType VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'Open',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employeeId) REFERENCES employees(employeeId) ON DELETE CASCADE
            );
        `);
        console.log('✅ `tickets` table ready!');

        console.log('🎉 Database initialization complete! You can now deploy to Render.');
        await connection.end();

    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
    }
}

initializeDatabase();
