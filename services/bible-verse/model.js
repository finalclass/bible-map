'use strict';

var fs = require('fs');

exports.getChapter = function (language, translation, bookNumber, chapterNumber, callback) {
  fs.readFile('./var/bibles/' + language + '/' + translation + '/' 
    + bookNumber + '/' + chapterNumber + '.json', function onFileRead(err, body) {
      if (err) {
        callback(err);
      }
      callback(null, JSON.parse(body.toString()));
    });
}