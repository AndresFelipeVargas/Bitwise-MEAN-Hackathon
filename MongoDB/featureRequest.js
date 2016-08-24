var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/features"; //URL to the db

function requestFeatures (callback){
    MongoClient.connect(url, function(error, db){
        var featuresList = [];
        var cursor = db.collection("featuresList").find();
        cursor.forEach(function(data){
            var feature = {
                "featureName": data.featureName,
                "points": data.points,
                "comments": data.comments,
                "usersCommented": data.usersCommented
            };

            featuresList.push(feature);
        }, function (error){
            db.close();
            callback(featuresList);
        });
    });
}


function requestUpVote (name, callback){
    MongoClient.connect(url, function(error, db){
        db.collection("featuresList").updateOne(
            {featureName: name},
            {
                $inc: {points: 1},
            }
        );
        callback();
    });
}


function requestDownVote (name, callback){
    MongoClient.connect(url, function(error, db){
        db.collection("featuresList").updateOne(
            {featureName: name},
            {
                $inc: {points: -1}
            }
        );
        callback();
    });
}


function requestComment (name, comment, callback){
    MongoClient.connect(url, function(error, db){
        db.collection("featuresList").updateOne(
            {featureName: name},
            {
                $push: {comments: comment}
            }
        );
        callback();
    });
}

module.exports.requestFeatures = requestFeatures;
module.exports.requestUpVote = requestUpVote;
module.exports.requestDownVote = requestDownVote;
module.exports.requestComment = requestComment;