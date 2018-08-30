var fs = require('fs')
var async = require('async')

var tasks = ['file.txt', 'file2.txt', 'file3.txt']

async function excuteAsyncTask() {
    const valueA = await A();
    console.log(valueA)
    const valueB = await B();
    console.log(valueB)
    try {
        console.log('start sleep')
        await sleep(1000);
        console.log('end sleep')
    } catch (error) {
        console.log(error)
    }
    const valueC = await C();
    console.log(valueC)
}

excuteAsyncTask()

function A(err, data) {

    return new Promise(function (resolve, reject) {
        fs.readFile('file.txt', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString());
            }
        })
    })
}

function B(err, data) {
    
    return new Promise(function (resolve, reject) {
        fs.readFile('file2.txt', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString());
            }
        })
    })
}

function sleep(time) {
    return new Promise( function (resolve, reject) {
        setTimeout(() => {
            // resolve('OK');
            reject('reject err');
        }, time);
    })
}

function C(err, data) {
    
    return new Promise(function (resolve, reject) {
        fs.readFile('file3.txt', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString());
            }
        })
    })
}

// async.eachSeries(tasks,function(item,callback) {

//     console.log('item::'+item);
//     fs.readFile(item, function (err, data) {
//         if (err) {
//             console.log("err::"+err);
//         } else {
//             console.log('data::'+data)
//         }

//         callback();
//     });
//     console.log('next')

// },function(err) {
//     if (err) {
//         console.log("err::"+err);
//     }
// })
