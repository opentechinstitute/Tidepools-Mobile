/*
.===.      .                    .
  |  o     |                    |
  |  .  .-.| .-. .,-.  .-.  .-. | .==.
  |  | (   |(.-' |   )(   )(   )| `==.
  '-' `-`-'`-`=='|`-'  `-'  `-' `-`==' Mobile ≈☯ v0.3
                 |
                 '
  Open Technology Institute & J.R. Baldwin
  tidepools.co <3 <3 <3 
*/

var fs = require('fs');
var im = require('imagemagick');

var express = require('express'),
    app = module.exports.app = express(), 
    db = require('mongojs').connect('redhook');
    
app.configure(function () {
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.logger('dev'));  //tiny, short, default
	app.use(app.router);
	app.use(express.static(__dirname + '/app'));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true, showMessage: true}));
});

/* Helpers */

//Parts of express code from: https://github.com/dalcib/angular-phonecat-mongodb-rest
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

        //------ Happening soon  ------//

        if (req.query.time == "all"){ //no time sort

            if (req.query.tag){ //hashtag
                var qw = {
                   'text' : {$regex : ".*"+req.query.tag+".*", $options: 'i'}
                };
                db.collection('tweets').find(qw).sort({_id: -1}).toArray(fn(req, res));
            }

            else if (req.query.session){ //session search (THIS NEEDS TO BE FIXED TO INDEX TEXT FROM SESSIONS NOT A GIANT TEXT BLOCK IN MONGO)

                var qw = {
                    
                    "searchField" : {$regex : ".*"+req.query.session+".*", $options: 'i'}
                };

                db.collection('landmarks').find(qw).sort({_id: -1}).toArray(fn(req, res));
            }

            else {

                var qw = {};
                var limit;

                if (req.params.collection == 'landmarks'){
                   db.collection(req.params.collection).find(qw).limit(limit).sort({'time.start': 1}).toArray(fn(req, res));
                }

                if (req.params.collection == 'tweets'){

                        if (req.query.limit){ //limited tweet query
                            limit = parseInt(req.query.limit);
                            db.collection(req.params.collection).find(qw).limit(limit).sort({_id: -1}).toArray(fn(req, res));
                        }

                        else {
                            db.collection(req.params.collection).find(qw).sort({_id: -1}).toArray(fn(req, res));
                        }
                }                
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

           var currentTime = new Date(); 
           currentTime.setMinutes(currentTime.getMinutes() + 45); // adding 30minutes to current time for "soon"

            var qw = {
                'time.start': {$lt: currentTime},
                'time.end': {$gt: currentTime}
            };
            db.collection(req.params.collection).find(qw).sort({_id: -1}).toArray(fn(req, res));
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
});

// Read 
app.get('/api/:collection/:id', function(req, res) {
    db.collection(req.params.collection).findOne({id:objectId(req.params.id)}, fn(req, res));
});

// Save 
app.post('/api/:collection/create', function(req, res) {
    if (req.body._id) { req.body._id = objectId(req.body._id);}
    db.collection(req.params.collection).save(req.body, {safe:true}, fn(req, res));
});

// Delete
app.del('/api/:collection/:id', function(req, res) {
    db.collection(req.params.collection).remove({_id:objectId(req.params.id)}, {safe:true}, fn(req, res));
});

//Group
app.put('/api/:collection/group', function(req, res) {
    db.collection(req.params.collection).group(req.body, fn(req, res));
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


app.post('/api/upload',  function (req, res) {


    if (req.files.files[0].size <= 5242880){

        fs.readFile(req.files.files[0].path, function (err, data) {

            //console.log(req.files.files[0]);

            var fileName = req.files.files[0].name.substr(0, req.files.files[0].name.lastIndexOf('.')) || req.files.files[0].name;
            var fileType = req.files.files[0].name.split('.').pop();

            while (1) {

                var fileNumber = Math.floor((Math.random()*100000000)+1); //generate random file name
                var fileNumber_str = fileNumber.toString(); 
                var current = fileNumber_str + '.' + fileType;

                //checking for existing file, if unique, write to dir
                if (fs.existsSync(__dirname + "/app/uploads/" + current)) {
                    continue; //if there are max # of files in the dir this will infinite loop...
                } 
                else {
                    var newPath = __dirname + "/app/uploads/" + current;

                    fs.writeFile(newPath, data, function (err) {

                        im.crop({
                          srcPath: newPath,
                          dstPath: newPath,
                          width: 100,
                          height: 100,
                          quality: 1,
                          gravity: "Center"
                        }, function(err, stdout, stderr){

                            res.send("uploads/"+current);

                        });
                    });

                    break;
                }
            }

        });
    }

    else {

        res.send('Not Saved: File is bigger than 5MB, please try again.');
    }

});


app.get('/api/:collection/locsearch', function(req, res) { 

    console.log('asdf');

    res.send(req);


});


app.listen(3002, function() {
    console.log("Chillin' on 3002 ~ ~");
});















