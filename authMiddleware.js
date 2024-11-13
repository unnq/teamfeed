// authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.authToken; // Read token from cookie
    if (!token) return res.status(401).send('Access denied'); // No token, access denied

    jwt.verify(token, 'yourSecretKey', (err, user) => {
        if (err) return res.status(403).send('Invalid token'); // Token is invalid
        req.user = user; // Attach user info to the request object
        next(); // Continue to the next middleware or route handler
    });
}

module.exports = authenticateToken;
