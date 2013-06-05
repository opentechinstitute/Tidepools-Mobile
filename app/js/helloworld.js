var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {



	var kittySchema = mongoose.Schema({
		name: String
	});

	//------ METHOD function ------//
	kittySchema.methods.speak = function () {
	  var greeting = this.name
	    ? "Meow name is " + this.name
	    : "I don't have a name"
	  console.log(greeting);
	}

	//-----------------------------//


	var Kitten = mongoose.model('Kitten', kittySchema);  // compiling schema model into mongoose


	var fluffy = new Kitten({ name: 'fluffy' });
	//fluffy.speak();


	var silence = new Kitten({ name: 'Silence' });
	//console.log(silence.name); // 'Silence'

	//console.log(fluffy.speak());


	fluffy.save(function (err, fluffy) {
	    if (err) // TODO handle the error
	        console.log(err.message);
	    else
	        fluffy.speak();
	});
	
	Kitten.find(function (err, kittens) {
	    if (err) // TODO handle err
	        console.log(kittens)
	    else {
	        for (var i = 0; i < kittens.length; i++) {
			  kittens[i].speak();
			}
	    }
	});

	// fluffy.save(function (err, fluffy) {
	//   if (err) // TODO handle the error
	//   fluffy.speak();
	// });


	// Kitten.find(function (err, kittens) {
	//   if (err) // TODO handle err
	//   console.log(kittens)
	// })


	// Kitten.find({ name: /^Fluff/ }, callback)




});

