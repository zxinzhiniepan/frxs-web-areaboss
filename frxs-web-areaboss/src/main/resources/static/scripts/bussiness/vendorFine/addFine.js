// 审核
function auditVendorFine() {
    // debugger;
    //
    var auditRes = 4;
    if ($("#radioAuditY").is(':checked')) {
        auditRes = $("#radioAuditY").val();
    }
    else if ($("#radioAuditN").is(':checked')) {
        auditRes = $("#radioAuditN").val();
    }
    var auditDes = $.trim($("#txtFineAuditDesc").val());

    if (auditDes.length > 500) {
        window.top.$.messager.alert("提示", "您的驳回原因太长了.....！", "warning", "function(){$('#txtFineAuditDesc').focus()}");
        return false;
    }
    var id = $("#hidVendorFineID").val();
    var req = {
        FineIDList: id,
        StatusCode: auditRes,
        Remark: auditDes
    }
    //pageList.grid.getSelected().serialize() + "&StatusCode=" + auditRes + "&Remark=" + auditDes;
    xsjs.ajax({
        url: "/VendorFine/AuditSaveVendorFine",
        data: req,
        type: "POST",
        loadMsg: "正在保存数据，请稍候...",
        success: function (data) {
            //
            if (data.Flag == "SUCCESS" || data.Flag == "0") {
                window.top.$.messager.alert("温馨提示", data.Info, "info");
                if (window.frameElement.wapi && window.frameElement.wapi.pageList) {
                    window.frameElement.wapi.pageList.loadList();
                }
                else {

                }
                xsjs.pageClose();
            }
        },
        error: function () {
        }
    });
}

$(function () {

    var fineTypeCode = $("#hidFineTypeCode").val();
    $("#ddlFineTypeCode").val(fineTypeCode);
    // debugger;
    if (actionType == 0 || actionType == 1) {
        $("#btnSave").click(function () {
            saveVendorFine();
        });
    }
    else if (actionType == 3) {
        $("#btnAudit").click(function () {
            auditVendorFine();
        });
    }

    $("#txtFineStatusDate").val(xsjs.dateFormat($("#txtFineStatusDate").val(), "yyyy-MM-dd"));

    if ($("#hidVendorFineID").val() <= 0) {
        $("#txtFineStatusDate").val(XSLibray.nowDateTime("yyyy-MM-dd"));
    }

    $("#txtBankAccountNO").val(XSLibray.BankCardShow($("#txtBankAccountNO").val()));
    var vendorFineID = $("#hidVendorFineID").val();//罚款单号
    if (vendorFineID > 0) {
        $("#divTrackList").datagrid({
            url: contextPath + "/vendorFine/getVendorFineTrackFineId?vendorPenaltyNo=" + vendorFineID,
            rownumbers: "true",
            columns: [[
                {
                    field: 'tmCreate', title: '时间', width: 200, align: "center", formatter: function (val) {
                        return xsjs.dateFormat(val, "yyyy-MM-dd HH:mm:ss");
                    }
                },
                {field: 'createUserName', title: '操作员', width: 100, align: 'center'},
                {field: 'trackStatusName', title: '状态', width: 300, align: 'center'}]]
        });
    }
    // 选择供应商
    $("#btnSelectVendor").click(function () {
        // debugger;
        var _dialog = xsjs.window({
            owdoc: window.top,
            url: contextPath + "/products/selectVendor",
            width: 839,
            title: "选择供应商",
            dialog: true,
            modal: true,
            apidata: {
                vendorId: $("#hidVendorID").val(),
                callback: function (rows) {
                    console.log(rows)
                    $("#hidVendorID").val(rows.vendorId);
                    $("#txtVendorName").val(rows.vendorName);
                    $("#txtVendordcode").val(rows.vendorCode);

                    //$("#txtBankAccountName").val(rows.BankAccountName);
                    //$("#txtBankNO").val(rows.BankNO);
                    //$("#txtBankName").val(rows.BankName);
                    ////$("#txtBankAccountNO").val(rows.BankAccountNO);
                    //$("#txtBankAccountNO").val(XSLibray.BankCardShow(rows.BankAccountNO));
                    getVendorBankAccount();
                    // debugger;
                    if (fushVendorAmount()) {
                        $("#hidVendorID").val("");
                        $("#txtVendorName").val("");
                        $("#txtVendordcode").val("");
                        $("#txtBankAccountName").val("");
                        $("#txtBankNO").val("");
                        $("#txtBankName").val("");
                        $("#txtBankAccountNO").val("");
                    }

                }
            }
        });
    });


    // 选择商品
    $("#btnSelectProduct").click(function () {

        var id = $("#hidVendorID").val();
        if ($("#hidVendorID").val() == "" || $("#hidVendorID").val() <= 0) {
            window.top.$.messager.alert("选择供应商", "请先选择供应商！", "warning", "");
            return;
        } else {
            var _dialog = xsjs.window({
                owdoc: window.top,
                url: contextPath + "/vendorFine/queryVendorPreproduct?vendorId=" + $("#hidVendorID").val(),
                width: 700,
                title: "选择商品",
                dialog: true,
                modal: true,
                apidata: {
                    callback: function (rows) {
                        console.log(JSON.stringify(rows));
                        $("#hidPID").val(rows.productId);
                        $("#txtProductName").val(rows.productName);
                        $("#s").val(rows.sku);
                        $("#hidProductVendorID").val(rows.vendorId);
                        $("#hidActivityTime").val(rows.tmBuyStart);
                        $("#txtFineAmount").focus();
                        $("#hidPresaleActivityID").val(rows.activityId);
                        $("#hidPrimaryUrl").val(rows.primaryUrl);
                    }
                }
            });


        }
    });
    // debugger;
    if (actionType == 0) {
        //添加或编辑时，需要刷新账户金额显示
        fushVendorAmount();
    }

    if ((actionType == 1)) {
        // 编辑时隐藏供应商和商品选择按钮
        $("#btnSelectProduct").hide();
        $("#btnSelectVendor").hide();
    }

    //初始化加载结束
});

