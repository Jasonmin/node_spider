var mysql = require('mysql');
var async = require('async');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '3366',
    database: 'users'
});

exports.dataSave = function (list, callback) {

    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }
        var findsql = 'select * from mm_book where title=?';
        var updatesql = 'update mm_book set title=?,imgPath=?,linkUrl=? where title=?';
        var insertsql = 'insert into mm_book(title,imgPath,linkUrl) values(?,?,?)';
        async.eachSeries(list, function (item, next) {
            // connection.query(findsql, [item.title], function (err, result) {
            //     if (err) {
            //         return next(err);
            //     }
            // });
            // console.log(item.title);
            connection.query(insertsql, [item.title, item.imgPath, item.linkUrl], next);
            // console.log('插入数据');
        }, callback);
        connection.release();
    });
};
