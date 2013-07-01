var twitter = require('ntwitter'),
    mongoose = require('mongoose'),
    monguurl = require('monguurl');

var credentials = require('./credentials.js');


var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});


mongoose.connect('mongodb://localhost/amctest');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var twitterSchema = require('./tweet_schema.js');
var tweetModel = mongoose.model('tweet', twitterSchema, 'tweets');  // compiling schema model into mongoose

t.stream(
    'statuses/filter',
    { track: ['#amc2013'] },
    function(stream) {
        stream.on('data', function(tweet) {

            var lm = new tweetModel();

            var mediaType;
            var mediaURL;

            if (tweet.entities.media){
                mediaType = "image";
                mediaURL = tweet.entities.media[0].media_url;
            }

            else if (tweet.entities.urls[0]) {

                    if (tweet.entities.urls[0].expanded_url.indexOf('instagram.com') > -1){
                        mediaType = "instagram";
                    }
                    if (tweet.entities.urls[0].expanded_url.indexOf('vine.co') > -1){
                        mediaType = "vine";
                    }
                    if (tweet.entities.urls[0].expanded_url.indexOf('media.tumblr.com') > -1){
                        mediaType = "tumblr";
                    }
                    if (tweet.entities.urls[0].expanded_url.indexOf('youtube.com') > -1 || tweet.entities.urls[0].expanded_url.indexOf('youtu.be') > -1){
                        mediaType = "youtube";
                    }

                    mediaURL = tweet.entities.urls[0].expanded_url;
            }

            lm.tweetID = tweet.id;
            lm.tweetID_str = tweet.id_str;

            if (mediaType && mediaURL){
                lm.media.media_type = mediaType;
                lm.media.media_url = mediaURL;
            }

            lm.user.name = tweet.user.name;
            lm.user.screen_name = tweet.user.screen_name;
            lm.user.userID = tweet.user.id;
            lm.user.userID_str = tweet.user.id_str;
            lm.user.profile_image_url = tweet.user.profile_image_url;

            lm.text = tweet.text;

            for (var i=0;i<tweet.entities.hashtags.length;i++){ 
                 lm.hashtags.push(tweet.entities.hashtags[i].text);
            }

            lm.created = new Date;
              
            lm.save(function (err, landmark) {
                if (err) 
                    console.log(err);
                else
                    console.log(".");
            });

        });
            
    }
);

