var toolbarArray = new Array();
var xsTdAction = new Array();
var isDelete = null;
var isEdit = null;
var isAudit = null;
var isExport = null;

$(function () {
    isEdit = XSLibray.authorize(95, 145);
    isDelete = XSLibray.authorize(95, 146);
    isAudit = XSLibray.authorize(95, 147);
    isExport = XSLibray.authorize(95, 278);
    if(isEdit){
        toolbarArray.push("添加");
    }
    if(isDelete){
        toolbarArray.push("-");
        toolbarArray.push("删除");
    }
    if(isExport){
        toolbarArray.push("-");
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+"/activity/activityExport"   //必填  下载地址
        });
    }
/*    toolbarArray.push("-");
    toolbarArray.push({
        action: "预览",             //必填（导出 或 export）
        url: contextPath+"/activity/activityExport"   //必填  下载地址
    });*/
});

xsTdAction.push("查看");

function BusinessCircleList_DatagridAction(value, rows){
    var strResult = "";
    if (rows.activityStatus == "NOTSTARTED")
    {
        if (rows.status == "PENDING")
        {
            if(isEdit){
                strResult = '<a href="javascript:void(0);" onclick="pageList.edit(' + rows.activityId + ', event, 1 ,\'' + rows.activityStatus + '\')">修改商品</a>';
                strResult += '<a href="javascript:void(0);" onclick="pageList.edit(' + rows.activityId + ', event)">编辑</a>';
            }
            if(isDelete){
                strResult += "<a href='javascript:void(0);' onclick='pageList.del(" + rows.activityId + ", event)'>删除</a>";
            }
        }
    }
    else if(rows.activityStatus == "ONGOING"){
        if(isEdit){
            strResult = '<a href="javascript:void(0);" onclick="pageList.edit(' + rows.activityId + ', event, 1 ,\'' + rows.activityStatus + '\')">修改商品</a>';
        }
    }

    if (rows.activityStatus == "NOTSTARTED" || rows.activityStatus == "ONGOING"){
        if(isAudit){
            if (rows.status == "PENDING")
            {
                strResult += "<a href='javascript:void(0);' onclick='pageList.audit(" + rows.activityId + ", event, 1)'>审核</a>";
            }
            else
            {
                strResult += "<a href='javascript:void(0);' onclick='pageList.audit(" + rows.activityId + ", event, 0)'>反审核</a>";
            }
        }
    }
    return strResult;
}

