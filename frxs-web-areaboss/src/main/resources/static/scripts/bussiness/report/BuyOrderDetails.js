/// <reference path="../../../Content/easyui-1.4.3/jquery.min.js" />

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

    $("#CreateTime1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#CreateTime2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#PostingTime1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#PostingTime2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");

});

function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,                   //显示行编号
        pagination: true,
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        frozenColumns: [[
             {
                 title: '用户单号', field: 'BuyID', width: 100, align: 'center',
                 formatter: function (value, rec) {
                     if (value && value != '合计') {
                         return '<a href="#"  style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'buyorder\',\'' + value + '\')">' + value + '</a>';
                     } else {
                         return value;
                     }
                 }
             }
        ]],
        columns: [[

            {
                title: '过账日', field: 'Sett_Date', width: 80, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd") : "";
                }
            },
            { title: '过账时间', field: 'PostingTime', width: 130, align: 'center' },
            //{
            //    title: '账期', field: '账期', width: 80, align: 'center', formatter: function (value) {
            //        return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd") : "";
            //    }
            //},
            { title: '供应商', field: 'VendorName', width: 150, align: 'left', formatter: frxs.formatText },
            { title: '供应商编码', field: 'VendorCode', width: 80, align: 'center', formatter: frxs.formatText },
            { title: '仓库', field: 'SubWName', width: 60, align: 'center' },
            { title: '开单人', field: 'CreateUserName', width: 60, align: 'center' },
            { title: '商品名称', field: 'ProductName', width: 150, align: 'left', formatter: frxs.formatText },
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
            { title: '商品编码', field: 'SKU', width: 60, align: 'center', formatter: frxs.formatText },
            { title: '商品单位', field: 'BuyUnit', width: 70, align: 'center' },
            { title: '规格', field: 'Specification', width: 50, align: 'center' },
            { title: '条码', field: 'BarCode', width: 100, align: 'center' },
            {
                title: '包装数', field: 'BuyPackingQty', width: 50, align: 'right', formatter: function (value) {
                    return value ? parseFloat(value).toFixed(2) : "";
                }
            },
            {
                title: '数量', field: 'BuyQty', width: 80, align: 'right',
                formatter: function (value) { return parseFloat(value).toFixed(4); }
            },
            //{
            //    title: '散数', field: '散数', width: 60, align: 'right',
            //    formatter: function (value) { return parseFloat(value).toFixed(4); }
            //},
            {
                title: '数量合计', field: 'TotalBuyQty', width: 80, align: 'right',
                formatter: function (value) { return parseFloat(value).toFixed(4); }
            },
            {
                title: '不含税单价', field: 'NotTaxPrice', width: 80, align: 'right', formatter: function (value, rec) {
                    if (rec.BuyID != "合计") {
                        value = value ? value : "0.0000";
                    }
                    return value ? parseFloat(value).toFixed(4) : "";
                }
            },
            {
                title: '含税单价', field: 'TaxPrice', width: 80, align: 'right', formatter: function (value, rec) {
                    if (rec.BuyID != "合计") {
                        value = value ? value : "0.0000";
                    }
                    return value ? parseFloat(value).toFixed(4) : "";
                }
            },
            {
                title: '不含税金额', field: 'NotTaxAmount', width: 80, align: 'right',
                formatter: function (value) { return parseFloat(value).toFixed(4); }
            },
            {
                title: '含税金额', field: 'TaxAmount', width: 80, align: 'right',
                formatter: function (value) { return parseFloat(value).toFixed(4); }
            },
            { title: '品牌', field: 'BrandIdName', width: 80, align: 'left', formatter: frxs.formatText },
            { title: '商品分类', field: 'CategoryIdName', width: 120, align: 'left' },
             { title: '备注', field: 'Remark', width: 120, align: 'left', formatter: frxs.formatText }

        ]],
        toolbar: [
           {
               id: 'btnExport',
               text: '导出',
               iconCls: 'icon-daochu',
               handler: exportout
           }],
        onLoadSuccess: function () {
            //清除底部合计行中不需要合计的字段值
            $(".datagrid-ftable").eq(1).find("td[field='NotTaxPrice'] div,td[field='TaxPrice'] div").html("");
        }
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
    //        ), "代购入库明细报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    $.ajax({
        url: '../BuyOrderDetailsReport/GetList',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            nKind: 4,
            SubWID: $("#SubWID").combobox('getValue'),
            CategoryId1: $('#CategoriesId1').combobox('getValue'),
            CategoryId2: $('#CategoriesId2').combobox('getValue'),
            CategoryId3: $('#CategoriesId3').combobox('getValue'),
            CreateTime1: $('#CreateTime1').val(),
            CreateTime2: $('#CreateTime2').val(),
            PostingTime1: $('#PostingTime1').val(),
            PostingTime2: $('#PostingTime2').val(),
            SKU: $.trim($('#SKU').val()),
            ProductName: $.trim($('#ProductName').val()),
            CreateUserName: $.trim($('#CreateUserName').val()),
            VendorCode: $.trim($('#VendorCode').val()),
            VendorName: $.trim($('#VendorName').val()),
            SettDateStart: $.trim($('#SettDateStart').val()),
            SettDateEnd: $.trim($('#SettDateEnd').val()),
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

