$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();

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

        ]],
        columns: [[


        { title: '仓库', field: 'WName', width: 150, align: 'center', formatter: frxs.formatText },
        {
            title: '单据编号', field: 'BackID', width: 120, align: 'center', formatter: function (value, rec) {
                if (value) {
                    var type = "";
                    switch (rec.OrderType) {
                        case '代购入库单':
                            type = 'buyorder';
                            break;
                        case '门店退货单':
                            type = 'saleback';
                            break;
                        case '盘盈单':
                            type = 'winorder';
                            break;
                        case '盘亏单':
                            type = 'loseorder';
                            break;
                        case '代购退货单':
                            type = 'buyback';
                            break;
                        case '门店订单':
                            type = 'saleorder';
                            break;
                        case '报损单':
                            type = 'lossorder';
                            break;
                    }
                    return '<a href="#"  style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'' + type + '\',\'' + value + '\')">' + value + '</a>';
                }
            }
        },
        { title: '录单时间', field: 'CreateTime', width: 150, align: 'center', formatter: frxs.dateFormat },
        { title: '单据类型', field: 'OrderType', width: 100, align: 'center', formatter: frxs.formatText },
        {
            title: '金额', field: 'TotalAmt', width: 100, align: 'right', formatter: function (value) {
                value = ((value == "" || !value) ? "0" : value);
                return parseFloat(value).toFixed(4);
            }
        },
        { title: '录单人员', field: 'CreateUserName', width: 100, align: 'center', formatter: frxs.formatText },
        { title: '单据状态', field: 'StatusStr', width: 100, align: 'center', formatter: frxs.formatText },
        { title: '备注', field: 'Remark', width: 260, align: 'center', formatter: frxs.formatText }
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
        url: '../StoreReport/GetOrderNoPostReport',
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
            nKind: 1,
            SubWID: $("#SubWID").combobox('getValue'),           
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $('#S3').combobox('getValue')
           
        }
    });
}

function resetSearch() {
    $('#S1').val('');
    $('#S2').val('');   
    //$("#SubWID").combobox('setValue', '');    
    $('#S3').combobox('setValue', '');
    initDDL();
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
    //        ), "未过帐单据导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    $.ajax({
        url: '../StoreReport/GetOrderNoPostReport',
        type: "post",
        dataType: "json",
        data: {
            //查询条件 
            nKind: 1,
            SubWID: $("#SubWID").combobox('getValue'),
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $('#S3').combobox('getValue'),
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
    trtdCode += "<td style='height:20px'>仓库</td>";
    trtdCode += "<td>单据编号</td>";
    trtdCode += "<td>录单时间</td>";
    trtdCode += "<td>单据类型</td>";
    trtdCode += "<td>金额</td>";
    trtdCode += "<td>录单人员</td>";
    trtdCode += "<td>单据状态</td>";
    trtdCode += "<td>备注</td>";
   
    trtdCode += "</tr>";

    function getExcelTR(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        trHtml += "<td style='height:20px'>" + frxs.replaceCode(trData.WName) + "</td>";
        trHtml += "<td style='height:20px' x:str=\"'" + trData.BackID + "\">" + trData.BackID + "</td>";
        trHtml += "<td>" + trData.CreateTime + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.OrderType) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + ((!trData.TotalAmt) ? "0" : trData.TotalAmt) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.CreateUserName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.StatusStr) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.Remark) + "</td>";
        trHtml += "</tr>";

        return trHtml;
    }

    for (var i = 0; i < rows.length; i++) {
        trtdCode += getExcelTR(rows[i]);
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
            ), "未过帐单据导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
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