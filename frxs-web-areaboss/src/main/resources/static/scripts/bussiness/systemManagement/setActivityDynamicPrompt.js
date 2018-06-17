
var toolbarArray = new Array();
var xsTdAction = new Array();
var isAddAndEdit = null;//添加/编辑
var isDelete = null;
var isUpdate = XSLibray.authorize(101, 210);//开启/关闭
$(function () {
    isAddAndEdit = XSLibray.authorize(101, 208);
    if(isAddAndEdit){
        toolbarArray.push("添加");
        toolbarArray.push({ text: "编辑", iconCls: "icon-edit", handler: function () { pageList.edit(); } });
    }
    isDelete = XSLibray.authorize(101, 209);
    if(isDelete){
        toolbarArray.push("删除");
        xsTdAction.push("删除");
    }
});

function datagridAction(value, rows, rowIndex) {
    var actionUrl = "";
    if(isUpdate){
        if (rows.status == "FROZEN") {
            actionUrl = "<a onclick='pageList.upStatus(\"NORMAL\", " + rows.dynamicPromptId + ", event)'>启用</a>";
        } else {
            actionUrl = "<a onclick='pageList.upStatus(\"FROZEN\", " + rows.dynamicPromptId + ", event)'>关闭</a>";
        }
    }

    if (rows.status == "FROZEN" && isAddAndEdit == true) {
        actionUrl += "<a onclick='pageList.edit( " + rows.dynamicPromptId + ", event)'>编辑</a>";
    }

    return actionUrl;
}
var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {
        // var dynamicPromptId=null;
        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "dynamicPromptId",
                del: contextPath+"/setActivityDynamicPrompt/deleteDynamicPrompt",
                delParamName: "dynamicPromptId"
            },
            edit: {
                minHeight: 360,
                maxHeight: 600,
                title: "添加动态提示设置",
                editTitle: "编辑动态提示设置",
                // url: "/setActivityDynamicPrompt/editDynamicPrompt",//打开页面
                url: contextPath+'/setActivityDynamicPrompt/editDynamicPrompt',//打开页面
                width: 600
            },
            //导航选项
            nav: ["系统设置", "活动动态提示设置"],
            //数据列表选项
            datagrid: {
                // url: "/setActivityDynamicPrompt/getPageList",
                url: contextPath+'/setActivityDynamicPrompt/getPageList',
                fitColumns: false,
                idField: 'dynamicPromptId',         //主键
                //singleSelect: true,
                columns: [[
                    { field: 'dynamicPromptId', checkbox:true},
                    { field: 'dynamicPromptName', title: '名称', width: 200, align: 'left' },
                    {
                        field: "tmDisplayStart", title: "展示时间", width: 270, align: 'center', formatter: function (value, rowData, rowIndex) {
                            return value + " - " + rowData.tmDisplayEnd;
                        }
                    },
                    { field: 'content', title: '提示内容', width: 360, align: 'left' },
                    {
                        field: 'status', title: '状态', align: 'center', width: 50, formatter: function (value, rowData, rowIndex) {
                            if (value == "NORMAL") {
                                return "<span style='color: #2c8c2c;'>启用</span>";
                            }
                            else {
                                return "关闭";
                            }
                        }
                    },
                    {
                        field: 'datagrid-action', title: '操作', align: 'center', width: 130, formatter: function (value, rowData, rowIndex) {
                            return datagridAction(value, rowData, rowIndex);
                        }
                    },
                    { field: 'areaId', title: '区域id', width: 30, align: 'left', hidden: 'true' }
                ]]
                ,
                xsTdAction: xsTdAction
            }
            ,
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    //修改状态
    upStatus: function (status, dynamicPromptId, evt) {
        xsjs.stopPropagation(evt);
        $.messager.confirm("温馨提示", "确认要" + (status == "NORMAL" ? "启用" : "关闭") + "设置吗？", function (data) {
            if (data) {
                $.ajax({
                    // url: "/setActivityDynamicPrompt/upStatusDynamicPrompt",
                    url: contextPath+"/setActivityDynamicPrompt/upStatusDynamicPrompt",
                    data: {
                        status: status,
                        dynamicPromptId: dynamicPromptId
                    },
                    loadMsg: "正在处理，请稍候...",
                    success: function (data) {
                        window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");

                        if (data.rspCode == "success") {
                            if (window.frameElement.wapi && window.frameElement.wapi.pageList) {
                                window.frameElement.wapi.pageList.loadList();
                            }
                            pageList.loadList();
                        }

                    },
                    error: function () {

                    }
                });
            }
        });
    },
    //编辑行
    edit: function (dynamicPromptId, evt) {
        if (evt) {
            xsjs.stopPropagation(evt);
        }
        if (!dynamicPromptId) {
            var getData = this.grid.getSelectedData();
            if (getData.length == 0) {
                window.top.$.messager.alert("温馨提示", "请选择要编辑的行", "warning");
                return;
            }

            if (getData.length > 1) {
                window.top.$.messager.alert("温馨提示", "编辑时不能选择多行!", "warning");
                return;
            }

            if (getData[0].status == "NORMAL") {
                window.top.$.messager.alert("温馨提示", "不能编辑启用状态的设置!", "warning");
                return;
            }0

            dynamicPromptId = getData[0].dynamicPromptId;

        }
        this.grid.editPage(dynamicPromptId);
    }
};

$(function () {
    pageList.init();
});
