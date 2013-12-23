var fs = require('fs')
  , _ = require('underscore')    
  , ini = require('ini')
  , async = require('async')
  , when = require('when');

var function_ordummy = function(call){
  return typeof call != 'undefined' ? call : function(){ return; };
}

var $this;
var $ = module.exports = function(options){ 
  $this = this;
  this.deferred = when.defer();

  this.history_limit = 20;
  this.config = typeof options.config != 'undefined' ? options.config : {};
  this.file = typeof options.file != 'undefined' ? options.file : 'config.ini';
  this.load();


  return _.clone(this);
}
//history, limit
//proverqvam dali go ima 
//sortiram bookmarks


$.prototype.load = function(call) {
	call = function_ordummy(call);
	var self = this;

	fs.readFile(this.file, 'utf8', function (err, data) {
		if(typeof data != 'undefined'){
			var config = ini.decode(data);

			self.config = self.configFixtures(config);
		}
		
		call(err);
	});
}

$.prototype.configFixtures = function(config) {
	config = typeof config != 'undefined' ? config : {};

	config.bookmarks = typeof config.bookmarks != 'undefined' ? config.bookmarks : {};
	config.history = typeof config.history != 'undefined' ? config.history : {};
	config.main = typeof config.main != 'undefined' ? config.main : {};

	return config;
}

$.prototype.save = function(callback) {
	callback = function_ordummy(callback);
	var tmp_file = this.file + '.new';
	var file = this.file;
	var self = this;
	

	async.series([
	    function(call){ fs.writeFile(file, ini.stringify(self.config), call); },	    	    
	    // function(call){ fs.rename(tmp_file, file, call); },
	    // function(call){ fs.unlink(tmp_file, call); },    
	    // function(call){ fs.unlink(file, call); }
	],
	function(err, results){
	    callback();
	});
}

$.prototype.reload = function(callback) {
	callback = function_ordummy(callback);
	var self = this;

	async.series([
		function(call){ self.load(call); },
	    function(call){ self.save(call); },
	],	
	function(err, results){
	    callback(err);	    	    
	});
}


//bookmarks

$.prototype.addBookmark = function(bookmark, call) {
	var bookmarks = typeof this.config.bookmarks.collection != 'undefined' ? this.config.bookmarks.collection : [];

	bookmarks = _.map(bookmarks, function(item){ return objectFromString(item); });

	var found = _.find(bookmarks, function(b, index){ return b.url == bookmark.url; });
	if(typeof found != 'undefined'){
		call('already bookmarked');
		return;
	}

	bookmarks.push(bookmark);

	
	bookmarks = _.sortBy(bookmarks, "title");
	bookmarks = _.map(bookmarks, function(item){ return objectToString(item); });

 	this.config.bookmarks.collection = bookmarks;
 	this.save(call);
}

$.prototype.removeBookmark = function(bookmark, call) {
	var bookmarks = typeof this.config.bookmarks.collection != 'undefined' ? this.config.bookmarks.collection : [];

	bookmarks = _.map(bookmarks, function(item){ return objectFromString(item); });

	if(typeof bookmark == "string"){
		var found = _.find(bookmarks, function(b, index){ return b.title == bookmark; });
		if(typeof found != 'undefined'){
			var i = _.indexOf(bookmarks, found);
			bookmarks.splice(i, 1);	
		}
		
	}
	else if(typeof bookmark == "number"){
		bookmarks.splice(bookmark, 1);	
	}
	else if(typeof bookmark == "object"){
		var i = _.indexOf(bookmarks, bookmark);
		if(i > -1){
			bookmarks.splice(i, 1);		
		}
	
	}

	bookmarks = _.sortBy(bookmarks, "title");
	bookmarks = _.map(bookmarks, function(item){ return objectToString(item); });
	

	this.config.bookmarks.collection = bookmarks;
 	this.save(call);
}

$.prototype.listBookmarks = function(call) {
	var bookmarks = typeof this.config.bookmarks.collection != 'undefined' ? this.config.bookmarks.collection : [];
	call(null, bookmarks);
}





/////History

$.prototype.addHistory = function(history, call) {
	if(this.history_limit >= 20){
		call();
		return;
	}

	var historys = typeof this.config.historys.collection != 'undefined' ? this.config.historys.collection : [];

	historys.push(objectToString(history));

	historys = _.map(historys, function(item){ return objectFromString(item); });
	historys = _.sortBy(historys, "title");
	historys = _.map(historys, function(item){ return objectToString(item); });

 	this.config.historys.collection = historys;
 	this.save(call); 	
}

$.prototype.removeHistory = function(history, call) {
	var historys = typeof this.config.historys.collection != 'undefined' ? this.config.historys.collection : [];

	historys = _.map(historys, function(item){ return objectFromString(item); });

	if(typeof history == "string"){
		var found = _.find(historys, function(b, index){ return b.title == history; });
		if(typeof found != 'undefined'){
			var i = _.indexOf(historys, found);
			historys.splice(i, 1);	
		}
	}
	else if(typeof history == "number"){
		historys.splice(history, 1);	
	}
	else if(typeof history == "object"){
		var i = _.indexOf(historys, history);
		if(i > -1){
			historys.splice(i, 1);	
		}
		
	}

	historys = _.sortBy(historys, "title");
	historys = _.map(historys, function(item){ return objectToString(item); });
	

	this.config.historys.collection = historys;
 	this.save(call);
}

$.prototype.listHistory = function(call) {
	var historys = typeof this.config.historys.collection != 'undefined' ? this.config.historys.collection : [];
	call(null, historys);
}




//main config

$.prototype.set = function(key, value, call) {
	call = function_ordummy(call);
	var main = this.config.main;

	main[key] = value;

	this.config.main = main;

	this.save(call);
}


$.prototype.get = function(key, call) {
	call = function_ordummy(call);
	var main = this.config.main;

	if(typeof main[key] != 'undefined'){
		call(null, main[key]);	
	}
	else{
		call('cannot find config');		
	}
}



//other stuff

var obj_template = ["title", "url", "description"];

var objectToString = function(obj){
	var string = "";

	_.each(obj, function(element, index, list){
		string += element.replace(/\|/g, '') + '|';
	});

	return string.replace(/\|$/, '');
}

var objectFromString = function(string){
	var obj = {};
	var string_imploded = string.split("|");


	_.each(obj_template, function(element, index, list){
		obj[element] = string_imploded[index];
	});

	return obj;
}
