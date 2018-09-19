const dbconn = require('../config/sshdbconn');
const procedure = require('../utils/report_queries');

const reports = {};
var result_data = [];

reports.getdailycount = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.bypark(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.byFA(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.byHWCType(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
                res.send(JSON.stringify(result_data));
                result_data.length = 0;
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

reports.getHWCbyrange = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.gethwcbyrange(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                // result_data.push(data);
                res.send(JSON.stringify(data));
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

reports.getdailycountbyday = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.bypark_day(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.byFA_day(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.byHWCType_day(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
                res.send(JSON.stringify(result_data));
                result_data.length = 0;
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

reports.getdailycountbyrange = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.bypark_range(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                // res.send(JSON.stringify(result_data));
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.byFA_range(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.byHWCType_range(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
                res.send(JSON.stringify(result_data));
                result_data.length = 0;
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

//HOME Chart API's

reports.getBpNhByRange = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.getBpNhByRange(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                res.send({ success: false, data: error });
            } else {
                res.send({ success: true, data: data });
            }
        });
    });
}
reports.getPreviousBpNhCount = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.getPreviousBpNhCount(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                res.send({ success: false, data: error });
            } else {
                res.send({ success: true, data: data });
            }
        });
    });
}
reports.getBpByCategory = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.getBpByCategory(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                res.send({ success: false, data: error });
            } else {
                res.send({ success: true, data: data });
            }
        });
    });
}
reports.getNhByCategory = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.getNhByCategory(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                res.send({ success: false, data: error });
            } else {
                res.send({ success: true, data: data });
            }
        });
    });
}
reports.getBpNhByCategory = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.getBpNhByCategory(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                res.send({ success: false, data: error });
            } else {
                res.send({ success: true, data: data });
            }
        });
    });
}
reports.getBpNhYearly = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.getBpNhYearly(), function (error, data, fields) {
            if (error) {
                res.send({ success: false, data: error });
            } else {
                res.send({ success: true, data: data });
            }
        });
    });
}

exports.report = reports;