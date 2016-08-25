var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var url = "mongodb://127.0.0.1:27017/features"; //URL to the db

function updateUsersVoted(id, user, db, callback){
    var updateUsersVoted = {};
    updateUsersVoted["usersVoted." + user] = true;

    db.collection("featuresList").updateOne(
        {_id: ObjectId(id)},
        {
            $set: updateUsersVoted
        }
    );
    db.close();
    callback();
}


function requestFeatures (callback){
    MongoClient.connect(url, function(error, db){
        var featuresList = [];
        var cursor = db.collection("featuresList").find();
        cursor.forEach(function(data){
            var feature = {
                "_id": data._id,
                "featureName": data.featureName,
                "points": data.points,
                "comments": data.comments,
                "usersVoted": data.usersVoted
            };

            featuresList.push(feature);
        }, function (error){
            db.close();
            callback(featuresList);
        });
    });
}


function requestUpVote (id, user, callback){
    MongoClient.connect(url, function(error, db){
        console.log(user);
        db.collection("featuresList").updateOne(
            {_id: ObjectId(id)},
            {
                $inc: {points: 1}
            }
        );

        updateUsersVoted(id, user, db, callback);

    });
}


function requestDownVote (id, user, callback){
    MongoClient.connect(url, function(error, db){
        db.collection("featuresList").updateOne(
            {_id: ObjectId(id)},
            {
                $inc: {points: -1}
            }
        );

        updateUsersVoted(id, user, db, callback);

    });
}


function requestComment (id, comment, user, callback){
    MongoClient.connect(url, function(error, db){
        db.collection("featuresList").updateOne(
            {_id: ObjectId(id)},
            {
                $push: {comments: {text: comment, user: user}}
            }
        );

        db.close();
        callback();
    });
}

module.exports.requestFeatures = requestFeatures;
module.exports.requestUpVote = requestUpVote;
module.exports.requestDownVote = requestDownVote;
module.exports.requestComment = requestComment;