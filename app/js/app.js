'use strict';

/* App Module */

//route provider module listing Filters and Services as dependencies
var app = angular.module('phonecat', ['tidepoolsFilters', 'tidepoolsServices','ngSanitize','ui.bootstrap', 'leaflet-directive','infinite-scroll']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/landmark-list.html', controller: LandmarkListCtrl}). //loading template with controller
      when('/session/:phoneId', {templateUrl: 'partials/landmark-detail.html', controller: LandmarkDetailCtrl}). //loading template + controller
      when('/talk', {templateUrl: 'partials/talk-list.html', controller: talklistCtrl}). //loading template + controller
      when('/talk/:hashTag', {templateUrl: 'partials/talk-tag.html', controller: talktagCtrl}). //loading template + controller
      when('/map', {templateUrl: 'partials/map.html', controller: mapCtrl}). //loading template + controller
      when('/map/:loc', {templateUrl: 'partials/map-loc.html', controller: maplocCtrl}). //loading template + controller
      otherwise({redirectTo: '/'}); 
}]);


