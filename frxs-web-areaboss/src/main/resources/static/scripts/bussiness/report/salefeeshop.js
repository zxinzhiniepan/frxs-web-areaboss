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
        pagination: true,                   //是否显示分页
        pageSize: 30,
        pageList: [30, 50, 100, 300],
        showFooter: true,
        frozenColumns: [[
             {
                 title: '单号', field: 'BillId', width: 110, align: 'center',
                 formatter: function (value, rec) {
                     if (value) {
                         return '<a href="#" style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'shopfee\',\'' + value + '\')">' + value + '</a>';
                     }
                 }
             }
        ]],
        columns: [[
           
            { title: '公司机构', field: 'WName', width: 100, align: 'left' },
            {
                title: '过账日', field: 'Sett_Date', width: 80, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd") : "";
                }
            },
            { title: '开单日期', field: 'FeeDate', width: 100, align: 'center' },
            { title: '门店编号', field: 'ShopCode', width: 80, align: 'center' },
            { title: '门店名称', field: 'ShopName', width: 180, align: 'left', formatter: frxs.formatText },
            { title: '项目名称', field: 'FeeName', width: 60, align: 'center', formatter: frxs.formatText },
            {
                title: '金额', field: 'FeeAmt', width: 80, align: 'right', formatter: function (value) {
                    value = (!value) ? 0 : value;
                    return parseFloat(value).toFixed(4);
                }
            },
            { title: '录单人员', field: 'CreateUserName', width: 60, align: 'center', formatter: frxs.formatText },
            { title: '确认人员', field: 'ConfUserName', width: 60, align: 'center', formatter: frxs.formatText },
            { title: '过帐时间', field: 'PostingTime', width: 120, align: 'center' },
            { title: '过帐人员', field: 'ConfUserName', width: 60, align: 'center' },
            
            { title: '备注', field: 'Remark', width: 120, align: 'left',formatter:frxs.formatText }
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

    $.ajax({
        type: "post",
        dataType: "json",
        url: '../SalesReport/GetCustomerExpSumList',
        data: {
            //查询条件
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            nKind: 2,
            //SubWID: $("#SubWID").combobox('getValue'),
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

function exportExcel(data) {
    var rows = data && data.rows ? data.rows : [];// $("#grid").datagrid("getRows");
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }
    
    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>单号</td>";
    trtdCode += "<td>公司机构</td>";
    trtdCode += "<td>过账日</td>";
    trtdCode += "<td>开单日期</td>";
    trtdCode += "<td>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    trtdCode += "<td>项目名称</td>";
    trtdCode += "<td>金额</td>";
    trtdCode += "<td>录单人员</td>";
    trtdCode += "<td>确认人员</td>";
    trtdCode += "<td>过帐时间</td>";
    trtdCode += "<td>过帐人员</td>";
    trtdCode += "<td>备注</td>";
    trtdCode += "</tr>";

    function getExcelTr(trData) {
        var trHtml = "";

        trHtml += "<tr>";

        trHtml += "<td style='height:20px' x:str=\"'" + (trData.WName == "合计" ? "" : trData.BillId) + "\">" + (trData.WName == "合计" ? "" : trData.BillId) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.WName) + "</td>";
        trHtml += "<td>" + (trData.Sett_Date ? frxs.dateTimeFormat(trData.Sett_Date, "yyyy-MM-dd") : "") + "</td>";
        trHtml += "<td>" + (trData.WName == "合计" ? "" : trData.FeeDate) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.WName == "合计" ? "" : trData.ShopCode) + "\">" + (trData.WName == "合计" ? "" : trData.ShopCode) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ShopName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.FeeName) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.FeeAmt + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.CreateUserName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ConfUserName) + "</td>";
        trHtml += "<td>" + (trData.WName == "合计" ? "" : trData.PostingTime) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.ConfUserName) + "</td>";
        trHtml += "<td>" + frxs.replaceCode(trData.Remark) + "</td>";

        trHtml += "</tr>";

        return trHtml;
    }

    for (var i = 0; i < rows.length; i++) {
        trtdCode += getExcelTr(rows[i]);
    }

    if (data.footer) {
        for (var f = 0; f < data.footer.length; f++) {
            trtdCode += getExcelTr(data.footer[f]);
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
            ), "门店费用单导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}

//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }

    $('#grid').datagrid({
        url: '../SalesReport/GetCustomerExpSumList',
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
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
            S1: $("#S1").val(),
            S2: $("#S2").val(),
            S3: $("#S3").val(),
            nKind: 2,
            //SubWID: $("#SubWID").combobox('getValue'),
            S10: $("#S10").val(),
            S11: $("#S11").val() ? ($("#S11").val() + " 23:59:59") : ""
        }
    });
}

function resetSearch() {
    $("#S1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#S2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
    $("#S3").attr("value", "");
    //$('#SubWID').combobox('setValue', '');

    $("#ShopCode").attr("value", "");
    $("#ShopName").attr("value", "");

    $("#S10").val("");
    $("#S11").val("");
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