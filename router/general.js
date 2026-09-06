const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered"
    });
});

// Get the book list available in the shop

public_users.get('/', function (req, res) {
    res.status(200).json(books);
});

// Get book details based on ISBN

public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const book = await Promise.resolve(books[isbn]);

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error retrieving book"});
    }
});


// Get book details based on author

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const result = await Promise.resolve(
            Object.values(books).filter(book =>
                book.author.toLowerCase() === author.toLowerCase()
            )
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: "Error retrieving books"});
    }
});


// Get all books based on title

public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const result = await Promise.resolve(
            Object.values(books).filter(book =>
                book.title.toLowerCase() === title.toLowerCase()
            )
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: "Error retrieving books"});
    }
});
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

// Axios implementation for retrieving books

const BASE_URL = "http://localhost:5000";

// Get all books using Promise callback
function getAllBooks() {
    axios.get(`${BASE_URL}/`)
        .then(response => {
            console.log("All Books:", response.data);
        })
        .catch(error => {
            console.error("Error fetching all books:", error.message);
        });
}

// Get book details based on ISBN using async/await
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
        console.log(`Book with ISBN ${isbn}:`, response.data);
    } catch (error) {
        console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
    }
}

// Get books based on author using Promise callback
function getBooksByAuthor(author) {
    axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
        .then(response => {
            console.log(`Books by ${author}:`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching books by ${author}:`, error.message);
        });
}

// Get books based on title using async/await
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `${BASE_URL}/title/${encodeURIComponent(title)}`
        );
        console.log(`Books with title ${title}:`, response.data);
    } catch (error) {
        console.error(`Error fetching books with title ${title}:`, error.message);
    }
}

module.exports.general = public_users;
