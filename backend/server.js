// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. MIDDLEWARE
app.use(express.json());
app.use(cors());

// 2. ROUTE IMPORTS
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets'); 
const hrRoutes = require('./routes/hr');
const adminroutes = require('./routes/admin');
const staffroutes = require('./routes/staff');   

// 3. ROUTE MOUNTING
app.use('/api/auth', authRoutes); 
app.use('/api/tickets', ticketRoutes); 
app.use('/api/hr', hrRoutes); 
app.use('/api/admin', adminroutes); // This makes /api/admin/login
app.use('/api/staff', staffroutes);

// 4. HEALTH CHECK
app.get('/', (req, res) => {
    res.status(200).send('StaffAssist Backend is Running!');
});

// 5. DEBUGGER: This will catch any 404s and print them to your terminal
app.use((req, res) => {
    console.log(`⚠️ 404 Alert: Browser tried to reach ${req.method} ${req.url}`);
    res.status(404).send("Route not found on server");
});

app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`✅ Server is listening on port ${PORT}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log('--------------------------------------------------');
})

app.use((req, res) => {
    console.log(`⚠️ 404 Alert: Browser tried to reach ${req.method} ${req.url}`);
    res.status(404).send("Route not found on server");
});