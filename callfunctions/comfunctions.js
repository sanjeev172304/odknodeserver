const dbconn = require('../config/sshdbconn');
const db_model = require('../utils/query_model');
const util = require('../utils/helper');
const myfunctions = {};

myfunctions.getOMdetails = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.selectOM_data, function (error, results, fields) {
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

myfunctions.getOM_casedetails = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.selectOM_casedata, [req.params.id], function (error, results, fields) {
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