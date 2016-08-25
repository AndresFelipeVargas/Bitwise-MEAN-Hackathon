var myApp = angular.module("superCoolApp", []);

myApp.controller("mainCtrl", function($scope, $interval, featureRequestService){
    //Dummy user
    $scope.user = "otherTestUser";

    //Sets the appropriate vote status for the features. This is to set the default up/down vote for the UI.
    function grabVoteStatus(featureList){
        featureList.forEach(function(feature){
            if(feature.usersVoted[$scope.user] === "downVote"){
                feature.styleDown = "downVote";
                feature.styleUp = "";
            } else if(feature.usersVoted[$scope.user] === "upVote"){
                feature.styleDown = "";
                feature.styleUp = "upVote";
            }
        });
    }

    //Grab data from mongoDB
    featureRequestService.getFeaturesRequest(function(dataRecieved){
        $scope.featureList = dataRecieved.data;

        grabVoteStatus( $scope.featureList);
    });

    //Refresh the data from the server every 5 seconds
    $interval(function(){
        featureRequestService.getFeaturesRequest(function(dataRecieved){
            if(dataRecieved.data.length === $scope.featureList.length) {
                for (i = 0; i < dataRecieved.data.length; i++) {
                    var dataObj = dataRecieved.data[i];
                    var scopeObj = $scope.featureList[i];

                    //Checks to see if any of the local $scope properties' value differ from the database's data
                    //If they do, replace the local $scope data with the database's data
                    if (dataObj.points !== scopeObj.points){
                        scopeObj.points = dataObj.points;
                    }

                    if(dataObj.comments.length !== scopeObj.comments.length){
                        scopeObj.comments = dataObj.comments;
                    }

                    if(Object.keys(dataObj.usersVoted).length !== Object.keys(scopeObj.usersVoted).length){
                        scopeObj.usersVoted = dataObj.usersVoted;
                    }
                }
            } else {
                $scope.featureList = dataRecieved.data;
            }
        });
    }, 5000);

    //Variables and function used for sorting the data
    $scope.sortBy = "featureName";
    $scope.reverseSort = false;

    $scope.sortFeatures = function(sortType){
        if($scope.sortBy === sortType){ // This if statement is to check if the list needs to be reversed
            $scope.reverseSort = !$scope.reverseSort;
        } else{
            $scope.sortBy = sortType;

            if(sortType === "points"){ // This is done in order to display the higher points first by default
                $scope.reverseSort = true;
            } else {
                $scope.reverseSort = false;
            }
        }
    };

    // User is allowed a total of one vote. They can either up/down vote or unvote.
    // If the user unvotes, they are able to revote. The two functions below allows for the
    // user to unvote and revote, all while updating the db.

    $scope.upVote = function(feature){
        var voteSet = "";
        if(feature.usersVoted[$scope.user] === "upVote"){
            alert("Sorry. You can't up vote this feature again");
        } else {
            if(feature.usersVoted[$scope.user] === "downVote"){ // This is the user unvoting
                feature.styleDown = "";
                feature.usersVoted[$scope.user] = ""; // Set their vote to empty so that they can revote again
            } else{
                voteSet = "upVote";
                feature.styleUp = "upVote";
                feature.usersVoted[$scope.user] = "upVote";
            }
            feature.points += 1;
            featureRequestService.upVoteRequest(feature._id, $scope.user, voteSet);
        }
    };

    $scope.downVote = function(feature){
        var voteSet = "";
        if(feature.usersVoted[$scope.user] === "downVote"){
            alert("Sorry. You can't down vote this feature again!");
        } else {
            if(feature.usersVoted[$scope.user] === "upVote"){ // This is the user unvoting
                feature.styleUp = "";
                feature.usersVoted[$scope.user] = ""; // Set their vote to empty so that they can revote again
            } else{
                voteSet = "downVote"
                feature.styleDown = "downVote";
                feature.usersVoted[$scope.user] = "downVote";
            }
            feature.points -= 1;
            featureRequestService.downVoteRequest(feature._id, $scope.user, voteSet);
        }
    };

    $scope.addComment = function (feature, comment) {
        if(comment !== undefined){
            feature.comments.push({text: comment, user: $scope.user});
            this.commentBoxActice = false;
            this.comment = null;
            featureRequestService.commentRequest(feature._id, comment, $scope.user);
        } else{
            this.commentBoxActice = false;
            alert("Blank comments cannot be submitted!");
        }

    }
});

// Custom service that sends request to Express to read/modify the data in the db
myApp.service("featureRequestService", function ($http) {
    this.getFeaturesRequest = function (callback) {
        $http.get("http://127.0.0.1:3000/features").then(callback)
    };

    this.upVoteRequest = function (id, user, voteSet) {
        $http.post("http://127.0.0.1:3000/upvote", JSON.stringify({id: id, user: user, voteSet: voteSet}));
    };

    this.downVoteRequest = function (id, user, voteSet) {
        $http.post("http://127.0.0.1:3000/downvote", {id: id, user: user, voteSet: voteSet});
    };

    this.commentRequest = function (id, comment, user) {
        $http.post("http://127.0.0.1:3000/comment", {id: id, comment: comment, user: user});
    };
});