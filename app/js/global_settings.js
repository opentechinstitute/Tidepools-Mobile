// Tidepools Global Settings

//----------- THIS LOADS A CLOUD MAP --------//

var mapSelect = 'cloud'; //loading 'cloud' setting as specified in: js/angular-leaflet-directive.js
var global_mapCenter = { //this is the "center" of your community or event, for mapping purposes
    lat: 52.5126,
    lng: 13.4202,
    zoom: 15
};


// //AN EXAMPLE using local AMC2013 map
 //----------- THIS LOADS A LOCAL MAP -----------------//

 var mapSelect = 'is4cwn'; //loading 'amc2013' local map setting as specified in: js/angular-leaflet-directive.js
 var global_mapCenter = {
    lat: 52.5126,
    lng: 13.4202,
    zoom: 15
 };

/*var globalIcon = L.icon;
var book_p = new globalIcon({iconUrl: 'img/book_p.svg'});
var film_p = new globalIcon({iconUrl: 'img/film_p.svg'});
var meet_p = new globalIcon({iconUrl: 'img/meet_p.svg'});
var info_p = new globalIcon({iconUrl: 'img/info_p.svg'});
var speak_p = new globalIcon({iconUrl: 'img/speak_p.svg'});
var present_p = new globalIcon({iconUrl: 'img/present_p.svg'});
var hack = new globalIcon({iconUrl: 'img/hack_r.svg'});
var meet = new globalIcon({iconUrl: 'img/meet_r.svg'});
var eat = new globalIcon({iconUrl: 'img/fork_r.svg'});
*/

//---------- TWEET STREAM -------//
//one or more hashtags for base twitter gathering 
var global_hashtag = "#is4cwn";

//can also be multiple:
//var global_hashtag = '#lol,#what,#soitgoes';
//-------------------------------//

var eventCategories = ['IS4CWN-Keynote','IS4CWN-Presentation','IS4CWN-Film','IS4CWN-Information','IS4CWN-Hack','Meet','Collaborate', 'IS4CWN-Document-Fair', 'IS4CWN-Tech-Support'];

var placeCategories = ['HackLab','Bar-Restaurant','Hotel','Outside','Tourism-Spot'];


var globalEditLoc = {}; //this is a temp variable for an issue with angular leaflet directive in landmark-edit

//parsing node.js usage of file
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports.hashtag = global_hashtag;
}
