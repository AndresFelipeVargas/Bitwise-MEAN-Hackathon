var express = require("express");
var app = new express();
var bodyParser = require('body-parser')
var url = "http://127.0.0.1:3000"; //Localhost

var dbFeatureRequest = require("../MongoDB/featureRequest");

app.use(bodyParser.json());

//Used to serve the index.html file at the root directory
app.use(express.static("../"));

// When a request to /features is made, the featuresList data is returned
app.get("/features", function (request, response) {
    dbFeatureRequest.requestFeatures(function (featuresList) {
        response.send(featuresList);
        response.end();
    });
});

// When a request to /upvote is made, the appropriate data object is increased a point
app.post("/upvote/", function (request, response) {
    dbFeatureRequest.requestUpVote(request.body.id, request.body.user, request.body.voteSet, function(){
        response.end();
    });
});

// When a request to /downvote is made, the appropriate data object is decreased a point
app.post("/downvote/", function (request, response) {
    dbFeatureRequest.requestDownVote(request.body.id, request.body.user, request.body.voteSet, function(){
        response.end();
    });
});


// When a request to /comment is made, a comment gets pushed into the appropriate data object
app.post("/comment/", function (request, response) {
    dbFeatureRequest.requestComment(request.body.id, request.body.comment, request.body.user, function(){
        response.end();
    });
});

app.listen(3000, function() {
    console.log("Server listening at " + url);
});