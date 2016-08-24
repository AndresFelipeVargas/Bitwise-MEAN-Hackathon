var express = require("express");
var app = new express();
var url = "http://127.0.0.1:3000"; //Localhost

var requestFeatures = require("../MongoDB/getFeatures").requestFeatures;

//Used to serve the index.html file at the root directory
app.use(express.static("../"));

app.use("/features", function (request, response) {
    requestFeatures(function (featuresList) {
        response.send(featuresList);
        response.end();
    })
});

app.listen(3000, function() {
    console.log("Server listening at " + url);
});