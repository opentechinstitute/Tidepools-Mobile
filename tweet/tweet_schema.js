	var mongoose = require('mongoose');

	var safe = {j: 1, getLastError: 1, _id:false}; //for testing DB

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
		media:{
			media_type: String,
			media_url: String
		},
		text: String,
		hashtags:[String],

		created: { type: Date, default: Date.now }
		//_id: Schema.Types.ObjectId,
		//geo: {type: String, coordinates: [Number]}
	},
	//{safe: safe}); //for testing db
	{_id: false});


module.exports = twitterSchema;