const procedure = {};

procedure.bypark = function () {
    return "SELECT SUM(DC_NH_CASES) AS TOTAL_NH_CASES, SUM(DC_BP_CASES) AS TOTAL_BP_CASES FROM daily_count";
};

procedure.byFA = function () {
    const sum = "SUM(DC_CROP+DC_CROP_PROPERTY+DC_PROPERTY+DC_LIVESTOCK+DC_HUMAN_INJURY+DC_HUMAN_DEATH) AS TOTAL_CASES_BY_FA";
    return "SELECT DC_FA_UN AS FA_NAME, " + sum + " FROM dc_cases GROUP BY DC_FA_UN";
};

procedure.byHWCType = function () {
    return "SELECT SUM(DC_CROP) AS CROP_SUM, SUM(DC_CROP_PROPERTY) AS CROP_PROPERTY_SUM, SUM(DC_PROPERTY) AS PROPERTY_SUM, SUM(DC_LIVESTOCK) AS LIVESTOCK_SUM, SUM(DC_HUMAN_INJURY) AS HUMAN_INJURY_SUM, SUM(DC_HUMAN_DEATH) AS HUMAN_DEATH_SUM FROM dc_cases";
};

procedure.byHWCType_day = function () {
    return "SELECT DATE_FORMAT(DC_CASE_DATE, '%d-%m-%y') AS CASE_DATE, SUM(DC_CROP) AS CROP_SUM, SUM(DC_CROP_PROPERTY) AS CROP_PROPERTY_SUM, SUM(DC_PROPERTY) AS PROPERTY_SUM, SUM(DC_LIVESTOCK) AS LIVESTOCK_SUM, SUM(DC_HUMAN_INJURY) AS HUMAN_INJURY_SUM, SUM(DC_HUMAN_DEATH) AS HUMAN_DEATH_SUM FROM dc_cases GROUP BY DC_CASE_DATE ORDER BY DC_CASE_DATE DESC";
};

procedure.byFA_day = function () {
    return "SELECT DATE_FORMAT(DC_CASE_DATE, '%d-%m-%y') AS CASE_DATE, DC_FA_UN AS FA_NAME,  sum(DC_CROP + DC_CROP_PROPERTY + DC_PROPERTY + DC_LIVESTOCK + DC_HUMAN_DEATH + DC_HUMAN_INJURY) AS TOTAL_CASES_FA  FROM  dc_cases GROUP BY concat(DC_CASE_DATE,'_',DC_FA_UN) ORDER BY DC_CASE_DATE DESC";
};

procedure.bypark_day = function () {
    return "SELECT DATE_FORMAT(DC_CASE_DATE, '%d-%m-%y') AS CASE_DATE, SUM(DC_NH_CASES) AS TOTAL_NH_CASES, SUM(DC_BP_CASES) AS TOTAL_BP_CASES FROM daily_count GROUP BY DC_CASE_DATE ORDER BY DC_CASE_DATE DESC";
};

procedure.bypark_range = function (fromdate, todate) {
    return "SELECT DATE_FORMAT(DC_CASE_DATE, '%d-%m-%Y') AS CASE_DATE, SUM(DC_NH_CASES) AS TOTAL_NH_CASES, SUM(DC_BP_CASES) AS TOTAL_BP_CASES FROM daily_count WHERE (DATE_FORMAT(DC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) GROUP BY DC_CASE_DATE ORDER BY DC_CASE_DATE DESC";
};
procedure.byHWCType_range = function (fromdate, todate) {
    return "SELECT DATE_FORMAT(DC_CASE_DATE, '%d-%m-%Y') AS CASE_DATE, SUM(DC_CROP) AS CROP_SUM, SUM(DC_CROP_PROPERTY) AS CROP_PROPERTY_SUM, SUM(DC_PROPERTY) AS PROPERTY_SUM, SUM(DC_LIVESTOCK) AS LIVESTOCK_SUM, SUM(DC_HUMAN_INJURY) AS HUMAN_INJURY_SUM, SUM(DC_HUMAN_DEATH) AS HUMAN_DEATH_SUM FROM dc_cases WHERE (DATE_FORMAT(DC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) GROUP BY DC_CASE_DATE ORDER BY DC_CASE_DATE DESC";
};

procedure.byFA_range = function (fromdate, todate) {
    return "SELECT  DATE_FORMAT(DC_CASE_DATE, '%d-%m-%Y') AS CASE_DATE, DC_FA_UN AS FA_NAME,  sum(DC_CROP + DC_CROP_PROPERTY + DC_PROPERTY + DC_LIVESTOCK + DC_HUMAN_DEATH + DC_HUMAN_INJURY) AS TOTAL_CASES_FA  FROM  dc_cases WHERE (DATE_FORMAT(DC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) GROUP BY concat(DC_CASE_DATE,'_',DC_FA_UN) ORDER BY DC_CASE_DATE DESC";
};

