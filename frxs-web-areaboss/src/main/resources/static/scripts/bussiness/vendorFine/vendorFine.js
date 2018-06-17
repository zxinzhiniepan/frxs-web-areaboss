/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />

var toolbarArray = new Array();
var xsTdAction = new Array();
var add = null;
var edit = null;
var isDelete = null;
var confirm = null;
var unConfirm = null;
var firstCheck = null;
var downloadList = null;
var view = null;

$(function () {
    add = XSLibray.authorize(69, 232);
    edit = XSLibray.authorize(69, 275);
    isDelete = XSLibray.authorize(69, 233);
    confirm = XSLibray.authorize(69, 234);
    unConfirm = XSLibray.authorize(69, 283);
    firstCheck = XSLibray.authorize(69, 235);
    downloadList = XSLibray.authorize(69, 236);
    view = XSLibray.authorize(69, 253);
    if(add){
    toolbarArray.push({
        text: "添加",             //必填（导出 或 export）
        iconCls: "icon-add",
        handler: function () { Add(); }
    });
    }
    if(edit) {
        toolbarArray.push({
            text: "编辑",             //必填（导出 或 export）
            iconCls: "icon-edit",
            handler: function () {
                EditByFineIDs();
            }
        });
    }

    if(isDelete) {
        toolbarArray.push({
            text: "删除",             //必填（导出 或 export）
            iconCls: "icon_remove",
            handler: function () {
                deleteByFineIDs();
            }
        });

    }

    if(confirm) {
        toolbarArray.push({
            text: "确认",             //必填（导出 或 export）
            iconCls: "icon-ok",
            handler: function () {
                ConfirmByFineIDs();
            }
        });
    }

    if(unConfirm) {
        toolbarArray.push({
            text: "反确认",             //必填（导出 或 export）
            iconCls: "icon-upf",
            handler: function () {
                UnConfirmByFineIDs();
            }
        });
    }

    if(firstCheck) {
        toolbarArray.push({
            text: "审核",             //必填（导出 或 export）
            iconCls: "icon-shengh",
            handler: function () {
                FirstCheckByFineIDs();
            }
        });
    }

    if(downloadList) {
        // toolbarArray.push(
        //     {action: "导出", url: contextPath + "/vendorFine/downloadList"});
        toolbarArray.push({
            text: "导出",             //必填（导出 或 export）
            iconCls: "icon-excel",
            handler: function () {
                exportExcel();
            }
        });
    }


    if(view) {
        toolbarArray.push({
            text: "查看",             //必填（导出 或 export）
            iconCls: "icon-search",
            handler: function () {
                View();
            }
        });
    }
});









