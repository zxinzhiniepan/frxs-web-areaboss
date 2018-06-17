$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();

    initShelfAreaDDL();
    //供应商-代购员事件绑定
    // eventBind();

    //grid高度改变
    gridresize();
    //select下拉框自适应高度    
    $('.easyui-combobox').combobox({
        panelHeight: 'auto'
    });

    //日期时间 初始化
    $("#SettDateBegin").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#SettDateEnd").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#PostingTimeBegin").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#PostingTimeEnd").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");

    //日期时间选择
    $("#dateType").combobox({
        onSelect: function (rec) {
            if (rec.value == "GZSJ") {
                $("#SettDateBegin").hide();
                $("#SettDateEnd").hide();
                $("#PostingTimeBegin").show();
                $("#PostingTimeEnd").show();
            } else {
                $("#SettDateBegin").show();
                $("#SettDateEnd").show();
                $("#PostingTimeBegin").hide();
                $("#PostingTimeEnd").hide();
            }
        }
    });
});

//绑定货区
function initShelfAreaDDL() {
    $.ajax({
        url: '../ShelfArea/GetShelfAreaSelectList',
        type: 'get',
        dataType: 'json',
        async: false,
        data: {},
        success: function (data) {
            //data = $.parseJSON(data);
            //在第一个Item加上请选择
            data.unshift({ "ShelfAreaID": "", "ShelfAreaName": "-请选择-" });
            //创建控件
            $("#ShelfAreaID").combobox({
                data: data,                       //数据源
                valueField: "ShelfAreaID",       //id列
                textField: "ShelfAreaName"       //value列
            });
        }, error: function (e) {

        }
    });
}

//代购员选择
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
    $("#EmpID").val(empID);
    $("#EmpName").val(empName);
}

//表格初始化
function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,
        pagination: true,                   //是否显示分页
        showFooter: true,
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        frozenColumns: [[
            { title: '公司机构', field: 'SubWName', width: 130, align: 'center', formatter: frxs.formatText },
            { title: '货区', field: 'ShelfAreaName', width: 90, align: 'left', formatter: frxs.formatText },
            { title: '商品分类', field: 'CategoryName', width: 150, align: 'left', formatter: frxs.formatText },
            { title: '商品编码', field: 'Sku', width: 80, align: 'center', formatter: frxs.formatText },
            { title: '商品名称', field: 'ProductName', width: 260, align: 'left', formatter: frxs.formatText },
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
                title: '期初数量', field: 'BeginQty', width: 80, align: 'right', formatter: frxs.formatFixed4
            },
            {
                title: '期初金额', field: 'BeginAmt', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);
                }
            }
        ]],
        columns: [[
            {
                title: '配送数量', field: 'SaleQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.00" : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '配送金额', field: 'SaleAmt', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '门店退货数量', field: 'SaleBackQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.00" : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '门店退货金额', field: 'SaleBackAmt', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '代购入库数量', field: 'BuyQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.00" : parseFloat(value).toFixed(2);//入库数量
                }
            },
            {
                title: '代购入库金额', field: 'BuyAmt', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);//
                }
            },
            {
                title: '代购退货数量', field: 'BuyBackQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.00" : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '代购退货金额', field: 'BuyBackAmt', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);//
                }
            },
            {
                title: '期末数量', field: 'EndQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.00" : parseFloat(value).toFixed(2);//
                }
            },
            {
                title: '期末金额', field: 'EndStockAmt', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);//
                }
            },
            { title: '国际条码', field: 'Barcode', width: 110, align: 'center', formatter: frxs.formatText },
            {
                title: '代购价', field: 'BuyPrice', width: 100, align: 'right', formatter: function (value) {//SalePrice命名不恰当，改成BuyPrice 2016-8-22
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);//
                }
            },
            {
                title: '零售价', field: 'MarketPrice', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);//
                }
            },
            {
                title: '包装数', field: 'PackingQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.00" : parseFloat(value).toFixed(2);//
                }
            },
            { title: '配送单位', field: 'SaleUnit', width: 60, align: 'center', formatter: frxs.formatText },
            { title: '库存单位', field: 'MarketUnit', width: 60, align: 'center', formatter: frxs.formatText },

            { title: '主供应商', field: 'VendorName', width: 100, align: 'center', formatter: frxs.formatText },
            {
                title: '盘盈数量', field: 'AdjGainQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.00" : parseFloat(value).toFixed(2);//
                }
            },
            {
                title: '盘盈金额', field: 'AjgGginAmt', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);//
                }
            },
            {
                title: '盘亏数量', field: 'AdjLossQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.00" : parseFloat(value).toFixed(2);//
                }
            },
            {
                title: '盘亏金额', field: 'AjgLosssAmt', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);//
                }
            },
            {
                title: '报损数量', field: 'AdjApplyLossQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.00" : parseFloat(value).toFixed(2);//
                }
            },
            {
                title: '报损金额', field: 'AjgApplyLosssAmt', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == null) ? "0.0000" : parseFloat(value).toFixed(4);//
                }
            },
            { title: '商品状态', field: 'ProductStatusName', width: 100, align: 'center', formatter: frxs.formatText },
            { title: '代购员', field: 'BuyEmpName', width: 100, align: 'center', formatter: frxs.formatText }

        ]],
        toolbar: [
            {
                id: 'btnExport',
                text: '导出',
                iconCls: 'icon-daochu',
                handler: exportoutToPage
            }]
    });
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

