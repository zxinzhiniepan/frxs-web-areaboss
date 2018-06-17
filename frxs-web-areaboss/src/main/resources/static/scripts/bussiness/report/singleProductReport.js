$(function () {
    //grid绑定
    initGrid();

    //绑定仓库
    initDDL();

    //grid高度改变
    gridresize();

    $("#SettDateBegin").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#SettDateEnd").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#PostingTimeBegin").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#PostingTimeEnd").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");

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

function initGrid() {
    $('#grid').datagrid({
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
        },
        columns: [[
            { title: '公司机构', field: 'SubWName', width: 180 },
            {
                title: '单号', field: 'BillID', width: 100, align: 'center', formatter: function (value, rec) {
                    if (value && value != '期末' && value != '期初') {
                        var type = "";
                        switch (rec.OrderType) {
                            case '代购收货单':
                                type = 'buyorder';
                                break;
                            case '门店退货单':
                                type = 'saleback';
                                break;
                            case '库存盘盈单':
                                type = 'winorder';
                                break;
                            case '库存盘亏单':
                                type = 'loseorder';
                                break;
                            case '代购退库单':
                                type = 'buyback';
                                break;
                            case '门店收货单':
                                type = 'saleorder';
                                break;
                            case '库存报损单':
                                type = 'lossorder';
                                break;
                        }
                        return '<a href="#" style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'' + type + '\',\'' + value + '\')">' + value + '<a/>';
                    } else {
                        return value;
                    }
                }
            },
            { title: '单据类型', field: 'OrderType', align: 'center', width: 100 },
            {
                title: '过帐日', field: 'SettDate', align: 'center', width: 120, formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd") : "";
                }
            },
            { title: '操作员', field: 'EmpName', align: 'center', width: 100 },
            { title: '名称', field: 'VendorName', align: 'left', width: 160 },
            { title: '商品编码', field: 'SKU', align: 'center', width: 100 },
            { title: '商品名称', field: 'ProductName', align: 'left', width: 220 },
            { title: '单位', field: 'Unit', align: 'center', width: 100 },
            {
                title: '入库数量', field: 'InQty', align: 'right', width: 100, formatter: function (value, rec) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '出库数量', field: 'OutQty', align: 'right', width: 120, formatter: function (value, rec) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '期末数量', field: 'TermQty', align: 'right', width: 80, formatter: function (value, rec) {
                    return parseFloat(value).toFixed(2);
                }
            },

            {
                title: '入库金额', field: 'InAmt', width: 100, align: 'right', formatter: function (value, rec) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '出库金额', field: 'OutAmt', width: 100, align: 'right', formatter: function (value, rec) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '期末金额', field: 'TermAmt', width: 100, align: 'right', formatter: function (value, rec) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '过帐时间', field: 'PostingTime', width: 160, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd HH:mm") : "";
                }
            }
        ]],
        toolbar: [
            {
                id: 'btnExport',
                text: '导出',
                iconCls: 'icon-daochu',
                handler: exportoutToPage // exportout
            }]
    });
}


//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }


    var loading = frxs.loading();
    $.ajax({
        url: '../PurchaseReport/GetSingleProductReportlList',
        type: 'post',
        data: {
            //查询条件
            SKU: $("#SKU").val(),
            SettDateBegin: $("#dateType").combobox("getValue") == "GZSJ" ? "" : $("#SettDateBegin").val(),
            SettDateEnd: $("#dateType").combobox("getValue") == "GZSJ" ? "" : $("#SettDateEnd").val(),
            PostingTimeBegin: $("#dateType").combobox("getValue") == "GZR" ? "" : $("#PostingTimeBegin").val(),
            PostingTimeEnd: $("#dateType").combobox("getValue") == "GZR" ? "" : $("#PostingTimeEnd").val(),
            SubWID: $("#SubWID").combobox('getValue')
        },
        success: function (data) {
            loading.close();
            $('#grid').datagrid({ data: $.parseJSON(data) });
        }
    });
}

function resetSearch() {
    $("#SKU").val('');
    $("#SettDateBegin").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#SettDateEnd").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#PostingTimeBegin").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#PostingTimeEnd").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
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

//导出 新代码
function exportoutToPage() {
    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    var text = exportExcel();
    if (text) {
        event.preventDefault();
        var bb = self.Blob;
        saveAs(
            new bb(
                ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
                , { type: "html/plain;charset=utf8" }
            ), "商品明细账报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
    loading.close();
}

function initDDL() {
    $.ajax({
        url: '../Common/GetWCList',
        type: 'get',
        data: {},
        success: function (data) {
            //在第一个Item加上请选择
            data = $.parseJSON(data);
            //data.unshift({ "WID": "", "WName": "-请选择-" });
            //创建控件
            $("#SubWID").combobox({
                data: data,             //数据源
                valueField: "WID",       //id列
                textField: "WName"      //value列
            });
            if (data.length > 0) {
                $("#SubWID").combobox('select', data[0].WID);
            }
        }, error: function (e) {

        }
    });
}


//客户端导出Excel
function exportExcel() {
    var rows = $("#grid").datagrid("getRows");
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>公司机构</td>";
    trtdCode += "<td>单号</td>";
    trtdCode += "<td>单据类型</td>";
    trtdCode += "<td>过帐日</td>";
    trtdCode += "<td>操作员</td>";
    trtdCode += "<td>名称</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>单位</td>";
    trtdCode += "<td>入库数量</td>";
    trtdCode += "<td>出库数量</td>";
    trtdCode += "<td>期末数量</td>";
    trtdCode += "<td>入库金额</td>";
    trtdCode += "<td>出库金额</td>";
    trtdCode += "<td>期末金额</td>";
    trtdCode += "<td>过帐时间</td>";
    trtdCode += "</tr>";

    for (var i = 0; i < rows.length; i++) {
        trtdCode += "<tr>";
        trtdCode += "<td style='height:20px'>" + rows[i].SubWName + "</td>";//公司机构
        trtdCode += "<td x:str=\"'" + rows[i].BillID + "\">" + rows[i].BillID + "</td>";                                 //单号
        trtdCode += "<td>" + rows[i].OrderType + "</td>";                              //单据类型
        trtdCode += "<td>" + (rows[i].SettDate ? frxs.dateTimeFormat(rows[i].SettDate, "yyyy-MM-dd") : "") + "</td>";                         //过帐日
        trtdCode += "<td>" + rows[i].EmpName + "</td>";                              //操作员
        trtdCode += "<td>" + rows[i].VendorName + "</td>";                              //名称
        trtdCode += "<td x:str=\"'" + rows[i].SKU + "\">" + rows[i].SKU + "</td>";                            //商品编码
        trtdCode += "<td>" + frxs.replaceCode(rows[i].ProductName) + "</td>";                              //商品名称
        trtdCode += "<td>" + rows[i].Unit + "</td>";                              //单位
        trtdCode += "<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].InQty + "</td>";                              //入库数量
        trtdCode += "<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].OutQty + "</td>";                              //出库数量
        trtdCode += "<td style='mso-number-format:\"#,##0.00\";'>" + rows[i].TermQty + "</td>";                              //出库数量
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + rows[i].InAmt + "</td>";                              //入库金额
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + rows[i].OutAmt + "</td>";                              //出库金额
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + rows[i].TermAmt + "</td>";                              //期末金额
        trtdCode += "<td>" + rows[i].PostingTime + "</td>";                              //过账时间
        trtdCode += "</tr>";
    }

    var dataCode = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>';
    dataCode = dataCode.replace("{table}", trtdCode);
    return dataCode;
}