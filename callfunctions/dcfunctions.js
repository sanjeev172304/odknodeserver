const db_model = require('../utils/query_model');
const dbconn = require('../config/sshdbconn');
const util = require('../utils/helper');
const myfunctions = {};

myfunctions.getdailyDAO = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.selectallDAO, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send(util.methods.seterror(error));
                return;
            } else
                res.send(util.methods.setresponse(results));
        });
    }).catch(err => {
        console.log(err);
        res.send(util.methods.seterror(error));
        return;
    });
}

myfunctions.getFAusers = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.selectDCuser, [req.params.id], function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send(util.methods.seterror(error));
                return;
            } else
                res.send(util.methods.setresponse(results));
        });
    }).catch(err => {
        console.log(err);
        res.send(util.methods.seterror(error));
        return;
    });
}

myfunctions.getDailyCount = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.getallDC, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send(util.methods.seterror(error));
                return;
            } else
                res.send(util.methods.setresponse(results));
        });
    }).catch(err => {
        console.log(err);
        res.send(util.methods.seterror(error));
        return;
    });
}


exports.caller = myfunctions;