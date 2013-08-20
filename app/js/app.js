'use strict';

/* App Module */

//route provider module listing Filters and Services as dependencies

var globalEditLoc = {}; //this is a temp variable for an issue with angular leaflet directive in landmark-edit

var app = angular.module('Tidepools', ['tidepoolsFilters', 'tidepoolsServices','ngSanitize','ui.bootstrap', 'leaflet-directive','infinite-scroll','$strap.directives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/landmark-list.html', controller: LandmarkListCtrl}). //loading template with controller
      when('/landmark/:landmarkId', {templateUrl: 'partials/landmark-detail.html', controller: LandmarkDetailCtrl}). //loading template + controller
      when('/landmark/:landmarkId/edit', {templateUrl: 'partials/landmark-edit.html', controller: LandmarkEditCtrl}). //loading template + controller
      when('/landmark/:landmarkId/:option', {templateUrl: 'partials/landmark-detail.html', controller: LandmarkDetailCtrl}). //loading template + controller
      when('/new', {templateUrl: 'partials/landmark-new.html'}). //loading template + controller
      when('/new/:type', {templateUrl: 'partials/landmark-new-type.html', controller: LandmarkNewCtrl}). //loading template + controller
      when('/talk', {templateUrl: 'partials/talk-list.html', controller: talklistCtrl}). //loading template + controller
      when('/talk/:hashTag', {templateUrl: 'partials/talk-tag.html', controller: talktagCtrl}). //loading template + controller
      when('/map', {templateUrl: 'partials/map.html', controller: mapCtrl}). //loading template + controller
      when('/map/:loc', {templateUrl: 'partials/map-loc.html', controller: maplocCtrl}). //loading template + controller
      when('/map/coordinates/:lat/:lng/:name', {templateUrl: 'partials/map-loc.html', controller: maplocCtrl}). //loading template + controller

      otherwise({redirectTo: '/'}); 
}]);
