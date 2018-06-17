var todayDate = xsjs.dateFormat((new Date(new Date().getTime())).getTime(), "yyyy-MM-dd");
var newDate = xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd");
var toolbarArray = new Array();


// toolbarArray.push({
//     action: "导出",             //必填（导出 或 export）
//     url: contextPath +"/store/exportUsersLinePageList"   //必填  下载地址
//
//
// });

toolbarArray.push({
    text: "导出",             //必填（导出 或 export）
    iconCls: "icon-excel",
    handler: function () {
        exportExcel();
    }
});


toolbarArray.push({
    text: '按配送线路导出(样式1)',
    iconCls: 'icon-excel',
    handler: function () {
        var warehouse = $("input[name='warehouseIds']");
        var i = 0;
        for(var a in warehouse){
            if(warehouse[a].checked){
                i += 1;
            }
        }
        if (i == 0) {
            window.top.$.messager.alert("温馨提示", "请选择要需要查询的仓库!");
            return false;
        }else if(i >= 2){
            window.top.$.messager.alert("温馨提示", "不能选择多个仓库!");
            return false;
        }

        exportExcelLineOne();

    }
});


toolbarArray.push({
    text: '按配送线路导出(样式2)',
    iconCls: 'icon-excel',
    handler: function () {
        var warehouse = $("input[name='warehouseIds']");
        var i = 0;
        for(var a in warehouse){
            if(warehouse[a].checked){
                i += 1;
            }
        }
        if (i == 0) {
            window.top.$.messager.alert("温馨提示", "请选择要需要查询的仓库!");
            return false;
        }else if(i >= 2){
            window.top.$.messager.alert("温馨提示", "不能选择多个仓库!");
            return false;
        }

        exportExcelLineTwo();
    }
});


toolbarArray.push({text: '打印', iconCls: 'icon-print', handler: function () {
        var url = contextPath+"/store/printAspnetUsersLine?" + pageList.grid.getSearch();
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            window.open(url);
        }
        else {
            $("<div style='width: 0px; height:0px;'><iframe style='width:0px;height:0px;border:0px' src='" + url + "'/></div>").appendTo("body");
        }
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
            nav: ["仓库管理", "送货线路商品汇总表"],
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
                    text: "<span style='color: red;'>*</span>&nbsp;提货时间", type: "date", attributes: {
                        id: 'txtExpiryDateStart',
                        name: "deliveryTimeStart",
                        value: todayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd'})"
                    }
                },
                { text: "商品名称", attributes: { name: "productName" } },
                { text: "门店编号", attributes: { name: "storeNo" } },
                { type: "<br/>" },
                { text: "<span style='color: #fff;'>o</span>门店名称", attributes: { name: "StoreName" } },
                {
                    text: "门店状态", type: "select", attributes: { name: "ShopStatus" }, option: [
                        { value: "", text: "--全部--" },
                        { value: "1", text: "正常" },
                        { value: "2", text: "冻结" },
                        { value: "3", text: "已删除" }
                    ]
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
                url: contextPath+"/store/getUsersLinePageList",
                fitColumns: false,
                idField: 'RowIndex',         //主键
                //singleSelect: true,
                showFooter: true,
                columns: [[
                    //{ field: 'RowIndex', checkbox: true },

                    { field: 'storeName', title: '门店名称', align: 'left', halign: "center", width: 200, formatter: XSLibray.formatText },
                    { field: 'storeNo', title: '门店编号', align: 'center', halign: "center", width: 80 },
                    {
                        field: 'deliveryTime', title: '提货时间', align: 'center', halign: "center", width: 100, formatter: function (val) {
                            return xsjs.dateFormat(val);
                        }
                    },
                    { field: 'productName', title: '商品名称', align: 'left', halign: "center", width: 260, formatter: XSLibray.formatText },
                    { field: 'qty', title: '订货数量', align: 'right', halign: "center", width: 80 },
                    { field: 'lineName', title: '配送线路', align: 'center', halign: "center", width: 260 },
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

function exportData(options){

    var colNameMap = {
        "storeName": "门店名称",
        "storeNo": "门店编号",
        "deliveryTime": "提货时间",
        "productName": "商品名称",
        "qty": "订货数量",
        "lineName": "配送线路",
        "wareHouseName": "配送仓库"
    };

    var fileName = "送货线路商品汇总_"+xsjs.dateFormat(new Date().getTime(), "yyyyMMdd");

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg:"正在导出数据，请稍后...",
        success: function (data) {
            var list = data;
            if (list) {
                var colNameMapNe  = {};
                for (var i in list) {
                    if (list[i].deliveryTime != null) {
                        list[i].deliveryTime = xsjs.dateFormat(list[i].deliveryTime, "yyyy-MM-dd");
                    }
                }

                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}

function exportExcel(options) {
    xsjs.ajax({
        url: contextPath+"/store/exportUsersLinePageListExcel",
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

function exportExcelLineOne(options) {
    xsjs.ajax({
        url: contextPath+"/store/downloadUserStoresLineExcel",
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

function exportExcelLineTwo(options) {

    xsjs.ajax({
        url: contextPath+"/store/downloadStoreUsersLineExcel",
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