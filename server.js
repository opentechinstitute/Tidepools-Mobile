var express = require('express'),
    app = module.exports.app = express(), 
    db = require('mongojs').connect('amctest');
    //db = require('mongojs').connect('PhoneCat');
    
app.configure(function () {
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.logger('dev'));  //tiny, short, default
	app.use(app.router);
	app.use(express.static(__dirname + '/app'));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true, showMessage: true}));
});

/* Helpers */

//To allow use ObjectId or other any type of _id
var objectId = function (_id) {
    if (_id.length === 24 && parseInt(db.ObjectId(_id).getTimestamp().toISOString().slice(0,4), 10) >= 2010) {
        return db.ObjectId(_id);
    } 
    return _id;
}

//Function callback
var fn = function (req, res) {
    res.contentType('application/json');
    var fn = function (err, doc) { 
        if (err) { 
            if (err.message) {
                doc = {error : err.message} 
            } else {
                doc = {error : JSON.stringify(err)} 
            }
        }
        if (typeof doc === "number" || req.params.cmd === "distinct") { doc = {ok : doc}; } 
        res.send(doc); 
    };
    return fn;
};

/* Routes */

// Query
app.get('/api/:collection', function(req, res) { 

    var item, sort = {};

    // for (item in req.query) {
    //     req.query[item] = (typeof +req.query[item] === 'number' && isFinite(req.query[item])) 
    //         ? parseFloat(req.query[item],10) 
    //         : req.query[item];
    //     if (item != 'limit' && item != 'skip' && item != 'sort' && item != 'order' && req.query[item] != "undefined" && req.query[item]) {
    //         qw[item] = req.query[item]; 
    //     }
    // }  
    // if (req.query.sort) { 
    //     sort[req.query.sort] = (req.query.order === 'desc' || req.query.order === -1) ? -1 : 1; 
    // }

   // console.log(req.query.sort);

    //db.collection(req.params.collection).find(qw).sort(sort).skip(req.query.skip).limit(req.query.limit).toArray(fn(req, res))


    //db.collection(req.params.collection).find(qw).sort({_id: -1}).toArray(fn(req, res));

    //qw. = {level:{$gt:90}};


    //if (req.query.time){
        //------ Happening soon  ------//

        if (req.query.time == "all"){
           
            /////CHANGE FOR TWITTER to created

            if (req.query.tag){ //hashtag search?

                var qw = {
                   'hashtags' : req.query.tag

                };

               // var qw = req.query.tag;

               // db.collection(req.params.collection).find(qw).sort({_id: -1}).toArray(fn(req, res));

                db.collection('tweets').find(qw).sort({_id: -1}).toArray(fn(req, res));


                //COMBINE with other query to db.collection('landmarks').find(qw)  

                //COMMENTS in seperate collection!

                //combine JSON, sort by _id
            }

            else {

                var qw = {};

                db.collection(req.params.collection).find(qw).sort({'time.start': 1}).toArray(fn(req, res));

            }
        }


        else if (req.query.time == "today"){

            //getting today & tomm
            var tod = new Date();
            var tom = new Date();
            tom.setDate(tod.getDate()+1);
            tod.setHours(0,0,0,0);
            tom.setHours(0,0,0,0);

            var qw = {
                'time.start': {
                    $gte: tod,
                    $lt: tom
                }
            };

            db.collection(req.params.collection).find(qw).sort({'time.start': 1}).toArray(fn(req, res));
        }

        else if (req.query.time == "soon"){


           // var currentTime = new Date(oldDateObj.getTime() + diff*60000); //adding 30 minutes to time for "soon" //http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object/1197939
           var currentTime = new Date(); 
           currentTime.setMinutes(currentTime.getMinutes() + 30); // adding 30minutes to current time for "soon"

           //LOGIC HERE ----> READ CURRENT TIME, determine place within hour, match to how conference schedule time is handled, ADD MORE TIME TO CURRENT TIME FOR QUERY based on how much avg. time is left in a conference BLOCK period

            var qw = {
                'time.start': {$lt: currentTime},
                'time.end': {$gt: currentTime}
            };
            db.collection(req.params.collection).find(qw).sort({_id: -1}).toArray(fn(req, res));
            //SORT BY START TIME !!!
        }


        //------ Happening now ------//
        else {
            var currentTime = new Date();
            var qw = {
                'time.start': {$lt: currentTime},
                'time.end': {$gt: currentTime}
            };
            db.collection(req.params.collection).find(qw).sort({_id: -1}).toArray(fn(req, res));
        }
  //  }



    


});

// Read 
app.get('/api/:collection/:id', function(req, res) {
    //console.log(req.params);
    db.collection(req.params.collection).findOne({id:objectId(req.params.id)}, fn(req, res))
});

// Save 
app.post('/api/:collection', function(req, res) {
    if (req.body._id) { req.body._id = objectId(req.body._id);}
    db.collection(req.params.collection).save(req.body, {safe:true}, fn(req, res));
});

// Delete
app.del('/api/:collection/:id', function(req, res) {
    db.collection(req.params.collection).remove({_id:objectId(req.params.id)}, {safe:true}, fn(req, res));
});

//Group
app.put('/api/:collection/group', function(req, res) {
    db.collection(req.params.collection).group(req.body, fn(req, res))
})

// MapReduce
app.put('/api/:collection/mapReduce', function(req, res) {
    if (!req.body.options) {req.body.options  = {}};
    req.body.options.out = { inline : 1};
    req.body.options.verbose = false;
    db.collection(req.params.collection).mapReduce(req.body.map, req.body.reduce, req.body.options, fn(req, res));    
})

// Command (count, distinct, find, aggregate)
app.put('/api/:collection/:cmd',  function (req, res) {
    if (req.params.cmd === 'distinct') {req.body = req.body.key}
    db.collection(req.params.collection)[req.params.cmd](req.body, fn(req, res)); 
})

app.listen(3001, function() {
    console.log("Listening on 3001");
});