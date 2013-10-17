
/* Tidepools Controllers */

function LandmarkListCtrl( $location, $scope, db) {

    //---- Initial Query on Page Load -----//
    // $scope.queryType = "all";
    // $scope.queryFilter = "all";
    //Events Now example:
    $scope.queryType = "events";
    $scope.queryFilter = "all";
    //$scope.showTime = true; //displaying sub menu for events

    $scope.landmarks = db.landmarks.query({ queryType:$scope.queryType, queryFilter:$scope.queryFilter });
    //---------//


    //------- For Switching Button Classes ------//
    $scope.items = ['all', 'events','places','search']; //specifying types, (probably better way to do this)
    $scope.selected = $scope.items[1]; //starting out with selecting EVENTS 

    $scope.select= function(item) {
       $scope.selected = item; 
    };

    $scope.itemClass = function(item) {
        return item === $scope.selected ? 'btn btn-block btn-lg btn-inverse' : 'btn';
    };
    //---------------------------//

 
    $scope.tweets = db.tweets.query({limit:1});


    //query function for all sorting buttons
    $scope.filter = function(type, filter) {
	    $scope.landmarks = db.landmarks.query({ queryType: type, queryFilter: filter });
  	};

    $scope.goTalk = function(url) {
      $location.path('talk/'+url);
    };

    $scope.goMap = function(url) {
      $location.path('map/'+url);
    };

    $scope.goNew = function() {
        $location.path('new');
    };

    //search query
    $scope.sessionSearch = function() { 
        $scope.landmarks = db.landmarks.query({name:$scope.query, time:"all", session: $scope.searchText});
    };

}
LandmarkListCtrl.$inject = [ '$location', '$scope', 'db'];



