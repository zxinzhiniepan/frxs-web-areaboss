
// var yesterdayDate = xsjs.dateFormat((new Date(new Date().getTime()- (24 * 60 * 60 * 1000))).getTime(), "yyyy-MM-dd");
var yesterdayDate = xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd");
var newDate = xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd");
var toolbarArray = new Array();
var isExport = null;
$(function () {
    isExport = XSLibray.authorize(73, 163);
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath + '/financialAudit/downloadCommodityProblemList'   //必填  下载地址
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
            nav: ["财务管理", "供应商商品问题扣款查询"],
            onSearchVerify: function () {
                var expiryDateStart = $("#txtExpiryDateStart");
                var expiryDateEnd = $("#txtExpiryDateEnd");

                if ($.trim(expiryDateStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择罚款单据开始日期", "info", function () {
                        expiryDateStart.focus();
                    });
                    return false;
                }

                if ($.trim(expiryDateEnd.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择罚款单据结束日期", "info", function () {
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
                    text: "<span style='color: red;'>*</span>单据日期", type: "date", attributes: {
                        id: 'txtExpiryDateStart',
                        name: "tmActivityBegin",
                        value: yesterdayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", type: "date", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "tmActivityEnd",
                        value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txtExpiryDateStart\\\')}'})"
                    }
                },
                { text: "供应商简称", attributes: { name: "vendorName" } },
                { text: "供应商编码", attributes: { name: "vendorCode" } },
                { type: "<br/>" },
                { text: "<span style='margin-left:5px'> </span>商品名称", attributes: { name: "productName" } },
                { text: "商品编码", attributes: { name: "sku" } }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath + '/financialAudit/getVendorCommodityProblemList',
                fitColumns: false,
                idField: 'rowIndex',         //主键
                singleSelect: true,
                showFooter: true,
                columns: [[
                    { field: 'vendorCode', title: '供应商编码', width: 100, align: 'center' },
                    { field: 'vendorName', title: '供应商简称', width: 100, align: 'center' },
                    { field: 'sku', title: '商品编码', width: 100, align: 'center' },
                    { field: 'productName', title: '商品名称', width: 150, align: 'center' },
                    { field: 'tmActivity', title: '销售时间', width: 200, align: 'center', formatter: function (val,rows) {
                            if(rows.expiryDateStart != null && rows.expiryDateEnd != null){
                                return rows.expiryDateStart.substring(0,10) + "~" + rows.expiryDateEnd.substring(0,10);
                            }else{
                                return "";
                            }
                        }
                    },
                    { field: 'shipmentQty', title: "订货数量", align: 'center', width: 80 },
                    { field: 'singleVendorAmt', title: "成本单价", align: 'center', width: 80 ,formatter: function (val) { return amountFormat(val);} },
                    { field: 'totalPayAmt', title: "合计应付款", align: 'center', width: 80,formatter: function (val) { return amountFormat(val);} },
                    { field: 'refundQty', title: "售后份数", align: 'center', width: 80 },
                    { field: 'refundAmt', title: "售后总金额", align: 'center', width: 80 ,formatter: function (val) { return amountFormat(val);} },
                    { field: 'needPayAmt', title: "合计实付款", align: 'center', width: 80,formatter: function (val) { return amountFormat(val);} },
                    {
                        field: 'refundPerc', title: "售后占比", align: 'center', width: 70, formatter: function (val) {
                            var obj = parseFloat(val).toFixed(2);
                            if (obj == "NaN") {
                                return "";
                            } else {
                                return obj + "%";
                            }
                        }
                    },
                    { field: 'penaltyAmt', title: "供应商扣款", align: 'center', width: 80 ,formatter: function (val) { return amountFormat(val);} },
                    { field: 'penaltySub1Amt', title: "商品问题扣款", align: 'center', width: 100 ,formatter: function (val) { return amountFormat(val);} },
                    { field: 'penaltySub2Amt', title: "缺货/延迟配送扣款", align: 'center', width: 150,formatter: function (val) { return amountFormat(val);} },
                    { field: 'penaltySub3Amt', title: "爆款商品销量不达标扣款", align: 'center', width: 150,formatter: function (val) { return amountFormat(val);} },
                    { field: 'penaltySub4Amt', title: "其他扣款", align: 'center', width: 150,formatter: function (val) { return amountFormat(val);} }
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

function amountFormat(val) {
    if(val==null){
        return "";
    }
    return val.amount.toFixed(2);
}

function exportData(options){
    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var fileName = "供应商商品问题扣款_"+timeStr;
    var colNameMap = {
        "vendorCode": "供应商编码",
        "vendorName": "供应商名称",
        "sku": "商品编码",
        "productName": "商品名称",
        "tmActivity": "销售时间",
        "shipmentQty": "订货数量",
        "singleVendorAmt":"成本单价",
        "totalPayAmt":"合计应付款",
        "refundQty":"售后份数",
        "refundAmt":"售后总金额",
        "needPayAmt":"合计实付款",
        "refundPerc":"售后占比",
        "penaltyAmt":"供应商扣款",
        "penaltySub1Amt":"商品问题扣款",
        "penaltySub2Amt":"缺货/延迟配送扣款",
        "penaltySub3Amt":"爆款商品销量不达标扣款",
        "penaltySub4Amt":"其他扣款"
    };

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg :"正在导出数据，请稍候...",
        success: function (data) {
            if(data==null || data.length==0){
                window.top.$.messager.alert("温馨提示", "您要导出的报表为空!");
            }
            var list = data;
            if (list) {
                for (var i in list) {
                    if(list[i].singleVendorAmt == null){
                        list[i].singleVendorAmt = "";
                    }else{
                        list[i].singleVendorAmt = list[i].singleVendorAmt.amount.toFixed(2);
                    }
                    if(list[i].totalPayAmt == null){
                        list[i].totalPayAmt = "";
                    }else{
                        list[i].totalPayAmt = list[i].totalPayAmt.amount.toFixed(2);
                    }
                    if(list[i].refundAmt == null){
                        list[i].refundAmt = "";
                    }else{
                        list[i].refundAmt = list[i].refundAmt.amount.toFixed(2);
                    }
                    if(list[i].penaltyAmt == null){
                        list[i].penaltyAmt = "";
                    }else{
                        list[i].penaltyAmt = list[i].penaltyAmt.amount.toFixed(2);
                    }
                    if(list[i].needPayAmt == null){
                        list[i].needPayAmt = "";
                    }else{
                        list[i].needPayAmt = list[i].needPayAmt.amount.toFixed(2);
                    }
                    if(list[i].penaltySub1Amt == null){
                        list[i].penaltySub1Amt = "";
                    }else{
                        list[i].penaltySub1Amt = list[i].penaltySub1Amt.amount.toFixed(2);
                    }
                    if(list[i].penaltySub2Amt == null){
                        list[i].penaltySub2Amt = "";
                    }else{
                        list[i].penaltySub2Amt = list[i].penaltySub2Amt.amount.toFixed(2);
                    }
                    if(list[i].penaltySub3Amt == null){
                        list[i].penaltySub3Amt = "";
                    }else{
                        list[i].penaltySub3Amt = list[i].penaltySub3Amt.amount.toFixed(2);
                    }
                    if(list[i].penaltySub4Amt == null){
                        list[i].penaltySub4Amt = "";
                    }else{
                        list[i].penaltySub4Amt = list[i].penaltySub4Amt.amount.toFixed(2);
                    }
                    if(list[i].expiryDateStart != null && list[i].expiryDateEnd != null){
                        list[i].tmActivity = list[i].expiryDateStart.substring(0,10) + "~" + list[i].expiryDateEnd.substring(0,10);
                    }else{
                        list[i].tmActivity = "";
                    }
                    if(parseFloat(list[i].refundPerc).toFixed(2) == "NaN"){
                        list[i].refundPerc = "";
                    }else {
                        list[i].refundPerc = parseFloat(list[i].refundPerc).toFixed(2) + "%";
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}

$(function () {
    pageList.init();
});
