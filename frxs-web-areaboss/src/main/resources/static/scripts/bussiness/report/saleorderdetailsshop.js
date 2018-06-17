$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();

    //供应商-代购员事件绑定
    eventBind();

    //grid高度改变
    gridresize();
    //select下拉框自适应高度    


    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
});


function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}

function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,                   //显示行编号

        pagination: true,                   //是否显示分页
        showFooter: true,
        pageSize: 30,
        pageList: [30, 50, 100, 300],
        //frozenColumns: [[
        //    { title: '门店编号', field: 'ShopCode', width: 80, align: 'center' },
        //    { title: '门店名称', field: 'ShopName', width: 160 },
        //]],

        frozenColumns: [[
                { title: '门店编号', field: 'ShopCode', width: 80, align: 'center' },
                { title: '门店名称', field: 'ShopName', width: 160 },
                { title: '商品编号', field: 'SKU', width: 80 }
        ]],
        columns: [[
            { title: '商品名称', field: 'ProductName', width: 260 },
            {
                title: '商品类型', field: 'IsNoStock', width: 100, align: 'left', formatter: function (value) {
                    if (value == 0) {
                        return "有库存商品";
                    }
                    else if (value == 1) {
                        return "无库存商品";
                    }
                    else {
                        return "";
                    }
                }
            },
            { title: '代购员', field: 'EmpName', width: 80 },
            { title: '供应商', field: 'VendorName', width: 200 },
            { title: '商品大类', field: 'CategoryId1Name', width: 120 },
            { title: '商品二级分类', field: 'CategoryId2Name', width: 120 },
            { title: '商品三级分类', field: 'CategoryId3Name', width: 120 },
            {
                title: '配送数量', field: 'SaleQty', width: 60, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '配送成本金额', field: 'SaleAmount', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送平台费用', field: 'SalePoint', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
                {
                    title: '配送金额', field: 'SaleAmount1', width: 80, align: 'right', formatter: function (value, rec) {
                        return parseFloat(rec.SaleAmount).toFixed(4);
                    }
                },
                {
                    title: '合计配送金额', field: 'SaleTotalAmount', width: 100, align: 'right', formatter: function (value) {
                        value = value ? value : 0;
                        return parseFloat(value).toFixed(4);
                    }
                },
                {
                    title: '门店积分', field: '门店积分', width: 70, align: 'right', formatter: function (value) {
                        value = value ? value : 0;
                        return parseFloat(value).toFixed(2);
                    }
                },
            {
                title: '退货数量', field: 'BackQty', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '退货成本金额', field: 'BackAmount', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '退货平台费用', field: 'BackPoint', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '退货金额', field: 'BackAmount1', width: 80, align: 'right', formatter: function (value, rec) {
                    return parseFloat(rec.BackAmount).toFixed(4);
                }
            },
                {
                    title: '合计退货金额', field: 'BackTotalAmount', width: 80, align: 'right', formatter: function (value) {
                        value = value ? value : 0;
                        return parseFloat(value).toFixed(4);
                    }
                },
            {
                title: '合计平台费用', field: 'TotalPoint', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '合计成本金额', field: 'TotalAmount', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '净配送额', field: '净销售', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            }
        ]],
        toolbar: [
           {
               id: 'btnExport',
               text: '导出',
               iconCls: 'icon-daochu',
               handler: exportoutToPage //exportout
           }]
        //,
        //view: detailview,
        //detailFormatter: function (index, row) {
        //    return '<div class="xs-list-subgrid"><div class="xs-list-subgrid-topDetail"></div><div class="xs-list-subgrid-list"><table class="ddv"></table></div></div>';
        //},
        //onExpandRow: function (index, row) {
        //    expandRow(this, index, row);
        //}
    });
}

