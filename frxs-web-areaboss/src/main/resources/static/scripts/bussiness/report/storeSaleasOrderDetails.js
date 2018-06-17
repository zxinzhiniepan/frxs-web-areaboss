/*
 * frxs Inc.  兴盛社区网络服务股份有限公司.
 * Copyright (c) 2017-2018. All Rights Reserved.
 */

var toolbarArrayDetail = new Array();

var pageList = {
    //绑定的数据列表
    grid: null,
    params: {},
    isLoad: false,
    //门店累计销量报表传入的门店数据
    wData: {},
    //门店累计销量报表传入的查询条件
    wSearch: {},
    init: function (queryParams) {
        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "orderId"
            },
            //导航选项
            nav: ["报表管理", "门店累计销量报表", "门店累计销量明细表"],
            edit: {},
            //搜索栏选项
            search: [
                { text: "门店编号", type: "label", attributes: { name: "storeNo", readonly: "true", text: decodeURIComponent(this.wData.storeNo) } },
                { text: "门店名称", type: "label", attributes: { name: "storeName", readonly: "true", text: decodeURIComponent(this.wData.storeName) } },
                { text: "付款时间", type: "date", attributes: { name: "beginPayDate", value: this.wSearch.beginPayDate }, column: 2 },
                { text: " 至 ", type: "date", attributes: { name: "endPayDate", value: this.wSearch.endPayDate } },
                { text: "订单编号", attributes: { name: "orderId" } },
                { type: "label", attributes: { name: "storeId",hidden:true,  readonly: "true", text: decodeURIComponent(this.wData.storeId) } },
                { type: "<br/>" },
                { text: "会员电话", attributes: { name: "mobilePin" } },
                {
                    text: "&nbsp&nbsp付款状态", type: "select", attributes: { name: "payStatus" },
                    option: [
                        { value: "", text: "--全部--" },
                        { value: "notPay,paying", text: "未支付完成" },
                        { value: "hasPay", text: "已支付完成", selected:"selected"}
                    ]
                }
            ],
            onSearchVerify: function() {
                if (pageList.isLoad === true) {
                    var thisSearch = pageList.grid.getSearchJson();

                    if (thisSearch.beginPayDate && $.trim(thisSearch.beginPayDate).length > 0) {
                        this.datagrid.queryParams.payDateStart = thisSearch.beginPayDate + " 00:00:00";
                    }
                    else
                    {
                        this.datagrid.queryParams.payDateStart = "";
                    }

                    if (thisSearch.endPayDate && $.trim(thisSearch.endPayDate).length > 0) {
                        this.datagrid.queryParams.payDateEnd = thisSearch.endPayDate + " 23:59:59";
                    }
                    else
                    {
                        this.datagrid.queryParams.payDateEnd = "";
                    }
                }
                return true;
            },
            //数据列表选项
            datagrid: {
                // url: contextPath+ "/report/getStoreSaleasOrderDetails",
                url: contextPath+ "/order/getOrdersList",
                fitColumns: false,
                queryParams: queryParams,
                idField: 'orderId',
                singleSelect: true,
                showFooter: true,
                columns: [[
                    //{ field: 'OrderId', checkbox: true },
                    {
                        field: 'orderDate', title: '下单时间', width: 130, align: 'center', formatter: function (value) {
                            return xsjs.dateFormat(value, "yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    {
                        field: 'orderId', title: '订单编号', width: 100, align: 'center', formatter: function (value, rowData, rowIndex) {
                            if ($.trim(value).length == 0) {
                                return "";
                            }
                            else {
                                return "<a href='javascript:void(0);' onclick='openDetails(this)'><font style='color:#0066CC;'>" + value + "</font></a>";
                            }
                        }
                    },
                    { field: 'mobilePin', title: '会员电话', width: 100, align: 'center' },
                    { field: 'storeId', title: '门店分享ID', width: 80, align: 'center' },
                    { field: 'storeName', title: '门店名称', width: 200, align: 'left' },
                    { field: 'storeNo', title: '门店编号', width: 80, align: 'center' },
                    { field: 'payStatus', title: '付款状态', width: 80, align: 'center' ,formatter: function (value, row, index) {
                            //1、未支付完成notPay；2、已支付完成hasPay； 3、支付中paying； 4、已付定金
                            if (value != undefined) {
                                if (row.payStatus == "hasPay") {
                                    value = "已支付完成";
                                } else{
                                    value = "未支付完成";
                                }
                                return value;
                            }
                        }
                    },
                    { field: 'orderStatus', title: '订单状态', width: 70, align: 'center' ,formatter: function (value, row, index) {
                            //1待付款needPay，2待提货/已付款paied，3交易完成/已提货finished,4交易关闭closed
                            if (value != undefined) {
                                if (row.orderStatus == "needPay") {
                                    value = "待付款";
                                } else if (row.orderStatus == "paied"){
                                    value = "已付款";
                                } else if(row.orderStatus == "finished"){
                                    value = "交易完成";
                                }else if(row.orderStatus == "closed"){
                                    value = "交易关闭";
                                }else{
                                    value="";
                                }
                                return value;
                            }
                        }
                    },
                    { field: 'payDate', title: '付款时间', width: 140, align: 'center', formatter: function (value, row, index) {
                            if (row.payStatus == "hasPay") {
                                return xsjs.dateFormat(value, "yyyy-MM-dd HH:mm:ss");
                            }
                        }
                    },
                    { field: 'isValetOrder', title: '是否为代客下单', width: 110, align: 'center',formatter: function (value, row, index) {
                            if (value != undefined) {
                                if (row.isValetOrder == true) {
                                    value = "是";
                                } else {
                                    value = "否";
                                }
                                return value;
                            }
                        }
                    },
                    { field: 'wechatName', title: '昵称/姓名', width: 80, align: 'center', formatter: XSLibray.formatText },
                    { field: 'phone', title: '收货手机号', width: 80, align: 'center' },
                    { field: 'unionPayMid1', title: '支付商户号', width: 90, align: 'center' },
                    { field: 'transactionId', title: '支付回调单号', width: 180, align: 'center' },

                    { field: 'totalOrdersAmt', title: '总数量', width: 60, align: 'right' },
                    { field: 'orderTotal', title: '订单金额', width: 60, dataType: "money", align: 'right' },
                    { field: 'totalCommission', title: '提成', width: 60, dataType: "money", align: 'right' }
                ]],
                onLoadSuccess: function () {
                    pageList.isLoad = true;
                }
            },
            toolbar: toolbarArrayDetail
        };
        this.grid = xsjs.datagrid(options);
    }
};

$(function () {

    toolbarArray.push({
        text: '导出', handler:function () {
            $('.datagrid-view2').tableExport({type:'excel',escape:'false',filename:'(2016-02-29_2016-03-06)'});
        }
    });

    pageList.wData = window.frameElement.tabs.data.row;
    pageList.wSearch = window.frameElement.tabs.data.search;

    var queryParams = {
        storeNo: pageList.wData.storeNo,
        // storeName: pageList.wData.storeName,
        storeId:pageList.wData.storeId
    }

    if (pageList.wSearch.beginPayDate && $.trim(pageList.wSearch.beginPayDate).length > 0) {
        queryParams.payDateStart = pageList.wSearch.beginPayDate + " 00:00:00";
    }

    if (pageList.wSearch.endPayDate && $.trim(pageList.wSearch.endPayDate).length > 0) {
        queryParams.payDateEnd = pageList.wSearch.endPayDate + " 23:59:59";
    }

    pageList.init(queryParams);
});

function openDetails(_orderId, evt) {
    if (evt) {
        xsjs.stopPropagation(evt);
    }
    // $(_orderId).
    xsjs.addTabs({ title: "订单详情",url: contextPath+"/orders/orderItems?orderId=" + $(_orderId).text()});
}