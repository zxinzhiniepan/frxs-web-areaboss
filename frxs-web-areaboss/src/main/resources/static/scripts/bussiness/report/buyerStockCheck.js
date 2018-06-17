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
    $('.easyui-combobox').combobox({
        panelHeight: 'auto'
    });

});


function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,                   //显示行编号
        pagination: true,                   //是否显示分页
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        frozenColumns: [[
            { title: '公司机构', field: 'WAllName', width: 130, align: 'left' }
        ]],
        columns: [[

            { title: '商品分类', field: 'CategoryName', width: 150, align: 'left', formatter: frxs.formatText },
            { title: '商品编码', field: 'ProductCode', width: 100, align: 'center' },
            { title: '商品名称', field: 'ProductName', width: 200, formatter: frxs.formatText },
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
            { title: '条码', field: 'Barcode', width: 150, align: 'center' },
            { title: '包装数', field: 'Spec', width: 80, align: 'center' },
            { title: '库存单位', field: 'Unit', width: 80, align: 'center' },
            { title: '配送单位', field: 'kcUnit', width: 80, align: 'center' },
            {
                title: '库存数量', field: 'StockQty', width: 100, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '库存单价', field: 'Price', width: 100, align: 'right', formatter: function (value, rec) {
                    return rec.WAllName == "合计" ? "" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '库存金额', field: 'Amount', width: 100, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '建议零售价', field: 'SalePrice', width: 100, align: 'right', formatter: function (value, rec) {
                    return rec.WAllName == "合计" ? "" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '零售金额', field: 'SaleAmount', width: 100, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            { title: '主供应商', field: 'VendorName', width: 200, align: 'left', formatter: frxs.formatText },
            {
                title: '代购员', field: 'BuyEmpName', width: 150, align: 'center', formatter: frxs.formatText
            },
            {
                title: '配送未过账数量', field: 'NoStoreQty', width: 100, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '实时库存数量', field: 'StoreQty', width: 100, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '系统价', field: 'WholeSalePrice', width: 100, align: 'right', formatter: function (value, rec) {
                    return rec.WAllName == "合计" ? "" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送金额', field: 'WholeSaleAmount', width: 100, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '总库存金额', field: 'StockTotalAmount', width: 100, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '总零售金额', field: 'SaleTotalAmount', width: 100, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '总配送金额', field: 'WholeSaleTotalAmount', width: 100, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            { title: '商品状态', field: 'Status', width: 100, align: 'center' },
            { title: '最后配送日期', field: 'LastSaleDate', width: 120 },

             {
                 title: '上周订货数量', field: 'WeekPreQty', width: 120, align: 'right', formatter: function (value) {
                     value = (isNaN(value) || (!value)) ? 0 : value;
                     return parseFloat(value).toFixed(2);
                 }
             },
            {
                title: '上周配送数量', field: 'WeekQty', width: 120, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '上周配送金额', field: 'WeekAmount', width: 120, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
             {

                 title: '前15天订货数量', field: 'halfMoonPreQty', width: 120, align: 'right', formatter: function (value) {
                     value = (isNaN(value) || (!value)) ? 0 : value;
                     return parseFloat(value).toFixed(2);
                 }
             },
            {

                title: '前15天配送数量', field: 'halfMoonQty', width: 120, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '前15天配送金额', field: 'halfMoonAmount', width: 120, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '上月订货数量', field: 'MonthPreQty', width: 120, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '上月配送数量', field: 'MonthQty', width: 120, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '上月配送金额', field: 'MonthAmount', width: 120, align: 'right', formatter: function (value) {
                    value = (isNaN(value) || (!value)) ? 0 : value;
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
    //        ), "代购员库存查询报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    event.preventDefault();

    $.ajax({
        url: '../StoreReport/GetBuyerStockCheckList',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            nKind: 4,
            SubWID: $("#SubWID").combobox('getValue'),
            S1: $('#CategoriesId1').combobox('getValue'),
            S2: $('#CategoriesId2').combobox('getValue'),
            S3: $('#CategoriesId3').combobox('getValue'),
            S4: $('#S4').val(),
            S5: $('#S5').val(),
            S6: $('#S6').val(),
            S7: $('#S7').val(),
            S8: $('#S8').combobox('getValue'),
            IsNoStock: $("#IsNoStock").combobox("getValue"),
            page: 1,
            rows: 1000000
            //S8:$("#S8").val()
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

    var titleArray = ["公司机构", "商品分类", "商品编码", "商品名称", "商品类型", "条码", "包装", "库存单位", "配送单位", "库存数量", "库存单价",
                    "库存金额", "建议零售价", "零售金额", "主供应商", "代购员", "配送未过账数量", "实时库存数量", "系统价", "配送金额", "总库存金额", "总零售金额",
                    "总配送金额", "商品状态", "最后配送日期", "上周订货数量", "上周配送数量", "上周配送金额", "前15天订货数量", "前15天配送数量", "前15天配送金额", "上月订货数量", "上月配送数量", "上月配送金额"];

    //exportExcel辅助类方法 根据数组生成标题行
    var trtdCode = excelExport.buildTitleByArray(titleArray);

    function getExcelTr(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        trHtml += "<td style='height:20px'>" + frxs.replaceCode(trData.WAllName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.CategoryName) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.WAllName == "合计" ? "" : trData.ProductCode) + "\">" + (trData.WAllName == "合计" ? "" : trData.ProductCode) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ProductName) + "</td>";
        var isNoStockStr = "";
        if (trData.IsNoStock == 0) {
            isNoStockStr = "有库存商品";
        }
        else if (trData.IsNoStock == 1) {
            isNoStockStr = "无库存商品";
        }
        trHtml += "<td>" + isNoStockStr + "</td>";

        trHtml += "<td x:str=\"'" + (trData.WAllName == "合计" ? "" : trData.Barcode) + "\">" + (trData.WAllName == "合计" ? "" : trData.Barcode) + "</td>";
        trHtml += "<td>" + (trData.WAllName == "合计" ? "" : trData.Spec) + "</td>";
        trHtml += "<td>" + (trData.WAllName == "合计" ? "" : trData.Unit) + "</td>";
        trHtml += "<td>" + (trData.WAllName == "合计" ? "" : trData.kcUnit) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.StockQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + (trData.WAllName == "合计" ? "" : ((trData.Price == null || trData.Price == undefined) ? "" : trData.Price)) + "</td>";
        trHtml += excelExport.fmtNum(trData.Amount, 4);
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + (trData.WAllName == "合计" ? "" : ((trData.SalePrice == null || trData.SalePrice == undefined) ? "" : trData.SalePrice)) + "</td>";
        trHtml += excelExport.fmtNum(trData.SaleAmount, 4);
        trHtml += "<td width='380'>" + frxs.replaceCode(trData.VendorName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.BuyEmpName) + "</td>";
        trHtml += excelExport.fmtNum(trData.NoStoreQty, 2);
        trHtml += excelExport.fmtNum(trData.StoreQty, 4);
        //trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.WholeSalePrice + "</td>";
        trHtml += "<td>" + (trData.WAllName == "合计" ? "" : trData.WholeSalePrice) + "</td>";
        trHtml += excelExport.fmtNum(trData.WholeSaleAmount, 4);
        trHtml += excelExport.fmtNum(trData.StockTotalAmount, 4);
        trHtml += excelExport.fmtNum(trData.SaleTotalAmount, 4);
        trHtml += excelExport.fmtNum(trData.WholeSaleTotalAmount, 4);
        trHtml += "<td>" + (trData.WAllName == "合计" ? "" : trData.Status) + "</td>";
        trHtml += "<td>" + (trData.WAllName == "合计" ? "" : (trData.LastSaleDate == null || trData.LastSaleDate == "null" ? "" : trData.LastSaleDate)) + "</td>";
        trHtml += excelExport.fmtNum(trData.WeekPreQty, 2);
        trHtml += excelExport.fmtNum(trData.WeekQty, 2);
        trHtml += excelExport.fmtNum(trData.WeekAmount, 4);
        trHtml += excelExport.fmtNum(trData.halfMoonPreQty, 2);
        trHtml += excelExport.fmtNum(trData.halfMoonQty, 2);
        trHtml += excelExport.fmtNum(trData.halfMoonAmount, 4);
        trHtml += excelExport.fmtNum(trData.MonthPreQty, 2);
        trHtml += excelExport.fmtNum(trData.MonthQty, 2);
        trHtml += excelExport.fmtNum(trData.MonthAmount, 4);

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

    var excelName = "代购员库存查询报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls";
    excelExport.saveExcel(trtdCode, excelName);
}


//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }

    $('#grid').datagrid({
        url: '../StoreReport/GetBuyerStockCheckList',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        fit: false,                         //分页在最下面
        pagination: true,                   //是否显示分页
        showFooter: true,
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
            nKind: 4,
            SubWID: $("#SubWID").combobox('getValue'),
            S1: $('#CategoriesId1').combobox('getValue'),
            S2: $('#CategoriesId2').combobox('getValue'),
            S3: $('#CategoriesId3').combobox('getValue'),
            S4: $('#S4').val(),
            S5: $('#S5').val(),
            S6: $('#S6').val(),
            S7: $('#S7').val(),
            S8: $('#S8').combobox('getValue'),
            IsNoStock: $("#IsNoStock").combobox("getValue")
        }
    });
}

function resetSearch() {
    $("#SubWID").combobox('setValue', '');
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');
    $('#S4').val('');
    $("#VendorCode").val('');
    $("#VendorName").val('');
    $('#S5').val('');
    $('#S6').val('');
    $('#S7').val('');
    $('#S8').combobox('setValue', '');

    $("#EmpName").val('');
    $("#IsNoStock").combobox("setValue", '');
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
    $("#S4").val(vendorId);
    $("#VendorCode").val(vendorCode);
    $("#VendorName").val(vendorName);
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
function backFillBuyEmp(empID, empName) {
    $("#S7").val(empID);
    $("#EmpName").val(empName);
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

    $("#EmpName").keydown(function (e) {
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
            var obj = JSON.parse(obj);
            if (obj.total == 1) {
                $("#S3").val(obj.rows[0].VendorID);
                $("#VendorCode").val(obj.rows[0].VendorCode);
                $("#VendorName").val(obj.rows[0].VendorName);
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
            EmpName: $("#EmpName").val(),
            page: 1,
            rows: 200
        },
        success: function (obj) {
            var obj = JSON.parse(obj);
            if (obj.total == 1) {
                $("#S7").val(obj.rows[0].EmpID);
                $("#EmpName").val(obj.rows[0].EmpName);
            } else {
                selBuyEmp();
            }
        }
    });
}