//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    $('#grid').datagrid({
        url: '../SalesReport/GetGetCustomerSaleDetailsReportList',//(1)客户配送情况汇总表
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        fit: false,                         //分页在最下面
        fitColumns: false,                   //列均匀分配
        striped: false,                     //奇偶行是否区分
        //设置点击行为单选，点击行中的复选框为多选
        checkOnSelect: true,
        selectOnCheck: true,
        onClickRow: function (rowIndex) {
            $('#grid').datagrid('clearSelections');
            $('#grid').datagrid('selectRow', rowIndex);
        },
        queryParams: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S4: $("#S4").val(),
            S5: $("#S5").val(),
            nKind: 1,
            SubWID: $("#SubWID").combobox('getValue'),
            S10: $("#S10").val(),
            S11: $("#S11").val() ? ($("#S11").val() + " 23:59:59") : "",
            S6: $("#S6").val(),
            S7: $("#S7").val(),
            S8: $("#S8").val(),
            S9: $("#S9").val(),
            getDateType: 2,
            IsNoStock: $("#IsNoStock").combobox("getValue")
        }
    });
}

function resetSearch() {
    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#S3").attr("value", "");

    $("#S4").val('');
    $("#S5").val('');
    $("#SubWID").combobox('setValue', '');

    $("#ShopCode").attr("value", "");
    $("#ShopName").attr("value", "");

    $("#S10").val('');
    $("#S11").val('');

    $("#VendorCode").attr("value", "");
    $("#VendorName").attr("value", "");
    $("#BuyEmpName").attr("value", "");

    $("#IsNoStock").combobox("setValue", '');

    $("#S6").val('');
    $("#S7").val('');
    $("#S8").val('');
    $("#S9").val('');
}

function initDDL() {
    $.ajax({
        url: '../Common/GetWCList',
        type: 'get',
        data: {},
        success: function (data) {
            //在第一个Item加上请选择
            data = $.parseJSON(data);
            data.unshift({ "WID": "", "WName": "-请选择-" });
            //创建控件
            $("#SubWID").combobox({
                data: data,             //数据源
                valueField: "WID",       //id列
                textField: "WName"      //value列
            });
            $("#SubWID").combobox('select', data[0].WID);
        }
    });
}



//窗口大小改变
$(window).resize(function () {
    gridresize();
});


//grid高度改变
function gridresize() {
    var h = ($(window).height() - $("fieldset").height() - 21);
    $('#grid').datagrid('resize', {
        width: $(window).width() - 10,
        height: h
    });
}

function selShop() {
    var shopCode = $("#ShopCode").val();
    var shopName = $("#ShopName").val();
    frxs.dialog({
        title: "选择门店",
        url: "../AccountDetails/SelectShop?shopCode=" + encodeURIComponent(shopCode) + "&shopName=" + encodeURIComponent(shopName),
        owdoc: window.top,
        width: 850,
        height: 500
    });
}

//回填门店
function backFillShop(shopID, shopCode, shopName) {
    $("#S3").val(shopID);
    $("#ShopCode").val(shopCode);
    $("#ShopName").val(shopName);
}


//供门店 回车事件绑定
function eventBind() {
    $("#ShopCode").keydown(function (e) {
        if (e.keyCode == 13) {
            eventShop();
        }
    });

    $("#ShopName").keydown(function (e) {
        if (e.keyCode == 13) {
            eventShop();
        }
    });
}

//门店 回车事件
function eventShop() {
    $.ajax({
        url: "../Common/GetShopInfo",
        type: "post",
        data: {
            shopCode: $("#ShopCode").val(),
            shopName: $("#ShopName").val(),
            page: 1,
            rows: 200
        },
        success: function (obj) {
            var obj = JSON.parse(obj);
            if (obj.total == 1) {
                $("#S3").val(obj.rows[0].ShopID);
                $("#ShopCode").val(obj.rows[0].ShopCode);
                $("#ShopName").val(obj.rows[0].ShopName);
            } else {
                selShop();
            }
        }
    });
}


function selBuyEmp() {
    frxs.dialog({
        title: "选择代购员",
        url: "../BuyOrderPre/SelectBuyEmp?buyEmpName=" + encodeURIComponent($("#BuyEmpName").val()),
        owdoc: window.top,
        width: 850,
        height: 500
    });
}

//回填代购员
function backFillBuyEmp(empId, empName) {
    $("#S9").val(empId);
    $("#BuyEmpName").val(empName);
}


//供应商
function selVendor() {
    var vendorCode = $("#VendorCode").val();
    var vendorName = $("#VendorName").val();
    frxs.dialog({
        title: "选择供应商",
        url: "../BuyOrderPre/SelectVendor?vendorCode=" + encodeURIComponent(vendorCode) + "&vendorName=" + encodeURIComponent(vendorName),
        owdoc: window.top,
        width: 850,
        height: 500
    });
}

