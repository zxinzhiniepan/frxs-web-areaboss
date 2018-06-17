
var pageList = {
    //绑定的数据列表
    grid: null,
    init: function (settleDate,areaId) {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "storeSettleNo",
            },
            //导航选项
            nav: ["财务管理", "日结算单", "门店详情"],
            //搜索栏选项
            search: [
                { text: "门店编码", attributes: { name: 'storeCode' } },
                { text: "门店名称", attributes: { name: 'storeName' } }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/daySettlement/getStoreDaySettlementList?settleDate=" + settleDate+"&areaId="+areaId,
                fitColumns: false,
                idField: 'storeSettleNo',         //主键
                sortOrder: "desc",
                sortName: "storeSettleNo",
                //checkOnSelect: false,
                showFooter: true,
                selectOnCheck: false,
                frozenColumns: [[
                    { field: 'storeCode', title: '门店编码', width: 80 },
                    { field: 'storeName', title: '门店名称', width: 200 }
                ]],
                columns: [[
                    { field: 'beginAmt', title: '期初金额', dataType: "number", width: 80 , formatter: function (val) {
                        if(val==null){
                            return  0.00;
                        }
                        return val.amount.toFixed(2);
                        }},
                    { field: 'totalTradeCopies', title: '交易数量',  width: 120 },
                    { field: 'storeTotalAmt', title: '交易提成金额', dataType: "money", width: 100 , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'settleWithdrawAmt', title: '提现金额', dataType: "money", width: 80 , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'refundTotal', title: '售后记录数',  width: 80 },

                    { field: 'settleRefundAmt', title: '售后提成金额', dataType: "number", width: 100 , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'endAmt', title: '期未金额', dataType: "money", width: 100 , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'sumAmount', title: '门店总金额', dataType: "money", width: 100, formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'settleTaxAmt', title: '提现代缴税金', dataType: "money", width: 100 , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'transitAmt', title: '银联在途金额', dataType: "money", width: 100 , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
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

    var fileName = "门店日结算详情_"+xsjs.dateFormat(new Date(), "yyyyMMdd");;
    var colNameMap = {
    "storeCode":"门店编码",
    "storeName":"门店名称",
    "beginAmt":"期初金额",
    "totalTradeCopies":"交易数量",
    "storeTotalAmt":"交易提成金额",
    "settleWithdrawAmt":"提现金额",
    "refundTotal":"售后记录数",
    "settleRefundAmt":"售后提成金额",
    "endAmt":"期未金额",
    "sumAmount":"门店总金额",
    "settleTaxAmt":"提现代缴税金",
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
                if(list[i].storeTotalAmt!=null){
                    list[i].storeTotalAmt = list[i].storeTotalAmt.amount.toFixed(2);
                }
                if(list[i].settleWithdrawAmt!=null){
                    list[i].settleWithdrawAmt = list[i].settleWithdrawAmt.amount.toFixed(2);
                }
                if(list[i].settleRefundAmt!=null){
                    list[i].settleRefundAmt = list[i].settleRefundAmt.amount.toFixed(2);
                }
                if(list[i].endAmt!=null){
                    list[i].endAmt = list[i].endAmt.amount.toFixed(2);
                }
                if(list[i].sumAmount!=null){
                    list[i].sumAmount = list[i].sumAmount.amount.toFixed(2);
                }
                if(list[i].settleTaxAmt!=null){
                    list[i].settleTaxAmt = list[i].settleTaxAmt.amount.toFixed(2);
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