var mongoose = require('mongoose'),
textSearch = require('mongoose-text-search');
monguurl = require('monguurl');

	//schema construction
	var Schema = mongoose.Schema, ObjectID = Schema.ObjectID;

	//Construct from AMC Sessions: https://talk.alliedmedia.org/backbone/rest/views/2013sesh_backbone_user.jsonp
	var landmarkSchema = new Schema({
		name: String, //title
		description: String, //field_2013sesh_short_desc
		shortDescription: String,
		type: String, //write as "session"
		subType: String, //session type
		category: String, //track name (i.e. webmaking)
		searchField: String,
		id: String, //auto constructed based on name
		loc: [Number], //don't worry
		mapID: String, //don't worry
		time: {
			created: { type: Date, default: Date.now },
			start: { type: Date},
			end: { type: Date}
		},
		timetext: {
			datestart: String,
			dateend: String,
			timestart: String,
			timeend: String
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
		// creators: {
			

		// },
		insides: {
			mapURL: String,
			mapID: String
		},
		video: String,
		etherpad: String,
		loc_nicknames : [String], //room name "i.e. Hilberry A"
		loc_nicknames_stripe : [String],
		tags: String, 
		permissions: {
			hidden: Boolean,
			viewers: [String],
			openedit: Boolean,
			admins: [String]
		}
	},
	{_id: false}); //not writing _id let mongo kk

	landmarkSchema.plugin(textSearch);

	landmarkSchema.index({
	    name  				  :"text",
	    description           :"text",
	    shortDescription      :"text",
	    type                  :"text",
	    loc_nicknames         :"text"
	});

	// landmarkSchema.plugin(monguurl({
	// 	length: 40,
	// 	source: 'name',
	// 	target: 'id'
	// }));

module.exports = landmarkSchema;


// +	//schema construction
// +	var Schema = mongoose.Schema
// +		, ObjectID = Schema.ObjectID;
// +
// +	//social media schemas
// +	var twitterSchema = new Schema({
// +		tweetID: Number,
// +		tweetID_str: String,
// +		user:{
// +			name: String,
// +			screen_name: String,
// +			userId: Number,
// +			userId_str: String,
// +			profile_image_url: String
// +		},
// +		text: String,
// +		hashtags:[String],
// +		created: { type: Date, default: Date.now },
// +		mongoID: Schema.Types.ObjectId,
// +		geo: {type: String, coordinates: [Number]}
// +	});
// +
// +	//construct landmark
// +	var commentSchema = new Schema({
// +		name: String,
// +		text: String,
// +		likes: Number,
// +		userID: String,
// +		mongoID: Schema.Types.ObjectId,
// +		created: { type: Date, default: Date.now }
// +	});
// +
// +	//Construct from AMC Sessions: https://talk.alliedmedia.org/backbone/rest/views/2013sesh_backbone_user.jsonp
// +	var landmarkSchema = new Schema({
// +		name: String, //title
// +		description: String, //field_2013sesh_short_desc
// +		type: String, //write as "session"
// +		category: String, //track name (i.e. webmaking)
// +		id: String, //auto constructed based on name
// +		loc: [Number], //don't worry
// +		mapID: String, //don't worry
// +		time: {
// +			created: { type: Date, default: Date.now },
// +			start: Date, //regex from block #: start time "e.g. saturday june 22nd? at 2:00pm"
// +			end: Date //same
// +		},
// +		stats: { 
// +			avatar: String,  //based off loc_nickname, point to room # avatar in /assets/images or based on track
// +			level: Number,
// +			reputation: Number,
// +			likes: Number,
// +			buzz: Number,
// +			checkIn: [String],
// +			imGoing: [String],
// +		},
// +		insides: {
// +			mapURL: String,
// +			mapID: String
// +		},
// +		commentFeed: [commentSchema],
// +		twitterFeed: [twitterSchema],
// +		instagramFeed: [],
// +		tumblrFeed: [],
// +		vineFeed: [],
// +		loc_nicknames : [String], //room name "i.e. Hilberry A"
// +		tags: [String], //hashtag for session from field_2013hash
// +		permissions: {
// +			hidden: Boolean,
// +			viewers: [String],
// +			openedit: Boolean,
// +			admins: [String]
// +		}
// +	});
// +
// +	//monguurl to gen unique id based on landmark name
// +	landmarkSchema.plugin(monguurl({
// +		length: 40,
// +		source: 'name',
// +		target: 'id'
// +	}));
// +
// +
// +	mongoose.model('landmark', landmarkSchema, 'landmarks');
// +	var Landmark = mongoose.model('landmark');
// +
// +	LandmarkProvider = function(){};
// +
// +	LandmarkProvider.prototype.findAll = function(callback) {
// +
// +	  // Landmark.find({}, function (err, posts) {
// +	  //   callback( null, posts )
// +	  // });  
// +		
// +
// +	  	Landmark.find(function (err, landmarks) {
// +		    if (err) // TODO handle err
// +		        console.log(err);
// +		    else {
// +		        callback(err, landmarks);
// +		    }
// +		});
// +
// +	};
// +
// +	exports.LandmarkProvider = LandmarkProvider;
// +
// +// var db = mongoose.connection;
// +// db.on('error', console.error.bind(console, 'connection error:'));
// +
// +// var landmarkModel = mongoose.model('landmark', landmarkSchema, 'landmarks');  // compiling schema model into mongoose
// +// 	var lm = new landmarkModel(); 