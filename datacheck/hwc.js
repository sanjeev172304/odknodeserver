var dbconn = require('../config/sshdbconn');
var async = require("async");
var util = require('../utils/helper');

const fetchquery = "SELECT * FROM HWC_Y3_M10_CORE C1 JOIN HWC_Y3_M10_CORE2 C2 ON C1._URI = C2._PARENT_AURI JOIN HWC_Y3_M10_CORE3 C3 ON C1._URI = C3._PARENT_AURI";
const hwc_insertQuery = "INSERT IGNORE INTO hwc_details set ? ";
const hwc_crop_insertQuery = "INSERT IGNORE INTO hwc_case_crop set ? ";
const hwc_property_insertQuery = "INSERT IGNORE INTO hwc_case_property set ? ";
const hwc_livestock_insertQuery = "INSERT IGNORE INTO hwc_case_livestock set ? ";
const Taluk_Query = "SELECT * FROM wls_taluk";// WHERE OLD_T_NAME = ";
const hwc_checkexistQuery = 'SELECT EXISTS(SELECT 1 FROM hwc_details WHERE HWC_WSID = ? || HWC_FIRST_NAME = ?) AS \'PRESENT\', HWC_METAINSTANCE_ID from hwc_details WHERE HWC_WSID= ? || HWC_FIRST_NAME = ?';
const hwc_insert_dupQuery = "INSERT IGNORE INTO dup_hwc set ? ";
const hwc = {};

hwc.syncallhwvdetails = function (req, res) {
    console.log("Syncing HWC . . . . ");
    dbconn.rdb.then(function (con_rdb) {
        con_rdb.query(fetchquery, function (error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            // res.send(JSON.stringify(results));
            // console.log(results);
            // inserthwcusercase(JSON.parse(JSON.stringify(results)));
            checkhwcusercase(JSON.parse(JSON.stringify(results)));
        });
    }).catch(err => {
        console.log(err);
    });
}

function checkhwcusercase(res) {
    Array.from(res).forEach(ucdata => {
        dbconn.mdb.then(function (con_mdb) {
            con_mdb.query(hwc_checkexistQuery, [ucdata.EXITINFO2_CONCAT_WSID.toUpperCase(), ucdata.EXITINFO2_CONCAT_FIRSTNAME, ucdata.EXITINFO2_CONCAT_WSID.toUpperCase(), ucdata.EXITINFO2_CONCAT_FIRSTNAME], function (error, ext_result, fields) {
                if (error) {
                    console.log(error);
                    return;
                } else {
                    var resp = JSON.parse(JSON.stringify(ext_result));
                    const exist = resp[0].PRESENT;
                    console.log(ucdata.EXITINFO2_CONCAT_WSID.toUpperCase());
                    if (exist == 0)
                        inserthwcusercase(ucdata);
                    else {
                        // console.log(resp[0].HWC_METAINSTANCE_ID + "::" + ucdata.META_INSTANCE_ID);
                        var MIN_ID = ucdata.META_INSTANCE_ID.split(":");
                        if (resp[0].HWC_METAINSTANCE_ID != MIN_ID[1])
                            insert_duplicates(resp[0].HWC_METAINSTANCE_ID, ucdata.META_INSTANCE_ID);
                    }

                }
            });
        }).catch(err => {
            console.log(err);
        });
    });
}

