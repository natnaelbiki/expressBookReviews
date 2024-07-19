const express = require('express');
const bodyParser = require('body-parser');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.use(bodyParser.json());

public_users.post("/register", (req,res) => {
    const{ username, password} = req.body;
    

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if username already exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Create new user object
    const newUser = { username, password };

    // Store new user in database (in this case, 'users' array)
    users.push(newUser);

    // Return success message
    res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Find the book with the provided ISBN
    let foundBook = null;
    for (const book of Object.values(books)) {
        if (book.isbn === isbn) {
            foundBook = book;
            break;
        }
    }

    // If book found, return its details; otherwise, return 404 Not Found
    if (foundBook) {
        res.json(foundBook);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    //Write your code here
let foundBook = null;
    for (const book of Object.values(books)) {
        if (book.author === author) {
            foundBook = book;
            break;
        }
    }

    // If book found, return its details; otherwise, return 404 Not Found
    if (foundBook) {
        res.json(foundBook);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
    //Write your code here
let foundBook = null;
    for (const book of Object.values(books)) {
        if (book.title === title) {
            foundBook = book;
            break;
        }
    }

    // If book found, return its details; otherwise, return 404 Not Found
    if (foundBook) {
        res.json(foundBook);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 const isbn = req.params.isbn;

    // Find the book with the provided ISBN
    let foundBook = null;
    for (const book of Object.values(books)) {
        if (book.isbn === isbn) {
            foundBook = book;
            break;
        }
    }

    // If book found, return its details; otherwise, return 404 Not Found
    if (foundBook) {
        res.json(foundBook);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }});



module.exports.general = public_users;
