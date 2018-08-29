var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "http://dytt8.net/html/gndy/jddy/20160320/50523";

function fetchPage(x) {     //封装了一层函数
    startRequest(x);
}


function startRequest(x) {
    //采用http模块向服务器发起一次get请求
    console.log('==>spider started')

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

            urls.each(function(i,item) {

                var newItem = {
                    title: $(item).attr('href'),
                }

                // var targetPage = $(item).attr('href'),
                
                if (newItem.title.indexOf('http')>-1) {
                    getMovieUrlRequest(newItem.title)
                }


                // data.push(newItem)
            })


        })
        // let dataStr = JSON.stringify(data);
        // console.log(dataStr);

        // savedContent(data);
        // savedImg(data);

        let nextPage = getNextPage(url)
        if (nextPage) {
            startRequest(nextPage);
        } 

    }).on('error', function (err) {
        console.log(err);
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

            urls.each(function(i,item) {

                var newItem = {
                    title: $(item).attr('href'),
                }

                // var targetUrl = $(item).attr('href')
                if (newItem.title) {
                    if (newItem.title.indexOf('ftp')>-1) {
                        data.push(newItem)
                    }
                }

            })


        })
        // let dataStr = JSON.stringify(data);
        // console.log(dataStr);

        savedContent(data);
        // savedImg(data);

        // let nextPage = getNextPage(url)
        // if (nextPage) {
        //     startRequest(nextPage);
        // } 

    }).on('error', function (err) {
        console.log(err);
    });

}

var pageIdx = 1;
function getNextPage(x) {

    pageIdx++;

    var page = pageIdx;
    console.log('page::'+page)
    if (page > 4) {
        return null;
    }
    return url+"_"+page.toString()+".html";
    
}

var idx = 0;

//该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent(datas) {
    
    datas.forEach(element => {

        idx++;

        var itemStr =idx +"::"+ element.title + '\n';
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

        var writeStream = fs.createWriteStream('./image/'+ele.title+'.jpg');
        request(src).pipe(writeStream);
    })
}

fetchPage(url+'.html');      //主程序开始运行