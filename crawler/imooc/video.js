var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
var Iconv = require('iconv-lite');

var url = "http://124.204.65.86:14423/static/app/ipas/ipaList.html";

exports.videocrawler = function(url,callback){
    request(url,function(err,res){
        if(err){
            callback(err);
        }

        var htmlString = res.body.toString();
        var $ = cheerio.load(htmlString);

        var arr = $('.list').children();

        var arr1 = $('li .thumbnail');
        var arr2 = $('li .content');

        var resArr = [];

        for (var i=0;i<arr.length;i++) {

            var $thumb = $(arr1[i]);
            var $img = $thumb.find('.img');
            var title = $img.find('a').attr('title');
            var imgPath = $img.find('img').attr('src');

            var $content = $(arr2[i]);
            var $link = $content.find('.link');
            var linkUrl = $link.find('a').attr('href');

            var item = {
                id:i,
                title:title,
                imgPath:imgPath,
                linkUrl:linkUrl
            }
            resArr.push(item);
        }

        console.log(resArr);

        // arr.each(function() {
        //     var $thumb = $(this);
        //     var $content = $(this)('.content');

        //     var cotentArr = $content.children();
        //     var tarTitle = cotentArr[0]('.title');

        //     var item = {
        //         title:tarTitle
        //     };
        //     // console.log(title);
        //     resArr.push(item);
        // });

        // console.log(resArr);

        callback(null,resArr);
        
        // arr.each(function(){
        //     var $title = $(this).parent().parent().parent().text().trim();
        //     var title = $title.split('\n');
        //     var text = $(this).text().trim();
        //     text = text.split('\n');
        //     //console.log(text);
        //     var time = text[1].match(/\((\d+\:\d+)\)/); 
        //     var item={
        //         title : title[0],
        //         url : 'http://www.imooc.com'+$(this).attr('href'),
        //         name : text[0],
        //         duration : time[1]
        //     };
        //     var s = item.url.match(/video\/(\d+)/);
        //     //console.log(s);
        //     if(Array.isArray(s)){
        //         item.id = s[1];
        //         videoList.push(item);
        //     }
        // });
            
        // callback(null,videoList);
    });
}