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

    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#S5").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S6").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
});



function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,                   //显示行编号
        pagination: true,                   //是否显示分页
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        frozenColumns: [[
              {
                  title: '单号', field: 'BillId', width: 100, align: 'center',
                  formatter: function (value, rec) {
                      if (value) {
                          return '<a href="#" style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'' + rec.OrderType + '\',\'' + value + '\')">' + value + '</a>';
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
            { title: '过账时间', field: 'BillDate', width: 130, align: 'center' },
            { title: '供应商', field: 'VedorName', width: 220, align: 'left' },
            { title: '供应商账期', field: 'PaymentDateTypeName', width: 70, align: 'center' },
            {
                title: '配送金额', field: 'TotalAmt', width: 90, align: 'right', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            },
            { title: '操作员', field: 'PostingUserName', width: 60, align: 'center' },
            { title: '代购员', field: 'EmpName', width: 60, align: 'center' },
            {
                title: '含税金额', field: 'FaxAmt', width: 100, align: 'right', formatter: function (value, rec) {
                    return parseFloat(value).toFixed(4);
                }
            },
            { title: '备注', field: 'remark', width: 180, align: 'left' }

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
    location.href = "../PurchaseReport/ExportExcelPurchaseReport2?nKind=2&S1=" + $("#S1").val() +
        "&S2=" + $("#S2").val() +
        "&S3=" + $("#S3").val() +
        "&S5=" + $("#S5").val() +
        "&S6=" + $("#S6").val() +
        "&SubWID=" + $("#SubWID").combobox('getValue');
}


//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }

    $('#grid').datagrid({
        url: '../PurchaseReport/GetBuyBackProductList',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        fit: false,                         //分页在最下面
        pagination: true,                   //是否显示分页
        fitColumns: false,                   //列均匀分配
        striped: false,                     //奇偶行是否区分
        showFooter: true,
        //设置点击行为单选，点击行中的复选框为多选
        checkOnSelect: true,
        selectOnCheck: true,
        onClickRow: function (rowIndex) {
            $('#grid').datagrid('clearSelections');
            $('#grid').datagrid('selectRow', rowIndex);
        },
        queryParams: {
            //查询条件
            nKind: 2,
            SubWID: $("#SubWID").combobox('getValue'),
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S5: $("#S5").val(),
            S6: $("#S6").val(),
            S7: $("#EmpId").val(),
            S9: $("#S9").val(),
            S10: $("#S10").val() ? ($("#S10").val() + " 23:59:59") : ""
            //S8:$("#S8").val()
        }
    });
}

function resetSearch() {
    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#S5").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S6").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");

    $("#S3").attr("value", "");

    $("#VendorCode").attr("value", "");
    $("#VendorName").attr("value", "");
    $("#BuyEmpName").attr("value", "");
    $("#SubWID").combobox('setValue', '');

    //$("#S8").val("");
    $("#EmpName").val("");
    $("#EmpId").val("");

    $("#S9").val("");
    $("#S10").val("");
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
    $("#S3").val(vendorId);
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
    $("#EmpId").val(empID);
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
                $("#EmpId").val(obj.rows[0].EmpID);
                $("#EmpName").val(obj.rows[0].EmpName);
            } else {
                selBuyEmp();
            }
        }
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
    //        ), "代购入库代购退货汇总查询导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();


    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    event.preventDefault();

    $.ajax({
        url: '../PurchaseReport/GetBuyBackProductList',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            nKind: 2,
            SubWID: $("#SubWID").combobox('getValue'),
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S5: $("#S5").val(),
            S6: $("#S6").val(),
            S7: $("#EmpId").val(),
            S9: $("#S9").val(),
            S10: $("#S10").val() ? ($("#S10").val() + " 23:59:59") : "",
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

//客户端导出Excel
function exportExcel(data) {
    var rows = data && data.rows ? data.rows : [];// $("#grid").datagrid("getRows");
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>单号</td>";
    trtdCode += "<td>过账日</td>";
    trtdCode += "<td>过账时间</td>";
    trtdCode += "<td>供应商</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>操作员</td>";
    trtdCode += "<td>代购员</td>";
    trtdCode += "<td>备注</td>";
    trtdCode += "<td>含税金额</td>";
    trtdCode += "<td>供应商账期</td>";
    trtdCode += "</tr>";

    function getExcelTR(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        trHtml += "<td style='height:20px' x:str=\"'" + trData.BillId + "\">" + trData.BillId + "</td>";
        trHtml += "<td>" + (trData.Sett_Date ? frxs.dateTimeFormat(trData.Sett_Date, "yyyy-MM-dd") : "") + "</td>";

        //避免导出空行为0
        trHtml += "<td>" + (trData.VedorName == "合计" ? "" : trData.BillDate) + "</td>";

        trHtml += "<td>" + frxs.replaceCode(trData.VedorName) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.TotalAmt) ? "0" : trData.TotalAmt) + "</td>";
        trHtml += "<td>" + trData.PostingUserName + "</td>";
        trHtml += "<td>" + trData.EmpName + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.remark ? trData.remark : "") + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.FaxAmt) ? "0" : trData.FaxAmt) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.PaymentDateTypeName) + "</td>";

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
            ), "代购入库代购退货汇总查询导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}