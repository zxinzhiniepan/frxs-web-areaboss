/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
//var _beginPayDate = getWeekStartDate();
//var _endPayDate = getWeekEndDate();
var yesterdayDate = '2018-01-16';
var newDate = '2018-01-16';
var toolbarArray = new Array();


toolbarArray.push({
    action: "导出",             //必填（导出 或 export）
    url: "/Report/DownloadVendorPayInfoList"   //必填  下载地址
});
var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {
        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "RowIndex"
            },
            //导航选项
            nav: ["报表管理", "供应商货款付款资料"],
            onSearchVerify: function () {
                var expiryDateStart = $("#txtExpiryDateStart");
                var expiryDateEnd = $("#txtExpiryDateEnd");

                if ($.trim(expiryDateStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择活动开始日期", "info", function () {
                        expiryDateStart.focus();
                    });
                    return false;
                }

                if ($.trim(expiryDateEnd.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择活动结束日期", "info", function () {
                        expiryDateEnd.focus();
                    });
                    return false;
                }
                return true;
            },
            onSearchReset: function () {
                $("#txtExpiryDateStart").val(yesterdayDate);
                $("#txtExpiryDateEnd").val(newDate);
            },
            //搜索栏选项
            search: [
                {
                    text: "<span style='color: red;'>*</span>活动日期", type: "date", attributes: {
                        id: 'txtExpiryDateStart',
                        name: "ExpiryDateStart",
                        value: yesterdayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", type: "date", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "ExpiryDateEnd",
                        value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txtExpiryDateStart\\\')}'})"
                    }
                },
                { text: "供应商编码", attributes: { name: "VendorCode" } },
                { text: "供应商名称", attributes: { name: "VendorName" } },
                { type: "<br/>" },
                { text: "<span style='margin-left:15px'> </span>开户名", attributes: { name: "BankAccountName" } },
                { text: "<span style='margin-left:15px'> </span>开户行", attributes: { name: "BankName" } }
            ],
            //数据列表选项
            datagrid: {
                url: "/Report/GetVendorPayInfoList",
                fitColumns: false,
                idField: 'RowIndex',         //主键
                singleSelect: true,
                showFooter: true,
                columns: [[
                    { field: 'VendorCode', title: '供应商编码', width: 100, align: 'center' },
                    { field: 'VendorName', title: '供应商名称', width: 150, align: 'left', formatter: XSLibray.formatText },
                    { field: 'TotalSupplyPrice', title: '金额', width: 70, dataType: "money", align: 'right' },
                    { field: 'BankName', title: '开户行及地址', width: 150, align: 'left', formatter: XSLibray.formatText },
                    { field: 'BankAccountName', title: '开户名', width: 100, align: 'center', formatter: XSLibray.formatText },
                    { field: 'BankAccountNO', title: '银行帐号', width: 150, align: 'center' },
                    { field: 'UnionPayMID', title: '联行号', width: 150, align: 'center' }
                ]]
            },
            toolbar: toolbarArray
        };
        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    }
};

$(function () {
    pageList.init();
});