procedure.gethwc_byNP = function () {
    return "SELECT HWC_PARK_NAME AS NATIONAL_PARK, Count(HWC_PARK_NAME) AS NO_OF_CASES FROM hwc_details group by HWC_PARK_NAME";
}

procedure.gethwc_byFA = function () {
    return "SELECT HWC_USER_NAME AS FIELD_ASSISTANT, Count(HWC_USER_NAME) AS NO_OF_CASES FROM hwc_details group by HWC_USER_NAME";
}

procedure.gethwc_byCAT = function () {
    return "SELECT HWC_CASE_CATEGORY AS CASE_CATEGORY, Count(HWC_CASE_CATEGORY) AS NO_OF_CASES FROM hwc_details group by HWC_CASE_CATEGORY";
}

procedure.gethwc_byNP_byday = function () {
    return "SELECT HWC_CASE_DATE AS CASE_DATE, HWC_PARK_NAME AS NATIONAL_PARK, Count(HWC_PARK_NAME) AS NO_OF_CASES FROM hwc_details group by HWC_PARK_NAME, HWC_CASE_DATE order by HWC_CASE_DATE";
}

procedure.gethwc_byFA_byday = function () {
    return "SELECT HWC_CASE_DATE AS CASE_DATE, HWC_USER_NAME AS FIELD_ASSISTANT, Count(HWC_USER_NAME) AS NO_OF_CASES FROM hwc_details group by HWC_USER_NAME, HWC_CASE_DATE order by HWC_CASE_DATE;";
}

procedure.gethwc_byCAT_byday = function () {
    return "SELECT HWC_CASE_DATE AS CASE_DATE,HWC_CASE_CATEGORY AS CASE_CATEGORY, Count(HWC_CASE_CATEGORY) AS NO_OF_CASES FROM hwc_details group by HWC_CASE_CATEGORY, HWC_CASE_DATE order by HWC_CASE_DATE;";
}

procedure.gethwc_byNP_range = function (fromdate, todate) {
    return "SELECT HWC_PARK_NAME AS NATIONAL_PARK, Count(HWC_PARK_NAME) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_PARK_NAME";
}

procedure.gethwc_byFA_range = function (fromdate, todate) {
    return "SELECT HWC_USER_NAME AS FIELD_ASSISTANT, Count(HWC_USER_NAME) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_USER_NAME";
}

procedure.gethwc_byCAT_range = function (fromdate, todate) {
    return "SELECT HWC_CASE_CATEGORY AS CASE_CATEGORY, Count(HWC_CASE_CATEGORY) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_CASE_CATEGORY";
}

procedure.gethwc_byNP_byday_byrange = function (fromdate, todate) {
    return "SELECT DATE_FORMAT(HWC_CASE_DATE, '%d-%m-%Y') AS CASE_DATE, HWC_PARK_NAME AS NATIONAL_PARK, Count(HWC_PARK_NAME) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_PARK_NAME, HWC_CASE_DATE order by HWC_CASE_DATE";
}

procedure.gethwc_byFA_byday_byrange = function (fromdate, todate) {
    return "SELECT DATE_FORMAT(HWC_CASE_DATE, '%d-%m-%Y') AS CASE_DATE, HWC_USER_NAME AS FIELD_ASSISTANT, Count(HWC_USER_NAME) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_USER_NAME, HWC_CASE_DATE order by HWC_CASE_DATE;";
}

procedure.gethwc_byCAT_byday_byrange = function (fromdate, todate) {
    return "SELECT DATE_FORMAT(HWC_CASE_DATE, '%d-%m-%Y') AS CASE_DATE,HWC_CASE_CATEGORY AS CASE_CATEGORY, Count(HWC_CASE_CATEGORY) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_CASE_CATEGORY, HWC_CASE_DATE order by HWC_CASE_DATE;";
}

procedure.gethwc_byNP_byrange = function (fromdate, todate) {
    return "SELECT HWC_PARK_NAME AS NATIONAL_PARK, Count(HWC_PARK_NAME) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_PARK_NAME";
}

procedure.gethwc_byVillage_byrange = function (fromdate, todate) {
    return "SELECT HWC_VILLAGE_NAME AS VILLAGE, Count(HWC_VILLAGE_NAME) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_VILLAGE_NAME";
}

procedure.gethwc_byTaluk_byrange = function (fromdate, todate) {
    return "SELECT HWC_TALUK_NAME AS TALUK, Count(HWC_TALUK_NAME) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_TALUK_NAME";
}

procedure.gethwc_byRange_byrange = function (fromdate, todate) {
    return "SELECT HWC_RANGE , Count(HWC_RANGE) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_RANGE";
}

