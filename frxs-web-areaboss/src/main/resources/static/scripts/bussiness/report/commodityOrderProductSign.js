$(function () {
    //grid绑定
    initGrid();

    //grid高度改变
    gridresize();


    //默认查询当天数据
    $("#S5").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S6").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
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
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        frozenColumns: [[
             { title: '门店编号', field: 'ShopCode', width: 75, align: 'center' }
        ]],
        columns: [[
            { title: '门店名称', field: 'ShopName', width: 155, align: 'left', formatter: frxs.formatText },
            {
                title: '订单号', field: 'OrderID', width: 100, align: 'center',
                formatter: function (value, rec) {
                    if (value) {
                        return '<a href="#"  style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'saleorder\',\'' + value + '\')">' + value + '</a>';
                    }
                    return "";
                }
            },
            { title: '商品编码', field: 'SKU', width: 75, align: 'center' },
            { title: '商品名称', field: 'ProductName', width: 180, align: 'left', formatter: frxs.formatText },
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
            { title: '单位', field: 'SaleUnit', width: 45, align: 'center', formatter: frxs.formatText },
            {
                title: '数量', field: 'SaleQty', width: 50, align: 'center', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '单价', field: 'SalePrice', width: 80, align: 'right', formatter: function (value, row) {
                    if (row.ShopName == '合计') {
                        return '';
                    } else {
                        value = (!value) ? 0 : value;
                        return parseFloat(value).toFixed(4);
                    }
                }
            },
            {
                title: '签收金额', field: 'SubAmt', width: 80, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(2);
                }
            },
            { title: '订单提交时间', field: 'CreateTime', width: 140, align: 'center' },
            { title: '确认时间', field: 'ConfDate', width: 140, align: 'center' },
            { title: '发货时间', field: 'PackingTime', width: 140, align: 'center' },
            { title: '签收时间', field: 'FinishDate', width: 140, align: 'center' }
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
    //        ), "商贸商品订单签收统计报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    $.ajax({
        url: '../StoreReport/GetCommodityOrderProductSignList',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S4: $("#S4").val(),
            S5: $("#S5").val(),
            S6: $("#S6").val(),
            S7: $("#S7").val(),
            S8: $("#S8").val(),
            S9: $("#S9").val(),
            S10: $("#S10").val(),
            IsNoStock: $("#IsNoStock").combobox("getValue"),
            nKind: 2,
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
    var rows = data && data.rows ? data.rows : null;
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    trtdCode += "<td>订单号</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品类型</td>";
    trtdCode += "<td>单位</td>";
    trtdCode += "<td>数量</td>";
    trtdCode += "<td>单价</td>";
    trtdCode += "<td>签收金额</td>";
    trtdCode += "<td>订单提交时间</td>";
    trtdCode += "<td>确认时间</td>";
    trtdCode += "<td>发货时间</td>";
    trtdCode += "<td>签收时间</td>";
    trtdCode += "</tr>";

    function getExcelTr(trData) {
        var trHtml = "";

        trHtml += "<tr>";
        trHtml += "<td style='height:20px' x:str=\"'" + frxs.replaceCode(trData.ShopCode) + "\">" + trData.ShopCode + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ShopName) + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.OrderID) + "</td>";
        trHtml += "<td x:str=\"'" + frxs.replaceCode(trData.SKU) + "\">" + trData.SKU + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ProductName) + "</td>";

        var isNoStockStr = "";
        if (trData.IsNoStock == 0) {
            isNoStockStr = "有库存商品";
        }
        else if (trData.IsNoStock == 1) {
            isNoStockStr = "无库存商品";
        }
        trHtml += "<td>" + isNoStockStr + "</td>";

        trHtml += "<td>" + frxs.replaceCode(trData.SaleUnit) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.SaleQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + frxs.replaceCode(trData.SalePrice) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.SubAmt + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.CreateTime) + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.ConfDate) + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.PackingTime) + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.FinishDate) + "</td>";
        trHtml += "</tr>";

        return trHtml;
    }

    for (var i = 0; i < rows.length; i++) {
        trtdCode += getExcelTr(rows[i]);
    }

    for (var f = 0; f < data.footer.length; f++) {
        trtdCode += getExcelTr(data.footer[f]);
    }

    var dataCode = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>';
    dataCode = dataCode.replace("{table}", trtdCode);
    //return dataCode;

    var bb = self.Blob;
    saveAs(
        new bb(
            ["\ufeff" + dataCode] //\ufeff防止utf8 bom防止中文乱码
            , { type: "html/plain;charset=utf8" }
        ), "商贸商品订单签收统计报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    );
}

//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }

    $('#grid').datagrid({
        url: '../StoreReport/GetCommodityOrderProductSignList',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        fit: false,                         //分页在最下面
        pagination: true,                   //是否显示分页
        rownumbers: true,                   //显示行编号
        fitColumns: false,                   //列均匀分配
        striped: false,                     //奇偶行是否区分
        showFooter: true,
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
            S6: $("#S6").val(),
            S7: $("#S7").val(),
            S8: $("#S8").val(),
            S9: $("#S9").val(),
            S10: $("#S10").val(),
            IsNoStock: $("#IsNoStock").combobox("getValue"),
            nKind: 2
        }
    });
}

function resetSearch() {
    //$("#myForm").form("clear");
    $("#S1").val("");
    $("#S2").val("");
    $("#S5").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S6").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#S3").val("");
    $("#S4").val("");
    $("#S7").val("");
    $("#S8").val("");
    $("#S9").val("");
    $("#S10").val("");
    $("#IsNoStock").combobox("setValue", '');
}


//窗口大小改变
$(window).resize(function () {
    gridresize();
});


//grid高度改变
function gridresize() {
    var h = ($(window).height() - $("fieldset").height() - 28);
    $('#grid').datagrid('resize', {
        width: $(window).width() - 10,
        height: h
    });
}
