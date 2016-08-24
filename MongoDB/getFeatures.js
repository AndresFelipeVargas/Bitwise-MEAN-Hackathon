var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/features"; //URL to the db

function requestFeatures(db, callback){
    var featuresList = [];
    var cursor = db.collection("featuresList").find();
    cursor.forEach(function(data){
        var feature = {
            "featureName": data.featureName,
            "points": data.points,
            "comments": data.comments,
            "usersCommented": data.usersCommented
        }

        featuresList.push(feature);
    }, function (error){
        callback(featuresList);
    });
}

//Create variable in order to export the function
var init = function(callback){
    MongoClient.connect(url, callback, function(error, db){
        requestFeatures(db, function(featuresList){
            db.close();
            callback(featuresList);
        })
    });
};

module.exports.requestFeatures = init;