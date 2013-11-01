'use strict';

var $ = require('jquery');
var fs = require('fs');

function init() {
  ensureKJVDirectoryIsCreated();
  var $kjv = openKJV();
  $kjv.find('CHAPTER').each(function () {
    saveChapter($(this));
  });
}

function saveChapter($chapter) {
  var $book = $chapter.parent();
  var chapterNumber = $chapter.attr('cnumber');
  var bookNumber = $book.attr('bnumber');
  var chapter = {};

  ensureBookDirectoryIsCreated(bookNumber, chapterNumber);

  $chapter.find('VERS').each(function () {
    var $vers = $(this);
    chapter[$vers.attr('vnumber')] = {
      verse: $vers.text()
    };
  });

  fs.writeFileSync('./var/bibles/en/kjv/' 
    + bookNumber + '/' + chapterNumber + '.json', 
      JSON.stringify(chapter, undefined, 2));
}

function ensureBookDirectoryIsCreated(bookNumber, chapterNumber) {
  try {
    fs.mkdirSync('./var/bibles/en/kjv/' + bookNumber);
  } catch (e) {
  }
}

function openKJV() {
  return $(fs.readFileSync('./var/kjv_zefania.xml').toString());
}

function ensureKJVDirectoryIsCreated() {
	try {
		fs.mkdirSync('./var');
	} catch (e) {}

  try {
    fs.mkdirSync('./var/bibles');
  } catch (e) {}
  
  try {
    fs.mkdirSync('./var/bibles/en');
  } catch (e) {}
    
  try {
    fs.mkdirSync('./var/bibles/en/kjv');
  } catch (e) {}
    
}


init();







