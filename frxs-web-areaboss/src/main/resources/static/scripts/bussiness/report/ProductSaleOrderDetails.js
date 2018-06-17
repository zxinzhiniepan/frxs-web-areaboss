$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();

    //门店 事件绑定
    shopEventBind();

    //grid高度改变
    gridresize();

    //订单确认时间
    $("#ConfDate1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#ConfDate2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");
});

//日期
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}

//表格数据加载
function initGrid() {
    $('#grid').datagrid({
        rownumbers: true,                   //显示行编号

        pagination: true,                   //是否显示分页
        showFooter: true,
        pageSize: 30,
        pageList: [30, 50, 100, 300],
        onLoadSuccess: function () {
            $('#grid').datagrid('clearSelections');
            totalCalculate();
        },
        frozenColumns: [[
        { title: '公司机构', field: 'SubWName', width: 120, align: 'center', formatter: frxs.formatText }
        ]],
        columns: [[

            { title: '订单确认时间', field: 'ConfDate', width: 120, align: 'center' },
            { title: '门店编号', field: 'ShopCode', width: 80, align: 'center' },
            { title: '门店名称', field: 'ShopName', width: 150, formatter: frxs.formatText },
            { title: '配送周期', field: 'SendW', width: 200, formatter: frxs.formatText },
            { title: '订单编号', field: 'OrderId', width: 100, align: 'center' },
            { title: '订单来源', field: 'OrderType', width: 65, align: 'center' },
            { title: '基本分类', field: 'CategoryId1Name', width: 260, align: 'center' },
            { title: '商品编号', field: 'SKU', width: 70, align: 'center' },
            { title: '商品类型', field: 'IsNoStock', width: 75, align: 'center' },
            { title: '商品名称', field: 'ProductName', width: 260, align: 'center', formatter: frxs.formatText },
            { title: '商品条码', field: 'BarCode', width: 120, align: 'center', },
            { title: '配送单位', field: 'SaleUnit', width: 60, align: 'center' },
            { title: '包装数量', field: 'SalePackingQty', width: 60, align: 'right', formatter: frxs.formatFixed2 },
            { title: '订货数量', field: 'PreQty', width: 60, align: 'right', formatter: frxs.formatFixed2 },
            { title: '总数量', field: 'TotalQty', width: 80, align: 'right', formatter: frxs.formatFixed2 },
            { title: '订货金额', field: 'SalePreAmt', width: 80, align: 'right', formatter: frxs.formatFixed4 },
            { title: '配送价格', field: 'SaleQtyPrice', width: 80, align: 'right', formatter: frxs.formatFixed4 },
            { title: '配送数量', field: 'SaleQty', width: 80, align: 'right', formatter: frxs.formatFixed2 },
            { title: '配送金额', field: 'SaleAmt', width: 80, align: 'right', formatter: frxs.formatFixed4 },
            { title: '差异数量', field: 'DiffNum', width: 80, align: 'right', formatter: frxs.formatFixed2 },
            { title: '差异金额', field: 'DiffAmt', width: 80, align: 'right', formatter: frxs.formatFixed4 },
            { title: '商品副标题', field: 'ProductName2', width: 160, formatter: frxs.formatText },
            { title: '代购员', field: 'EmpName', width: 60 },
            { title: '供应商', field: 'VendorName', width: 150, formatter: frxs.formatText },
            { title: '供应编码', field: 'VendorCode', width: 150, formatter: frxs.formatText }
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

function totalCalculate() {
    var rows = $("#grid").datagrid("getRows");
    var SalePreAmt = 0.0000;
    var SaleAmt = 0.0000;
    var DiffAmt = 0.0000;
    var PreQty = 0.00;
    var TotalQty = 0.00;
    var SaleQty = 0.00;
    var DiffNum = 0.00;
    for (var i = 0; i < rows.length; i++) {
        var salePreAmt = parseFloat(rows[i].SalePreAmt);
        SalePreAmt += salePreAmt;

        var saleAmt = parseFloat(rows[i].SaleAmt);
        SaleAmt += saleAmt;

        var diffAmt = parseFloat(rows[i].DiffAmt);
        DiffAmt += diffAmt;

        var preQty = parseFloat(rows[i].PreQty);
        PreQty += preQty;

        var totalQty = parseFloat(rows[i].TotalQty);
        TotalQty += totalQty;

        var saleQty = parseFloat(rows[i].SaleQty);
        SaleQty += saleQty;

        var diffNum = parseFloat(rows[i].DiffNum);
        DiffNum += diffNum;

    }

    //$("#TotalOrderAmt").val(parseFloat(totalSubAmt).toFixed(4));
    $('#grid').datagrid('reloadFooter', [
       {
           "SubWName": "当前页合计：",
           "PreQty": parseFloat(PreQty).toFixed(2),
           "TotalQty": parseFloat(TotalQty).toFixed(2),
           "SaleQty": parseFloat(SaleQty).toFixed(2),
           "DiffNum": parseFloat(DiffNum).toFixed(2),
           "SalePreAmt": parseFloat(SalePreAmt).toFixed(4),
           "SaleAmt": parseFloat(SaleAmt).toFixed(4),
           "DiffAmt": parseFloat(DiffAmt).toFixed(4)
       },
       {
           "SubWName": "总合计：",
           "PreQty": $("#grid").datagrid("getData").footer[0].PreQty == undefined ? 0.00 : $("#grid").datagrid("getData").footer[0].PreQty.toFixed(2),
           "TotalQty": $("#grid").datagrid("getData").footer[0].TotalQty == undefined ? 0.00 : $("#grid").datagrid("getData").footer[0].TotalQty.toFixed(2),
           "SaleQty": $("#grid").datagrid("getData").footer[0].SaleQty == undefined ? 0.00 : $("#grid").datagrid("getData").footer[0].SaleQty.toFixed(2),
           "DiffNum": $("#grid").datagrid("getData").footer[0].DiffNum == undefined ? 0.00 : $("#grid").datagrid("getData").footer[0].DiffNum.toFixed(2),
           "SalePreAmt": $("#grid").datagrid("getData").footer[0].SalePreAmt == undefined ? 0.0000 : $("#grid").datagrid("getData").footer[0].SalePreAmt.toFixed(4),
           "SaleAmt": $("#grid").datagrid("getData").footer[0].SaleAmt == undefined ? 0.0000 : $("#grid").datagrid("getData").footer[0].SaleAmt.toFixed(4),
           "DiffAmt": $("#grid").datagrid("getData").footer[0].DiffAmt == undefined ? 0.0000 : $("#grid").datagrid("getData").footer[0].DiffAmt.toFixed(4)
       }
    ]);
}

//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    $('#grid').datagrid({
        url: '../SalesReport/GetProductSaleOrderDetailsReport',//商品订单明细查询报表
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        fit: false,                         //分页在最下面
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
            SubWID: $("#SubWID").combobox('getValue'),  //仓库子机构
            ConfDate1: $("#ConfDate1").val(),           //订单确认时间 起始
            ConfDate2: $("#ConfDate2").val(),           //订单确认时间 截止
            SKU: $("#SKU").val(),                       //商品编码
            ProductName: $("#ProductName").val(),       //商品名称
            BarCode: $("#BarCode").val(),               //商品条码
            ProductName2: $("#ProductName2").val(),     //商品副标题
            ShopID: $("#ShopID").val(),                 //门店ID            
            BuyEmpID: $("#EmpID").val(),                 //代购员
            CategoriesId1: $('#CategoriesId1').combobox('getValue'),//商品基本一级类ID
            CategoriesId2: $('#CategoriesId2').combobox('getValue'),//商品二级类ID
            CategoriesId3: $('#CategoriesId3').combobox('getValue'),//商品三级类ID
            IsNoStock: $('#IsNoStock').combobox('getValue'),
            OrderType: $('#OrderType').combobox('getValue')
        }
    });
}

//重置条件
function resetSearch() {
    $("#SubWID").combobox('setValue', '');

    $("#ConfDate1").val(frxs.nowDateTime("yyyy-MM-dd") + " 00:00");
    $("#ConfDate2").val(frxs.nowDateTime("yyyy-MM-dd") + " 23:59");

    $("#SKU").val('');
    $("#BarCode").val('');
    $("#ProductName").val('');
    $("#ProductName2").val('');

    $("#ShopID").attr("value", "");
    $("#ShopCode").attr("value", "");
    $("#ShopName").attr("value", "");

    $("#EmpID").attr("value", "");
    $("#BuyEmpName").attr("value", "");
    $('#CategoriesId1').combobox('setValue', '');
    $('#CategoriesId2').combobox('setValue', '');
    $('#CategoriesId3').combobox('setValue', '');

    $('#OrderType').combobox('setValue', '');
    $('#IsNoStock').combobox('setValue', '');

}

//仓库下拉菜单
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

//选择门店 弹窗
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


//供门店 回车事件绑定
function shopEventBind() {
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

    //搜索回车事件与门店选择回车事件 冲突解决
    $(document).on('keydown', function (e) {
        if (e.keyCode == 13) {
            var id = $("#myForm :text:focus").attr("id");
            if (id != undefined && id != "ShopCode" && id != "ShopName") {
                search();
            }
            //else {
            //    return false;
            //}
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
                $("#ShopID").val(obj.rows[0].ShopID);
                $("#ShopCode").val(obj.rows[0].ShopCode);
                $("#ShopName").val(obj.rows[0].ShopName);
            } else {
                selShop();
            }
        }
    });
}