function getQueryParamsData() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    if ($("#SubWID").combobox('getValue') == "") {
        window.top.$.messager.alert("提示", "请选择仓库机构！", "info");
        return false;
    }
    if ($("#dateType").combobox("getValue") == "GZSJ" && $("#PostingTimeBegin").val() == "" && $("#PostingTimeEnd").val() == "") {//过账时间
        window.top.$.messager.alert("提示", "请选择过账时间！", "info");
        return false;

    } else if ($("#dateType").combobox("getValue") == "GZR" && $("#SettDateBegin").val() == "" && $("#SettDateEnd").val() == "") {
        window.top.$.messager.alert("提示", "请选择过账日！", "info");
        return false;
    }
    var queryParamsData = {
        //查询条件
        SettDateBegin: $("#dateType").combobox("getValue") == "GZSJ" ? "" : $("#SettDateBegin").val(),
        SettDateEnd: $("#dateType").combobox("getValue") == "GZSJ" ? "" : $("#SettDateEnd").val(),
        PostingTimeBegin: $("#dateType").combobox("getValue") == "GZR" ? "" : $("#PostingTimeBegin").val(),
        PostingTimeEnd: $("#dateType").combobox("getValue") == "GZR" ? "" : $("#PostingTimeEnd").val(),

        SubWID: $("#SubWID").combobox('getValue'),

        SKU: $.trim($("#SKU").val()),
        ProductName: $.trim($("#ProductName").val()),
        CategoryId1: $('#CategoriesId1').combobox('getValue'),
        CategoryId2: $('#CategoriesId2').combobox('getValue'),
        CategoryId3: $('#CategoriesId3').combobox('getValue'),

        ShelfAreaID: $("#ShelfAreaID").combobox('getValue'),
        VendorId: $("#VendorID").val(),//供应商ID
        EmpId: $("#EmpID").val(),
        IsNoStock: $("#IsNoStock").combobox("getValue")
    };

    return queryParamsData;
}

function search() {

    var queryParamsData = getQueryParamsData();
    if (queryParamsData === false) {
        return;
    }

    $('#grid').datagrid({
        url: '../StoreReport/GetSingleProductSumReport',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'post',                    //提交方式
        fit: false,                         //分页在最下面
        pagination: true,                   //是否显示分页
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
        queryParams: queryParamsData
    });
}

function resetSearch() {
    //日期类型
    $("#dateType").combobox('setValue', "GZSJ");

    //日期时间 初始化
    $("#SettDateBegin").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#SettDateEnd").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#PostingTimeBegin").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#PostingTimeEnd").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");

    //仓库子机构
    $("#SubWID").combobox('setValue', '');

    //商品
    $('#SKU').val('');
    $('#ProductName').val('');

    //商品分类
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');

    //货区
    $("#ShelfAreaID").combobox('setValue', '');

    //代购员
    $("#EmpName").val("");
    $("#EmpID").val("");

    //供应商
    $('#VendorCode').val('');
    $("#VendorName").val('');
    $("#VendorID").val('');

    $("#IsNoStock").combobox("setValue", '');
}

function eventBind() {

}

