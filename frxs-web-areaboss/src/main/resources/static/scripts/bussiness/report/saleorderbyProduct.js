//页面加载
$(function () {

    //表格绑定
    initGrid();

    //下拉绑定
    initDDL();

    //供应商-代购员事件绑定
    eventBind();

    //grid高度改变
    gridresize();

    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");

});

//初始化grid
function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,                   //显示行编号
        pagination: true,                   //是否显示分页
        showFooter: true,
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        frozenColumns: [[
              { title: '商品编码', field: 'SKU', width: 60, align: 'center' }
        ]],
        columns: [[

            { title: '商品名称', field: 'ProductName', width: 160, align: 'left', formatter: frxs.formatText },
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
            {
                title: '过账日', field: 'Sett_Date', width: 80, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd") : "";
                }
            },
            { title: '代购员', field: 'BuyEmpName', width: 60, align: 'center', formatter: frxs.formatText },
            { title: '商品分类', field: 'CategoryName', width: 120, align: 'left', formatter: frxs.formatText },
            { title: '供应商', field: 'VendorName', width: 160, align: 'left', formatter: frxs.formatText },
            {
                title: '配送数量', field: 'SaleQty', width: 60, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '配送成本金额', field: 'SaleAmount', width: 80, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送平台费用', field: 'SalePoint', width: 80, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
             //{
             //    title: '配送金额', field: 'SaleTotalAmount', width: 100, align: 'center', formatter: function (value) {
             //        value = (!value) ? 0 : value;
             //        return parseFloat(value).toFixed(4);
             //    }
             //},
                {
                    title: '配送金额', field: 'SaleAmount1', width: 100, align: 'right', formatter: function (value, rec) {
                        value = rec.SaleAmount;
                        value = (!value) ? 0 : value;
                        return parseFloat(value).toFixed(4);
                    }
                },
                //{
                //    title: '合计配送金额', field: 'TotalAmt', width: 150, align: 'center', formatter: function (value) {
                //        value = (!value) ? 0 : value;
                //        return parseFloat(value).toFixed(4);
                //    }
                //},
                {
                    title: '合计配送金额', field: 'SaleTotalAmount', width: 90, align: 'right', formatter: function (value) {
                        value = (!value) ? 0 : value;
                        return parseFloat(value).toFixed(4);
                    }
                },
            {
                title: '退货数量', field: 'BackQty', width: 60, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '退货成本金额', field: 'BackAmount', width: 80, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },

            {
                title: '退货平台费用', field: 'BackPoint', width: 80, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            //{
            //    title: '退货金额', field: 'BackTotalAmount', width: 100, align: 'center', formatter: function (value) {
            //        value = (!value) ? 0 : value;
            //        return parseFloat(value).toFixed(4);
            //    }
            //},
            {
                title: '退货金额', field: 'BackAmount1', width: 70, align: 'right', formatter: function (value, rec) {
                    value = rec.BackAmount;
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '合计退货金额', field: 'BackTotalAmount', width: 90, align: 'right', formatter: function (value) {
                    value = value ? value : 0;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '合计平台费用', field: 'TotalPoint', width: 80, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '合计成本金额', field: 'TotalAmount', width: 80, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
             {
                 title: '净配送额', field: '净销售', width: 80, align: 'right', formatter: function (value) {
                     return parseFloat(value).toFixed(4);
                 }
             },
        ]],
        toolbar: [
           {
               id: 'btnExport',
               text: '导出',
               iconCls: 'icon-daochu',
               handler: exportout
           }]
    });
}

//下拉列表
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


//导出
function exportout() {
    var loading = frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    //var text = exportExcel();
    //if (text) {
    //    event.preventDefault();
    //    var bb = self.Blob;
    //    saveAs(
    //        new bb(
    //            ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
    //            , { type: "html/plain;charset=utf8" }
    //        ), "供应商销售情况汇总表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    $.ajax({
        url: '../SalesReport/GetSalesReportByProductList',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            nKind: 5,
            SubWID: $("#SubWID").combobox('getValue'),
            S1: $("#S1").val(),//开单开始时间
            S2: $("#S2").val(),//开单截止时间
            S3: $("#S3").val(),//供应商ID
            S4: $("#S4").val(),//代购员ID
            S5: $("#S5").val(),//商品名称
            S6: $("#S6").val(),//商品编号
            S7: $('#CategoriesId1').combobox('getValue'),//商品基本一级类ID
            S8: $('#CategoriesId2').combobox('getValue'),//商品二级类ID
            S9: $('#CategoriesId3').combobox('getValue'),//商品三级类ID
            S10: $("#S10").val(),
            S11: $("#S11").val() ? ($("#S11").val() + " 23:59:59") : "",
            IsNoStock: $("#IsNoStock").combobox("getValue"),
            page: 1,
            rows: 1000000
        },
        success: function (data) {
            exportExcel(data);
            loading.close();
        },
        error: function () {
            $.messager.alert("提示", "导出失败!", "info");
            loading.close();
        }
    });
}

