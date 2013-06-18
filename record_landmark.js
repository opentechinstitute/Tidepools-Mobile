var mongoose = require('mongoose'),
	monguurl = require('monguurl'),
    loader = require('./load_landmarks.js');

mongoose.connect('mongodb://localhost/amctest');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    
    loader('https://talk.alliedmedia.org/backbone/rest/views/2013sesh_backbone_user.jsonp', 
        function (err, count) {
            if (err) // TODO handle the error
                console.log(err);
            else
                console.log("success, ", count, "records loaded");
                db.close();
        });
});

