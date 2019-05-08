var async = require('async');
var crawler = require('./crawler');
var save = require('./save');
var url = 'http://mebook.cc/page/';

var dataList = [];
var pageIdx = 2;
async.series([
    function (done) {
        spider(pageIdx);
    },
    function (done) {
        save.dataSave(dataList, done);
    },
], function (err) {
    if (err) {
        console.log(err);
    }
    console.log('完成');
    process.exit(0);
})

function spider(pageIdx,callback) {
    console.log(pageIdx);
    var theUrl = url + pageIdx;
    crawler.dataCrawler(theUrl, function (err, list) {
        if (list.length) {
            save.dataSave(list);
        }
        if (pageIdx < 20) {
            pageIdx++
            setTimeout(() => {
                spider(pageIdx);
            }, 1500);
        } else {
            // callback(err);
        }
    });
}
