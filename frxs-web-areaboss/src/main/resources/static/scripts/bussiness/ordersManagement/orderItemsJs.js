/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function (data) {
        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: ""
            },
            //导航选项
            nav: ["订单管理"],
            edit: {},
            isShowSearch: false,
            isShowEmpty: false,
            //搜索栏选项
            search: [
                { text: "订单编号", type: "label", attributes: { name: "orderId", disabled: "disabled", text: data.orderId} },//text: data.orderId   //th:attr="value=${dto !=null?dto.orderId:''}"
                { text: "下单时间", type: "label", attributes: { name: "orderDate", disabled: "disabled", text: xsjs.dateFormat(data.orderDate, "yyyy-MM-dd HH:mm:ss") }},
                { text: "订货门店", type: "label", attributes: { name: "storeId", disabled: "disabled", text: data.storeNo+"     "+data.storeName }},
                // { text: "", type: "label", attributes: { name: "storeNo", disabled: "disabled", text: data.storeNo+ } },
                { text: "会员电话", type: "label", attributes: { name: "mobilePin", disabled: "disabled", text: ((data.mobilePin == null || data.mobilePin == "") ? "-" : data.mobilePin) } },
                { text: "总金额", type: "label", attributes: { name: "orderTotal", disabled: "disabled", text: data.orderTotal } }
            ],
            //数据列表选项
            datagrid: {
                data: data.orderItemsList,
                fitColumns: false,
                singleSelect: true,
                showFooter: true,
                pagination:false,
                columns: [[
                    { field: 'productName', title: '商品名称', width: 220, align: 'left', formatter: XSLibray.formatText },
                    { field: 'sku', title: '商品编码', width: 200, align: 'left' },
                    { field: 'vendorName', title: '供应商', width: 200, align: 'left' },
                    { field: 'vendorCode', title: '供应商编码', width: 200, align: 'left' },
                    { field: 'skuContent', title: '规格', width: 60, align: 'center' },
                    { field: 'packingNumber', title: '包装数', width: 60, align: 'right' },
                    { field: 'presaleQty', title: '限订数量', width: 80, align: 'right' },
                    { field: 'qty', title: '订货数量', width: 80, align: 'right' },
                    { field: 'itemAdjustedPrice', dataType: "money", title: '价格', width: 80, align: 'right' },
                    { field: 'totalPrice', dataType: "money", title: '配送金额', width: 80, align: 'right' },
                    { field: 'totalQty', title: '总数量', width: 80, align: 'right' },
                    {
                        field: 'commission', dataType: "money", title: '每份提成', width: 80, align: 'right', formatter: function (value, rowData) {
                            return rowData.sku && rowData.sku.length > 0 ? value.toFixed(2) : "";
                        }
                    },
                    { field: 'totalCommission', dataType: "money", title: '合计提成', width: 80, align: 'right' },
                    { field: 'platformAmt', dataType: "money", title: '平台服务费/份', width: 100, align: 'right' },
                    { field: 'totalPlatformAmt', dataType: "money", title: '平台服务费', width: 80, align: 'right' }
                ]]
            }
        };

        this.grid = xsjs.datagrid(options);
    }
};

$(function () {
    xsjs.ajax({
        // url: "/orders/getOrderItemsList?orderId=" + xsjs.SerializeURL2Json().orderid,
        // url : "/storeReturn/getOrderItemsList?orderId="+ xsjs.SerializeURL2Json().orderid,//获取订单详情
        url:contextPath+"/order/getOrderItemsList?orderId="+ xsjs.SerializeURL2Json().orderid,//获取订单详情
        success: function (data) {
            if (data) {
                pageList.init(data);
            }
        }
    })
});