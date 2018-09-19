const db_model = require('../utils/query_model');
const dbconn = require('../config/sshdbconn');
const util = require('../utils/helper');
const myfunctions = {};

myfunctions.get_all_hwc = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.selectall_hwc, function (error, results, fields) {
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

myfunctions.get_hwcall_byid = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.selecthwc_user_byid, [req.params.id], function (error, results, fields) {
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

myfunctions.get_hwc = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.select_hwc, function (error, results, fields) {
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