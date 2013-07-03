
/* Tidepools Controllers */

function LandmarkListCtrl( $location, $scope, db) {

    $scope.time = "now";

    $scope.landmarks = db.landmarks.query({name:$scope.query, time:$scope.time});

    $scope.filter = function(filter) {
        $scope.time = filter;

	    $scope.landmarks = db.landmarks.query({name:$scope.query,time:$scope.time});
  	};

    $scope.goTalk = function(url) {
      $location.path('talk/'+url);
    };

    $scope.goMap = function(url) {
      $location.path('map/'+url);
    };


    //search
    $scope.sessionSearch = function() { 
        $scope.landmarks = db.landmarks.query({name:$scope.query, time:"all", session: $scope.searchText});
    };

}
LandmarkListCtrl.$inject = [ '$location', '$scope', 'db'];



function LandmarkDetailCtrl(Landmark, $routeParams, $scope, db, $location) {  

    $scope.landmark = Landmark.get({_id: $routeParams.landmarkId}, function(landmark) {
        $scope.mainImageUrl = landmark.stats.avatar;
        $scope.time = "all";
        $scope.currentTag = $scope.landmark.tags[0];
        $scope.tweets = db.tweets.query({tag: $scope.landmark.tags[0], time:$scope.time});
    });

    $scope.open = function () {
        $scope.etherpad = true;
    };

    $scope.close = function () {
        $scope.etherpad = false;
    };

    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };

    $scope.goMap = function(url) {
      $location.path('map/'+url);
    };

    $scope.setImage = function(imageUrl) {
        $scope.mainImageUrl = imageUrl;
    }

    $scope.goBack = function(){
        window.history.back();
    }
}
LandmarkDetailCtrl.$inject = ['Landmark', '$routeParams', '$scope', 'db'];



function talklistCtrl( $location, $scope, db) {

    $scope.time = "all";
    $scope.types = "all";
    $scope.tweets = db.tweets.query({name:$scope.query, time:$scope.time, limit:100});

    //search
    $scope.tagSearch = function() { 
        var tagged = $scope.searchText.replace("#","");
        $scope.tweets = db.tweets.query({name:$scope.query, time:$scope.time, tag: tagged});
    };
}
talklistCtrl.$inject = [ '$location', '$scope', 'db'];



function talktagCtrl( $location, $scope, $routeParams, db) {

    $scope.currentTag = $routeParams.hashTag;

    $scope.time = "all";
    $scope.tweets = db.tweets.query({tag: $routeParams.hashTag, time:$scope.time});

    $scope.goBack = function(){
        window.history.back();
    }

    $scope.goTalk = function(url) {
      $location.path('talk');
    };

}
talktagCtrl.$inject = [ '$location', '$scope', '$routeParams', 'db'];


function mapCtrl($location, $scope, db) {

        $scope.time = "now";

        db.landmarks.query({ name:$scope.query, time:$scope.time }, //params
        function (data) {   //success

            // var markers2 = {};

            // for (var i=0;i<data.length;i++){ 

            //     markers2[data[i].id] = {
            //         lat: data[i].loc[0],
            //         lng: data[i].loc[1],
            //         //message: data[i].name,
            //         message: '<h5>∆∆∆ Go to: <br><a href=#/session/'+data[i].id+'> '+data[i].name+'</a></h5>',
            //         // focus: true
            //     };
            //     // var what = {
            //     //     lat: 2
            //     // }

            //     //var id = data[i].id;

            //     // var what = "id" : {
            //     //         lat: data[i].loc[0],
            //     //         lng: data[i].loc[1],
            //     //         message: '<h5>∆∆∆ Go to: <br><a href=#/session/'+data[i].id+'> '+data[i].name+'</a></h5>'
            //     //     }

            //     // "what" : {
            //     //     lat: 3,
            //     //     lng: 5
            //     // }



            //      //var markers = id;

            //     //console.log(data[i].id);
            //     //console.log(what);

            // }

            //console.log(markers);


            // $scope.amc = {
            //     lat: 42.36219069106654,
            //     lng: -83.06988000869751,
            //     zoom: 15
            // };

            // $scope.markers = {
            //     markersmarkers2
            // };



            // var markers = {};

            // //var ids = ["1", "2", "3"];

            // for (x in data) {
            //     markers[data[x].id] = {
            //         lat: data[x].loc[0],
            //         lng: data[x].loc[1],
            //         message: '<h5>∆∆∆ Go to: <br><a href=#/session/'+data[x].id+'> '+data[x].name+'</a></h5>'
            //     };
            // }

            //$scope.markers = markers;

            //console.log(markers);

            angular.extend($scope, {
                amc: {
                    lat: 42.36219069106654,
                    lng: -83.06988000869751,
                    zoom: 15
                }
            });

        },
        function (data) {   //failure
            //error handling goes here
        });
        
        //$scope.markers = markers;

        // angular.extend($scope, {
        //     amc: {
        //         lat: 42.36219069106654,
        //         lng: -83.06988000869751,
        //         zoom: 15
        //     }
        // });
    
}
mapCtrl.$inject = [ '$location', '$scope', 'db'];



