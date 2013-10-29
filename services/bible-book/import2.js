var $ = require('jquery');
var fs = require('fs');
var data = {};

fs.readFile('kjv_zefania.xml', function (err, xml) {
  var $xml = $(xml.toString());

  $xml.find('BIBLEBOOK').each(function eachBibleBook() {
    var $book = $(this);
    var bnumber = $book.attr('bnumber');

    data[bnumber] = {
      no: bnumber,
      translations: {
        en: {
          name: $book.attr('bname'),
          alternatives: [$book.attr('bsname')]
        }
      },
      chapters: {}
    };

    $book.find('CHAPTER').each(function eachChapter() {
      var $chapter = $(this);
      var cnumber = $chapter.attr('cnumber');

      data[bnumber].chapters[cnumber] = {
        no: cnumber,
        numberOfVerses: $chapter.find('VERS').length
      };
    });

    console.log('BOOK ' + $book.attr('bname'), 'DONE');
  });

  fs.writeFile('var/books.json', JSON.stringify(data), function (err) {
    console.log('DONE');
  });
});