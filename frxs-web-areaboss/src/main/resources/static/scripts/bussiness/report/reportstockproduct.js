
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
        rownumbers: true,
        pagination: true,                   //是否显示分页
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        frozenColumns: [[
           //冻结列
          { title: '仓库', field: 'SubWName', width: 60, align: 'center', formatter: frxs.formatText }
        ]],
        columns: [[
            { title: '公司机构', field: 'WName', width: 80, align: 'left', formatter: frxs.formatText },
            { title: '商品编码', field: 'ProductCode', width: 80, align: 'center' },
            { title: '商品分类', field: 'CategoryName', width: 120, align: 'left', formatter: frxs.formatText },
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
            {
                title: '库存数量', field: 'StockQty', width: 80, align: 'right', formatter: function (value) {
                    if (value == null) {
                        return parseFloat(0).toFixed(2);
                    }
                    return value == "" ? "0.00" : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '库存单价', field: 'Price', width: 80, align: 'right', formatter: function (value, rec) {
                    if (value == null) {
                        return parseFloat(0).toFixed(4);
                    }
                    return rec.WName == "合计" ? "" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '库存金额', field: 'Amount', width: 100, align: 'right', formatter: function (value) {
                    if (value == null) {
                        return parseFloat(0).toFixed(4);
                    }
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '建议零售价', field: 'SalePrice', width: 80, align: 'right', formatter: function (value, rec) {
                    if (value == null) {
                        return parseFloat(0).toFixed(4);
                    }
                    return rec.WName == "合计" ? "" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '零售金额', field: 'SaleAmount', width: 100, align: 'right', formatter: function (value) {
                    if (value == null) {
                        return parseFloat(0).toFixed(4);
                    }
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送未过账数量', field: 'NoStoreQty', width: 100, align: 'right', formatter: function (value) {
                    if (value == null) {
                        return parseFloat(0).toFixed(2);
                    }
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '实时库存数量', field: 'StoreQty', width: 100, align: 'right', formatter: function (value) {
                    if (value == null) {
                        return parseFloat(0).toFixed(2);
                    }
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '系统价', field: 'WholeSalePrice', width: 100, align: 'right', formatter: function (value, rec) {
                    if (value == null) {
                        return parseFloat(0).toFixed(4);
                    }
                    return rec.WName == "合计" ? "" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送金额', field: 'WholeSaleAmount', width: 100, align: 'right', formatter: function (value) {
                    if (value == null) {
                        return parseFloat(0).toFixed(4);
                    }
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '总库存金额', field: 'StockTotalAmount', width: 100, align: 'right', formatter: function (value) {
                    if (value == null) {
                        return parseFloat(0).toFixed(4);
                    }
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '总零售金额', field: 'SaleTotalAmount', width: 100, align: 'right', formatter: function (value) {
                    if (value == null) {
                        return parseFloat(0).toFixed(4);
                    }
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '总配送金额', field: 'WholeSaleTotalAmount', width: 100, align: 'right', formatter: function (value) {
                    if (value == null) {
                        return parseFloat(0).toFixed(4);
                    }
                    return parseFloat(value).toFixed(4);
                }
            },
            { title: '计量单位', field: 'Unit', width: 70, align: 'center' },
            { title: '规格', field: 'Spec', width: 60, align: 'center' },
            { title: '主供应商', field: 'VendorName', width: 200, align: 'left', formatter: frxs.formatText },
            { title: '商品状态', field: 'Status', width: 70, align: 'center' },
            { title: '条码', field: 'Barcode', width: 100, align: 'center' },
            {
                title: '代购员', field: 'BuyEmpName', width: 70, align: 'center', formatter: frxs.formatText
            }
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

//导出
function exportoutToPage() {
    //var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    //var text = exportExcel();
    //if (text) {
    //    event.preventDefault();
    //    var bb = self.Blob;
    //    saveAs(
    //        new bb(
    //            ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
    //            , { type: "html/plain;charset=utf8" }
    //        ), "库存状况查询导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    event.preventDefault();

    $.ajax({
        url: '../StoreReport/GetList',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            nKind: 1,
            SubWID: $("#SubWID").combobox('getValue'),
            S1: $('#CategoriesId1').combobox('getValue'),
            S2: $('#CategoriesId2').combobox('getValue'),
            S3: $('#CategoriesId3').combobox('getValue'),
            S4: $('#S4').val(),
            S5: $('#S5').val(),
            S6: $('#S6').val(),
            S7: $('#S7').val(),
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
    trtdCode += "<td style='height:24px'>仓库</td>";
    trtdCode += "<td>公司机构</td>";
    trtdCode += "<td>商品分类</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品类型</td>";
    trtdCode += "<td>库存数量</td>";
    trtdCode += "<td>库存单价</td>";
    trtdCode += "<td>库存金额</td>";
    trtdCode += "<td>建议零售价</td>";
    trtdCode += "<td>零售金额</td>";
    trtdCode += "<td>配送未过账数量</td>";
    trtdCode += "<td>实时库存数量</td>";
    trtdCode += "<td>系统价</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>总库存金额</td>";
    trtdCode += "<td>总零售金额</td>";
    trtdCode += "<td>总配送金额</td>";
    trtdCode += "<td>计量单位</td>";
    trtdCode += "<td>规格</td>";
    trtdCode += "<td>主供应商</td>";
    trtdCode += "<td>商品状态</td>";
    trtdCode += "<td>条码</td>";
    trtdCode += "<td>代购员</td>";

    trtdCode += "</tr>";

    function getExcelTr(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        trHtml += "<td style='height:20px'>" + frxs.replaceCode(trData.SubWName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.WName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.CategoryName) + "</td>";
        trHtml += trData.WName == "合计" ? "<td></td>" : "<td x:str=\"'" + trData.ProductCode + "\">" + frxs.replaceCode(trData.ProductCode) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ProductName) + "</td>";

        var isNoStockStr = "";
        if (trData.IsNoStock == 0) {
            isNoStockStr = "有库存商品";
        }
        else if (trData.IsNoStock == 1) {
            isNoStockStr = "无库存商品";
        }
        trHtml += "<td>" + isNoStockStr + "</td>";

        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.StockQty + "</td>";
        //避免导出空行为0
        trHtml += trData.WName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.Price + "</td>");
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.Amount + "</td>";
        trHtml += trData.WName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + (trData.SalePrice==null?"0":trData.SalePrice) + "</td>");
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + (trData.SaleAmount==null?"0":trData.SaleAmount) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.NoStoreQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.StoreQty + "</td>";
        trHtml += trData.WName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.WholeSalePrice + "</td>");
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.WholeSaleAmount + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.StockTotalAmount + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SaleTotalAmount + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.WholeSaleTotalAmount + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.Unit) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.Spec) + "</td>";
        trHtml += "<td width='380'>" + frxs.replaceCode(trData.VendorName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.Status) + "</td>";
        trHtml += trData.WName == "合计" ? "<td></td>" : "<td x:str=\"'" + trData.Barcode + "\">" + frxs.replaceCode(trData.Barcode) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.BuyEmpName) + "</td>";

        trtdCode += "</tr>";

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
            ), "库存状况查询导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}

//查询
function search() {
    $('#grid').datagrid({
        url: '../StoreReport/GetList',
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
        showFooter: true,
        onClickRow: function (rowIndex) {
            $('#grid').datagrid('clearSelections');
            $('#grid').datagrid('selectRow', rowIndex);
        },

        queryParams: {
            //查询条件
            nKind: 1,
            SubWID: $("#SubWID").combobox('getValue'),
            S1: $('#CategoriesId1').combobox('getValue'),
            S2: $('#CategoriesId2').combobox('getValue'),
            S3: $('#CategoriesId3').combobox('getValue'),
            S4: $('#S4').val(),
            S5: $('#S5').val(),
            S6: $('#S6').val(),
            S7: $('#S7').val(),
            IsNoStock: $("#IsNoStock").combobox("getValue")
        }
    });
}

function resetSearch() {
    $("#SubWID").combobox('setValue', '');
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');

    $("#IsNoStock").combobox("setValue", '');

    $("#VendorCode").attr("value", "");
    $("#VendorName").attr("value", "");
    $("#BuyEmpName").attr("value", "");
    $('#S5').val('');
    $('#S6').val('');

    $("#S4").attr("value", "");
    $("#S7").attr("value", "");
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
    $("#S7").val(empId);
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
    $("#S4").val(vendorId);
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
