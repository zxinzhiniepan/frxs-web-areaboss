
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
    isNuclear = XSLibray.authorize(66, 227);
    if(isNuclear){
        toolbarArray.push({
            text: "审核",
            iconCls: "icon-ok",
            handler: function () {
                pageList.goAudit();
            }
        });
    }
    isExport = XSLibray.authorize(66, 228);
    if(isExport){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url:  contextPath + "/financialAudit/downloadVendorWithdrawalsAuditList"   //必填  下载地址
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
                kid :"vendorWithdrawNo"
            },
            edit: {

            },
            //导航选项
            nav: ["财务管理", "供应商提现审核"],
           
            //搜索栏选项
            search: [
                {
                    text: "供应商", type: "vendor", option: {
                        vendorCodeId: "vendorCode",
                        vendorNameId: "vendorName",
                        defaultCodeValue: xsjs.SerializeURL2Json().vendorid,
                        defaultNameValue: (xsjs.SerializeURL2Json().vendorname == "" || xsjs.SerializeURL2Json().vendorname == undefined) ? "" : unescape(xsjs.SerializeURL2Json().vendorname),
                        codePlaceholder: "供应商编码",
                        namePlaceholder: "供应商名称"
                    }
                },
                   {
                        text: "提现申请日期", type: "datetime", attributes: {
                            id: 'txtWithdrawalsDateStart',
                            name: "tmWithdrawBegin",
                            onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'#F{$dp.$D(\\\'txtWithdrawalsDateEnd\\\')}'})",
                            value: xsjs.dateFormat(+(new Date()), "yyyy-MM-dd 00:00:00")
                        }, column: 2
                    },
                {
                    text: "--至--", type: "datetime", attributes: {
                        id: "txtWithdrawalsDateEnd",
                        name: "tmWithdrawEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',startDate:'%y-%M-%d 23:59:59',minDate:'#F{$dp.$D(\\\'txtWithdrawalsDateStart\\\')}'})"
                    }
                },
                   {
                       text: "审核日期", type: "datetime", attributes: {
                           id: 'txtAuditDateStart',
                           name: "tmFirstCheckBegin",
                           onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',startDate:'%y-%M-%d 00:00:00',maxDate:'#F{$dp.$D(\\\'txtAuditDateEnd\\\')}'})"
                       }, column: 2
                   },
                {
                    text: "--至--", type: "datetime", attributes: {
                        id: "txtAuditDateEnd",
                        name: "tmFirstCheckEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',startDate:'%y-%M-%d 23:59:59',minDate:'#F{$dp.$D(\\\'txtAuditDateStart\\\')}'})"
                    }
                },
                { type: "<br />" },
                { text: "状态", type: "checkboxlist",
                    attributes: {
                        name: "listStatus"
                    },
                    data: {
                        url: contextPath + "/financialAudit/vendorWithdrawalsStatus",
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
                //     text: "&nbsp;状态", type: "checkboxlist", attributes: { name: "listStatus" },
                //     option: [
                //         { text: "全部(可多选)", value: "selectAll",isAll: true },
                //         { text: "待审核",value: "VENDOR_APP" },
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
                url: contextPath + '/financialAudit/getVendorWithdrawalsAuditList',
                fitColumns: false,
                showFooter: true,
                columns: [[
                    { field: 'vendorWithdrawNo', checkbox: true },
                    { field: 'tmWithdrawal', title: '申请时间', align: 'center', width: 150 },
                    { field: 'vendorCode', title: "供应商编码", align: 'center', width: 120 },
                    { field: 'vendorName', title: "供应商名称", align: 'left', width: 120, formatter: XSLibray.formatText },
                    { field: 'curWithdrawAmt', title: "申请提现金额", align: 'right', width: 80 ,formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'totalAmt', title: "总金额", align: 'right', width: 80 ,formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'auditingAmt', title: "审核中金额", align: 'right', width: 80 ,formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'canWithdrawAmt', title: "可提现金额", align: 'right', width: 80,formatter: function (val) {
                            if(val==null){
                                return "";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'vendorWithdrawNo1', title: '申请单号', align: 'center', width: 160, formatter: function (val, rows) {
                            return rows.vendorWithdrawNo;
                        }
                    },
                    { field: 'statusName', title: "审核状态", align: 'center', width: 120 },
                    { field: 'tmFirstCheck', title: '审核时间', align: 'center', width: 150 },
                    { field: 'firstCheckerName', title: "审核人", align: 'center', width: 120 },
                    { field: 'tmAudit', title: '复核时间', align: 'center', width: 150  },
                    { field: 'auditUserName', title: "复核人", align: 'center', width: 120 },
                    { field: 'remitDetailId', title: "划付编号", align: 'center', width: 160, formatter: function (val,row) {
                            var str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.tansferDetail('" + val + "','" + row.vendorId + "','划付详情', this, event)\">" + (val == null ? "" : val) + "</a>";
                            return str;
                        }
                    },
                    { field: 'vendorId', hidden: true },
                    { field: 'opAreaId', hidden: true }
                ]],
                onDblClickRow: function (index, row) {
                    var url = contextPath + "/financialAuditWeb/vendorWithdrawalsDetails?vendorWithdrawNo=" + row.vendorWithdrawNo + "&vendorId=" + row.vendorId;
                    xsjs.addTabs({
                        url: url,
                        title: "提现详情",
                        win: window
                    });
                }
                // xsTdAction: xsTdAction
            },
            toolbar: toolbarArray
        };
        this.grid = xsjs.datagrid(options);
    },
    //刷新列表
    loadList: function () {
        document.body.options.reload();
    },
    goAudit: function () {
        var arry = this.grid.getGrid.datagrid("getSelections");
        if (arry.length == 0) {
            window.top.$.messager.alert("提示", "没有选中数据行", "info");
            return;
        }
        // todo 如果要批量审核则把else if 删除
        else if (arry.length > 1) {
            window.top.$.messager.alert("提示", "每次只能审核一条数据.", "info");
            return;
        }

        for (var i = 0; i < arry.length; i++) {
            if (arry[i].status != "VENDOR_APP") {
                window.top.$.messager.alert("提示", "选中的提现编号:(" + arry[i].vendorWithdrawNo + ")不是待审核的数据,不能审核", "info");
                return;
            }
        }

        //todo 如果要批量审核则以下代码 删除
        var url = contextPath + "/financialAuditWeb/vendorWithdrawalsDetails?vendorWithdrawNo=" + arry[0].vendorWithdrawNo;
        xsjs.addTabs({
            url: url,
            title: "提现详情",
            win: window
        });
        //todo 如果要批量审核则以下代码 取消注释
        // xsjs.window({
        //     title: "审核供应商提现",
        //     owdoc: window.top,
        //     url: contextPath + "/financialAuditWeb/vendorAudit",
        //     width: 480,
        //     height: 480,
        //     modal: true
        // });
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
        var url = contextPath + "/financialAuditWeb/vendorWithdrawalsDetails?vendorWithdrawNo=" + arry[0].vendorWithdrawNo + "&vendorId=" + arry[0].vendorId;
        xsjs.addTabs({
            url: url,
            title: "提现详情",
            win: window
        });
    },

    //查看划付编号详细
    tansferDetail: function (id,vendorId, title, obj, evt) {
        xsjs.stopPropagation(evt);
        xsjs.addTabs({
            url: contextPath + '/fBill/fBillList?fundRemitDetailId=' + id + "&vendorId=" + vendorId,
            title: title
        });
    }
    
};

function exportData(options){
    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var fileName = "供应商提现审核_"+timeStr;
    var colNameMap = {
        "tmWithdrawal": "申请时间",
        "vendorCode": "供应商编码",
        "vendorName": "供应商名称",
        "curWithdrawAmt": "申请提现金额",
        "totalAmt": "总金额",
        "auditingAmt": "审核中金额",
        "canWithdrawAmt": "可提现金额",
        "vendorWithdrawNo": "申请单号",
        "statusName":"审核状态",
        "tmFirstCheck":"审核时间",
        "firstCheckerName":"审核人",
        "tmAudit":"复核时间",
        "auditUserName":"复核人",
        "remitDetailId":"划付编号"
    };
    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg :"正在导出数据，请稍候...",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    if(list[i].curWithdrawAmt == null){
                        list[i].curWithdrawAmt = "";
                    }else{
                        list[i].curWithdrawAmt = list[i].curWithdrawAmt.amount.toFixed(2);
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
    var params = xsjs.SerializeURL2Json();
    pageList.init();
});
