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
    //默认查询当天数据
    $("#PostingTime1").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#PostingTime2").val(frxs.nowDateTime("yyyy-MM-dd"));
});



function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,
        pagination: true,                   //是否显示分页
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        showFooter: true,
        frozenColumns: [[
          
        ]],
        columns: [[
            //{ title: '过账日期', field: 'PackingTime', width: 100, align: 'center', formatter: frxs.formatText },
            { title: '门店编号', field: 'ShopCode', width: 100, align: 'center', formatter: frxs.formatText },
            { title: '门店名称', field: 'ShopName', width: 200, align: 'left', formatter: frxs.formatText },
            //{ title: '商品名称', field: 'ProductName', width: 250, align: 'left', formatter: frxs.formatText },
            //{ title: '商品编码', field: 'SKU', width: 100, align: 'center', formatter: frxs.formatText },
            //{ title: '条码', field: 'BarCode', width: 150, align: 'center', formatter: frxs.formatText },
            {
                title: '配送数量', field: 'UnitQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == ""||value==undefined) ? "0.00" : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '配送金额', field: 'SubAmt', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '退货数量', field: 'BackUnitQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == undefined) ? "0.00" : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '退货金额', field: 'BackSubAmt', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '配送净数量', field: 'NetQty', width: 100, align: 'right', formatter: function (value) {
                    return (value == "" || value == undefined) ? "0.00" : parseFloat(value).toFixed(2);
                }
            },
            {
                title: '配送净额', field: 'NetAmt', width: 100, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '应收信息平台管理服务费', field: 'SubAddAmt', width: 150, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '应退信息平台管理服务费', field: 'BackSubAddAmt', width: 150, align: 'right', formatter: function (value) {
                    return value == "" ? "0.0000" : parseFloat(value).toFixed(4);
                }
            },
            {
                title: '信息平台管理服务费净额', field: 'NetSubAddAmt', width: 150, align: 'right', formatter: function (value) {
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
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    $('#grid').datagrid({
        url: '../StoreReport/GetStoreDistributionReport',
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
            PostingTime1: $("#PostingTime1").val() ,
            PostingTime2: $("#PostingTime2").val() ,
            CreateTime1: $("#CreateTime1").val() ,
            CreateTime2: $("#CreateTime2").val(),
            ShopID: $.trim($("#ShopID").val()),
            ShopName: $.trim($("#ShopName").val()),
            SubWID: $("#SubWID").combobox('getValue'),
            CreateUserName: $.trim($("#CreateUserName").val()),
            SKU: $.trim($("#SKU").val()),
            ProductName: $.trim($("#ProductName").val()),
            BarCode: $.trim($("#BarCode").val()),
            BrandName: $.trim($("#BrandName").val()),
            CategoryId1: $.trim($('#CategoriesId1').combobox('getValue')),
            CategoryId2: $.trim($('#CategoriesId2').combobox('getValue')),
            CategoryId3: $.trim($('#CategoriesId3').combobox('getValue')),

            Sett_Date1: $("#Sett_Date1").val(),
            Sett_Date2: $("#Sett_Date2").val(),
        }
    });
}

function resetSearch() {
    //$('#PostingTime1').val('');
    //$('#PostingTime2').val('');
    //默认查询当天数据
    $("#PostingTime1").val(frxs.nowDateTime("yyyy-MM-dd"));
    $("#PostingTime2").val(frxs.nowDateTime("yyyy-MM-dd"));

    $('#CreateTime1').val('');
    $('#CreateTime2').val('');
    $('#ShopName').val('');
    $('#ShopCode').val('');
    $('#ShopID').val('');
    $("#SubWID").combobox('setValue', '');
    $('#CreateUserName').val('');
    $('#SKU').val('');
    $('#ProductName').val('');
    $('#BarCode').val('');
    $('#BrandName').val('');
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');

    $('#Sett_Date1').val('');
    $('#Sett_Date2').val('');
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
    //        ), "门店配送汇总导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
    //    );
    //}
    //loading.close();

    $.ajax({
        type: "post",
        dataType: "json",
        url: '../StoreReport/GetStoreDistributionReport',
        data: {
            //查询条件
            PostingTime1: $("#PostingTime1").val() ,
            PostingTime2: $("#PostingTime2").val() ,
            CreateTime1: $("#CreateTime1").val() ,
            CreateTime2: $("#CreateTime2").val(),
            ShopID: $.trim($("#ShopID").val()),
            ShopName: $.trim($("#ShopName").val()),
            SubWID: $("#SubWID").combobox('getValue'),
            CreateUserName: $.trim($("#CreateUserName").val()),
            SKU: $.trim($("#SKU").val()),
            ProductName: $.trim($("#ProductName").val()),
            BarCode: $.trim($("#BarCode").val()),
            BrandName: $.trim($("#BrandName").val()),
            CategoryId1: $.trim($('#CategoriesId1').combobox('getValue')),
            CategoryId2: $.trim($('#CategoriesId2').combobox('getValue')),
            CategoryId3: $.trim($('#CategoriesId3').combobox('getValue')),
            Sett_Date1: $("#Sett_Date1").val(),
            Sett_Date2: $("#Sett_Date2").val(),
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
    //trtdCode += "<td style='height:24px'>过账日期</td>";
    trtdCode += "<td>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    //trtdCode += "<td>商品名称</td>";
    //trtdCode += "<td>商品编码</td>";
    //trtdCode += "<td>条码</td>";
    trtdCode += "<td>配送数量</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>退货数量</td>";
    trtdCode += "<td>退货金额</td>";
    trtdCode += "<td>配送净数量</td>";
    trtdCode += "<td>配送净额</td>";
    trtdCode += "<td>应收信息平台管理服务费</td>";
    trtdCode += "<td>应退信息平台管理服务费</td>";
    trtdCode += "<td>信息平台管理服务费净额</td>";
    trtdCode += "</tr>";

    function getExcelTR(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        //trHtml += "<td style='height:20px'>" + frxs.replaceCode(trData.PackingTime) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.ShopName == "合计" ? "" : trData.ShopCode) + "\">" + (trData.ShopName == "合计" ? "" : trData.ShopCode) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ShopName) + "</td>";
        //trHtml += "<td>" + frxs.replaceCode(trData.ProductName) + "</td>";
        //trHtml += "<td x:str=\"'" + trData.SKU + "\">" + trData.SKU + "</td>";
        //trHtml += "<td x:str=\"'" + trData.BarCode + "\">" + trData.BarCode + "</td>";
        //避免导出空行为0
        trHtml += trData.UnitQty == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + trData.UnitQty + "</td>");
        trHtml += trData.SubAmt == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SubAmt + "</td>");
        trHtml += trData.BackUnitQty == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + trData.BackUnitQty + "</td>");
        trHtml += trData.BackSubAmt == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.BackSubAmt + "</td>");
        trHtml += trData.NetQty == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.00\";'>" + trData.NetQty + "</td>");
        trHtml += trData.NetAmt == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.NetAmt + "</td>");
        trHtml += trData.SubAddAmt == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SubAddAmt + "</td>");
        trHtml += trData.SubAddAmt == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.BackSubAddAmt + "</td>");
        trHtml += trData.NetSubAddAmt == "合计" ? "<td></td>" : ("<td style='mso-number-format:\"#,##0.0000\";'>" + trData.NetSubAddAmt + "</td>");

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
            ), "门店配送汇总导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
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

//选择门店
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
    $("#ShopID").val(shopID);
    $("#ShopCode").val(shopCode);
    $("#ShopName").val(shopName);
}