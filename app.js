//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Set up express
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Set up mongo database
mongoose.connect("mongodb://localhost:27017/secretDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// Schema for new users
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Encryption key environment variable
const secret = process.env.SECRET;

const User = new mongoose.model("User", userSchema);


// __________________________GET__________________________  \\

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});


// __________________________POST__________________________  \\

app.post("/register", function(req ,res){   
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
    
        newUser.save(function(err){
            if(err){
                console.log(err);
            } else {
                res.render("secrets")
            }
        });
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result){
                    res.render("secrets");
                }
            });
        }
    });
});


// _________________________LISTEN_________________________  \\

app.listen(3000, function(req, res){
    console.log("Server is jogging on port 3000")
});