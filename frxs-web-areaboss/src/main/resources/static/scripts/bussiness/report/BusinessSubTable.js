$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();

    //供应商-代购员事件绑定
   // eventBind();

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
        frozenColumns: [[

        ]],
        columns: [[
            { title: '公司机构', field: 'SubWName', width: 100, align: 'left', formatter: frxs.formatText },
            { title: '商品分类', field: 'CategoryName3', width: 180, align: 'left', formatter: frxs.formatText },
            { title: '商品编码', field: 'SKU', width: 100, align: 'center', formatter: frxs.formatText },
            { title: '条码', field: 'BarCode', width: 125, align: 'center', formatter: frxs.formatText },
            { title: '商品名称', field: 'ProductName', width: 280, align: 'left', formatter: frxs.formatText },
            { title: '代购员', field: 'EmpName', width: 70, align: 'center', formatter: frxs.formatText },
            { title: '供应商', field: 'VendorName', width: 150, align: 'left', formatter: frxs.formatText },
            {
                title: '是否主供应商', field: 'IsMainVendor', width: 100, align: 'center', formatter: function (value) {
                    return value == "0" ? "否" : (value == ""?"":"是");
                }
            },

            {
                title: '退货库利润', field: 'thkly', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0" : value;
                }
            },
            {
                title: '兑奖利润', field: 'rjly', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '月返', field: 'yf', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '季返', field: 'jf', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '年返', field: 'nf', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0" : value;
                }
            },
            {
                title: '赠品分配金额', field: 'zpfpje', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '倒货利润', field: 'dhly', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0" : value;
                }
            },
            {
                title: '价格补益', field: 'jgbc', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '铺市费', field: 'psf', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '促销费', field: 'cxf', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '推广费', field: 'tgf', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '供应商赠送', field: 'gyszs', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '退货库调价差异', field: 'thktjcy', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '其他', field: 'qt', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '其他2', field: 'qt2', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '批发价调价差额', field: 'pfjtjce', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '进货批发金额', field: 'jhpfje', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '进批差额', field: 'jpce', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            //{
            //    title: '到货率', field: 'dhl', width: 100, align: 'right', formatter: function (value) {
            //        return value == "" ? "0.00%" : parseFloat(value).toFixed(2)+"%";
            //    }
            //},
            {
                title: '净利润率', field: 'jlyl', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.00%" : parseFloat(value).toFixed(2)+"%";
                }
            },
            {
                title: '净利润', field: 'jly', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送金额', field: 'xsje', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送成本金额', field: 'xscbje', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '数量', field: 'sl', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '成本净单价', field: 'cbjdj', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '库存数量', field: 'cksl', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '当前批发价', field: 'dqpfj', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '当前批发金额', field: 'dqpfje', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
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

function search() {
    $('#grid').datagrid({
        url: '../StoreReport/GetBusinessSubTableReport',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'post',                    //提交方式
        fit: false,                         //分页在最下面
        pagination: false,                   //是否显示分页
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
          
            CreateTime1: $("#CreateTime1").val(),
            CreateTime2: $("#CreateTime2").val(),
            VendorCode: $("#VendorCode").val(),
            SubWID: $("#SubWID").combobox('getValue'),
            SKU: $("#SKU").val(),
            ProductName: $("#ProductName").val(),
            BarCode: $("#BarCode").val(),
            CategoryId1: $('#CategoriesId1').combobox('getValue'),
            CategoryId2: $('#CategoriesId2').combobox('getValue'),
            CategoryId3: $('#CategoriesId3').combobox('getValue'),
        }
    });
}

function resetSearch() {
    $('#CreateTime1').val('');
    $('#CreateTime2').val('');
    $('#VendorCode').val('');
    $("#SubWID").combobox('setValue', '');
   // $('#CreateUserName').val('');
    $('#SKU').val('');
    $('#ProductName').val('');
    $('#BarCode').val('');
   // $('#BrandName').val('');
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');
}

function eventBind() {

}

function exportoutToPage() {
    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    var text = exportExcel();
    if (text) {
        var bb = self.Blob;
        saveAs(
            new bb(
                ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
                , { type: "html/plain;charset=utf8" }
            ), "业务分表报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
    loading.close();
}

function exportExcel() {
    var rows = $("#grid").datagrid("getRows");
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td>公司机构</td>";
    trtdCode += "<td>商品分类</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>条码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>代购员</td>";
    trtdCode += "<td>供应商</td>";
    trtdCode += "<td>是否主供应商</td>";
    trtdCode += "<td>退货库利润</td>";
    trtdCode += "<td>兑奖利润</td>";
    trtdCode += "<td>月返</td>";
    trtdCode += "<td>季返</td>";
    trtdCode += "<td>年返</td>";
    trtdCode += "<td>赠品分配金额</td>";
    trtdCode += "<td>倒货利润</td>";
    trtdCode += "<td>价格补益</td>";
    trtdCode += "<td>铺市费</td>";
    trtdCode += "<td>促销费</td>";
    trtdCode += "<td>推广费</td>";
    trtdCode += "<td>供应商赠送</td>";
    trtdCode += "<td>退货库调价差异</td>";
    trtdCode += "<td>其他</td>";
    trtdCode += "<td>其他2</td>";
    trtdCode += "<td>批发价调价差额</td>";
    trtdCode += "<td>进货批发金额</td>";
    trtdCode += "<td>进批差额</td>";
    trtdCode += "<td>到货率</td>";
    trtdCode += "<td>净利润率</td>";
    trtdCode += "<td>净利润</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>配送成本金额</td>";
    trtdCode += "<td>数量</td>";
    trtdCode += "<td>成本净单价</td>";
    trtdCode += "<td>库存数量</td>";
    trtdCode += "<td>当前批发价</td>";
    trtdCode += "<td>当前批发金额</td>";
    trtdCode += "</tr>";

    for (var i = 0; i < rows.length; i++) {
        trtdCode += "<tr>";

        trtdCode += "<td>" + frxs.replaceCode(rows[i].SubWName) + "</td>";
        trtdCode += "<td>" + frxs.replaceCode(rows[i].CategoryName3) + "</td>";
        trtdCode += "<td>" + frxs.replaceCode(rows[i].SKU) + "</td>";
        trtdCode += "<td>" + rows[i].BarCode + "</td>";
        trtdCode += "<td>" + rows[i].ProductName + "</td>";
        trtdCode += "<td>" + rows[i].EmpName + "</td>";
        trtdCode += "<td>" + rows[i].VendorName + "</td>";
        trtdCode += "<td>" + rows[i].IsMainVendor + "</td>";
      
        //避免导出空行为0
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].thkly + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].rjly + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].yf + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].jf + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].nf + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].zpfpje + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].dhly + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].jgbc + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].psf + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].cxf + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].cxf + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].gyszs + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].thktjcy + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].qt + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].qt2 + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].pfjtjce + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].jhpfje + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].jpce + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].dhl + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].jlyl + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].jly + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].xsje + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].xscbje + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].sl + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].cbjdj + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].cksl + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].dqpfj + "</td>");
        trtdCode += rows[i].ProductName == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].dqpfje + "</td>");
  

        trtdCode += "</tr>";
    }

    var dataCode = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>';
    dataCode = dataCode.replace("{table}", trtdCode);
    return dataCode;
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