function LandmarkDetailCtrl(Landmark, $routeParams, $scope, db, $location) {  

    $scope.option = $routeParams.option;

    $scope.landmark = Landmark.get({_id: $routeParams.landmarkId}, function(landmark) {
        $scope.mainImageUrl = landmark.stats.avatar;
        $scope.time = "all";
        $scope.currentTag = $scope.landmark.tags;
        $scope.tweets = db.tweets.query({tag: $scope.landmark.tags, time:$scope.time});
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

    $scope.setImage = function(imageUrl) {
        $scope.mainImageUrl = imageUrl;
    }

    $scope.goBack = function(){
        window.history.back();
    }

    $scope.edit = function(){
        $location.path('/landmark/'+$routeParams.landmarkId+'/edit');
    }
}
LandmarkDetailCtrl.$inject = ['Landmark', '$routeParams', '$scope', 'db', '$location'];



function LandmarkNewCtrl($location, $scope, $routeParams, db) {

    //Showing form options based on type of "new" request
    if ($routeParams.type == '' || $routeParams.type == 'place' || $routeParams.type == 'event' || $routeParams.type == 'job'){

    }
    else {
        $location.path('/new');
    }

    var currentDate = new Date();

    //----- Loading sub categories from global settings ----//
    $scope.subTypes = [];

    if ($routeParams.type == 'event'){
        $scope.subTypes = $scope.subTypes.concat(eventCategories);
    }

    if ($routeParams.type == 'place'){
        $scope.subTypes = $scope.subTypes.concat(placeCategories);
    }
    //-----//

    $scope.addEndDate = function () {
        $scope.landmark.date.end = $scope.landmark.date.start;
    }

    angular.element('#fileupload').fileupload({
        url: '/api/upload',
        dataType: 'text',
        progressall: function (e, data) {  

            $('#progress .bar').css('width', '0%');

            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        },
        done: function (e, data) {

            $('#uploadedpic').html('');
            $('#preview').html('');
            $('<p/>').text('Saved: '+data.originalFiles[0].name).appendTo('#uploadedpic');
            $('<img src="'+ data.result +'">').load(function() {
              $(this).width(150).height(150).appendTo('#preview');
            });
            $scope.landmark.stats.avatar = data.result;
        }
    });


    $scope.locsearch = function () {

        var geocoder = new google.maps.Geocoder();

          if (geocoder) {
             geocoder.geocode({ 'address': $scope.landmark.location}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                  $scope.$apply(function () {
                        
                        angular.extend($scope, {
                            amc: {
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng(),
                                zoom: global_mapCenter.zoom
                            },
                            markers: {
                                m: {
                                    lat: results[0].geometry.location.lat(),
                                    lng: results[0].geometry.location.lng(),
                                    message: "Drag to Location",
                                    focus: true,
                                    draggable: true
                                }
                            }
                        });
                    });

                } 
                else {
                  console.log('No results found: ' + status);
                }
             });
          }
    }



    $scope.save = function () {

        if (!$scope.landmark.date.end){
            $scope.landmark.date.end = $scope.landmark.date.start;
        }

        $scope.landmark.datetext = {
            start: $scope.landmark.date.start,
            end: $scope.landmark.date.end
        }

        //---- Date String converter to avoid timezone issues...could be optimized probably -----//
        $scope.landmark.date.start = new Date($scope.landmark.date.start).toISOString();
        $scope.landmark.date.end = new Date($scope.landmark.date.end).toISOString();

        $scope.landmark.date.start = dateConvert($scope.landmark.date.start);
        $scope.landmark.date.end = dateConvert($scope.landmark.date.end);

        $scope.landmark.date.start = $scope.landmark.date.start.replace(/(\d+)-(\d+)-(\d+)/, '$2-$3-$1'); //rearranging so value still same in input field
        $scope.landmark.date.end = $scope.landmark.date.end.replace(/(\d+)-(\d+)-(\d+)/, '$2-$3-$1');

        function dateConvert(input){
            var s = input;
            var n = s.indexOf('T');
            return s.substring(0, n != -1 ? n : s.length);
        }
        //-----------//

        if (!$scope.landmark.time.start){
            $scope.landmark.time.start = "00:00";
        }

        if (!$scope.landmark.time.end){
            $scope.landmark.time.end = "23:59";
        }

        $scope.landmark.timetext = {
            start: $scope.landmark.time.start,
            end: $scope.landmark.time.end
        } 

        if (!$scope.landmark.specialEvent){
            $scope.landmark.specialEvent = "false";
        }

        $scope.landmark.loc = [$scope.markers.m.lat,$scope.markers.m.lng];

        db.landmarks.create($scope.landmark, function(response){
            $location.path('/landmark/'+response[0].id+'/new');
        });
    }

    angular.extend($scope, {
        amc: global_mapCenter,
        markers: {
            m: {
                lat: global_mapCenter.lat,
                lng: global_mapCenter.lng,
                message: "Drag to Location",
                focus: true,
                draggable: true
            }
        }
    });

    $scope.landmark = { 
        stats: { 
            avatar: "img/tidepools/default.jpg" 
        },
        type: $routeParams.type,
        date: {
            start: currentDate
        }
    };

    $scope.landmark.loc = [];
}

LandmarkNewCtrl.$inject = ['$location', '$scope', '$routeParams','db'];