///获取收款人账户信息
function getVendorBankAccount() {
    var svendorID = $("#hidVendorID").val();
    if (svendorID == "" || svendorID <= 0) {
        return false;
    }
    xsjs.ajax({
        url: contextPath + "/vendorFine/getVendorBankAccount",
        data:"",
        type: "POST",
        //loadMsg: "正在查询供应商账户信息请稍候...",
        success: function (data) {
            if (data.rspCode == "success" || data.rspCode == 0) {

                var rdata = data.record;
                if (data.record == null || data.record == undefined) {
                    window.top.$.messager.alert("提示", "获取收款人账户信息失败！", "warning", "");
                    return;
                }
                $("#txtBankAccountName").val(rdata.bankAccountName);
                $("#txtBankNO").val(rdata.bankNo);
                $("#hidUnionPayCID").val(rdata.unionPayCID);
                $("#hidUnionPayMID").val(rdata.unionPayMID);
                $("#txtBankName").val(rdata.bankName);
                $("#txtBankAccountNO").val(XSLibray.BankCardShow(rdata.bankAccountNo));
                return true;
            }
            else {
                window.top.$.messager.alert("温馨提示", data.rspDesc, "warning", "");
            }
        },
        error: function (data) {
        }
    });
}

//查询供应商账户金额
function fushVendorAmount() {
    // debugger;
    var svendorID = $("#hidVendorID").val();
    var opAreaID = $("#hidOpAreaID").val();
    if (svendorID == "" || svendorID <= 0) {
        return false;
    }
    xsjs.ajax({
        url: contextPath + "/vendorFine/getVendorBalanceAmount",
        data: {vendorId: svendorID},
        type: "POST",
        //loadMsg: "正在查询供应商账户信息请稍候...",
        success: function (data) {
            if (data.rspCode == "success" || data.rspCode == 0) {
                // debugger;
                var rdata = data.record;
                if (data.record == null || data.record == undefined) {
                    window.top.$.messager.alert("提示", "查询供应商账户信息失败！", "warning", "");
                    return;
                }
                // 划付中金额，复核通过之后增加，回盘成功之后减少UnionPayInTransitAmount
                // 审核中的金额AuditingAmount
                // 可用金额CanAmount
                $('#txtSumAmount').numberbox('setValue', rdata.totalAmt.amount);
                $('#txtAuditingAmount').numberbox('setValue', rdata.auditingAmt.amount);
                $('#txtRemainingSum').numberbox('setValue', rdata.canWithdrawAmt.amount);
                return true;
            }
            else {
                window.top.$.messager.alert("提示", data.rspDesc, "warning", "");
            }
        },
        error: function (data) {
        }
    });
    return false;
}

