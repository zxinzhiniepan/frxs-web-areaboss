/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />

var toolbarArray = new Array();
var xsTdAction = new Array();
var close = null;
var firstCheck = null;
var downloadList = null;
var view = null;
var today = xsjs.dateFormat((new Date()).getTime(), "yyyy-MM-dd");
var date =xsjs.dateFormat(new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), "yyyy-MM-dd");
$(function () {

    close = XSLibray.authorize(67, 231);
    firstCheck = XSLibray.authorize(69, 230);
    downloadList = XSLibray.authorize(69, 229);
    view = XSLibray.authorize(69, 259);

    if(view) {
        toolbarArray.push({
            text: '查看', iconCls: 'icon-search', handler: function () {
                pageList.See(pageList.grid)
            }
        });
    }

    if(firstCheck) {
        toolbarArray.push({
            text: '审核', iconCls: 'icon-shengh', handler: function () {
                pageList.Audit(pageList.grid)
            }
        });
    }

    if(close) {
        toolbarArray.push({
            text: '客服关闭', iconCls: 'icon-no', handler: function () {
                pageList.Close(pageList.grid)
            }
        });
    }

    if(downloadList) {
        //  toolbarArray.push({
        //     action: "导出",             //必填（导出 或 export）
        //      url: contextPath + "/storeProfile/downloadStoreProductReturn"   //必填  下载地址
        //  });
        //   toolbarArray.push({
        //       text: '导出',
        //       iconCls: 'icon-excel',
        //       handler: function () {
        //           location.href = contextPath+"/storeProfile/downloadStoreProdReturn?" + pageList.grid.getSearch();
        //       }
        //   });
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
                kid: "storeRefundNo",
            },
            //导航选项
            nav: ["售后管理"],

            //搜索栏选项
            search: [
                { text: "售后单号", attributes: { name: "storeRefundNo" }, column: 2 },
                { text: "&nbsp;原订单编号：", attributes: { name: "orderNo" } },
                {
                    text: "&nbsp;&nbsp;&nbsp;售后类型", type: "select",
                    attributes: {
                        name: "listRefundType",
                        id: "FirstCheckReasonTypeCode",
                        width :130,
                        editable: false
                    },
                    combobox: {
                        multiple: true
                    },
                    data: {
                        url: contextPath + "/storeProfile/storeProdReturnType",
                        valueField: "dictValue",
                        textField: "remark"
                    }
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;状态",
                    type: "select",
                    combobox: {
                        multiple: true
                    },
                    required: true,
                    attributes: {
                        name: "listStatus",
                        id: "AfterSaleStatusCodes",
                        width :140,
                        editable: false
                    },
                    data: {
                        url: contextPath + "/storeProfile/storeProdReturnStatus",
                        valueField: "value",
                        textField: "text"
                    }
                    // option: [
                    //     { value: "STORE_APP", text: "待审核" },
                    //     { value: "FIRSTCHECK_PASS", text: "审核通过（待复核）" },
                    //     { value: "FIRSTCHECK_REJECT", text: "审核驳回" },
                    //     { value: "AUDIT_PASS", text: "复核通过（待划付）" },
                    //     { value: "AUDIT_REJECT", text: "复核驳回" },
                    //     { value: "READY", text: "划付中" },
                    //     { value: "SUCCESS", text: "划付成功" },
                    //     { value: "FAIL", text: "划付失败" },
                    //     { value: "CUSTOMSERVICE_CLOSE", text: "客服关闭" },
                    //     { value: "CONSUMER_CLOSE", text: "客户关闭" }
                    // ]
                },
               /* {
                    text: "仓库",
                    type: "select",
                    combobox: {
                        multiple: true
                    },
                    required: true,
                    attributes: {
                        name: "listWarehouse",
                        id: "txtListWarehouse",
                        width :140,
                        editable: false
                    },
                    data: {
                        url: contextPath + "/storeProfile/getWarehouselist",
                        valueField: "wareHouseId",
                        textField: "wareHouseName"
                    }
                },*/
                { type: "<br>" },
                {
                    text: "申请日期", type: "datetime", attributes: {
                        id: 'txttmFirstCheckBegin',
                        name: "tmAfterSaleBegin",
                        value: date,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd', maxDate: '#F{$dp.$D(\\\'txtApplyEndTime\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", type: "datetime", attributes: {
                        id: "txtApplyEndTime",
                        name: "tmAfterSaleEnd",
                        value: today,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txttmFirstCheckBegin\\\')}'})"
                    }
                },
                { text: "&nbsp;&nbsp;&nbsp;门店名称", attributes: { name: "storeName" } },
                { text: "&nbsp;&nbsp;&nbsp;门店编号", attributes: { name: "storeCode" } },
                { type: "<br>" },

                {
                    text: "下单日期", type: "datetime", attributes: {
                        id: 'txtOrderCreateStartTime',
                        name: "tmOrderBegin",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd', maxDate: '#F{$dp.$D(\\\'txtOrderCreateEndTime\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", type: "datetime", attributes: {
                        id: "txtOrderCreateEndTime",
                        name: "tmOrderEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txtOrderCreateStartTime\\\')}'})"
                    }
                },
                { text: "&nbsp;&nbsp;&nbsp;商品名称", attributes: { name: "productName" } },
                { text: "&nbsp;&nbsp;&nbsp;商品编号", attributes: { name: "sku" }, option: { prefix: '0', width: 130 } },
                { type: "<br>" },
                {
                    text: "审核日期", type: "datetime", attributes: {
                        id: 'txtFirstCheckStartTime',
                        name: "tmFirstCheckBegin",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd', maxDate: '#F{$dp.$D(\\\'txtFirstCheckEndTime\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", type: "datetime", attributes: {
                        id: "txtFirstCheckEndTime",
                        name: "tmFirstCheckEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'txtFirstCheckStartTime\\\')}'})"
                    }
                },

                { text: "供应商编号", attributes: { name: "vendorCode" } },
                { text: "供应商名称", attributes: { name: "vendorName" } },
                { type: "<br />" },
                { text: "仓库", type: "warehouse",
                    attributes: {
                        name: "listWarehouse",
                        id: "txtListWarehouse",
                        width :140,
                        editable: false
                    },
                    data: {
                        url: contextPath + "/storeProfile/getWarehouselist",
                        valueField: "wareHouseId",
                        textField: "wareHouseName"
                    }
                }
            ],

            //数据列表选项
            datagrid: {
                url: contextPath+"/storeProfile/getStoreProdReturnList",
                fitColumns: false,
                idField: 'storeRefundNo',         //主键
                singleSelect: true,
                //sortName: "LineName,LineSort",
                showFooter: true,
               // singleSelect:true,
                frozenColumns: [[
                    { field: 'storeRefundNo', checkbox: true },
                    { field: 'storeCode', title: '门店编号', width: 80, align: 'center' },
                    { field: 'storeName', title: '门店名称', width: 90, align: 'left', formatter: XSLibray.formatText }

                ]],
                columns: [[
                    { field: 'storeRefundId', title: '售后单号', width: 160, align: 'center' ,
                        formatter:function(value,row,index){
                            return row.storeRefundNo;
                        }
                    },
                    { field: 'tmAfterSale', title: '申请时间', width: 130, align: 'center' },
                    { field: 'warehouseName', title: '仓库', width: 130, align: 'center' },
                    { field: 'sku', title: '商品编码', width: 100, align: 'center' },
                    { field: 'productName', title: '商品名称', width: 160, align: 'left', formatter: XSLibray.formatText },
                    { field: 'tmActivity', title: '精品日期', width: 130, align: 'center', formatter: function (value, rows) {
                            return xsjs.dateFormat(value);
                        }
                    },
                    // { field: 'afterSaleReason', title: '售后原因', width: 110, align: 'left', formatter: XSLibray.formatText },
                    { field: 'firstCheckReasonTypeText', title: '售后类型', width: 120, align: 'left', formatter: XSLibray.formatText },
                    { field: 'firstCheckQty', title: '售后数量', width: 80, align: 'right' },

                    { field: 'firstCheckVendorAmt', title: '供应商货款', align: 'right', width: 70,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'firstCheckServicesFeeAmt', title: '平台服务费', width: 70, align: 'right', sortable: true,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'firstCheckStoreAmt', title: '门店提成', width: 60, align: 'right', sortable: true,formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },
                    { field: 'firstCheckSumAmt', title: '售后金额合计', width: 80, align: 'right',formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.amount.toFixed(2);
                        }
                    },

                    { field: 'status', title: '状态', width: 1, hidden: 'true' },
                    { field: 'statusName', title: '状态', width: 120, align: 'center' },
                    { field: 'vendorCode', title: '供应商编码', width: 70, align: 'center' },
                    { field: 'vendorName', title: '供应商名称', width: 120, formatter: XSLibray.formatText },
                    { field: 'vendorAmtRemitDetailId', title: '货款划付单号', width: 160, align: 'center', sortable: true, formatter: function (val) {
                            var str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.tansferDetail('" + val + "','货款划付详情', this, event)\">" + (val == null ? "" : val) + "</a>";
                            return str;
                        }
                    },
                    { field: 'vendorAmtRemitstatusName', title: '货款划付状态', width: 100, align: 'center', sortable: true },
                    { field: 'servicesFeeRemitDetailId', title: '售后划付单号', width: 160, align: 'center', sortable: true , formatter: function (val) {
                            var str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.tansferDetail('" + val + "','售后划付详情', this, event)\">" + (val == null ? "" : val) + "</a>";
                            return str;
                        }
                    },
                    { field: 'servicesFeeRemitstatusName', title: '售后划付状态', width: 100, align: 'center'},
                    { field: 'firstCheckerName', title: '初审核人', width: 60, align: 'center' },
                    { field: 'tmFirstCheck', title: '审核时间', width: 140, align: 'center' },
                    { field: 'auditUserName', title: '复核人', width: 60, align: 'center' },
                    { field: 'tmAudit', title: '复核时间', width: 140, align: 'center' },
                    { field: 'orderNo', title: '原订单编号', width: 140, align: 'center' },
                    { field: 'orderDate', title: '下单时间', width: 140, align: 'center'}
                    // { field: 'storeAmtRemitDetailId', title: '原门店提成划付单号', width: 160, align: 'center', sortable: true, formatter: function (val) {
                    //         var str = "<a href='javascript:void(0)' style='text-decoration:underline;color:blue;' onclick=\"pageList.tansferDetail('" + val + "','原门店提成划付详情', this, event)\">" + (val == null ? "" : val) + "</a>";
                    //         return str;
                    //     }
                    // },
                    // { field: 'storeAmtRemitstatusName', title: '原门店提成划付状态', width: 100, align: 'center' }
                ]],
                //xsTdAction: xsTdAction,
                onLoadSuccess: function (data) {
                }
            },
            onSearchVerify: function () {
                var warehouse = $("input[name='listWarehouse']").is(":checked");
                if (warehouse) {
                    return true;
                }
                else {
                    window.top.$.messager.alert("温馨提示", "请选择要需要查询的仓库!");
                    return false;
                }
            },
            onSearchReset: function () {
                $("#FirstCheckReasonTypeCode").combobox("clear");
                $("#AfterSaleStatusCodes").combobox("clear");
            },
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    Audit: function (obj) {
        var getSelected = pageList.grid.getSelected();
        if (!getSelected) {
            window.top.$.messager.alert("温馨提示", "请选择要审核的行!");
            return;
        }

        if (getSelected.length > 1) {
            window.top.$.messager.alert("温馨提示", "审核时不能选择多行!");
            return;
        }

        var kid = getSelected.val();
        if (kid == "" || kid <= 0 || kid == undefined) {
            window.top.$.messager.alert("温馨提示", "请选择要审核的行!");
            return;
        }
        var rows = pageList.grid.getGrid.datagrid('getSelections');
        if (rows[0].status != 'STORE_APP') {
            window.top.$.messager.alert("温馨提示", "只有待初审状态，才能审核!");
            return;
        }

        var rows = pageList.grid.getGrid.datagrid('getSelections');
        var url = contextPath+"/storeProfile/storeProductReturnAudit?storeRefundNo=" + kid;
        xsjs.window({
            title: "审核售后",
            url: url,
            modal: true,
            width: 800,
            minHeight: 800,
            maxHeight: 1000,
            owdoc: window.top
        });
    },
    See: function (obj) {
        var getSelected = pageList.grid.getSelected();
        if (!getSelected) {
            window.top.$.messager.alert("温馨提示", "请选择要查看的行!");
            return;
        }

        if (getSelected.length > 1) {
            window.top.$.messager.alert("温馨提示", "查看时不能选择多行!");
            return;
        }

        var kid = getSelected.val();
        if (kid == "" || kid <= 0 || kid == undefined) {
            window.top.$.messager.alert("温馨提示", "请选择要查看的行!");
            return;
        }

        var rows = pageList.grid.getGrid.datagrid('getSelections');
        var url = contextPath+"/storeProfile/storeProductReturnDetails?storeRefundNo=" + kid ;
        xsjs.window({
            title: "售后查看",
            url: url,
            modal: true,
            width: 800,
            minHeight: 800,
            maxHeight: 1000,
            owdoc: window.top
        });
    },

    Close: function (obj) {

        var getSelected = pageList.grid.getSelected();

        if (!getSelected) {
            window.top.$.messager.alert("温馨提示", "请选择要关闭的行!");
            return;
        }

        if (getSelected.length > 1) {
            window.top.$.messager.alert("温馨提示", "关闭时不能选择多行!");
            return;
        }

        var kid = getSelected.val();
        if (kid == "" || kid <= 0 || kid == undefined) {
            window.top.$.messager.alert("温馨提示", "请选择要关闭的行!");
            return;
        }
        var rows = pageList.grid.getGrid.datagrid('getSelections');
        if (rows[0].status != 'STORE_APP') {
            window.top.$.messager.alert("温馨提示", "只有待初审状态，才能关闭!");
            return;
        }

        window.top.$.messager.confirm("提示", "确定操作客服关闭?", function (isSave) {
            if (isSave) {
                var formData = { storeRefundNo: getSelected.val() }
                xsjs.ajax({
                    url: contextPath+"/storeProfile/closeStoreAfterSale",
                    data: formData,
                    type: "POST",
                    loadMsg: "正在操作，请稍候...",
                    success: function (data) {
                        if (data.rspCode == "success") {
                            console.log(data)
                            window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
                            //location.reload();
                            document.body.options.reload();
                        }
                        else {
                            window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
                        }
                    },
                    error: function () {
                        window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
                    }
                });
            }
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

function exportExcel(options) {
    xsjs.ajax({
        url: contextPath+"/storeProfile/createExcel",
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

/*
function exportData(options){
    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var fileName = "区域门店售后_"+timeStr;
    var colNameMap = {
        "storeCode": "门店编号",
        "storeName": "门店名称",
        "storeRefundNo": "售后单号",
        "tmAfterSale": "申请时间",
        "warehouseName":"仓库",
        "sku": "商品编码",
        "productName": "商品名称",
        "tmActivity": "精品日期",
        // "afterSaleReason": "售后原因",
        "firstCheckReasonTypeText": "售后类型",
        "firstCheckQty": "售后数量",
        "firstCheckVendorAmt": "供应商货款",
        "firstCheckServicesFeeAmt": "平台服务费",
        "firstCheckStoreAmt": "门店提成",
        "firstCheckSumAmt": "售后金额合计",
        "statusName": "状态",
        "vendorCode":"供应商编码",
        "vendorName":"供应商名称",
        "vendorAmtRemitDetailId":"货款划付单号",
        "vendorAmtRemitstatus":"货款划付状态",
        "servicesFeeRemitDetailId":"售后划付单号",
        "servicesFeeRemitstatus":"售后划付状态",
        "firstCheckerName":"初审核人",
        "tmFirstCheck":"审核时间",
        "orderNo":"原订单编号",
        "orderDate":"订单时间",
        "storeAmtRemitDetailId":"原门店提成划付单号",
        "storeAmtRemitstatus":"原门店提成划付状态"
    };
    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg: "正在导出数据，请稍候",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    // list[i].tmAfterSale = xsjs.dateFormat(list[i].tmAfterSale);
                    list[i].tmActivity = xsjs.dateFormat(list[i].tmActivity);
                    // list[i].tmFirstCheck = xsjs.dateFormat(list[i].tmFirstCheck);
                    // list[i].orderDate = xsjs.dateFormat(list[i].orderDate);
                    list[i].firstCheckVendorAmt = formatter(list[i].firstCheckVendorAmt);
                    list[i].firstCheckServicesFeeAmt = formatter(list[i].firstCheckServicesFeeAmt);
                    list[i].firstCheckStoreAmt = formatter(list[i].firstCheckStoreAmt);
                    list[i].firstCheckSumAmt = formatter(list[i].firstCheckSumAmt);
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}*/

function formatter(val) {
    if(val==null){
        return "0.00";
    }
    return val.amount.toFixed(2);
}

$(function () {
/*    debugger
    var data = $('#listWarehouse').combobox('listWarehouse').select();//获取所有下拉框数据
    if (data.length > 0) {
        $('#listWarehouse').combobox('select',data[0].id);
    }*/
   pageList.init();
});

