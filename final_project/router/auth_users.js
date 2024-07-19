const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bodyParser = require('body-parser');
const JWT_SECRET = 'your_jwt_secret';

regd_users.use(bodyParser.json())

let users = [];


function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];

    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');

        // Get token from array
        const token = bearer[1];

        // Verify token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Failed to authenticate token' });
            }
            // Save decoded user information to request object
            req.user = decoded;
            next();
        });
    } else {
        // Forbidden if token is not provided
        res.status(403).json({ error: 'Authorization header not present' });
    }
}

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user in the 'database' (array of registered users)
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    // Return the token as a JSON response
    res.json({ token }); 
});



// Add a book review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    const { reviewText } = req.body;

    // Check if review text is provided
    if (!reviewText) {
        return res.status(400).json({ error: 'Review text is required' });
    }

    // Find the book by ISBN
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    // Get user from decoded token (added by verifyToken middleware)
    const user = req.user;

    // Check if the user has already reviewed the book
    const existingReviewIndex = book.reviews.findIndex(review => review.user === user.username);
    if (existingReviewIndex === -1) {
        return res.status(404).json({ error: 'Review not found for the book' });
    }

    // Update the existing review
    book.reviews[existingReviewIndex].reviewText = reviewText;

    // Return success message
    res.json({ message: 'Review updated successfully', review: book.reviews[existingReviewIndex] });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
