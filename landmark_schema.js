var mongoose = require('mongoose'),
textSearch = require('mongoose-text-search');
monguurl = require('monguurl');

	//schema construction
	var Schema = mongoose.Schema, ObjectID = Schema.ObjectID;

	var landmarkSchema = new Schema({
		name: String, 
		description: String, 
		shortDescription: String,
		type: String, 
		subType: String, 
		category: String, 
		searchField: String,
		id: String, 
		loc: {type: [Number], index:'2d'}, //indexing 
		mapID: String, 
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
			avatar: String,  
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
		video: String,
		etherpad: String,
		loc_nicknames : [String], 
		loc_nicknames_stripe : [String],
		tags: String, 
		permissions: {
			hidden: Boolean,
			viewers: [String],
			openedit: Boolean,
			admins: [String]
		},
		feed: [String]
	},
	{_id: false}); //not writing _id let mongo kk

	landmarkSchema.plugin(textSearch);

	//indexing for search
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
