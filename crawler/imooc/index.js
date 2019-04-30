var async = require('async');
var video = require('./video');
var save = require('./save');
// var url = 'http://www.imooc.com/learn/857';
var url = 'http://mebook.cc/category/cxxs';
// var url = "http://124.204.65.86:14423/static/app/ipas/ipaList.html";

var videolist;

// 教程地址：https://www.cnblogs.com/xiaxuexiaoab/p/7124956.html

async.series([
        //获取视频信息
        function(done){
            video.videocrawler(url,function(err,list){
                videolist = list;
                done(err);
            });
        },
        //保存视频信息
        function(done){
            save.bookSave(videolist,done);
        },

    ],function(err){
    if(err){
        console.log(err);
    }
    console.log('完成');
    process.exit(0);
})