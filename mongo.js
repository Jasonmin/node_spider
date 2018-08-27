var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/runoob";


// 删除数据
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
    
//     var dbase = db.db('spider');
//     var whereStr = {'name':'jyq'};
//     dbase.collection('spider').deleteOne(whereStr, function(err,res) {
//         if (err) throw err;

//         console.log('文档删除成功')
//         db.close();
//     })
// });

// 更新数据
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
    
//     var dbase = db.db('spider');
//     var whereStr = {'name':'zq'};
//     var updateStr = {name:'zq',address:'安徽省宿松县'};
//     dbase.collection('spider').update(whereStr,updateStr,function(err,res) {
//         if (err) throw err;

//         console.log("文档更新成功")
//         db.close();
//     })
//   });

// 查询指定条件数据
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
    
//     var dbase = db.db('spider');
//     var whereStr = {'name':'zq'};
//     dbase.collection('spider').find(whereStr).toArray(function(err,res) {
//         if (err) throw err;

//         console.log(res)
//         db.close();
//     })
//   });

// 查询数据
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    
    var dbase = db.db('spider');
    dbase.collection('spider').find({}).toArray(function(err,res) {
        if (err) throw err;

        console.log(res)
        db.close();
    })
  });
 
// 插入多条数据
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
    
//     var dbase = db.db('spider');
//     var myobj = [
//         {name:'zq',address:'湖北省武汉市'},
//         {name:'周云',address:'湖北省武汉市'},
//         {name:'玉平',address:'湖北省武汉市'}]
//     dbase.collection('spider'). insertMany(myobj,function(err,res) {
//         if (err) throw err;
//         console.log('多条文档插入成功')
//         db.close();
//     })
//   });

// 插入数据
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
    
//     var dbase = db.db('spider');
//     var myobj = {name:'jyq',address:'湖北省武汉市'}
//     dbase.collection('spider').insertOne(myobj,function(err,res) {
//         if (err) throw err;
//         console.log('文档插入成功')
//         db.close();
//     })
//   });


// 创建集合
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
  
//   var dbase = db.db('spider')
//   dbase.createCollection('site',function(err,res) {
//       if (err) throw err
//       console.log('创建集合')
      
//       db.close();
//   })
// });