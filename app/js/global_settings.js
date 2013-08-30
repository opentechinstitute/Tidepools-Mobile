
//this is the "center" of your community or event, for mapping purposes
var global_mapCenter = {
    lat: 40.676752,
    lng: -74.004618,
    zoom: 15
};

// //AN EXAMPLE using local AMC2013 map
// var global_mapCenter = {
//     lat: 42.356886,
//     lng: -83.069523,
//     zoom: 14
// };

//one or more hashtags for base twitter gathering 
var global_hashtag = "#lol";
//can also be multiple:
//var global_hashtag = '#lol,#what,#soitgoes';

var globalEditLoc = {}; //this is a temp variable for an issue with angular leaflet directive in landmark-edit

//parsing node.js usage of file
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports.hashtag = global_hashtag;
}

