
var pageList = {
    //绑定的数据列表
    grid: null,
    init: function (settleDate,areaId) {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "vendorSettleNo",
            },
            //导航选项
            nav: ["财务管理", "日结算单", "供应商详情"],
            //搜索栏选项
            search: [
                { text: "供应商编码", attributes: { name: 'vendorCode' } }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/daySettlement/getVendorDaySettlementList?settleDate=" + settleDate+"&areaId="+areaId,
                fitColumns: false,
                idField: 'vendorSettleNo',         //主键
                sortOrder: "desc",
                sortName: "vendorSettleNo",
                //checkOnSelect: false,
                showFooter: true,
                selectOnCheck: false,
                frozenColumns: [[
                    { field: 'vendorCode', title: '供应商编码', width: 80, align: 'center' },
                    { field: 'vendorName', title: '供应商名称', width: 200 }
                ]],
                columns: [[
                    { field: 'beginAmt', title: '期初金额', dataType: "money", width: 80, align: 'right', formatter: function (val) {
                        if(val==null){
                            return 0.00;
                        }
                        return val.amount.toFixed(2);
                        }},
                    { field: 'totalTradeCopies', title: '交易数量', dataType: "number", width: 120, align: 'right' },
                    { field: 'vendorTotalAmt', title: '交易货款', dataType: "money", width: 80, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'settlePenaltyAmt', title: '罚款金额', dataType: "money", width: 80, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                        return val.amount.toFixed(2);
                        }},
                    { field: 'refundTotal', title: '售后记录数', dataType: "number", width: 80, align: 'right' },

                    { field: 'settleRefundAmt', title: '售后货款', dataType: "money", width: 80, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'settleWithdrawAmt', title: '提货款', dataType: "money", width: 80, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'endAmt', title: '期末计算金额', dataType: "money", width: 100, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'totalAmt', title: '供应商期末余额', dataType: "money", width: 120, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'vendorAdjustAmt', title: '审核中金额', dataType: "money", width: 120, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'vendorCanWithdrawAmt', title: '可提货款', dataType: "money", width: 100, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},

                    { field: 'settlePlatformAmt', title: '交易平台费', dataType: "money", width: 80, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'storeTotalAmt', title: '交易门店提成', dataType: "money", width: 100, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'settleTotalOrderAmt', title: '交易总金额', dataType: "money", width: 80, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'transitAmt', title: '银联在途金额', dataType: "money", width: 120, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }}
                ]],
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
    }
};

$(function () {
    var settleDate = $("#settleDate").val();
    var areaId=$("#areaId").val();
    pageList.init(settleDate,areaId);
});

function exportData(options){

    var fileName = "供应商日结算详情_"+xsjs.dateFormat(new Date(), "yyyyMMdd");;
    var colNameMap = {
        "vendorCode": "供应商编号",
        "vendorName": "供应商",
        "beginAmt":"期初金额",
        "totalTradeCopies":"交易数量",
        "vendorTotalAmt":"交易货款",
        "settlePenaltyAmt":"罚款金额",
        "refundTotal":"售后记录数",
        "settleRefundAmt":"售后货款",
        "settleWithdrawAmt":"提货款",
        "endAmt":"期末计算金额",
        "totalAmt":"供应商期末余额",//?
        "vendorAdjustAmt":"审核中金额",//?
        "vendorCanWithdrawAmt":"可提货款",
        "settlePlatformAmt":"交易平台费",
        "storeTotalAmt":"交易门店提成",
        "settleTotalOrderAmt":"交易总金额",
        "transitAmt":"银联在途金额"
    };
xsjs.ajax({
    url: options.action,
    data: options.data,
    loadMsg:"正在导出数据，请稍后...",
    success: function (data) {
        if(data==null || data.length==0){
            window.top.$.messager.alert("温馨提示", "您要导出的报表为空!");
            return;
        }
        var list = data;
        if (list) {
            for (var i in list) {
                if(list[i].beginAmt!=null){
                    list[i].beginAmt = list[i].beginAmt.amount.toFixed(2);
                }
                if(list[i].vendorTotalAmt!=null){
                    list[i].vendorTotalAmt = list[i].vendorTotalAmt.amount.toFixed(2);
                }
                if(list[i].settlePenaltyAmt!=null){
                    list[i].settlePenaltyAmt = list[i].settlePenaltyAmt.amount.toFixed(2);
                }
                if(list[i].settleRefundAmt!=null){
                    list[i].settleRefundAmt = list[i].settleRefundAmt.amount.toFixed(2);
                }
                if(list[i].settleWithdrawAmt!=null){
                    list[i].settleWithdrawAmt = list[i].settleWithdrawAmt.amount.toFixed(2);
                }
                if(list[i].endAmt!=null){
                    list[i].endAmt = list[i].endAmt.amount.toFixed(2);
                }
                if(list[i].totalAmt!=null){
                    list[i].totalAmt = list[i].totalAmt.amount.toFixed(2);
                }
                if(list[i].vendorAdjustAmt!=null){
                    list[i].vendorAdjustAmt = list[i].vendorAdjustAmt.amount.toFixed(2);
                }
                if(list[i].vendorCanWithdrawAmt!=null){
                    list[i].vendorCanWithdrawAmt = list[i].vendorCanWithdrawAmt.amount.toFixed(2);
                }
                if(list[i].settlePlatformAmt!=null){
                    list[i].settlePlatformAmt = list[i].settlePlatformAmt.amount.toFixed(2);
                }
                if(list[i].storeTotalAmt!=null){
                    list[i].storeTotalAmt = list[i].storeTotalAmt.amount.toFixed(2);
                }
                if(list[i].settleTotalOrderAmt!=null){
                    list[i].settleTotalOrderAmt = list[i].settleTotalOrderAmt.amount.toFixed(2);
                }
                if(list[i].transitAmt!=null){
                    list[i].transitAmt = list[i].transitAmt.amount.toFixed(2);
                }
            }
            saveExcel(list, colNameMap, fileName);
        }
    }
})
}