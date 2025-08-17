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
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
