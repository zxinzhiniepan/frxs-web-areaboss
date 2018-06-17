var toolbarArray = new Array();
var isExport = null;
$(function(){
    // isExport = XSLibray.authorize(59, 150);
    isExport = true;
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+ "/report/exportStoreSaleasStatistics"   //必填  下载地址
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
                kid: "storeNo"
            },
            //导航选项
            nav: ["报表管理", "门店累计配送报表"],
            onSearchVerify: function () {
                var expiryDateStart = $("#beginPayDate");
                var expiryDateEnd = $("#endPayDate");
                if ($.trim(expiryDateStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择订单起始付款日期", "info", function () {
                        expiryDateStart.focus();
                    });
                    return false;
                }
                if ($.trim(expiryDateEnd.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择订单截止付款日期", "info", function () {
                        expiryDateEnd.focus();
                    });
                    return false;
                }
                return true;
            },
            edit: {},
            //搜索栏选项
            search: [
                { text: "订单付款日期", type: "date", attributes: { name: "beginPayDate", id: "beginPayDate", value: getWeekStartDate() }, column: 2 },
                { text: " 至 ", type: "date", attributes: { name: "endPayDate", id: "endPayDate", value: getWeekEndDate() } },
                { text: "　　门店编号", attributes: { name: "storeNo" } },
                { text: "门店名称", attributes: { name: "storeName" } },
                { type: "<br>" },
                { text: "门店上线日期", type: "date", attributes: { name: "beginCreateTime" }, column: 2 },
                { text: " 至 ", type: "date", attributes: { name: "endCreateTime" } },
                { text: "门店开发人员", attributes: { name: "storeDeveloper" } },
                { text: "所属仓库", type: "warehouse",
                    attributes: {
                        name: "warehouseIds",
                        id: "txtListWarehouse",
                        width :140,
                        editable: false
                    },
                    data: {
                        url: contextPath + "/storeProfile/getWarehouselist",
                        valueField: "wareHouseId",
                        textField: "wareHouseName"
                    }
                },
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
                url: contextPath+ "/report/storeSaleasStatistics",
                fitColumns: false,
                idField: 'storeNo',         //主键
                singleSelect: true,
                showFooter: true,
                columns: [[
                    { field: 'wareHouseName', title: '仓库', width: 100, align: 'center' },
                    { field: 'storeNo', title: '门店编号', width: 80, align: 'center' },
                    {
                        field: 'storeName', title: '门店名称', width: 200, align: 'left', formatter: function (value, rowData, rowIndex) {
                            if ($.trim(value)) {
                                return "<a href='javascript:void(0);' class='gridHref' onclick=\"pageList.openOrderDetails('" + rowData.storeNo + "', event)\">" + value + "</a>";
                            }
                            else {
                                return "";
                            }
                        }
                    },
                    { field: 'storeTel', title: '联系电话', width: 100, align: 'center' },
                    { field: 'storeAddress', title: '地址', width: 240, align: 'left', formatter: XSLibray.formatText },
                    { field: 'createTime', title: '门店上线日期', width: 100, align: 'center' },
                    { field: 'lineName', title: '线路', width: 200, align: 'left' },
                    { field: 'storeDeveloper', title: '门店开发人员', width: 100, align: 'center' },
                    { field: 'totalOrderNumber', title: '合计订单量', width: 80, align: 'right' },
                    { field: 'qty', title: '合计订货量', width: 80, align: 'right' },
                    { field: 'sumSalePrice', title: '配送金额', dataType: "money", width: 80, align: 'right' },
                    { field: 'totalCommission', title: '合计提成', dataType: "money", width: 80, align: 'right' },
                    { field: 'newsMembers', title: '新增会员', width: 60, align: 'right' },
                    { field: 'allMembers', title: '累计会员', width: 60, align: 'right' }
                ]],
                onDblClickRow: function (index, row) {
                    pageList.openOrderDetails(row.storeNo);
                }
            },
            toolbar: toolbarArray
        };
        this.grid = xsjs.datagrid(options);
    },
    //打开订单详情
    openOrderDetails: function (storeNo, evt) {
        if (evt) {
            xsjs.stopPropagation(evt);
        }

        var getData = pageList.grid.getGrid.datagrid("getRows");
        var row = $.grep(getData, function (item, index) {
            return item.storeNo == storeNo
        })[0];

        xsjs.addTabs({
            title: row.storeName + " - 门店销量明细表",
            url: contextPath+ "/report/storeSaleasOrderDetails",
            data: {
                row: row,
                search: pageList.grid.getSearchJson()
            }
        });
    }
};

$(function () {
    pageList.init();
});

var now = new Date(); //当前日期 
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; // 

//格局化日期：yyyy-MM-dd 
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
}


//获得本周的开端日期 
function getWeekStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return formatDate(weekStartDate);
}

//获得本周的停止日期 
function getWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return formatDate(weekEndDate);
}

//获得某月的天数 
function getMonthDays(myMonth) {
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}

function exportData(options){

    var colNameMap = {
        "wareHouseName": "仓库",
        "storeNo": "门店编号",
        "storeName": "门店名称",
        "storeTel": "联系电话",
        "storeAddress": "地址",
        "createTime": "门店上线日期",
        "lineName": "线路",
        "storeDeveloper": "门店开发人员",
        "totalOrderNumber": "合计订单量",
        "qty": "合计订货量",
        "sumSalePrice": "配送金额",
        "totalCommission": "合计提成",
        "newsMembers": "新增会员",
        "allMembers": "累计会员"
    };

    var fileName = "门店累计配送统计报表导出_"+xsjs.dateFormat(new Date().getTime(), "yyyyMMdd");

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg: "正在导出数据，请稍候...",
        success: function (data) {
            var list = data;
            if (list) {
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}

