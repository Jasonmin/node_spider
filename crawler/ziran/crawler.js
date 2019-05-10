var http = require('http');
var cheerio = require('cheerio');
var request = require('request');

exports.dataCrawler = function (url, callback) {
    request(url, function (err, res) {
        if (err) {
            callback(err);
        }

        var htmlString = res.body.toString();
        var $ = cheerio.load(htmlString);

        var arr = $('.ali').children();

        var resArr = [];

        for (var i = 0; i < arr.length; i++) {

            var $thumb = $(arr[i]);
            var $img = $thumb.find('.il_img');
            var title = $img.find('a').attr('title');
            var linkUrl = $img.find('a').attr('href');
            var imgPath = $img.find('img').attr('src');

            var item = {
                id: i,
                title: title,
                imgPath: imgPath,
                linkUrl: linkUrl
            }
            resArr.push(item);
        }
        console.log(resArr);
        callback(null, resArr);
    });
}