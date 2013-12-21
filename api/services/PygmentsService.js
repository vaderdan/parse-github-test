/**
  This controller is used to seed static data into the database 
  in development environment
*/

var request = require('request')
  , _ = require('underscore')
  , highlight = require('pygments').colorize
  , sh = require('shelljs')
  , $ = module.exports = Pygments = {};




$.go = function() {
	if (!sh.which('pygmentize')) {
		console.log('here')
	  return;
	}

	// console.log('here2')

	var file = 'app.js';
	var lexer;

	sh.exec('pygmentize -N ' + file, function(code, lexer) {
		lexer.replace(/\n/, '', lexer);
		// lexer = output;

		highlight(file, lexer, 'console', function(data) {
		  console.log(data);
		}, { 'O': 'style=monokai,linenos=1'});
	});

	

	// if (exec('git commit -am "Auto-commit"').code !== 0) {
	//   echo('Error: Git commit failed');
	//   exit(1);
	// }

	// var lexer = 


	// // target, lexer, format, callback, options
	// // console.log(highlight.toString());
	

	
}