function exportExcel(data) {
    var rows = data && data.rows ? data.rows : [];// $("#grid").datagrid("getRows");
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }


    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>商品编码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品类型</td>";

    trtdCode += "<td>代购员</td>";
    trtdCode += "<td>商品分类</td>";
    trtdCode += "<td>过账日</td>";
    trtdCode += "<td>供应商</td>";
    trtdCode += "<td>配送数量</td>";
    trtdCode += "<td>配送成本金额</td>";
    trtdCode += "<td>配送平台费用</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>合计配送金额</td>";

    trtdCode += "<td>退货数量</td>";
    trtdCode += "<td>退货成本金额</td>";
    trtdCode += "<td>退货平台费用</td>";
    trtdCode += "<td>退货金额</td>";
    trtdCode += "<td>合计退货金额</td>";
    trtdCode += "<td>合计平台费用</td>";
    trtdCode += "<td>合计成本金额</td>";
    //trtdCode += "<td>合计配送金额</td>";
    trtdCode += "<td>净配送额</td>";
    trtdCode += "</tr>";


    function getExcelTr(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        trHtml += "<td style='height:20px' x:str=\"'" + (trData.VendorName == "合计" ? "" : trData.SKU) + "\">" +
            (trData.VendorName == "合计" ? "" : trData.SKU) + "</td>";//商品编码
        trHtml += "<td>" + frxs.replaceCode(trData.ProductName) + "</td>";//商品名称

        var isNoStockStr = "";
        if (trData.IsNoStock == 0) {
            isNoStockStr = "有库存商品";
        }
        else if (trData.IsNoStock == 1) {
            isNoStockStr = "无库存商品";
        }
        trHtml += "<td>" + isNoStockStr + "</td>";

        trHtml += "<td>" + frxs.replaceCode(trData.BuyEmpName) + "</td>";//代购员
        trHtml += "<td>" + frxs.replaceCode(trData.CategoryName) + "</td>";//商品分类
        trHtml += "<td>" + (trData.Sett_Date ? frxs.dateTimeFormat(trData.Sett_Date, "yyyy-MM-dd") : "") + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.VendorName) + "</td>";//供应商
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.SaleQty + "</td>";//配送数量
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SaleAmount + "</td>";//配送成本金额
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SalePoint + "</td>";//配送平台费用
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SaleAmount + "</td>";//配送金额
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SaleTotalAmount + "</td>";//合计配送金额

        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.BackQty + "</td>";//退货数量
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.BackAmount + "</td>";//退货成本金额
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.BackPoint + "</td>";//退货平台费用
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.BackAmount + "</td>";//退货金额
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.BackTotalAmount + "</td>";//合计退货金额
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.TotalPoint + "</td>";//合计平台费用
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.TotalAmount + "</td>";//合计成本金额
        //trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + trHtml.TotalAmt + "</td>";//合计配送金额
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.净销售) ? "0" : trData.净销售) + "</td>";//净销售

        trHtml += "</tr>";

        return trHtml;
    }

    for (var i = 0; i < rows.length; i++) {
        trtdCode += getExcelTr(rows[i]);
    }

    if (data.footer) {
        for (var f = 0; f < data.footer.length; f++) {
            trtdCode += getExcelTr(data.footer[f]);
        }
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
            ), "供应商配送情况汇总表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}


//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    $('#grid').datagrid({
        url: '../SalesReport/GetSalesReportByProductList',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'post',                    //提交方式
        fit: false,                         //分页在最下面
        pagination: true,                   //是否显示分页
        fitColumns: false,                   //列均匀分配
        striped: false,                     //奇偶行是否区分
        rownumbers: true,                   //显示行编号
        //设置点击行为单选，点击行中的复选框为多选
        checkOnSelect: true,
        selectOnCheck: true,
        onClickRow: function (rowIndex) {
            $('#grid').datagrid('clearSelections');
            $('#grid').datagrid('selectRow', rowIndex);
        },
        queryParams: {
            //查询条件
            nKind: 5,
            SubWID: $("#SubWID").combobox('getValue'),
            S1: $("#S1").val(),//开单开始时间
            S2: $("#S2").val(),//开单截止时间
            S3: $("#S3").val(),//供应商ID
            S4: $("#S4").val(),//代购员ID
            S5: $("#S5").val(),//商品名称
            S6: $("#S6").val(),//商品编号
            S7: $('#CategoriesId1').combobox('getValue'),//商品基本一级类ID
            S8: $('#CategoriesId2').combobox('getValue'),//商品二级类ID
            S9: $('#CategoriesId3').combobox('getValue'),//商品三级类ID
            S10: $("#S10").val(),
            S11: $("#S11").val() ? ($("#S11").val() + " 23:59:59") : "",
            IsNoStock: $("#IsNoStock").combobox("getValue")
        }
    });
}

function resetSearch() {
    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");

    $("#S3").attr("value", "");
    $("#S4").attr("value", "");

    $("#S5").val('');
    $("#S6").val('');

    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');

    $("#VendorCode").attr("value", "");
    $("#VendorName").attr("value", "");
    $("#BuyEmpName").attr("value", "");

    $("#S10").val('');
    $("#S11").val('');
    $("#IsNoStock").combobox("setValue", '');
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
    $("#S4").val(empId);
    $("#BuyEmpName").val(empName);
}

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
    $("#S3").val(vendorId);
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
                $("#S3").val(parseobj.rows[0].VendorID);
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
                $("#S4").val(parseobj.rows[0].EmpID);
                $("#BuyEmpName").val(parseobj.rows[0].EmpName);
            } else {
                selBuyEmp();
            }
        }
    });
}


