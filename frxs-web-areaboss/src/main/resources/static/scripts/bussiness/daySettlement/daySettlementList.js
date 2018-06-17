
var toolbarArray = new Array();
var isExport = null;
var isVonder = null;
var isDoor = null;
$(function () {
    isExport = XSLibray.authorize(74, 238);
    isVonder = XSLibray.authorize(74, 252);
    isDoor = XSLibray.authorize(74, 280);
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+"/daySettlement/excelDaySettlementList"   //必填  下载地址
        });
    }
    if(isVonder){
        toolbarArray.push({
            iconCls: 'icon-vonder',
            text: "供应商详情",
            handler: function () {
                pageList.showVendorDaySettlement();
            }
        });
    }
    if(isDoor){
        toolbarArray.push({
            iconCls: 'icon-door',
            text: "门店详情",
            handler: function () {
                pageList.showStoreDaySettlement();
            }
        });
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
                kid: "daySettlementId",
            },
            //导航选项
            nav: ["财务管理", "日结算单"],
            //搜索栏选项
            search: [
                {
                    text: "结算日期", type: "datetime", column: 2, attributes: {
                        id: "settleDateStart",
                        name: "settleDateStart",
                        value: xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd"),
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'settleDateEnd\\\')}'})"
                    }
                },
                {
                    text: " - ", type: "datetime", attributes: {
                        id: "settleDateEnd",
                        name: "settleDateEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'settleDateStart\\\')}'})"
                    }
                }
            ],
            //数据列表选项
            datagrid: {
                url:contextPath+ "/daySettlement/getDaySettlementList",
                fitColumns: false,
                idField: 'id',         //主键
                sortOrder: "desc",
                sortName: "id",
                //checkOnSelect: false,
                singleSelect: true,
                showFooter: true,
                //selectOnCheck: false,
                frozenColumns: [[
                    { field: 'id', checkbox: true },
                    {
                        field: 'settleDate', title: '结算日期', dataType: "date", width: 80, align: 'right', formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
                        }
                    }
                ]],
                columns: [[
                    {
                        field: 'accountDate', title: '帐期',  width: 260, align: 'center', formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
                        }
                    },
                    {
                        field: 'areaName', title: '区域', width: 260, align: 'center'
                    },
                    {
                        field: 'areaId', title: '区域Id', width: 260, align: 'center' ,hidden:true
                    },
                    { field: 'tmCreate', title: '执行时间', dataType: "dateTime", width: 130, align: 'center' ,formatter: function (value, row, index) {
                        return value;
                        }},
                    {
                        field: 'settleMode', title: '执行方式',width: 80,align: 'center', formatter: function (value, row, index) {
                            if(value=='MANUAL'){
                                return "手动";
                            }
                            if(value=='AUTO'){
                                return "自动";
                            }
                            return value;
                        }
                    },
                    { field: 'tradeTotal', title: '交易数量', dataType: "number", width: 80, align: 'right' },
                    { field: 'vendorTotalAmt', title: '交易供应商货款', dataType: "money", width: 120, align: 'right', formatter: function (val) {
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
                    { field: 'storeTotalAmt', title: '交易门店提成', dataType: "money", width: 80, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'settleTotalOrderAmt', title: '交易总额', dataType: "money", width: 80, align: 'right', formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'vendorTotalRefundAmt', title: '门店售后货款', dataType: "money", width: 80, align: 'right', formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'refundTotal', title: '门店售后记录数', dataType: "number", width: 100, align: 'right'},
                    { field: 'storeRefundServiceAmt', title: '门店售后平台费', dataType: "money", width: 100, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'storeTotalRefundAmt', title: '门店售后提成', dataType: "money", width: 120, align: 'right', formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'refundTotalAmt', title: '售后总额', dataType: "money", width: 100, align: 'right', formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'settlePenaltyAmt', title: '供应商罚款', dataType: "money", width: 80, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'vendorSettleWithdrawAmt', title: '供应商提货款', dataType: "money", width: 100, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'storeSettleWithdrawAmt', title: '门店提现', dataType: "money", width: 80, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'storeSettleTaxAmt', title: '门店提现代缴税金', dataType: "money", width: 120, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'vendorSumSettleAmt', title: '供应商总金额', dataType: "money", width: 100, align: 'right', formatter: function (val) {
                            if(val==null){
                                return 0.00;
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'storeSumSettleAmt', title: '门店总金额', dataType: "money", width: 80, align: 'right', formatter: function (val) {
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
    },
    showVendorDaySettlement: function () {
        var arry = this.grid.getGrid.datagrid("getSelections");
        if (arry.length == 0) {
            $.messager.alert("温馨提示", "请选择日结单", "info");
            return;
        }
        xsjs.addTabs({
            url: contextPath+"/daySettlement/vendorDaySettlementList?settleDate=" + arry[0].settleDate+"&areaId="+arry[0].areaId,
            title: "供应商日结单详情 - " + arry[0].settleDate
        });
    },
    showStoreDaySettlement: function () {
        var arry = this.grid.getGrid.datagrid("getSelections");
        if (arry.length == 0) {
            $.messager.alert("温馨提示", "请选择日结单", "info");
            return;
        }
        xsjs.addTabs({
            url: contextPath+"/daySettlement/storeDaySettlementList?settleDate=" + arry[0].settleDate+"&areaId="+arry[0].areaId,
            title: "门店日结单详情 - " +arry[0].settleDate
        });
    },
    execDaySettlement: function () {
        $.ajax({
            url: contextPath+"/daySettlement/execDaySettlement",
            success: function (data) {
                if (data.Data == "1") {
                    pageList.intervalDaySettlementMsgLoading = xsjs.loading("正在生成日结算单，请稍候...");
                    pageList.intervalDaySettlementInit();
                }
                else {
                    $.messager.alert("温馨提示", data.Info, "error");
                }
            }
        });
    },
    intervalTime: 0,
    intervalDaySettlementMsgLoading : null,
    intervalDaySettlementInit: function () {
        pageList.intervalTime = setInterval(function () {
            pageList.intervalDaySettlement();
        }, 1000);
    },
    intervalDaySettlement: function () {
        $.ajax({
            url: contextPath+"/daySettlement/getExecDaySettlementState",
            success: function (data) {
                if (data && data.Flag == "SUCCESS") {
                    switch (data.Data) {
                        //待生成
                        case "1":
                        //生成中
                        case "2":
                            break;
                        case "3":
                        case "4":
                            $.messager.alert("温馨提示", "生成失败！", "error");
                            clearInterval(pageList.intervalTime);
                            pageList.grid.loadList(true);
                            pageList.intervalDaySettlementMsgLoading.xsClose();
                            break;
                        case "6":
                            $.messager.alert("温馨提示", "生成成功！", "info");
                            clearInterval(pageList.intervalTime);
                            pageList.intervalDaySettlementMsgLoading.xsClose();
                            pageList.grid.loadList(true);
                            break;
                        default:
                            $.messager.alert("温馨提示", data.Info, "error");
                            clearInterval(pageList.intervalTime);
                            pageList.intervalDaySettlementMsgLoading.xsClose();
                            pageList.grid.loadList(true);
                            break;
                    }
                }
            }
        });
    }
};

$(function () {
    pageList.init();
});

function exportData(options){

    var fileName = "日结算单_"+xsjs.dateFormat(new Date(), "yyyyMMdd");
    var colNameMap = {
            "settleDate": "结算日期",
            "accountDate": "帐期",
            "areaName":"区域名称",
            "tmCreate":"执行时间",
            "settleMode":"执行方式",
            "tradeTotal":"交易数量",
            "vendorTotalAmt":"交易供应商货款",
            "settlePlatformAmt":"交易平台费",
            "storeTotalAmt":"交易门店提成",
            "settleTotalOrderAmt":"交易总额",
            "vendorTotalRefundAmt":"门店售后货款",//即供应商的退款金额
            "refundTotal":"门店售后记录数",
            "storeRefundServiceAmt":"门店售后平台费",
            "storeTotalRefundAmt":"门店售后提成",//门店售后提成就是门店结算退款
            "refundTotalAmt":"售后总额",
            "settlePenaltyAmt":"供应商罚款",
            "vendorSettleWithdrawAmt":"供应商提货款",
            "storeSettleWithdrawAmt":"门店提现",
            "storeSettleTaxAmt":"门店提现代缴税金",
            "vendorSumSettleAmt":"供应商总金额",
            "storeSumSettleAmt":"门店总金额"
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
                    // list[i].tmCreate = xsjs.datetimeFormat(list[i].tmCreate) ;
                    if(list[i].settleDate!=null){
                        list[i].settleDate=list[i].settleDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
                    }
                    if(list[i].accountDate!=null){
                        list[i].accountDate=list[i].accountDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
                    }
                    if(list[i].vendorTotalAmt!=null){
                        list[i].vendorTotalAmt = list[i].vendorTotalAmt.amount.toFixed(2);
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
                    if(list[i].vendorTotalRefundAmt!=null){
                        list[i].vendorTotalRefundAmt = list[i].vendorTotalRefundAmt.amount.toFixed(2);
                    }
                    if(list[i].storeTotalRefundAmt!=null){
                        list[i].storeTotalRefundAmt = list[i].storeTotalRefundAmt.amount.toFixed(2);
                    }
                    if(list[i].storeRefundServiceAmt!=null){
                        list[i].storeRefundServiceAmt = list[i].storeRefundServiceAmt.amount.toFixed(2);
                    }
                    if(list[i].refundTotalAmt!=null){
                        list[i].refundTotalAmt = list[i].refundTotalAmt.amount.toFixed(2);
                    }
                    if(list[i].settlePenaltyAmt!=null){
                        list[i].settlePenaltyAmt = list[i].settlePenaltyAmt.amount.toFixed(2);
                    }
                    if(list[i].settleRefundAmt!=null){
                        list[i].settleRefundAmt = list[i].settleRefundAmt.amount.toFixed(2);
                    }
                    if(list[i].storeSettleWithdrawAmt!=null){
                        list[i].storeSettleWithdrawAmt = list[i].storeSettleWithdrawAmt.amount.toFixed(2);
                    }
                    if(list[i].vendorSettleWithdrawAmt!=null){
                        list[i].vendorSettleWithdrawAmt = list[i].vendorSettleWithdrawAmt.amount.toFixed(2);
                    }
                    if(list[i].storeSettleTaxAmt!=null){
                        list[i].storeSettleTaxAmt = list[i].storeSettleTaxAmt.amount.toFixed(2);
                    }
                    if(list[i].vendorSumSettleAmt!=null){
                        list[i].vendorSumSettleAmt = list[i].vendorSumSettleAmt.amount.toFixed(2);
                    }
                    if(list[i].storeSumSettleAmt!=null){
                        list[i].storeSumSettleAmt = list[i].storeSumSettleAmt.amount.toFixed(2);
                    }
                    if(list[i].settleMode=='MANUAL'){
                        list[i].settleMode="手动";
                    }
                    if(list[i].settleMode=='AUTO'){
                        list[i].settleMode="自动";
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    })
}