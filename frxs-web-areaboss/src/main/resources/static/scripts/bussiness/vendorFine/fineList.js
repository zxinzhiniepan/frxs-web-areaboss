/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var toolbarArray = new Array();
var xsTdAction = new Array();
var isAdd = null;
var isUpdate = null;
var isDelete = null;
var isOk = null;
var isUpf = null;
var isAudit = null;
var isExport = null;
$(function(){
    isAdd = XSLibray.authorize(69, 232);
    isUpdate = XSLibray.authorize(69, 232);
    isDelete = XSLibray.authorize(69, 233);
    isOk = XSLibray.authorize(69, 234);
    isUpf = XSLibray.authorize(69, 234);
    isAudit = XSLibray.authorize(69, 235);
    isExport = XSLibray.authorize(69, 236);
    if(isAdd){
        toolbarArray.push({
            text: "添加",             //必填（导出 或 export）
            iconCls: "icon-add",
            handler: function () { Add(); }
        });
    }
    if(isUpdate){
        toolbarArray.push({
            text: "编辑",             //必填（导出 或 export）
            iconCls: "icon-edit",
            handler: function () { EditByFineIDs(); }
        });
    }

    if(isDelete){
        toolbarArray.push("删除");
    }

    if(isOk){
        toolbarArray.push({
            text: "确认",             //必填（导出 或 export）
            iconCls: "icon-ok",
            handler: function () { ConfirmByFineIDs(); }
        });
    }
    if(isUpf){
        toolbarArray.push({
            text: "反确认",             //必填（导出 或 export）
            iconCls: "icon-upf",
            handler: function () { UnConfirmByFineIDs(); }
        });
    }

    if(isAudit){
        toolbarArray.push({
            text: "审核",             //必填（导出 或 export）
            iconCls: "icon-ok",
            handler: function () { FirstCheckByFineIDs(); }
        });
    }

    if(isExport){
        toolbarArray.push({ action: "导出", url: "/VendorFine/DownloadList" });
    }

});


toolbarArray.push({
    text: "查看",             //必填（导出 或 export）
    iconCls: "icon-search",
    handler: function () { View(); }
});

