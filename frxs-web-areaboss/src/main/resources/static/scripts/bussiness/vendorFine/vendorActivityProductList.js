/// <reference path="../../plugin/XSLibrary/js/XSLibrary.debug.js" />
var pageList = {
    //绑定的数据列表
    grid: null,
    singleSelect : true,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "JoinInProductID",
            },
            body: $("#div1"),
            //导航选项
            nav: ["商品列表"],
            //搜索栏选项
            search: [
                {
                    text: "活动日期", type: "datetime", column: 2, attributes: {
                        id: 'tmBuyStart',
                        name: "tmBuyStart",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd'})"
                    }
                },
                {
                    text: " - ", type: "datetime", attributes: {
                        id: 'tmBuyEnd',
                        name: "tmBuyEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd'})"
                    }
                },
                { text: "商品名称", attributes: { name: "productName" } },
                { text: "商品编码", attributes: { name: "sku" } }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/vendorFine/getVendorActivityProductPageList?vendorId=" + (pageList.params.vendorid || 0),
                width: $(window).width() - 5,
                fitColumns: false,
                singleSelect: pageList.singleSelect,
                idField: 'productId',         //主键
                columns: [[
                    {field: 'productId', checkbox: true},
                    {field: 'tmBuyEnd', title: '活动时间', width: 270, formatter: function (value, rows) {
                            return xsjs.dateFormat(rows.tmBuyStart, "yyyy-MM-dd HH:mm:ss") + " - " + xsjs.dateFormat(rows.tmBuyEnd, "yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    { field: 'productName', title: '商品名称', width: 260 },
                    { field: 'sku', title: '商品编码', width: 70 },
                    { field: 'attrs', title: '规格', width: 80 , formatter: function (value) {
                            if(value!=null){
                                return value[0].attrVal;
                            }
                        } },
                    { field: 'packageQty', title: '包装数', width: 100 },
                    { field: 'vendorCode', title: '供应商编码', width: 100 },
                    { field: 'vendorName', title: '供应商名称', width: 150 },
                    { field: 'sortSeq', title: '商品排序', width: 70, sortable: true },
                    { field: 'saleAmt', title: '价格', width: 70 },
                    { field: 'marketAmt', title: '市场价', width: 70 },
                    { field: 'perServiceAmt', title: '平台服务费', width: 70 },
                    { field: 'perCommission', title: '每份提成', width: 70 },
                    { field: 'activityId', title: '活动ID', width: 70, hidden: 'true' },


                ]],
                onLoadSuccess: function (data) {

                },
                onDblClickRow: function (rowIndex, rowData) {
                    if (pageList.singleSelect == true) {
                        if (window.frameElement.apidata && typeof window.frameElement.apidata.callback == "function") {
                            window.frameElement.apidata.callback(rowData);
                            xsjs.pageClose();
                        }
                        else if (window.frameElement.apiOption && typeof window.frameElement.apiOption.callback == "function") {
                            window.frameElement.apiOption.callback(rowData);
                            xsjs.pageClose();
                        }
                    }
                }
            }
        };

        this.grid = xsjs.datagrid(options);
    },
    //刷新列表
    loadList: function () {
        document.body.options.reload();
    },
    ///选择商品
    selected: function () {
        var getSelections = pageList.grid.getGrid.datagrid("getSelections");

        if (getSelections == "" || getSelections.length == 0) {
            $.messager.alert("提示", "请选择商品信息!", "info");
            return;
        }

        if (window.frameElement.apidata && typeof window.frameElement.apidata.callback == "function") {
            window.frameElement.apidata.callback(pageList.singleSelect == true ? getSelections[0] : getSelections);
            xsjs.pageClose();
        }
        else if (window.frameElement.apiOption && typeof window.frameElement.apiOption.callback == "function") {
            window.frameElement.apiOption.callback(pageList.singleSelect == true ? getSelections[0] : getSelections);
            xsjs.pageClose();
        }
    }
};

$(function () {
    pageList.params = xsjs.SerializeURL2Json();
    if (pageList.params) {
        if (pageList.params.singleselect === "false") {
            pageList.singleSelect = false;
        }
    }
    else {
        pageList.params = {};
    }

    pageList.init();

    $("#btnSave").click(function () {
        pageList.selected();
    });
});