//保存
function saveVendorFine() {
    // debugger;
    //easyUI表单校验
    var isValidate = $("#tabVendorFine").form("validate");
    if (!isValidate) {
        window.top.$.messager.alert("提示", "页面验证数据失败！", "warning", "");
        return false;
    }
    if ($.trim($("#txtFineStatusDate").val()).length == 0) {
        window.top.$.messager.alert("提示", "请选择单据日期！", "warning", "function(){$('#txtFineStatusDate').focus()}");
        return false;
    }

    if ($.trim($("#txtVendordcode").val()).length == 0) {
        window.top.$.messager.alert("提示", "请选择供应商！", "warning", "function(){$('#txtVendordcode').focus()}");
        return false;
    }
    if ($.trim($("#s").val()).length == 0) {
        window.top.$.messager.alert("提示", "请选择商品！", "warning", "function(){$('#s').focus()}");
        return false;
    }

    if ($("#txtFineAmount").val() <= 0) {
        window.top.$.messager.alert("提示", "供应商违约金必须大于0！", "warning", "function(){$('#s').focus()}");
        return false;
    }

    if ($("#txtFineAmount").val()*1 > $('#txtRemainingSum').val()*1) {
        window.top.$.messager.alert("提示", "供应商违约金必须小于可提现金额！", "warning", "function(){$('#s').focus()}");
        return false;
    }

    if ($.trim($("#hidVendorID").val()) != $.trim($("#hidProductVendorID").val())) {
        window.top.$.messager.alert("提示", "该商品不属于该供应商，请重新选择！", "warning", "");
        return false;
    }

    /**
     if ($("#hidPresaleActivityID").val()== undefined ||$.trim($("#hidPresaleActivityID").val())=="") {
        window.top.$.messager.alert("提示", "商品对应的活动ID为空，请确认！", "warning", "");
        return false;
    }
     */

    ///供应商收款人账户信息
    if ($("#txtBankAccountName").val() == undefined || $.trim($("#txtBankAccountName").val()) == "") {
        window.top.$.messager.alert("提示", "收款人账户为空，请确认！", "warning", "");
        return false;
    }


    if ($("#txtBankNO").val() == undefined || $.trim($("#txtBankNO").val()) == "") {
        window.top.$.messager.alert("提示", "开户行行号为空，请确认！", "warning", "");
        return false;
    }


    if ($("#txtBankName").val() == undefined || $.trim($("#txtBankName").val()) == "") {
        window.top.$.messager.alert("提示", "开户银行为空，请确认！", "warning", "");
        return false;
    }


    if ($("#txtBankAccountNO").val() == undefined || $.trim($("#txtBankAccountNO").val()) == "") {
        window.top.$.messager.alert("提示", "银行账号为空，请确认！", "warning", "");
        return false;
    }

    var tcode = $('#ddlFineTypeCode').val();
    // var penaltyType = $('#ddlFineTypeCode').val();
    // var tname = $("#ddlFineTypeCode").find("option:selected").text();
    if ($.trim(tcode).length == 0) {
        window.top.$.messager.alert("提示", "请选择罚款类型!", "warning", "function(){$('#ddlFineTypeCode').select()}");
        return false;
    }
    var id = $('#vendorPenaltyNo').val();
    // debugger;
    var formData = {};
    if (id != null && id != undefined) {
        formData.vendorPenaltyNo = id;
    }
    var penaltyDate = $('#txtFineStatusDate').val();
    formData.penaltyDate = penaltyDate;

    var status = $('#txtStatus').val();
    formData.statusName = status;

    var vendorId = $('#hidVendorID').val();
    formData.vendorId = vendorId;

    var vendorCode = $('#txtVendordcode').val();
    formData.vendorCode = vendorCode;

    var vendorName = $('#txtVendorName').val();
    formData.vendorName = vendorName;

    var productId = $('#hidPID').val();
    formData.productId = productId;

    var sku = $('#s').val();
    formData.sku = sku;

    var productName = $('#txtProductName').val();
    formData.productName = productName;


    var penaltyAmt = $('#txtFineAmount').val();
    formData.penaltyAmt = penaltyAmt;

    var penaltyReason = $('#txtFineReason').val();
    formData.penaltyReason = penaltyReason;

    var penaltyType = $('#ddlFineTypeCode').val();
    formData.penaltyType = penaltyType;

    var penaltyTypeText = $("#ddlFineTypeCode").find("option:selected").text();
    formData.penaltyTypeText = penaltyTypeText;


    var activityId = $('#hidPresaleActivityID').val();
    formData.activityId = activityId;

    var tmActivity = $('#hidActivityTime').val();
    formData.tmActivity = tmActivity;

    var totalAmt = $('#txtSumAmount').val();
    formData.totalAmt = totalAmt;

    var auditingAmt = $('#txtAuditingAmount').val();
    formData.auditingAmt = auditingAmt;

    var canWithdrawAmt = $('#txtRemainingSum').val();
    formData.canWithdrawAmt = canWithdrawAmt;

    var bankAccountName = $('#txtBankAccountName').val();
    formData.bankAccountName = bankAccountName;

    var bankNo = $('#txtBankNO').val();
    formData.bankNo = bankNo;

    var bankName = $('#txtBankName').val();
    formData.bankName = bankName;

    var bankAccountNo = $('#txtBankAccountNO').val();
    formData.bankAccountNo = bankAccountNo;

    var unionPayCID = $('#hidUnionPayCID').val();
    formData.unionPayCID = unionPayCID;

    var unionPayMID = $('#hidUnionPayMID').val();
    formData.unionPayMID = unionPayMID;

    var thumbnailsUrl = $('#hidPrimaryUrl').val();
    formData.thumbnailsUrl = thumbnailsUrl;
    //var formData = xsjs.SerializeDecodeURL2Json($("#productInfo").find("input, textarea, select").serialize(), true);

    xsjs.ajax({
        url: contextPath + "/vendorFine/saveVendorFine",
        data: formData,
        type: "POST",
        loadMsg: "正在保存数据，请稍候...",
        success: function (data) {
            if (data.rspCode == "success") {
                window.top.$.messager.alert("温馨提示", data.rspDesc, "info");
                if (window.frameElement.wapi && window.frameElement.wapi.pageList) {
                    window.frameElement.wapi.pageList.loadList();
                }
                else {

                }
                xsjs.pageClose();
            } else {
                window.top.$.messager.alert("提示", data.rspDesc, "warning", "");
            }
        },
        error: function () {
        }
    });
}

