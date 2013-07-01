'use strict';

/* Filters */

angular.module('tidepoolsFilters', []).filter('hashtag', function() {
  return function(input) {

  	//http://www.simonwhatley.co.uk/parsing-twitter-usernames-hashtags-and-urls-with-javascript
	return input.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
		var tag = t.replace("#","");
		return t.link("#/talk/"+tag);
	});
  };
});

