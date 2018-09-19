const dbconn = require('../config/sshdbconn');
const helper = require('../utils/helper');

const fetchQuery = "SELECT * FROM DAILY_COUNT_Y3_M10_CORE";
const insertQuery = "INSERT IGNORE INTO daily_count set ? ";
const insertFAQuery = "INSERT IGNORE INTO dc_cases set ? ";

const dc = {};

dc.syncformdailyusers = function (req, res, next) {
    console.log("Syncing Daily Count . . . .");
    dbconn.rdb.then(function (con_rdb) {
        con_rdb.query(fetchQuery, function (error, data, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                sortdata(JSON.parse(JSON.stringify(data)));
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

function sortdata(res) {
    Array.from(res).forEach(data => {
        dbconn.mdb.then(function (con_mdb) {
            con_mdb.query(insertQuery, setDAO(data), function (error, dao_result, fields) {
                if (error) {
                    console.log(error);
                    return;
                } else {
                    for (i = 1; i < 9; i++) {
                        insertFAdata(data, i);
                    }
                    if (dao_result.affectedRows > 0)
                        console.log("DAILY COUNT record inserted : " + JSON.stringify(dao_result.affectedRows));
                }
            });
        }).catch(err => {
            console.log(err);
        });
    });
}

function insertFAdata(res, pos) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(insertFAQuery, setFA(res, pos), function (err, fa_result, fields) {
            if (err) {
                console.log(error);
                return;
            } else {
                if (fa_result.affectedRows > 0)
                    console.log("FA record inserted : " + JSON.stringify(fa_result.affectedRows));
            }
        });
    });
}

function setDAO(data) {
    var MIN_ID = data._URI.split(":");

    var insertquery = {
        DC_METAINSTANCE_ID: MIN_ID[1],
        DC_FILLIN_DATE: data.TODAY,
        DC_DEVICE_ID: data.DEVICEID,
        DC_SIMCARD_ID: data.SIMSERIAL,
        DC_PHONE_NUMBER: data.PHONENUMBER,
        DC_USER_NAME: data.USERNAME,
        DC_CASE_DATE: data.DETAILS_DC_DATE,
        DC_NH_CASES: data.DETAILS_NH_CASES,
        DC_BP_CASES: data.DETAILS_BP_CASES,
        DC_TOTAL_CASES: data.DETAILS_NH_CASES + data.DETAILS_BP_CASES,
        DC_CASE_ID: MIN_ID[1] + "_" + data.USERNAME
        // DC_DAY: helper.methods.GetDAY(data.DETAILS_DC_DATE),
        // DC_MONTH: helper.methods.GetMONTH(data.DETAILS_DC_DATE),
        // DC_YEAR: helper.methods.GetYEAR(data.DETAILS_DC_DATE)
    };

    return insertquery;
}

function setFA(data, i) {

    const FA_USERS = [" ", "MCK", "RM", "RK", "SK", "MS", "NHN", "GPR", "CN"];
    var MIN_ID = data._URI.split(":");
    const FA_CR = ['FA_' + FA_USERS[i] + '_FA_HWC_' + i + '_FA_' + i + '_CR'];
    const FA_PD = ['FA_' + FA_USERS[i] + '_FA_HWC_' + i + '_FA_' + i + '_PD'];
    const FA_CRPD = ['FA_' + FA_USERS[i] + '_FA_HWC_' + i + '_FA_' + i + '_CRPD'];
    const FA_LP = ['FA_' + FA_USERS[i] + '_FA_HWC_' + i + '_FA_' + i + '_LP'];
    const FA_HI = ['FA_' + FA_USERS[i] + '_FA_HWC_' + i + '_FA_' + i + '_HI'];
    const FA_HD = ['FA_' + FA_USERS[i] + '_FA_HWC_' + i + '_FA_' + i + '_HD'];
    const FA_CT = ['FA_' + FA_USERS[i] + '_FA_' + i + '_CASETALLY'];

    var insertcasesquery = {
        DC_CROP: data[FA_CR],
        DC_CROP_PROPERTY: data[FA_PD],
        DC_PROPERTY: data[FA_CRPD],
        DC_LIVESTOCK: data[FA_LP],
        DC_HUMAN_INJURY: data[FA_HI],
        DC_HUMAN_DEATH: data[FA_HD],
        DC_TOTAL_ATTENDED_CASE: data[FA_CT],
        DC_CASE_ID: MIN_ID[1] + "_" + data.USERNAME,
        DC_FA_ID: MIN_ID[1] + "_" + FA_USERS[i],
        DC_FA_UN: FA_USERS[i],
        DC_CASE_DATE: data.DETAILS_DC_DATE
    }
    // console.log(JSON.stringify(insertcasesquery));
    return insertcasesquery;
}

exports.func = dc;