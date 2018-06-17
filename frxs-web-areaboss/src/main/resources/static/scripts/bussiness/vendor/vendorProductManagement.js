var toolbarArray = new Array();
var isDelete = null;
var isAudit = null;
var isExport = null;

$(function () {
    isDelete = XSLibray.authorize(86, 211);
    isAudit = XSLibray.authorize(86, 213);
    isExport = XSLibray.authorize(86, 212);
    if(isDelete){
        toolbarArray.push("删除");
    }
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+"/vendor/vendorProductsExport"   //必填  下载地址
        });
    }
});

function actionLink(value, rows) {

    var actionUrl = "";
    if (rows.auditStatus == "PENDING") {
        if(isAudit){
            actionUrl = "<a onclick='pageList.showProductInfo(" + rows.vendorProductDataId + ",event)'>审核</a>";
        }
    } else {
        actionUrl = "<a onclick='pageList.showProductInfo(" + rows.vendorProductDataId + ",event)'>查看</a>";
    }
    return actionUrl;
}

var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "vendorProductDataId",
                del: contextPath+"/vendor/vendorProductsDelete"
            },
            edit: {

            },
            onSearchReset: function () {
                //$("#txtDateStart").val(yesterdayDate);
                //$("#txtExpiryDateEnd").val(newDate);
            },
            //导航选项
            //nav: ["首页", "选择供应商"],
            //搜索栏选项
            search: [
                { text: "供应商名称", attributes: { name: "vendorName" } },
                { text: "供应商编码", attributes: { name: "vendorCode" } },
                { text: "商品名称", attributes: { name: "vendorProductName" } },

                { type: "<br/>" },
                //{ text: "&nbsp;提交时间", type: "datetime", attributes: { name: "DateStart" }, column: 2 },
                //{ text: "&nbsp;&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;&nbsp;", type: "datetime", attributes: { name: "DateEnd" } },

                {
                    text: "&nbsp提交时间", type: "date", attributes: {
                        id: 'txtDateStart',
                        name: "tmPublishStart",
                        // value: yesterdayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;&nbsp;", type: "date", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "tmPublishEnd",
                        // value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'#F{$dp.$D(\\\'txtDateStart\\\')}'})"
                    }
                },
                {
                    text: "审核状态", type: "select", attributes: { name: "auditStatus" },
                    option: [
                        { text: "全部", value: "" },
                        { text: "通过", value: "PASS" },
                        { text: "驳回", value: "REJECT" },
                        { text: "未审核", value: "PENDING" }
                    ]
                }

            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/vendor/getVendorProductsPageList",
                fitColumns: false,
                idField: 'vendorProductDataId',         //主键
                //singleSelect: true,
                columns: [[
                    { field: 'vendorProductDataId', checkbox: true },
                    {
                        field: 'tmPublish', title: '提交时间', width: 150, align: 'center', formatter: function (value) {
                            return value;
                        }
                    },
                    { field: 'vendorCode', title: '供应商编码', width: 100, align: 'center' },
                    { field: 'vendorName', title: '供应商名称', width: 160, align: 'left', formatter: XSLibray.formatText },
                    { field: 'vendorProductName', title: '商品名称', align: 'left', width: 200, formatter: XSLibray.formatText },
                    { field: 'specType', title: '商品型号', align: 'center', width: 80 ,formatter:function (value) {
                            if(value == "SINGLE"){
                                return "<span >" + '单规格' + "</span>"
                            };
                            if(value == "MULTI"){
                                return "<span >" + '多规格' + "</span>"
                            };
                        }},
                    {
                        field: 'auditStatus', title: '审核状态', align: 'center', width: 80, formatter: function (value) {
                            if (value == "REJECT") {
                                return "<span style='color:#f00'>" + '驳回' + "</span>"
                            };
                            if (value == "PASS") {
                                return "<span style='color:#006600'>" + '通过' + "</span>"
                            };
                            if (value == "PENDING") {
                                return "<span>" + '待审核' + "</span>"
                            };
                        }
                    },
                    { field: 'auditUserName', title: '审核人', align: 'center', width: 100 },
                    {
                        field: 'datagrid-action', title: '操作', align: 'center', width: 80, formatter: function (value, rows) {
                            return actionLink(value, rows);
                        }
                    }
                ]],
                onLoadSuccess: function (data) {
                    $(data.rows).each(function () {
                        if (this.auditStatus != "PASS") {
                            var accountRow = $(".datagrid-body").find("input[name='vendorProductDataId'][type='checkbox'][value='" + this.vendorProductDataId + "']");
                            accountRow.remove();
                        }
                    });
                },
                // xsTdAction: xsTdAction
            },
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    showProductInfo: function (id, evt) {
        xsjs.stopPropagation(evt);
        var url = contextPath+"/vendor/vendorProductsDetails?vendorProductDataId=" + id;

        xsjs.window({
            url: url,
            title: "供应商商品详情",
            modal: true,
            width: 600,
            minHeight: 360,
            maxHeight: 550,
            owdoc: window.top
        });
    }
};

$(function () {
    pageList.init();
});

function exportData(options){
    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var colNameMap = {
        "tmPublish": "提交时间",
        "vendorCode": "供应商编码",
        "vendorName": "供应商名称",
        "vendorProductName": "商品名称",
        "specType": "商品型号",
        "auditStatus": "审核状态",
        "auditUserName": "审核人"
    };

    var fileName = "供应商商品列表_"+timeStr;

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg: "正在导出数据，请稍候...",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    if(list[i].specType=="SINGLE"){
                        list[i].specType = "单规格";
                    }else if(list[i].specType=="MULTI"){
                        list[i].specType = "多规格";
                    }
                    if(list[i].auditStatus=="PENDING"){
                        list[i].auditStatus = "待审核";
                    }else if(list[i].auditStatus=="PASS"){
                        list[i].auditStatus = "审核通过";
                    }else if(list[i].auditStatus=="REJECT"){
                        list[i].auditStatus = "驳回";
                    }else if(list[i].auditStatus=="DRAFT"){
                        list[i].auditStatus = "草稿";
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}