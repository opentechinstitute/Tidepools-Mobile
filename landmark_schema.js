var mongoose = require('mongoose');

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
		etherpad: String,
		loc_nicknames : [String], //room name "i.e. Hilberry A"
		tags: [String], //hashtag for session from field_2013hash
		permissions: {
			hidden: Boolean,
			viewers: [String],
			openedit: Boolean,
			admins: [String]
		}
	},
	{_id: false}); //not writing _id let mongo kk

module.exports = landmarkSchema;