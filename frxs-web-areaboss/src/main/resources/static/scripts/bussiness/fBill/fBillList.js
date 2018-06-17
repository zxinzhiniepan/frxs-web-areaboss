/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var toolbarArray = new Array();
var xsTdAction = new Array();
var isExport = null;
$(function () {
    isExport = XSLibray.authorize(64, 237);

    if(isExport){
        toolbarArray.push({
            text: "导出",
            iconCls: "icon-excel",
            // url: contextPath+"/fBill/downloadFBillData",   //必填  下载地址
            handler: function () {
                pageList.exportExcel();
            }
        });
    }
});

var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function (fundremitdetailid) {
        //列表数据
        var options = {
            //导航选项
            nav: ["分账单"],
            //搜索栏选项
            search: [
                {
                    text: "分账日期", type: "datetime", column: 2, attributes: {
                        id: "remitDateStart",
                        name: "remitDateStart",
                        value: (xsjs.SerializeURL2Json() && xsjs.SerializeURL2Json().fundremitdetailid!=undefined ? "" : xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd")),
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'remitDateEnd\\\')}'})"
                    }
                },
                {
                    text: " - ", type: "datetime", attributes: {
                        id: "remitDateEnd",
                        name: "remitDateEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'remitDateStart\\\')}'})"
                    }
                },
                {
                    text: "&nbsp;&nbsp;状态", type: "select", attributes: { name: "remitStatus" },
                    option: [
                        { text: "--全部--", value: "" },
                        { text: "待创建批划付文件", value: "INIT" },
                        { text: "待划账", value: "READY" },
                        { text: "划付成功", value: "SUCCESS" },
                        { text: "划付失败", value: "FAIL" },
                    ]
                },
                { text: "收款编号", attributes: { name: "payeeCode"} },
                { text: "分帐单号", attributes: { name: "fundRemitNo"} },
                { text: "付款方编号", attributes: { name: "payerCode" } },
                { text: "划付编号", attributes: { name: "fundRemitDetailId", value: (xsjs.SerializeURL2Json() && xsjs.SerializeURL2Json().fundremitdetailid!=undefined)?xsjs.SerializeURL2Json().fundremitdetailid:"" } }
            ],

            //数据列表选项
            datagrid: {
                url:  contextPath+"/fBill/getFBillList",
                fitColumns: false,
                showFooter: true,
                columns: [[
                    {
                        field: 'remitDate', title: '分帐日期', width: 100, align: 'center', formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
                        }
                    },
                    { field: 'fundRemitNo', title: '分帐单号', width: 190, align: "center" },
                    { field: 'fundRemitDetailId', title: '划付编号', width: 260, align: "center" },
                    { field: 'remitTypeDesc', title: '分帐类型', width: 130, align: "center" },
                    { field: 'unionPayCID', title: '付款方企业用户号', width: 120, align: "center" },
                    { field: 'payerCode', title: '付款方编号', width: 100, align: 'center' },
                    { field: 'payerName', title: '付款方名称', width: 180, align: 'left', formatter: XSLibray.formatText },
                    { field: 'remitAmt', title: '划付金额', width: 70, dataType: "money", halign: "right", align: "right" , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }},
                    { field: 'remittedAmt', title: '回盘金额', width: 70, dataType: "money", halign: "right", align: "right" , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                    }},

                    {
                        field: 'originBizNo', title: '来源单据号', width: 220, align: 'center', formatter: function (value, rows) {
                            var str = "";
                            var url = "";
                            switch (rows.remitType) {
                                case "VENDOR_PENALTY":///供应商罚款/违约金
                                {
                                    url = contextPath+"/vendorFine/viewFine?vendorPenaltyNo=" + rows.originBizNo;
                                    str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.add('" + url + "','供应商违约金详情', this, event)\">" + rows.originBizNo + "</a>";
                                    break;
                                }
                                case "VENDOR_WITHDRAW"://供应商提现
                                {
                                    url = contextPath+"/financialAuditWeb/vendorWithdrawalsDetails?vendorWithdrawNo=" + rows.originBizNo + "&vendorId=" + xsjs.SerializeURL2Json().vendorid;
                                    str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.add('" + url + "','供应商提现详情', this, event)\">" + rows.originBizNo + "</a>";
                                    break;
                                }
                                case "STORE_WITHDRAW"://门店提现
                                case "TAX"://门店提现税收
                                {
                                    url = contextPath+"/financialAuditWeb/storeWithdrawalsDetails?storeWithdrawNo="+ rows.originBizNo;
                                    str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.add('" + url + "','门店提现/提现税收详情', this, event)\">" + rows.originBizNo + "</a>";
                                    break;
                                }
                                case "FRXS_REFUND_PLATFORM"://售后平台费
                                case "VENDOR_REFUND_FEE"://售后货款
                                case "STORE_REFUND_FEE"://售后门店提成
                                {
                                    url =contextPath+"/storeProfile/storeProductReturnDetails?storeRefundNo=" + rows.originBizNo;
                                    str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.add('" + url + "','售后详情', this, event)\">" + rows. originBizNo + "</a>";
                                    break;
                                }
                            }
                            return str;
                        }
                    },
                    { field: 'payeeCode', title: '收款方编号', width: 80, align: 'center', formatter: XSLibray.formatText },
                    { field: 'payeeName', title: '收款方名称', width: 150, align: 'left', formatter: XSLibray.formatText },
                    { field: 'bankPayeeName', title: '帐户名', width: 150, align: 'center' },
                    { field: 'bankName', title: '开户行', width: 150, align: 'center' },
                    { field: 'bankAccount', title: '帐号', width: 150, align: 'center' },
                    { field: 'remark', title: '附言', width: 250, align: 'left' },
                    { field: 'bankNo', title: '银行行号', width: 150, align: 'center' },
                    { field: 'remitStatusDesc', title: '分帐状态', width: 250, align: 'left' },
                    { field: 'remitRetRemark', title: '分帐状态说明', width: 250, align: 'left' },
                    { field: 'remitOutBizNo', title: '银行内部ID', width: 150, align: 'center' },
                ]],
                onClickRow: function () {
                    return false;
                },
                onLoadSuccess: function (data) {
                }
            },
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    add: function (strurl, title, obj, evt) {
        xsjs.stopPropagation(evt);
        xsjs.addTabs({
            url: strurl,
            title: title
        });
    },
    exportExcel:function () {
        xsjs.ajax({
            url: contextPath+"/fBill/createExcel",
            data: pageList.grid.getSearch(),
            type: "POST",
            loadMsg: "正在下载，请稍候...",
            success: function (data) {
                //
                if (data.rspCode == "success" ) {
                    var fileName = encodeURI(data.record);
                    setTimeout(function () {
                        window.location.href = contextPath+"/fBill/exportExcel?fileName="+ fileName;
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
};

$(function () {
    pageList.init(null);
});


function exportData(options){

    var colNameMap = {
        "remitDate": "分帐日期",
        "fundRemitNo": "分帐单号",
        "fundRemitDetailId": "划付编号",
        "remitTypeDesc":"分帐类型",
        "unionPayCID":"付款方企业用户号",
        "payerCode":"付款方编号",
        "payerName":"付款方名称",
        "remitAmt":"划付金额",
        "remittedAmt":"回盘金额",
        "originBizNo":"来源单据号",
        "payeeCode":"收款方编号",
        "payeeName":"收款方名称",
        "bankPayeeName":"帐户名",
        "bankName":"开户行",
        "bankAccount":"帐号",
        "remark":"附言",
        "bankNo":"银行行号",
        "remitStatusDesc":"分帐状态",
        "remitRetRemark":"分帐状态说明",
        "remitOutBizNo":"银行内部ID"
    };

    var fileName = "区域分账单_"+xsjs.dateFormat(new Date(), "yyyyMMdd");
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
                    if(list[i].remitDate!=null){
                        list[i].remitDate = list[i].remitDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
                    }
                    if(list[i].remitAmt!=null){
                        list[i].remitAmt = list[i].remitAmt.amount.toFixed(2);
                    }
                    if(list[i].remittedAmt!=null){
                        list[i].remittedAmt = list[i].remittedAmt.amount.toFixed(2);
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}


