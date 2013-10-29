'use strict';

var data = require('./var/data.json');
var fs = require('fs');

Object.keys(data).forEach(function(bookNumber) {
  var book = data[bookNumber];

  Object.keys(book.translations).forEach(function(lang) {
    var translation = book.translations[lang];
    var names = book.translations[lang].alternatives;

    names.push(book.translations[lang].name);

    names = names.sort(function(a, b) {
      return a.length - b.length;
    });

    book.translations[lang] = names;
  });
});

fs.writeFile('./var/data2.json', JSON.stringify(data), function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('DONE');
  }
});