function ajax_encode(str) {
    // debugger;
    str = str.replace(/%/g, "{@bai@}");
    str = str.replace(/ /g, "{@kong@}");
    str = str.replace(/</g, "{@zuojian@}");
    str = str.replace(/>/g, "{@youjian@}");
    str = str.replace(/&/g, "{@and@}");
    str = str.replace(/\"/g, "{@shuang@}");
    str = str.replace(/\'/g, "{@dan@}");
    str = str.replace(/\t/g, "{@tab@}");
    str = str.replace(/\+/g, "{@jia@}");
    return str;
}


//审核
function auditVendorFine() {
    // debugger;

    var auditRes = 4;
    if ($("#radioAuditY").is(':checked')) {
        auditRes = $("#radioAuditY").val();
    }
    else if ($("#radioAuditN").is(':checked')) {
        auditRes = $("#radioAuditN").val();
    }
    var auditDes = $.trim($("#txtFineAuditDesc").val());

    if (auditDes.length > 500) {
        window.top.$.messager.alert("提示", "您的驳回原因太长了.....！", "warning", "function(){$('#txtFineAuditDesc').focus()}");
        return false;
    }
    var id = $("#hidVendorFineID").val();
    var req = {
        FineIDList: id,
        StatusCode: auditRes,
        Remark: auditDes
    }
    //pageList.grid.getSelected().serialize() + "&StatusCode=" + auditRes + "&Remark=" + auditDes;
    xsjs.ajax({
        url: "/VendorFine/AuditSaveVendorFine",
        data: req,
        type: "POST",
        loadMsg: "正在保存数据，请稍候...",
        success: function (data) {

            if (data.Flag == "SUCCESS" || data.Flag == "0") {
                window.top.$.messager.alert("温馨提示", data.Info, "info");
                if (window.frameElement.wapi && window.frameElement.wapi.pageList) {
                    window.frameElement.wapi.pageList.loadList();
                }
                else {

                }
                xsjs.pageClose();
            }
        },
        error: function () {
        }
    });
}

