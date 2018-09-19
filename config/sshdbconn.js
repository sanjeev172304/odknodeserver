var mysql = require('mysql2');
var Client = require('ssh2').Client;
var ssh = new Client();

const myHost = 'newodkubuntu.centralindia.cloudapp.azure.com';
const myUsername = 'odkuser';
const myPassword = 'Wildlife@123';

// const myHost = '35.200.143.161'; //'odk.wildseveodk.com'
// const myUsername = 'wildseveodk';
// const myPassword = 'admin@123';

var rdb = new Promise(function (resolve, reject) {
    ssh.on('ready', function () {
        ssh.forwardOut(
            // source address, this can usually be any valid address
            '127.0.0.1',
            // source port, this can be any valid port number
            12345,
            // destination address (localhost here refers to the SSH server)
            '127.0.0.1',
            // destination port
            3306,
            function (err, stream) {
                if (err) throw err; // SSH error: can also send error in promise ex. reject(err)
                // use `sql` connection as usual
                con_rdb = mysql.createConnection({
                    host: '127.0.0.1',
                    user: 'root',
                    password: 'admin@123',
                    database: 'odk_prod',
                    stream: stream
                });

                // send connection back in variable depending on success or not
                con_rdb.connect(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(con_rdb);
                    }
                });
            });
    }).connect({
        host: myHost,
        port: 22,
        readyTimeout: 99999,
        username: myUsername,
        password: myPassword
    });
});

var mdb = new Promise(function (resolve, reject) {
    ssh.on('ready', function () {
        ssh.forwardOut(
            // source address, this can usually be any valid address
            '127.0.0.1',
            // source port, this can be any valid port number
            12345,
            // destination address (localhost here refers to the SSH server)
            '127.0.0.1',
            // destination port
            3306,
            function (err, stream) {
                if (err) throw err; // SSH error: can also send error in promise ex. reject(err)
                // use `sql` connection as usual
                con_mdb = mysql.createConnection({
                    host: '127.0.0.1',
                    user: 'root',
                    password: 'admin@123',
                    database: 'odk',
                    stream: stream
                });

                // send connection back in variable depending on success or not
                con_mdb.connect(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(con_mdb);
                    }
                });
            });
    }).connect({
        // host: 'newodkubuntu.centralindia.cloudapp.azure.com',
        // port: 22,
        // readyTimeout: 99999,
        // username: 'odkuser',
        // password: 'Wildlife@123'
        host: myHost,
        port: 22,
        readyTimeout: 99999,
        username: myUsername,
        password: myPassword
    });
});

// rdb.close = function(conn){
//     if ('end' in ssh) {
//         ssh.end(function (err){});
//     } if('end' in con_rdb){
//         con_rdb.end();
//     }
// }

// mdb.close = function(conn){
//     if ('end' in ssh) {
//         ssh.end(function (err){});
//     } if('end' in con_mdb){
//         con_mdb.end();
//     }
// }



module.exports.mdb = mdb;
module.exports.rdb = rdb;