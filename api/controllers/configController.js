/**
  This controller is used to seed static data into the database 
  in development environment
*/

var request = require('request')
  , _ = require('underscore')
  , $ = module.exports = {}



$.index = function(req, res) {	
	var c = new ConfigService({
		file: './config.ini'
	});

	

	// c.save()
	// .then(function(){
	// 	console.log(c.config);
	// });
	
	c.load(function(){
		c.addBookmark({title: 'alabala', 'url': 'http://asd.com', 'description': 'asdasdasd'}, function(err){
			console.log('done');
		})
		c.addBookmark({title: 'alabala', 'url': 'http://asd2.com', 'description': 'asdasdasd'}, function(err){
			console.log('done');
		})


		c.removeBookmark('alabala2', function(err){
			console.log('done');
		})

		c.set('aa', 2)
		c.set('aa2', 3)

		c.get('aa', function(err, value){
			console.log(value);
		})
	});
	

	



	res.send('here');
}
