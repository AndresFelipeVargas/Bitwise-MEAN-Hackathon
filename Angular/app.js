var myApp = angular.module("superCoolApp", []);

myApp.controller("mainCtrl", function($scope){
    //Creating dummy data to fill in the page
    $scope.featureList = [
        {
            featureName : "Login with Facebook",
            points: 0,
            comments: [],
            usersCommented: {}
        },
        {
            featureName : "Display the user’s twitter feed (handle entered in the user’s profile)",
            points: 0,
            comments: [],
            usersCommented: {}
        },
        {
            featureName : "Threaded comments",
            points: 0,
            comments: [],
            usersCommented: {}
        },
        {
            featureName : "Today’s weather drawn from the weather.com API and displayed according the user’s zip code (zipcode entered in the user’s profile)",
            points: 0,
            comments: [],
            usersCommented: {}
        },
        {
            featureName : "The ability to upload a profile photo",
            points: 0,
            comments: [],
            usersCommented: {}
        }
    ];

    $scope.upVote = function(feature){
        feature.points += 1;
    };

    $scope.downVote = function(feature){
        feature.points -= 1;
    };

    $scope.pushComment = function (feature, comment) {
        feature.comments.push(comment);
        this.showBox = false;
        this.message = null;
    }
});