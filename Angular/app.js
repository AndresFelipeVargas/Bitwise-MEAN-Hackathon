var myApp = angular.module("superCoolApp", []);

myApp.controller("mainCtrl", function($scope, $interval, featureRequestService){
    //Dummy user
    $scope.user = "otherTestUser";

    //Grab data from mongoDB
    featureRequestService.getFeaturesRequest(function(dataRecieved){
        $scope.featureList = dataRecieved.data;
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

    $scope.upVote = function(feature){
        if(feature.usersVoted[$scope.user] === true){
            alert("Sorry. You can only vote once for a feature!");
        } else {
            feature.points += 1;
            feature.usersVoted[$scope.user] = true;
            featureRequestService.upVoteRequest(feature._id, $scope.user);
        }
    };

    $scope.downVote = function(feature){
        if(feature.usersVoted[$scope.user] === true){
            alert("Sorry. You can only vote once for a feature!");
        } else {
            feature.points -= 1;
            feature.usersVoted[$scope.user] = true;
            featureRequestService.downVoteRequest(feature._id, $scope.user)
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

    this.upVoteRequest = function (id, user) {
        $http.post("http://127.0.0.1:3000/upvote/" + id + "/" + user);
    };

    this.downVoteRequest = function (id, user) {
        $http.post("http://127.0.0.1:3000/downvote/" + id + "/" + user);
    };

    this.commentRequest = function (id, comment, user) {
        $http.post("http://127.0.0.1:3000/comment/" + id + "/" + comment + "/" + user);
    };
});