///导出Excel
function exportExcel(data) {

    var rows = data.rows;
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>用户单号</td>";
    trtdCode += "<td>过账日</td>";
    trtdCode += "<td>过账时间</td>";
    trtdCode += "<td>供应商</td>";
    trtdCode += "<td>供应商编码</td>";
    trtdCode += "<td>仓库</td>";
    trtdCode += "<td>开单人</td>";
    trtdCode += "<td>备注</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品类型</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>商品单位</td>";
    trtdCode += "<td>规格</td>";
    trtdCode += "<td>条码</td>";
    trtdCode += "<td>包装数</td>";
    trtdCode += "<td>数量</td>"
    trtdCode += "<td>数量合计</td>";
    trtdCode += "<td>不含税单价</td>";
    trtdCode += "<td>含税单价</td>";
    trtdCode += "<td>不含税金额</td>";
    trtdCode += "<td>含税金额</td>";
    trtdCode += "<td>品牌</td>";
    trtdCode += "<td>商品分类</td>";
    trtdCode += "</tr>";

    function getExcelTr(trData) {
        var trHtml = "";

        trHtml += "<tr>";
        trHtml += "<td style='height:20px' x:str=\"'" + trData.BuyID + "\">" + frxs.replaceCode(trData.BuyID) + "</td>";
        trHtml += "<td>" + (trData.BuyID == "合计" ? "" : frxs.dateTimeFormat(trData.Sett_Date, "yyyy-MM-dd")) + "</td>";
        trHtml += "<td>" + (trData.BuyID == "合计" ? "" : trData.PostingTime + "</td>");
        trHtml += "<td>" + frxs.replaceCode(trData.VendorName) + "</td>";
        trHtml += trData.BuyID == "合计" ? "<td></td>" : ("<td x:str=\"'" + trData.VendorCode + "\">" + frxs.replaceCode(trData.VendorCode) + "</td>");
        trHtml += "<td>" + frxs.replaceCode(trData.SubWName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.CreateUserName) + "</td>";
        trHtml += "<td width='380'>" + frxs.replaceCode(trData.Remark) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ProductName) + "</td>";
        var isNoStockStr = "";
        if (trData.IsNoStock == 0) {
            isNoStockStr = "有库存商品";
        }
        else if (trData.IsNoStock == 1) {
            isNoStockStr = "无库存商品";
        }
        trHtml += trData.BuyID == "合计" ? "<td></td>" : "<td>" + isNoStockStr + "</td>";

        trHtml += trData.BuyID == "合计" ? "<td></td>" : ("<td x:str=\"'" + trData.SKU + "\">" + trData.SKU + "</td>");
        trHtml += "<td>" + (trData.BuyID == "合计" ? "" : trData.BuyUnit + "</td>");
        trHtml += "<td>" + (trData.BuyID == "合计" ? "" : trData.Specification + "</td>");
        trHtml += trData.BuyID == "合计" ? "<td></td>" : ("<td x:str=\"'" + trData.BarCode + "\">" + trData.BarCode + "</td>");
        trHtml += trData.BuyID == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + trData.BuyPackingQty + "</td>");
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.BuyQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.TotalBuyQty + "</td>";
        trHtml += trData.BuyID == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.NotTaxPrice + "</td>");
        trHtml += trData.BuyID == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.TaxPrice + "</td>");
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.NotTaxAmount + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.NotTaxAmount + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.BrandIdName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.CategoryIdName) + "</td>";
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

    if (dataCode) {
        event.preventDefault();
        var bb = self.Blob;
        saveAs(
            new bb(
                ["\ufeff" + dataCode] //\ufeff防止utf8 bom防止中文乱码
                , { type: "html/plain;charset=utf8" }
            ), "代购入库明细报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }

    //return dataCode;
}


//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }

    $('#grid').datagrid({
        url: '../BuyOrderDetailsReport/GetList',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        fit: false,                         //分页在最下面
        pagination: true,                   //是否显示分页
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
        //queryParams: $("#myForm").find("input,select").serialize() + "&nKind=" + 4
        queryParams: {
            //查询条件
            nKind: 4,
            SubWID: $("#SubWID").combobox('getValue'),
            CategoryId1: $('#CategoriesId1').combobox('getValue'),
            CategoryId2: $('#CategoriesId2').combobox('getValue'),
            CategoryId3: $('#CategoriesId3').combobox('getValue'),
            CreateTime1: $('#CreateTime1').val(),
            CreateTime2: $('#CreateTime2').val(),
            PostingTime1: $('#PostingTime1').val(),
            PostingTime2: $('#PostingTime2').val(),
            SKU: $.trim($('#SKU').val()),
            ProductName: $.trim($('#ProductName').val()),
            CreateUserName: $.trim($('#CreateUserName').val()),
            VendorCode: $.trim($('#VendorCode').val()),
            VendorName: $.trim($('#VendorName').val()),
            SettDateStart: $.trim($('#SettDateStart').val()),
            SettDateEnd: $.trim($('#SettDateEnd').val()),
            IsNoStock: $("#IsNoStock").combobox("getValue")
        }
    });
}




function resetSearch() {
    $("#SubWID").combobox('setValue', '');
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');

    $('#IsNoStock').combobox('setValue', '');

    $("#VendorCode").val('');
    $("#VendorName").val('');
    $("#VendorID").val('');

    $("#CreateUserName").val('');
    $("#SKU").val('');
    $("#ProductName").val('');

    $('#SettDateStart').val('');
    $("#SettDateEnd").val('');

    $("#CreateTime1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#CreateTime2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#PostingTime1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#PostingTime2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
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
    var h = ($(window).height() - $("fieldset").height() - 30);
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
    $("#VendorID").val(vendorId);
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
                $("#VendorID").val(obj.rows[0].VendorID);
                $("#VendorCode").val(obj.rows[0].VendorCode);
                $("#VendorName").val(obj.rows[0].VendorName);
            } else {
                selVendor();
            }
        }
    });
}
