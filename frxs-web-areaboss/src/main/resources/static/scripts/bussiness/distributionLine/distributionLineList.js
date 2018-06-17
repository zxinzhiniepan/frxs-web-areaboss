/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var toolbarArray = new Array();
var xsTdAction = new Array();
var isAddAndEdit = null;//添加/编辑
var isDelete = null;
$(function () {
    isAddAndEdit = XSLibray.authorize(76, 245);
    isDelete = XSLibray.authorize(76, 300);
    if (isAddAndEdit){
        toolbarArray.push("添加");
        toolbarArray.push("编辑");
        xsTdAction.push("编辑");
    }
    if (isDelete){
        toolbarArray.push("删除");
        xsTdAction.push("删除");
    }
    })
var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "id",
            },
            edit: {
                minHeight: 260,
                maxHeight: 360,
                width: 600,
                title: "添加配送线路",
                editTitle: "编辑配送线路",
                url: contextPath+"/distributionLine/editDistributionLine"
            },
            //导航选项
            nav: ["仓库管理", "配送线路"],
            //搜索栏选项
            search: [
                { text: "配送线路", attributes: { name: "lineName" } },
                { text: "配送员", attributes: { name: "distributionClerkName" } },
                { text: "所属仓库", type: "warehouse",
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
                pageSize: 10,
                url: contextPath+"/distributionLine/getPageList",
                fitColumns: false,
                idField: 'id',         //主键
                sortOrder: "desc",
                sortName: "id",
                //checkOnSelect: false,
                //selectOnCheck: false,
                //singleSelect: true,
                columns: [[
                    { field: 'id', checkbox: true },
                    { field: 'lineName', title: '配送线路', width: 260 },
                    //{ field: 'LineSort', title: '顺序', width: 40 },
                    //{ field: 'SupplierNo', title: '门店编号', width: 60 },
                    //{ field: 'StoreName', title: '门店名称', width: 200 },
                    { field: 'distributionClerkName', title: '配送员', width: 80, align: 'center', formatter:function(val,rec){
                                return '配送员'
                        }},
                    { field: 'distributionClerkTel', title: '配送员联系电话', width: 100, align: 'center', formatter:function(val,rec){
                            return '400-600-2200'
                        } },
                    { field: 'warehouseName', title: '配送仓库', width: 100, align: 'center'},
                    //{ field: 'DetailAddress', title: '门店地址', width: 300 },
                ]],
                onClickRow: function () {
                    return false;
                },
                onLoadSuccess: function (data) {
                    //var rows = data.rows;
                    //pageList.editFiled();
                },
                xsTdAction: xsTdAction
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
            toolbar: toolbarArray
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