//回填供应商
function backFillVendor(vendorId, vendorCode, vendorName) {
    $("#S8").val(vendorId);
    $("#VendorCode").val(vendorCode);
    $("#VendorName").val(vendorName);
}



//供应商-代购员事件绑定
function eventBind() {
    $("#VendorCode").keydown(function (e) {
        if (e.keyCode == 13) {
            eventVendorCodeName();
        }
    });

    $("#VendorName").keydown(function (e) {
        if (e.keyCode == 13) {
            eventVendorCodeName();
        }
    });

    $("#BuyEmpName").keydown(function (e) {
        if (e.keyCode == 13) {
            eventBuyEmp();
        }
    });
}


//供应商名称Code
function eventVendorCodeName() {
    $.ajax({
        url: "../Common/GetVendorInfo",
        type: "post",
        data: {
            VendorCode: $("#VendorCode").val(),
            VendorName: $("#VendorName").val(),
            page: 1,
            rows: 200
        },
        success: function (obj) {
            var parseobj = JSON.parse(obj);
            if (parseobj.total == 1) {
                $("#S8").val(parseobj.rows[0].VendorID);
                $("#VendorCode").val(parseobj.rows[0].VendorCode);
                $("#VendorName").val(parseobj.rows[0].VendorName);
            } else {
                selVendor();
            }
        }
    });
}

//代购员
function eventBuyEmp() {
    $.ajax({
        url: "../Common/GetBuyEmpInfo",
        type: "post",
        data: {
            EmpName: $("#BuyEmpName").val(),
            page: 1,
            rows: 200
        },
        success: function (obj) {
            var parseobj = JSON.parse(obj);
            if (parseobj.total == 1) {
                $("#S9").val(parseobj.rows[0].EmpID);
                $("#BuyEmpName").val(parseobj.rows[0].EmpName);
            } else {
                selBuyEmp();
            }
        }
    });
}


//导出 新代码
function exportoutToPage() {
    var loading = frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    //var text = exportExcel();
    //if (text) {
    //    event.preventDefault();
    //    var bb = self.Blob;
    //    saveAs(
    //        new bb(
    //            ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
    //            , { type: "html/plain;charset=utf8" }
    //        ), "客户配送情况明细汇总查询导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    $.ajax({
        type: "post",
        dataType: "json",
        url: '../SalesReport/GetGetCustomerSaleDetailsReportList',
        data: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S4: $("#S4").val(),
            S5: $("#S5").val(),
            nKind: 1,
            SubWID: $("#SubWID").combobox('getValue'),
            IsNoStock: $("#IsNoStock").combobox("getValue"),
            S10: $("#S10").val(),
            S11: $("#S11").val() ? ($("#S11").val() + " 23:59:59") : "",
            S6: $("#S6").val(),
            S7: $("#S7").val(),
            S8: $("#S8").val(),
            S9: $("#S9").val()
        },
        success: function (data) {
            if (data.Flag && data.Flag == 3) {
                $.messager.alert("提示", "导出失败!", "info");
            }
            else {
                exportExcel(data);
            }
            loading.close();
        },
        error: function () {
            $.messager.alert("提示", "导出失败!", "info");
            loading.close();
        }
    });
}

