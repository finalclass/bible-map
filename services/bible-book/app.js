'use strict';

// requirements
var express = require('express');
var http = require('http');
var path = require('path');
var model = require('./model.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 7000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(function (req, res, next) {
  res.charset = 'utf8';
  next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function sendBooks (req, res) {
  res.json(model.getBooksNumbers());
});

app.get('/book-by-name/:bookName', function findBookByName(req, res) {
  res.json(model.getBookNumberByName(req.params.bookName));
});

app.get('/resolve/:query', function findBookNumberChapterAndVerse (req, res) {
  console.log(req.params);
  try {
    res.json(model.resolve(req.params.query));
  } catch (e) {
    res.json(404, {error: 'book not found'});
  }
});

app.get('/:bookNumber/chapter', function sendChapters (req, res) {
  res.json(model.getChaptersNumbers(req.params.bookNumber));
});

app.get('/:bookNumber/chapter/:chapterNumber/number-of-verses', function sendChapterVerses (req, res) {
  res.json(model.getNumberOfVerses(req.params.bookNumber, req.params.chapterNumber));
});

app.get('/:bookNumber/name', function sendBookNames (req, res) {
  res.json(model.getBookNameTranslations(req.params.bookNumber));
});

app.get('/:bookNumber/name/:language', function sendBookNamesInLanguage (req, res) {
  res.json(model.getBookNamesForLanguage(req.params.bookNumber, req.params.language));
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
