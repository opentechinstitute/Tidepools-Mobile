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
})

//Filtering youtube links to auto-display
.filter('youtubestrip', function() {
  return function(input) {

      //Filtering normal youtube link
  		if(input){
  			var newstr = input.replace(/^[^_]*=/, "");
			  return newstr;
        //return youtube_parser(input);
  		}
      
     function youtube_parser(url){
          var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
          var match = url.match(regExp);
          if (match&&match[7].length==11){
              return match[7];
          }else{
              console.log("The video link doesn't work :(");
          }
      }

  };
})

.filter('url', function() {
  return function(input) {

    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;  
    return input.replace(urlRegex, function(url) {  
        return '<a href="' + url + '">' + url + '</a>';  
    })  
              
  };
});

