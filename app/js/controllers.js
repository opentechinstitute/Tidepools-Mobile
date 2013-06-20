// 'use strict';

// /* Controllers */

// function PhoneListCtrl($scope, Phone) {
//   $scope.phones = Phone.query();
//   $scope.orderProp = 'age';

//   $scope.alert = function() {
// 	    alert('wht');
//   	};
// }

// //PhoneListCtrl.$inject = ['$scope', 'Phone'];

// function alertCtrl($scope) {

// 	$scope.alert = function() {
// 	    alert('lol');
//   	};

// }  

// function PhoneDetailCtrl($scope, $routeParams, Phone) {

//   $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {

//   	console.log(phone);
//     $scope.mainImageUrl = phone.images[0];
//   });

//   $scope.setImage = function(imageUrl) {
//     $scope.mainImageUrl = imageUrl;
//   }
// }

// //PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];



/* App Controllers */








// myApp.controller('MyCtrl', function($scope) {

//     $scope.addresses = [
//         {'state': 'AL'},
//         {'state': 'CA'},
//         {'state': 'FL'}
//     ];

//     $scope.lov_state = [
//         {'lookupCode': 'AL', 'description': 'Alabama'},
//         {'lookupCode': 'FL', 'description': 'Florida'},
//         {'lookupCode': 'CA', 'description': 'California'},
//         {'lookupCode': 'DE', 'description': 'Delaware'}
//     ];
// });


function PhoneListCtrl( $location, $scope, db) {

    //$scope.orderProp = '_id';
   // $scope.order = -1;
    //$scope.phones = Phone.query({order:$scope.orderProp, name:$scope.query});

    //$scope.phones = db.phones.query({order:$scope.orderProp, name:$scope.query});

    $scope.time = "now";

    $scope.phones = db.phones.query({name:$scope.query, time:$scope.time});


    //var phones = $scope.phones;
    
    // $scope.remove = function (phone) {
    //     var ok = db.phone.delete({_id: phone._id}, function (res) {
    //         console.log('indexOf: '+phones.indexOf(phone));
    //         if (res.ok === 1) {
    //             phones.splice(phones.indexOf(phone), 1);
    //         } else {
    //             alert(JSON.stringify(res.ok));
    //         }
    //     })
    // }
    

    $scope.filter = function(filter) {
        $scope.time = filter;
	    $scope.phones = db.phones.query({name:$scope.query, time:$scope.time});
  	};

    $scope.goTalk = function(url) {
       // alert(hash);
      $location.path('talk/'+url);
    };

    $scope.goMap = function(url) {
       // alert(hash);
      $location.path('map/'+url);
    };


    //search
    $scope.sessionSearch = function() { 
        //var tagged = $scope.searchText.replace("#","");
        $scope.phones = db.phones.query({name:$scope.query, time:"all", session: $scope.searchText});
    };

    // $scope.nextPage = function() {
    //     if ($scope.busy) return;
    //     $scope.busy = true;

    //     var url = "http://api.reddit.com/hot?after=" + $scope.after + "&jsonp=JSON_CALLBACK";
    //     $http.jsonp(url).success(function(data) {
    //       var items = data.data.children;
    //       for (var i = 0; i < items.length; i++) {
    //         $scope.items.push(items[i].data);
    //       }
    //       $scope.after = "t3_" + $scope.items[$scope.items.length - 1].id;
    //       $scope.busy = false;
    //     });
    // };

    // $scope.items = [
    //     "∆ The first choice!",
    //     "∆ And another choice for you.",
    //     "∆ but wait! A third!"
    // ];

    
}
PhoneListCtrl.$inject = [ '$location', '$scope', 'db'];



function PhoneDetailCtrl(Phone, $routeParams, $scope, db) {  


    //console.log($scope);

    $scope.phone = Phone.get({_id: $routeParams.phoneId}, function(phone) {

        //$scope.mainImageUrl = phone.details.images[0];
        $scope.mainImageUrl = phone.stats.avatar;

       // console.log($scope.phone.tags);

        $scope.time = "all";

        $scope.currentTag = $scope.phone.tags[0];

        $scope.tweets = db.tweets.query({tag: $scope.phone.tags[0], time:$scope.time});
    });

    

  $scope.open = function () {
    $scope.etherpad = true;
  };

  $scope.close = function () {
    $scope.etherpad = false;
  };

  // $scope.items = ['item1', 'item2'];

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
}
PhoneDetailCtrl.$inject = ['Phone', '$routeParams', '$scope', 'db'];




function talklistCtrl( $location, $scope, db) {

    $scope.time = "all";
    $scope.types = "all";
    $scope.tweets = db.tweets.query({name:$scope.query, time:$scope.time});

    //search
    $scope.tagSearch = function() { 
        var tagged = $scope.searchText.replace("#","");
        $scope.tweets = db.tweets.query({name:$scope.query, time:$scope.time, tag: tagged});
    };
}
talklistCtrl.$inject = [ '$location', '$scope', 'db'];




