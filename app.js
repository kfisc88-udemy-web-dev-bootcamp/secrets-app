//jshint esversion:6
// Node.js packages
require('dotenv').config()
const express = require("express");
const bodyParser = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


// Set up express
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


// Create session using Passport
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up mongo database
mongoose.connect("mongodb://localhost:27017/secretDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


// Schema for new users
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

// Session Strategy and Serialization
passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// __________________________GET__________________________  \\

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/secrets", function(req, res){
    if (req.isAuthenticated()) {
        console.log("User authenticated.");
        res.render("secrets");
    } else {
        console.log("Access denied, please log in.");
        res.redirect("/login");
    }
});

app.get("/login", function(req, res){
    res.render("login");
});


// __________________________POST__________________________  \\

app.post("/register", function(req ,res){   
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", function(req, res){
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });
});


// _________________________LISTEN_________________________  \\

app.listen(3000, function(req, res){
    console.log("Server is jogging on port 3000")
});