var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "vendorFineID",
                del: "/vendorFine/logicDeleteByFineIDs",
            },
            //add: {
            //    maxHeight: 750,
            //    minHeight: 360,
            //    Width:700,
            //    url: "/VendorFine/AddFine",
            //    title: "添加供应商罚款",
            //    editTitle: "编辑添加供应商罚款"
            //},
            //edit: {
            //    maxHeight: 750,
            //    minHeight: 360,
            //    Width: 700,
            //    url: "/VendorFine/EditFine",
            //    title: "编辑供应商罚款",
            //    editTitle: "编辑添加供应商罚款"
            //},
            details: {
                url: "/VendorFine/ViewFine",
                title: "查看供应商罚款",
            },
            //导航选项
            nav: ["区域财务管理", "供应商罚款"],
            //搜索栏选项
            search: [
                {
                    text: "单据日期", type: "datetime", column: 2, attributes: {
                        id: "fineStatusDateStart",
                        name: "fineStatusDateStart",
                        value: xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd"),
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'fineStatusDateEnd\\\')}'})"
                    }
                },
                {
                    text: " - ", type: "datetime", attributes: {
                        id: "fineStatusDateEnd",
                        name: "fineStatusDateEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'fineStatusDateStart\\\')}'})"
                    }
                },


                { text: "供应商编码", attributes: { name: "vendorCode" } },
                { text: "单号", attributes: { name: "vendorFineNO" } },
                { text: "开户行", attributes: { name: "bankName" } },
                { type: "<br/>" },
                {
                    text: "&nbsp;状态", type: "checkboxlist", attributes: { name: "fineStatusCode" },
                    option: [
                        { text: "待确认", value: "1" },
                        { text: "待审核", value: "2" },
                        { text: "审核通过", value: "3" },
                        { text: "复核驳回", value: "6" },
                        { text: "划付中", value: "7" },
                        { text: "划付成功", value: "8" },
                        { text: "划付失败", value: "9" }
                    ]
                },
            ],
            onSearchVerify: function (searchData) {
                if (searchData.FineStatusDateStart == "") {
                    window.top.$.messager.alert("提示", "请选择开始时间！", "warning", "function(){$('#fineStatusDateStart').focus()}");
                    return false;
                }
                return true;
            },
            //数据列表选项
            datagrid: {
                url: "/vendorFine/getPageList",
                fitColumns: false,
                idField: 'vendorFineID',         //主键
                showFooter: true,
                columns: [[
                    { field: 'vendorFineID', checkbox: true },
                    {
                        field: 'fineStatusDate', title: '单据日期', align: "center", width: 80, formatter: function (val) {
                            return xsjs.dateFormat(val, "yyyy-MM-dd");
                        }
                    },
                    { field: 'vendorFineNO', title: '单号', width: 180, align: 'center' },
                    { field: 'fineStatusCode', title: '状态值', width: 1, hidden: 'true' },
                    { field: 'fineStatusText', title: '状态', width: 60, align: 'center' },
                    { field: 'vendorCode', title: '供应商编码', width: 80, align: 'center' },
                    { field: 'opAreaName', title: '区域名称', width: 80, align: 'center' },
                    { field: 'vendorName', title: '供应商名称', width: 180 },
                    { field: 'bankName', title: '开户行', width: 200 },
                    { field: 'fineAmount', title: '供应商违约金', width: 80, dataType: "money", align: "right" },
                    { field: 'sumAmount', title: '总金额', width: 80, dataType: "money", align: "right" },
                    { field: 'auditingAmount', title: '审核中金额', width: 80, dataType: "money", align: "right" },
                    //可提现金额
                    { field: 'remainingSum', title: '可提现金额', width: 80, dataType: "money", align: "right" },
                    { field: 'fineTypeText', title: '罚款类型', width: 160 },

                    //划付单号
                    //划付状态
                    { field: 'createUserName', title: '创建人员', width: 100, align: 'center' },
                    {
                        field: 'createTime', title: '创建时间', align: "center", width: 140, formatter: function (val) {
                            return xsjs.dateFormat(val, "yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    { field: 'firstCheckerName', title: '审核人员', width: 100, align: 'center' },
                    {
                        field: 'firstCheckTime', title: '审核时间', align: "center", width: 140, formatter: function (val) {
                            return xsjs.dateFormat(val, "yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    { field: 'auditUserName', title: '复核人员', width: 100, align: 'center' },
                    {
                        field: 'auditTime', title: '复核时间', align: "center", width: 140, formatter: function (val) {
                            return xsjs.dateFormat(val, "yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    {
                        field: 'backCheckTime', title: '划付回盘时间', align: "center", width: 140, formatter: function (val) {
                            return xsjs.dateFormat(val, "yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    //划付回盘时间

                    //{ field: 'FineStatusCode', title: '罚款状态编码', width: 200 },
                    //{ field: 'FineStatusDate', title: '单据日期', width: 200 },
                    //{ field: 'VendorID', title: '供应商ID', width: 200 },
                    //{ field: 'VendorCode', title: '供应商编码', width: 200 },
                    //{ field: 'VendorName', title: '供应商名称', width: 200 },
                    //{ field: 'ProductID', title: '商品编号', width: 200 },
                    //{ field: 'ProductName', title: '商品名称', width: 200 },
                    //{ field: 'FineAmount', title: '罚款金额', width: 200 },
                    //{ field: 'FineTypeCode', title: '罚款类型编码', width: 200 },
                    //{ field: 'CreateTime', title: '创建时间', width: 200 },
                    //{ field: 'CreateUserID', title: '创建用户ID', width: 200 },
                    //{ field: 'CreateUserName', title: '创建用户名称', width: 200 },
                    //{ field: 'ModifyTime', title: '最后修改时间', width: 200 },
                    //{ field: 'ModifyUserID', title: '最后修改用户ID', width: 200 },
                    //{ field: 'ModifyUserName', title: '最后修改用户名称', width: 200 },
                    //{ field: 'OpAreaID', title: '区域ID', width: 200 },
                    //{ field: 'OpAreaName', title: '区域名称', width: 200 },
                    //{ field: 'FirstCheckDesc', title: '初审备注', width: 200 },
                    //{ field: 'AuditUserID', title: '审核人ID', width: 200 },
                    //{ field: 'AuditUserName', title: '审核人', width: 200 },
                    //{ field: 'AuditTime', title: '审核时间', width: 200 },
                    //{ field: 'AuditDesc', title: '审核备注', width: 200 },
                    //{ field: 'SumAmount', title: '总金额', width: 200 },
                    //{ field: 'RemainingSum', title: '余额', width: 200 },
                    //{ field: 'AccountName', title: '银行卡开户人姓名', width: 200 },
                    //{ field: 'BankName', title: '开户行', width: 200 },
                    //{ field: 'BankCardNO', title: '银行卡号', width: 200 },
                    //{ field: 'BankNO', title: '开户行行号', width: 200 },
                    //{ field: 'PresaleActivityID', title: '预售活动ID', width: 200 },
                    //{ field: 'IsDeleted', title: '是否删除', width: 200 },
                    //{ field: 'AuditingAmount', title: '审核中金额', width: 200 }

                ]],
                onLoadSuccess: function (data) {

                },
                onDblClickRow: function (rowIndex, rowData) {


                    xsjs.window({
                        title: "查看供应商罚款",
                        url: "/vendorFine/viewFine?id=" + rowData.vendorFineID,
                        modal: true,
                        width: 714,
                        Height: 540,
                        maxHeight: 540,
                        owdoc: window.top
                    });

                }
            }
            , toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    //刷新列表
    loadList: function () {
        document.body.options.reload();
    }
};

$(function () {
    pageList.init();
});

//确认
function ConfirmByFineIDs() {

    var rows = pageList.grid.getGrid.datagrid('getSelections');
    if (rows.length == 0) {
        window.top.$.messager.alert("温馨提示", "请选择确认的行", "");
        return;
    }
    if (rows.length > 1) {
        window.top.$.messager.alert("温馨提示", "该操作不能选择多行!", "warning");
        return;
    }
    var exceptionCount = 0;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].fineStatusCode != "1") {
            exceptionCount++;
        }
    }
    if (exceptionCount > 0) {
        window.top.$.messager.alert("温馨提示", "选中了" + exceptionCount + "条不能行确认的记录，请重新选择！", "warning");
        return;
    }
    window.top.$.messager.confirm("温馨提示", "是否确认选择的行！", function (data) {
        if (data) {
            //var ids = pageList.grid.getSelected().serialize().replace(/&VendorFineID=/g, ',').replace("VendorFineID=", '');
            $.ajax({
                url: "/VendorFine/ConfirmByFineIDs",
                loadMsg: "正在提交,请稍候....",
                data: pageList.grid.getSelected().serialize(),
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.Info, data.Flag == "0" ? "info" : "error");
                    if (data.Flag == "0") {
                        document.body.options.reload();
                    }
                },
                error: function () {

                }
            })
        }
    });
}

//反确认
function UnConfirmByFineIDs() {

    var rows = pageList.grid.getGrid.datagrid('getSelections');
    if (rows.length == 0) {
        window.top.$.messager.alert("温馨提示", "请选择反确认的行", "");
        return;
    }
    if (rows.length > 1) {
        window.top.$.messager.alert("温馨提示", "该操作不能选择多行!", "warning");
        return;
    }
    var exceptionCount = 0;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].fineStatusCode != "2") {
            exceptionCount++;
        }
    }
    if (exceptionCount>0) {
        window.top.$.messager.alert("温馨提示", "选中了" + exceptionCount+"条不能进行反确认的记录，请重新选择！", "warning");
        return;
    }


    window.top.$.messager.confirm("温馨提示", "是否反确认选择的行！", function (data) {
        if (data) {
            $.ajax({
                url: "/VendorFine/UnConfirmByFineIDs",
                loadMsg: "正在提交,请稍候....",
                data: pageList.grid.getSelected().serialize(),
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.Info, data.Flag == "0" ? "info" : "error");
                    if (data.Flag == "0") {
                        document.body.options.reload();
                    }
                },
                error: function () {

                }
            })
        }
    });
}

