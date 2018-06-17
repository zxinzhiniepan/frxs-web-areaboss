//审核
function auditVendorFine() {

    debugger;
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
            debugger;
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

    if (actionType == 0) {
        $("#btnSave").click(function () {
            saveVendorFine();
        });
    }
    else if (actionType==3)
    {
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
            url: "/VendorFine/GetVendorFineTrackFineID?ID=" + vendorFineID,
            rownumbers: "true",
            columns: [[
                {
                    field: 'CreateTime', title: '时间', width: 200, align: "center", formatter: function (val) {
                        return xsjs.dateFormat(val, "yyyy-MM-dd HH:mm:ss");
                    }
                },
                { field: 'CreateUserName', title: '操作员', width: 100, align: 'center' },
                { field: 'TrackStatusName', title: '状态', width: 300, align: 'center' }]]
        });
    }

//选择供应商
    $("#btnSelectVendor").click(function () {
        var _dialog = xsjs.window({
            owdoc: window.top,
            url: "/Vendor/SelectVendor",
            width: 839,
            title: "选择供应商",
            dialog: true,
            modal: true,
            apidata: {
                VendorID: $("#hidVendorID").val(),
                callback: function (rows) {

                    debugger;
                    $("#hidVendorID").val(rows.VendorID);
                    $("#txtVendorName").val(rows.VendorName);
                    $("#txtVendordcode").val(rows.VendorCode);

                    $("#txtBankAccountName").val(rows.BankAccountName);
                    $("#txtBankNO").val(rows.BankNO);
                    $("#txtBankName").val(rows.BankName);
                    //$("#txtBankAccountNO").val(rows.BankAccountNO);
                    $("#txtBankAccountNO").val(XSLibray.BankCardShow(rows.BankAccountNO));
                    debugger;
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


//选择商品
    $("#btnSelectProduct").click(function () {

        if ($("#hidVendorID").val() == "" || $("#hidVendorID").val() <= 0) {
            window.top.$.messager.alert("选择供应商", "请先选择供应商！", "warning", "");
            return;
        } else {
            var _dialog = xsjs.window({
                owdoc: window.top,
                url: "/presaleActivity/VendorActivityProductList?singleSelect=true&vendorid=" + $("#hidVendorID").val(),
                width: 700,
                title: "选择商品",
                dialog: true,
                modal: true,
                apidata: {
                    callback: function (rows) {
                        $("#hidPID").val(rows.ProductID);
                        $("#txtProductName").val(rows.ProductName);
                        $("#s").val(rows.SKU);
                        $("#hidProductVendorID").val(rows.VendorID);
                        $("#hidActivityTime").val(rows.ExpiryDateStart);
                        $("#txtFineAmount").focus();
                        $("#hidPresaleActivityID").val(rows.PresaleActivityID);
                    }
                }
            });
        }
    });

    if (actionType == 0) {
        //添加或编辑时，需要刷新账户金额显示
        debugger;
        fushVendorAmount();
    }
    //初始化加载结束
});


//查询供应商账户金额
function fushVendorAmount() {
    var svendorID = $("#hidVendorID").val();
    var opAreaID = $("#hidOpAreaID").val();
    if (opAreaID == "" || opAreaID <= 0 || svendorID == "" || svendorID <= 0) {
        return false;
    }
    xsjs.ajax({
        url: "/VendorFine/GetVendorBalanceAmount",
        data: { OpAreaId: opAreaID, VendorID: svendorID },
        type: "POST",
        //loadMsg: "正在查询供应商账户信息请稍候...",
        success: function (data) {
            if (data.Flag == "SUCCESS" || data.Flag == 0) {

                var rdata = data.Data;
                if (data.Data == null || data.Data == undefined) {
                    window.top.$.messager.alert("提示", "查询供应账户信息失败！", "warning", "");
                    return;
                }
                // 划付中金额，复核通过之后增加，回盘成功之后减少UnionPayInTransitAmount
                // 审核中的金额AuditingAmount
                // 可用金额CanAmount
                $('#txtSumAmount').numberbox('setValue', rdata.SumAmount);
                $('#txtAuditingAmount').numberbox('setValue', rdata.AuditingAmount);
                $('#txtRemainingSum').numberbox('setValue', rdata.CanAmount);
                return true;
            }
            else{
                window.top.$.messager.alert("提示", data.Info, "warning", "");
            }
        },
        error: function (data) {
        }
    });
    return false;
}

//保存
function saveVendorFine() {

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
    if ($("#txtFineAmount").val() > $('#txtRemainingSum').val()) {
        window.top.$.messager.alert("提示", "供应商违约金必须小于可提现金额！", "warning", "function(){$('#s').focus()}");
        return false;
    }

    if ($.trim($("#hidVendorID").val()) != $.trim($("#hidProductVendorID").val())) {
        window.top.$.messager.alert("提示", "该商品不属于该供应商，请重新选择！", "warning", "");
        return false;
    }

    if ($("#hidPresaleActivityID").val()== undefined ||$.trim($("#hidPresaleActivityID").val())=="") {
        window.top.$.messager.alert("提示", "商品对应的活动ID为空，请确认！", "warning", "");
        return false;
    }


    var tcode = $('#ddlFineTypeCode').combobox('getValue')
    var tname = $('#ddlFineTypeCode').combobox('getText')

    if ($.trim(tcode).length == 0) {
        window.top.$.messager.alert("提示", "请选择罚款类型!", "warning", "function(){$('#ddlFineTypeCode').select()}");
        return false;
    }
    var formData = xsjs.SerializeDecodeURL2Json($("#tabVendorFine").find("input, textarea, select").serialize(), true);
    formData.FineTypeText = tname;
    formData.FineReason = ajax_encode(formData.FineReason);

    xsjs.ajax({
        url: "/VendorFine/SaveVendorFine",
        data: formData,
        type: "POST",
        loadMsg: "正在保存数据，请稍候...",
        success: function (data) {
            if (data.Flag == "SUCCESS") {
                window.top.$.messager.alert("温馨提示", data.Info,"info");
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

function ajax_encode(str) {
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

    debugger;
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
            debugger;
            if (data.Flag == "SUCCESS" || data.Flag == "0") {
                window.top.$.messager.alert("温馨提示", data.Info,"info");
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