function exportoutToPage() {
    //var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    //var text = exportExcel();
    //if (text) {
    //    var bb = self.Blob;
    //    saveAs(
    //        new bb(
    //            ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
    //            , { type: "html/plain;charset=utf8" }
    //        ), "单品进销存汇总报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    var queryParamsData = getQueryParamsData();
    if (queryParamsData === false) {
        return;
    }

    queryParamsData.page = 1;
    queryParamsData.rows = 1000000;

    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");

    $.ajax({
        url: '../StoreReport/GetSingleProductSumReport',
        type: 'post',
        dataType: "json",
        data: queryParamsData,
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
    trtdCode += "<td>公司机构</td>";
    trtdCode += "<td>货区</td>";
    trtdCode += "<td>商品分类</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品类型</td>";

    trtdCode += "<td>期初数量</td>";
    trtdCode += "<td>期初金额</td>";

    trtdCode += "<td>配送数量</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>门店退货数量</td>";
    trtdCode += "<td>门店退货金额</td>";

    trtdCode += "<td>代购入库数量</td>";
    trtdCode += "<td>代购入库金额</td>";

    trtdCode += "<td>代购退货数量</td>";
    trtdCode += "<td>代购退货金额</td>";

    trtdCode += "<td>期末数量</td>";
    trtdCode += "<td>期末金额</td>";

    trtdCode += "<td>国际条码</td>";

    trtdCode += "<td>代购价</td>";
    trtdCode += "<td>零售价</td>";
    trtdCode += "<td>包装数</td>";
    trtdCode += "<td>配送单位</td>";
    trtdCode += "<td>库存单位</td>";
    trtdCode += "<td>主供应商</td>";

    trtdCode += "<td>盘盈数量</td>";
    trtdCode += "<td>盘盈金额</td>";
    trtdCode += "<td>盘亏数量</td>";
    trtdCode += "<td>盘亏金额</td>";
    trtdCode += "<td>报损数量</td>";
    trtdCode += "<td>报损金额</td>";

    trtdCode += "<td>商品状态</td>";
    trtdCode += "<td>代购员</td>";
    trtdCode += "</tr>";

    function getExcelTr(trData) {
        var trHtml = "";

        trHtml += "<tr>";
        
        trHtml += "<td>" + frxs.replaceCode(trData.SubWName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ShelfAreaName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.CategoryName) + "</td>";
        trHtml += numToStringExcelTd(trData.Sku);
        trHtml += "<td>" + (trData.SubWName == "合计列" ? "" : trData.ProductName) + "</td>";
        var isNoStockStr = "";
        if (trData.IsNoStock == 0) {
            isNoStockStr = "有库存商品";
        }
        else if (trData.IsNoStock == 1) {
            isNoStockStr = "无库存商品";
        }
        trHtml += "<td>" + isNoStockStr + "</td>";
        
        trHtml += formatNumToExcelTd(trData.BeginQty, 2);
        trHtml += formatNumToExcelTd(trData.BeginAmt, 4);

        trHtml += formatNumToExcelTd(trData.SaleQty, 2);
        trHtml += formatNumToExcelTd(trData.SaleAmt, 4);

        trHtml += formatNumToExcelTd(trData.SaleBackQty, 2);
        trHtml += formatNumToExcelTd(trData.SaleBackAmt, 4);

        trHtml += formatNumToExcelTd(trData.BuyQty, 2);
        trHtml += formatNumToExcelTd(trData.BuyAmt, 4);

        trHtml += formatNumToExcelTd(trData.BuyBackQty, 2);
        trHtml += formatNumToExcelTd(trData.BuyBackAmt, 4);

        trHtml += formatNumToExcelTd(trData.EndQty, 2);
        trHtml += formatNumToExcelTd(trData.EndStockAmt, 2);

        trHtml += numToStringExcelTd(trData.Barcode);

        trHtml += formatNumToExcelTd(trData.BuyPrice, 4);//代购价BuyPrice
        trHtml += formatNumToExcelTd(trData.MarketPrice, 4);//MarketPrice 

        trHtml += formatNumToExcelTd(trData.PackingQty, 2);//

        trHtml += "<td>" + (trData.SaleUnit == undefined ? "" : trData.SaleUnit) + "</td>";
        trHtml += "<td>" + (trData.MarketUnit == undefined ? "" : trData.MarketUnit) + "</td>";// 命名不恰当？

        trHtml += "<td>" + (trData.VendorName == undefined ? "" : trData.VendorName) + "</td>";

        trHtml += formatNumToExcelTd(trData.AdjGainQty, 2);
        trHtml += formatNumToExcelTd(trData.AjgGginAmt, 4);

        trHtml += formatNumToExcelTd(trData.AdjLossQty, 2);
        trHtml += formatNumToExcelTd(trData.AjgLosssAmt, 4);

        trHtml += formatNumToExcelTd(trData.AdjApplyLossQty, 2);
        trHtml += formatNumToExcelTd(trData.AjgApplyLosssAmt, 4);

        trHtml += "<td>" + (trData.ProductStatusName == undefined ? "" : trData.ProductStatusName) + "</td>";
        trHtml += "<td>" + (trData.BuyEmpName == undefined ? "" : trData.BuyEmpName) + "</td>";

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
        var bb = self.Blob;
        saveAs(
            new bb(
                ["\ufeff" + dataCode] //\ufeff防止utf8 bom防止中文乱码
                , { type: "html/plain;charset=utf8" }
            ), "单品进销存汇总报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
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
    $("#VendorCode").val(vendorCode);
    $("#VendorName").val(vendorName);
    $("#VendorID").val(vendorId);
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

//导出Excel导出时的数字格式问题
//解决存储过程返回null的问题 precisionLength指小数点后的位数（默认至少1位）
function formatNumToExcelTd(dataObj, precisionLength) {
    var basicNumString = "";
    if (precisionLength > 0) {
        for (var i = 0; i < precisionLength; i++) {
            basicNumString += "0";
        }
    }
    else {
        basicNumString = "0";
    }
    basicNumString = "0." + basicNumString;
    var returnString = "<td style='mso-number-format:\"#,##" + basicNumString + "\";'>" + basicNumString + "</td>";

    if (dataObj == undefined || dataObj == null || dataObj == "") {
        return returnString;
    }
    else {
        returnString = "<td style='mso-number-format:\"#,##" + basicNumString + "\";'>" + dataObj + "</td>";
        return returnString;
    }
}

//解决数字字符串前导零被隐藏的问题
function numToStringExcelTd(dataObj) {
    if (dataObj != undefined && dataObj != null && dataObj != '') {
        return "<td x:str=\"'" + dataObj + "\">" + dataObj + "</td>";
    }
    else {
        return "<td> </td>";
    }
}