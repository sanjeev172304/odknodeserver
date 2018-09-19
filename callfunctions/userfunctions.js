const db_model = require('../utils/query_model');
const dbconn = require('../config/sshdbconn');
const util = require('../utils/helper');
const jwt = require('jsonwebtoken')
const myfunctions = {};

myfunctions.getusers = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.selectallWSusers, function (error, results, fields) {
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

myfunctions.createUser = function (req, res, next) {

    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.insertuser, db_model.datamodels.createuser(req.body), function (error, results, fields) {
            if (error) {
                console.log(error);
                res.setHeader("Content-Type", "application/json");
                res.send(util.methods.seterror(error));
                return;
            } else {
                res.setHeader("Content-Type", "application/json");
                res.send(util.methods.setresponse(results));
            }
        });
    }).catch(err => {
        console.log(err);
        res.send(util.methods.seterror(error));
        return;
    });
}

myfunctions.updateUser = function (req, res, next) {

    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.updateuser, [db_model.datamodels.createuser(req.body), req.body.username], function (error, results, fields) {
            if (error) {
                console.log(error);
                res.setHeader("Content-Type", "application/json");
                res.send(util.methods.seterror(error));
                return;
            } else {
                res.setHeader("Content-Type", "application/json");
                res.send(util.methods.setresponse(results));
            }
        });
    }).catch(err => {
        console.log(err);
        res.send(util.methods.seterror(error));
        return;
    });

}

myfunctions.deleteUser = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.deleteuser, req.params.id, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.setHeader("Content-Type", "application/json");
                res.send(util.methods.seterror(error));
                return;
            } else {
                res.setHeader("Content-Type", "application/json");
                res.send(util.methods.setresponse(results));
            }
        });
    }).catch(err => {
        console.log(err);
        res.send(util.methods.seterror(error));
        return;
    });
}

myfunctions.authUser = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(db_model.sqlquery.checkuser, req.body.username, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.setHeader("Content-Type", "application/json");
                res.send(util.methods.seterror(error));
                return;
            } else {
                if (JSON.stringify(results).length > 2) {
                    if (req.body.password == results[0].User_pwd) {
                        var token = jwt.sign({ username: req.body.username }, "sysarks");
                        res.setHeader("Content-Type", "application/json");
                        res.send(util.methods.setAuthResponse(results, token));
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.send(util.methods.passwordError("Password doesnt match"));
                    }
                }
                else {
                    res.setHeader("Content-Type", "application/json");
                    res.send(util.methods.passwordError("User doesnt exist"));
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.send(util.methods.seterror(error));
        return;
    });
}

exports.caller = myfunctions;