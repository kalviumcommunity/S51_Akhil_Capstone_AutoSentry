console.log("Server is starting")


var express = require('express');

var app = express();

var server = app.listen(5000,starting);

function starting() {
    console.log("server started")
}

app.use(express.static('website'))

app.get('/',welcome);

function welcome(req,res){
    res.send("Welcome to my Capstone project!")
}   