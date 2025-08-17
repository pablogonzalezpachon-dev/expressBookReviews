const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) {
          users.push({username: username, password: password})
          res.send(`${username} added succesfully!`)
      } else {
          res.send(`Username already exists`);
      }
    } else {
      res.send(`Please type username AND password`);
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.send("No books found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorRequested = req.params.author;
  const filteredBooks = {}
  for (let book in books) {
    if (books[book]["author"] === authorRequested) {
        filteredBooks[book] = books[book];
    }
  }

  if (Object.keys(filteredBooks).length !== 0) {
    res.send(JSON.stringify(filteredBooks, null, 4))
  } else {
    res.send("No books found");
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleRequested = req.params.title;
  const filteredBooks = {}
  for (let book in books) {
    if (books[book]["title"] === titleRequested) {
        filteredBooks[book] = books[book];
    }
  }

  if (Object.keys(filteredBooks).length !== 0) {
    res.send(JSON.stringify(filteredBooks, null, 4))
  } else {
    res.send("No books found");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]["reviews"]) {
    res.send(JSON.stringify(books[isbn]["reviews"]))
  } else {
    res.send("No reviews found");
  }
});

module.exports.general = public_users;
