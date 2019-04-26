var mysql = require('mysql');
var async = require('async');

var pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '3366',
    database : 'users'
});

exports.videoSave = function(list,callback){
    
    pool.getConnection(function(err,connection){
        if(err){
            return callback(err);
        }
      var findsql = 'select * from video where id=?';
      var updatesql = 'update video set title=?,url=?,name=?,duration=? where id=?';
        var insertsql = 'insert into video(id,title,url,name,duration) values(?,?,?,?,?)';
        async.eachSeries(list,function(item,next){
        connection.query(findsql,[item.id],function(err,result){
            if(err){
                return next(err);
            }
            if(result.length>=1){
                connection.query(updatesql,[item.title,item.url,item.name,item.duration,item.id],next);
            }else{
                connection.query(insertsql,[item.id,item.title,item.url,item.name,item.duration],next);
            }
        });         
        },callback);
        connection.release();
    });
};