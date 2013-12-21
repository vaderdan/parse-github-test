/**
  This controller is used to seed static data into the database 
  in development environment
*/

var request = require('request')
  , _ = require('underscore')
  , $ = module.exports = {}



$.index = function(req, res) {
	PygmentsService.go();
	

	res.send('here');
}
