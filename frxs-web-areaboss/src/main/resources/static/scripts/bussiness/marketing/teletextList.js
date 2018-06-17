var toolbarArray = new Array();
var isDelete = null;
var isAudit = null;

$(function () {
    isDelete = XSLibray.authorize(84, 222);
    isAudit = XSLibray.authorize(84, 221);
    if(isDelete){
        toolbarArray.push("删除");
    }
});

function actionLink(value, rows) {

    var actionUrl = "";
    var actionDel = "";
    var actionAudit = "";
    if(isDelete){
        actionDel = "<a onclick='pageList.onDelete(" + rows.imgtextId + ",event)'>删除</a>";
    }
    if(isAudit){
        actionAudit = "<a onclick='pageList.showTeletextInfo(" + rows.imgtextId + ",2,event)'>审核</a>";
    }

    if (rows.imgTextStatus == "EXPIRED") {
        actionUrl = actionDel + "  <a onclick='pageList.showTeletextInfo(" + rows.imgtextId + ",1,event)'>查看</a>"
    }
    else {
        actionUrl = actionAudit;
    }
    return actionUrl;
};

var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "imgtextId",
                delParamName: "ids",
                del: contextPath+"/teletext/teletextDelete"
            },
            edit: {

            },
            onSearchReset: function () {
                //$("#txtDateStart").val(yesterdayDate);
                //$("#txtExpiryDateEnd").val(newDate);
            },
            //导航选项
            nav: ["图文直播管理"],
            //搜索栏选项
            search: [
                { text: "供应商", attributes: { name: "vendorName" } },
                { text: "供应商编码", attributes: { name: "vendorCode" } },


                {
                    text: "&nbsp活动日期", type: "date", attributes: {
                        id: 'txtActionStart',
                        name: "tmBuyStart",
                        // value: yesterdayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'#F{$dp.$D(\\\'txtActionEnd\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;--至--&nbsp;", type: "date", attributes: {
                        id: "txtActionEnd",
                        name: "tmBuyEnd",
                        // value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'#F{$dp.$D(\\\'txtActionStart\\\')}'})"
                    }
                },
                { type: "<br/>" },

                { text: "商品名称", attributes: { name: "productName" } },
                {
                    text: "&nbsp;&nbsp;&nbsp;展示状态", type: "select", attributes: { name: "imgTextStatus" },
                    option: [
                        { text: "全部", value: "" },
                        { text: "展示中", value: "DISPLAY" },
                        { text: "已过期", value: "EXPIRED" },
                    ]
                },
                {
                    text: "&nbsp提交日期", type: "date", attributes: {
                        id: 'txtDateStart',
                        name: "tmSubmitStart",
                        // value: yesterdayDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;--至--&nbsp;", type: "date", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "tmSubmitEnd",
                        // value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'#F{$dp.$D(\\\'txtDateStart\\\')}'})"
                    }
                }

            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/teletext/getPageList",
                fitColumns: false,
                idField: 'imgtextId',         //主键
                //singleSelect: true,
                columns: [[
                    { field: 'imgtextId', checkbox: true },
                    {
                        field: 'tmSubmit', title: '提交时间', width: 130, align: 'center', formatter: function (value) {
                            return value;
                        }
                    },
                    { field: 'vendorCode', title: '供应商编码', width: 80, align: 'center' },
                    { field: 'vendorName', title: '供应商名称', width: 200, align: 'left', formatter: XSLibray.formatText },
                    { field: 'activityName', title: '活动名称', width: 200, align: 'left', formatter: XSLibray.formatText },
                    { field: 'activeLife', title: '活动有效期', width: 280, align: 'center', formatter: function (value, rows) {
                            return rows.tmBuyStart + " 至 " + rows.tmBuyEnd;
                        }},
                    { field: 'productName', title: '商品名称', align: 'left', width: 200, formatter: XSLibray.formatText },
                    { field: 'totalThumbsupQty', title: '点赞人数', align: 'right', width: 80 },
                    {
                        field: 'imgTextStatus', title: '展示状态', align: 'center', width: 100, formatter: function (value) {
                            if (value == "DISPLAY") {
                                return "<span style='color:#006600'>" + '展示中' + "</span>"
                            } ;
                            if (value == "EXPIRED") {
                                return "<span>" + '已过期' + "</span>"
                            } ;
                        }
                    },
                    { field: 'auditUserName', title: '审核人', align: 'center', width: 100 },
                    {
                        field: 'datagrid-action', title: '操作', align: 'center', width: 120, formatter: function (value, rows) {
                            return actionLink(value, rows);
                        }
                    }
                ]],
                onLoadSuccess: function (data) {
                    $(data.rows).each(function () {
                        if (this.imgTextStatus != "EXPIRED") {
                            var accountRow = $(".datagrid-body").find("input[name='imgtextId'][type='checkbox'][value='" + this.imgtextId + "']");
                            accountRow.remove();
                        }
                    });
                },
                //xsTdAction: xsTdAction
            },
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    showTeletextInfo: function (id,operation, evt) {
        xsjs.stopPropagation(evt);
        var url = contextPath+"/teletextWeb/teletextDetails?imgtextId=" + id + "&operation=" + operation;

        xsjs.window({
            url: url,
            title: "图文直播详情",
            modal: true,
            width: 600,
            minHeight: 360,
            maxHeight: 800,
            owdoc: window.top
        });
    },
    onDelete:function(id)
    {
        window.top.$.messager.confirm("提示", "确定删除这条记录?", function (isSave) {
            if (isSave) {
                $.ajax({
                    url: contextPath+"/teletext/teletextDelete",
                    data: "ids=" + id,
                    loadMsg: "正在删除数据，请稍候...",
                    dataType: "json",
                    success: function (data) {
                        window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
                        if (data.rspCode == "success") {
                            pageList.grid.loadList();
                        }
                    }
                });
            }
        })
    }
};

$(function () {
    pageList.init();
});

