$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();

    //代购员事件绑定
    eventBind();

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
            S3: $('#S3').val(),
            S4: $('#S4').val(),
            S5: $('#S5').val(),
            S6: $('#CategoriesId1').combobox('getValue'),
            S7: $('#CategoriesId2').combobox('getValue'),
            S8: $('#CategoriesId3').combobox('getValue'),
            nKind: 2,
            SubWID: $("#SubWID").combobox('getValue'),
            S9: $('#S9').val(),
            S10: $("#S10").val() ? ($("#S10").val() + " 23:59:59") : "",
            IsNoStock: $("#IsNoStock").combobox("getValue")
        },
        frozenColumns: [[
             {
                 title: '单号', field: 'AdjId', width: 110, align: 'center', formatter: function (value, rec) {
                     if (value) {
                         return '<a href="#" style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'' + rec.OrderType + '\',\'' + value + '\')">' + value + '<a/>';
                     }
                     return "";
                 }
             }
        ]],
        columns: [[

            { title: '商品分类', field: 'CategoryName', width: 170, align: 'left', formatter: frxs.formatText },
            { title: '商品编码', field: 'SKU', width: 70, align: 'center' },
            { title: '商品名称', field: 'ProductName', width: 270, formatter: frxs.formatText },
            { title: '备注', field: 'Remark', width: 170, formatter: frxs.formatText },
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
            {
                title: '系统价格', field: 'SalePrice', align: 'right', width: 80, formatter: function (value, rows) {
                    return rows.SKU == "合计" || value == "" ? "" : parseFloat(value).toFixed(4);
                }
            },
            { title: '开单日期', field: 'AdjDate', width: 90, formatter: frxs.ymdFormat, align: 'center' },
            { title: '过账时间', field: 'PostingTime', width: 120, formatter: frxs.dateFormat, align: 'center' },

            { title: '代购员', field: 'EmpName', width: 50, align: 'center' },
            {
                title: '盘盈数量', field: 'AdjQtyW', width: 60, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '盘盈金额', field: 'AdjAmtW', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '盘亏数量', field: 'AdjQtyF', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '盘亏金额', field: 'AdjAmtF', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            }
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
    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    //var text = exportExcel();
    //if (text) {
    //    event.preventDefault();
    //    var bb = self.Blob;
    //    saveAs(
    //        new bb(
    //            ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
    //            , { type: "html/plain;charset=utf8" }
    //        ), "盘赢盘亏统计报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    $.ajax({
        url: '../StoreReport/GetListStockadj',
        type: 'post',
        dataType: "json",
        data: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $('#S3').val(),
            S4: $('#S4').val(),
            S5: $('#S5').val(),
            S6: $('#CategoriesId1').combobox('getValue'),
            S7: $('#CategoriesId2').combobox('getValue'),
            S8: $('#CategoriesId3').combobox('getValue'),
            nKind: 2,
            SubWID: $("#SubWID").combobox('getValue'),
            S9: $('#S9').val(),
            S10: $("#S10").val() ? ($("#S10").val() + " 23:59:59") : "",
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
    trtdCode += "<td style='height:24px'>单号</td>";
    trtdCode += "<td>商品分类</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品类型</td>";
    trtdCode += "<td>备注</td>";
    trtdCode += "<td>过账日</td>";
    trtdCode += "<td>系统价格</td>";
    trtdCode += "<td>开单日期</td>";
    trtdCode += "<td>过账时间</td>";
    trtdCode += "<td>代购员</td>";
    trtdCode += "<td>盘盈数量</td>";
    trtdCode += "<td>盘盈金额</td>";
    trtdCode += "<td>盘亏数量</td>";
    trtdCode += "<td>盘亏金额</td>";
    trtdCode += "</tr>";


    function getExcelTr(trData) {
        var trHtml = "";
        trHtml += "<tr>";
        trHtml += "<td style='height:20px' x:str=\"'" + (trData.SKU == "合计" ? "" : trData.AdjId) + "\">" + (trData.SKU == "合计" ? "" : trData.AdjId) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.CategoryName) + "</td>";
        trHtml += "<td x:str=\"'" + trData.SKU + "\">" + trData.SKU + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ProductName) + "</td>";
        var isNoStockStr = "";
        if (trData.IsNoStock == 0) {
            isNoStockStr = "有库存商品";
        }
        else if (trData.IsNoStock == 1) {
            isNoStockStr = "无库存商品";
        }
        trHtml += "<td>" + isNoStockStr + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.Remark) + "</td>";
        trHtml += "<td>" + (trData.Sett_Date ? frxs.dateTimeFormat(trData.Sett_Date, "yyyy-MM-dd") : "") + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.SalePrice) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.AdjDate) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.PostingTime) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.EmpName) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.AdjQtyW + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.AdjAmtW + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.AdjQtyF + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.AdjAmtF + "</td>";

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
            ), "盘赢盘亏统计报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
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
        url: '../StoreReport/GetListStockadj',
        type: 'post',
        queryParams: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $('#S3').val(),
            S4: $('#S4').val(),
            S5: $('#S5').val(),
            S6: $('#CategoriesId1').combobox('getValue'),
            S7: $('#CategoriesId2').combobox('getValue'),
            S8: $('#CategoriesId3').combobox('getValue'),
            nKind: 2,
            SubWID: $("#SubWID").combobox('getValue'),
            S9: $('#S9').val(),
            S10: $("#S10").val() ? ($("#S10").val() + " 23:59:59") : "",
            IsNoStock: $("#IsNoStock").combobox("getValue")
        }
    });
}

function resetSearch() {
    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#S3").val("");
    $("#S4").val("");
    $("#S5").attr("value", "");
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');
    $("#BuyEmpName").attr("value", "");
    $("#SubWID").combobox('setValue', '');

    $("#IsNoStock").combobox("setValue", '');

    $("#S9").val("");
    $("#S10").val("");
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
        url: "../BuyOrderPre/SelectBuyEmp?buyEmpName=" + encodeURIComponent($("#BuyEmpName").val()),
        owdoc: window.top,
        width: 850,
        height: 500
    });
}

//回填代购员
function backFillBuyEmp(empId, empName) {
    $("#S5").val(empId);
    $("#BuyEmpName").val(empName);
}


//供应商-代购员事件绑定
function eventBind() {
    $("#BuyEmpName").keydown(function (e) {
        if (e.keyCode == 13) {
            eventBuyEmp();
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
                $("#S5").val(parseobj.rows[0].EmpID);
                $("#BuyEmpName").val(parseobj.rows[0].EmpName);
            } else {
                selBuyEmp();
            }
        }
    });
}


//窗口大小改变
$(window).resize(function () {
    gridresize();
});


//grid高度改变
function gridresize() {
    var h = ($(window).height() - $("fieldset").height() - 25);
    $('#grid').datagrid('resize', {
        width: $(window).width() - 10,
        height: h
    });
}

