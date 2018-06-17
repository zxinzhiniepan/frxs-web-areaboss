
var yesterdayDate = xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd");
var newDate = yesterdayDate;
var toolbarArray = new Array();
var isNuclear = null;
var isExport = null;
$(function () {
    toolbarArray.push({
        text: "详细",
        iconCls: "icon-search",
        handler: function () {
            pageList.goDetail();
        }
    });
    isNuclear = XSLibray.authorize(65, 225);
    if(isNuclear){
        toolbarArray.push({
            text: "审核",
            iconCls: "icon-ok",
            handler: function () {
                pageList.goAudit();
            }
        });
    }
    isExport = XSLibray.authorize(65, 226);
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath + "/financialAudit/downloadStoreWithdrawalsExprot"   //必填  下载地址
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
                kid: "storeWithdrawNo"
            },
            //导航选项
            nav: ["财务管理", "提现审核"],
            onSearchVerify: function () {
                var expiryDateStart = $("#txtExpiryDateStart");
                var expiryDateEnd = $("#txtExpiryDateEnd");
                return true;
            },
            onSearchReset: function () {
                $("#txtExpiryDateStart").val(yesterdayDate);
                $("#txtExpiryDateEnd").val(newDate);
            },

            //搜索栏选项
            search: [
                { text: "门店编号", attributes: { name: "storeCode" } },

                {
                    text: "<span style='color: red;'>*</span>提现申请日期", type: "date", attributes: {
                        id: 'txtExpiryDateStart',
                        name: "tmWithdrawBegin",
                        value: yesterdayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;--至--&nbsp;&nbsp;", type: "date", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "tmWithdrawEnd",
                        value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txtExpiryDateStart\\\')}'})"
                    }
                },

                {
                    text: "审核日期", type: "date", attributes: {
                        id: 'txtBeginAuditTime',
                        name: "tmFirstCheckBegin",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'txtEndAuditTime\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;--至--&nbsp;&nbsp;", type: "date", attributes: {
                        id: "txtEndAuditTime",
                        name: "tmFirstCheckEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txtBeginAuditTime\\\')}'})"
                    }
                },
                { type: "<br />" },
                { text: " 门店名称", attributes: { name: "storeName" }, column: 2 },
                { type: "<br />" }, {
                    text: "状态", type: "checkboxlist",
                    attributes: {
                        name: "listStatus"
                    },
                    data: {
                        url: contextPath + "/financialAudit/storeWithdrawalsStatus",
                        valueField: "value",
                        textField: "text",
                        emptyOption: {
                            text: "全部(可多选)",
                            value: "selectAll",
                            //是否为全选选项
                            isAll: true
                        }
                    }
                }
                // {
                //     text: "&nbsp;&nbsp;状态：", type: "checkboxlist",
                //     attributes: {
                //         name: "listStatus"
                //     },
                //     option: [
                //         { text: "全部(可多选)", value: "selectAll",isAll: true },
                //         { text: "待初审",value: "STORE_APP" },
                //         { text: "审核通过（待复核）", value: "FIRSTCHECK_PASS" },
                //         { text: "审核驳回", value: "FIRSTCHECK_REJECT" },
                //         { text: "复核通过（待划付）", value: "AUDIT_PASS" },
                //         { text: "复核驳回", value: "AUDIT_REJECT" },
                //         { text: "划付中", value: "READY" },
                //         { text: "划付成功", value: "SUCCESS" },
                //         { text: "划付失败", value: "FAIL" }
                //     ]
                // }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath + '/financialAudit/qryStoreWithdrawals',
                fitColumns: false,
                showFooter: true,
                frozenColumns: [[
                    { field: 'storeWithdrawNo', checkbox: true },
                    { field: 'tmWithdraw', title: '提现申请时间', align: 'center', halign: "center", width: 140},
                    { field: 'storeCode', title: '门店编号', align: 'center', halign: "center", width: 80 },
                    { field: 'storeName', title: '门店名称', align: 'left', width: 200, formatter: XSLibray.formatText }
                ]],
                columns: [[
                    { field: 'withdrawAmt', title: '本次提现金额', align: 'right', dataType: "money", halign: "right", width: 80,formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'taxAmt', title: '代缴税金', align: 'right', halign: "center", dataType: "money", width: 80 ,formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'totalAmt', title: '总金额', align: 'right', halign: "center", dataType: "money", width: 80 ,formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'auditingAmt', title: '审核中金额', align: 'right', halign: "center", dataType: "money", width: 80 ,formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'canWithdrawAmt', title: '可提现金额', align: 'right', dataType: "money", halign: "right", width: 80,formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'storeWithdrawNo1', title: '申请单号', align: 'center', halign: "center", width: 180, formatter: function (val, rows) {
                            return rows.storeWithdrawNo;
                        }
                    },
                    { field: 'statusName', title: '状态', align: 'center', halign: "center", width: 120 },
                    {
                        field: 'tmFirstCheck', title: '审核时间', align: 'center', halign: "center", width: 140 },
                    { field: 'firstCheckerName', title: '审核人', align: 'center', halign: "center", width: 100 },
                    { field: 'tmAudit', title: '复核时间', align: 'center', halign: "center", width: 140 },
                    { field: 'auditUserName', title: '复核人', align: 'center', halign: "center", width: 80 },
                    {
                        field: 'storeAmtRemitDetailId', title: '提现划付编号', align: 'center', halign: "center", width: 160, formatter: function (val) {
                            var str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.tansferDetail('" + val + "','提现划付详情', this, event)\">" + (val == null ? "" : val) + "</a>";
                            return str;
                        }
                    },
                    { field: 'storeAmtRemitStatusName', title: '提现划付状态', align: 'center', halign: "center", width: 120 },
                    {
                        field: 'taxAmtRemitDetailId', title: '税金划付编号', align: 'center', halign: "center", width: 160, formatter: function (val, row) {
                            var str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.tansferDetail('" + val + "','税金划付详情', this, event)\">" + (val == null ? "" : val) + "</a>";
                            return str;
                        }
                    },
                    { field: 'taxAmtRemitStautsName', title: '税金划付状态', align: 'center', halign: "center", width: 120 }
                ]]
            },
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    goAudit: function () {
        var nos = "";
        var arry = this.grid.getGrid.datagrid("getSelections");
        for (var i = 0; i < arry.length; i++) {
            if (arry[i].status !="STORE_APP") {
                window.top.$.messager.alert("提示", "选中的“" + arry[i].storeWithdrawNo + "”不是待审核的数据不能审核", "info");
                return;
            }
            nos += arry[i].storeWithdrawNo + ",";
        }

        if (nos=="") {
            window.top.$.messager.alert("提示", "没有选中要审核的数据", "info");
            return;
        }
        // else {
        //     nos = nos.substring(0, nos.length - 1);
        // }

        xsjs.window({
            title: "审核门店提现",
            owdoc: window.top,
            url: contextPath + "/financialAudit/storeAudit",
            // url: contextPath + "/financialAudit/storeAudit?nos=" + nos,
            width: 480,
            height: 480,
            modal: true
        });
    },
    goDetail: function () {
        var arry = this.grid.getGrid.datagrid("getSelections");
        if (arry.length == 0) {
            window.top.$.messager.alert("提示", "没有选中数据行", "info");
            return;
        } else if (arry.length > 1) {
            window.top.$.messager.alert("提示", "每次只能查看一条数据哦", "info");
            return;
        }
        var url = contextPath + "/financialAuditWeb/storeWithdrawalsDetails?storeWithdrawNo=" + arry[0].storeWithdrawNo;
        xsjs.addTabs({
            url: url,
            title: "门店提现详情",
            win: window
        });
    },
    //查看划付编号详细
    tansferDetail: function (id, title, obj, evt) {
        xsjs.stopPropagation(evt);
        xsjs.addTabs({
            url: contextPath + '/fBill/fBillList?fundRemitDetailId=' + id,
            title: title
        });
    }
};

