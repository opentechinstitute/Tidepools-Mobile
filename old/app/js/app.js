'use strict';

/* App Module */

//route provider module listing Filters and Services as dependencies
angular.module('phonecat', ['phonecatFilters', 'phonecatServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/phone-list.html',   controller: PhoneListCtrl}). //loading template with controller
      when('/:phoneId', {templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl}). //loading template + controller
      otherwise({redirectTo: '/'}); 
}]);