//代购员选择 弹窗
function selBuyEmp() {
    frxs.dialog({
        title: "选择代购员",
        url: "../BuyOrderPre/SelectBuyEmp?buyEmpName=" + encodeURIComponent($("#BuyEmpName").val()),
        owdoc: window.top,
        width: 850,
        height: 500
    });
}

//回填代购员
function backFillBuyEmp(empId, empName) {
    $("#EmpID").val(empId);
    $("#BuyEmpName").val(empName);
}

//代购员 事件绑定
function eventBuyEmp() {
    $.ajax({
        url: "../Common/GetBuyEmpInfo",
        type: "post",
        data: {
            EmpName: $("#BuyEmpName").val(),
            page: 1,
            rows: 200
        },
        success: function (obj) {
            var parseobj = JSON.parse(obj);
            if (parseobj.total == 1) {
                $("#EmpID").val(parseobj.rows[0].EmpID);
                $("#BuyEmpName").val(parseobj.rows[0].EmpName);
            } else {
                selBuyEmp();
            }
        }
    });
}

//导出 新代码 调用封装的方法
function exportoutToPage() {

    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");
    event.preventDefault();
    $.ajax({
        url: '../SalesReport/GetProductSaleOrderDetailsReport',
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            SubWID: $("#SubWID").combobox('getValue'),  //仓库子机构
            ConfDate1: $("#ConfDate1").val(),           //订单确认时间 起始
            ConfDate2: $("#ConfDate2").val(),           //订单确认时间 截止
            SKU: $("#SKU").val(),                       //商品编码
            ProductName: $("#ProductName").val(),       //商品名称
            BarCode: $("#BarCode").val(),               //商品条码
            ProductName2: $("#ProductName2").val(),     //商品副标题
            ShopID: $("#ShopID").val(),                 //门店ID            
            BuyEmpID: $("#EmpID").val(),                //代购员
            Rows: 1000000,                               //默认导出100万条记录
            CategoriesId1: $('#CategoriesId1').combobox('getValue'),//商品基本一级类ID
            CategoriesId2: $('#CategoriesId2').combobox('getValue'),//商品二级类ID
            CategoriesId3: $('#CategoriesId3').combobox('getValue'),//商品三级类ID   
            IsNoStock: $('#IsNoStock').combobox('getValue'),
            OrderType: $('#OrderType').combobox('getValue')
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
    trtdCode += "<td style='height:24px'>公司机构</td>";
    trtdCode += "<td>订单确认时间</td>";
    trtdCode += "<td>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    trtdCode += "<td>配送周期</td>";
    trtdCode += "<td>订单编号</td>";
    trtdCode += "<td>订单来源</td>";
    trtdCode += "<td>基本分类</td>";
    trtdCode += "<td>商品编号</td>";
    trtdCode += "<td>商品类型</td>";
    trtdCode += "<td>商品名称</td>";
    trtdCode += "<td>商品条码</td>";
    trtdCode += "<td>配送单位</td>";
    trtdCode += "<td>包装数量</td>";
    trtdCode += "<td>订货数量</td>";
    trtdCode += "<td>总数量</td>";
    trtdCode += "<td>订货金额</td>";
    trtdCode += "<td>配送价格</td>";
    trtdCode += "<td>配送数量</td>";
    trtdCode += "<td>配送金额</td>";
    trtdCode += "<td>差异数量</td>";
    trtdCode += "<td>差异金额</td>";

    trtdCode += "<td>商品副标题</td>";
    trtdCode += "<td>代购员</td>";
    trtdCode += "<td>供应商</td>";
    trtdCode += "<td>供应商编码</td>";
    trtdCode += "</tr>";

    function getExcelTr(trData) {
        var trHtml = "";

        trHtml += "<tr>";
        trHtml += "<td style='height:20px'>" + trData.SubWName + "</td>";
        trHtml += "<td >" + (trData.SubWName == "合计" ? "" : trData.ConfDate) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.SubWName == "合计" ? "" : trData.ShopCode) + "\">" + (trData.SubWName == "合计" ? "" : trData.ShopCode) + "</td>";
        trHtml += "<td>" + (trData.SubWName == "合计" ? "" : trData.ShopName) + "</td>";
        trHtml += "<td>" + (trData.SubWName == "合计" ? "" : trData.SendW) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.SubWName == "合计" ? "" : trData.OrderId) + "\">" + (trData.SubWName == "合计" ? "" : trData.OrderId) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.SubWName == "合计" ? "" : trData.OrderType) + "\">" + (trData.SubWName == "合计" ? "" : trData.OrderType) + "</td>";

        trHtml += "<td >" + (trData.SubWName == "合计" ? "" : trData.CategoryId1Name) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.SubWName == "合计" ? "" : trData.SKU) + "\">" + (trData.SubWName == "合计" ? "" : trData.SKU) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.SubWName == "合计" ? "" : trData.IsNoStock) + "\">" + (trData.SubWName == "合计" ? "" : trData.IsNoStock) + "</td>";
        trHtml += "<td>" + (trData.SubWName == "合计" ? "" : trData.ProductName) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.SubWName == "合计" ? "" : trData.BarCode) + "\">" + (trData.SubWName == "合计" ? "" : trData.BarCode) + "</td>";
        trHtml += "<td>" + (trData.SubWName == "合计" ? "" : trData.SaleUnit) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + (trData.SubWName == "合计" ? "" : trData.SalePackingQty) + "</td>";

        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.PreQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.TotalQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SalePreAmt + "</td>";

        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + (trData.SubWName == "合计" ? "" : trData.SaleQtyPrice) + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.SaleQty + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.SaleAmt + "</td>";

        trHtml += "<td style='mso-number-format:\"#,##0.00\";'>" + trData.DiffNum + "</td>";
        trHtml += "<td style='mso-number-format:\"#,##0.0000\";'>" + trData.DiffAmt + "</td>";

        trHtml += "<td>" + (trData.SubWName == "合计" ? "" : frxs.replaceCode(trData.ProductName2)) + "</td>";
        trHtml += "<td>" + (trData.SubWName == "合计" ? "" : frxs.replaceCode(trData.EmpName)) + "</td>";
        trHtml += "<td>" + (trData.SubWName == "合计" ? "" : frxs.replaceCode(trData.VendorName)) + "</td>";
        trHtml += "<td x:str=\"'" + (trData.SubWName == "合计" ? "" : (trData.VendorCode == null ? "" : trData.VendorCode)) + "\">" + (trData.SubWName == "合计" ? "" : (trData.VendorCode == null ? "" : trData.VendorCode)) + "</td>";
        trHtml += "</tr>";
        return trHtml;
    }

    for (var i = 0; i < rows.length; i++) {
        trtdCode += getExcelTr(rows[i]);
    }

    if (data.footer) {
        debugger;
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
            ), "商品订购明细查询报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
}


