// Tidepools Global Settings


//----------- THIS LOADS A CLOUD MAP --------//

var mapSelect = 'cloud'; //loading 'cloud' setting as specified in: js/angular-leaflet-directive.js
var global_mapCenter = { //this is the "center" of your community or event, for mapping purposes
    lat: 40.676752,
    lng: -74.004618,
    zoom: 15
};

//--------------------------------------------------//

// //AN EXAMPLE using local AMC2013 map
 //----------- THIS LOADS A LOCAL MAP -----------------//

// var mapSelect = 'amc2013'; //loading 'amc2013' local map setting as specified in: js/angular-leaflet-directive.js
// var global_mapCenter = {
//     lat: 42.356886,
//     lng: -83.069523,
//     zoom: 14
// };

//----------------------------------------------------//


//---------- TWEET STREAM -------//
//one or more hashtags for base twitter gathering 
var global_hashtag = "#tidepools";
//can also be multiple:
//var global_hashtag = '#lol,#what,#soitgoes';
//-------------------------------//


var eventCategories = ['Meeting','Party','Hangout'];

var placeCategories = ['Organization','Shop','Food/Drink','Park'];


var globalEditLoc = {}; //this is a temp variable for an issue with angular leaflet directive in landmark-edit

//parsing node.js usage of file
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports.hashtag = global_hashtag;
}

