/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var toolbarArray = new Array();
var xsTdAction = new Array();
var isDelete = null;
var isEdit = null;
var isLock = null;
var isReset = null;

$(function () {
    isEdit = XSLibray.authorize(88, 217);
    isDelete = XSLibray.authorize(88, 218);
    isLock = XSLibray.authorize(88, 219);
    isReset = XSLibray.authorize(88, 220);
    if(isEdit){
        toolbarArray.push("添加");
        toolbarArray.push("编辑");
        xsTdAction.push("编辑");
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
xsTdAction.push("编辑");

toolbarArray.push("删除");
xsTdAction.push("删除");

toolbarArray.push("锁定");
xsTdAction.push("锁定");*/

function DatagridAction(value, rows) {
    var strResult = "";
if(isReset){
    strResult = '<a href="javascript:void(0);" onclick=\"pageList.reset(\'' + rows.AccountID + '\', event)\">重置密码</a>';
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
                kid: "accountID",
                del: "/VendorAccount/AccountDelete",
                lock: "/VendorAccount/AccountLock",
                lockField: "IsFrozen"
            },
            edit: {
                width: 800,
                height: 386,
                url: "/vendorAccount/editVendorAccount",
                title: "添加帐号",
                editTitle: "编辑帐号"
            },
            //导航选项
            nav: ["供应商管理", "帐号管理"],
            //搜索栏选项
            search: [
                {
                    text: "供应商", type: "vendor", option: {
                        vendorCodeID: "vendorCode",
                        vendorNameID: "vendorName",
                        defaultCodeValue: xsjs.SerializeURL2Json().vendorid,
                        defaultNameValue: (xsjs.SerializeURL2Json().vendorname == "" || xsjs.SerializeURL2Json().vendorname == undefined) ? "" : unescape(xsjs.SerializeURL2Json().vendorname)
                    }
                },
                { text: "帐号", attributes: { name: "AccountNo" } },
                { type: "<br/>" },
                { text: "姓名", attributes: { name: "AccountName" }, column: 2 },
                {
                    text: "&nbsp;&nbsp;状态：", type: "select", attributes: { name: "IsFrozen" },
                    option: [
                        { text: "--全部--", value: "" },
                        { text: "正常", value: "0" },
                        { text: "冻结", value: "1" }
                    ]
                }
            ],
            //数据列表选项
            datagrid: {
                url: "/vendorAccount/getList",
                fitColumns: false,
                idField: 'accountID',         //主键
                columns: [[
                    { field: 'accountID', checkbox: true },
                    { field: 'vendorName', title: "供应商", width: 200 },
                    { field: 'accountName', title: "姓名", align: 'center', width: 80 },
                    { field: 'accountNo', title: "帐号", align: 'center', width: 120 },
                    { field: 'rname', title: '角色名称', align: 'center', width: 80 },
                    {
                        field: 'accountFrozenName', title: '状态', align: 'center', width: 50, formatter: function (value) {
                            if (value == '正常') {
                                return value
                            } else {
                                return "<span style='color:#f00'>" + value + "</span>"
                            }
                        }
                    },
                    {
                        field: 'createTime', title: '添加时间', align: 'center', width: 150, formatter: function (value, rows) {
                            return xsjs.dateFormat(value, "yyyy-MM-dd HH:mm:ss")
                        }
                    },
                    {
                        field: 'datagrid-action', title: '操作', align: 'center', formatter: function (value, rows) {
                            return DatagridAction(value, rows);
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
    },
    //重置密码
    reset: function (accountID, evt) {
        xsjs.stopPropagation(evt);
        xsjs.window({
            title: "重置密码",
            width: 500,
            height: 260,
            modal: true,
            url: "/vendorAccount/resultAccountPwd?id=" + accountID,
        })
    }
};

$(function () {
    var params = xsjs.SerializeURL2Json();
    pageList.init();
});