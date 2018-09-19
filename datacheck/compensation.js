var dbconn = require('../config/sshdbconn');
const helper = require('../utils/helper');

const fetchquery = "SELECT * FROM COMP_Y3_M8_CORE c1 JOIN COMP_Y3_M8_CORE2 c2 ON c1._URI = c2._PARENT_AURI JOIN COMP_Y3_M8_CORE3 c3 ON c1._URI = c3._PARENT_AURI";
const com_insertQuery = "INSERT IGNORE INTO compensation_details set ? ";
const om_cases_insertQuery = "INSERT IGNORE INTO com_cases_details set ? ";
const Taluk_Query = "SELECT * FROM wls_taluk";// WHERE OLD_T_NAME = ";
const comp = {};
var taluk_list = [];

comp.syncallcompensationdetails = function (req, res) {
    console.log("Syncing Compensation . . . .");
    dbconn.rdb.then(function (con_rdb) {
        con_rdb.query(fetchquery, function (error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            // res.send(JSON.stringify(results));
            // console.log(results);
            sortdata(JSON.parse(JSON.stringify(results)));
        });
    }).catch(err => {
        console.log(err);
    });
}

function getotherdata(data, pos) {

    const CR_QUERY = "SELECT VALUE AS 'CROP_NAME' FROM COMP_Y3_M8_COMPDETAILS_COMP_SET_" + pos + "_CROP_NAME_" + pos + " WHERE _PARENT_AURI=\'" + data.META_INSTANCE_ID + "\'";;
    const LS_QUERY = "SELECT VALUE AS 'LIVESTOCK_NAME' FROM COMP_Y3_M8_COMPDETAILS_COMP_SET_" + pos + "_LIVESTOCK_NAME_" + pos + " WHERE _PARENT_AURI=\'" + data.META_INSTANCE_ID + "\'";;
    const PR_QUERY = "SELECT VALUE AS 'PROPERTY_NAME' FROM COMP_Y3_M8_COMPDETAILS_COMP_SET_" + pos + "_PROPERTY_NAME_" + pos + " WHERE _PARENT_AURI=\'" + data.META_INSTANCE_ID + "\'";;

    dbconn.rdb.then(function (con_rdb) {
        con_rdb.query(CR_QUERY, function (error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            const CR = JSON.parse(JSON.stringify(results));
            data['CROP_NAME'] = (CR[0]) ? CR[0].CROP_NAME : null;
        });
    }).catch(err => {
        console.log(err);
    });
    dbconn.rdb.then(function (con_rdb) {
        con_rdb.query(LS_QUERY, function (error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            const LS = JSON.parse(JSON.stringify(results));
            data['LIVESTOCK_NAME'] = LS[0] ? LS[0].LIVESTOCK_NAME : null;
        });
    }).catch(err => {
        console.log(err);
    });
    dbconn.rdb.then(function (con_rdb) {
        con_rdb.query(PR_QUERY, function (error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            const PR = JSON.parse(JSON.stringify(results));
            data['PROPERTY_NAME'] = PR[0] ? PR[0].PROPERTY_NAME : null;
            // console.log(data);
            setOMcases(data, pos);
        });
    }).catch(err => {
        console.log(err);
    });
}

function sortdata(res) {
    Array.from(res).forEach(data => {
        dbconn.mdb.then(function (con_mdb) {
            con_mdb.query(com_insertQuery, setOM(data), function (error, om_result, fields) {
                if (error) {
                    console.log(error);
                    return;
                } else {
                    for (i = 1; i < 11; i++) {
                        if (data["COMPDETAILS_COMP_SET_" + i + "_CASE_WSIDINFO_" + i]) {
                            getotherdata(data, i)
                        }
                    }
                }
            });
        }).catch(err => {
            console.log(err);
        });
    });
}

function setOMcasedata(res_data) {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(om_cases_insertQuery, res_data, function (error, om_case_result, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                if (om_case_result.affectedRows > 0)
                    console.log("COMPENSATION record inserted :" + JSON.stringify(om_case_result.affectedRows));
            }
        });
    }).catch(err => {
        console.log(err);
    });

}

