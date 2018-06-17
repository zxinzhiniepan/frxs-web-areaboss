$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();
    //货区
    initShelfArea();

    //供应商-代购员事件绑定
    eventBind();

    //grid高度改变
    gridresize();
    //select下拉框自适应高度    
    $('.easyui-combobox').combobox({
        panelHeight: 'auto'
    });

    $("#PostingTime1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#PostingTime2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
});



function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,
        pagination: true,                   //是否显示分页
        width: 1000,
        //fitColumns: true,
        pageSize: 30,
        pageList: [30, 50, 100, 300],
        showFooter: true,
        frozenColumns: [[

        ]],
        columns: [[
            //{
            //    title: '订单编号', field: 'OrderID', width: 100, align: 'center',
            //    formatter: function (value, rec) {
            //        if (value) {
            //            return '<a href="#"  style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'saleorder\',\'' + value + '\')">' + value + '</a>';
            //        }
            //    }
            //},
            { title: '公司机构', field: 'SubWName', width: 360, align: 'center', formatter: frxs.formatText },
            //{ title: '门店编号', field: 'ShopCode', width: 100, align: 'left', formatter: frxs.formatText },
            //{ title: '门店名称', field: 'ShopName', width: 200, align: 'left', formatter: frxs.formatText },
            //{ title: '确认时间', field: 'ConfDate', width: 150, align: 'center', formatter: frxs.formatText },
            //{ title: '过账日期', field: 'PackingTime', width: 150, align: 'center', formatter: frxs.formatText },
            //{ title: '过账日', field: 'SettleDate', width: 100, align: 'center', formatter: frxs.formatText },
            { title: '货区', field: 'ShelfAreaName', width: 200, align: 'center', formatter: frxs.formatText },
            { title: '拣货员', field: 'PickUserName', width: 200, align: 'center', formatter: frxs.formatText },
            {
                title: '含税金额', field: 'pickAmt', width: 200, align: 'right', formatter: function (value) {
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
            }],
        view: detailview,
        detailFormatter: function (index, row) {
            return '<div class="xs-list-subgrid"><div class="xs-list-subgrid-topDetail"></div><div class="xs-list-subgrid-list"><table class="ddv"></table></div></div>';
        },
        onExpandRow: function (index, row) {
            expandRow(this, index, row);
        }
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

function initShelfArea() {
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


function search() {
    $('#grid').datagrid({
        url: '../SalesReport/GetSaleOrderPickCollectingReport',
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
        queryParams: {
            //查询条件
            PostingTime1: $("#PostingTime1").val(),
            PostingTime2: $("#PostingTime2").val(),
            SettleDate1: $("#SettleDate1").val(),
            SettleDate2: $("#SettleDate2").val(),
            ShopCode: $("#ShopCode").val(),
            ShopName: $("#ShopName").val(),
            SubWID: $("#SubWID").combobox('getValue'),
            PickUserName: $("#PickUserName").val(),
            OrderID: $("#OrderID").val(),
            ShelfAreaID: $("#ShelfAreaID").combobox('getValue')
        }
    });
}

function resetSearch() {
    $("#PostingTime1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#PostingTime2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $('#SettleDate1').val('');
    $('#SettleDate2').val('');
    $('#ShopCode').val('');
    $('#ShopName').val('');
    $("#SubWID").combobox('setValue', '');
    $('#PickUserName').val('');
    $('#OrderID').val('');
    $("#ShelfAreaID").combobox('setValue', '');
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
    //        ), "拣货员拣货金额查询报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();
    $.ajax({
        type: "post",
        dataType: "json",
        url: '../SalesReport/GetSaleOrderDetailsPickReport',
        data: {
            //查询条件
            PostingTime1: $("#PostingTime1").val(),
            PostingTime2: $("#PostingTime2").val(),
            SettleDate1: $("#SettleDate1").val(),
            SettleDate2: $("#SettleDate2").val(),
            ShopCode: $("#ShopCode").val(),
            ShopName: $("#ShopName").val(),
            SubWID: $("#SubWID").combobox('getValue'),
            PickUserName: $("#PickUserName").val(),
            OrderID: $("#OrderID").val()
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
    trtdCode += "<td style='height:24px'>订单编号</td>";
    trtdCode += "<td>公司机构</td>";
    trtdCode += "<td>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    trtdCode += "<td>确认时间</td>";
    trtdCode += "<td>过账日期</td>";
    trtdCode += "<td>过账日</td>";
    trtdCode += "<td>拣货员</td>";
    trtdCode += "<td>含税金额（商品金额）</td>";
    trtdCode += "</tr>";

    function getExcelTR(trData) {
        var trHtml = "";

        trHtml += "<tr>";
        trHtml += "<td style='height:20px' style='height:20px' x:str=\"'" + trData.OrderID + "\">" + frxs.replaceCode(trData.OrderID) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.SubWName) + "</td>";
        trHtml += "<td x:str=\"'" + trData.ShopCode + "\">" + frxs.replaceCode(trData.ShopCode) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ShopName) + "</td>";
        trHtml += "<td>" + trData.ConfDate + "</td>";
        trHtml += "<td>" + trData.PackingTime + "</td>";
        var settleDate = (trData.SettleDate != null) ? trData.SettleDate : "";
        trHtml += "<td>" + settleDate + "</td>";
        trHtml += "<td>" + trData.PickUserName + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.pickAmt) ? "0" : trData.pickAmt) + "</td>";//含税金额
        //避免导出空行为0

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
            ), "拣货员拣货金额查询报表_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
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

///
function expandRow(obj, index, row) {

    ////绑定促销列表
    //this.bindSubgridList(obj, index, row);
    var ddv = $(obj).datagrid('getRowDetail', index).find('table.ddv');

    ddv.datagrid({
        title: "拣货员拣货金额明细表",
        url: "../SalesReport/GetSaleOrderPickDetailsReport",
        queryParams: {
            PostingTime1: $("#PostingTime1").val(),
            PostingTime2: $("#PostingTime2").val(),
            SettleDate1: $("#SettleDate1").val(),
            SettleDate2: $("#SettleDate2").val(),
            ShopCode: $("#ShopCode").val(),
            ShopName: $("#ShopName").val(),
            OrderID: $("#OrderID").val(),
            SubWID: row.SubWID,
            PickUserId: row.PickUserID,
            PickUserName: row.PickUserName,
            ShelfAreaID: row.ShelfAreaID
        },
        height: 270,
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        rownumbers: true,                   //显示行编号
        pagination: true,                   //是否显示分页
        showFooter: true,
        pageSize: 30,
        pageList: [10, 30, 50, 100, 300],
        fit: false,                         //分页在最下面
        fitColumns: false,                   //列均匀分配
        striped: false,                     //奇偶行是否区分
        //设置点击行为单选，点击行中的复选框为多选
        checkOnSelect: true,
        selectOnCheck: true,
        columns: [[
            {
                title: '订单编号', field: 'OrderID', width: 100, align: 'center',
                formatter: function (value, rec) {
                    if (value) {
                        return '<a href="#"  style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'saleorder\',\'' + value + '\')">' + value + '<a/>';
                    }
                }
            },
            //{ title: '公司机构', field: 'SubWName', width: 100, align: 'center', formatter: frxs.formatText },
            { title: '门店编号', field: 'ShopCode', width: 100, align: 'left', formatter: frxs.formatText },
            { title: '门店名称', field: 'ShopName', width: 200, align: 'left', formatter: frxs.formatText },
            { title: '确认时间', field: 'ConfDate', width: 150, align: 'center', formatter: frxs.formatText },
            { title: '过账日期', field: 'PackingTime', width: 150, align: 'center', formatter: frxs.formatText },
            { title: '过账日', field: 'SettleDate', width: 100, align: 'center', formatter: frxs.formatText },
            //{ title: '拣货员', field: 'PickUserName', width: 80, align: 'center', formatter: frxs.formatText },
            {
                title: '含税金额', field: 'pickAmt', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            }
        ]]
    });


    //var topDetail = $(obj).datagrid('getRowDetail', index).find("div.xs-list-subgrid-topDetail");
    //topDetail.html(row.PickUserName);


    //设置当前行行高
    $('#grid').datagrid('fixDetailRowHeight', index);
}