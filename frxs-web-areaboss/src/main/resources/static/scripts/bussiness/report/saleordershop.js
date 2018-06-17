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


    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
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
        showFooter: true,
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        onLoadSuccess: function () {
            $('#grid').datagrid('clearSelections');
            var rows = $("#grid").datagrid("getRows");
            for (var i = 0; i < rows.length; i++) {
                var tooltipid = '#tooltip_' + i;
                if (rows[i].ShopCode) {
                    $(tooltipid).tooltip({
                        content: $('<div style=max-height:200px;overflow:auto></div>'),
                        showEvent: 'click',
                        onUpdate: function (content) {
                            var index = $(this).attr("id").substr(8);
                            var row = $('#grid').datagrid('getData').rows[index];
                            debugger;
                            content.panel({
                                width: 180,
                                loadingMessage: '',
                                border: false,
                                href: "#",
                                loader: function (param, success, error) {
                                    $.ajax({
                                        url: "../SalesReport/GetOrderInfoAction",
                                        data: {
                                            SarteTime: $("#S1").val(),
                                            EndTime: $("#S2").val(),
                                            //LineName: row.LineName.substr(row.LineName.indexOf("-") + 1),
                                            ShopCode: row.ShopCode,
                                            Sett_Date: row.Sett_Date,
                                            SubWID: $("#SubWID").combobox('getValue')
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            debugger;
                                            if (data != "") {
                                                data = $.parseJSON(data);
                                            }

                                            if (data.length > 0) {

                                                var result = "<table >"
                                                result = result + "<th style='width:100px;'>单据类型</th><th>单据编号</th>";
                                                for (var i = 0; i < data.length; i++) {
                                                    var temp = "<tr>";
                                                    var typeStr = "";
                                                    var type = "";
                                                    switch (data[i].typeName) {
                                                        case "saleorder":
                                                            typeStr = "门店订单";
                                                            break;
                                                        case "saleback":
                                                            typeStr = "门店退货单";
                                                            break;
                                                    }
                                                    temp = temp + "<td>" + typeStr + "</td>";
                                                    temp = temp + "<td>" + '<a href="#" onclick="jumpDetails(\'' + data[i].typeName + '\',\'' + data[i].orderid + '\')" style="cursor:pointer;color:#0066cc " >' + data[i].orderid + '</a>' + "</td>";
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
                    });
                }
            }
        },
        frozenColumns: [[
            {
                title: '单据', field: 'AppID', width: 70, align: 'center', formatter: function (value, row, index) {
                    if (row.ShopName != "合计") {
                        return '<a id="tooltip_' + index + '" href="#"  style="cursor:pointer;color:#0066cc" >链接单据</a>';
                    }
                }
            },
            { title: '门店编号', field: 'ShopCode', width: 80, align: 'center' }
        ]],
        columns: [[

            { title: '门店名称', field: 'ShopName', width: 160 },
            {
                title: '片区', field: 'DictLabel', width: 100
            },
            {
                title: '过账日', align: 'center', field: 'Sett_Date', width: 80, formatter: function (value) { return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd") : ""; }
            },
            {
                title: '配送数量', field: 'SaleQty', width: 60, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '配送成本金额', field: 'SaleAmount', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送平台费用', field: 'SalePoint', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
             {
                 title: '配送金额', field: 'SaleAmount1', width: 80, align: 'right', formatter: function (value, rec) {
                     return parseFloat(rec.SaleAmount).toFixed(4);
                 }
             },
             {
                 title: '合计配送金额', field: 'SaleTotalAmount', width: 100, align: 'right', formatter: function (value) {
                     value = value ? value : 0;
                     return parseFloat(value).toFixed(4);
                 }
             },
             {
                 title: '门店积分', field: '门店积分', width: 70, align: 'right', formatter: function (value) {
                     value = value ? value : 0;
                     return parseFloat(value).toFixed(2);
                 }
             },
            {
                title: '退货数量', field: 'BackQty', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(2);
                }
            },
            {
                title: '退货成本金额', field: 'BackAmount', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '退货平台费用', field: 'BackPoint', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '退货金额', field: 'BackAmount1', width: 80, align: 'right', formatter: function (value, rec) {
                    return parseFloat(rec.BackAmount).toFixed(4);
                }
            },
             {
                 title: '合计退货金额', field: 'BackTotalAmount', width: 80, align: 'right', formatter: function (value) {
                     value = value ? value : 0;
                     return parseFloat(value).toFixed(4);
                 }
             },
            {
                title: '合计平台费用', field: 'TotalPoint', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '合计成本金额', field: 'TotalAmount', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '净配送额', field: '净销售', width: 80, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            //{
            //    title: '合计配送金额', field: 'TotalAmt', width: 110, align: 'right', formatter: function (value) {
            //        return parseFloat(value).toFixed(4);
            //    }
            //},
            //{
            //    title: '合计配送金额', field: '合计销售', width: 110, align: 'right', formatter: function (value) {
            //        value = value ? value : 0;
            //        return parseFloat(value).toFixed(4);
            //    }
            //},
            //{
            //    title: '合计退货金额', field: '退货合计', width: 110, align: 'right', formatter: function (value) {
            //        value = value ? value : 0;
            //        return parseFloat(value).toFixed(4);
            //    }
            //},

            {
                title: '线路名称', field: 'LineName', width: 100
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

function exportout() {
    location.href = "../SalesReport/ExportExcelSalesReport1?nKind=1&S1=" + $("#S1").val() +
        "&S2=" + $("#S2").val() +
        "&S3=" + $("#S3").val() +
        "&S4=" + $("#S4").val() +
        "&S5=" + $("#S5").val() +
        "&S6=" + $("#S6").combobox('getValue')+
        "&S7=" + $("#S7").combobox('getValue');
}


//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    $('#grid').datagrid({
        url: '../SalesReport/GetGetCustomerSaleReportList',//(1)客户配送情况汇总表
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
            S6: $("#S6").combobox('getValue'),
            S7: $("#S7").combobox('getValue'),
            nKind: 1,
            SubWID: $("#SubWID").combobox('getValue'),
            S10: $("#S10").val(),
            S11: $("#S11").val() ? ($("#S11").val() + " 23:59:59") : ""
        }
    });
}

function resetSearch() {
    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#S3").attr("value", "");

    $("#S4").val('');
    $("#S5").val('');
    $("#S6").combobox('setValue', '');
    $("#S7").combobox('setValue', '');
    $("#SubWID").combobox('setValue', '');

    $("#ShopCode").attr("value", "");
    $("#ShopName").attr("value", "");

    $("#S10").val('');
    $("#S11").val('');

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

    $.ajax({
        url: '../Common/GetWarehouseLineList',
        type: 'get',
        dataType: 'json',
        async: false,
        data: {},
        success: function (data) {
            //在第一个Item加上请选择
            data.unshift({ "LineID": "", "LineName": "-请选择-" });
            //创建控件
            $("#S6").combobox({
                data: data,                       //数据源
                valueField: "LineID",       //id列
                textField: "LineName"       //value列
            });
        }
    });

    $.ajax({
        url: '../Common/GetShopCustomerAreaList?dictType=ShopCustomerArea',
        type: 'get',
        dataType: 'json',
        async: false,
        data: {},
        success: function (data) {
            //在第一个Item加上请选择
            data.unshift({ "DictValue": "", "DictLabel": "-请选择-" });
            //创建控件
            $("#S7").combobox({
                data: data,                       //数据源
                valueField: "DictValue",       //id列
                textField: "DictLabel"       //value列,
                //panelHeight: '400px'
            });
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

function selShop() {
    var shopCode = $("#ShopCode").val();
    var shopName = $("#ShopName").val();
    frxs.dialog({
        title: "选择门店",
        url: "../AccountDetails/SelectShop?shopCode=" + encodeURIComponent(shopCode) + "&shopName=" + encodeURIComponent(shopName),
        owdoc: window.top,
        width: 850,
        height: 500
    });
}

//回填门店
function backFillShop(shopID, shopCode, shopName) {
    $("#S3").val(shopID);
    $("#ShopCode").val(shopCode);
    $("#ShopName").val(shopName);
}


//供门店 回车事件绑定
function eventBind() {
    $("#ShopCode").keydown(function (e) {
        if (e.keyCode == 13) {
            eventShop();
        }
    });

    $("#ShopName").keydown(function (e) {
        if (e.keyCode == 13) {
            eventShop();
        }
    });
}

//门店 回车事件
function eventShop() {
    $.ajax({
        url: "../Common/GetShopInfo",
        type: "post",
        data: {
            shopCode: $("#ShopCode").val(),
            shopName: $("#ShopName").val(),
            page: 1,
            rows: 200
        },
        success: function (obj) {
            var obj = JSON.parse(obj);
            if (obj.total == 1) {
                $("#S3").val(obj.rows[0].ShopID);
                $("#ShopCode").val(obj.rows[0].ShopCode);
                $("#ShopName").val(obj.rows[0].ShopName);
            } else {
                selShop();
            }
        }
    });
}

//导出 新代码
function exportoutToPage() {
    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    //var text = exportExcel();
    //if (text) {
    //    event.preventDefault();
    //    var bb = self.Blob;
    //    saveAs(
    //        new bb(
    //            ["\ufeff" + text] //\ufeff防止utf8 bom防止中文乱码
    //            , { type: "html/plain;charset=utf8" }
    //        ), "客户配送情况汇总查询导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    $.ajax({
        url: '../SalesReport/GetGetCustomerSaleReportList',//(1)客户配送情况汇总表
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S4: $("#S4").val(),
            S5: $("#S5").val(),
            S6: $("#S6").combobox('getValue'),
            S7: $("#S7").combobox('getValue'),
            nKind: 1,
            SubWID: $("#SubWID").combobox('getValue'),
            S10: $("#S10").val(),
            S11: $("#S11").val() ? ($("#S11").val() + " 23:59:59") : "",
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
    var rows = data && data.rows ? data.rows : [];// $("#grid").datagrid("getRows");
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    trtdCode += "<td>片区</td>";
    trtdCode += "<td>过账日</td>";
    trtdCode += "<td>配送数量</td>";
    trtdCode += "<td>配送成本金额</td>";
    trtdCode += "<td>配送平台费用</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>合计配送金额</td>";
    trtdCode += "<td>门店积分</td>";

    trtdCode += "<td>退货数量</td>";
    trtdCode += "<td>退货成本金额</td>";
    trtdCode += "<td>退货平台费用</td>";
    trtdCode += "<td>退货金额</td>";
    trtdCode += "<td>合计退货金额</td>";
    trtdCode += "<td>合计平台费用</td>";
    trtdCode += "<td>合计成本金额</td>";
    //trtdCode += "<td>合计销售</td>";  
    trtdCode += "<td>净配送额</td>";
    trtdCode += "<td>线路名称</td>";

    trtdCode += "</tr>";

    function getExcelTR(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        trHtml += "<td style='height:20px' x:str=\"'" + (trData.ShopName == "合计" ? "" : trData.ShopCode) + "\">" + (trData.ShopName == "合计" ? "" : trData.ShopCode) + "</td>";//门店编号
        trHtml += "<td>" + frxs.replaceCode(trData.ShopName) + "</td>";//门店名称
        trHtml += "<td>" + frxs.replaceCode(trData.DictLabel) + "</td>";
        trHtml += "<td>" + (trData.Sett_Date ? frxs.dateTimeFormat(trData.Sett_Date, "yyyy-MM-dd") : "") + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.SaleQty) ? "0" : trData.SaleQty) + "</td>";                    //配送数量 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.SaleAmount) ? "0" : trData.SaleAmount) + "</td>";            //配送成本金额 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.SalePoint) ? "0" : trData.SalePoint) + "</td>";              //配送平台费用 浏览器中显示0为空，导出时统一为0
        //****trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.SaleTotalAmount) ? "0" : trData.SaleTotalAmount) + "</td>";  //配送金额 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.SaleAmount) ? "0" : trData.SaleAmount) + "</td>";  //配送金额=配送成本金额 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.SaleTotalAmount) ? "0" : trData.SaleTotalAmount) + "</td>";//合计配送金额
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.门店积分) ? "0" : trData.门店积分) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + ((!trData.BackQty) ? "0" : trData.BackQty) + "</td>";                    //退货数量 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.BackAmount) ? "0" : trData.BackAmount) + "</td>";            //退货成本金额 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.BackPoint) ? "0" : trData.BackPoint) + "</td>";              //退货平台费用 浏览器中显示0为空，导出时统一为0
        //***trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.BackTotalAmount) ? "0" : trData.BackTotalAmount) + "</td>";  //退货金额 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.BackAmount) ? "0" : trData.BackAmount) + "</td>";  //退货金额=退货成本金额 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.BackTotalAmount) ? "0" : trData.BackTotalAmount) + "</td>";//合计退货金额
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.TotalPoint) ? "0" : trData.TotalPoint) + "</td>";            //合计平台费用 浏览器中显示0为空，导出时统一为0
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.TotalAmount) ? "0" : trData.TotalAmount) + "</td>";          //合计成本金额 浏览器中显示0为空，导出时统一为0
        //trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.TotalAmt) ? "0" : trData.TotalAmt) + "</td>";                //合计配送金额 浏览器中显示0为空，导出时统一为0
        //trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.合计销售) ? "0" : trData.合计销售) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.净销售) ? "0" : trData.净销售) + "</td>";//净销售
        trHtml += "<td>" + frxs.replaceCode(trData.LineName) + "</td>";                                                                      //线路名称

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
            ), "客户配送情况汇总查询导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}