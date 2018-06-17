var toolbarArray=new Array();
var isExport = null;
$(function () {
    isExport = XSLibray.authorize(70, 201);
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+ "/report/downloadStoreBalanceAmountList"   //必填  下载地址
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
                kid: "storeId"
            },
            //导航选项
            nav: ["报表管理", "门店余额查询"],
            edit: {},
            //搜索栏选项
            search: [
                { text: "门店编号", attributes: { name: "storeCode" } },
                { text: "门店名称", attributes: { name: "storeName" } }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+ "/report/getStoreBalanceAmountList",
                fitColumns: false,
                idField: 'storeId',         //主键
                singleSelect: true,
                showFooter: true,
                columns: [[
                    { field: 'storeId', width: 80,hidden:true},
                    { field: 'storeCode', title: '门店编号', width: 80, align: 'center' },
                    { field: 'storeName', title: '门店名称', width: 80, align: 'center' },
                    { field: 'storeStatus', title: '门店状态', width: 80, align: 'center' },
                    { field: 'areaName', title: '区域名称', width: 80, align: 'center' },
                    { field: 'totalAmt', title: '总金额', width: 100, dataType: "money", align: 'center', formatter: function (val) {
                        if(val==null){
                            return "0.00";
                        }
                        return val.amount.toFixed(2);
                        }},
                    { field: 'transitAmt', title: '审核中金额', dataType: "money", width: 100, align: 'center' , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                        return val.amount.toFixed(2);
                        }},
                    { field: 'canAmount', title: '可提现金额', width: 100, dataType: "money", align: 'center' , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                        return val.amount.toFixed(2);
                        }},
                    { field: 'bankAccountName', title: '收款人帐户', width: 100, align: 'center' },
                    { field: 'bankNO', title: '开户行行号', width: 100, align: 'center' },
                    { field: 'bankName', title: '开户银行', width: 100, align: 'center' },
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
        "storeCode":"门店编号",
        "storeName":"门店名称",
        "storeStatus":"门店状态",
        "areaName":"区域名称",
        "totalAmt":"总金额",
        "transitAmt":"审核中金额",
        "canAmount":"可提现金额",
        "bankAccountName":"收款人帐户",
        "bankNO":"开户行行号",
        "bankName":"开户银行",
        "bankAccountNO":"银行帐号"
    };
    var fileName = "查询门店余额表_"+xsjs.dateFormat(new Date(), "yyyyMMdd");;

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
                    }else{
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