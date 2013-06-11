'use strict';

/* Services */

//factory service to get JSON
// //creating service called "phonecatServices"
// angular.module('phonecatServices', ['ngResource']).
//     factory('Phone', function($resource){
//   return $resource('phones/:phoneId.json', {}, {
//     query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
//   });
// });


//getting mongo data
//from: https://github.com/dalcib/angular-phonecat-mongodb-rest
var res;
angular.module('phonecatServices', ['ngResource'])
	.factory('Phone', ['$resource', '$http',
        function($resource, $http) {
			var actions = {
                'count': {method:'PUT', params:{_id: 'count'}},                           
                'distinct': {method:'PUT', params:{_id: 'distinct'}},      
                'find': {method:'PUT', params:{_id: 'find'}, isArray:true},              
                'group': {method:'PUT', params:{_id: 'group'}, isArray:true},            
                'mapReduce': {method:'PUT', params:{_id: 'mapReduce'}, isArray:true} ,  
                'aggregate': {method:'PUT', params:{_id: 'aggregate'}, isArray:true}   
            }
            res = $resource('api/landmarks/:_id:id', {}, actions);
            return res;
        }
    ])
    .factory('db', ['$resource', '$http',    
    function($resource, $http) {
		var actions = {
                'count': {method:'PUT', params:{_id: 'count'}},                           
                'distinct': {method:'PUT', params:{_id: 'distinct'}},      
                'find': {method:'PUT', params:{_id: 'find'}, isArray:true},              
                'group': {method:'PUT', params:{_id: 'group'}, isArray:true},            
                'mapReduce': {method:'PUT', params:{_id: 'mapReduce'}, isArray:true} ,  
                'aggregate': {method:'PUT', params:{_id: 'aggregate'}, isArray:true}   
            }
        var db = {};
        db.phones = $resource('api/landmarks/:_id:id', {}, actions);
        return db;
    }
]);