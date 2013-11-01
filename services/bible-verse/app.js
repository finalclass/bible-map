
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var model = require('./model.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/:language/:translation/:bookNumber/:chapterNumber', function getWholeChapter (req, res) {
  model.getChapter(
    req.params.language, 
    req.params.translation, 
    req.params.bookNumber, 
    req.params.chapterNumber,
    function (err, chapter) {
      if (err) {
        return res.json(404, {error: 'not_found'});
      }
      return res.json(chapter);
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
