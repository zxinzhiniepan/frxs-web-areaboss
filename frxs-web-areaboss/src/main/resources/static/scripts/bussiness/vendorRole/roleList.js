/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var toolbarArray = new Array();
var xsTdAction = new Array();
var isDelete = null;
var isEdit = null;
var isLock = null;

$(function () {
    isEdit = XSLibray.authorize(87, 214);
    isDelete = XSLibray.authorize(87, 215);
    isLock = XSLibray.authorize(87, 216);
    if(isEdit){
        toolbarArray.push("添加");
        toolbarArray.push("编辑");
        xsTdAction.push({ text: "权限管理", action: "编辑" });
    }
    if(isDelete){
        toolbarArray.push("删除");
        xsTdAction.push("删除");
    }
    if(isLock){
        toolbarArray.push("锁定");
        xsTdAction.push("锁定");
    }
});

/*toolbarArray.push("添加");
toolbarArray.push("编辑");
xsTdAction.push({ text: "权限管理", action: "编辑" });

toolbarArray.push("删除");
xsTdAction.push("删除");

toolbarArray.push("锁定");
xsTdAction.push("锁定");*/
var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "rid",
                del: "/vendorRole/roleDelete",
                lock: "/vendorRole/roleLock",
                lockField: "rstatus"
            },
            add: {
                maxHeight: 750,
                minHeight: 360,
                url: "/vendorRole/addRole",
                title: "添加角色",
                editTitle: "编辑角色"
            },
            edit: {
                maxHeight: 750,
                minHeight: 360,
                url: "/vendorRole/addRole",
                title: "添加角色",
                editTitle: "编辑角色"
            },
            details: {
                url: "/vendorRole/roleDetails"
            },
            //导航选项
            nav: ["供应商管理", "角色管理"],
            //搜索栏选项
            search: [
                { text: "角色名称", attributes: { name: "rname" } },
                {
                    text: "状态", type: "select", attributes: { name: "rstatus" },
                    option: [
                        { text: "全部", value: "" },
                        { text: "正常", value: "0" },
                        { text: "冻结", value: "1" }
                    ]
                }
            ],
            //数据列表选项
            datagrid: {
                url: "/vendorRole/getAllList",
                fitColumns: false,
                idField: 'rid',         //主键
                columns: [[
                    { field: 'rid', checkbox: true },
                    { field: 'rname', title: '角色名称', width: 200 },
                    { field: 'strMenu', title: '权限', width: ($(window).width() < 800 ? 340 : $(window).width() - 460) },
                    //{ field: 'StatisticsCount', title: '帐号数' },
                    {
                        field: 'rstatus', title: '状态', align: 'center', width: 50, formatter: function (value, rows) {
                            return value == 0 ? "正常" : "<span style='color:#f00'>冻结</span>";
                        }
                    }
                ]],
                onLoadSuccess: function (data) {

                },
                onDblClickRow: function (rowIndex, rowData) {

                }
                , xsTdAction: xsTdAction
            }
            , toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    //刷新列表
    loadList: function () {
        document.body.options.reload();
    }
};

$(function () {
    pageList.init();
});