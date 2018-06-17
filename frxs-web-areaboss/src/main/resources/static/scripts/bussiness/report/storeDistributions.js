/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var toolbarArray = new Array();
var isExport = null;
$(function (){
    isExport = XSLibray.authorize(60, 153);
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+ "/report/exportCommodityOrderIncomePageList"   //必填  下载地址
        });
    }
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
                kid: "rowIndex"
            },
            //导航选项
            nav: ["报表管理", "门店商品配送统计报表"],
            onSearchVerify: function () {
                var expiryDateStart = $("#txtExpiryDateStart");
                var expiryDateEnd = $("#txtExpiryDateEnd");

                if ($.trim(expiryDateStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择活动截止日期", "info", function () {
                        expiryDateStart.focus();
                    });
                    return false;
                }

                if ($.trim(expiryDateEnd.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择活动截止日期", "info", function () {
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
                    text: "<span style='color: red;'>*</span>活动截止日期", type: "datetime", attributes: {
                        id: 'txtExpiryDateStart',
                        name: "expiryDateStart",
                        value: yesterdayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;&nbsp;", type: "datetime", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "expiryDateEnd",
                        value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txtExpiryDateStart\\\')}'})"
                    }
                },
                { text: "&nbsp;&nbsp;&nbsp;门店编号", attributes: { name: "storeNo" } },

                { text: "门店名称", attributes: { name: "storeName" } },
                {
                    text: "所属路线", type: "select", attributes: { name: "lineId" },
                    data: {
                        url: contextPath+ "/distributionLine/getList",
                        data: {
                            IsLock: 0
                        },
                        valueField: "lineIds",
                        textField: "lineName",
                        emptyOption: {
                            value: "",
                            text: "--全部--"
                        }
                    }
                },
                { type: "<br>" },
                { text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 商品编码", attributes: { name: "productId" }, column: 2 },
                { text: "&nbsp;&nbsp;商品名称&nbsp;", attributes: { name: "productName" } },
                { text: "供应商编码", attributes: { name: "vendorCode" } },
                {
                    text: "门店状态", type: "select", attributes: { name: "shopStatus" }, option: [
                        { value: "", text: "--全部--" },
                        { value: "1", text: "正常" },
                        { value: "2", text: "冻结" },
                        { value: "3", text: "已删除" }
                    ]
                }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+ "/report/getCommodityOrderIncomePageList",
                fitColumns: false,
                idField: 'rowIndex',         //主键
                showFooter: true,
                columns: [[
                    //{ field: 'RowIndex', checkbox: true },
                    {
                        field: 'expiryDateEnd', title: '活动截止日期', align: 'center', halign: "center", width: 100, formatter: function (val) {
                            return xsjs.dateFormat(val, "yyyy-MM-dd");
                        }
                    },
                    { field: 'storeNo', title: '门店编号', align: 'center', halign: "center", width: 80 },
                    { field: 'storeName', title: '门店名称', align: 'left', halign: "center", width: 200, formatter: XSLibray.formatText },
                    { field: 'storeTel', title: '联系电话', align: 'center', halign: "center", width: 90 },
                    { field: 'storeAddress', title: '提货地址', align: 'left', halign: "center", width: 200, formatter: XSLibray.formatText },
                    { field: 'storeDeveloper', title: '门店开发人员', align: 'center', halign: "center", width: 80 },
                    { field: 'lineName', title: '配送线路名称', align: 'left', halign: "center", width: 100 },
                    { field: 'productId', title: '商品编码', align: 'center', halign: "center", width: 80 },
                    { field: 'productName', title: '商品名称', align: 'left', halign: "center", width: 260, formatter: XSLibray.formatText },
                    { field: 'vendorCode', title: '供应商编码', align: 'center', halign: "center", width: 80 },
                    { field: 'vendorName', title: '供应商名称', align: 'left', halign: "left", width: 120, formatter: XSLibray.formatText },
                    { field: 'skuContent', title: '商品规格', align: 'center', halign: "center", width: 60 },
                    { field: 'totalOrdersAmt', title: '订单数量', align: 'right', halign: "center", width: 80 },
                    { field: 'qty', title: '订货数量(份)', align: 'right', halign: "center", width: 80 },
                    { field: 'totalPrice', title: '订单金额', dataType: "money", align: 'right', halign: "center", width: 80 },
                    { field: 'sumCommission', title: '合计提成', dataType: "money", align: 'right', halign: "center", width: 80 },
                    { field: 'packingNumber', title: '包装数', align: 'right', halign: "center", width: 60 },
                    { field: 'itemAdjustedPrice', title: '单价', dataType: "money", align: 'right', halign: "center", width: 50 },
                    { field: 'totalQty', title: '总数量', dataType: "money", align: 'right', halign: "center", width: 50 }
                ]],
                //xsTdAction: xsTdAction
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

function exportData(options){

    var colNameMap = {
        "expiryDateEnd": "活动截止日期",
        "storeNo": "门店编号",
        "storeName": "门店名称",
        "storeTel": "联系电话",
        "storeAddress": "提货地址",
        "storeDeveloper": "门店开发人员",
        "lineName": "配送线路名称",
        "productId": "商品编码",
        "productName": "商品名称",
        "vendorCode": "供应商编码",
        "vendorName": "供应商名称",
        "skuContent": "商品规格",
        "totalOrdersAmt": "订单数量",
        "qty": "订货数量(份)",
        "totalPrice": "订单金额",
        "sumCommission": "合计提成",
        "packingNumber": "包装数",
        "itemAdjustedPrice": "单价",
        "totalQty": "总数量"
    };

    var fileName = "门店商品配送统计报表";

    xsjs.ajax({
        url: options.action,
        data: options.data,
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    if (list[i].expiryDateEnd != null) {
                        list[i].expiryDateEnd = xsjs.dateFormat(list[i].expiryDateEnd, "yyyy-MM-dd");
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}