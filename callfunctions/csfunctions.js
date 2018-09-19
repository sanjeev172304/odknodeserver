const db_model = require('../utils/query_model');
const dbconn = require('../config/sshdbconn');
const util = require('../utils/helper');
const myfunctions = {};

myfunctions.get_case_users = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.get_case_users, function (error, results, fields) {
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