$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();

    //grid高度改变
    gridresize();

    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd"));

});

function initGrid() {
    $('#grid').datagrid({
        fit: false,                         //分页在最下面
        pagination: true,                   //是否显示分页
        showFooter: true,
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        rownumbers: true,                   //显示行编号
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
            nKind: 4,
            SubWID: $("#SubWID").combobox('getValue'),
            S3: $('#S3').val(),
            S4: $("#S4").val() ? ($("#S4").val() + " 23:59:59") : "",
            S5: $('#S5').val(),
            ProductName: $("#ProductName").val(),
            SKU: $("#SKU").val(),
            IsNoStock: $("#IsNoStock").combobox("getValue")
        },
        frozenColumns: [[
            { title: '公司机构', field: 'WName', width: 140, formatter: frxs.formatText },
            { title: '商品编码', field: 'ProductCode', width: 80, align: 'center' }
        ]],
        columns: [[

            { title: '商品名称', field: 'ProductName', width: 270, formatter: frxs.formatText },
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
            { title: '主条码', field: 'BarCode', width: 110, align: 'center' },
            { title: '商品状态', field: 'StatusName', width: 60, align: 'center' },
            { title: '商品分类', field: 'CategoryName', width: 170, formatter: frxs.formatText },
            { title: '代购员', field: 'BuyEmpName', width: 50, formatter: frxs.formatText, align: 'center' },
            { title: '计量单位', field: 'Unit', width: 60, align: 'center' },
            {
                title: '配送数量', field: 'SaleQty', width: 60, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '配送金额', field: 'SaleAmt', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '订货数量', field: 'BuyQty', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '订货金额', field: 'BuyAmt', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
             {
                 title: '库存数量', field: 'StockQty', width: 60, align: 'right', formatter: function (value) {
                     return parseFloat(value).toFixed(2);
                 }
             },

              {
                  title: '在途数量', field: 'PreQty', width: 60, align: 'right', formatter: function (value) {
                      return parseFloat(value).toFixed(2);
                  }
              },
            {
                title: '缺货数量', field: 'LackQty', width: 60, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '缺货金额', field: 'LackAmt', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            { title: '缺货率', field: 'LackRateStr', width: 80, align: 'right' },

            
            { title: '货区', field: 'ShelfAreaName', width: 80, align: 'center' }
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

//导出
function exportout() {
    //var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    //var text = exportExcel();
    //if (text) {
    //    event.preventDefault();
    //    var bb = self.Blob;
    //    saveAs(
    //        new bb(
    //            ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
    //            , { type: "html/plain;charset=utf8" }
    //        ), "代购员缺货分析报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    event.preventDefault();

    $.ajax({
        url: '../PurchaseReport/GetListSaleStockout',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            nKind: 4,
            SubWID: $("#SubWID").combobox('getValue'),
            S3: $('#S3').val(),
            S4: $("#S4").val() ? ($("#S4").val() + " 23:59:59") : "",
            S5: $('#EmpName').val(),
            ProductName: $("#ProductName").val(),
            SKU: $("#SKU").val(),
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
    trtdCode += "<td style='height:24px'>公司机构</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品类型</td>";
    trtdCode += "<td>主条码</td>";
    trtdCode += "<td>商品状态</td>";
    trtdCode += "<td>商品分类</td>";
    trtdCode += "<td>代购员</td>";
    trtdCode += "<td>计量单位</td>";
    trtdCode += "<td>配送数量</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>订货数量</td>";
    trtdCode += "<td>订货金额</td>";
    trtdCode += "<td>库存数量</td>";
    trtdCode += "<td>在途数量</td>";
    trtdCode += "<td>缺货数量</td>";
    trtdCode += "<td>缺货金额</td>";
    trtdCode += "<td>缺货率</td>";
    trtdCode += "<td>货区</td>";
    trtdCode += "</tr>";

    function getExcelTr(trData) {
        var trHtml = "";

        trHtml += "<tr>";
        trHtml += "<td style='height:20px'>" + trData.WName + "</td>";
        trHtml += "<td x:str=\"'" + (trData.WName == "合计" ? "" : trData.ProductCode) + "\">" + (trData.WAllName == "合计" ? "" : trData.ProductCode) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ProductName) + "</td>";

        var isNoStockStr = "";
        if (trData.IsNoStock == 0) {
            isNoStockStr = "有库存商品";
        }
        else if (trData.IsNoStock == 1) {
            isNoStockStr = "无库存商品";
        }
        trHtml += "<td>" + isNoStockStr + "</td>";
        trHtml += "<td x:str=\"'" + (trData.WName == "合计" ? "" : trData.BarCode) + "\">" + (trData.WName == "合计" ? "" : trData.BarCode) + "</td>";
        trHtml += "<td>" + (trData.WName == "合计" ? "" : trData.StatusName) + "</td>";
        trHtml += "<td>" + (trData.WName == "合计" ? "" : trData.CategoryName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.BuyEmpName) + "</td>";
        trHtml += "<td>" + (trData.WName == "合计" ? "" : trData.Unit) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.SaleQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SaleAmt + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.BuyQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.BuyAmt + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.StockQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.PreQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.LackQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.LackAmt + "</td>";
        trHtml += "<td>" + (trData.WName == "合计" ? "" : trData.LackRateStr) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ShelfAreaName) + "</td>";
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
            ), "代购员缺货分析报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}



//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    //var loading = frxs.loading();
    //$.ajax({
    //    url: '../PurchaseReport/GetListSaleStockout',
    //    type: 'post',
    //    data: {
    //        //查询条件
    //        S1: $("#S1").val(),
    //        S2: $("#S2").val(),
    //        nKind: 4,
    //        SubWID: $("#SubWID").combobox('getValue'),
    //        S3: $('#S3').val(),
    //        S4: $("#S4").val() ? ($("#S4").val() + " 23:59:59") : "",
    //        S5: $('#EmpName').val()
    //    },
    //    success: function (data) {
    //        loading.close();
    //        $('#grid').datagrid({ data: $.parseJSON(data) });
    //    }
    //});

    $('#grid').datagrid({
        url: '../PurchaseReport/GetListSaleStockout',
        queryParams: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            nKind: 4,
            SubWID: $("#SubWID").combobox('getValue'),
            S3: $('#S3').val(),
            S4: $("#S4").val() ? ($("#S4").val() + " 23:59:59") : "",
            S5: $('#EmpName').val(),
            ProductName: $("#ProductName").val(),
            SKU: $("#SKU").val(),
            IsNoStock: $("#IsNoStock").combobox("getValue"),
            CategoriesId1: $('#CategoriesId1').combobox('getValue'),//商品基本一级类ID
            CategoriesId2: $('#CategoriesId2').combobox('getValue'),//商品二级类ID
            CategoriesId3: $('#CategoriesId3').combobox('getValue')//商品三级类ID
        }
    });
}

function resetSearch() {
    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#S3").attr("value", "");
    $("#S4").attr("value", "");
    $("#EmpName").val("");
    $("#EmpId").val("");
    $("#SubWID").combobox('setValue', '');
    $("#ProductName").attr("value", "");
    $("#SKU").attr("value", "");
    $("#IsNoStock").combobox("setValue", '');
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');
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
        }, error: function (e) {

        }
    });

}

function selBuyEmp() {
    frxs.dialog({
        title: "选择代购员",
        url: "../BuyOrderPre/SelectBuyEmp?buyEmpName=" + encodeURIComponent($("#EmpName").val()),
        owdoc: window.top,
        width: 850,
        height: 500
    });
}

//回填代购员
function backFillBuyEmp(empId, empName) {
    $("#EmpId").val(empId);
    $("#EmpName").val(empName);
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

