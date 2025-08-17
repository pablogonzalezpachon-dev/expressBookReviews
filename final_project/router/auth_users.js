const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
   const usersFiltered = users.filter((user) => user.username === username);
   return usersFiltered.length > 0 ? false : true;
}

const authenticatedUser = (username,password)=>{ 
    const usersFiltered = users.filter((user) => user.username === username && user.password === password )
    return usersFiltered.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (authenticatedUser(username, password)) {
            let accessToken = jwt.sign({
                data: username
            }, "access", {expiresIn: 60 * 60})

            req.session.authorization = {
                accessToken
            }
            res.send(`${username} succesfully logged in!`)  
        } else {
            res.send(`Please register first`)
        }
    } else {
        res.send("Please type username and password")
    }
});

regd_users.get("/users", (req, res) => {
    res.send(JSON.stringify(users, null, 4))
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.user.data;
  const isbn = req.params.isbn;
  const review = req.query.review;
  if (books[isbn]) {
    if (review) {
        books[isbn]["reviews"][user] = review;
        res.send(`Review added succesfully!`);
    }
  } else {
    res.send("Error adding the review");
  }
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const user = req.user.data;
    const isbn = req.params.isbn;
    if (books[isbn]) {
        if (books[isbn]["reviews"][user]) {
            delete books[isbn]["reviews"][user];
            res.send("Successfully deleted the review");
        } else {
            res.send("There was no review to delete");
        }
    } else {
        res.send(`Error deleting the review`)
    }
})



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
