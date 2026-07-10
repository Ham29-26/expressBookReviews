const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        
        let accessToken = jwt.sign({
            username: username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in!");
    } else {
        res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  //Write your code here
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review.replaceAll("-", " ");

    if (!review) {
        return res.status(404).json({ message: "Review is required."});
    }

    const username = req.session.authorization.username;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", 
    reviews: {
        [username]: review
    } });
  //Write your code here
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    const username = req.session.authorization.username;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    delete book.reviews[username];

    return res.status(200).json({ message: "The review was deleted successfully!" })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
