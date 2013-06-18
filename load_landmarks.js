var mongoose = require('mongoose'),
	monguurl = require('monguurl'),
    https = require('https'),
    async = require('async'),
    _ = require('underscore'),
    landmarkSchema = require('./landmark_schema.js');

var dateMap = { "thu": "20", "fri": "21", "sat": "22", "sun": "23", "mon": "24" };

// converts times like 3:45pm to 15:45 for use with Dates
function to24hr(stdTime) {
    if (!stdTime)
        return null;
  
    var m = stdTime.match(/(\d+):(\d+)(am|pm)/);
    if (m && m.length > 3) {
        m[1] = (m[3] == "pm" && +m[1] !== 12) ? +m[1] + 12 : +m[1];
        m = m.slice(1,3).join(":");
    } else {
        m = null;
    }
    return m;    
}

// datum is an amc single session data object
function findBlockTimeString(datum) {
    return (datum['taxonomy'][_.first(_.pluck(datum['field_2013sched'], 'value'))].name || 'ongoing').toLowerCase();
}

// blockTime is a string like FRI 12:45pm - 1:45pm
// this method does not handle repeating sessions or multi-day spanning sessions, unclear requirements
function parseBlockTimesToDates(blockTime) {
    var times = blockTime.match(/\d+:\d+(a|p)m/g);
    var day = blockTime.match(/(mon|tue|wed|thu|fri|sat|sun)/);
    var range = [];
    
    if (day)
        day = day[0];
    else
        day = 'fri';

    return [new Date([day, 'Jun', dateMap[day], '2013', to24hr(times[0]), 'EDT'].join(' ')), 
            new Date([day, 'Jun', dateMap[day], '2013', to24hr(times[1]), 'EDT'].join(' '))];
}

// converts AMC JSON data to mongoose models
function transformJsonData(data) {
    
    if (!data) {
        return null;
    }

    var sessions = JSON.parse(data); 
    return sessions.map(function(datum) {
                       
        //monguurl to gen unique id based on landmark name
        landmarkSchema.plugin(monguurl({
            length: 40,
            source: 'name',
            target: 'id'
        }));

        var landmarkModel = mongoose.model('landmark', landmarkSchema, 'landmarks');  // compiling schema model into mongoose
        var lm = new landmarkModel(),
            blockTime = findBlockTimeString(datum); 
         
        lm.name = datum.title;
        lm.description = datum.field_2013sesh_short_desc;
        lm.type = 'session';
        lm.id = 'uniqueID';       //?
        lm.loc.unshift(42,-38);   //?
        lm.mapID = '23434';       //?
        lm.stats.avatar = '/assets/images/nyan.gif';
        lm.time.created = new Date();
        lm.tags.addToSet(_.pluck(datum['field_2013hash'], 'value'));
        lm.loc_nicknames.addToSet( _.pluck(datum['field_2013loc'], 'value'));

         if (blockTime) {
            if (blockTime.match(/ongoing/i)) {
                lm.type = 'session-ongoing';
                lm.time.start = null;
                lm.time.end = null;
            } else {
                var times = parseBlockTimesToDates(blockTime);
                lm.time.start = times[0];
                lm.time.end = times[1];
            }
        } else {
            console.log("no time for ", datum.name);
        }

        return lm;
    });
}


// loads all the data from given URL and imports to the landmarks schema, returning the # of documents inserted
function etl(url, callback) {
    // extract, transform, load
    console.log(new Date(), 'Begin extract');

    var buffer = '';
    
    var req = https.get(url, function(res) {
        res.setEncoding('utf-8');
        
        res.on('data', function (chunk) {
            buffer += chunk; //if this gets really large, use more efficient append
        });
        
        res.on('end', function() {
            console.log(new Date(), 'Extract complete');
            
            documents = transformJsonData(buffer) || [];
            console.log(new Date(), 'Transform complete');
            
            var asyncTasks = _.map(documents, function (model) {
                return function (asyncCallback) {
                    model.save(function (err, landmark) {
                        if (err)
                            asyncCallback(err);
                        else
                            asyncCallback(null, landmark);
                    });
                }
            });
            
            console.log(new Date(), 'Begin load to DB, wait..');
            
            async.parallelLimit(asyncTasks, 20, function(err, results) {
                console.log(new Date(), 'Load to DB complete');
                if (err) 
                    callback && callback(err);
                else    
                    callback && callback(null, results.length);
            });
        });
    });

    req.on('error', function(err) {
        callback && callback(err);
    });
}


module.exports = etl;