function LandmarkEditCtrl(Landmark, $location, $scope, $routeParams, db, $timeout) {

    //if authenticate, show and provide this functionality:

    //if not, login plz k thx



    Landmark.get({_id: $routeParams.landmarkId}, function(landmark) {

        $scope.landmark = landmark;
        $scope.landmark.location = landmark.loc_nicknames[0];
        $scope.landmark.idCheck = landmark.id;

        //----- Loading sub categories from global settings ----//
        $scope.subTypes = [];

        if (landmark.type == 'event'){
            $scope.subTypes = $scope.subTypes.concat(eventCategories);
        }

        if (landmark.type == 'place'){
            $scope.subTypes = $scope.subTypes.concat(placeCategories);
        }
        //-----//

        if (landmark.type=="event"){

            $scope.landmark.date = {
                start : landmark.timetext.datestart,
                end: landmark.timetext.dateend
            }

            $scope.landmark.time = {
                start: landmark.timetext.timestart,
                end: landmark.timetext.timeend
            } 
        }

        $timeout(leafletUpdate, 500); //temp solution? leaflet isn't updating properly after callback 

        function leafletUpdate(){

             angular.extend($scope, {
                amc: {
                    lat: $scope.landmark.loc[0],
                    lng: $scope.landmark.loc[1],
                    zoom: global_mapCenter.zoom
                },
                markers: {
                    m: {
                        lat: $scope.landmark.loc[0],
                        lng: $scope.landmark.loc[1],
                        message: "Drag to Location",
                        focus: true,
                        draggable: true
                    }
                }
            });
        }

        $('<img src="'+ $scope.landmark.stats.avatar +'">').load(function() {
          $(this).width(150).height(150).appendTo('#preview');
        });

    });


    var currentDate = new Date();

    $scope.addEndDate = function () {
        $scope.landmark.date.end = $scope.landmark.date.start;
    }

    angular.element('#fileupload').fileupload({
        url: '/api/upload',
        dataType: 'text',
        progressall: function (e, data) {  

            $('#progress .bar').css('width', '0%');

            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        },
        done: function (e, data) {

            $('#uploadedpic').html('');
            $('#preview').html('');

            $('<p/>').text('Saved: '+data.originalFiles[0].name).appendTo('#uploadedpic');

            $('<img src="'+ data.result +'">').load(function() {
              $(this).width(150).height(150).appendTo('#preview');
            });

            $scope.landmark.stats.avatar = data.result;

        }
    });


    $scope.locsearch = function () {

        var geocoder = new google.maps.Geocoder();

          if (geocoder) {
             geocoder.geocode({ 'address': $scope.landmark.location}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                  $scope.$apply(function () {

                        angular.extend($scope, {
                            amc: {
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng(),
                                zoom: global_mapCenter.zoom
                            },
                            markers: {
                                m: {
                                    lat: results[0].geometry.location.lat(),
                                    lng: results[0].geometry.location.lng(),
                                    message: "Drag to Location",
                                    focus: true,
                                    draggable: true
                                }
                            }
                        });

                    });

                } 
                else {
                  console.log('No results found: ' + status);
                }
             });
          }
    }



    $scope.save = function () {

        if ($scope.landmark.type =="event"){
            if (!$scope.landmark.date.end){

                $scope.landmark.date.end = $scope.landmark.date.start;
            }

            $scope.landmark.datetext = {
                start: $scope.landmark.date.start,
                end: $scope.landmark.date.end
            }

            //---- Date String converter to avoid timezone issues...could be optimized probably -----//
            $scope.landmark.date.start = new Date($scope.landmark.date.start).toISOString();
            $scope.landmark.date.end = new Date($scope.landmark.date.end).toISOString();

            $scope.landmark.date.start = dateConvert($scope.landmark.date.start);
            $scope.landmark.date.end = dateConvert($scope.landmark.date.end);

            $scope.landmark.date.start = $scope.landmark.date.start.replace(/(\d+)-(\d+)-(\d+)/, '$2-$3-$1'); //rearranging so value still same in input field
            $scope.landmark.date.end = $scope.landmark.date.end.replace(/(\d+)-(\d+)-(\d+)/, '$2-$3-$1');

            function dateConvert(input){
                var s = input;
                var n = s.indexOf('T');
                return s.substring(0, n != -1 ? n : s.length);
            }
            //-----------//

            if (!$scope.landmark.time.start){
                $scope.landmark.time.start = "00:00";
            }

            if (!$scope.landmark.time.end){
                $scope.landmark.time.end = "23:59";
            }

            $scope.landmark.timetext = {

                start: $scope.landmark.time.start,
                end: $scope.landmark.time.end
            } 

        }

        //a temp fix for a problem with marker scope "unsyncing" from the marker's map position. using globalEditLoc global variable to pass values for now..better with $rootScope or legit fix...
        if (!globalEditLoc.lat){

            $scope.landmark.loc = [$scope.markers.m.lat,$scope.markers.m.lng];
        }

        else {
            $scope.landmark.loc = [globalEditLoc.lat,globalEditLoc.lng];
        }


        db.landmarks.create($scope.landmark, function(response){

            $location.path('/landmark/'+response[0].id+'/new');
        });

    }
 
    $scope.delete = function (){

        var deleteItem = confirm('Are you sure you want to delete this item?'); 

        if (deleteItem) {
            Landmark.del({_id: $scope.landmark._id}, function(landmark) {
                $location.path('/'); 
            });
        }
    }

    angular.extend($scope, {
        amc: global_mapCenter,
        markers: {
            m: {
                lat: global_mapCenter.lat,
                lng: global_mapCenter.lng,
                message: "Drag to Location",
                focus: true,
                draggable: true
            }
        }
    });

}

