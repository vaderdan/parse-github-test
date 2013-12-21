var fs = require('fs')
  , _ = require('underscore')  
  , when = require('when')
  , md5 = require('MD5')
  , request = require('request')
  , GitHubApi = require('github')
  , GitHubApi2 = require('octonode')
  , xpath = require('xpath')
  , dom = require('xmldom').DOMParser;

var repos = {};
var reposFiles = {};
var base_url = 'http://github.com';

var function_ordummy = function(call){
  return typeof call != 'undefined' ? call : function(){ return; };
}



var $this;
var $ = module.exports = function(options){ 
  $this = this;

  this.github = GitHubApi2.client();
  this.loading = function_ordummy(options.loading);
  this.done = function_ordummy(options.loading);
  this.cache = typeof options.cache != 'undefined' ? options.cache : './cache.txt';

  


  return _.clone(this);
}




//generirane na data url


$.prototype.getUser = function(user, call){
  call = function_ordummy(call);

  this.github.get('/users/' + user, {}, function (err, status, data, headers) {
    call(err, data);
  });
}

$.prototype.getUserRepos = function(user, call){
  call = function_ordummy(call);

  
  
  if(typeof repos[user] == 'undefined'){
    this.github.get('/users/'+user+'/repos', {}, function (err, status, data, headers) {
      

      repos[user] = {};

      for(var r in data){
        var item = data[r];
        repos[user][item['name']] = item;
      }


      call(err, repos[user]);
    });
  }  
  else{
    call(null, repos[user]);
  }
}

$.prototype.cacheUserRepos = function(user, call){
  call = function_ordummy(call);

  var file = this.cache;


  
  if(typeof repos[user] == 'undefined'){
    this.github.get('/users/'+user+'/repos', {}, function (err, status, data, headers) {
      

      repos[user] = {};

      for(var r in data){
        var item = data[r];
        repos[user][item['name']] = item;
      }


      call(err, repos[user]);
    });
  }
  else{
    call(null, repos[user]);
  }
}

$.prototype.request = function(url, call){
  this.loading();

  console.log('loading')

  request(url, function (error, response, body) {
    $this.done();

    console.log('done')

    if (!error && response.statusCode == 200) {
      call(null, response, body);      
    }
    else{
      call('request error', {}, {});
    }
  })
};


//retrieve files and directories structure for html of github
$.prototype.gitTreeReadFiles = function(url, call){
  
  var obj = {}
  obj.files = [];
  obj.dirs = [];
  obj.url = url;


  this.request(url, function (error, response, body) {      
    var doc = new dom(({errorHandler: {}})).parseFromString(body);
    var file_nodes = xpath.select("//*[@class='octicon octicon-file-text']/../..//a[@class='js-directory-link']", doc);
    var dir_nodes = xpath.select("//*[@class='octicon octicon-file-directory']/../..//a[@class='js-directory-link']", doc);

    _.each(file_nodes, function(item){
      obj.files.push(base_url + item.getAttribute('href'));  
    });
    _.each(dir_nodes, function(item){
      obj.files.push(base_url + item.getAttribute('href'));  
    });

    

    call(error, obj);
  })
}




$.prototype.getTree = function(html_url, repo_data, call){
  var self = this;

    this.request(html_url, function(err, response, body){
      var doc = new dom(({errorHandler: {}})).parseFromString(body);
      var nodes = xpath.select("//*[@class='files']/tbody[@data-url]", doc)

      if(typeof nodes[0] != 'undefined'){
        var tree_url = base_url + nodes[0].getAttribute('data-url');
        self.gitTreeReadFiles(tree_url, function(err, data){             

          if(!err){
            repo_data = data;
          }
          else{
            repo_data = { 'empty': true };
          }

          call(err, repo_data);
        });
      }
      else {
        repo_data = { 'empty': true };
        call(err, repo_data);
      }      
    });
}

$.prototype.getUserRepoFiles = function(user, repo, dir, call){
  call = function_ordummy(call);
  var self = this;


  var processFiles = function(err, data){
      reposFiles[user] = typeof reposFiles[user] != 'undefined' ? reposFiles[user] : {};
      reposFiles[user][repo] = typeof reposFiles[user][repo] != 'undefined' ? reposFiles[user][repo] : {};
      reposFiles[user][repo][dir] = typeof reposFiles[user][repo][dir] != 'undefined' ? reposFiles[user][repo][dir] : {};
      var html_url = repos[user][repo].html_url;

      html_url = typeof dir != 'undefined' ? dir : html_url;



      if((typeof reposFiles[user][repo][dir].url == 'undefined' && typeof reposFiles[user][repo][dir].empty == 'undefined') && typeof html_url != 'undefined'){
        self.getTree(html_url, reposFiles[user][repo][dir], function(err, data){
          reposFiles[user][repo][dir] = data;
          call(err, data);
        });
      }
      else{
        call(null, reposFiles[user][repo][dir]);
      }


    }

    this.getUserRepos(user, function(err, data){
      processFiles(err, data);
    });

}

  








$.prototype.downloadFile = function(url, call){
  
}



