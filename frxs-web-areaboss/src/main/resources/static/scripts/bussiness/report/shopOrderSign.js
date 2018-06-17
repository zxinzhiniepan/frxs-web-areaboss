/// <reference path="../../../Content/easyui-1.4.3/jquery-1.7.1.js" />
$(function () {
    //grid绑定
    initGrid();

    //grid高度改变
    gridresize();

    $("#S5").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S6").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
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
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        frozenColumns: [[
             { title: '门店编号', field: 'ShopCode', width: 75, align: 'center' }
        ]],
        columns: [[
            { title: '门店名称', field: 'ShopName', width: 155, align: 'left', formatter: frxs.formatText },
            {
                title: '订单号', field: 'OrderId', width: 100, align: 'center',
                formatter: function (value, rec) {
                    if (value) {
                        return '<a href="#"  style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'saleorder\',\'' + value + '\')">' + value + '<a/>';
                    }
                }
            },
            {
                title: '配送额', field: 'TotalProductAmt', width: 130, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '信息平台管理服务费', field: 'TotalAddAmt', width: 135, align: 'right', formatter: function (value, row) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            {
                title: '总金额', field: 'PayAmount', width: 130, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            { title: '订单提交时间', field: 'CreateTime', width: 140, align: 'center' },
            { title: '确认时间', field: 'ConfDate', width: 140, align: 'center' },
            { title: '发货时间', field: 'PackingTime', width: 140, align: 'center' },
            { title: '签收时间', field: 'FinishDate', width: 140, align: 'center' }
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

//导出
function exportout() {
    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    event.preventDefault();

    $.ajax({
        url: '../StoreReport/GetShopOrderSignList',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S4: $("#S4").val(),
            S5: $("#S5").val(),
            S6: $("#S6").val(),
            S7: $("#S7").val(),
            S8: $("#S8").val(),
            nKind: 2,
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
    //exportExcel();
    //loading.close();
}

function exportExcel(data) {
    var rows = data && data.rows ? data.rows : null;
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    trtdCode += "<td>订单号</td>";
    trtdCode += "<td>配送额</td>";
    trtdCode += "<td>信息平台管理服务费</td>";
    trtdCode += "<td>总金额</td>";
    trtdCode += "<td>订单提交时间</td>";
    trtdCode += "<td>确认时间</td>";
    trtdCode += "<td>发货时间</td>";
    trtdCode += "<td>签收时间</td>";
    trtdCode += "</tr>";

    function getExcelTR(trData) {
        var trHtml = "";
        trHtml += "<tr>";
        trHtml += "<td style='height:20px' x:str=\"'" + trData.ShopCode + "\">" + trData.ShopCode + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ShopName) + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + (trData.OrderId == undefined ? "" : trData.OrderId) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.TotalProductAmt + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.TotalAddAmt + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.PayAmount + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.CreateTime) + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.ConfDate) + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.PackingTime) + "</td>";
        trHtml += "<td style=\"mso-number-format:'\@';\">" + frxs.replaceCode(trData.FinishDate) + "</td>";
        trHtml += "</tr>";

        return trHtml;
    }

    for (var i = 0; i < rows.length; i++) {
        trtdCode += getExcelTR(rows[i]);
    }

    for (var f = 0; f < data.footer.length; f++) {
        trtdCode += getExcelTR(data.footer[f]);
    }

    var dataCode = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>';
    dataCode = dataCode.replace("{table}", trtdCode);
    //return dataCode;

    var bb = self.Blob;
    saveAs(
        new bb(
            ["\ufeff" + dataCode] //\ufeff防止utf8 bom防止中文乱码
            , { type: "html/plain;charset=utf8" }
        ), "门店订单签收统计报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    );
}

//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }

    $('#grid').datagrid({
        url: '../StoreReport/GetShopOrderSignList',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        fit: false,                         //分页在最下面
        pagination: true,                   //是否显示分页
        rownumbers: true,                   //显示行编号
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
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            S4: $("#S4").val(),
            S5: $("#S5").val(),
            S6: $("#S6").val(),
            S7: $("#S7").val(),
            S8: $("#S8").val(),
            nKind: 2
        }
    });
}

function resetSearch() {
    //$("#myForm").form("clear");
    $("#S1").val("");
    $("#S2").val("");
    $("#S5").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S6").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#S3").val("");
    $("#S4").val("");
    $("#S7").val("");
    $("#S8").val("");
}


//窗口大小改变
$(window).resize(function () {
    gridresize();
});


//grid高度改变
function gridresize() {
    var h = ($(window).height() - $("fieldset").height() - 28);
    $('#grid').datagrid('resize', {
        width: $(window).width() - 10,
        height: h
    });
}