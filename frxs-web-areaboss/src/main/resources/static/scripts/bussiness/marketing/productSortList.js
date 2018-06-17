var toolbarArray = new Array();
var xsTdAction = new Array();
var isExport = null;

toolbarArray.push({
    iconCls: "icon-save",
    text: "保存",
    handler: function () {
        pageList.UpProductSort();
    }
});

$(function () {
    isExport = XSLibray.authorize(96, 224);
    if(isExport){
        xsTdAction.push("导出");
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+"/productSort/productSortsExport"   //必填  下载地址
        });
    }
});

var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "activityId",
            },

            onSearchVerify: function () {
                var tmDisplayStart = $("#tmDisplayStart");

                if ($.trim(tmDisplayStart.val()).length == 0) {
                    $.messager.alert("温馨提示", "请选择显示日期", "info", function () {
                        tmDisplayStart.focus();
                    });
                    return false;
                }


                return true;
            },
            //导航选项
            nav: ["商品显示顺序调整"],
            //搜索栏选项
            search: [
                {
                    text: "显示日期", type: "datetime", attributes: {
                        id: 'tmDisplayStart',
                        name: "showStartTime",
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd'})",
                        value: xsjs.dateFormat(+(new Date()) + (0 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
                    }
                },

                {
                    text: "活动状态", type: "select", attributes: { name: "activityStatus" },
                    option: [
                        { text: "全部", value: "" },
                        { text: "未开始", value: "0" },
                        { text: "进行中", value: "1" },
                        { text: "已结束", value: "2" }
                    ]
                },

                { text: "商品名称", attributes: { name: "productName" }, column: 2 },
                { text: "&nbsp;&nbsp;商品编码：", attributes: { name: "sku" } },
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/productSort/getProductSort",
                width: $(window).width() - 5,

                fitColumns: false,
                idField: 'activityId',         //主键
                columns: [[
                    {
                        field: 'activityId', checkbox: true, formatter: function (value, rows) {
                            return "";
                        }
                    },
                    {field: 'preproductId',title: '预售活动id',width: 170,hidden:'true'},
                    { 
                        field: 'tmDisplayStart', title: '显示日期', width: 230, align: 'center', formatter:function (value, rows) {
                            return xsjs.dateFormat(value,"yyyy-MM-dd") + " 至 " + xsjs.dateFormat(rows.tmDisplayEnd,"yyyy-MM-dd");
                        }},
                    { field: 'productName', title: '商品名称', width: 260, formatter: XSLibray.formatText },
                    { field: 'sku', title: '商品编码', width: 150, align: 'center' },
                    { field: 'attrs', title: '规格', width: 80 , formatter: function (value) {
                            if(value!=null){
                                return value[0].attrVal;
                            }
                        } },
                    { field: 'packageQty', title: '包装数', width: 70, align: 'right' },
                    { field: 'vendorCode', title: '供应商编码', width: 100, align: 'center' },
                    { field: 'vendorName', title: '供应商名称', width: 150, formatter: XSLibray.formatText },
                    {
                        field: 'sortSeq', title: '商品排序', width: 70, dataType: "int", sortable: true, align: 'right',
                        editor: {
                            type: 'numberbox',
                            options: { precision: 0, min: 0, max: 999999 }
                        }
                    },
                    { field: 'saleAmt', title: '价格', width: 70, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.toFixed(2);
                        }},
                    { field: 'marketAmt', title: '市场价', width: 70, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.toFixed(2);
                        }},
                    { field: 'perServiceAmt', title: '平台服务费', width: 70, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.toFixed(2);
                        }},
                    { field: 'perCommission', title: '每份提成', width: 70, align: 'right' , formatter: function (val) {
                            if(val==null){
                                return "0.00";
                            }
                            return val.toFixed(2);
                        }},

                ]],
                pagination:false,
                onLoadSuccess: function (data) {
                    //$(data.rows).each(function () {

                    //    pageList.editFiled();
                    //});
                    $(data.rows).each(function (i) {
                        pageList.grid.getGrid.datagrid('beginEdit', i);
                    });
                },
                onDblClickRow: function (rowIndex, rowData) {

                },
                // xsTdAction: xsTdAction
            },
            toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    //刷新列表
    loadList: function () {
        document.body.options.reload();
    },


    UpProductSort: function () {
        $(pageList.grid.getGrid.datagrid("getRows")).each(function (i) {
            pageList.grid.getGrid.datagrid('endEdit', i);
            pageList.grid.getGrid.datagrid('beginEdit', i);
        });

        var editData = pageList.grid.getGrid.datagrid("getRows");
        var data = new Array();
        $(editData).each(function () {
            data.push({
                preproductId: this.preproductId,
                sortSeq: this.sortSeq
            });
        });

        $.ajax({
            url: contextPath+"/productSort/saveProductSort",
            loadMsg: "正在保存数据，请稍候...",
            data: {
                activityPreproduct: JSON.stringify(data)
            },
            success: function (data) {
                window.top.$.messager.alert("温馨提示", data.rspDesc, (data.rspCode == "success" ? "info" : "error"), function () {
                    if (data.rspCode == "success") {
                        location.reload();
                    }
                });
            },
            error: function () {

            }
        })
    }
};

$(function () {
    pageList.init();
});

function exportData(options){
    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var colNameMap = {
        "tmDisplayEnd": "显示日期",
        "productName": "商品名称",
        "sku": "商品编码",
        "attrs": "规格",
        "packageQty": "包装数",
        "vendorCode": "供应商编码",
        "vendorName": "供应商名称",
        "sortSeq": "商品排序",
        "saleAmt": "价格",
        "marketAmt": "市场价",
        "perServiceAmt": "平台服务费",
        "perCommission": "每份提成"
    };

    var fileName = "商品显示顺序调整_"+timeStr;

    xsjs.ajax({
        url: options.action,
        data: options.data,
        loadMsg: "正在导出数据，请稍候...",
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    list[i].tmDisplayEnd = xsjs.dateFormat(list[i].tmDisplayStart,"yyyy-MM-dd")+'至'+xsjs.dateFormat(list[i].tmDisplayEnd,"yyyy-MM-dd") ;
                    if(list[i].attrs!=null){
                        list[i].attrs = list[i].attrs[0].attrVal;
                    }
                    if(list[i].saleAmt != null){
                        list[i].saleAmt = list[i].saleAmt.toFixed(2);
                    }
                    if(list[i].marketAmt !=null){
                        list[i].marketAmt = list[i].marketAmt.toFixed(2);
                    }
                    if(list[i].perServiceAmt !=null){
                        list[i].perServiceAmt = list[i].perServiceAmt.toFixed(2);
                    }
                    if(list[i].perCommission !=null){
                        list[i].perCommission = list[i].perCommission.toFixed(2);
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}