procedure.gethwc_byFARange_byrange = function (fromdate, todate) {
    return "SELECT HWC_FD_SUB_RANGE AS FA_SUB_RANGE, Count(HWC_FD_SUB_RANGE) AS NO_OF_CASES FROM hwc_details WHERE (DATE_FORMAT(HWC_CASE_DATE, '%Y-%m-%d') BETWEEN '" + fromdate + "' AND '" + todate + "' ) group by HWC_FD_SUB_RANGE";
}

procedure.gethwc_bycat_all = function () {
    return "select HWC_CASE_CATEGORY AS HWC_CATEGORY, count(HWC_CASE_CATEGORY) AS FREQ from hwc_details group by HWC_CASE_CATEGORY";
}

procedure.gethwc_bycat_animal = function () {
    return "select HWC_ANIMAL AS HWC_ANIMAL, count(HWC_ANIMAL) AS FREQ from hwc_details group by HWC_ANIMAL";
}

procedure.gethwc_bycat_crop = function () {
    return "select HWC_CROP_NAME AS HWC_CROP, count(HWC_CROP_NAME) AS FREQ from hwc_case_crop group by HWC_CROP_NAME";
}

procedure.gethwc_bycat_property = function () {
    return "select HWC_PROPERY_NAME AS HWC_CROP, count(HWC_PROPERY_NAME) AS FREQ from hwc_case_property group by HWC_PROPERY_NAME";
}

procedure.gethwc_bycat_livestock = function () {
    return "select HWC_LIVE_STOCK_NAME AS HWC_CROP, count(HWC_LIVE_STOCK_NAME) AS FREQ from hwc_case_livestock group by HWC_LIVE_STOCK_NAME";
}

// HOME Chart API's

procedure.getBpNhByRange = function (fromdate, todate) {
    return "SELECT  DATE_FORMAT(DC_CASE_DATE, '%d-%m-%Y') AS CASE_DATE,  sum(DC_NH_CASES) AS NH_CASES, sum(DC_BP_CASES) as BP_CASE  FROM  daily_count WHERE (DATE_FORMAT(DC_CASE_DATE, '%Y-%m-%d') BETWEEN '"+fromdate+"' AND '"+todate+"' ) GROUP BY DC_CASE_DATE ORDER BY DC_CASE_DATE DESC";
}
procedure.getPreviousBpNhCount = function () {
    return "select DATE_FORMAT(DC_CASE_DATE, '%d-%m-%Y') AS CASE_DATE, sum(DC_NH_CASES) AS NH_CASES, sum(DC_BP_CASES) as BP_CASE from daily_count WHERE DC_CASE_DATE BETWEEN CURDATE() - INTERVAL 1 DAY AND CURDATE()"
}
procedure.getBpByCategory = function (fromdate, todate) {
    return "select DATE_FORMAT(d.DC_CASE_DATE, '%d-%m-%Y')  as CASE_DATE, h.HWC_CASE_CATEGORY as CATEGORY, d.DC_BP_CASES AS BP_CASES , sum(d.DC_BP_CASES) AS BP_CASES from daily_count d, hwc_details h where (h.HWC_CASE_DATE between '"+fromdate+"' AND '"+todate+"') and (d.DC_CASE_DATE between '"+fromdate+"' AND '"+todate+"') group by d.DC_CASE_DATE, h.HWC_CASE_DATE;"
}
procedure.getNhByCategory = function (fromdate, todate) {
    return "select DATE_FORMAT(d.DC_CASE_DATE, '%d-%m-%Y')  as CASE_DATE, h.HWC_CASE_CATEGORY as CATEGORY, d.DC_NH_CASES AS NH_CASES , sum(d.DC_NH_CASES) AS NH_CASES from daily_count d, hwc_details h where (h.HWC_CASE_DATE between '"+fromdate+"' AND '"+todate+"') and (d.DC_CASE_DATE between '"+fromdate+"' AND '"+todate+"') group by d.DC_CASE_DATE, h.HWC_CASE_DATE;"
}
procedure.getBpNhByCategory = function (fromdate, todate) {
    return "select DATE_FORMAT(d.DC_CASE_DATE, '%d-%m-%Y')  as CASE_DATE, h.HWC_CASE_CATEGORY as CATEGORY, sum(d.DC_NH_CASES+d.DC_BP_CASES) AS TOTAL_BP_NH_CASES from daily_count d, hwc_details h where (h.HWC_CASE_DATE between '"+fromdate+"' AND '"+todate+"') and (d.DC_CASE_DATE between '"+fromdate+"' AND '"+todate+"') group by d.DC_CASE_DATE, h.HWC_CASE_DATE;"
}
procedure.getBpNhYearly = function () {
    return "select year(DC_CASE_DATE) as YEAR, sum(DC_NH_CASES) AS NH_CASES, sum(DC_BP_CASES) as BP_CASE from daily_count WHERE (year(DC_CASE_DATE) between YEAR(CURDATE())-3 and YEAR(CURDATE())) group by year(DC_CASE_DATE);"
}

exports.func = procedure;
