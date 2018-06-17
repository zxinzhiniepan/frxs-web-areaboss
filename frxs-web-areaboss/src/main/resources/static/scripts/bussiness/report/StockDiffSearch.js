$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();


    //grid高度改变
    gridresize();
    //select下拉框自适应高度    


    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd"));
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
        pageList: [30, 50, 100, 300],
        showFooter: true,
        columns: [[

            { title: '公司机构', field: 'SubWName', width: 160 },
            { title: '盘点计划单号', field: 'PlanId', width: 120 },
            { title: '商品编码', field: 'SKU', width: 100 },
            { title: '商品名称', field: 'ProductName', width: 100 },

            {
                title: '初盘数量', field: 'CP1', width: 60, align: 'right', formatter: function (value) {

                    return value == null ? "" : parseFloat(value).toFixed(2);
                }
            },

            {
                title: '复盘数量', field: 'FP1', width: 60, align: 'right', formatter: function (value) {

                    return value == null ? "" : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '库存数量', field: 'UnitQty', width: 60, align: 'right', formatter: function (value) {
                    return value == null ? 0.00 : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '库存单价', field: 'UnitPrice', width: 80, align: 'right', formatter: function (value, rec) {
                    return rec.SubWName == "合计" ? "" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '复盘标识', field: 'FPType', width: 100, formatter: function (value, rec) {
                    return rec.SubWName == "合计" ? "" : value;
                }
            },

            {
                title: '盘盈数量', field: 'StockOverCount', width: 60, align: 'right', formatter: function (value) {
                    return value == null ? 0.00 : parseFloat(value).toFixed(2);
                }
            },

            {
                title: '盘亏数量', field: 'StockLossCount', width: 60, align: 'right', formatter: function (value) {
                    return value == null ? 0.00 : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '盘盈金额', field: 'StockOverPrice', width: 80, align: 'right', formatter: function (value) {
                    return value == null ? 0.0000 : parseFloat(value).toFixed(4);
                }
            },
             {
                 title: '盘亏金额', field: 'StockLossPrice', width: 80, align: 'right', formatter: function (value) {
                     return value == null ? 0.0000 : parseFloat(value).toFixed(4);
                 }
             },
            { title: '计量单位', field: 'Unit', width: 100, align: 'center' },
            { title: '条码', field: 'BarCode', width: 100, align: 'center' },
            { title: '供应商名称', field: 'VendorName', width: 150, align: 'center' },
            { title: '商品分类', field: 'CategoryName3', width: 150, align: 'center' },
            { title: '货位', field: 'ShelfCode', width: 100, align: 'center' },
            { title: '录单时间', field: 'CreateTime', width: 100 },

             {
                 title: '零售价', field: 'LsPrice', width: 100, align: 'right', formatter: function (value, rec) {
                     return rec.SubWName == "合计" ? "" : (value == null ? 0.0000 : parseFloat(value).toFixed(4));
                 }
             },
             {
                 title: '代购价', field: 'JPrice', width: 100, align: 'right', formatter: function (value, rec) {
                     return rec.SubWName == "合计" ? "" : (value == null ? 0.0000 : parseFloat(value).toFixed(4));
                 }
             },
             {
                 title: '系统价', field: 'SalePrice', width: 100, align: 'right', formatter: function (value, rec) {
                     return rec.SubWName == "合计" ? "" : (value == null ? 0.0000 : parseFloat(value).toFixed(4));
                 }
             },
             {
                 title: '盘点数量', field: 'StockCount', width: 70, align: 'right', formatter: function (value) {
                     value = value ? value : 0;
                     return parseFloat(value).toFixed(2);
                 }
             },
            {
                title: '盈亏数量', field: 'OverLossCunt', width: 80, align: 'right', formatter: function (value) {
                    return value == null ? 0.00 : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '盘点代购金额', field: 'StockJHPAmt', width: 80, align: 'right', formatter: function (value) {
                    return value == null ? 0.0000 : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '盘点零售金额', field: 'StockLSAmt', width: 80, align: 'right', formatter: function (value) {
                    return value == null ? 0.0000 : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '盘点系统金额', field: 'StockSaleAmt', width: 80, align: 'right', formatter: function (value) {
                    return value == null ? 0.0000 : parseFloat(value).toFixed(4);
                }
            },
             {
                 title: '代购盈亏金额', field: 'JHOverLossAmt', width: 80, align: 'right', formatter: function (value) {
                     value = value ? value : 0;
                     return parseFloat(value).toFixed(4);
                 }
             },
            {
                title: '零售盈亏金额', field: 'LSOverLossAmt', width: 80, align: 'right', formatter: function (value) {
                    return value == null ? 0.0000 : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '系统盈亏金额', field: 'SaleOverLossAmt', width: 80, align: 'right', formatter: function (value) {
                    return value == null ? 0.0000 : parseFloat(value).toFixed(4);
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
    });
}



//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    var subwid = $("#SubWID").combobox('getValue');
    if (subwid == "")
    {
        $.messager.alert("提示", "仓库不能为空,请选择仓库!", "info");
        return false;
    }

    $('#grid').datagrid({
        url: '../StockCheck/GetStockDiffSearchReportList',//(1)盘点差异查询报表
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
            SubWID: $("#SubWID").combobox('getValue')

        }
    });
}

function resetSearch() {
    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#S3").attr("value", "");
    $("#S4").val('');
    $("#S5").val('');
    $("#SubWID").combobox('setValue', '');


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
    var h = ($(window).height() - $("fieldset").height() - 24);
    $('#grid').datagrid('resize', {
        width: $(window).width() - 10,
        height: h
    });
}


//导出 新代码
function exportoutToPage() {
    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    $.ajax({
        type: "post",
        dataType: "json",
        url: '../StockCheck/GetStockDiffSearchReportList',//(1)盘点差异查询报表
        data: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S4: $("#S4").val(),
            S5: $("#S5").val(),
            SubWID: $("#SubWID").combobox('getValue'),
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

//客户端导出Excel
function exportExcel(data) {
    var rows = data && data.rows ? data.rows : [];
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>公司机构</td>"
    trtdCode += "<td>盘点计划单号</td>"
    trtdCode += "<td>商品编码</td>"
    trtdCode += "<td>商品名称</td>"
    trtdCode += "<td>初盘数量</td>"
    trtdCode += "<td>复盘数量</td>"
    trtdCode += "<td>库存数量</td>"
    trtdCode += "<td>库存单价</td>"
    trtdCode += "<td>复盘标识</td>"
    trtdCode += "<td>盘盈数量</td>"
    trtdCode += "<td>盘亏数量</td>"
    trtdCode += "<td>盘盈金额</td>"
    trtdCode += "<td>盘亏金额</td>"
    trtdCode += "<td>计量单位</td>"
    trtdCode += "<td>条码</td>"
    trtdCode += "<td>供应商名称</td>"
    trtdCode += "<td>商品分类</td>"
    trtdCode += "<td>货位</td>"
    trtdCode += "<td>录单时间</td>"
    trtdCode += "<td>零售价</td>"
    trtdCode += "<td>代购价</td>"
    trtdCode += "<td>系统价</td>"
    trtdCode += "<td>盘点数量</td>"
    trtdCode += "<td>盈亏数量</td>"
    trtdCode += "<td>盘点进货金额</td>"
    trtdCode += "<td>盘点零售金额</td>"
    trtdCode += "<td>盘点配送金额</td>"
    trtdCode += "<td>进货盈亏金额</td>"
    trtdCode += "<td>零售盈亏金额</td>"
    trtdCode += "<td>配送盈亏金额</td>"

    trtdCode += "</tr>";

    function getExcelTR(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        trHtml += "<td style='height:20px' x:str=\"'" + trData.SubWName + "\">" + trData.SubWName + "</td>";//公司机构
        trHtml += "<td x:str=\"'" + frxs.replaceCode(trData.PlanId) + "\">" + frxs.replaceCode(trData.PlanId) + "</td>";//PlanId
        trHtml += "<td x:str=\"'" + frxs.replaceCode(trData.SKU) + "\">" + frxs.replaceCode(trData.SKU) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ProductName) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.CP1) ? "0" : trData.CP1) + "</td>";                    //初盘数量 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.FP1) ? "" : trData.FP1) + "</td>";            //复盘数量 浏览器中显示0为空
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.UnitQty) ? "0" : trData.UnitQty) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + (trData.SubWName == "合计" ? "" : ((!trData.UnitPrice) ? "0" : trData.UnitPrice)) + "</td>";
        trHtml += "<td>" + (trData.SubWName == "合计" ? "" : trData.FPType) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.StockOverCount) ? "0" : trData.StockOverCount) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.StockLossCount) ? "0" : trData.StockLossCount) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.StockOverPrice) ? "0" : trData.StockOverPrice) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.StockLossPrice) ? "0" : trData.StockLossPrice) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.Unit) + "</td>";
        trHtml += "<td x:str=\"'" + frxs.replaceCode(trData.BarCode) + "\">" + frxs.replaceCode(trData.BarCode) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.VendorName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.CategoryName3) + "</td>";
        trHtml += "<td x:str=\"'" + frxs.replaceCode(trData.ShelfCode) + "\">" + frxs.replaceCode(trData.ShelfCode) + "</td>";
        trHtml += "<td>" + (trData.CreateTime ? frxs.dateTimeFormat(trData.CreateTime, "yyyy-MM-dd HH:mm:SS") : "") + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + (trData.SubWName == "合计" ? "" :((!trData.LsPrice) ? "0" : trData.LsPrice)) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + (trData.SubWName == "合计" ? "" :((!trData.JPrice) ? "0" : trData.JPrice)) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + (trData.SubWName == "合计" ? "" :((!trData.SalePrice) ? "0" : trData.SalePrice)) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.StockCount) ? "0" : trData.StockCount) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.OverLossCunt) ? "0" : trData.OverLossCunt) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.StockJHPAmt) ? "0" : trData.StockJHPAmt) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.StockLSAmt) ? "0" : trData.StockLSAmt) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.StockSaleAmt) ? "0" : trData.StockSaleAmt) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.JHOverLossAmt) ? "0" : trData.JHOverLossAmt) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.LSOverLossAmt) ? "0" : trData.LSOverLossAmt) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.SaleOverLossAmt) ? "0" : trData.SaleOverLossAmt) + "</td>";
        trHtml += "<td>" + (trData.Sett_Date ? frxs.dateTimeFormat(trData.Sett_Date, "yyyy-MM-dd") : "") + "</td>";

        trHtml += "</tr>";

        return trHtml;
    }

    for (var i = 0; i < rows.length; i++) {
        trtdCode += getExcelTR(rows[i]);
    }

    if (data.footer) {
        for (var f = 0; f < data.footer.length; f++) {
            trtdCode += getExcelTR(data.footer[f]);
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
            ), "盘点差异查询报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}