//初审
function FirstCheckByFineIDs() {

    var rows = pageList.grid.getGrid.datagrid('getSelections');
    if (rows.length == 0) {
        window.top.$.messager.alert("温馨提示", "请选择审核的行", "");
        return;
    }
    if (rows.length > 1) {
        window.top.$.messager.alert("温馨提示", "该操作不能选择多行!", "warning");
        return;
    }
    var exceptionCount = 0;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].fineStatusCode != "2") {
            exceptionCount++;
        }
    }
    if (exceptionCount > 0) {
        window.top.$.messager.alert("温馨提示", "选中了" + exceptionCount + "条不能进行审核的记录，请重新选择！", "warning");
        return;
    }
    window.top.$.messager.confirm("温馨提示", "确定该条单据是否审核通过？", function (data) {
        if (data) {
            $.ajax({
                url: "/VendorFine/FirstCheckByFineIDs",
                loadMsg: "正在提交,请稍候....",
                data: pageList.grid.getSelected().serialize(),
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.Info, data.Flag == "0" ? "info" : "error");
                    if (data.Flag == "0") {
                        document.body.options.reload();
                    }
                },
                error: function () {

                }
            })
        }
    })
}

//编辑
function EditByFineIDs()
{
    var rows = pageList.grid.getGrid.datagrid('getSelections');
    if (rows.length == 0) {
        window.top.$.messager.alert("温馨提示", "请选择要编辑的行", "");
        return;
    }

    if (rows.length > 1) {
        window.top.$.messager.alert("温馨提示", "编辑时不能选择多行!", "warning");
        return;
    }
    if (rows[0].fineStatusCode!="1") {
        window.top.$.messager.alert("温馨提示", rows[0].fineStatusText+"状态不能进行编辑！", "warning");
        return;
    }
    xsjs.window({
        title: "编辑供应商罚款",
        url: "/vendorFine/editFine?id=" + rows[0].vendorFineID,
        modal: true,
        width: 714,
        Height: 540,
        maxHeight:540,
        owdoc: window.top
    });
}

//新增
function Add() {
    xsjs.window({
        title: "新增供应商罚款",
        url: "/vendorFine/addFine",
        modal: true,
        width: 714,
        Height: 540,
        maxHeight: 540,
        owdoc: window.top
    });
}

//查看
function View() {

    var rows = pageList.grid.getGrid.datagrid('getSelections');
    if (rows.length == 0) {
        window.top.$.messager.alert("温馨提示", "请选择要查看的行", "");
        return;
    }

    if (rows.length > 1) {
        window.top.$.messager.alert("温馨提示", "查看时不能选择多行!", "warning");
        return;
    }

    xsjs.window({
        title: "查看供应商罚款",
        url: "/vendorFine/viewFineOne?id=" + rows[0].vendorFineID,
        modal: true,
        width: 714,
        Height: 540,
        maxHeight: 540,
        owdoc: window.top
    });
}