function sortOMRange(range) {
    // + "\'" + range + "\'"
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(Taluk_Query, function (error, taluk_result, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                console.log(taluk_result);
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

function setOM(data) {
    var MIN_ID = data.META_INSTANCE_ID.split(":");

    var insertOMdata = {

        COM_METAINSTANCE_ID: MIN_ID[1],
        COM_METAMODEL_VERSION: data._MODEL_VERSION,
        COM_METAUI_VERSION: data._UI_VERSION,
        COM_METASUBMISSION_DATE: helper.methods.GetFormattedDate(data._SUBMISSION_DATE),
        COM_FORMSTART_DATE: helper.methods.GetFormattedDate(data.TODAY),
        COM_FORMEND_DATE: helper.methods.GetFormattedDate(data.END),
        COM_FILLIN_DATE: helper.methods.GetFormattedDate(data.START),
        COM_DEVICE_ID: data.DEVICEID,
        COM_SIM_ID: data.SIMSERIAL,
        COM_FA_PHONE_NUM: data.PHONENUMBER,
        COM_USER_NAME: data.USERNAME,
        COM_OM_UID: data.OMDETAILS_OM_SHEETNO,
        COM_OM_RANGE: data.OMDETAILS_OM_RANGE.slice(0, -3).toLowerCase(),
        COM_OM_FORM_DATE: helper.methods.GetFormattedDate(data.OMDETAILS_OM_DATE),
        COM_OM_TOTAL_CASES: data.OMDETAILS_OM_TOTNO,
        COM_OM_WS_CASES: data.OMDETAILS_OM_WSNO,
        COM_WSID_FORM_DATE: MIN_ID[1] + ":" + helper.methods.GetFormattedDate(data.OMDETAILS_OM_DATE)
        // COM_DAY: helper.methods.GetDAY(data.OMDETAILS_OM_DATE),
        // COM_MONTH: helper.methods.GetMONTH(data.OMDETAILS_OM_DATE),
        // COM_YEAR: helper.methods.GetYEAR(data.OMDETAILS_OM_DATE)

    };
    // console.log(JSON.stringify(insertOMdata));
    return insertOMdata;
}

function setOMcases(dataset, pos) {

    var MIN_ID = dataset.META_INSTANCE_ID.split(":");
    const phone = ["COMPDETAILS_COMP_SET_" + pos + "_PHNUM_PULL_" + pos];
    const received_amount = ["COMPDETAILS_COMP_SET_" + pos + "_COMP_RECEIVED_" + pos];
    const hwc_cat = ["COMPDETAILS_COMP_SET_" + pos + "_HWC_CAT_" + pos];
    const taluk = ["COMPDETAILS_COMP_SET_" + pos + "_TALUK_PULL_" + pos];
    const park = ["COMPDETAILS_COMP_SET_" + pos + "_PARK_PULL_" + pos];
    const family_name = ["COMPDETAILS_COMP_SET_" + pos + "_FAMNAME_PULL_" + pos];
    const first_name = ["COMPDETAILS_COMP_SET_" + pos + "_FIRSTNAME_PULL_" + pos];
    const survey_no = ["COMPDETAILS_COMP_SET_" + pos + "_SURVEYNO_" + pos];
    const hwc_date = ["COMPDETAILS_COMP_SET_" + pos + "_HWCDATE_" + pos];
    const village = ["COMPDETAILS_COMP_SET_" + pos + "_VILLAGE_PULL_" + pos];
    const other_ls = ["COMPDETAILS_COMP_SET_" + pos + "_OTHERLIVESTOCK_" + pos];
    const other_cr = ["COMPDETAILS_COMP_SET_" + pos + "_OTHERCROP_" + pos];
    const other_pr = ["COMPDETAILS_COMP_SET_" + pos + "_OTHERPROPERTY_" + pos];
    const wsid = ["COMPDETAILS_COMP_SET_" + pos + "_CASE_WSIDINFO_" + pos];

    var insertModelSet = {
        COM_WSID_FORM_DATE: MIN_ID[1] + ":" + helper.methods.GetFormattedDate(dataset.OMDETAILS_OM_DATE),
        COM_WSID: dataset[wsid],
        COM_FIRST_NAME: dataset[first_name],
        COM_FAMILY_NAME: dataset[family_name],
        COM_TALUK: dataset[taluk],
        COM_VILLAGE: dataset[village],
        COM_PARK: dataset[park],
        COM_PHONE_NUMBER: dataset[phone],
        COM_SURVEY_NUMBER: dataset[survey_no],
        COM_HWC_DATE: helper.methods.GetFormattedDate(dataset[hwc_date]),
        COM_HWC_CATAGORY: dataset[hwc_cat],
        COM_CROP_NAME: dataset.CROP_NAME,
        COM_CROP_NAME_OPT: dataset[other_cr],
        COM_PROPERTY_NAME: dataset.PROPERTY_NAME,
        COM_PROPERTY_NAME_OPT: dataset[other_pr],
        COM_LIVESTOCK: dataset.LIVESTOCK_NAME,
        COM_LIVESTOCK_OPT: dataset[other_ls],
        COM_AMOUNT: dataset[received_amount],
        COM_FD_REF_NO: MIN_ID[1] + "_" + pos + "_" + dataset.OMDETAILS_OM_SHEETNO
    }
    // console.log(JSON.stringify(insertModelSet));
    setOMcasedata(insertModelSet);
}
exports.func = comp;