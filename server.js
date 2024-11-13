console.log("Starting server.js execution...");

// basic setup

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');  // MySQL connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Require cookie-parser
const postRoutes = require('./postRoutes'); // Adjust the path as needed
const authenticateToken = require('./authMiddleware'); // Import authenticateToken from authMiddleware.js



const app = express();
app.use(bodyParser.json()); // to parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // to parse form data
app.use(cookieParser());  // To read cookies
app.use(express.static('public')); // Serve static files from the "public" directory

// Configure ejs
app.set('view engine', 'ejs');


// Middleware to use postRoutes for handling post submissions
app.use("/posts", postRoutes);

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

// Get the counter value from the database
app.get('/counter', (req, res) => {
    db.query('SELECT count FROM counter WHERE id = 1', (err, result) => {
        if (err) {
            console.error('Error fetching counter:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        const count = result[0]?.count || 0;
        res.json({ count });
    });
});

// Increment the counter in the database
app.post('/counter/increment', (req, res) => {
    db.query('UPDATE counter SET count = count + 1 WHERE id = 1', (err) => {
        if (err) {
            console.error('Error updating counter:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        // Fetch the updated count
        db.query('SELECT count FROM counter WHERE id = 1', (err, result) => {
            if (err) {
                console.error('Error fetching updated counter:', err);
                res.status(500).json({ error: 'Database error' });
                return;
            }
            const count = result[0].count;
            res.json({ count });
        });
    });
});



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

// Login Route - Via username
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username in MySQL
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], async (err, results) => {
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
            const token = jwt.sign({ id: user.id, username: user.username }, 'yourSecretKey', { expiresIn: '1h' });
            
            // Set the token as a cookie and redirect to homepage
            res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000 });  // Cookie expires in 1 hour
            return res.redirect('/home.html'); // Adjust this path if your homepage file is named differently
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Route to get user info for welcome message
app.get('/user-info', authenticateToken, (req, res) => {
    res.json({ username: req.user.username });
});

// Logout Route
app.get('/logout', (req, res) => {
    // Clear the authToken cookie by setting it to an expired date
    res.clearCookie('authToken');
    res.redirect('/home.html'); // Redirect to homepage or login page after logout
});



// Set up route to serve individual post pages
app.get('/post/:postID', async (req, res) => {
    const postID = req.params.postID;
  
    db.query('SELECT * FROM userposts WHERE iduserposts = ?', [postID], (err, results) => {
      if (err) {
        console.error('Error executing query:', err); // Logs the specific error if any
        return res.status(500).send('Database query error');
      }
      
      if (results.length === 0) {
        return res.status(404).send('Post not found');
      } 
      
      const post = results[0];
      res.render('postPage', { post });
    });
  });
  



// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));