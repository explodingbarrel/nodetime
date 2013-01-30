'use strict';

var request = require('request');
var async = require('async');


function LoadTest() {

}
exports.LoadTest = LoadTest;



LoadTest.prototype.one = function(url, callback) {
  url || (url = 'http://localhost:3003');
  
  request(url, function(err, headers, body) {
    if(err) return callback(err);

    callback();
  });
}


LoadTest.prototype.run = function(url, duration, rate, callback) {
  url || (url = 'http://localhost:3003');
  
  var funcs = [];

  var duration = duration * 1000;
  var interval = Math.round(1000 / rate);
  for(var i = 0; i < duration; i = i + interval) {
    (function() {
      var timeout = i;

      funcs.push(function(callback) {
        setTimeout(function() {
          request(url, function(err, headers, body) {
            if(err) return callback(err);

            callback();
          });
        }, timeout);
      });
    })();
  }

  async.parallel(funcs, function(err, results) {
    callback(err);
  });
}