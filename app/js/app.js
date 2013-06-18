'use strict';

/* App Module */

//route provider module listing Filters and Services as dependencies
var app = angular.module('phonecat', ['phonecatFilters', 'phonecatServices','ngSanitize']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/phone-list.html',   controller: PhoneListCtrl}). //loading template with controller
      when('/session/:phoneId', {templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl}). //loading template + controller
      when('/talk', {templateUrl: 'partials/talk-list.html', controller: talklistCtrl}). //loading template + controller
      when('/talk/:hashTag', {templateUrl: 'partials/talk-tag.html', controller: talktagCtrl}). //loading template + controller
      when('/map', {templateUrl: 'partials/map.html', controller: mapCtrl}). //loading template + controller
      otherwise({redirectTo: '/'}); 
}]);


