$(function () {
    //grid绑定
    initGrid();

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
        rownumbers: true,
        pagination: true,                   //是否显示分页
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        columns: [[
            { title: '公司机构', field: 'WName', width: 80, formatter: frxs.formatText },
            { title: '主供应商', field: 'VendorName', width: 180, align: 'left', formatter: frxs.formatText },
            { title: '商品分类', field: 'CategoryName', width: 220, align: 'left', formatter: frxs.formatText },
            { title: '商品编码', field: 'SKU', width: 80, align: 'center' },
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
            { title: '商品状态', field: 'WStatusName', width: 60, align: 'center' },
            { title: '单位', field: 'BigUnit', width: 50, align: 'center' },
            {
                title: '主供应商最后代购价', field: 'LastBuyPrice2', width: 110, align: 'right', formatter: function (value) {
                    value = ((value == "" || !value) ? "0" : value);
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '商品最后代购价', field: 'LastBuyPrice', width: 100, align: 'right', formatter: function (value) {
                    value = ((value == "" || !value) ? "0" : value);
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '商品代购价', field: 'BuyPrice', width: 80, align: 'right', formatter: function (value) {
                    value = ((value == "" || !value) ? "0" : value);
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '系统价', field: 'SalePrice', width: 80, align: 'right', formatter: function (value) {
                    value = ((value == "" || !value) ? "0" : value);
                    return parseFloat(value).toFixed(4);
                }
            }
        ]],
        toolbar: [
            {
                id: 'btnExport2',
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
    //        ), "供应商代购价查询报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    $.ajax({
        url: '../StoreReport/GetListMainVendorByPrice',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            //WID: $("#WID").combobox('getValue'),后台会自动加WID
            VendorID: $("#VendorID").val(),
            SKU: $('#SKU').val(),
            ProductName: $('#ProductName').val(),
            WStatus: $("#WStatus").combobox('getValue'),
            c1: $("#CategoriesId1").combobox('getValue'),
            c2: $("#CategoriesId2").combobox('getValue'),
            c3: $("#CategoriesId3").combobox('getValue'),
            IsNoStock: $("#IsNoStock").combobox("getValue")
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
    trtdCode += "<td>主供应商</td>";
    trtdCode += "<td>商品分类</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品类型</td>";
    trtdCode += "<td>商品状态</td>";
    trtdCode += "<td>单位</td>";
    trtdCode += "<td>主供应商最后代购价</td>";
    trtdCode += "<td>商品最后代购价</td>";
    trtdCode += "<td>商品代购价</td>";
    trtdCode += "<td>系统价</td>";
    trtdCode += "</tr>";

    function getExcelTr(trData) {
        var trHtml = "";
        trHtml += "<tr>";
        trHtml += "<td style='height:20px'>" + frxs.replaceCode(trData.WName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.VendorName) + "</td>";
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


        trHtml += "<td>" + trData.WStatusName + "</td>";
        trHtml += "<td>" + trData.BigUnit + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.LastBuyPrice2) ? "0" : trData.LastBuyPrice2) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.LastBuyPrice) ? "0" : trData.LastBuyPrice) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.BuyPrice) ? "0" : trData.BuyPrice) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.SalePrice) ? "0" : trData.SalePrice) + "</td>";

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
            ), "供应商代购价查询报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}


//查询
function search() {
    $('#grid').datagrid({
        url: '../StoreReport/GetListMainVendorByPrice',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
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
        onLoadSuccess: function () {
            $('#grid').datagrid('clearSelections');
        },
        queryParams: {
            //查询条件
            //WID: $("#WID").combobox('getValue'),后台会自动加WID
            VendorID: $("#VendorID").val(),
            SKU: $('#SKU').val(),
            ProductName: $('#ProductName').val(),
            WStatus: $("#WStatus").combobox('getValue'),
            c1: $("#CategoriesId1").combobox('getValue'),
            c2: $("#CategoriesId2").combobox('getValue'),
            c3: $("#CategoriesId3").combobox('getValue'),
            IsNoStock: $("#IsNoStock").combobox("getValue")
        }
    });
}

function resetSearch() {
    //$("#WID").combobox('setValue', '');
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');

    $("#WStatus").combobox('setValue', '');

    $("#SKU").val('');
    $("#ProductName").val('');

    $("#VendorID").val('');
    $("#VendorCode").val('');
    $("#VendorName").val('');
    $("#IsNoStock").combobox("setValue", '');
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
    $("#VendorID").val(vendorId);
    $("#VendorCode").val(vendorCode);
    $("#VendorName").val(vendorName);
}


//供应商事件绑定
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
                $("#VendorID").val(parseobj.rows[0].VendorID);
                $("#VendorCode").val(parseobj.rows[0].VendorCode);
                $("#VendorName").val(parseobj.rows[0].VendorName);
            } else {
                selVendor();
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
    var h = ($(window).height() - $("fieldset").height() - 21);
    $('#grid').datagrid('resize', {
        width: $(window).width() - 10,
        height: h
    });
}
