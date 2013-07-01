var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/amctest');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {



	var landmarkSchema = mongoose.Schema({
		name: String
	});

	var landmark = mongoose.model('landmark', landmarkSchema);  // compiling schema model into mongoose


	var newLandmark = new landmark({ 
		name: 'fluffy' 
	});



	newLandmark.save(function (err, fluffy) {
	    if (err) // TODO handle the error
	        console.log(err.message);
	    else
	        console.log("success");
	});
	
	// Kitten.find(function (err, kittens) {
	//     if (err) // TODO handle err
	//         console.log(kittens)
	//     else {
	//         for (var i = 0; i < kittens.length; i++) {
	// 		  kittens[i].speak();
	// 		}
	//     }
	// });

	// fluffy.save(function (err, fluffy) {
	//   if (err) // TODO handle the error
	//   fluffy.speak();
	// });


	// Kitten.find(function (err, kittens) {
	//   if (err) // TODO handle err
	//   console.log(kittens)
	// })


	// Kitten.find({ name: /^Fluff/ }, callback)


	db.close();

});

