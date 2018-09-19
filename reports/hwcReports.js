const dbconn = require('../config/sshdbconn');
const procedure = require('../utils/report_queries');

const reports = {};
var result_data = [];

reports.getHWC_caseattended = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.gethwc_byNP(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byFA(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byCAT(), function (error, data, fields) {
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

reports.getHWC_eachday = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.gethwc_byNP_byday(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byFA_byday(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byCAT_byday(), function (error, data, fields) {
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

reports.getHWC_caseattended_byrange = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.gethwc_byNP_range(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byFA_range(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byCAT_range(req.body.fromdate, req.body.todate), function (error, data, fields) {
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

reports.getHWC_eachday_byrange = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.gethwc_byNP_byday_byrange(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byFA_byday_byrange(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byCAT_byday_byrange(req.body.fromdate, req.body.todate), function (error, data, fields) {
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

reports.getHWC_bySpacial_byrange = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.gethwc_byNP_byrange(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byVillage_byrange(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byTaluk_byrange(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byRange_byrange(req.body.fromdate, req.body.todate), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                result_data.push(data);
            }
        });
        con_mdb.query(procedure.func.gethwc_byFARange_byrange(req.body.fromdate, req.body.todate), function (error, data, fields) {
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

reports.getHWC_byCat = function (req, res, next) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(procedure.func.gethwc_bycat_all(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                Array.from(data).forEach(resobj => {
                    result_data.push(resobj);
                });
            }
        });
        con_mdb.query(procedure.func.gethwc_bycat_animal(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                Array.from(data).forEach(resobj => {
                    result_data.push(resobj);
                });
            }
        });
        con_mdb.query(procedure.func.gethwc_bycat_crop(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                Array.from(data).forEach(resobj => {
                    result_data.push(resobj);
                });
            }
        });
        con_mdb.query(procedure.func.gethwc_bycat_property(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                Array.from(data).forEach(resobj => {
                    result_data.push(resobj);
                });
            }
        });
        con_mdb.query(procedure.func.gethwc_bycat_livestock(), function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                Array.from(data).forEach(resobj => {
                    result_data.push(resobj);
                });
                res.send(JSON.stringify(result_data));
                result_data.length = 0;
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.report = reports;
