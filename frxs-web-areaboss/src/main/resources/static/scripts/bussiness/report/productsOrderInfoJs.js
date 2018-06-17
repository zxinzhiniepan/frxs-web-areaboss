var list = JSON.parse(localStorage.getItem("rows"));
var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function (list) {
        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: ""
            },
            //导航选项
            nav: ["商品配送报表"],
            edit: {},
            //搜索栏选项
            // search: [],
            //数据列表选项
            datagrid: {
                data: JSON.parse(list),
                fitColumns: false,
                idField: '',
                singleSelect: true,
                showFooter: true,
                columns: [[
                    { field: 'orderId', title: '订单编号', width: 120, align: 'center' },
                    { field: 'storeNo', title: '门店编号', width: 180, align: 'center' },
                    { field: 'storeName', title: '门店名称', width: 100, align: 'left' },
                    { field: 'qty', title: '订货数量', width: 100, align: 'center' }
                ]]
            },
            toolbar: toolbarArray
        };
        this.grid = xsjs.datagrid(options);
    }
};
var toolbarArray = new Array();
var isExport = null;

$(function () {
    xsjs.ajax({
        success: function (data) {
        }
    })

    pageList.init(list);

    isExport = XSLibray.authorize(62, 154);
    if(isExport){
        // toolbarArray.push({
        //     action: "导出",             //必填（导出 或 export）
        //     url: contextPath+ "/report/downloadMerchandiseSaleReport"   //必填  下载地址
        // });

        toolbarArray.push({
            text: '导出', handler:function () {
                $('.datagrid-view2').tableExport({type:'excel',escape:'false',filename:'(2016-02-29_2016-03-06)'});
            }
        });
    }

});