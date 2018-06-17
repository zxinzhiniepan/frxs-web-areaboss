/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var toolbarArray = new Array();
var xsTdAction = new Array();

// 按钮权限控制
var isAdd = null;
var isDel = null;
var isLock = null;
var isEditBank = null;
var isVendorTypeManagement = null;
var isResetPwd = null;

$(function () {
    isAdd =  XSLibray.authorize(85, 137);
    isDel =  XSLibray.authorize(85, 139);
    isLock =  XSLibray.authorize(85, 138);
    isEditBank =  XSLibray.authorize(85, 141);
    isVendorTypeManagement =  XSLibray.authorize(94, 140);
    isResetPwd = XSLibray.authorize(85, 289);

    if(isAdd){
        toolbarArray.push("添加");
        toolbarArray.push("编辑");
        xsTdAction.push("编辑");
    }
   /* if(isDel){
        toolbarArray.push("删除");
        xsTdAction.push("删除");
    }*/
    if(isLock){
        toolbarArray.push("锁定");
        xsTdAction.push("锁定");
    }
    if(isResetPwd){
        toolbarArray.push("重置密码")
    }
    if(isEditBank){
        toolbarArray.push({ text: '供应商分类管理', iconCls: 'icon-tip', handler: function () { pageList.vendorTypeEdit() } });
    }
    if(isVendorTypeManagement){
        toolbarArray.push({ text: '编辑银行账户', iconCls: 'icon-edit', handler: function () { pageList.EidtStoreBankInfo(pageList.grid) } });
    }
})

var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "vendorId",
                //del: contextPath + "/vendor/vendorDelete",
                lock: contextPath + "/vendor/vendorLock",
                resetPwd:contextPath + "/vendor/vendorResetPwd",
                lockField: "vendorStatus"
            },
            edit: {
                minHeight: 360,
                maxHeight: 600,
                title: "添加供应商",
                editTitle: "编辑供应商",
                url: contextPath + "/vendor/addVendor",
                width: 700
            },
            //导航选项
            //nav: ["首页", "选择供应商"],
            //搜索栏选项
            search: [
                { text: "供应商编码", attributes: { name: "vendorCode" } },
                { text: "供应商名称", attributes: { name: "vendorName" } },
                {
                    text: "供应商分类", type: "select", attributes: { name: "vendorTypeId" },
                    data: {
                        url: contextPath + "/vendorType/getAllList",
                        valueField: "vendorTypeId",
                        textField: "vendorTypeName",
                        emptyOption: {
                            value: "",
                            text: "--全部--"
                        }
                    }
                },
                {
                    text: "省市区", type: "region",
                    attributes: {
                        provinceClientId: "provinceId",
                        cityClientId: "cityId",
                        countyClientId: "regionId"
                    }
                }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath + "/vendor/getPageList",
                fitColumns: false,
                idField: 'vendorId',         //主键
                //singleSelect: true,
                columns: [[
                    { field: 'vendorId', checkbox: true },
                    { field: 'vendorCode', title: '供应商编码', width: 80, align: 'center' },
                    { field: 'vendorName', title: '名称', width: 200, align: 'left', formatter: XSLibray.formatText },
                    { field: 'vendorShortName', title: '简称', width: 100, align: 'left' },
                    { field: 'vendorTypeName', title: '供应商分类', align: 'left', width: 320, formatter: XSLibray.formatText },
                    { field: 'contacts', title: '联系人', align: 'center', width: 80 },
                    { field: 'contactsTel', title: '电话', align: 'center', width: 100 },
                    { field: 'address', title: '详细地址', align: 'left', width: 320, formatter: XSLibray.formatText },
                    { field: 'productCount', title: '商品数量', align: 'right', width: 80 },
                    {
                        field: 'vendorStatus', title: '供应商状态', align: 'center', width: 80, formatter: function (value, rowData, rowIndex) {
                            var number = 1;
                            if (value == 'FROZEN') {
                                return "<span style='color: red;'>冻结</span>";
                            }
                            else if(value == 'NORMAL'){
                                return "正常";
                            }else if(value == 'AUDITING'){
                                return "<span style='color: red;'>待审核</span>";
                            }
                        }
                    }
                ]],
                xsTdAction: xsTdAction
            },
            toolbar: toolbarArray,
            onSearchReset:function () {
                $("#cityId").empty();
                $("#countyId").empty();
            }
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    vendorTypeEdit: function () {
        xsjs.window({
            title: "供应商分类管理",
            url: contextPath + "/vendor/vendorTypeManagement",
            modal: true,
            width: 600,
            minHeight: 360,
            maxHeight: 550,
            owdoc: window.top
        });
    },
    ///编辑门店银行账户
    EidtStoreBankInfo: function (obj) {
        var getSelected = $(obj)[0].getSelected();
        if (getSelected && getSelected.length > 0) {
            if (getSelected.length > 1) {
                window.top.$.messager.alert("温馨提示", "编辑时不能选择多行!");
                return;
            }
        }
        else {
            window.top.$.messager.alert("温馨提示", "请选择要编辑的行!");
            return;
        }
        var kid = getSelected.val();
        if (kid == "" || kid <= 0 || kid == undefined) {
            window.top.$.messager.alert("温馨提示", "编辑的门店信息不正确!");
            return;
        }
        var url = contextPath + "/vendor/getVendorBankInfo?id=" + kid;
        xsjs.window({
            title: "编辑银行账户",
            url: url,
            modal: true,
            width: 500,
            minHeight: 360,
            maxHeight: 450,
            owdoc: window.top
        });
    },
};

$(function () {
    pageList.init();
});

//供应商帐号管理
function accountManager(vendorId, vendorName, evt) {
    if (evt) {
        xsjs.stopPropagation(evt);
    }
    var url = "/vendorAccount/vendorAccountList?vendorId=" + vendorId + "&vendorName=" + escape(vendorName);
    var title = "帐号管理";
    xsjs.addTabs({ title: title, url: url });
}