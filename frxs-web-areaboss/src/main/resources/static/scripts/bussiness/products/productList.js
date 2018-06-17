var toolbarArray = new Array();
var xsTdAction = new Array();
var isDelete = null;
var isEdit = null;
var isUpselling = null;

$(function () {
    isEdit = XSLibray.authorize(94, 142);
    isDelete = XSLibray.authorize(94, 251);
    isUpselling = XSLibray.authorize(94, 143);
    if(isDelete){
        toolbarArray.push("删除");
        xsTdAction.push("删除");
    }
});

var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "productId",
                delParamName: "ids",
                del: contextPath+"/products/productDelete"
            },
            //导航选项
            nav: ["商品管理"],
            //搜索栏选项
            search: [
                { text: "商品名称", attributes: { name: "productName" } },
                { text: "商品编码", attributes: { name: "sku", maxlength: "8" }, option: { min: 0, max: 999999999999999 } },
                { text: "品牌", attributes: { name: "brandName" } },
                {
                    text: "上下架状态", type: "select", attributes: { name: "skuStatus" },
                    option: [
                        { text: "全部", value: "" },
                        { text: "上架", value: "UP" },
                        { text: "下架", value: "DOWN" }
                    ]
                }
            ],
            //数据列表选项
            datagrid: {
                pageSize: 10,
                url: contextPath+"/products/getPageList",
                fitColumns: false,
                idField: 'productId',         //主键
                checkOnSelect: false,
                selectOnCheck: false,
                columns: [[
                    { field: 'productId', checkbox: true },
                    { field: 'sku', title: "商品编码", width: 120},
                    {
                        field: 'adImgUrl', title: '缩略图', width: 70, align: "center", styler: function () { return "height: 52px;" }, formatter: function (value, rows) {
                            if(rows.adImgUrl){
                                return "<img style='max-width: 46px;' src='" + rows.adImgUrl.originalImgUrl + "'/>";
                            }
                        }
                    },
                    { field: 'productName', title: '商品名称', width: 200, formatter: XSLibray.formatText },
                    { field: 'limitQty', title: '限订数量', width: 80, align: "right" },
                    { field: 'saleAmt', title: '价格', width: 80, dataType: "money", align: "right" },
                    { field: 'marketAmt', title: '市场价', width: 80, dataType: "money", align: "right" },
                    { field: 'perServiceAmt', title: '平台服务费/份', width: 90, dataType: "money", align: "right" },
                    { field: 'perCommission', title: '门店提成/份', width: 80, dataType: "money", align: "right" },
                    {
                        field: 'skuStatus', title: '上架状态', align: "center", formatter: function (value, rows) {
                            if(value == "UP"){
                                return "上架";
                            }else if(value == "DOWN"){
                                return "下架";
                            }else{
                                return "已删除";
                            }
                        }
                    },
                    {
                        field: 'datagrid-action', title: '操作', align: "center", formatter: function (value, rows) {
                            return actionLink(value, rows);
                        }
                    }
                ]],
                xsTdAction: xsTdAction,
                onClickRow: function () {
                    return false;
                },
                onLoadSuccess: function (data) {
                    //var rows = data.rows;
                    //pageList.editFiled();
                }
            },
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    //刷新列表
    loadList: function () {
        document.body.options.reload();
    },
    ///上下架
    upselling: function (skuStatus, productId, evt) {
        if(skuStatus == 0){
            skuStatus = "DOWN"
        }else{
            skuStatus = "UP"
        }
        xsjs.stopPropagation(evt);
        xsjs.ajax({
            url: contextPath+"/products/upselling",
            data: {
                productIds: productId,
                skuStatus: skuStatus
            },
            loadMsg: "正在处理，请稍候...",

            success: function (data) {

                window.top.$.messager.alert("温馨提示", data.rspDesc, (data.rspCode == "success" ? "info" : "error"), function () {
                        if (data.rspCode == "success") {
                        pageList.loadList();
                }
                });
            }
        });
    },
    //编辑商品
    edit: function (productId, evt) {
        xsjs.stopPropagation(evt);
        xsjs.addTabs({
            url: contextPath+"/productsWeb/editProducts?productId=" + productId,
            title: "编辑商品"
        });
    }
};


function actionLink(value, rows) {

    var actionUrl = "";
    if(isUpselling){
        if (rows.skuStatus == "DOWN") {actionUrl = "<a onclick='pageList.upselling(1, " + rows.productId + ", event)'>上架</a>";}
        else { actionUrl = "<a onclick='pageList.upselling(0, " + rows.productId + ", event)'>下架</a>"; }
    }

    if(isEdit){
        actionUrl += "<a onclick='pageList.edit(" + rows.productId + ", event)'>编辑</a>";
    }

    return actionUrl;
}

$(function () {
    $(window).resize(function () {
        $("#grid").height($(window).height() - $(".xs-form-bottom").outerHeight(true));
    }).trigger("resize");

    pageList.init();
});