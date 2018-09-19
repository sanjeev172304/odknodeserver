const mysql = require('mysql');

const hostname = 'testodk.mysql.database.azure.com';
const username = 'testodk@testodk';
const password = 'Super@123';

const connections = {};

connections.vmdb = mysql.createPool({
  connectionLimit: 100,
  host: 'newodkubuntu.centralindia.cloudapp.azure.com',
  user: 'odkuser',
  password: 'Wildlife@123',
  database: 'odk_prod'
});

connections.rawdb = mysql.createPool({
  connectionLimit: 100,
  host: hostname,//'newodkubuntu.centralindia.cloudapp.azure.com',//hostname,
  user: username, //'odkuser',
  password: password, //'Wildlife@123',
  database: 'testimportdata' //'odk_prod'
});

connections.moddb = mysql.createPool({
  connectionLimit: 200,
  host: hostname,
  user: username,
  password: password,
  database: 'odk'
});

exports.conn = connections;