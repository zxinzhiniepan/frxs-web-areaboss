/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />

var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "storeId"
            },
            //导航选项
            nav: ["会员管理"],
            edit: {},
            //搜索栏选项
            search: [
                { text: "门店编号", attributes: { name: "storeNo" } },
                { text: "会员手机号", attributes: { name: "userTel" } },
                { text: "门店名称", attributes: { name: "storeName" } }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/report/getAspnetUsersList",
                fitColumns: false,
                idField: 'storeId',         //主键
                singleSelect: true,
                columns: [[
                    { field: 'storeName', title: '门店名称', width: 160, align: 'left', formatter: XSLibray.formatText },
                    { field: 'storeNo', title: '门店编号', width: 80, align: 'center' },
                    {
                        field: 'storeId1', title: '门店分享ID', width: 80, align: 'center', formatter: function (vlaue, rowData) {
                            return rowData.storeId;
                        }
                    },
                    { field: 'storeAddress', title: '门店地址', width: 260, align: 'left', formatter: XSLibray.formatText },
                    { field: 'wechatName', title: '会员微信昵称', width: 200, align: 'left', formatter: XSLibray.formatText },
                    { field: 'userTel', title: '会员手机号', width: 100, align: 'center' },
                    { field: 'orderNum', title: '订单数', width: 80, align: 'right' },
                    { field: 'totalPrice', title: '购买金额', dataType: "money", width: 80, align: 'right' }
                ]]
            },
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    }
};

$(function () {
    pageList.init();
});

//供应商帐号管理
function accountManager(vendorId, vendorName, evt) {
    if (evt) {
        xsjs.stopPropagation(evt);
    }
    var url = "/VendorAccount/VendorAccountList?vendorId=" + vendorId + "&vendorName=" + escape(vendorName);
    var title = "帐号管理";
    xsjs.addTabs({ title: title, url: url });
}