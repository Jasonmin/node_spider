var mysql = require('mysql');
var async = require('async');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '3366',
    database: 'users'
});

exports.dataSave = function (list, callback) {

    console.log("dataSave");

    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }
        var findsql = 'select * from ziran where title=?';
        var updatesql = 'update ziran set title=?,imgPath=?,linkUrl=? where title=?';
        var insertsql = 'insert into ziran(title,imgPath,linkUrl) values(?,?,?)';
        async.eachSeries(list, function (item, next) {
            connection.query(insertsql, [item.title, item.imgPath, item.linkUrl], next);
        }, callback);
        connection.release();
    });
};
