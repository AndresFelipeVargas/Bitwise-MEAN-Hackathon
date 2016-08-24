var myApp = angular.module("superCoolApp", []);

myApp.controller("mainCtrl", function($scope, $interval, featureRequestService){
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
                    } else if(dataObj.comments.length !== scopeObj.comments.length){
                        scopeObj.comments = dataObj.comments;
                    } else if(dataObj.usersCommented.length !== scopeObj.usersCommented.length){
                        scopeObj.usersCommented = dataObj.usersCommented;
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
        feature.points += 1;
        featureRequestService.upVoteRequest(feature.featureName);
    };

    $scope.downVote = function(feature){
        feature.points -= 1;
        featureRequestService.downVoteRequest(feature.featureName)
    };

    $scope.addComment = function (feature, comment) {
        feature.comments.push(comment);
        this.commentBoxActice = false;
        this.comment = null;
        featureRequestService.commentRequest(feature.featureName, comment);
    }
});

// Custom service that sends request to Express to read/modify the data in the db
myApp.service("featureRequestService", function ($http) {
    this.getFeaturesRequest = function (callback) {
        $http.get("http://127.0.0.1:3000/features").then(callback)
    };

    this.upVoteRequest = function (name) {
        $http.get("http://127.0.0.1:3000/upvote/" + name);
    };

    this.downVoteRequest = function (name) {
        $http.get("http://127.0.0.1:3000/downvote/" + name);
    };

    this.commentRequest = function (name, comment) {
        $http.get("http://127.0.0.1:3000/comment/" + name + "/" + comment);
    };
});