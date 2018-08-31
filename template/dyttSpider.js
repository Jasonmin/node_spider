var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var userAgents = require('../userAgent')
var Iconv = require('iconv-lite');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/runoob";

// var url = "https://pan.baidu.com/disk/home#/all?path=%2F&vmode=list";
var url = "http://dytt8.net/html/gndy/jddy/20160320/50523.html";

function fetchPage(x) {     //封装了一层函数
    startRequest(x);
}

var totalItems = []

function startRequest(x) {

    console.log('==>spider started')
    let userAgent = userAgents[parseInt(Math.random() * userAgents.length)]
    let options = {
        'User-Agent': userAgent,
        encoding : null
    }
    request.get(x, options, function (err, res, body) {
        if (err) {
            console.log(err)
            return;
        }

        console.log('get result')
        
        var bodyString = (Iconv.decode(body, 'gb2312').toString());
        // var bodyString = (Iconv.decode(body, 'utf-8').toString());
        var $ = cheerio.load(bodyString)
        var movies = $('.co_content8');

        // var items = [];
        var urls = movies.find('a');

        urls.each(function (i, item) {
            var newItem = {
                title: $(item).attr('href'),
            }
            if (newItem.title.indexOf('http') > -1) {
                totalItems.push(newItem)
                // getMovieUrlRequest(newItem.title)
            }
        })

        if (urls.length<1) {
            insertMongoDatas(totalItems);
            return;
        }

        let nextPage = getNextPage(url)
        if (nextPage) {
            setTimeout(() => {
                startRequest(nextPage);
            }, Math.random() * 5000);
        }
    }).on('error', function (err) {
        console.log(err);
    });
}

function insertMongoDatas(datas) {
    // 创建集合
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      
      var dbase = db.db('spider')
      dbase.createCollection('movies',function(err,res) {
          if (err) throw err
          console.log('创建集合')
          
          db.close();
      })
    });

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        
        var dbase = db.db('spider');
        dbase.collection('movies'). insertMany(datas,function(err,res) {
            if (err) throw err;
            console.log('多条文档插入成功')
            db.close();
        })
      });
}



function getMovieUrlRequest(x) {
    request.get(x, function (err, res, body) {

        if (err) {
            return;
        }

        res.setEncoding('utf-8'); //防止中文乱码
        var $ = cheerio.load(body)
        var movies = $('.co_content8');

        var data = [];
        movies.each(function (i, ele) {
            var urls = $(ele).find('a');
            urls.each(function (i, item) {
                var newItem = {
                    title: $(item).attr('href'),
                }
                if (newItem.title) {
                    if (newItem.title.indexOf('ftp') > -1) {
                        data.push(newItem)
                    }
                }
            })
        })
        savedContent(data);
    }).on('error', function (err) {
        console.log(err);
    });

}

var pageIdx = 1;
function getNextPage(x) {

    var URLS = [
        'http://dytt8.net/html/gndy/jddy/20160320/50523.html',
    'http://dytt8.net/html/gndy/jddy/20160320/50523_2.html',
    'http://dytt8.net/html/gndy/jddy/20160320/50523_3.html',
    'http://dytt8.net/html/gndy/jddy/20160320/50523_4.html']

    pageIdx++;
    var page = pageIdx;
    console.log('page::' + page)
    if (page > 3) {
        return null;
    }
    return URLS[pageIdx];
}

var idx = 0;

//该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent(datas) {

    datas.forEach(element => {

        idx++;

        var itemStr = idx + "::" + element.title + '\n';
        fs.appendFile('./movie/address.txt', itemStr, 'utf8', function (err) {
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
        var writeStream = fs.createWriteStream('./image/' + ele.title + '.jpg');
        request(src).pipe(writeStream);
    })
}

fetchPage(url);      //主程序开始运行