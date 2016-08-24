var express = require("express");
var app = new express();
var url = "http://127.0.0.1:3000"; //Localhost

//Used to serve the index.html file at the root directory
app.use(express.static("../"));

app.listen(3000, function() {
    console.log("Server listening at " + url);
});