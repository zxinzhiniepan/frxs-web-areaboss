
var isOpenAndClose = XSLibray.authorize(102, 223);//开启/关闭

function datagridAction(value, rows, rowIndex) {
    var actionUrl = "";
    if(isOpenAndClose&&rows.areaId != null&&rows.areaId != ""){
        if (rows.paraValue == "FROZEN") { actionUrl = "<a onclick='pageList.upStatus(\"NORMAL\", " + rows.id + ",\"" + rows.paraCode+ "\", event)'>启用</a>"; }
        else if (rows.paraValue == "NORMAL") { actionUrl = "<a onclick='pageList.upStatus(\"FROZEN\", " + rows.id + ",\"" + rows.paraCode + "\", event)'>关闭</a>"; }
    }
    return actionUrl;
}
var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "id",
                //del: "/SetActivityDynamicPrompt/DeleteDynamicPrompt",
                //delParamName: "DynamicPromptIds"
            },
            edit: {

            },
            //导航选项
            nav: ["系统设置", "系统参数设置"],
            //数据列表选项
            datagrid: {
                // url: "/systemManagement/getParameterSettingsList",
                url: contextPath+'/parameterSettings/getParameterSettingsList',
                fitColumns: false,
                idField: 'id',         //主键
                singleSelect: true,
                columns: [[
                    { field: 'id', checkbox: true, hidden:'true' },
                    { field: 'paraName', title: '参数名称', width: 180, align: 'center' },
                     {
                         field: 'paraValue', title: '参数值', width: 150, align: 'center', formatter: function (value) {
                             if (value == "NORMAL") {
                                 return "启用";
                             } else if (value == "FROZEN") {
                                 return "禁用";
                             } else {
                                 return value;
                             }
                         }
                     },
                    { field: 'paraDescription', title: '备注', width: 360, align: 'center' },
                    {
                        field: 'datagrid-action', title: '操作', align: 'center', width: 100, formatter: function (value, rowData, rowIndex) {
                            return datagridAction(value, rowData, rowIndex);
                        }
                    },
                    { field: 'paraCode', title: '参数编码', width: 150, align: 'center', hidden: true }
                ]],
                //xsTdAction: xsTdAction,
                onLoadSuccess: function (data) {
                    pageList.editFiled();
                }
            },
            //toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    //编辑字段
    editFiled: function () {
        this.grid.editFiled({
            filed: "paraValue",
            maxLength: 8,
            verify: function (rows) {
                if (rows.paraCode == "203" || rows.paraCode == "204") {
                    return true;
                } else {
                    return false;
                }
            },
            saveFn: function (items) {
                var datePattern;
                switch (items.rows.paraCode) {
                    case "203":
                        datePattern = /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
                        if (!datePattern.test(items.val)) {
                            alert("输入时间格式不对.");
                            return false
                        }
                        break;
                    case "204":
                        var sData1 = ['一', '二', '三', '四', '五', '六', '日','1', '2', '3', '4', '5', '6', '0'];
                       
                        if ($.inArray(items.val, sData1) < 0 ) {
                            alert("只能输入星期标识.如一~日, 0~6.");
                            return false
                        }
                        break;
                    default:
                        pageList.loadList();
                        return;
                        break;
                }
              
                items.loadMsg = "正在保存参数值，请稍候...";
                pageList.saveFiled(items);
            }
        });
    },
    //保存单个字段信息
    saveFiled: function (items) {
        $.ajax({
            // url: "/systemManagement/updateParameterSettings",
            url: contextPath+"/parameterSettings/updateParameterSettings",
            data: {
                id: items.rows.id,
                paraValue: items.val,
                paraCode: items.rows.paraCode
            },
            loadMsg: "正在处理，请稍候...",
            success: function (data) {
                window.top.$.messager.alert("温馨提示", (data.data == "1" ? "保存成功." : "保存失败."), (data.data == "1" ? "info" : "error"), function () {
                    if (data.data == "1") {
                        pageList.loadList();
                    }
                });
            },
            error: function () {
            }
        });
    },
    //修改状态
    upStatus: function (status, id, paraCode, evt) {
        xsjs.stopPropagation(evt);
        $.messager.confirm("温馨提示", "确认要" + (status == "NORMAL" ? "启用" : "关闭") + "参数吗？", function (data) {
            if (data) {
                $.ajax({
                    url: contextPath+"/parameterSettings/updateParameterSettings",
                    data: {
                        id: id,
                        paraValue: status,
                        paraCode: paraCode,
                    },
                    loadMsg: "正在处理，请稍候...",
                    success: function (data) {
                        window.top.$.messager.alert("温馨提示", data.rspDesc, (data.rspCode == "success" || data.rspCode == "0" ? "rspDesc" : "error"), function () {
                            if (data.rspCode == "success" || data.rspCode == "0") {
                                pageList.loadList();
                            }
                        });
                    },
                    error: function () {
                    }
                });
            }
        });
    }
};

$(function () {
    pageList.init();
});
