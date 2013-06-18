'use strict';

/* Filters */

angular.module('phonecatFilters', []).filter('checkmark', function() {
  return function(input) {

  	console.log(input);
    return input ? '\u2713' : '\u2718';
  };
});


angular.module('phonecatFilters', []).filter('hashtag', function() {
  return function(input) {

  	//http://www.simonwhatley.co.uk/parsing-twitter-usernames-hashtags-and-urls-with-javascript
	return input.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
		var tag = t.replace("#","");
		return t.link("#/talk/"+tag);
	});
  };
});

