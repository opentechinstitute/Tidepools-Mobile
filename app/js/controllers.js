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
    
}
PhoneListCtrl.$inject = [ '$location', '$scope', 'db'];


function alertCtrl($scope) {

	$scope.alert = function() {
	    alert('lol');
  	};

}  


function PhoneDetailCtrl(Phone, $routeParams, $scope) {  


    console.log($scope);

    $scope.phone = Phone.get({_id: $routeParams.phoneId}, function(phone) {

        //$scope.mainImageUrl = phone.details.images[0];
        $scope.mainImageUrl = phone.stats.avatar;

    });
    $scope.setImage = function(imageUrl) {
        $scope.mainImageUrl = imageUrl;
    }
}
PhoneDetailCtrl.$inject = ['Phone', '$routeParams', '$scope'];




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


    $scope.time = "all";
    $scope.tweets = db.tweets.query({tag: $routeParams.hashTag, time:$scope.time});

    //search
    $scope.tagSearch = function() { 
        var tagged = $scope.searchText.replace("#","");
        $scope.tweets = db.tweets.query({name:$scope.query, time:$scope.time, tag: tagged});
    };


    $scope.DropdownCtrl = function($scope) {

      $scope.items = [
        "The first choice!",
        "And another choice for you.",
        "but wait! A third!"
      ];
    }



}
talktagCtrl.$inject = [ '$location', '$scope', '$routeParams', 'db'];


function mapCtrl() {

        var minZ = 6; //min map zoom
        var maxZ = 19; //max map zoom
        var map = new L.Map('map', {crs:L.CRS.EPSG3857}).setView([42.36219069106654,-83.06988000869751], 16);
        var base = L.tileLayer('1.0.0/conftest/{z}/{x}/{y}.png', {minZoom:minZ, maxZoom:maxZ, tms:'true'});

        //---------- ADDING OPTIONAL EXTERNAL WEB MAP LAYER (UNCOMMENT TO ACTIVATE) ----------//

        // var cloudUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
        // cloud = new L.TileLayer(cloudUrl);
        // map.addLayer(cloud,true); 

        map.addLayer(base,true);


    
}


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