
const helper = require('./helper');
const qmodels = {};
const queryscript = {};

//RDB QUERY : USERS
queryscript.selectallWSusers = "SELECT * FROM wls_users";
queryscript.insertuser = "INSERT INTO wls_users set ? ";
queryscript.updateuser = "UPDATE wls_users SET ? WHERE User_name = ?";
queryscript.deleteuser = "DELETE FROM wls_users WHERE User_name = ?";
queryscript.checkuser = "SELECT * FROM wls_users WHERE User_name = ?";

//RDB QUERY : PUBLICITY
queryscript.getpublicitydata = "SELECT * FROM publicity";
queryscript.getPublicityImgData = "SELECT * FROM publicity_images";// WHERE PB_METAINSTANCE_ID = ?";

//RDB QUERY : DAILY COUNT
queryscript.selectallDAO = "SELECT * FROM daily_count";
queryscript.selectDCuser = "SELECT * FROM dc_cases WHERE DC_CASE_ID = ?";
queryscript.getallDC = "SELECT * FROM daily_count DC JOIN dc_cases FA ON DC.DC_CASE_ID=FA.DC_CASE_ID";
queryscript.insertintoDC_table = "INSERT IGNORE INTO daily_count set ? ";
queryscript.insertintoDC_FAusers = "INSERT IGNORE INTO dc_cases set ? ";

//RDB QUERY : COMPENSATION
queryscript.selectOM_data = "SELECT * FROM compensation_details";
queryscript.selectOM_casedata = "SELECT * FROM com_cases_details WHERE COM_WSID_FORM_DATE = ?";

//RDB QUERY : HWC
const line1 = "SELECT * FROM hwc_details HD LEFT JOIN hwc_case_crop HC ";
const line2 = "ON (HD.HWC_WSID = HC.HWC_WSID && HD.HWC_CASE_DATE=HC.HWC_CASE_DATE) ";
const line3 = "LEFT JOIN hwc_case_property HP ";
const line4 = "ON (HD.HWC_WSID = HP.HWC_WSID && HD.HWC_CASE_DATE=HP.HWC_CASE_DATE) ";
const line5 = "LEFT JOIN hwc_case_livestock HL ";
const line6 = "ON (HD.HWC_WSID = HL.HWC_WSID && HD.HWC_CASE_DATE=HL.HWC_CASE_DATE) ";
const line7 = "WHERE HWC_METAINSTANCE_ID = ?";

queryscript.select_hwc = "SELECT * FROM hwc_details";
queryscript.selectall_hwc = line1+line2+line3+line4+line5+line6;
queryscript.selecthwc_user_byid = line1+line2+line3+line4+line5+line6+line7;

queryscript.get_case_users = "SELECT * FROM wildseve_users";

//PROD RDB QUERY
queryscript.insertintowsDC_table = "INSERT IGNORE INTO odk.daily_count set ? ";

//FORM QUERY 
queryscript.selectallFormDC = "SELECT * FROM wsodk_dailycount_apr_18_results";

qmodels.get_dcofficers = function (data) {
    var MIN_ID = data['meta:instanceID'].split(":");

    var insertquery = {

        DC_METAINSTANCE_ID: MIN_ID[1],
        DC_FILLIN_DATE: data.today,
        DC_DEVICE_ID: data.deviceid,
        DC_SIMCARD_ID: data.simserial,
        DC_PHONE_NUMBER: data.phonenumber,
        DC_USER_NAME: data.username,
        DC_CASE_DATE: helper.methods.GetFormattedDate(data['details:dc_date']),
        DC_NH_CASES: data['details:nh_cases'],
        DC_BP_CASES: data['details:bp_cases'],
        DC_TOTAL_CASES: data['details:ws_cases'],
        DC_CASE_ID: MIN_ID[1] + "_" + data.username

    };

    console.log("inserting" + insertquery.DC_CASE_DATE);
    return insertquery;
}

qmodels.createuser = function (data) {
    var insertquery = {
        First_name: data.firstname,
        Last_name: data.lastname,
        user_name: data.username,
        user_pwd: data.password,
        Email_id: data.email,
        Phone_number: data.phone,
        User_Role_Id: data.roleid
    };

    console.log("inserting user");
    return insertquery;
}

exports.sqlquery = queryscript;
exports.datamodels = qmodels;