function insert_duplicates(org_id, dup_id) {

    const inserthwc_dupdataset = {
        HWC_ORG_METAID: org_id,
        HWC_DUP_METAID: dup_id
    }
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(hwc_insert_dupQuery, inserthwc_dupdataset, function (error, dup_result, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                if (dup_result.affectedRows > 0)
                    console.log("HWC Duplicate Record inserted - " + JSON.stringify(dup_result.affectedRows));
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

function inserthwcusercase(ucdata) {
    // Array.from(res).forEach(ucdata => {
    dbconn.mdb.then(function (con_mdb) {
        con_mdb.query(hwc_insertQuery, setHWCdata(ucdata), function (error, uc_result, fields) {
            if (error) {
                console.log(error);
                return;
            } else {
                insert_hwc_crop(ucdata);
                insert_hwc_property(ucdata);
                insert_hwc_livestock(ucdata);
                if (uc_result.affectedRows > 0)
                    console.log("HWC Record inserted :" + JSON.stringify(uc_result.affectedRows));
                // else
                //     console.log("HWC : No new records inserted.");
            }
        });
    }).catch(err => {
        console.log(err);
    });
    // });
}

function insert_hwc_crop(cropdata) {
    var insertcrop_data = [];
    for (i = 1; i < 5; i++) {
        insertcrop_data[i - 1] = setHWC_cropdata(cropdata, i);
    }
    async.each(insertcrop_data, function (inc_data, callback) {
        if (inc_data) {
            dbconn.mdb.then(function (con_mdb) {
                con_mdb.query(hwc_crop_insertQuery, inc_data, function (error, crop_result, fields) {
                    if (error) {
                        console.log(error);
                        return;
                    } else {
                        if (crop_result.affectedRows > 0)
                            console.log("CR inserted :" + JSON.stringify(crop_result.affectedRows));
                        // else
                        //     console.log("CR : No new records inserted.");
                    }
                });
            }).catch(err => {
                console.log(err);
            })
        }
    }, function (err, data) {
        if (err)
            console.log(err);
    })
}

function insert_hwc_property(pd_data) {
    var insertPD_data = [];
    for (i = 1; i < 5; i++) {
        insertPD_data[i - 1] = setHWC_propertydata(pd_data, i);
    }
    async.each(insertPD_data, function (inpd_data, callback) {
        if (inpd_data) {
            dbconn.mdb.then(function (con_mdb) {
                con_mdb.query(hwc_property_insertQuery, inpd_data, function (error, property_result, fields) {
                    if (error) {
                        console.log(error);
                        return;
                    } else {
                        if (property_result.affectesRows > 0)
                            console.log("PD inserted :" + JSON.stringify(property_result.affectedRows));
                        // else
                        //     console.log("PD : No new records inserted.");
                    }
                });
            }).catch(err => {
                console.log(err);
            })
        }
    }, function (err, data) {
        if (err)
            console.log(err);
    })
}

function insert_hwc_livestock(lp_data) {
    var insertLP_data = [];
    for (i = 1; i < 4; i++) {
        insertLP_data[i - 1] = setHWC_livestockdata(lp_data, i);
    }
    async.each(insertLP_data, function (inl_data, callback) {
        if (inl_data) {
            dbconn.mdb.then(function (con_mdb) {
                con_mdb.query(hwc_livestock_insertQuery, inl_data, function (error, livestock_result, fields) {
                    if (error) {
                        console.log(error);
                        return;
                    } else {
                        if (livestock_result.affectedRows > 0)
                            console.log("LS inserted:" + JSON.stringify(livestock_result.affectedRows));
                        // else
                        //     console.log("LS : No new records inserted.");
                    }
                });
            }).catch(err => {
                console.log(err);
            })
        }
    }, function (err, data) {
        if (err)
            console.log(err);
    })
}

function setHWC_cropdata(hwcformdata, pos) {

    var MIN_ID = hwcformdata.META_INSTANCE_ID.split(":");
    const inserthwc_cropdataset = {
        HWC_META_ID: MIN_ID[1] + "_" + pos,
        HWC_CASE_DATE: hwcformdata.HWCINFO_INCIDENTINFO_HWCDATE,
        HWC_WSID: hwcformdata.EXITINFO2_CONCAT_WSID,
        HWC_CROP_NAME: hwcformdata['HWCINFO_CR_GROUP_CR_GROUP' + pos + '_CROP_NAME' + pos],
        HWC_OTHER_CROP_NAME: hwcformdata['HWCINFO_CR_GROUP_CR_GROUP' + pos + '_OTHERCROP' + pos],
        HWC_AREA_GROWN: hwcformdata['HWCINFO_CR_GROUP_CR_GROUP' + pos + '_AREAGROWN_' + pos],
        HWC_AREA_DAMAGE: hwcformdata['HWCINFO_CR_GROUP_CR_GROUP' + pos + '_CROPAREADAMAGE' + pos],
        HWC_CROP_DAMAGE_AMOUNT: hwcformdata['HWCINFO_CR_GROUP_CR_GROUP' + pos + '_CROPESTAMT' + pos],
        HWC_CROP_GEO_SHAPE: hwcformdata['HWCINFO_CR_GROUP_CR_GROUP' + pos + '_CROPGEOSHAPE' + pos],
    }
    if (inserthwc_cropdataset.HWC_CROP_NAME)
        return inserthwc_cropdataset;
    else return null;
}

function setHWC_propertydata(hwcformdata, pos) {

    var MIN_ID = hwcformdata.META_INSTANCE_ID.split(":");
    const inserthwc_property_dataset = {
        HWC_META_ID: MIN_ID[1] + "_" + pos,
        HWC_CASE_DATE: hwcformdata.HWCINFO_INCIDENTINFO_HWCDATE,
        HWC_WSID: hwcformdata.EXITINFO2_CONCAT_WSID,
        HWC_PROPERY_NAME: hwcformdata['HWCINFO_PD_GROUP_PD_GROUP' + pos + '_PROPERTY_NAME' + pos],
        HWC_OTHER_PROPERTY_NAME: hwcformdata['HWCINFO_PD_GROUP_PD_GROUP' + pos + '_OTHERPROPERTY' + pos],
        HWC_PROPERTY_DAMAGE: hwcformdata['HWCINFO_PD_GROUP_PD_GROUP' + pos + '_PROPERTYDAMAGEEXTENT' + pos]
    }
    if (inserthwc_property_dataset.HWC_PROPERY_NAME)
        return inserthwc_property_dataset;
    else return null;
}

function setHWC_livestockdata(hwcformdata, pos) {

    var MIN_ID = hwcformdata.META_INSTANCE_ID.split(":");
    const inserthwc_livestock_dataset = {
        HWC_META_ID: MIN_ID[1] + "_" + pos,
        HWC_CASE_DATE: hwcformdata.HWCINFO_INCIDENTINFO_HWCDATE,
        HWC_WSID: hwcformdata.EXITINFO2_CONCAT_WSID,
        HWC_LIVE_STOCK_NAME: hwcformdata['HWCINFO_LP_GROUP_LP_GROUP' + pos + '_LIVESTOCK_NAME' + pos],
        HWC_OTHER_LIVE_STOCK_NAME: hwcformdata['HWCINFO_LP_GROUP_LP_GROUP' + pos + '_OTHERLIVESTOCK' + pos],
        HWC_LIVE_STOCK_PREDATED_NUMBER: hwcformdata['HWCINFO_LP_GROUP_LP_GROUP' + pos + '_LIVESTOCKPREDATEDNUMBER' + pos]
    }
    if (inserthwc_livestock_dataset.HWC_LIVE_STOCK_NAME)
        return inserthwc_livestock_dataset;
    else return null;
}

function setHWCdata(hwcformdata) {

    var MIN_ID = hwcformdata.META_INSTANCE_ID.split(":");

    if (hwcformdata.HWCINFO_INCIDENTINFO_ANI_NAME.toLowerCase() == 'otheranimal')
        hwcformdata.HWCINFO_INCIDENTINFO_ANI_NAME = (!hwcformdata.HWCINFO_INCIDENTINFO_OTHERANIMAL) ? null : hwcformdata.HWCINFO_INCIDENTINFO_OTHERANIMAL.toLowerCase();


    const inserthwcdataset = {
        HWC_METAINSTANCE_ID: MIN_ID[1],
        HWC_METAMODEL_VERSION: hwcformdata._MODEL_VERSION,
        HWC_METAUI_VERSION: hwcformdata._UI_VERSION,
        HWC_METASUBMISSION_DATE: util.methods.GetFormattedDate(hwcformdata._SUBMISSION_DATE),
        HWC_WSID: hwcformdata.EXITINFO2_CONCAT_WSID.toUpperCase(),
        HWC_FIRST_NAME: hwcformdata.EXITINFO2_CONCAT_FIRSTNAME,
        HWC_FULL_NAME: hwcformdata.EXITINFO2_CONCAT_FULLNAME,
        HWC_PARK_NAME: format_park(hwcformdata.EXITINFO2_CONCAT_PARK),
        HWC_TALUK_NAME: format_taluk(hwcformdata.EXITINFO2_CONCAT_TALUK),
        HWC_VILLAGE_NAME: (!hwcformdata.EXITINFO2_CONCAT_VILLAGE) ? null : hwcformdata.EXITINFO2_CONCAT_VILLAGE.toLowerCase(),
        HWC_OLDPHONE_NUMBER: hwcformdata.EXITINFO2_CONCAT_OLDPHNUM,
        HWC_NEWPHONE_NUMBER: hwcformdata.EXITINFO2_CONCAT_NEWPHNUM,
        HWC_SURVEY_NUMBER: hwcformdata.EXITINFO2_CONCAT_SURVEYNUM.replace("-", "/"),
        HWC_RANGE: format_range(hwcformdata.HWCINFO_RANGE),
        HWC_LATITUDE: hwcformdata.HWCINFO_SPATIALINFO_GPS_POINT_LAT,
        HWC_LONGITUDE: hwcformdata.HWCINFO_SPATIALINFO_GPS_POINT_LNG,
        HWC_ALTITUDE: hwcformdata.HWCINFO_SPATIALINFO_GPS_POINT_ALT,
        HWC_ACCURACY: hwcformdata.HWCINFO_SPATIALINFO_GPS_POINT_ACC,
        HWC_CASE_DATE: util.methods.GetFormattedDate(hwcformdata.HWCINFO_INCIDENTINFO_HWCDATE),
        HWC_CASE_CATEGORY: hwcformdata.HWCINFO_INCIDENTINFO_HWC_CAT.toUpperCase(),
        HWC_ANIMAL: (!hwcformdata.HWCINFO_INCIDENTINFO_ANI_NAME) ? null : hwcformdata.HWCINFO_INCIDENTINFO_ANI_NAME.toLowerCase(),
        // HWC_OTHER_ANIMAL: (!hwcformdata.HWCINFO_INCIDENTINFO_OTHERANIMAL) ? null : hwcformdata.HWCINFO_INCIDENTINFO_OTHERANIMAL.toLowerCase(),
        HWC_HI_NAME: (!hwcformdata.HWCINFO_HIINFO_HINAME) ? null : hwcformdata.HWCINFO_HIINFO_HINAME.toLowerCase(),
        HWC_HI_VILLAGE: (!hwcformdata.HWCINFO_HIINFO_HIVILLAGE) ? null : hwcformdata.HWCINFO_HIINFO_HIVILLAGE.toLowerCase(),
        HWC_HI_AREA: hwcformdata.HWCINFO_HIINFO_HIAREA,
        HWC_HI_DETAILS: hwcformdata.HWCINFO_HIINFO_HIDETAILS,
        HWC_HD_NAME: (!hwcformdata.HWCINFO_HDINFO_HDNAME) ? null : hwcformdata.HWCINFO_HDINFO_HDNAME.toLowerCase(),
        HWC_HD_VILLAGE: (!hwcformdata.HWCINFO_HDINFO_HDVILLAGE) ? null : hwcformdata.HWCINFO_HDINFO_HDVILLAGE.toLowerCase(),
        HWC_HD_DETAILS: hwcformdata.HWCINFO_HDINFO_HDDETAILS,
        HWC_COMMENT: (!hwcformdata.EXITINFO1_ADDCOMMENTS) ? null : hwcformdata.EXITINFO1_ADDCOMMENTS.toLowerCase(),
        HWC_FD_SUB_DATE: hwcformdata.FDSUBMISSION_DATE_FDSUB,
        HWC_FD_SUB_RANGE: format_range(hwcformdata.FDSUBMISSION_RANGE_FDSUB),
        HWC_FD_NUM_FORMS: hwcformdata.FDSUBMISSION_NUMFORMS_FDSUB,
        HWC_FD_COMMENT: (!hwcformdata.EXITINFO2_ADDCOMMENTS2) ? null : hwcformdata.EXITINFO2_ADDCOMMENTS2.toLowerCase(),
        HWC_START: hwcformdata.START,
        HWC_END: hwcformdata.END,
        HWC_DEVICE_ID: hwcformdata.DEVICEID,
        HWC_SIMCARD_ID: hwcformdata.SIMSERIAL,
        HWC_FA_PHONE_NUMBER: hwcformdata.PHONENUMBER,
        HWC_USER_NAME: (!hwcformdata.USERNAME) ? null : hwcformdata.USERNAME.toLowerCase(),
        HWC_CASE_TYPE: (!hwcformdata.WILDSEVEIDDETAILS_CASE_WSIDINFO) ? null : hwcformdata.WILDSEVEIDDETAILS_CASE_WSIDINFO.toLowerCase()
    }

    return inserthwcdataset;
}

function format_park(park_name) {
    const park_list =
    {
        "bandipurprk": "Bandipur",
        "nagaraholeprk": "Nagarahole"
    }

    return park_name.allReplace(park_list).toLowerCase();
}

String.prototype.allReplace = function (obj) {
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    return retStr;
};

function format_taluk(taluk_name) {
    const taluk_list =
    {
        "gundlupettlk": "gundlupet",
        "hdkotetlk": "hdkote",
        "HD_Kote": "hdkote",
        "hd_kote": "hdkote",
        "hunsurtlk": "hunsur",
        "nanjangudtlk": "nanjangud",
        "piriyapatnatlk": "piriyapatna",
        "chamrajnagartlk": "chamrajnagar"
    }

    return taluk_name.allReplace(taluk_list).toLowerCase();
}

function format_range(range_name) {
    const range_list =
    {
        "antersantherng": "Antersanthe",
        "db_kupperng": "DBKuppe",
        "dbkupperng": "DBKuppe",
        "gsbettarng": "GSBetta",
        "gundlupetrng": "Gundlupet",
        "hdkoterng": "HDKote",
        "hediyalarng": "Hediyala",
        "hunsurrng": "Hunsur",
        "kachuvinahallyrng": "Kachuvinahally",
        "kundkererng": "Kundkere",
        "maddururng": "Madduru",
        "metikupperng": "Metikuppe",
        "moleyururng": "Moleyuru",
        "nbegururng": "NBeguru",
        "nugurng": "Nugu",
        "omkarrng": "Omkar",
        "piriyapattanarng": "Piriyapattana",
        "sargururng": "Sarguru",
        "veeranahosahallirng": "Veeranahosahalli"
    }

    return range_name.allReplace(range_list).toLowerCase();

}

exports.func = hwc;