// postRoutes.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2"); //Import mySQL here
// import authMiddleware
const authenticateToken = require('./authMiddleware');

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'GLITCHKILLER104',  // replace with your MySQL root password
    database: 'testsite'  // replace with the name of your MySQL database
});

// Check connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});




// Route for submitting a post
router.post("/submitPost", authenticateToken, (req, res) => {
    const username = req.user.username;  // Fetch logged-in user's username
    const { title, body } = req.body;

     // Create a MySQL-compatible date string in the format "YYYY-MM-DD HH:MM:SS"
     const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = "INSERT INTO userposts (username, title, body, date) VALUES (?, ?, ?, ?)";
    db.query(query, [username, title, body, date], (err, result) => {
        if (err) {
            console.error("Error inserting post:", err);
            res.status(500).json({ message: "Failed to save post." });
        } else {
            res.status(200).json({ message: "Post submitted successfully!" });
        }
    });
});

// Route for fetching posts
router.get("/getPosts", (req, res) => {
    const query = "SELECT iduserposts, username, title, body, date FROM userposts ORDER BY date DESC";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching posts:", err);
            res.status(500).json({ message: "Failed to retrieve posts." });
        } else {
            res.status(200).json(results); // Send posts as JSON response
        }
    });
});


module.exports = router;