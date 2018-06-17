var toolbarArray=new Array();
var isExport = null;
$(function () {
    isExport = XSLibray.authorize(71, 200);
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+ "/vendor/downloadVendorBalanceAmountList"   //必填  下载地址
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
                kid: "vendorId"
            },
            //导航选项
            nav: ["报表管理", "供应商余额查询"],
            edit: {},
            //搜索栏选项
            search: [
                { text: "供应商编码", attributes: { name: "vendorCode" } },
                { text: "供应商名称", attributes: { name: "vendorName" } }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/report/getVendorBalanceAmountList",
                fitColumns: false,
                idField: 'vendorId',         //主键
                singleSelect: true,
                showFooter: true,
                columns: [[
                    { field: 'vendorCode', title: '供应商编码', width: 80, align: 'center' },
                    { field: 'vendorName', title: '供应商名称', width: 150, align: 'left', formatter: XSLibray.formatText },
                    { field: 'vendorStatus', title: '供应商状态', width: 80, align: 'center' },
                    { field: 'areaName', title: '区域名称', width: 80, align: 'center' },
                    { field: 'totalAmt', title: '总金额', width: 100, dataType: "money", align: 'right' , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                        return val.amount.toFixed(2);
                        }
                    },
                    { field: 'transitAmt', title: '审核中金额', dataType: "money", width: 100, align: 'right', formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                        return val.amount.toFixed(2);
                        }
                    },
                    { field: 'canAmount', title: '可提现金额', width: 100, dataType: "money", align: 'right' , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                        return val.amount.toFixed(2);
                        }
                    },
                    { field: 'unionPayCID', title: '企业用户号', width: 150, align: 'center' },
                    { field: 'unionPayMID', title: '银联商户号', width: 150, align: 'center' },
                    { field: 'bankAccountName', title: '收款人帐户', width: 100, align: 'center' },
                    { field: 'bankNO', title: '开户行行号', width: 100, align: 'center', formatter: XSLibray.formatText },
                    { field: 'bankName', title: '开户银行', width: 100, align: 'left', formatter: XSLibray.formatText },
                    { field: 'bankAccountNO', title: '银行帐号', width: 150, align: 'center' }
                ]]
            },
            toolbar: toolbarArray
        };
        this.grid = xsjs.datagrid(options);
    }
};

$(function () {
    pageList.init();
});
function exportData(options) {

    var colNameMap ={
        "vendorCode":"供应商编码",
        "vendorName":"供应商名称",
        "vendorStatus":"供应商状态",
        "areaName":"区域名称",
        "totalAmt":"总金额",
        "transitAmt":"审核中金额",
        "canAmount":"可提现金额",
        "unionPayCID":"企业用户号",
        "unionPayMID":"银联商户号",
        "bankAccountName":"收款人帐户",
        "bankNO":"开户行行号",
        "bankName":"开户银行",
        "bankAccountNO":"银行帐号"
    };
    var fileName = "查询供应商余额表_"+xsjs.dateFormat(new Date(), "yyyyMMdd");;
    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg:"正在导出数据，请稍后...",
        success: function(data){
            if(data==null || data.length==0){
                window.top.$.messager.alert("温馨提示", "您要导出的报表为空!");
                return;
            }
            var list = data;
            if(list){
                for(var i in list){
                    if(list[i].totalAmt == null){
                        list[i].totalAmt == "0.00";
                    }else {
                        list[i].totalAmt = list[i].totalAmt.amount.toFixed(2);
                    }
                    if(list[i].transitAmt == null){
                        list[i].transitAmt == "0.00";
                    }else{
                        list[i].transitAmt = list[i].transitAmt.amount.toFixed(2);
                    }
                    if(list[i].canAmount == null){
                        list[i].canAmount == "0.00";
                    }else{
                        list[i].canAmount = list[i].canAmount.amount.toFixed(2);
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }

        }
    })
}