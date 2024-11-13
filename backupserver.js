// basic setup

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');  // MySQL connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Require cookie-parser

const app = express();
app.use(bodyParser.json()); // to parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // to parse form data
app.use(cookieParser());  // To read cookies

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

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Middleware to authenticate token from cookies
function authenticateToken(req, res, next) {
    const token = req.cookies.authToken; // Read token from cookie
    if (!token) return res.status(401).send('Access denied'); // No token, access denied

    jwt.verify(token, 'yourSecretKey', (err, user) => {
        if (err) return res.status(403).send('Invalid token'); // Token is invalid
        req.user = user; // Attach user info to the request object
        next(); // Continue to the next middleware or route handler
    });
}


// Register Route
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // hash password

        // Insert new user into MySQL
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ error: 'Registration failed' });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email in MySQL
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate a token
            const token = jwt.sign({ id: user.id }, 'yourSecretKey', { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
    // Redirect to the homepage
    return res.redirect('/home.html'); // Adjust this path if your homepage file is named differently
});

// Route to get user info for welcome message
app.get('/user-info', authenticateToken, (req, res) => {
    res.json({ username: req.user.username });
});