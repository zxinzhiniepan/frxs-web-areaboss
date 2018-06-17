var todayDate = xsjs.dateFormat((new Date().getTime()), "yyyy-MM-dd");
var toolbarArray = new Array();

var rows =null;
rows = JSON.parse(localStorage.getItem("rows"));
/*toolbarArray.push({
    action: "导出",             //必填（导出 或 export）
    url: contextPath+"/store/exportUsersSaleasPageList"   //必填  下载地址
});*/
toolbarArray.push({
    text: "导出",             //必填（导出 或 export）
    iconCls: "icon-excel",
    handler: function () {
        exportExcel();
    }
});

toolbarArray.push({
    text: '打印',
    iconCls: 'icon-print',
    handler: function () {
        var url = contextPath+"/store/printAspnetUsersDistribution?" + pageList.grid.getSearch();
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            window.open(url);
        }
        else {
            $("<div style='width: 0px; height:0px;'><iframe style='width:0px;height:0px;border:0px' src='" + url + "'/></div>").appendTo("body");
        }
    }
});

// toolbarArray.push({
//     text: "查看指定提货日期有多条配送线路的门店列表",
//     iconCls: "icon-search",
//     handler: function () {
//         xsjs.window({
//             title: "查看指定提货日期有多条配送线路的门店列表",
//             owdoc: window.top,
//             url: contextPath+"/operationArea/storeLine",
//             width: 980,
//             modal: true
//         });
//     }
// });

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
            nav: ["仓库管理", "门店消费者订单"],
            onSearchVerify: function () {
                var expiryDateStart = $("#txtExpiryDateStart");

                if ($.trim(expiryDateStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择提货开始时间", "info", function () {
                        expiryDateStart.focus();
                    });
                    return false;
                }
                return true;
            },
            onSearchReset: function () {
                $("#txtExpiryDateStart").val(todayDate);
            },
            //搜索栏选项
            search: [
                {
                    text: "<span style='color: red;'>*</span>提货时间", type: "date", attributes: {
                        id: 'txtExpiryDateStart',
                        name: "deliveryStart",
                        value: todayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd'})"
                    }
                },
                { text: "商品名称", attributes: { name: "itemDescription" } },
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
                    text: "配送线路", type: "select", attributes: { name: "lineId" },
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
                },{ text: "仓库", type: "warehouse",
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
                url: contextPath+"/store/getUsersSaleasPageList",
                fitColumns: false,
                idField: 'rowIndex',         //主键
                //singleSelect: true,
                showFooter: true,
                columns: [[
                    //{ field: 'RowIndex', checkbox: true },

                    { field: 'storeName', title: '门店名称', align: 'left', width: 200, formatter: XSLibray.formatText },
                    { field: 'storeNo', title: '门店编号', align: 'center', width: 60 },
                    { field: 'wareHouseName', title: '配送仓库', align: 'center', halign: "center", width: 80 },
                    { field: 'lineName', title: '配送线路',  halign: "center", width: 260, align: 'center' },
                    {
                        field: 'deliveryTime', title: '提货时间', align: 'center', halign: "center", width: 100, formatter: function (val) {
                            return XSLibray.dateFormat(val);
                        }
                    },
                    { field: 'billOfLading', title: '提货单号', align: 'center', halign: "center", width: 120 },
                    { field: 'wechatName', title: '昵称', align: 'center', halign: "center", width: 150 ,formatter: function (value, row, index) {
                            if (row.isValetOrder != undefined) {
                                if (row.isValetOrder == true) {
                                    value = "门店老板";
                                } else {
                                    value = row.wechatName;
                                }
                                return value;
                            }
                        }
                    },
                    { field: 'phone', title: '手机号', align: 'center', halign: "center", width: 110 },
                    { field: 'productName', title: '商品名称', align: 'left', halign: "center", width: 260, formatter: XSLibray.formatText },
                    { field: 'qty', title: '订货数量', align: 'right', halign: "center", width: 80 },
                    //{ field: 'Qty', title: '缺货数量', align: 'right', halign: "center", width: 80 },
                    //{ field: 'DQty', title: '配货数量', align: 'right', halign: "center", width: 80 },
                    { field: 'isValetOrder', title: '是否为代客下单', width: 100, align: 'center',formatter: function (value, row, index) {
                            if (value != undefined) {
                                if (row.isValetOrder == true) {
                                    value = row.receiver;
                                } else {
                                    value = "否";
                                }
                                return value;
                            }
                        }
                    }
                    // { field: 'valetOrderStr', title: '是否代客下单', align: 'center', halign: "center", width: 80 },

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
        url: contextPath+"/store/createUsersSaleasExcel",
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
        "storeName": "门店名称",
        "storeNo": "门店编号",
        "lineName": "配送线路",
        "wareHouseName": "配送仓库",
        "deliveryTime": "提货时间",
        "billOfLading": "提货单号",
        "wechatName": "昵称",
        "phone": "手机号",
        "productName": "商品名称",
        "qty": "订货数量",
        "isValetOrder": "是否为代客下单"
    };

    var fileName = "门店消费者订单_"+xsjs.dateFormat(new Date().getTime(), "yyyyMMdd");

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg: "正在导出数据，请稍候...",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    if (list[i].isValetOrder == true) {
                        list[i].isValetOrder = list[i].receiver;
                        list[i].wechatName = "门店老板";

                    } else if(list[i].isValetOrder == false ){
                        list[i].isValetOrder = "否";
                    }else{
                        list[i].isValetOrder = "";
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}*/
