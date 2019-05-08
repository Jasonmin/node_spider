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

        var arr = $('.list').children();

        var arr1 = $('li .thumbnail');
        var arr2 = $('li .content');

        // var arr3 = $('.thumbnail');

        var resArr = [];

        for (var i = 0; i < arr.length; i++) {

            var $thumb = $(arr1[i]);
            var $img = $thumb.find('.img');
            var title = $img.find('a').attr('title');
            var imgPath = $img.find('img').attr('src');

            var $content = $(arr2[i]);
            var $link = $content.find('.link');
            var linkUrl = $link.find('a').attr('href');

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