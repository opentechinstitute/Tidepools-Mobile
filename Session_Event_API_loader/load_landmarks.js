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
        day = 'wed';

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

        loc_nicknames = {

            McGregor_E : {
                lat: 42.36271390643378,
                lng: -83.07880640029907
            },
            Hilberry_C : {
                lat: 42.36647141605843,
                lng: -83.04028987884521
            },
            Education_204 : {
                lat: 42.3502982579399,
                lng: -83.07427883148193
            },
            Art_Ed_157 : {
                lat: 42.35843292541744,
                lng: -83.07511568069457
            },
            Community_Arts_Auditorium: {
                lat: 42.36650312404415,
                lng: -83.05760622024536
            },
            Art_Ed_156: {
                lat: 42.35719614326714,
                lng: -83.07335615158081
            },
            Hilberry_B: {
                lat: 42.366423854049806,
                lng: -83.0387020111084
            },
            Art_Ed_162: {
                lat: 42.35648260403089,
                lng: -83.06754112243651
            },
            McGregor_LM: {
                lat: 42.36261877669108,
                lng: -83.06801319122314
            },
            Education_189: {
                lat: 42.346000571932635,
                lng: -83.08202505111693
            },
            Hilberry_A: {
                lat: 42.36658239393847,
                lng: -83.03694248199463
            },
            Art_Ed_154: {
                lat: 42.357132717885335,
                lng: -83.07477235794066
            },
            Education_169: {
                lat: 42.345984712768576,
                lng: -83.08539390563965
            },
            McGregor_J: {
                lat: 42.36566285701487,
                lng: -83.07786226272583
            },
            Education_300: {
                lat: 42.35099600949203,
                lng: -83.05988073348999
            },
            North_side_of_McGregor: {
                lat: 42.364109126111664,
                lng: -83.08820486068726
            },
            McGregor_BC: {
                lat: 42.362840745866635,
                lng: -83.08374166488647
            },
            McGregor_Lobby: {
                lat: 42.36415668987275,
                lng: -83.08492183685303
            },
            McGregor_FGH: {
                lat: 42.36288831058794,
                lng: -83.07550191879272
            },
            Towers_Lounge_: {
                lat: 42.352930643737494,
                lng: -83.0432939529419
            },
            Cass_Cafe_: {
                lat: 42.3486807131878,
                lng: -83.03953886032104
            },
            Museum_of_Contemporary_Art_Detroit: {
                lat: 42.348268391201444,
                lng: -83.03762912750243
            },
            Charles_Wright_Museum_of_African_American_History: {
                lat: 42.35018725129699,
                lng: -83.03619146347046
            },
            Wasabi_Restaurant: {
                lat: 42.353057502919036,
                lng: -83.03797245025633
            },
            McGregor: {
                lat: 42.3641249807027,
                lng: -83.08665990829468
            },
            Art_Ed_161: {
                lat: 42.35822679674948,
                lng: -83.07157516479492
            },
            McGregor_I: {
                lat: 42.36607506488643,
                lng: -83.07382822036743
            },
            Outer_Galleries: {
                lat: 42.36466403441681,
                lng: -83.05742383003235
            },
            Majestic_Theater_Complex: {
                lat: 42.34741202151109,
                lng: -83.03762912750243
            },
            The_Commons_: {
                lat: 42.36407741691762,
                lng: -83.08193922042847
            },
            McGregor_A: {
                lat: 42.36269805148666,
                lng: -83.08674573898315
            }
       };
                       
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
        lm.description = _.pluck(datum['field_2013sesh_short_desc'], 'value');
        lm.shortDescription = _.pluck(datum['field_2013tweetable'], 'value');

        lm.etherpad = 'https://etherpad.alliedmedia.org/p/'+datum.nid;

        lm.type = 'session';
        //lm.id = 'uniqueID';       //?
       // lm.mapID = '23434';       //?

       //track
        var track = _.pluck(datum['field_2013tracks'], 'value');
        track = track[0]; //just because go away double cats
        lm.category = datum.taxonomy[track].name;

        var avatar;

        if (datum.taxonomy[track].name == "Kids Transform the World"){
            lm.stats.avatar = '/img/icons/kidstransform.png';
        }
        else if (datum.taxonomy[track].name == "General"){
            lm.stats.avatar = '/img/icons/general.png';
        }
        else if (datum.taxonomy[track].name == "Research Justice"){
            lm.stats.avatar = '/img/icons/researchjustice.png';
        }
        else if (datum.taxonomy[track].name == "Movement//Movement "){
            lm.stats.avatar = '/img/icons/movement.png';
        }
        else if (datum.taxonomy[track].name == "Transformative Arts Practice Space (TAPS) "){
            lm.stats.avatar = '/img/icons/taps.png';
        }
        else if (datum.taxonomy[track].name == "Engaging Power: Media Rights and Our Movements"){
            lm.stats.avatar = '/img/icons/engagingpower.png';
        }
        else if (datum.taxonomy[track].name == "I ♥ Print Media"){
            lm.stats.avatar = '/img/icons/printmedia.png';
        }
        else if (datum.taxonomy[track].name == "Webmaking"){
            lm.stats.avatar = '/img/icons/webmaking.png';
        }
        else if (datum.taxonomy[track].name == "Discovering Technology Lab"){
            lm.stats.avatar = '/img/icons/discovering.png';
        }
        else if (datum.taxonomy[track].name == "Science and Social Movements"){
            lm.stats.avatar = '/img/icons/sciencesocial.png';
        }
        else if (datum.taxonomy[track].name == "Imagining Better Futures Through Play"){
            lm.stats.avatar = '/img/icons/play.png';
        }
        else if (datum.taxonomy[track].name == "Fierce Fashion Futures"){
            lm.stats.avatar = '/img/icons/fashion.png';
        }
        else if (datum.taxonomy[track].name == "(No) Blank Slates: A DET X NOLA Cultural Exchange"){
            lm.stats.avatar = '/img/icons/noblankslates.png';
        }
        else if (datum.taxonomy[track].name == "Detroit Future Youth"){
            lm.stats.avatar = '/img/icons/futureyouth.png';
        }
        else if (datum.taxonomy[track].name == "Practice Space"){
            lm.stats.avatar = '/img/icons/practicespace.png';
        }
        else if (datum.taxonomy[track].name == "Network Gathering"){
            lm.stats.avatar = '/img/icons/networkgathering.png';
        }
        else if (datum.taxonomy[track].name == "Healing Justice Practice Space"){
            lm.stats.avatar = '/img/icons/healing.png';
        }
        else  {
            lm.stats.avatar = '/img/icons/general.png';
        }

        //lm.stats.avatar = '/assets/images/avatars/nyan.gif';
        lm.time.created = new Date();
        lm.tags.addToSet(_.pluck(datum['field_2013hash'], 'value'));
        

        //location
        var nick_loc = _.pluck(datum['field_2013loc'], 'value');
        lm.loc_nicknames.addToSet(datum.taxonomy[nick_loc].name);


        //coords
        //formatting for keylookup
        var n = datum.taxonomy[nick_loc].name.replace(/ /g,"_");
        n = n.replace(/\//g,'');
        n = n.replace(/\./g, '');
        lm.loc_nicknames_stripe.addToSet(n);
        ///
        lm.loc.unshift(loc_nicknames[n].lat,loc_nicknames[n].lng);   


        //track
        var track = _.pluck(datum['field_2013tracks'], 'value');
        track = track[0]; //just because go away double cats
        lm.category = datum.taxonomy[track].name;

        //sesh type
        var sesh_type = _.pluck(datum['field_2013seshtype'], 'value');
        sesh_type = sesh_type[0];
        lm.subType = datum.taxonomy[sesh_type].name;

        lm.searchField = lm.name+lm.tags[0]+lm.loc_nicknames[0]+lm.subType+lm.category+lm.shortDescription+lm.description;


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
