var mongoose = require('mongoose'),
	monguurl = require('monguurl');


mongoose.connect('mongodb://localhost/amctest');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

	//schema construction
	var Schema = mongoose.Schema, ObjectID = Schema.ObjectID;

	//social media schemas
	var twitterSchema = new Schema({
		tweetID: Number,
		tweetID_str: String,
		user:{
			name: String,
			screen_name: String,
			userId: Number,
			userId_str: String,
			profile_image_url: String
		},
		text: String,
		hashtags:[String],
		created: { type: Date, default: Date.now },
		mongoID: Schema.Types.ObjectId,
		geo: {type: String, coordinates: [Number]}
	});

	//construct landmark
	var commentSchema = new Schema({
		name: String,
		text: String,
		likes: Number,
		userID: String,
		mongoID: Schema.Types.ObjectId,
		created: { type: Date, default: Date.now }
	});

	//Construct from AMC Sessions: https://talk.alliedmedia.org/backbone/rest/views/2013sesh_backbone_user.jsonp
	var landmarkSchema = new Schema({
		name: String, //title
		description: String, //field_2013sesh_short_desc
		type: String, //write as "session"
		category: String, //track name (i.e. webmaking)
		id: String, //auto constructed based on name
		loc: [Number], //don't worry
		mapID: String, //don't worry
		time: {
			created: { type: Date, default: Date.now },
			start: Date, //regex from block #: start time "e.g. saturday june 22nd? at 2:00pm"
			end: Date //same
		},
		stats: { 
			avatar: String,  //based off loc_nickname, point to room # avatar in /assets/images or based on track
			level: Number,
			reputation: Number,
			likes: Number,
			buzz: Number,
			checkIn: [String],
			imGoing: [String],
		},
		insides: {
			mapURL: String,
			mapID: String
		},
		commentFeed: [commentSchema],
		twitterFeed: [twitterSchema],
		instagramFeed: [],
		tumblrFeed: [],
		vineFeed: [],
		loc_nicknames : [String], //room name "i.e. Hilberry A"
		tags: [String], //hashtag for session from field_2013hash
		permissions: {
			hidden: Boolean,
			viewers: [String],
			openedit: Boolean,
			admins: [String]
		}
	});

	//monguurl to gen unique id based on landmark name
	landmarkSchema.plugin(monguurl({
		length: 40,
		source: 'name',
		target: 'id'
	}));

	var landmarkModel = mongoose.model('landmark', landmarkSchema, 'landmarks');  // compiling schema model into mongoose
	var lm = new landmarkModel(); 

	//---adding data to schema---//
	var name = "or like that дада";
	var uniqueID = '';

	lm.name = "test";
	lm.description = "asdff";
	lm.type = "event";
	lm.id = uniqueID;
	lm.loc.unshift(42,-38);
	lm.mapID = "23434";

	lm.time.created = new Date;
	lm.tags.push("tag1","tag2");

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