var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "vendorPenaltyNo"
           //     del: contextPath+"/vendorFine/deleteByFineIDs",
            },
            //add: {
            //    maxHeight: 750,
            //    minHeight: 360,
            //    Width:700,
            //    url: "/vendorFine/AddFine",
            //    title: "添加供应商罚款",
            //    editTitle: "编辑添加供应商罚款"
            //},
            //edit: {
            //    maxHeight: 750,
            //    minHeight: 360,
            //    Width: 700,
            //    url: "/vendorFine/EditFine",
            //    title: "编辑供应商罚款",
            //    editTitle: "编辑添加供应商罚款"
            //},
            details: {
                url: contextPath+"/vendorFine/viewFine",
                title: "查看供应商罚款",
            },
            //导航选项
            nav: ["区域财务管理", "供应商罚款"],
            //搜索栏选项
            search: [
                {
                    text: "单据日期", type: "datetime", column: 2, attributes: {
                        id: "penaltyDateBegin",
                        name: "penaltyDateBegin",
                        value: xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd"),
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'penaltyDateEnd\\\')}'})"
                    }
                },
                {
                    text: " - ", type: "datetime", attributes: {
                        id: "penaltyDateEnd",
                        name: "penaltyDateEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'penaltyDateBegin\\\')}'})"
                    }
                },


                { text: "供应商编码", attributes: { name: "vendorCode" } },
                { text: "单号", attributes: { name: "vendorPenaltyNo" } },
                { text: "开户行", attributes: { name: "bankName" } },
                { type: "<br/>" },
                {
                    text: "&nbsp;状态", type: "checkboxlist", attributes: { name: "listStatus" },
                    option: [
                        { text: "待确认", value: "AREA_CONF" },
                        { text: "待审核", value: "AREA_APP" },
                        { text: "审核通过", value: "FIRSTCHECK_PASS" },
                        { text: "复核驳回", value: "AUDIT_REJECT" },
                        { text: "划付中", value: "READY" },
                        { text: "划付成功", value: "SUCCESS" },
                        { text: "划付失败", value: "FAIL" }
                    ]
                },
            ],
            onSearchVerify: function (searchData) {
                if (searchData.penaltyDateBegin == "") {
                    window.top.$.messager.alert("提示", "请选择开始时间！", "warning", "function(){$('#penaltyDateBegin').focus()}");
                    return false;
                }
                return true;
            },
            //数据列表选项
            datagrid: {
                url: contextPath+"/vendorFine/getVendorFineList",
                fitColumns: false,
                idField: 'vendorPenaltyNo',         //主键
                showFooter: true,
                columns: [[
                    { field: 'vendorPenaltyNo', checkbox: true},
                    {
                        field: 'penaltyDate', title: '单据日期', align: "center", width: 80, formatter: function (val) {
                            return xsjs.dateFormat( val,"yyyy-MM-dd");
                        }
                    },
                   { field: 'vendorPenaltyId', title: '单号', width: 200, align: 'center' ,
                        formatter:function(value,row,index){
                            return row.vendorPenaltyNo;
                        }
                    },
                    { field: 'status', title: '状态值', width: 1, hidden: 'true' },
                    { field: 'statusName', title: '状态', width: 60, align: 'center' },
                    { field: 'vendorCode', title: '供应商编码', width: 80, align: 'center' },
                    { field: 'areaName', title: '区域名称', width: 80, align: 'center', formatter: XSLibray.formatText },
                    { field: 'vendorName', title: '供应商名称', width: 180, formatter: XSLibray.formatText },
                    { field: 'bankName', title: '开户行', width: 200, formatter: XSLibray.formatText },
                    { field: 'penaltyAmt', title: '供应商违约金', width: 80, dataType: "money", align: "right" ,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'totalAmt', title: '总金额', width: 80, dataType: "money", align: "right",formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'auditingAmt', title: '审核中金额', width: 80, dataType: "money", align: "right",formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    //可提现金额
                    { field: 'canWithdrawAmt', title: '可提现金额', width: 80, dataType: "money", align: "right" ,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'penaltyTypeText', title: '罚款类型', width: 160 },
                    { field: 'penaltyReason', title: '罚款原因', width: 160, formatter: XSLibray.formatText },
                    //划付单号
                    //划付状态
                    { field: 'createUserName', title: '创建人员', width: 100, align: 'center' },
                    {
                        field: 'tmCreate', title: '创建时间', align: "center", width: 140, formatter: function (val) {
                            return xsjs.dateFormat( val,"yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    { field: 'firstCheckerName', title: '审核人员', width: 100, align: 'center' },
                    {
                        field: 'tmFirstCheck', title: '审核时间', align: "center", width: 140, formatter: function (val) {
                            return xsjs.dateFormat( val,"yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    { field: 'auditUserName', title: '复核人员', width: 100, align: 'center' },
                    {
                        field: 'tmAudit', title: '复核时间', align: "center", width: 140, formatter: function (val) {
                            return xsjs.dateFormat( val,"yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    /*
                    {
                        field: 'BackCheckTime', title: '划付回盘时间', align: "center", width: 140, formatter: function (val) {
                            return xsjs.dateFormat(val, "yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    */
                    //划付回盘时间

                    //{ field: 'listStatus', title: '罚款状态编码', width: 200 },
                    //{ field: 'penaltyDate', title: '单据日期', width: 200 },
                    //{ field: 'VendorID', title: '供应商ID', width: 200 },
                    //{ field: 'vendorCode', title: '供应商编码', width: 200 },
                    //{ field: 'vendorName', title: '供应商名称', width: 200 },
                    //{ field: 'ProductID', title: '商品编号', width: 200 },
                    //{ field: 'ProductName', title: '商品名称', width: 200 },
                    //{ field: 'penaltyAmt', title: '罚款金额', width: 200 },
                    //{ field: 'FineTypeCode', title: '罚款类型编码', width: 200 },
                    //{ field: 'CreateTime', title: '创建时间', width: 200 },
                    //{ field: 'CreateUserID', title: '创建用户ID', width: 200 },
                    //{ field: 'CreateUserName', title: '创建用户名称', width: 200 },
                    //{ field: 'ModifyTime', title: '最后修改时间', width: 200 },
                    //{ field: 'ModifyUserID', title: '最后修改用户ID', width: 200 },
                    //{ field: 'ModifyUserName', title: '最后修改用户名称', width: 200 },
                    //{ field: 'OpAreaID', title: '区域ID', width: 200 },
                    //{ field: 'areaName', title: '区域名称', width: 200 },
                    //{ field: 'FirstCheckDesc', title: '初审备注', width: 200 },
                    //{ field: 'AuditUserID', title: '审核人ID', width: 200 },
                    //{ field: 'AuditUserName', title: '审核人', width: 200 },
                    //{ field: 'AuditTime', title: '审核时间', width: 200 },
                    //{ field: 'AuditDesc', title: '审核备注', width: 200 },
                    //{ field: 'totalAmt', title: '总金额', width: 200 },
                    //{ field: 'RemainingSum', title: '余额', width: 200 },
                    //{ field: 'AccountName', title: '银行卡开户人姓名', width: 200 },
                    //{ field: 'bankName', title: '开户行', width: 200 },
                    //{ field: 'BankCardNO', title: '银行卡号', width: 200 },
                    //{ field: 'BankNO', title: '开户行行号', width: 200 },
                    //{ field: 'PresaleActivityID', title: '预售活动ID', width: 200 },
                    //{ field: 'IsDeleted', title: '是否删除', width: 200 },
                    //{ field: 'AuditingAmount', title: '审核中金额', width: 200 }

                ]],
                onLoadSuccess: function (data) {

                },
                onDblClickRow: function (rowIndex, rowData) {
                   /* xsjs.window({
                        title: "查看供应商罚款",
                        url: contextPath+"/vendorFine/viewFine?vendorPenaltyNo=" + rowData.vendorPenaltyNo,
                        modal: true,
                        width: 714,
                        Height: 540,
                        maxHeight: 540,
                        owdoc: window.top
                    });*/
                   var url = contextPath+"/vendorFine/viewFine?vendorPenaltyNo=" + rowData.vendorPenaltyNo ;
                   xsjs.addTabs({
                       url: url,
                       title: "查看供应商罚款",
                       win: window
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

function exportExcel(options) {
    xsjs.ajax({
        url: contextPath+"/vendorFine/createExcel",
        data: pageList.grid.getSearch(),
        type: "POST",
        loadMsg: "正在下载，请稍候...",
        success: function (data) {
            //
            if (data.rspCode == "success" ) {
                var fileName = encodeURI(data.record);
                setTimeout(function () {
                    window.location.href = contextPath+"/storeProfile/exportExcel?fileName="+ fileName;
                }, 500);

            }else{
                window.top.$.messager.alert("温馨提示", data.rspDesc, "error");
            }
        },
        error: function () {
            $.messager.alert("温馨提示", "excel导出失败", "error");
        }
    });
}


function exportData(options){
    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var fileName = "供应商罚金_"+timeStr;
    var colNameMap = {
        "penaltyDate": "单据日期",
        "vendorPenaltyNo": "单号",
        "statusName": "状态",
        "vendorCode": "供应商编码",
        "areaName": "区域名称",
        "vendorName": "供应商名称",
        "bankName": "开户行",
        "penaltyAmt": "供应商违约金",
        "totalAmt": "总金额",
        "auditingAmt": "审核中的金额",
        "canWithdrawAmt": "可提现金额",
        "penaltyTypeText": "罚款类型",
        "penaltyReason": "罚款原因",
        "createUserName": "创建人员",
        "tmCreate":"创建时间",
        "firstCheckerName":"审核人",
        "tmFirstCheck":"审核时间",
        "auditUserName":"复核人",
        "tmAudit":"复核时间"
    };

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg: "正在导出数据，请稍候",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    list[i].penaltyDate = xsjs.dateFormat(list[i].penaltyDate);
                    list[i].tmCreate = xsjs.dateFormat(list[i].tmCreate);
                    list[i].tmFirstCheck = xsjs.dateFormat(list[i].tmFirstCheck);
                    list[i].tmAudit = xsjs.dateFormat(list[i].tmAudit);
                    list[i].penaltyAmt = formatter(list[i].penaltyAmt);
                    list[i].totalAmt = formatter(list[i].totalAmt);
                    list[i].auditingAmt = formatter(list[i].auditingAmt);
                    list[i].canWithdrawAmt = formatter(list[i].canWithdrawAmt);
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}

function formatter(val) {
    if(val==null){
        return "0.00";
    }
    return val.amount.toFixed(2);
}

//刪除
function deleteByFineIDs() {

    var rows = pageList.grid.getGrid.datagrid('getSelections');
    if (rows.length == 0) {
        window.top.$.messager.alert("温馨提示", "请选择刪除的行", "");
        return;
    }
   // if (rows.length > 1) {
    //    window.top.$.messager.alert("温馨提示", "该操作不能选择多行!", "warning");
   //     return;
   // }
    debugger;
    var exceptionCount = 0;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].status != "AREA_CONF") {
            exceptionCount++;
        }
    }
    if (exceptionCount > 0) {
        window.top.$.messager.alert("温馨提示", "选中了" + exceptionCount + "条不能行刪除的记录，请重新选择！", "warning");
        return;
    }
    window.top.$.messager.confirm("温馨提示", "是否确认选择的行！", function (data) {
        if (data) {
            //var ids = pageList.grid.getSelected().serialize().replace(/&vendorPenaltyNo=/g, ',').replace("vendorPenaltyNo=", '');
            $.ajax({
                url: contextPath+"/vendorFine/deleteByFineIDs",
                loadMsg: "正在提交,请稍候....",
                data: pageList.grid.getSelected().serialize(),
                success: function (data) {
                    console.log(data)
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
                    if (data.rspCode == "success") {
                        document.body.options.reload();
                    }
                },
                error: function () {

                }
            })
        }
    });
}


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
        if (rows[i].status != "AREA_CONF") {
            exceptionCount++;
        }
    }
    if (exceptionCount > 0) {
        window.top.$.messager.alert("温馨提示", "选中了" + exceptionCount + "条不能行确认的记录，请重新选择！", "warning");
        return;
    }
    window.top.$.messager.confirm("温馨提示", "是否确认选择的行！", function (data) {
        if (data) {
            //var ids = pageList.grid.getSelected().serialize().replace(/&vendorPenaltyNo=/g, ',').replace("vendorPenaltyNo=", '');
            $.ajax({
                url: contextPath+"/vendorFine/confirmByFineIds",
                loadMsg: "正在提交,请稍候....",
                data: pageList.grid.getSelected().serialize(),
                success: function (data) {
                    console.log(data)
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
                    if (data.rspCode == "success") {
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
        if (rows[i].status != "AREA_APP") {
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
                url: contextPath+"/vendorFine/unConfirmByFineIds",
                loadMsg: "正在提交,请稍候....",
                data: pageList.grid.getSelected().serialize(),
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
                    if (data.rspCode == "success") {
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
        if (rows[i].status != "AREA_APP") {
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
                url: contextPath+"/vendorFine/firstCheckByFineIds",
                loadMsg: "正在提交,请稍候....",
                data: pageList.grid.getSelected().serialize(),
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
                    if (data.rspCode == "success") {
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
    if (rows[0].status!="AREA_CONF") {
        window.top.$.messager.alert("温馨提示", rows[0].statusName+"状态不能进行编辑！", "warning");
        return;
    }
    xsjs.window({
        title: "编辑供应商罚款",
        url: contextPath+"/vendorFine/editFine?vendorPenaltyNo=" + rows[0].vendorPenaltyNo,
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
        url: contextPath+"/vendorFine/addFine",
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
        url: contextPath+"/vendorFine/viewFine?vendorPenaltyNo=" + rows[0].vendorPenaltyNo,
        modal: true,
        width: 714,
        Height: 540,
        maxHeight: 540,
        owdoc: window.top
    });
}