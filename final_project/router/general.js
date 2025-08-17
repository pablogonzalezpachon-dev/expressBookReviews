const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


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
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books, null, 4));
// });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;

//   if (books[isbn]) {
//     res.send(JSON.stringify(books[isbn], null, 4));
//   } else {
//     res.send("No books found");
//   }
//  });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const authorRequested = req.params.author;
//   const filteredBooks = {}
//   for (let book in books) {
//     if (books[book]["author"] === authorRequested) {
//         filteredBooks[book] = books[book];
//     }
//   }

//   if (Object.keys(filteredBooks).length !== 0) {
//     res.send(JSON.stringify(filteredBooks, null, 4))
//   } else {
//     res.send("No books found");
//   }

// });

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

// 4 methods repeated with try await 


public_users.get('/', async function (req, res) {
    //Write your code here
    try {
        const response = await new Promise((resolve) => {
            resolve(books)
        })
        return res.status(200).json(response)

    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
});

public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    if (!isbn) {
        res.json({message: "No books found"})
    }
    try {
        const response = await new Promise((resolve) => {
            resolve(books[isbn])
        })
        if (response) {
            res.status(200).json(response)
        } else {
            res.json({message: "No books found"})
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});


public_users.get('/author/:author', async function (req, res) {
    try {
        const authorRequested = req.params.author;
        const filteredBooks = {}
        const response = await new Promise((resolve) => {
            for (let book in books) {
                if (books[book]["author"] === authorRequested) {
                    filteredBooks[book] = books[book];
                }
              }
            resolve(filteredBooks)
        })
        if (Object.keys(response).length !== 0) {
            return res.status(200).json(response)
        } else {
            return res.send("No books Found")
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
});


public_users.get('/title/:title', async function (req, res) {
    try {
        const titleRequested = req.params.title;
        const filteredBooks = {}
        const response = await new Promise((resolve) => {
            for (let book in books) {
                if (books[book]["title"] === titleRequested) {
                    filteredBooks[book] = books[book];
                }
              }
            resolve(filteredBooks)
        })
        if (Object.keys(response).length !== 0) {
            return res.status(200).json(response)
        } else {
            return res.send("No books Found")
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
});