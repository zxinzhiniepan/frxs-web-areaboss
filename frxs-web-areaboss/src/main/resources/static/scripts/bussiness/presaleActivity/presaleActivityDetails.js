var listProduct = [];
function init (){
    var activityId = $("#activityId").val();
    xsjs.ajax({
        url: contextPath+"/activity/queryActivityDetail",
        async:false,
        data: {
            activityId: activityId
        },
        success: function (data) {
            listProduct = data;
        }
    });
}
$(function () {
    init ();
});

var addPresaleActivity = {
    productList: listProduct,
    params: null,
    init: function () {
        this.params = xsjs.SerializeURL2Json();
        if (window.frameElement && $(window.frameElement)) {
            var frameData = $(window.frameElement).data();
            if (frameData && frameData.easyuiWindow && frameData.easyuiWindow == true) {
                $("#divBottomButton").addClass("xs-form-bottom").removeClass("divBottomButton");
                $("#divBottom").addClass("xs-form-bottom-right");
                $(window).trigger("resize");
            }
        }

        this.loadProduct();
    },
    productEditListIndex: -1,
    //重新加载商品
    loadProduct: function () {


        var dataColumns = [[
            { field: 'sku', title: '商品编码', width: 120, align: 'center' },
            { field: 'productName', title: '商品名称', width: 200, formatter: XSLibray.formatText },
            { field: 'attrs', title: '规格', width: 70, align: 'center', formatter: function (value) {
                    if(value!=null){
                        return value[0].attrVal;
                    }
                }},
            { field: 'packageQty', title: '包装数', width: 40, align: 'center' },
            { field: 'sortSeq', title: '商品排序', width: 55 },
            { field: 'vendorCode', title: '供应商编码', width: 70 },
            { field: 'vendorName', title: '供应商名称', width: 100, formatter: XSLibray.formatText },
            { field: 'limitQty', title: '限订数量', width: 60, align: 'right' },
            { field: 'userLimitQty', title: '用户限订数量', width: 80, align: 'right' },
            { field: 'saleAmt', title: '价格', width: 60, align: 'right' },
            { field: 'marketAmt', title: '市场价', width: 60, align: 'right' },
            { field: 'perServiceAmt', title: '平台服务费', width: 80, align: 'right' },
            { field: 'perCommission', title: '门店每份提成', width: 80, align: 'right' },
            {
                field: 'directMining', title: '是否直采', width: 60,align: 'center', formatter: function (value, rowData, index) {
                    if (value == "TRUE") {
                        return "是";
                    }else{
                        return "否";
                    }
                }
            },
            { field: 'saleLimitTime', title: '售后期限', width: 90, formatter: function (value,rowData,index) {
                    if(rowData.saleLimitTime!=null&&rowData.saleLimitTimeUnit!=null){
                        return rowData.saleLimitTime+"("+(rowData.saleLimitTimeUnit=="DAY"?"天":"小时")+")";
                    }
                }}
        ]];

        if (decodeURIComponent(addPresaleActivity.params.activitystatusname) == "进行中") {
            dataColumns = [[
                { field: 'sku', title: '商品编码', width: 60 },
                { field: 'productName', title: '商品名称' },
                { field: 'limitQty', title: '限订数量', width: 70, editor: { type: 'numberbox', options: { precision: 0 } } },
                { field: 'saleAmt', title: '价格', width: 70 ,align: 'right' },
                { field: 'directMining', title: '是否直采', width: 70, align: 'center' },
                { field: 'marketAmt', title: '市场价', width: 80, align: 'right' }
            ]];

            $("#liSelectProduct").hide();
        }

        $("#divProduct").datagrid({
            idField: 'productId',         //主键
            data: listProduct,
            title: "活动商品",
            singleSelect: true,
            columns: dataColumns,
            onClickRow: function (rowIndex) {
            }
        });
    },

};

$(function () {
    addPresaleActivity.init();
});