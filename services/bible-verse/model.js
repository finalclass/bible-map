'use strict';

var fs = require('fs');
var request = require('request');

exports.getChapter = function (language, translation, bookNumber, chapterNumber, callback) {
  fs.readFile(__dirname + '/var/bibles/' + language + '/' + translation + '/'
    + bookNumber + '/' + chapterNumber + '.json', function onFileRead(err, body) {
      if (err) {
        callback(err);
	  return;
      }
      callback(null, JSON.parse(body.toString()));
    });
};

exports.getVerses = function (language, translation, verse, callback) {
  request('http://localhost:7000/resolve/' + verse, function (error, response, body) {
    if (error) {
      callback(error);
      return;
    }
    
    var queryObj = JSON.parse(body.toString());

    if (!queryObj.book || !queryObj.chapter) {
      callback(new Error("book or chapter not found"));
      return;
    }

    exports.getChapter(language, translation, queryObj.book, queryObj.chapter, function (err, chapter) {
      if (err) {callback(err);}

      if (!queryObj.verseFrom && !queryObj.verseTo) {
        callback(null, chapter);
      }

      var verses = {};

      if (!queryObj.verseTo) {
        verses[queryObj.verseFrom] = chapter[queryObj.verseFrom];
        callback(null, verses);
        return;
      }

      for (var i = queryObj.verseFrom; i <= queryObj.verseTo; i += 1) {
        verses[i] = chapter[i];
      }

      callback(null, verses);
    });
  });
};