var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "https://www.javascriptcn.com/thread-2.html";
// var url = "http://dytt8.net/";

function fetchPage(x) {     //封装了一层函数
    startRequest(x);
}


function startRequest(x) {
    //采用http模块向服务器发起一次get请求
    console.log('==>spider started')

    request.get(x, function (err, res, body) {

        res.setEncoding('utf-8'); //防止中文乱码
        var $ = cheerio.load(body)
        var books = $('.title');

        var data = [];
        books.each(function (i, ele) {
            var item = {
                title: $(ele).attr('title'),
                img: $(ele).find('img').attr('src')
            }
            data.push(item)
        })
        let dataStr = JSON.stringify(data);
        console.log(dataStr);

        savedContent(data);
        savedImg(data);

    }).on('error', function (err) {
        console.log(err);
    });

}
//该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent(datas) {
    
    datas.forEach(element => {
        var itemStr = element.title + '\n' + element.img + '\n';
        fs.appendFile('./data/address.txt', itemStr, 'utf8', function (err) {
            if (err) {
                console.log(err);
            }
        })
    });

}
//该函数的作用：在本地存储所爬取到的图片资源
function savedImg(datas) {

    datas.forEach(ele => {

        var src = ele.img;

        request.head(src, function (err, res, body) {
            if (err) {
                console.log(err);
            }
        });

        var writeStream = fs.createWriteStream('./image/'+ele.title+'.jpg');
        request(src).pipe(writeStream);
    })
}

fetchPage(url);      //主程序开始运行