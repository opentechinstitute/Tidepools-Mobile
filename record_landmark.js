var mongoose = require('mongoose'),
	monguurl = require('monguurl');


mongoose.connect('mongodb://localhost/amctest');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

	var landmarkSchema = require('./landmark_schema.js');

	//monguurl to gen unique id based on landmark name
	landmarkSchema.plugin(monguurl({
		length: 40,
		source: 'name',
		target: 'id'
	}));

	var landmarkModel = mongoose.model('landmark', landmarkSchema, 'landmarks');  // compiling schema model into mongoose
	var lm = new landmarkModel(); 

	//console.log(lm);

	//---adding data to schema---//
	var name = "or like that дада";
	var uniqueID = '';

	lm.name = "twitterrers";
	lm.description = "asdff";
	lm.type = "event";
	lm.id = uniqueID;
	lm.loc.unshift(42,-38);
	lm.mapID = "23434";

	lm.stats.avatar = "/assets/images/nyan.gif";

	lm.time.created = new Date;
	lm.time.start = new Date("June 11, 2013 11:13:00");
	lm.time.end = new Date("July 30, 2013 11:13:00");
	lm.tags.push("lol","umm");

	lm.twitterFeed.push({text:'asdf'});
	//------------------------//


	//saving data
	lm.save(function (err, landmark) {
	    if (err) // TODO handle the error
	        console.log(err.message);
	    else
	        console.log("success");
	    	db.close();
	});
	
		
});





