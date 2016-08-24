var myApp = angular.module("superCoolApp", []);

myApp.controller("mainCtrl", function($scope, $interval, featureRequestService){
    //Grab data from mongoDB

    featureRequestService.getFeatures(function(dataRecieved){
        $scope.featureList = dataRecieved.data;
    });

    //Creating dummy data to fill in the page
    // $scope.featureList = [
    //     {
    //         featureName : "Login with Facebook",
    //         points: 0,
    //         comments: [],
    //         usersCommented: {}
    //     },
    //     {
    //         featureName : "Display the user’s twitter feed (handle entered in the user’s profile)",
    //         points: 0,
    //         comments: [],
    //         usersCommented: {}
    //     },
    //     {
    //         featureName : "Threaded comments",
    //         points: 0,
    //         comments: [],
    //         usersCommented: {}
    //     },
    //     {
    //         featureName : "Today’s weather drawn from the weather.com API and displayed according the user’s zip code (zipcode entered in the user’s profile)",
    //         points: 0,
    //         comments: [],
    //         usersCommented: {}
    //     },
    //     {
    //         featureName : "The ability to upload a profile photo",
    //         points: 0,
    //         comments: [],
    //         usersCommented: {}
    //     }
    // ];

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
    };

    $scope.downVote = function(feature){
        feature.points -= 1;
    };

    $scope.addComment = function (feature, comment) {
        feature.comments.push(comment);
        this.commentBoxActice = false;
        this.comment = null;
    }
});

myApp.service("featureRequestService", function ($http) {
   this.getFeatures = function (callback) {
       $http.get("http://127.0.0.1:3000/features").then(callback)
   }
});