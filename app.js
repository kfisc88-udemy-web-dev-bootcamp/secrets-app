//jshint esversion:6
const express = require("express");
const bodyParser = require("express");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.listen(3000, function(req, res){
    console.log("Server is jogging on port 3000")
});