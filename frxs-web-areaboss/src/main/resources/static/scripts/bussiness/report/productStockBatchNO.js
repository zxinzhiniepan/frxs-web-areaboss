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

    $("#S4").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S5").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");

});



function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,
        pagination: true,                   //是否显示分页
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        showFooter: true,
        onLoadSuccess: function () {
            var rows = $("#grid").datagrid("getRows");
            for (var i = 0; i < rows.length; i++) {
                var tooltipid = '#tooltip_' + i;
                if (rows[i].InID) {
                    $(tooltipid).tooltip(
                            {
                                content: $('<div style=max-height:200px;overflow:auto></div>'),
                                showEvent: 'click',
                                onUpdate: function (content) {
                                    var index = $(this).attr("id").substr(8);
                                    var row = $('#grid').datagrid('getData').rows[index];
                                    content.panel({
                                        width: 180,
                                        loadingMessage: '',
                                        border: false,
                                        //title: '出库记录',
                                        //href: 'GetStockFIFOOutList?InID=' + row.InID + "&WID=" + row.WID + "&SubWID=" + row.SubWID,
                                        //extractor: function (data) {
                                        //    data = JSON.parse(data);
                                        //    if (data.length > 0) {
                                        //        var result = "<table>"
                                        //        result = result + "<th>单据类型</th><th>单据编号</th>";
                                        //        for (var i = 0; i < data.length; i++) {
                                        //            var temp = "<tr>";
                                        //            temp = temp + "<td>" + data[i].BillType + "</td>";
                                        //            temp = temp + "<td>" + data[i].BillID + "</td>";
                                        //            temp = temp + "</tr>";

                                        //            result = result + temp;
                                        //        }
                                        //        result = result + "</table>";
                                        //        content.append(result);
                                        //    }
                                        //},
                                        href: "#",
                                        loader: function (param, success, error) {
                                            $.ajax({
                                                url: "../StoreReport/GetStockFIFOOutList",
                                                data: {
                                                    InID: row.InID,
                                                    WID: row.WID,
                                                    SubWID: row.SubWID
                                                },
                                                dataType: 'json',
                                                success: function (data) {
                                                    if (data.length > 0) {
                                                        var result = "<table >"
                                                        result = result + "<th style='width:100px;'>单据类型</th><th>单据编号</th>";
                                                        for (var i = 0; i < data.length; i++) {
                                                            var temp = "<tr>";
                                                            var typeStr = "";
                                                            var type = "";
                                                            switch (data[i].BillType) {
                                                                case 3:
                                                                    typeStr = "代购退货单";
                                                                    type = "buyback";
                                                                    break;
                                                                case 4:
                                                                    typeStr = "门店订单";
                                                                    type = "saleorder";
                                                                    break;
                                                                case 5:
                                                                    typeStr = "盘亏单";
                                                                    type = "loseorder";
                                                                    break;
                                                                case 6:
                                                                    typeStr = "报损单";
                                                                    type = "lossorder";
                                                                    break;
                                                            }
                                                            temp = temp + "<td>" + typeStr + "</td>";
                                                            temp = temp + "<td>" + '<a href="#" onclick="jumpDetails(\'' + type + '\',\'' + data[i].BillID + '\')" style="cursor:pointer;color:#0066cc " >' + data[i].BillID + '</a>' + "</td>";
                                                            temp = temp + "</tr>";
                                                            result = result + temp;
                                                        }
                                                        result = result + "</table>";
                                                        content.append(result);
                                                    }
                                                }
                                            });

                                        }
                                    });
                                },
                                onShow: function (content) {
                                    var t = $(this);
                                    t.tooltip('tip').unbind().bind('mouseenter', function () {
                                        t.tooltip('show');
                                    }).bind('mouseleave', function () {
                                        t.tooltip('hide');
                                    });
                                }
                            }
                        );
                }
            }
        },
        frozenColumns: [[

        ]],
        columns: [[
            { title: '批次号', field: 'BatchNO', width: 100, align: 'center', formatter: frxs.formatText },
            {
                title: '单号', field: 'BillID', width: 100, align: 'center',
                formatter: function (value, rec) {
                    if (value && value.length > 1) {   //对于迁移过来的数据 单据号默认为“1”，不进行跳转
                        var type = "";
                        switch (rec.BillType) {
                            case 0:
                                type = 'buyorder';
                                break;
                            case 1:
                                type = 'saleback';
                                break;
                            case 2:
                                type = 'winorder';
                                break;
                        }
                        return '<a href="#" onclick="jumpDetails(\'' + type + '\',\'' + value + '\')" style="cursor:pointer;color:#0066cc" >' + value + '</a>';
                    } else {
                        return value;
                    }
                }
            },
            {
                title: '单据类型', field: 'BillType', width: 80, align: 'left',
                formatter: function (value) {
                    var result = '';
                    switch (value) {
                        case 0:
                            result = '代购入库单';
                            break;
                        case 1:
                            result = '门店退货单';
                            break;
                        case 2:
                            result = '盘盈单';
                            break;
                    }
                    return result;
                }
            },
            { title: '过账时间', field: 'StockTime', width: 115, align: 'center', formatter: frxs.formatText },
            {
                title: '公司机构', field: 'WName', width: 100, align: 'center',
                formatter: function (value, rec) {
                    if (value) {
                        return rec.WName + '-' + rec.SubWName;
                    }
                }
            },
            { title: '供应商编码', field: 'VendorCode', width: 70, align: 'left', formatter: frxs.formatText },
            { title: '供应商名称', field: 'VendorName', width: 175, align: 'left', formatter: frxs.formatText },
            { title: '商品编码', field: 'SKU', width: 65, align: 'center', formatter: frxs.formatText },
            { title: '商品名称', field: 'ProductName', width: 230, align: 'left', formatter: frxs.formatText },
            { title: '库存单位', field: 'Unit', width: 60, align: 'left', formatter: frxs.formatText },
            {
                title: '当前库存数量', field: 'StockQty', width: 80, align: 'right',
                formatter: function (value) {
                    return value == "" ? "0.00" : parseFloat(value).toFixed(2);
                }
            },
             {
                 title: '库存金额', field: 'SalePrice', width: 80, align: 'right',
                 formatter: function (value) {
                     return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                 }
             },
            {
                title: '入库数量', field: 'Qty', width: 70, align: 'right',
                formatter: function (value) {
                    return value == "" ? "0.00" : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '已出库数量', field: 'TotalOutQty', width: 70, align: 'right',
                formatter: function (value, row, index) {
                    if (row.BatchNO != '合计') {
                        var temp = (value == "" ? "0.00" : parseFloat(value).toFixed(2));
                        if (parseFloat(temp) != 0) {
                            return '<a id="tooltip_' + index + '" href="#"  style="cursor:pointer;color:#0066cc" >' + temp + '</a>';
                        } else {
                            return parseFloat(temp).toFixed(2);
                        }
                    } else {
                        return parseFloat(value).toFixed(2);
                    }
                }
            },
            { title: 'InID', field: 'InID', hidden: true },
            { title: 'WID', field: 'WID', hidden: true },
            { title: 'SubWID', field: 'SubWID', hidden: true }
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
            $("#S2").combobox({
                data: data,             //数据源
                valueField: "WID",       //id列
                textField: "WName"      //value列
            });
            $("#S2").combobox('select', data[0].WID);
        }, error: function (e) {

        }
    });
}

