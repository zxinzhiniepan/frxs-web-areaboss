var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "productId",
                del: contextPath+"/products/productsDelete"
            },
            body: $("#grid"),
            //导航选项
            //nav: ["选择预售商品"],
            //搜索栏选项
            search: [
                { text: "商品名称", attributes: { name: "productName" } },
                { text: "商品编码", type: "number", attributes: { name: "sku", maxlength: "8" }, option: { min: 0, max: 999999999999999 } },
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
                title: "请选择要加入活动的商品",
                idField: 'ID',         //主键
                checkOnSelect: false,
                selectOnCheck: false,
                columns: [[
                    //{ field: 'ID', checkbox: true },
                    { field: 'sku', title: "商品编码", width: 120 },
                    {
                        field: 'adImgUrl', title: '缩略图', width: 50, styler: function () { return "height: 52px;" }, formatter: function (value, rows) {
                            if(rows.adImgUrl){
                                return "<img style='max-width: 46px;' src='" + rows.adImgUrl.originalImgUrl + "'/>";
                            }
                        }
                    },
                    { field: 'productName', title: '商品名称', width: 200 },
                    { field: 'attrs', title: '规格', width: 80 , formatter: function (value) {
                            if(value!=null){
                                return value[0].attrVal;
                            }
                        } },
                    { field: 'vendorCode', title: '供应商编码', width: 80 },
                    { field: 'vendorName', title: '供应商名称', width: 100 },
                    { field: 'limitQty', title: '限订数量', width: 60 },
                    { field: 'saleAmt', title: '价格', width: 50, dataType: "money", align: "right" },
                    { field: 'marketAmt', title: '市场价', width: 50, dataType: "money", align: "right" },
                    { field: 'perServiceAmt', title: '平台服务费/份', width: 90, dataType: "money", align: "right" },
                    { field: 'perCommission', title: '门店提成/份', width: 80, dataType: "money", align: "right" },
                    {
                        field: 'skuStatus', title: '上架状态', formatter: function (value, rows) {
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
                        field: 'datagrid-action', title: '操作', formatter: function (value, rows) {
                            var isJoinInProduct = $.grep(window.frameElement.wapi.addPresaleActivity.productList, function (item, index) {
                                return item.productId == rows.productId;
                            });
                            var str = "";
                            if (isJoinInProduct.length == 0) {
                                str = "<a href='javascript:void(0)' onclick=\"pageList.selectProduct('add', " + rows.productId + ", this, event)\">选择并上架</a>";
                            }
                            else {
                                str = "<a href='javascript:void(0)' onclick=\"pageList.selectProduct('del', " + rows.productId + ", this, event)\" class='joinInRemoveProduct'>取消选择</a>";
                            }
                            return str;
                        }
                    }
                ]],
                onClickRow: function () {
                    return false;
                },
                onLoadSuccess: function (data) {
                    //var rows = data.rows;
                    //pageList.editFiled();
                }
            }
        };

        this.grid = xsjs.datagrid(options);
    },
    //刷新列表
    loadList: function () {
        document.body.options.reload();
    },
    selectProduct: function (status, productId, obj, evt) {
        xsjs.stopPropagation(evt);
        var hasSelectProduct = $("#hasSelectProduct");

        var productData = $("#grid").find(".xll-datagrid").datagrid("getData").rows;

        var addProduct = $.grep(productData, function (item, index) {
            return item.productId == productId;
        });

        if (status == "add") {
            window.frameElement.wapi.addPresaleActivity.productList.push(addProduct[0]);
            window.frameElement.wapi.addPresaleActivity.loadProduct();

            $(obj).addClass("joinInRemoveProduct").html("取消选择").attr("onclick", "pageList.selectProduct('del', " + productId + ", this, event)");
        }
        else {
            window.frameElement.wapi.addPresaleActivity.removeProduct(productId);

            $(obj).removeClass("joinInRemoveProduct").html("选择并上架").attr("onclick", "pageList.selectProduct('add', " + productId + ", this, event)");
        }
    }
};

$(function () {
    $(window).resize(function () {
        $("#grid").height($(window).height() - $(".xs-form-bottom").outerHeight(true));
    }).trigger("resize");

    pageList.init();
});