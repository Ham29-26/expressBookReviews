const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
        if(!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully regsitered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to regsiter user."});

  //Write your code here
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
  //Write your code here
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]);
    } else {
        res.send("Book with given isbn could not be found")
    }
  //Write your code here
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    const finalAuthor = author.toLocaleLowerCase().trim().replace("-", " ");

    const allBooks = Object.values(books);

    const matchingBooks = allBooks.filter((book) => book.author.toLocaleLowerCase().trim() === finalAuthor);

    res.send(matchingBooks);
    
  //Write your code here
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    let title = req.params.title;
    const finalTitle = title.toLocaleLowerCase().trim().replace("-", " ");

    const allBooks = Object.values(books);

    const matchingBooks = allBooks.filter((book) => book.title.toLocaleLowerCase().trim() === finalTitle);

    res.send(matchingBooks);
  //Write your code here
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    res.send(books[isbn].reviews);
  //Write your code here
});

module.exports.general = public_users;
