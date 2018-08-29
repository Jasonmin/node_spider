var fs = require('fs')
// var fs = Promise.promisefy
// var ps = require('promise')

let readAction = function(err,data) {

    // var fs

    return new Promise(function(resolve,reject) {
        fs.readFile('file.txt', function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data);
                console.log('data::'+data)
            }
        });
    }).then(()=> {
        fs.readFile('file2.txt', function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data);
                console.log('data::'+data)
            }
        });
    }).then(()=> {
        fs.readFile('file3.txt', function (err, data) {
            if (err) {
                // reject(err)
            } else {
                // resolve(data);
                console.log('data::'+data)
            }
        });
    }).then(()=> {
        console.log('then end')
    });
}

let demo = async function() {
    let res = readAction();
    // console.log(res);
}

demo()

// 异步读取文件
// fs.readFile('file.txt', function (err, data) {
//     if (err) return console.error(err);
//     console.log(data.toString());
// });
