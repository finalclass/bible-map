'use strict';

var data = require('./var/data.json');
var indexByName = {};

Object.keys(data).forEach(function (bookNumber) {
  var book = data[bookNumber];
  Object.keys(data[bookNumber].translations).forEach(function (lang) {
    var tr = book.translations[lang];
    indexByName[tr.name.toLowerCase()] = book;
    tr.alternatives.forEach(function (name) {
      indexByName[name.toLowerCase()] = book;
    });
  });
});

exports.getBooksNumbers = function () {
  return Object.keys(data);
};

exports.getChaptersNumbers = function (bookNumber) {
  return Object.keys(data[bookNumber].chapters);
};

exports.getNumberOfVerses = function (bookNumber, chapterNumber) {
  return data[bookNumber].chapters[chapterNumber].numberOfVerses;
};

exports.getBookNameTranslations = function (bookNumber) {
  return data[bookNumber].translations;
};

exports.getBookNamesForLanguage = function (bookNumber, language) {
  return data[bookNumber].translations[language];
}

exports.getBookNumberByName = function (name) {
  return parseInt(indexByName[name.toLowerCase()].no);
};