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
  var book = indexByName[name.toLowerCase()];
  if (!book) {
    return null;
  }
  return parseInt(book.no);
};

exports.resolve = function (q) {
  q = q.replace(/\s\s/g, '');

  var byDash = q.split('-')
  if (byDash.length > 1) {
    var verseTo = parseInt(byDash[1]);
  }

  var byColon = byDash[0].split(':');
  if (byColon.length > 1) {
    var verseFrom = parseInt(byColon[1]);
  }

  var bySpace = byColon[0].split(' ');
  if (parseInt(bySpace[0]) == bySpace[0]) {
    var bookName = bySpace[0] + ' ' + bySpace[1];
    var chapter = bySpace[2];
  } else {
    var bookName = bySpace[0];
    var chapter = bySpace[1];
  }

  var bookNumber = exports.getBookNumberByName(bookName);

  if (!bookNumber) {
    throw new Error('Book not found');
  }

  var numberOfChaptersInBook = exports.getChaptersNumbers(bookNumber).length;
  if (chapter > numberOfChaptersInBook) {
    chapter = numberOfChaptersInBook;
  }


  var numberOfVersesInChapter = exports.getNumberOfVerses(bookNumber, chapter);
  if (verseFrom > numberOfVersesInChapter) {
    verseFrom = numberOfVersesInChapter;
  }

  if (verseTo > numberOfVersesInChapter) {
    verseTo = numberOfVersesInChapter;
  }

  if (verseFrom > verseTo) {
    return res.json(400, {error: 'Verse from greater then verse to'});
  }

  return {
    book: bookNumber,
    chapter: chapter,
    verseFrom: verseFrom,
    verseTo: verseTo
  };
}