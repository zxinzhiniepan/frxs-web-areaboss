/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */
var yesterdayDate = xsjs.dateFormat((new Date(new Date().getTime()- (24 * 60 * 60 * 1000))).getTime(), "yyyy-MM-dd");
var newDate = xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd");
var toolbarArray = new Array();
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
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
            nav: ["仓库管理", "查看指定提货日期有多条配送线路的门店列表"],
            onSearchVerify: function () {
                var expiryDateStart = $("#txtExpiryDateStart");

                if ($.trim(expiryDateStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择提货日期", "info", function () {
                        expiryDateStart.focus();
                    });
                    return false;
                }
                return true;
            },
            onSearchReset: function () {
                $("#txtExpiryDateStart").val(yesterdayDate);
            },
            //搜索栏选项
            search: [
                {
                    text: "<span style='color: red;'>*</span>提货日期", type: "date", attributes: {
                        id: 'txtExpiryDateStart',
                        name: "deliveryTimeStart",
                        value: yesterdayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd'})"
                    }
                },
                { text: "门店编号", attributes: { name: "storeNO" } },
                { text: "门店名称", attributes: { name: "storeName" } }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/store/getUsersSaleasPageList",
                fitColumns: false,
                idField: 'RowIndex',         //主键
                pagination: false,
                columns: [[
                    { field: 'deliveryTime', title: '提货日期', align: 'left', halign: "center", width: 100, dataType: "date" },
                    { field: 'storeName', title: '门店名称', align: 'left', halign: "center", width: 200 },
                    { field: 'storeNO', title: '门店编号', align: 'center', halign: "center", width: 60 },
                    { field: 'lineName', title: '配送线路', align: 'center', halign: "center", width: 160 },
                    {
                        field: 'datagrid-action', title: '操作', align: 'center', width: 360, formatter: function (value, rowData) {
                            var deliveryTime = xsjs.dateFormat(rowData.DeliveryTime, "yyyy年M月d日");
                            var btnValue = "是否将门店【<span style=\"color: red;\">" + rowData.StoreName + "</span>】<span style=\"color: red;\">" + deliveryTime + "</span>的配送线路修改成【<span style=\"color: red;\">" + rowData.LineName + "</span>】？";
                            btnValue = encodeURIComponent(btnValue);
                            return "<a href='javascript:void(0);' onclick=\"pageList.updateStoreLineName(" + rowData.StoreID + ", " + rowData.LineID + ", '" + rowData.DeliveryTime + "'," + rowData.LineSort + ", '" + btnValue + "', event)\">修改配送线路为“<span style='color:red;'>" + rowData.LineName + "</span>”</a>";
                        }
                    }
                ]],
                //xsTdAction: xsTdAction
            },
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    updateStoreLineName: function (storeId, lineId, deliveryTime,lineSort, btnValue, evt) {
        xsjs.stopPropagation(evt);
        window.top.$.messager.confirm("温馨提示", decodeURIComponent(btnValue), function (data) {
            if (data) {
                xsjs.ajax({
                    url: contextPath+"/OperationArea/UpdateStoreLineName",
                    loadMsg: "正在处理，请稍待。。。",
                    data: {
                        storeID: storeID,
                        lineID: lineID,
                        deliveryTime: xsjs.dateFormat(deliveryTime),
                        lineSort :lineSort
                    },
                    success: function (data) {
                        if (data != null && data.Data) {
                            window.top.$.messager.alert("温馨提示", "修改成功.", "info", function () {
                                //pageList.grid.reload();
                                window.frameElement.wapi.pageList.loadList();
                                xsjs.pageClose();
                            });
                        } else {
                            window.top.$.messager.alert("温馨提示", "修改失败.", "error", null)
                        }
                    }
                });
            }
        });
    }
};

$(function () {
    pageList.init();
});