function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    $('#grid').datagrid({
        url: '../StoreReport/GetProductStockBatchNOList',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'post',                    //提交方式
        fit: false,                         //分页在最下面
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
            S2: $("#S2").combobox('getValue'),
            S3: $("#S3").val(),
            S4: $("#S4").val(),
            S5: $("#S5").val(),
            S6: $("#S6").combobox('getValue'),
            S7: $("#S7").val(),
            S8: $("#S8").val(),
            S9: $("#S9").val(),
            S10: $("#S10").combobox('getValue'),
            nKind: 2
        }
    });
}

function resetSearch() {
    $("#S1").val('');
    $("#S2").combobox('setValue', '');
    $("#S3").val('');
    $("#S4").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S5").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#S6").combobox('setValue', '');
    $("#S7").val('');
    $("#S8").val('');
    $("#S9").val('');
}

function eventBind() {

}

function exportoutToPage() {
    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    //var text = exportExcel();
    //if (text) {
    //    var bb = self.Blob;
    //    saveAs(
    //        new bb(
    //            ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
    //            , { type: "html/plain;charset=utf8" }
    //        ), "商品库存批次报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    $.ajax({
        url: '../StoreReport/GetProductStockBatchNOList',
        data: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").combobox('getValue'),
            S3: $("#S3").val(),
            S4: $("#S4").val(),
            S5: $("#S5").val(),
            S6: $("#S6").combobox('getValue'),
            S7: $("#S7").val(),
            S8: $("#S8").val(),
            S9: $("#S9").val(),
            S10: $("#S10").combobox('getValue'),
            nKind: 2,
            page: 1,
            rows: 1000000
        },
        type: 'post',
        dataType: "json",
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
    trtdCode += "<td style='height:24px'>批次号</td>";
    trtdCode += "<td>单号</td>";
    trtdCode += "<td>单据类型</td>";
    trtdCode += "<td>过账时间</td>";
    trtdCode += "<td>公司机构</td>";
    trtdCode += "<td>供应商编码</td>";
    trtdCode += "<td>供应商名称</td>";
    trtdCode += "<td>商品编码</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>库存单位</td>";
    trtdCode += "<td>当前库存数量</td>";
    trtdCode += "<td>库存金额</td>";
    trtdCode += "<td>入库数量</td>";
    trtdCode += "<td>已出库数量</td>";
    trtdCode += "</tr>";

    function getExcelTR(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        trHtml += "<td style='height:20px' x:str=\"'" + trData.BatchNO + "\">" + frxs.replaceCode(trData.BatchNO) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.BatchNO == "合计" ? "" : trData.BillID) + "\">" + (trData.BatchNO == "合计列" ? "" : trData.BillID) + "</td>";

        var billType = '';
        switch (trData.BillType) {
            case 0:
                billType = '代购入库单';
                break;
            case 1:
                billType = '门店退货单';
                break;
            case 2:
                billType = '盘盈单';
                break;
        }
        trHtml += "<td>" + billType + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.StockTime) + "</td>";
        var gsjg = "";
        if (trData.WName) {
            gsjg = trData.WName + '-' + trData.SubWName;
        }
        trHtml += "<td x:str=\"'" + gsjg + "\">" + gsjg + "</td>";
        trHtml += "<td x:str=\"'" + (trData.BatchNO == "合计" ? "" : trData.VendorCode) + "\">" + (trData.BatchNO == "合计" ? "" : trData.VendorCode) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.BatchNO == "合计" ? "" : trData.VendorName) + "\">" + (trData.BatchNO == "合计" ? "" : trData.VendorName) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.BatchNO == "合计" ? "" : trData.SKU) + "\">" + (trData.BatchNO == "合计" ? "" : frxs.replaceCode(trData.SKU)) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.BatchNO == "合计" ? "" : frxs.replaceCode(trData.ProductName)) + "\">" + (trData.BatchNO == "合计" ? "" : frxs.replaceCode(trData.ProductName)) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.BatchNO == "合计" ? "" : trData.Unit) + "\">" + (trData.BatchNO == "合计" ? "" : trData.Unit) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.StockQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SalePrice + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.Qty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.TotalOutQty + "</td>";
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
        var bb = self.Blob;
        saveAs(
            new bb(
                ["\ufeff" + dataCode] //\ufeff防止utf8 bom防止中文乱码
                , { type: "html/plain;charset=utf8" }
            ), "商品库存批次报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}

function selVendor() {
    var vendorCode = $("#S8").val();
    var vendorName = $("#S9").val();
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
    $("#S8").val(vendorCode);
    $("#S9").val(vendorName);
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