function talktagCtrl( $location, $scope, $routeParams, db) {

    $scope.currentTag = $routeParams.hashTag;

    //console.log($routeParams);

    $scope.time = "all";
    $scope.tweets = db.tweets.query({tag: $routeParams.hashTag, time:$scope.time});

    //search
    $scope.tagSearch = function() { 
        var tagged = $scope.searchText.replace("#","");
        $scope.tweets = db.tweets.query({name:$scope.query, time:$scope.time, tag: tagged});
    };

}
talktagCtrl.$inject = [ '$location', '$scope', '$routeParams', 'db'];


function mapCtrl($location, $scope, db) {

       //-83.08968544006348 42.34157571000487 -83.03187847137451 42.36986407977127

        $scope.time = "all";

        // $scope.phones = db.phones.query({name:$scope.query, time:$scope.time});

        
        var markers = {};

        angular.extend($scope, {
            amc: {
                lat: 42.36219069106654,
                lng: -83.06988000869751,
                zoom: 15
            }
        });
           

        db.phones.query({ name:$scope.query, time:$scope.time }, //params
        function (data) {   //success
             
            for (var i=0;i<data.length;i++){ 

                markers[data[i].id] = {
                    lat: data[i].loc[0],
                    lng: data[i].loc[1],
                    //message: data[i].name,
                    message: 'Go to: <a href=#/session/'+data[i].id+'> '+data[i].name+'</a>',
                    focus: true
                }
            }

        },
        function (data) {   //failure
            //error handling goes here
        });

        $scope.markers = markers;

        console.log(markers);

        
        

    
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

       //console.log(loc_nicknames[$routeParams.loc].lat);

        // $scope.time = "all";

        // var markers = {};

        // $scope.phones = db.phones.query({name:$scope.query, time:$scope.time});

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

        // db.phones.query({ loc:$routeParams.loc, time:$scope.time }, //params
        // function (data) {   //success
        //     //$scope.entities = data.data;
        //     //console.log(data);

            

        //     //console.log(data);
             
        //     // for (var i=0;i<data.length;i++){ 
          
        //     //     markers[data[i].id] = {
        //     //         lat: data[i].loc[0],
        //     //         lng: data[i].loc[1],
        //     //         message: data[i].name,
        //     //         focus: true
        //     //     };
        //     // }


        // },
        // function (data) {   //failure
        //     //error handling goes here
        // });

        //console.log(markers);
       // $scope.markers = markers;

    $scope.goBack = function(){
        window.history.back();
    }

    
}
maplocCtrl.$inject = [ '$location', '$scope', '$routeParams', 'db'];
















var ModalDemoCtrl = function ($scope) {

      $scope.open = function () {
        $scope.shouldBeOpen = true;
      };

      $scope.close = function () {
        $scope.closeMsg = 'I was closed at: ' + new Date();
        $scope.shouldBeOpen = false;
      };

      $scope.items = ['item1', 'item2'];

      $scope.opts = {
        backdropFade: true,
        dialogFade:true
      };

};







// function TodoCtrl($scope) {
//   $scope.todos = [
//     {text:'learn angular', done:true},
//     {text:'build an angular app', done:false}];
 
//   $scope.addTodo = function() {
//     $scope.todos.push({text:$scope.todoText, done:false});
//     $scope.todoText = '';
//   };
 
//   $scope.remaining = function() {
//     var count = 0;
//     angular.forEach($scope.todos, function(todo) {
//       count += todo.done ? 0 : 1;
//     });
//     return count;
//   };
 
//   $scope.archive = function() {
//     var oldTodos = $scope.todos;
//     $scope.todos = [];
//     angular.forEach(oldTodos, function(todo) {
//       if (!todo.done) $scope.todos.push(todo);
//     });
//   };
// }


// function PhoneEditCtrl(Phone, $routeParams, $location, $scope) {
//     $scope.phone = Phone.get({_id: $routeParams._id})
    
//     $scope.save = function () {
//         Phone.save({}, $scope.phone, function (res) { if (res.ok === 1) { $location.path("/phones");}} ) 
//     }
// }
// PhoneEditCtrl.$inject = ['Phone', '$routeParams', '$location', '$scope'];

// var pho
// function PhoneNewCtrl(Phone, $routeParams, $scope) {   
//     pho = $scope.phone = new Phone();
    
//     console.log($scope.phone)
    
//     $scope.save = function () {
//         Phone.save({}, $scope.phone, function (res) { if (res.ok === 1) { $location.path("/phones");}}) 
//     }
// }
// PhoneNewCtrl.$inject = ['Phone', '$routeParams', '$scope'];

// function PhoneAggreCtrl(Phone, $routeParams, $scope) {   
//     $scope.count = Phone.count();
//     $scope.distinct = Phone.distinct({}, {key:"carrier"});
//     $scope.group = Phone.group({},{
//                             key: {"carrier":true },   cond: {}, 
//                             initial: {sum: 0, count:0, max:0, avg:0}, 
//                             reduce: "function(doc,out){out.sum += doc.age; out.count += 1; out.max = Math.max(out.max, doc.age); out.avg = out.sum/out.count;}"
//                         });
//     $scope.mapReduce = Phone.mapReduce({},{ 
//                             "map": "function(){emit(this.details.android.os, 1);}", 
//                             "reduce": "function(key, values){return values.length;}"  
//                         });
// }
// PhoneAggreCtrl.$inject = ['Phone', '$routeParams', '$scope'];