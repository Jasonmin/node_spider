var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var userAgents = require('../userAgent')
var Iconv = require('iconv-lite');
var Bagpipe = require('bagpipe');


var srcUrl = "http://pngimg.com/imgs/nature";
var srcImg = "http://pngimg.com";

function fetchPage(x) { //封装了一层函数
    startRequest(x);
}

var totalItems = []

function startRequest(x) {

    console.log('==>spider started')
    let userAgent = userAgents[parseInt(Math.random() * userAgents.length)]
    let options = {
        'User-Agent': userAgent,
        encoding: null
    }
    request.get(x, options, function(err, res, body) {
        if (err) {
            console.log(err)
            return;
        }

        console.log('get result')

        // var bodyString = (Iconv.decode(body, 'gb2312').toString());
        var bodyString = (Iconv.decode(body, 'utf-8').toString());
        var $ = cheerio.load(bodyString)
        var items = $('.png_png');

        // var items = [];

        var urls = items.find('img');

        var bagpipe = new Bagpipe(100);

        urls.each(function(i, item) {
            var itemPath = $(item).attr('data-cfsrc');
            if (itemPath != undefined) {
                var names = itemPath.split('/')
                var itemTitle = names.pop()
                var itemUrl = `${srcImg}${itemPath}`;

                var newItem = {
                    img: itemUrl,
                    title: itemTitle.toLowerCase()
                }
                if (newItem.img.indexOf('http') > -1) {
                    totalItems.push(newItem)
                }
            }
        })

        var item = totalItems[0];

        // console.log(item.img)

        // bagpipe.push(savedItemImg, item.img, item.title, function(err, data) {
        //     if (err) {
        //         console.log(`down err:${err}`);
        //     } else {
        //         console.log(`data:${data}`)
        //     }
        // })

        if (totalItems.length > 0) {
            // savedImg(totalItems)
            totalItems.forEach(function(item) {
                bagpipe.push(savedItemImg, item.img, item.title, function(err, data) {
                    if (err) {
                        console.log(`down err:${err}`);
                    } else {
                        console.log(`data:${data}`)
                    }
                })
            })
        }

    }).on('error', function(err) {
        console.log(err);
    });
}


//该函数的作用：在本地存储所爬取到的图片资源
function savedImg(datas) {

    datas.forEach(ele => {
        var src = ele.img;
        request.head(src, function(err, res, body) {
            if (err) {
                console.log(err);
            }
        });
        var writeStream = fs.createWriteStream('./image/' + ele.title);
        request(src).pipe(writeStream);
    })
}

function savedItemImg(path, name) {

    var src = path;
    request.head(src, function(err, res, body) {
        if (err) {
            console.log(err);
        }
    });
    var writeStream = fs.createWriteStream('./image/' + name);
    request(src).pipe(writeStream);
}

fetchPage(srcUrl); //主程序开始运行