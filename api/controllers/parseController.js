/**
  This controller is used to seed static data into the database 
  in development environment
*/

var request = require('request')
  , _ = require('underscore')
  , $ = module.exports = {}



$.index = function(req, res) {
	var parse = new ParseService({});
	

	res.send('here');
}

$.user = function(req, res) {	
	var parse = new ParseService({});

	var user ='vaderdan';

	parse.getUser(user, function(err, data){
		if(!err){
			res.send(data);	
		}
		else{
			res.send(err);
		}
		
	});
}

$.repos = function(req, res) {	
	var parse = new ParseService({});

	var user = req.query['user'];

	parse.getUserRepos(user, function(err, data){
		if(!err){
			res.send(data);	
		}
		else{
			res.send(err);
		}
	});
}

$.repostree = function(req, res) {	
	var parse = new ParseService({});

	var user = req.query['user'];
	var repo = req.query['repo'];
	var dir = typeof req.query['dir'] != 'undefined' ? req.query['dir'] : undefined;

	parse.getUserRepoFiles(user, repo, dir, function(err, data){
		
		res.send(data);	
		
	});
}