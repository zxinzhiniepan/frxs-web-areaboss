

var toolbarArray = new Array();
var isExport = null;

var rows =null;
rows = JSON.parse(localStorage.getItem("rows"));
$(function () {
    isExport = XSLibray.authorize(82,148);
    if(isExport){
        // toolbarArray.push({
        //     action: "导出",             //必填（导出 或 export）
        //     url: contextPath+"/order/exportOrderList"   //必填  下载地址
        // });

        toolbarArray.push({
            text: "导出",             //必填（导出 或 export）
            iconCls: "icon-excel",
            handler: function () {
                exportExcel();
            }
        });

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
                kid: "orderId"
            },
            //导航选项
            nav: ["订单管理"],
            edit: {},
            //搜索栏选项- (30 * 24 * 60 * 60 * 1000)
            search: [
                { text: "订单编号", attributes: { name: "orderId" } },
                {
                    text: "下单时间", type: "datetime", column: 2, attributes: {
                        id: "orderDateStart",
                        name: "orderDateStart",
                        value: xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd 00:00:00"),
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',startDate:'%y-%M-%d 00:00:00',minDate:'#F{$dp.$D(\\\'orderDateEnd\\\',{d:-60});}', maxDate:'#F{$dp.$D(\\\'orderDateEnd\\\')}'})"
                    }
                },
                {
                    text: " 至 ", type: "datetime", attributes: {
                        id: "orderDateEnd",
                        name: "orderDateEnd",
                        value: xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd 23:59:59"),
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',startDate:'%y-%M-%d 23:59:59', minDate:'#F{$dp.$D(\\\'orderDateStart\\\')}',maxDate:'#F{$dp.$D(\\\'orderDateStart\\\',{d:60})}'})"
                    }
                },
                  { text: "门店编号", attributes: { name: "storeNo" } },
                 
                {
                    text: "付款状态", type: "select", attributes: { name: "payStatus" },
                    option: [
                        { value: "", text: "--全部--" },
                        { value: "notPay,paying", text: "未支付完成" },
                        { value: "hasPay", text: "已支付完成" }
                    ]
                },
                { type: "<br/>" },
                 { text: "会员电话", attributes: { name: "mobilePin" } },
                {
                    text: "付款时间", type: "datetime", column: 2, attributes: {
                        id: "payDateStart",
                        name: "payDateStart",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',startDate:'%y-%M-%d 00:00:00',maxDate:'#F{$dp.$D(\\\'payDateEnd\\\'\)"
                        + "}'})"
                    }
                },

                {
                    text: " 至 ", type: "datetime", attributes: {
                        id: "payDateEnd",
                        name: "payDateEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',startDate:'%y-%M-%d 23:59:59',minDate:'#F{$dp.$D(\\\'payDateStart\\\')}'})"
                    }
                },
                { text: "门店名称", attributes: { name: "storeName" } },
                {
                    text: "代客下单", type: "select", attributes: { name: "isValetOrder" },
                    option: [
                        { value: "", text: "--全部--" },
                        { value: "0", text: "否" },
                        { value: "1", text: "是" }
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
                },{
                    text: "配送线路", type: "select", attributes: { name: "lineId" },
                    data: {
                        // url: contextPath + "/distributionLine/listDistributionLine?warehouseId=" + ($("input[name='warehouseIds']").val()),
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
                }
            ],
            //数据列表选项
            datagrid: {
                url:contextPath+'/order/getOrdersList',
                fitColumns: false,
                idField: 'orderId',
                singleSelect: true,
                showFooter: true,
                frozenColumns: [[
                    {
                        field: 'orderDate', title: '下单时间', width: 136, align: 'center', formatter: function (value) {
                            return value;
                        }
                    },
                    {
                        field: 'orderId', title: '订单编号', width: 150, align: 'center', formatter: function (value, rowData, rowIndex) {
                            if ($.trim(value).length == 0) {
                                return "";
                            }
                            else {
                                return "<a href='javascript:void(0);' onclick='openDetails(this)'><font style='color:#0066CC;'>" + value + "</font></a>";
                            }
                        }
                    }
                ]],
                columns: [[
                    //{ field: 'OrderId', checkbox: true },
                    { field: 'mobilePin', title: '会员电话', width: 90, align: 'center' },
                    { field: 'storeId', title: '门店分享ID', width: 120, align: 'center' },
                    { field: 'storeName', title: '门店名称', width: 160, align: 'left', formatter: XSLibray.formatText },
                    { field: 'storeNo', title: '门店编号', width: 100, align: 'center' },
                    { field: 'payStatus', title: '付款状态', width: 80, align: 'center' ,formatter: function (value, row, index) {
                        //1、未支付完成notPay；2、已支付完成hasPay； 3、支付中paying； 4、已付定金
                            if (value != undefined) {
                                if (row.payStatus == "notPay") {
                                    value = "未支付完成";
                                } else if (row.payStatus == "hasPay") {
                                    value = "已支付完成";
                                }else if (row.payStatus == "paying") {
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
                            return value;
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
                    { field: 'phone', title: '收货手机号', width: 100, align: 'center' },
                    //todo 下版本加上， 暂时制空
                    { field: 'unionPayMid1', title: '支付商户号', width: 90, align: 'center' },
                    { field: 'transactionId', title: '支付回调单号', width: 180, align: 'center' },
                    { field: 'totalOrdersAmt', title: '总数量', width: 60, align: 'right' },
                    { field: 'orderTotal', title: '订单金额', dataType: "money", width: 70, align: 'right' },
                    { field: 'totalCommission', title: '提成', dataType: "money", width: 70, align: 'right' },
                    { field: 'platformAmt', title: '平台服务费', dataType: "money", width: 80, align: 'right' },
                    { field: 'warehouseName', title: '仓库名称', width: 80, align: 'right' },
                    { field: 'lineName', title: '配送线路',  width: 80, align: 'right' }
                ]]
            },
            onSearchVerify: function () {
                var orderDateStart = $("#orderDateStart");
                var orderDateEnd = $("#orderDateEnd");
                if ($.trim(orderDateStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择下单开始日期", "info", function () {
                        orderDateStart.trigger('click');
                    });
                    return false;
                }

                if ($.trim(orderDateEnd.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择下单结束日期", "info", function () {
                        orderDateEnd.focus('click');
                    });
                    return false;
                }

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
    }
};

$(function () {
    pageList.init();
});

function openDetails(_orderId, evt) {
    if (evt) {
        xsjs.stopPropagation(evt);
    }
    // $(_orderId).
    xsjs.addTabs({ title: "订单详情",url: contextPath+"/orders/orderItems?orderId=" + $(_orderId).text()});
}

function exportData(options){

    var colNameMap = {
        "orderDate": "下单时间",
        "deliveryTime": "提货日期",  //
        "orderId": "订单编号",
        "billOfLading": "提货单号", //
        "userName": "会员电话",
        "wechatName": "昵称/姓名",
        "phone": "收货手机号",
        "storeId": "门店分享ID",
        "storeName": "门店名称",
        "storeNo": "门店编号",
        "payStatus": "付款状态",
        "orderStatus": "订单状态",
        "sku":"商品编码",
        "productName":"商品名称",
        "vendorName":"供应商",
        "vendorCode":"供应商编码",
        "skuContent":"规格",
        "totalOrdersAmt": "总数量",
        "amount":"价格",
        "orderTotal": "配送金额",
        "commission":"每份提成",
        "totalCommission": "门店总提成",
        "serviceCharge": "平台服务费(份)",
        "totalServiceCharge":"平台费合计",
        "payDate": "付款时间",
        "isValetOrder": "是否为代客下单",
        "unionPayMid1": "支付商户号",
        "transactionId": "支付回调单号",
        "lineName": "配送线路",  //
        "lineSort": "配送顺序",
        "warehouseName": "仓库名称"
    };

    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var fileName = "订单管理_" + timeStr;

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg: "正在导出数据，请稍候...",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    if(list[i].payStatus=="notPay"){
                        list[i].payStatus = "未支付完成";
                    }else if(list[i].payStatus=="hasPay"){
                        list[i].payStatus = "已支付完成";
                    }else if(list[i].payStatus=="paying"){
                        list[i].payStatus = "未支付完成";
                    };
                    if (list[i].orderStatus == "needPay") {
                        list[i].orderStatus = "待付款";
                    } else if (list[i].orderStatus == "paied"){
                        list[i].orderStatus = "已付款";
                    } else if(list[i].orderStatus == "finished"){
                        list[i].orderStatus = "交易完成";
                    }else if(list[i].orderStatus == "closed"){
                        list[i].orderStatus = "交易关闭";
                    };
                    if (list[i].isValetOrder == true) {
                        list[i].isValetOrder = "是";
                    } else if(list[i].isValetOrder == false) {
                        list[i].isValetOrder = "否";
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}


function exportExcel(options) {
    xsjs.ajax({
        url: contextPath+"/order/exportOrderListExcel",
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