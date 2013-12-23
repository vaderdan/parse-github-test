/**
  This controller is used to seed static data into the database 
  in development environment
*/

var request = require('request')
  , _ = require('underscore')
  , highlight = require('pygments').colorize
  , sh = require('shelljs')
  , when = require('when')
  , fs = require('fs')
  , $ = module.exports = Pygments = {};




$.pygmentize = function(target, call, call2) {
	if (!sh.which('pygmentize')) {
		call('python binary is missing')
	  return;
	}

	fs.exists(target, function(exists){
		if(exists){
			$.pygmentizeFile(target, call);
		}
		else{
			$.pygmentizeString(target, call, call2);	
		}
	});
}

$.pygmentizeFile = function(file, call) {
	if (!sh.which('pygmentize')) {
		call('python binary is missing')
	  return;
	}

	getLexer(file).
	then(function(lexer){
		return executeHighlight(file, lexer, 'console', { 'O': 'style=monokai,linenos=1'});
	}).
	then(function(data){
		call(null, data);
	});
}

$.pygmentizeString = function(string, lexer, call) {
	if (!sh.which('pygmentize')) {
		call('python binary is missing')
	  return;
	}
	
	executeHighlight(string, lexer, 'console', { 'O': 'style=monokai,linenos=1'}).	
	then(function(data){
		call(null, data);
	});
}



var getLexer = function(target){
	var deferred = when.defer();

	sh.exec('pygmentize -N ' + target, {'silent': true}, function(code, lexer) {
		

		if(code != 0){
			deferred.reject(new Error('Lexer not found'));
		}
		else{
			lexer = lexer.replace(/\n/, '', lexer);
			deferred.resolve(lexer); 
		}
	});


	return deferred.promise;
}

var executeHighlight = function(target, lexer, format, options){
	var deferred = when.defer();

	highlight(target, lexer, format, function(data) {
		deferred.resolve(data); 		 	
	}, options);

	return deferred.promise;
}


