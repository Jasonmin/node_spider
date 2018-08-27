var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var userAgents = require('./userAgent')
var MongoClient = require('mongodb').MongoClient;
// var dbURL = 'mongodb:/localhost:27017/runoob'
var dbURL = "mongodb://localhost:27017/runoob";

var i = 0;
var url = "https://www.javascriptcn.com/thread-2.html";



function fetchPage(x) {     //封装了一层函数

    // MongoClient.connect(dbURL, function (err, db) {
    //     if (err) throw err;

    //     var dbase = db.db('spider')
    //     dbase.createCollection('jsbook', function (err, res) {
    //         if (err) throw err
    //         console.log('创建集合')

    //         db.close();
    //     })
    // });

    // startRequest(x);

    queryData();
}


function queryData() {
    MongoClient.connect(dbURL, function(err, db) {
        if (err) throw err;
        
        var dbase = db.db('spider');
        dbase.collection('jsbook').find({}).toArray(function(err,res) {
            if (err) throw err;
    
            console.log(res)
            db.close();
        })
    });
}

function startRequest(x) {
    //采用http模块向服务器发起一次get请求
    console.log('==>spider started')

    let userAgent = userAgents[parseInt(Math.random() * userAgents.length)]

    let options = {
        'User-Agent': userAgent
    }

    request.get(x, options, function (err, res, body) {

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

        MongoClient.connect(dbURL, function (err, db) {
            if (err) throw err;
            var dbase = db.db('spider');

            if (data.length == 0) {
                return;
            }

            var myobj = data;

            dbase.collection('jsbook').insertMany(myobj, function (err, res) {
                if (err) throw err;
                console.log('多条文档插入成功')
                db.close();
            })
        });

        // let dataStr = JSON.stringify(data);
        // console.log(dataStr);

        // savedContent(data);
        // savedImg(data);

        let nextPage = getNextPage(x)
        if (nextPage) {
            setTimeout(() => {

                startRequest(nextPage);
            }, Math.random() * 5000);
        }
    });

}

var pageIdx = 1;
function getNextPage(x) {

    pageIdx++;

    if (x.indexOf('?') == -1) {
        return x + "?page=2";
    } else {

        var page = pageIdx;
        if (page > 15) {
            return null;
        }
        console.log('page::' + page)
        return url + "?page=" + page.toString();
    }
}

var idx = 0;

//该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent(datas) {

    datas.forEach(element => {

        idx++;

        var itemStr = idx + "::" + element.title + '\n' + element.img + '\n';
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

        var writeStream = fs.createWriteStream('./image/' + ele.title + '.jpg');
        request(src).pipe(writeStream);
    })
}

fetchPage(url);      //主程序开始运行