function exportData(options){
    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var fileName = "门店提现审核_"+timeStr;
    var colNameMap = {
        "tmWithdraw": "提现申请时间",
        "storeCode": "门店编号",
        "storeName": "门店名称",
        "withdrawAmt": "本次提现金额",
        "taxAmt": "代缴税金",
        "totalAmt": "总金额",
        "auditingAmt": "审核中金额",
        "canWithdrawAmt": "可提现金额",
        "storeWithdrawNo":"申请单号",
        "statusName":"状态",
        "tmFirstCheck":"审核时间",
        "firstCheckerName":"审核人",
        "tmAudit":"复核时间",
        "auditUserName":"复核人",
        "storeAmtRemitDetailId":"提现划付编号",
        "storeAmtRemitStatusName":"提现划付状态",
        "taxAmtRemitDetailId":"税金划付编号",
        "taxAmtRemitStautsName":"税金划付状态"
    };
    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg :"正在导出数据，请稍候...",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    if(list[i].withdrawAmt == null){
                        list[i].withdrawAmt = "";
                    }else{
                        list[i].withdrawAmt = list[i].withdrawAmt.amount.toFixed(2);
                    }
                    if(list[i].taxAmt == null){
                        list[i].taxAmt = "";
                    }else{
                        list[i].taxAmt = list[i].taxAmt.amount.toFixed(2);
                    }
                    if(list[i].totalAmt == null){
                        list[i].totalAmt = "";
                    }else{
                        list[i].totalAmt = list[i].totalAmt.amount.toFixed(2);
                    }
                    if(list[i].auditingAmt == null){
                        list[i].auditingAmt = "";
                    }else{
                        list[i].auditingAmt = list[i].auditingAmt.amount.toFixed(2);
                    }
                    if(list[i].canWithdrawAmt == null){
                        list[i].canWithdrawAmt = "";
                    }else{
                        list[i].canWithdrawAmt = list[i].canWithdrawAmt.amount.toFixed(2);
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}

$(function () {
    pageList.init();
});