LandmarkEditCtrl.$inject = ['Landmark','$location', '$scope', '$routeParams','db','$timeout'];



function talklistCtrl( $location, $scope, db) {

    $scope.tweets = db.tweets.query({limit:100});
    $scope.globalhashtag = global_hashtag;

    //search
    $scope.tagSearch = function() { 
        var tagged = $scope.searchText.replace("#","");
        $scope.tweets = db.tweets.query({tag: tagged});
    };
}
talklistCtrl.$inject = [ '$location', '$scope', 'db'];



function talktagCtrl( $location, $scope, $routeParams, db) {

    $scope.currentTag = $routeParams.hashTag;
    $scope.globalhashtag = global_hashtag;

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


function mapCtrl($location, $scope, db, $timeout) {

        $scope.queryType = "all";
        $scope.queryFilter = "all";

        queryMap($scope.queryType, $scope.queryFilter); //showing all at first

        //------- For Switching Button Classes ------//
        $scope.items = ['all', 'events','places','search']; //specifying types, (probably better way to do this)
        $scope.selected = $scope.items[0]; //starting out with selecting EVENTS 

        $scope.select= function(item) {
           $scope.selected = item; 
        };

        $scope.itemClass = function(item) {
            return item === $scope.selected ? 'btn btn-block btn-lg btn-inverse' : 'btn';
        };
        //---------------------------//

        $scope.filter = function(type, filter) {
            queryMap(type,filter);
        };

        function queryMap(type, filter){

            db.landmarks.query({ queryType: type, queryFilter: filter },

            function (data) {   //success

                var markerCollect = {};

                for (var i=0;i<data.length;i++){ 

                    markerCollect[data[i].id] = {
                        lat: data[i].loc[0],
                        lng: data[i].loc[1],
                        message: '<h4><img style="width:70px;" src="'+data[i].stats.avatar+'"><a href=#/landmark/'+data[i].id+'> '+data[i].name+'</a></h4>' 
                    }
                }

                $timeout(leafletUpdate, 500); //temp solution? leaflet isn't updating properly after callback...

                function leafletUpdate(){

                     angular.extend($scope, { 
                        amc: global_mapCenter,
                        markers: markerCollect
                    });
                }
            },
            function (data) {   //failure
                //error handling goes here
            });

        }

        angular.extend($scope, { 
            amc: global_mapCenter,
            markers : {}
        });
    
}
mapCtrl.$inject = [ '$location', '$scope', 'db', '$timeout'];


//handles showing a specific landmark's location on the map, accepts lat long coordinates in routeparams
function maplocCtrl($location, $scope, $routeParams, db) {

        $scope.lat = $routeParams.lat;
        $scope.lng = $routeParams.lng;
      
        angular.extend($scope, {
                amc: {
                    lat: $scope.lat,
                    lng: $scope.lng,
                    zoom: global_mapCenter.zoom
                },
                markers: {
                    m: {
                        lat: $scope.lat,
                        lng: $scope.lng,
                        message: '<h4><a href=#/landmark/'+$routeParams.id+'>'+$routeParams.id+'</a></h4>',
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

    $scope.landmarks = db.landmarks.query({ queryType: 'events', queryFilter: 'now' });
};


