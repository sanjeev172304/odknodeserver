const dbconn = require('../config/sshdbconn');
const pquery = require('../utils/query_model');
const util = require('../utils/helper');

var demo = {};
demo.getpubdata = function (req, res) {
    // async connection to database
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(pquery.sqlquery.getpublicitydata, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send(util.methods.seterror(error));
                return;
            } else
                res.send(util.methods.setImgData(results));
        });
    }).catch(err => {
        console.log(err);
        res.send(util.methods.seterror(error));
        return;
    });
};

demo.getpubImg = function (req, res) {
    // async connection to database
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(pquery.sqlquery.getPublicityImgData, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send(util.methods.seterror(error));
                return;
            } else {
                res.send(util.methods.setresponse(results));
            }
        });
    }).catch(err => {
        console.log(err);
        res.send(util.methods.seterror(error));
        return;
    });
};

exports.caller = demo;