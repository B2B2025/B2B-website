const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize SQLite Database
const db = new Database('subscribers.db');

// Create subscribers table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// API endpoint to subscribe
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address.'
        });
    }

    try {
        const stmt = db.prepare('INSERT INTO subscribers (email) VALUES (?)');
        stmt.run(email);

        res.json({
            success: true,
            message: 'Thank you for subscribing!'
        });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            res.status(409).json({
                success: false,
                message: 'This email is already subscribed.'
            });
        } else {
            console.error('Database error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred. Please try again later.'
            });
        }
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Newsletter subscription backend is ready!');
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});