function maplocCtrl($location, $scope, $routeParams, db) {


        $scope.currentLoc = $routeParams.loc;

        loc_nicknames = {

            McGregor_E : {
                lat: 42.36271390643378,
                lng: -83.07880640029907
            },
            Hilberry_C : {
                lat: 42.36647141605843,
                lng: -83.04028987884521
            },
            Education_204 : {
                lat: 42.3502982579399,
                lng: -83.07427883148193
            },
            Art_Ed_157 : {
                lat: 42.35843292541744,
                lng: -83.07511568069457
            },
            Community_Arts_Auditorium: {
                lat: 42.36650312404415,
                lng: -83.05760622024536
            },
            Art_Ed_156: {
                lat: 42.35719614326714,
                lng: -83.07335615158081
            },
            Hilberry_B: {
                lat: 42.366423854049806,
                lng: -83.0387020111084
            },
            Art_Ed_162: {
                lat: 42.35648260403089,
                lng: -83.06754112243651
            },
            McGregor_LM: {
                lat: 42.36261877669108,
                lng: -83.06801319122314
            },
            Education_189: {
                lat: 42.346000571932635,
                lng: -83.08202505111693
            },
            Hilberry_A: {
                lat: 42.36658239393847,
                lng: -83.03694248199463
            },
            Art_Ed_154: {
                lat: 42.357132717885335,
                lng: -83.07477235794066
            },
            Education_169: {
                lat: 42.345984712768576,
                lng: -83.08539390563965
            },
            McGregor_J: {
                lat: 42.36566285701487,
                lng: -83.07786226272583
            },
            Education_300: {
                lat: 42.35099600949203,
                lng: -83.05988073348999
            },
            North_side_of_McGregor: {
                lat: 42.364109126111664,
                lng: -83.08820486068726
            },
            McGregor_BC: {
                lat: 42.362840745866635,
                lng: -83.08374166488647
            },
            McGregor_Lobby: {
                lat: 42.36415668987275,
                lng: -83.08492183685303
            },
            McGregor_FGH: {
                lat: 42.36288831058794,
                lng: -83.07550191879272
            },
            Towers_Lounge_: {
                lat: 42.352930643737494,
                lng: -83.0432939529419
            },
            Cass_Cafe_: {
                lat: 42.3486807131878,
                lng: -83.03953886032104
            },
            Museum_of_Contemporary_Art_Detroit: {
                lat: 42.348268391201444,
                lng: -83.03762912750243
            },
            Charles_Wright_Museum_of_African_American_History: {
                lat: 42.35018725129699,
                lng: -83.03619146347046
            },
            Wasabi_Restaurant: {
                lat: 42.353057502919036,
                lng: -83.03797245025633
            },
            McGregor: {
                lat: 42.3641249807027,
                lng: -83.08665990829468
            },
            Art_Ed_161: {
                lat: 42.35822679674948,
                lng: -83.07157516479492
            },
            McGregor_I: {
                lat: 42.36607506488643,
                lng: -83.07382822036743
            },
            Outer_Galleries: {
                lat: 42.36466403441681,
                lng: -83.05742383003235
            },
            Majestic_Theater_Complex: {
                lat: 42.34741202151109,
                lng: -83.03762912750243
            },
            The_Commons_: {
                lat: 42.36407741691762,
                lng: -83.08193922042847
            },
            McGregor_A: {
                lat: 42.36269805148666,
                lng: -83.08674573898315
            }
       };

      
        angular.extend($scope, {
                amc: {
                    lat: loc_nicknames[$routeParams.loc].lat,
                    lng: loc_nicknames[$routeParams.loc].lng,
                    zoom: 18
                },
                markers: {
                    m: {
                        lat: loc_nicknames[$routeParams.loc].lat,
                        lng: loc_nicknames[$routeParams.loc].lng,
                        message: $routeParams.loc,
                        focus: true
                    }

                }
            });

    $scope.goBack = function(){
        window.history.back();
    }

    
}
maplocCtrl.$inject = [ '$location', '$scope', '$routeParams', 'db'];


var sessionsNow = function ($scope, db) {

    $scope.time = "now";
    $scope.landmarks = db.landmarks.query({name:$scope.query, time:$scope.time});
};


