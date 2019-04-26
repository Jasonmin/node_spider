var async = require('async');
var video = require('./video');
var save = require('./save');
var url = 'http://www.imooc.com/learn/857';
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
            save.videoSave(videolist,done);
        },

    ],function(err){
    if(err){
        console.log(err);
    }
    console.log('完成');
    process.exit(0);
})