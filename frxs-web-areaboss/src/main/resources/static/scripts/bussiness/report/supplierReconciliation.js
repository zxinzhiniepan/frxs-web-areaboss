var yesterdayDate = xsjs.dateFormat(new Date());
var newDate = xsjs.dateFormat(new Date());
var isExport = null;

var toolbarArray = new Array();

$(function () {
    isExport = XSLibray.authorize(298, 299);
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+"/report/exportProductSaleCollectList"   //必填  下载地址
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
                kid: "RowIndex"
            },
            //导航选项
            nav: ["报表管理", "供应商对账表"],
            onSearchVerify: function () {
                var expiryDateStart = $("#txtExpiryDateStart");
                var expiryDateEnd = $("#txtExpiryDateEnd");

                if ($.trim(expiryDateStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择下单开始日期", "info", function () {
                        expiryDateStart.focus();
                    });
                    return false;
                }

                if ($.trim(expiryDateEnd.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择下单结束日期", "info", function () {
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
                    text: "<span style='color: red;'>*</span>下单时间", type: "date", attributes: {
                        id: 'txtExpiryDateStart',
                        name: "expiryDateStart",
                        value: yesterdayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;", type: "date", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "expiryDateEnd",
                        value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txtExpiryDateStart\\\')}'})"
                    }
                },
                { text: "商品编码", attributes: { name: "sku" } },
                 { type: "<br/>" },
                { text: "<span style='color: #fff;'>*</span>商品名称", attributes: { name: "productName" }, column: 2 },
                { text: "&nbsp;供应商编码：&nbsp;", attributes: { name: "vendorCode" } },
                { text: "供应商", attributes: { name: "vendorName" } },


            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/report/getProductSaleCollectList",
                fitColumns: false,
                idField: 'RowIndex',         //主键
                //singleSelect: true,
                showFooter: true,
                columns: [[
                    { field: 'expiryDateStart', title: '活动日期', align: 'center', halign: "center", width: 160, formatter:function (value, rows) {
                        if(rows.expiryDateStart!=null&&rows.expiryDateEnd!=null&&(xsjs.dateFormat(rows.expiryDateStart) == xsjs.dateFormat(rows.expiryDateEnd))){
                            return xsjs.dateFormat(value,"yyyy-MM-dd")
                        }else if(rows.expiryDateStart!=null&&rows.expiryDateEnd!=null){
                            return xsjs.dateFormat(value,"yyyy-MM-dd") + " 至 " + xsjs.dateFormat(rows.expiryDateEnd,"yyyy-MM-dd");
                        }} },
                    { field: 'sku', title: '商品编码', align: 'center', halign: "center", width: 80},
                    { field: 'productName', title: '商品名称', align: 'left',  width: 260, formatter: XSLibray.formatText },
                    { field: 'vendorName', title: '供应商', align: 'left', width: 220, formatter: XSLibray.formatText },
                    { field: 'vendorCode', title: '供应商编码', align: 'center', width: 120 },
                    { field: 'qty', title: '配送量', width: 80, align: 'right' },
                    { field: 'price', title: '配送价', dataType: "money", width: 60, align: 'right' },
                    { field: 'commission', title: '每份门店提成', dataType: "money", width: 90, align: 'right' },
                    { field: 'serviceCharge', title: '平台服务费(份)', dataType: "money", width: 90, align: 'right' },
                    { field: 'totalPrice', title: '配送金额', dataType: "money", width: 90, align: 'right' },
                    { field: 'totalCommission', title: '门店提成', dataType: "money", width: 90, align: 'right' },
                    { field: 'totalServiceCharge', title: '平台服务费', dataType: "money", width: 90, align: 'right' },
                    { field: 'totalSupplyPrice', title: '应付供应商', dataType: "money", width: 90, align: 'right' }
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
    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var colNameMap = {
        "expiryDateStart": "活动日期",
        "sku": "商品编码",
        "productName": "商品名称",
        "vendorName": "供应商",
        "vendorCode": "供应商编码",
        "qty": "配送量",
        "price": "配送价",
        "commission": "每份门店提成",
        "serviceCharge": "平台服务费(份)",
        "totalPrice": "配送金额",
        "totalCommission": "门店提成",
        "totalServiceCharge": "平台服务费",
        "totalSupplyPrice": "应付供应商"
    };

    var fileName = "供应商对账单_"+timeStr;

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg: "正在导出数据，请稍候...",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    if(list[i].expiryDateStart!=null&&list[i].expiryDateEnd!=null&&(xsjs.dateFormat(list[i].expiryDateStart) == xsjs.dateFormat(list[i].expiryDateEnd))){
                        list[i].expiryDateStart = xsjs.dateFormat(list[i].expiryDateStart,"yyyy-MM-dd")
                    }else if(list[i].expiryDateStart!=null&&list[i].expiryDateEnd!=null){
                        list[i].expiryDateStart = xsjs.dateFormat(list[i].expiryDateStart,"yyyy-MM-dd")+'至'+xsjs.dateFormat(list[i].expiryDateEnd,"yyyy-MM-dd") ;
                    }
                    if(list[i].totalSupplyPrice!=null){
                        list[i].totalSupplyPrice = toDecimal(list[i].totalSupplyPrice);
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}

function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x*100)/100;
    return f;
}