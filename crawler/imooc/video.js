var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
var Iconv = require('iconv-lite');

var url = "http://www.imooc.com/learn/857";

exports.videocrawler = function(url,callback){
    request(url,function(err,res){
        if(err){
            callback(err);
        }

        var $ = cheerio.load(res.body.toString());

        var videoList = [];
        
        $('.video li a').each(function(){
            var $title = $(this).parent().parent().parent().text().trim();
            var title = $title.split('\n');
            var text = $(this).text().trim();
            text = text.split('\n');
            //console.log(text);
            var time = text[1].match(/\((\d+\:\d+)\)/); 
            var item={
                title : title[0],
                url : 'http://www.imooc.com'+$(this).attr('href'),
                name : text[0],
                duration : time[1]
            };
            var s = item.url.match(/video\/(\d+)/);
            //console.log(s);
            if(Array.isArray(s)){
                item.id = s[1];
                videoList.push(item);
            }
        });
            
        callback(null,videoList);
    });
}