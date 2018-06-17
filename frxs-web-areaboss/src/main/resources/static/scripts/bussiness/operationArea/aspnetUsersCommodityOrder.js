// var yesterdayDate = xsjs.dateFormat((new Date(new Date().getTime()- (24 * 60 * 60 * 1000))).getTime(), "yyyy-MM-dd HH:mm");
var yesterdayDate = xsjs.dateFormat((new Date(new Date().getTime()- (24 * 60 * 60 * 1000))).getTime(), "yyyy-MM-dd");
var newDate = xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd");
var toolbarArray = new Array();


var rows =null;
rows = JSON.parse(localStorage.getItem("rows"));
/*toolbarArray.push({
    action: "导出",             //必填（导出 或 export）
    url: contextPath+"/store/exportUsersCommodityOrderPageList"   //必填  下载地址
});*/
toolbarArray.push({
    text: "导出",             //必填（导出 或 export）
    iconCls: "icon-excel",
    handler: function () {
        exportExcel();
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
            nav: ["仓库管理", "商品订购查询"],
            onSearchVerify: function () {
                var expiryDateStart = $("#txtExpiryDateStart");
                var expiryDateEnd = $("#txtExpiryDateEnd");

                if ($.trim(expiryDateStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择提货开始时间", "info", function () {
                        expiryDateStart.focus();
                    });
                    return false;
                }
                if ($.trim(expiryDateEnd.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择提货截止日期", "info", function () {
                        expiryDateEnd.focus();
                    });
                    return false;
                }

                return true;
            },
            onSearchReset: function () {
                $("#txtExpiryDateStart").val(newDate);
                $("#txtExpiryDateEnd").val(newDate);

            },
            //搜索栏选项
            search: [
                {
                    text: "<span style='color: red;'>*</span>&nbsp;提货日期", type: "datetime", column: 2, attributes: {
                        id: 'txtExpiryDateStart',
                        name: "deliveryTimeStart",
                        value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})"
                    }
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", type: "datetime", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "deliveryTimeEnd",
                        value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txtExpiryDateStart\\\')}'})"
                    }
                },
                { text: "&nbsp;&nbsp;商品名称", attributes: { name: "productName" } },
                { text: "门店编号", attributes: { name: "storeNo" } },
                { type: "<br/>" },
                { text: "<span style='color: #fff;'>o</span>门店名称", attributes: { name: "storeName" } },
                {
                    text: "门店状态", type: "select", attributes: { name: "shopStatus" }, option: [
                        { value: "", text: "--全部--" },
                        { value: "1", text: "正常" },
                        { value: "2", text: "冻结" },
                        { value: "3", text: "已删除" }
                    ]
                },
                {
                    text: "&nbsp;&nbsp;配送线路", type: "select", attributes: { name: "lineId" },
                    data: {
                        url: contextPath + "/distributionLine/listDistributionLineByWarehouseId",
                        data: {
                            IsLock: 0
                        },
                        valueField: "id",
                        textField: "lineName",
                        emptyOption: {
                            value: "0",
                            text: "--全部--"
                        }
                    }
                },
                { text: "仓库", type: "warehouse",
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
                }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/store/getUsersCommodityOrderPageList",
                fitColumns: false,
                idField: 'rowIndex',         //主键
                //singleSelect: true,
                showFooter: true,
                columns: [[
                    //{ field: 'RowIndex', checkbox: true },
                    { field: 'productName', title: '商品名称', align: 'left', halign: "left", width: 260, formatter: XSLibray.formatText },
                    { field: 'skuContent', title: '规格', align: 'center', halign: "center", width: 80 },
                    { field: 'packingNumber', title: '包装数', align: 'right', halign: "right", width: 80 },
                    { field: 'qty', title: '订货数量', align: 'right', halign: "right", width: 80 },
                    { field: 'totalQty', title: '总数量', align: 'right', halign: "right", width: 80 },
                    { field: 'storeNo', title: '门店编号', align: 'center', halign: "center", width: 80 },
                    { field: 'storeName', title: '门店名称', align: 'left', halign: "left", width: 240, formatter: XSLibray.formatText },
                    {
                        field: 'deliveryTime', title: '提货时间', align: 'center', halign: "center", width: 100, formatter: function (val) {
                            return XSLibray.dateFormat(val);
                        }
                    },
                    { field: 'wareHouseName', title: '配送仓库', align: 'center', halign: "center", width: 120 }
                ]],
                //xsTdAction: xsTdAction
            },
            onSearchVerify: function () {
                var warehouse = $("input[name='warehouseIds']").is(":checked");
                if (warehouse) {
                    return true;
                }
                else {
                    window.top.$.messager.alert("温馨提示", "请选择要需要查询的仓库!");
                    return false;
                }
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

function exportExcel() {
    xsjs.ajax({
        url: contextPath+"/store/createUsersCommodityOrderExcel",
        data: pageList.grid.getSearch(),
        type: "POST",
        loadMsg: "正在下载，请稍候...",
        success: function (data) {
            //
            if (data.rspCode == "success" ) {
                var fileName = encodeURI(data.record);
                setTimeout(function () {
                    window.location.href = contextPath+"/store/exportExcel?fileName="+ fileName;
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

/*
function exportData(options){

    var colNameMap = {
        "itemDescription": "商品名称",
        "skuContent": "规格",
        "packingNumber": "包装数",
        "qty": "订货数量",
        "totalQty": "总数量",
        "storeNo": "门店编号",
        "storeName": "门店名称",
        "deliveryTime": "提货时间",
        "wareHouseName": "配送仓库"
    };

    var fileName = "商品订购列表_"+xsjs.dateFormat(new Date().getTime(), "yyyyMMdd");

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
}*/