var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "activityId",
                delParamName: "ids",
                del: contextPath+"/activity/delActivity"
            },
            edit: {
                title: "新增活动",
                editTitle: "编辑活动",
                width: $(window.top).width() > 1350 ? 1300 : $(window.top).width() * 0.95,
                url: contextPath+"/activityWeb/addPresaleActivity"
            },

            details: {
                width: $(window.top).width() > 1350 ? 1300 : $(window.top).width() * 0.95,
                title: "查看活动",
                url: contextPath+"/activityWeb/presaleActivityDetails"
            },
            //导航选项
            nav: ["活动商品管理"],
            //搜索栏选项
            search: [
                { text: "活动名称", attributes: { name: "activityName" } },
                {
                    text: "购买时间", type: "datetime", attributes: {
                        id: 'txtExpiryDateStart',
                        name: "tmBuyStart",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})",
                        value: xsjs.dateFormat(+(new Date()) + (1 * 24 * 60 * 60 * 1000), "yyyy-MM-dd 00:00:00")
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--至--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", type: "datetime", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "tmBuyEnd",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',startDate:'%y-%M-%d 23:59:59',minDate:'#F{$dp.$D(\\\'txtExpiryDateStart\\\')}'})"
                    }
                },
                {
                    text: "活动状态", type: "select", attributes: { name: "actvityStatus" },
                    option: [
                        { text: "全部", value: "" },
                        { text: "未开始", value: "NOTSTARTED" },
                        { text: "进行中", value: "ONGOING" },
                        { text: "已结束", value: "END" }
                    ]
                },
                { type: "<br/>" },
                {
                    text: "审核状态", type: "select", attributes: { name: "status" },
                    option: [
                        { text: "全部", value: "" },
                        { text: "已审核", value: "PASS" },
                        { text: "未审核", value: "PENDING" }
                    ]
                },
                { text: "商品名称", attributes: { name: "productName" }, column: 2 },
                { text: "&nbsp;&nbsp;商品编码：", attributes: { name: "sku" } },
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/activity/queryActivityPage",
                width: $(window).width() - 5,

                fitColumns: false,
                idField: 'activityId',         //主键
                columns: [[
                    {
                        field: 'activityId', checkbox: true, formatter: function (value, rows) {
                            return "";
                        }
                    },
                    { field: 'activityName', title: '活动名称', width: 260 , formatter: XSLibray.formatText },
                    {
                        field: 'tmBuyStart', title: '购买时间', width: 270, align: 'center', formatter: function (value, rows) {
                            return value + " 至 " + rows.tmBuyEnd;
                        }
                    },
                    {
                        field: 'tmDisplayStart', title: '显示时间', align: 'center', formatter: function (value, rows) {
                            if (($.trim(rows.tmDisplayStart).length > 0 || $.trim(rows.tmDisplayEnd).length > 0)
                                && (rows.tmDisplayStart != rows.tmBuyStart || rows.tmDisplayEnd != rows.tmBuyEnd)) {
                                if (rows.tmDisplayEnd.length == 0) {
                                    return "";
                                }
                                else {
                                    return value+ " 至 " + rows.tmDisplayEnd;
                                }
                            }
                        }
                    },
                    {
                        field: 'activityType', title: '活动类型', width: 70, align: 'center', formatter: function (value, rows) {
                            switch (value) {
                                case "SECKILL":
                                    return "秒杀活动";
                                    break;
                                default:
                                    return "正常活动";
                                    break;
                            }
                        }
                    },
                    {
                        field: 'tmPickUp', title: '提货时间', width: 75, align: 'center', formatter: function (value, rows) {
                            return xsjs.dateFormat(value, "M月d日")
                        }
                    },
                    {
                        field: 'activityStatus', title: '活动状态', align: 'center', width: 100, formatter: function (value, rows) {
                            if (rows.status == "PENDING" && value == "ONGOING") {
                                return "<span style='color: red;'>进行中(待审核)</span>";
                            }
                            else if (value == "ONGOING") {
                                return "<span style='color: blue'>进行中<span>";
                            }
                            else if (value == "NOTSTARTED") {
                                return "<span style='color: red'>未开始<span>";
                            }
                            else {
                                return "已结束";
                            }
                        }
                    },
                    {
                        field: 'status', title: '审核状态', align: 'center', width: 70, formatter: function (value, rows) {
                            if (value == "PENDING") {
                                return "<span style='color: red;'>未审核</span>";
                            }
                            else  if (value == "PASS"){
                                return "<span>已审核</span>";
                            }
                            else  if (value == "REJECT"){
                                return "<span>驳回</span>";
                            }
                            else{
                                return "<span>已删除</span>";
                            }
                        }
                    },
                    {
                        field: 'datagrid-action', title: '操作', align: 'center', formatter: function (value, rows) {
                            return BusinessCircleList_DatagridAction(value, rows);
                            //return "";
                        }
                    }
                ]],
                onLoadSuccess: function (data) {
                    $(data.rows).each(function () {
                        if (this.activityStatus != "NOTSTARTED") {
                            var accountRow = $(".datagrid-body").find("input[name='activityId'][type='checkbox'][value='" + this.activityId + "']");
                            accountRow.remove();
                        }
                    });
                    var separator = $("#separator"); //toolbar上的竖线
                    var grid = $(".datagrid-toolbar"); //datagrid
                    var date = $("#date");
                    grid.append(separator);
                    grid.append(date);
                },
                onDblClickRow: function (rowIndex, rowData) {

                },
                xsTdAction: xsTdAction
            },
            //toolbar: [{ action: "添加", Text: "添加预售活动" }, "删除"]
            toolbar: toolbarArray
        };
        this.grid = xsjs.datagrid(options);
    },
    //刷新列表
    loadList: function () {
        document.body.options.reload();
    },
    edit: function (id, evt, isEditProduct, actvityStatus) {
        xsjs.stopPropagation(evt);
        var url = null;
        if(isEditProduct==1){
            url = contextPath+"/activityWeb/editPresaleActivityProduct?activityId=" + id + "&isEditProduct=" + (isEditProduct || 0) + "&actvityStatus=" + actvityStatus;
        }else{
            url = contextPath+"/activityWeb/editPresaleActivity?activityId=" + id + "&isEditProduct=" + (isEditProduct || 0) + "&actvityStatus=" + actvityStatus;
        }
        xsjs.window({
            url: url,
            title: "编辑活动",
            width: $(window.top).width() > 1350 ? 1300 : $(window.top).width() * 0.95,
            modal: true,
            owdoc: window.top
        });
    },
    //删除预售活动
    del: function (id, evt) {
        xsjs.stopPropagation(evt);
        this.grid.del(id);
    },
    //审核预售活动
    audit: function (id, evt, state) {
        xsjs.stopPropagation(evt);
        var selectData = this.grid.getSelectedData();

        window.top.$.messager.confirm("温馨提示", state == 1 ? "是否审核选择的行？" : "是否反审核选择的行？", function (data) {
            if (data) {
                xsjs.ajax({
                    url: contextPath+"/activity/auditPreproductActivity",
                    data: {
                        activityId: id,
                        status: state
                    },
                    loadMsg: "正在处理，请稍候...",
                    success: function (data) {
                        window.top.$.messager.alert("温馨提示", data.rspDesc, (data.rspCode == "success" ? "info" : "error"), function () {
                            if (data.rspCode == "success") {
                                pageList.loadList();
                            }
                        });
                    }
                });
            }
        });
    }
};

$(function () {
    pageList.init();
});

function exportData(options){
    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var colNameMap = {
        "activityName": "活动名称",
        "sku": "商品编码",
        "productName": "商品名称",
        "attrs": "规格",
        "packageQty": "包装数",
        "vendorCode": "供应商编码",
        "vendorName": "供应商名称",
        "limitQty": "限订数量",
        "userLimitQty": "用户限订数量",
        "saleAmt": "价格",
        "marketAmt": "市场价",
        "perServiceAmt": "平台服务费",
        "perCommission": "门店每份提成"
    };

    var fileName = "活动列表_"+timeStr;

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg: "正在导出数据，请稍候...",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    if(list[i].attrs!=null){
                        list[i].attrs = list[i].attrs[0].attrVal;
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}
