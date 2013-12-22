/**
  This controller is used to seed static data into the database 
  in development environment
*/

var request = require('request')
  , _ = require('underscore')
  , $ = module.exports = {}



$.index = function(req, res) {
	
	
	PygmentsService.go('app.js', function(err, data){

		console.log(data);
	});

	res.send('bla');
}

// console.log('here')
// PygmentsService.go();