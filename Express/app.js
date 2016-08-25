var express = require("express");
var app = new express();
var url = "http://127.0.0.1:3000"; //Localhost

var dbFeatureRequest = require("../MongoDB/featureRequest");

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
app.post("/upvote/:id/:user", function (request, response) {
    dbFeatureRequest.requestUpVote(request.params.id, request.params.user, function(){
        response.end();
    });
});

// When a request to /downvote is made, the appropriate data object is decreased a point
app.post("/downvote/:id/:user", function (request, response) {
    dbFeatureRequest.requestDownVote(request.params.id, request.params.user, function(){
        response.end();
    });
});


// When a request to /comment is made, a comment gets pushed into the appropriate data object
app.post("/comment/:id/:comment/:user", function (request, response) {
    dbFeatureRequest.requestComment(request.params.id, request.params.comment, request.params.user, function(){
        response.end();
    });
});

app.listen(3000, function() {
    console.log("Server listening at " + url);
});