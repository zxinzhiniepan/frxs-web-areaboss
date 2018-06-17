
var time=new Date();
var nowDate = time.getFullYear() + '-' + (time.getMonth()+1) + '-'+ time.getDate();
var toolbarArray = new Array();
var isExport = null;
$(function () {
    isExport = XSLibray.authorize(62, 154);
    if(isExport){
         /*toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath+ "/report/downloadSaleReport"   //必填  下载地址
         });*/
        toolbarArray.push({
            text: "导出",             //必填（导出 或 export）
            iconCls: "icon-excel",
            handler: function () {
                exportExcel();
            }
        })

    }
});

var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {
        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: ""
            },
            //导航选项
            nav: ["商品配送报表"],
            edit: {},
            onSearchReset: function () {
                $("#orderStarDateTime").val(nowDate);

            },
            //搜索栏选项
            search: [
                {
                    text: "订单生效日期", type: "datetime", attributes: {
                        name: "orderStarDateTime",
                        id: 'orderStarDateTime',
                        value: nowDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\\\'orderEndDateTime\\\')}'})"
                    }, column: 2
                },
                {
                    text: "&nbsp;&nbsp;--至--&nbsp;&nbsp;", type: "datetime", attributes: {
                    name: "orderEndDateTime",
                    id: 'orderEndDateTime',
                    value: nowDate,
                    onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\\\'orderStarDateTime\\\')}'})"
                    }
                },
                 { text: "&nbsp;商品编码", attributes: { name: "sku" } },
                { text: "商品名称", attributes: { name: "productName" } },
                { type: "<br>" },
                
                { text: "订单付款时间", type: "datetime", attributes: { name: "orderPayStartDateTime" }, column: 2 },
                { text: "&nbsp;&nbsp;--至--&nbsp;&nbsp;", type: "datetime", attributes: { name: "orderPayEndDateTime" } },
                 { text: "供应商编码", attributes: { name: "vendorCode" } },
                 { text: "仓库", type: "warehouse",
                    attributes: {
                        name: "warehouseIds",
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
                url: contextPath+ "/report/getSaleReport",
                fitColumns: false,
                idField: '',
                singleSelect: true,
                showFooter: true,
                columns: [[
                    { field: 'rowIndex', title: '配送额排名', width: 80, align: 'center' },
                    {
                        field: 'expiryDateStart', title: '发布时间', width: 130, align: 'center', formatter: function (val) {
                            return xsjs.dateFormat(val, "yyyy-MM-dd HH:mm:ss");
                        }
                    },
                    { field: 'sku', title: '商品编码', width: 80, align: 'center' },
                    { field: 'productName', title: '商品名称', width: 200, align: 'left', formatter: XSLibray.formatText },
                    { field: 'skuContent', title: '规格', width: 60, align: 'center' },
                    { field: 'vendorCode', title: '供应商编码', width: 80, align: 'center' },
                    { field: 'vendorName', title: '供应商', width: 180, align: 'left', formatter: XSLibray.formatText },
                    {
                        field: 'shipmentQty', title: '订单量', width: 60, align: 'right', formatter: function (val, rowData, rowIndex) {
                            if (rowData.shipmentQty > 0 && rowData.sku != null) {
                                var sku = rowData.sku;
                                var detailDtoList = JSON.stringify(rowData.detailDtoList);
                                return "<a class='datagrid-row-a' href='javascript:void(0);' onclick='productsOrderInfo(" +  sku + "," + detailDtoList + ")'><font style='color:#0066CC;'>" + val + "</font></a>";
                            }
                            else {
                                return val;
                            }
                        }
                    },
                    { field: 'price', title: '单价', dataType: "money", width: 60, align: 'right' },
                    { field: 'qty', title: '订货数量（份）', width: 100, align: 'right' },
                    { field: 'sumSalePrice', title: '配送金额', dataType: "money", width: 70, align: 'right' },
                    { field: 'commission', title: '每份门店提成', dataType: "money", width: 80, align: 'right' },
                    { field: 'platformAmt', title: '平台服务费(份)', dataType: "money", width: 100, align: 'right' },
                    { field: 'sumCommission', title: '门店提成', dataType: "money", width: 70, align: 'right' },
                    { field: 'sumPlatformAmt', title: '平台服务费', dataType: "money", width: 80, align: 'right' },
                    { field: 'supplyPrice', title: '应付供应商', dataType: "money", width: 80, align: 'right' }
                ]]
            },
            onSearchVerify: function () {
                var warehouse = $("input[name='warehouseIds']").is(":checked");
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
    }
};

$(function () {
    pageList.init();
});

function productsOrderInfo(sku,detailDtoList,evt) {
    if (evt) {
        xsjs.stopPropagation(evt);
    }
    var detailDtoList = JSON.stringify(detailDtoList);
    localStorage.setItem("rows",JSON.stringify(detailDtoList));

    var url = contextPath+ "/report/productsOrderInfo?detailDtoList=" + sku;
    xsjs.addTabs({
        url: url,
        type : 'json',
        data : detailDtoList,
        title: "商品配送表详情",
        win: window
    });
}

function exportExcel(options) {
    xsjs.ajax({
        url: contextPath+"/report/distributionExcel",
        data: pageList.grid.getSearchTrim(),
        type: "POST",
        loadMsg: "正在下载，请稍候...",
        success: function (data) {
            //
            if (data.rspCode == "success" ) {
                var fileName = encodeURI(data.record);
                setTimeout(function () {
                    window.location.href = contextPath+"/storeProfile/exportExcel?fileName="+ fileName;
                }, 500);

            }else{
                window.top.$.messager.alert("温馨提示", data.rspDesc, "error");
            }
        },
        error: function () {
            $.messager.alert("温馨提示", "excel导出失败", "error");
        }
    });
}

/*
function exportData(options){

    var colNameMap = {
        "rowIndex": "配送额排名",
        "wareHouseName": "配送仓库",
        "expiryDateStart": "发布时间",
        "sku": "商品编码",
        "productName": "商品名称",
        "skuContent": "规格",
        "vendorCode": "供应商编码",
        "vendorName": "供应商",
        "shipmentQty": "订单量",
        "price": "单价",
        "qty": "订货数量（份）",
        "sumSalePrice": "配送金额",
        "commission": "每份门店提成",
        "platformAmt": "平台服务费(份)",
        "sumCommission": "门店提成",
        "sumPlatformAmt": "平台服务费",
        "supplyPrice": "应付供应商"
    };

    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var fileName = "商品配送列表_" + timeStr;

    xsjs.ajax({
        url: options.action,
        data: options.data,
        success: function (data) {
            var list = data;
            if (list) {
                for(var i in list){
                    if(list[i].price !=null){
                        list[i].price = list[i].price.toFixed(2);
                    }
                    if(list[i].sumSalePrice !=null){
                        list[i].sumSalePrice = list[i].sumSalePrice.toFixed(2);
                    }
                    if(list[i].commission !=null){
                        list[i].commission = list[i].commission.toFixed(2);
                    }
                    if(list[i].platformAmt !=null){
                        list[i].platformAmt = list[i].platformAmt.toFixed(2);
                    }
                    if(list[i].sumCommission !=null){
                        list[i].sumCommission = list[i].sumCommission.toFixed(2);
                    }
                    if(list[i].sumPlatformAmt !=null){
                        list[i].sumPlatformAmt = list[i].sumPlatformAmt.toFixed(2);
                    }
                    if(list[i].supplyPrice !=null){
                        list[i].supplyPrice = list[i].supplyPrice.toFixed(2);
                    }
                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}*/
