
$(function () {
    vendorWithdrawal.init();

    $("#radio1").click(function () {
        $("#checkDescLi").hide();
    });
    $("#radio2").click(function () {
        $("#checkDescLi").show();
    });

    $("#formTable").tabs({
            onSelect: function (title, index) {
                if (index == 1 && pageList.grid == null) {
                    pageList.init();
                }
                if (index == 2 && storeAfterSaleList.grid == null) {
                    storeAfterSaleList.init();
                }
                $(window).trigger("resize");
            }
        }
    );
});

var vendorWithdrawal = {
    pageParam: null,
    init: function () {
        this.pageParam = xsjs.SerializeURL2Json();
        this.resize();

        $("#btnSave").click(function () {
            vendorWithdrawal.saveInfo();
        });

    },
    ///初始化tabs
    resize: function () {
        var navHeight = $(".xs-form-nav:visible").outerHeight() || 0;
        var bottomHeight = $(".xs-form-bottom:visible").outerHeight() || 0;
        $("#formTable").tabs({
            height: $(window).height() - navHeight - bottomHeight - 10
        });

        $(window).resize(function () {
            $("#formTable").tabs("resize", { height: $(window).height() - navHeight - bottomHeight - 10 });
        }).trigger("resize");
    },
    //保存
    saveInfo: function () {
        //申请编号
        var oVendorWithdrawals = xsjs.SerializeDecodeURL2Json();
        var listWithdrawNo =[];
        listWithdrawNo.push(xsjs.SerializeDecodeURL2Json().vendorWithdrawNo);
        //状态
        var sWithdrawalsStatusCode;
        var sWithdrawalsStatusText;
        //驳回理由
        var stxtShareDescription = "";
        var radioAudit = $("#radio1").prop("checked");
        if (radioAudit == "checked" || radioAudit == true) {
            sWithdrawalsStatusCode = "FIRSTCHECK_PASS";
            sWithdrawalsStatusText = "审核通过(待复核)";
        } else {
            stxtShareDescription = $("#auditRemarks").val();
            sWithdrawalsStatusCode = "FIRSTCHECK_REJECT";
            sWithdrawalsStatusText = "审核驳回";
        }
        xsjs.ajax({
            url: contextPath + "/financialAudit/vendorWithdrawalsAudit?listWithdrawNo="+ listWithdrawNo +"&status="+ sWithdrawalsStatusCode +"&desc="+ stxtShareDescription,
            type: "POST",
            loadMsg: "正在保存数据，请稍候...",
            success: function (data) {
                var message ="";
                if(data.listSuccessAuditRet.length > 0){
                    message = "单号：" + data.listSuccessAuditRet[0].withdrawNo + "," + data.listSuccessAuditRet[0].rspDesc;
                }else{
                    message = "单号：" + data.listFailAuditRet[0].withdrawNo + ",失败原因：" + data.listFailAuditRet[0].rspDesc;
                }
                window.top.$.messager.alert("温馨提示",message , data.success == true ? "info" : "error");
                if (data.success == true) {
                    if (window.frameElement.tabs.wapi && window.frameElement.tabs.wapi.pageList) {
                        window.frameElement.tabs.wapi.pageList.loadList();
                    }
                    xsjs.pageClose();
                }
            },
            error: function () {
            }
        });
    }

};

var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
            },
            body: $("#track"),
            edit: {

            },

            //数据列表选项
            datagrid: {
                url: contextPath + "/financialAudit/getVendorWithdrawalsTrackList",
                queryParams: {
                    vendorWithdrawNo: xsjs.SerializeDecodeURL2Json().vendorWithdrawNo
                },
                fitColumns: false,
                columns: [[
                    { field: 'tmCreate', title: '时间', align: 'center', width: 150 },
                    { field: 'createUserName', title: "操作人员", align: 'center', width: 120 },
                    { field: 'remitDetailId', title: "划付单号", align: 'center', width: 120 },
                    { field: 'trackStatusName', title: "划付状态", align: 'center', width: 120 }
                ]]
            }
        };
        this.grid = xsjs.datagrid(options);
    }
};


var storeAfterSaleList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
            },
            body: $("#customerService"),
            edit: {

            },
            //数据列表选项
            datagrid: {
                url: contextPath + "/financialAudit/getStoreAfterSaleInfoList",
                queryParams: { vendorId: xsjs.SerializeDecodeURL2Json().vendorId },
                fitColumns: false,
                showFooter: true,
                pagination:false,//分页控件
                idField: 'productId',         //主键
                columns: [[
                    { field: 'sku', title: "商品编码", align: 'center', width: 120 },
                    { field: 'productName', title: "商品名称", align: 'center', width: 150 },
                    { field: 'tmActivity', title: "销售日期", align: 'center', width: 150 },
                    { field: 'shipmentQty', title: "订货数量", align: 'center', width: 100 },
                    { field: 'singleVendorAmt', title: "成本单价", align: 'center', width: 100 ,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'totalPayAmt', title: "合计应付款", align: 'center', width: 100  ,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'refundQty', title: "售后份数", align: 'center', width: 100 },
                    { field: 'refundAmt', title: "售后总金额", align: 'center', width: 100 ,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'penaltyAmt', title: "其他扣款", align: 'center', width: 100 ,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'needPayAmt', title: "合计实付款", align: 'center', width: 100 ,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'refundPerc', title: "售后占比", align: 'right', width: 70, formatter: function (val) {
                            var obj = parseFloat(val).toFixed(2);
                            if (obj == "NaN") {
                                return "";
                            } else {
                                return obj + "%";
                            }
                        }
                    }
                ]]
            }
        };
        this.grid = xsjs.datagrid(options);
    }
};