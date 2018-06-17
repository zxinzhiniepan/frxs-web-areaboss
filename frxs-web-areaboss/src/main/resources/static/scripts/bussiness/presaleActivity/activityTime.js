/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */
var serviceDataTime = xsjs.dateFormat(new Date(),"yyyy-MM-dd HH:mm:ss");
//购买开始时间
function expiryDateStartInput() {
    WdatePicker({
        enableKeyboard:false,
        enableInputMask:false,
        dateFmt: 'yyyy-MM-dd HH:mm:ss',
        minDate: serviceDataTime,
        maxDate: '#F{$dp.$D(\\\'ExpiryDateEnd\\\')}'
    });
}

//购买结束时间
function expiryDateEndInput() {
    WdatePicker({
        enableKeyboard:false,
        enableInputMask:false,
        dateFmt: 'yyyy-MM-dd HH:mm:ss',
        minDate: $.trim($("#ExpiryDateStart").val()).length > 0 ? '#F{$dp.$D(\\\'ExpiryDateStart\\\')}' : serviceDataTime
    });
}

//显示开始时间
function showStartTimeInput() {
    WdatePicker({
        enableKeyboard:false,
        enableInputMask:false,
        dateFmt: 'yyyy-MM-dd HH:mm:ss',
        minDate: serviceDataTime,
        maxDate: '#F{$dp.$D(\\\'ShowEndTime\\\')}'
    });
}

//显示结束时间
function showEndTimeInput() {

    WdatePicker({
        enableKeyboard:false,
        enableInputMask:false,
        dateFmt: 'yyyy-MM-dd HH:mm:ss',
        minDate: $.trim($("#ShowStartTime").val()).length > 0 ? '#F{$dp.$D(\\\'ShowStartTime\\\')}' : serviceDataTime
    });
}
//提货时间设置
function deliveryTimeInput() {
    var defVal = "";
    var thisDateTime = new Date();
    if ($.trim($("#ExpiryDateEnd").val()).length > 0) {
        thisDateTime = new Date($("#ExpiryDateEnd").val());
    }
    else {
        thisDateTime = new Date(serviceDataTime);
    }

    var thisDate = xsjs.dateFormat(thisDateTime, "yyyy-MM-dd");
    if (new Date(thisDate + " 16:00") > thisDateTime) {
        defVal = thisDate + " 16:00";
    }
    else {
        defVal = xsjs.dateFormat(new Date(thisDate).getTime() + (1 * 24 * 3600 * 1000), "yyyy-MM-dd") + " 16:00";
    }

    WdatePicker({
        enableKeyboard:false,
        enableInputMask:false,
        errDealMode:2,
        dateFmt: 'yyyy-MM-dd HH:mm',
        minDate: defVal
    });
}