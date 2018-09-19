const mysqlssh = require('mysql-ssh');

var db = mysqlssh.connect(
    {
        host: 'newodkubuntu.centralindia.cloudapp.azure.com',
        user: 'odkuser',
        password: 'Wildlife@123'
        // privateKey: fs.readFileSync(process.env.HOME + '/.ssh/id_rsa')
    },
    {
        host: '127.0.0.1',
        user: 'odk_user',
        password: 'admin@123',
        database: 'odk_prod'
    }
)
    .then(
        client => {
            return function (req,res, next) {
                client.query('SELECT * FROM `DAILY_COUNT_Y3_M10_CORE`', function (err, results, fields) {
                    if (err) throw err
                    console.log(JSON.stringify(results));
                    mysqlssh.close()
                })
                res.send(results);
            }
        })
    .catch(err => {
        console.log(err)
    })

// var mysql = require('mysql2');
// var Client = require('ssh2').Client;
// var ssh = new Client();

// var db = ssh.on('ready', function () {
//     ssh.forwardOut(
//         // source address, this can usually be any valid address
//         '127.0.0.1',
//         // source port, this can be any valid port number
//         3306,
//         // destination address (localhost here refers to the SSH server)
//         '127.0.0.1',
//         // destination port
//         3306,
//         function (err, stream) {
//             if (err) throw err; // SSH error: can also send error in promise ex. reject(err)
//             // use `sql` connection as usual
//             var con = mysql.createConnection({
//                 host: '127.0.0.1',
//                 user: 'root',
//                 password: 'admin@123',
//                 database: 'odk_prod',
//                 stream: stream
//             });

//             // send connection back in variable depending on success or not
//             con.connect(function (err) {
//                 if (err) {
//                     // resolve(connection);
//                     console.log(err)
//                 } else {
//                     // reject(err);
//                 }
//             });
//         });
// }).connect({
//     host: 'newodkubuntu.centralindia.cloudapp.azure.com',
//     port: 22,
//     username: 'odkuser',
//     password: 'Wildlife@123'
// });

module.exports = db;