//客户端导出Excel
function exportExcel(data) {
    var rows = data && data.rows ? data.rows : [];// $("#grid").datagrid("getRows");
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    trtdCode += "<td>商品编号</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品类型</td>";

    trtdCode += "<td>代购员</td>";
    trtdCode += "<td>供应商</td>";
    trtdCode += "<td>商品大类</td>";
    trtdCode += "<td>商品二级分类</td>";
    trtdCode += "<td>商品三级分类</td>";

    trtdCode += "<td>配送数量</td>";
    trtdCode += "<td>配送成本金额</td>";
    trtdCode += "<td>配送平台费用</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>合计配送金额</td>";
    trtdCode += "<td>门店积分</td>";

    trtdCode += "<td>退货数量</td>";
    trtdCode += "<td>退货成本金额</td>";
    trtdCode += "<td>退货平台费用</td>";
    trtdCode += "<td>退货金额</td>";
    trtdCode += "<td>合计退货金额</td>";
    trtdCode += "<td>合计平台费用</td>";
    trtdCode += "<td>合计成本金额</td>";
    //trtdCode += "<td>合计销售</td>";  
    trtdCode += "<td>净配送额</td>";

    trtdCode += "</tr>";

    for (var i = 0; i < rows.length; i++) {
        trtdCode += "<tr>";

        trtdCode += "<td style='height:20px' x:str=\"'" + rows[i].ShopCode + "\">" + rows[i].ShopCode + "</td>";//门店编号
        trtdCode += "<td>" + frxs.replaceCode(rows[i].ShopName) + "</td>";//门店名称

        trtdCode += "<td x:str=\"'" + rows[i].SKU + "\">" + frxs.replaceCode(rows[i].SKU) + "</td>";//商品编码
        trtdCode += "<td>" + frxs.replaceCode(rows[i].ProductName) + "</td>";//商品名称

        var isNoStockStr = "";
        if (rows[i].IsNoStock == 0) {
            isNoStockStr = "有库存商品";
        }
        else if (rows[i].IsNoStock == 1) {
            isNoStockStr = "无库存商品";
        }
        trtdCode += "<td>" + isNoStockStr + "</td>";

        trtdCode += "<td>" + frxs.replaceCode(rows[i].EmpName) + "</td>";//代购员
        trtdCode += "<td>" + frxs.replaceCode(rows[i].VendorName) + "</td>";//供应商名称
        trtdCode += "<td>" + frxs.replaceCode(rows[i].CategoryId1Name) + "</td>";//分类一名称
        trtdCode += "<td>" + frxs.replaceCode(rows[i].CategoryId2Name) + "</td>";//分类二名称
        trtdCode += "<td>" + frxs.replaceCode(rows[i].CategoryId3Name) + "</td>";//分类三名称


        trtdCode += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!rows[i].SaleQty) ? "0" : rows[i].SaleQty) + "</td>";                    //配送数量 浏览器中显示0为空，导出时统一为0
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].SaleAmount) ? "0" : rows[i].SaleAmount) + "</td>";            //配送成本金额 浏览器中显示0为空，导出时统一为0
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].SalePoint) ? "0" : rows[i].SalePoint) + "</td>";              //配送平台费用 浏览器中显示0为空，导出时统一为0
        //****trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].SaleTotalAmount) ? "0" : rows[i].SaleTotalAmount) + "</td>";  //配送金额 浏览器中显示0为空，导出时统一为0
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].SaleAmount) ? "0" : rows[i].SaleAmount) + "</td>";  //配送金额=配送成本金额 浏览器中显示0为空，导出时统一为0
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].SaleTotalAmount) ? "0" : rows[i].SaleTotalAmount) + "</td>";//合计配送金额
        trtdCode += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!rows[i].门店积分) ? "0" : rows[i].门店积分) + "</td>";
        trtdCode += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!rows[i].BackQty) ? "0" : rows[i].BackQty) + "</td>";                    //退货数量 浏览器中显示0为空，导出时统一为0
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].BackAmount) ? "0" : rows[i].BackAmount) + "</td>";            //退货成本金额 浏览器中显示0为空，导出时统一为0
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].BackPoint) ? "0" : rows[i].BackPoint) + "</td>";              //退货平台费用 浏览器中显示0为空，导出时统一为0
        //***trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].BackTotalAmount) ? "0" : rows[i].BackTotalAmount) + "</td>";  //退货金额 浏览器中显示0为空，导出时统一为0
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].BackAmount) ? "0" : rows[i].BackAmount) + "</td>";  //退货金额=退货成本金额 浏览器中显示0为空，导出时统一为0
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].BackTotalAmount) ? "0" : rows[i].BackTotalAmount) + "</td>";//合计退货金额
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].TotalPoint) ? "0" : rows[i].TotalPoint) + "</td>";            //合计平台费用 浏览器中显示0为空，导出时统一为0
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].TotalAmount) ? "0" : rows[i].TotalAmount) + "</td>";          //合计成本金额 浏览器中显示0为空，导出时统一为0
        //trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].TotalAmt) ? "0" : rows[i].TotalAmt) + "</td>";                //合计配送金额 浏览器中显示0为空，导出时统一为0
        //trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].合计销售) ? "0" : rows[i].合计销售) + "</td>";
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!rows[i].净销售) ? "0" : rows[i].净销售) + "</td>";//净销售
        //线路名称

        trtdCode += "</tr>";
    }

    var dataCode = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>';
    dataCode = dataCode.replace("{table}", trtdCode);
    //return dataCode;

    if (dataCode) {
        event.preventDefault();
        var bb = self.Blob;
        saveAs(
            new bb(
                ["\ufeff" + dataCode] //\ufeff防止utf8 bom防止中文乱码
                , { type: "html/plain;charset=utf8" }
            ), "客户配送情况明细汇总查询导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}

///明细表
function expandRow(obj, index, row) {

    ////绑定促销列表
    //this.bindSubgridList(obj, index, row);
    var ddv = $(obj).datagrid('getRowDetail', index).find('table.ddv');

    ddv.datagrid({
        title: "客户销售情况明细汇总表",
        url: '../SalesReport/GetGetCustomerSaleDetailsReportList',//(1)客户配送情况汇总表
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        rownumbers: true,                   //显示行编号
        pagination: true,                   //是否显示分页
        showFooter: true,
        pageSize: 30,
        pageList: [10, 30, 50, 100, 300],
        height: 270,
        fit: false,                         //分页在最下面
        fitColumns: false,                   //列均匀分配
        striped: false,                     //奇偶行是否区分
        ////设置点击行为单选，点击行中的复选框为多选
        checkOnSelect: false,
        selectOnCheck: false,
        queryParams: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S4: row.ShopCode,
            S5: row.ShopCode,
            nKind: 1,
            SubWID: $("#SubWID").combobox('getValue'),
            S10: $("#S10").val(),
            S11: $("#S11").val() ? ($("#S11").val() + " 23:59:59") : "",
            IsNoStock: $("#IsNoStock").combobox("getValue"),
            S6: $("#S6").val(),
            S7: $("#S7").val(),
            S8: $("#S8").val(),
            S9: $("#S9").val(),
            getDateType: 2
        },
        frozenColumns: [[
            { title: '商品编号', field: 'SKU', width: 80 },
            { title: '商品名称', field: 'ProductName', width: 260 }
        ]],
        columns: [[
            { title: '门店编号', field: 'ShopCode', width: 80, align: 'center' },
            { title: '门店名称', field: 'ShopName', width: 160 },
            { title: '代购员', field: 'EmpName', width: 80 },
            { title: '供应商', field: 'VendorName', width: 200 },
            { title: '商品大类', field: 'CategoryId1Name', width: 120 },
            { title: '商品二级分类', field: 'CategoryId2Name', width: 120 },
            { title: '商品三级分类', field: 'CategoryId3Name', width: 120 },
            {
                title: '配送数量', field: 'SaleQty', width: 60, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '配送成本金额', field: 'SaleAmount', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送平台费用', field: 'SalePoint', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
             {
                 title: '配送金额', field: 'SaleAmount1', width: 80, align: 'right', formatter: function (value, rec) {
                     return parseFloat(rec.SaleAmount).toFixed(4);
                 }
             },
             {
                 title: '合计配送金额', field: 'SaleTotalAmount', width: 100, align: 'right', formatter: function (value) {
                     value = value ? value : 0;
                     return parseFloat(value).toFixed(4);
                 }
             },
             {
                 title: '门店积分', field: '门店积分', width: 70, align: 'right', formatter: function (value) {
                     value = value ? value : 0;
                     return parseFloat(value).toFixed(2);
                 }
             },
            {
                title: '退货数量', field: 'BackQty', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '退货成本金额', field: 'BackAmount', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '退货平台费用', field: 'BackPoint', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '退货金额', field: 'BackAmount1', width: 80, align: 'right', formatter: function (value, rec) {
                    return parseFloat(rec.BackAmount).toFixed(4);
                }
            },
             {
                 title: '合计退货金额', field: 'BackTotalAmount', width: 80, align: 'right', formatter: function (value) {
                     value = value ? value : 0;
                     return parseFloat(value).toFixed(4);
                 }
             },
            {
                title: '合计平台费用', field: 'TotalPoint', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '合计成本金额', field: 'TotalAmount', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '净配送额', field: '净销售', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            }
        ]]
    });

    //设置当前行行高
    $('#grid').datagrid('fixDetailRowHeight', index);
}