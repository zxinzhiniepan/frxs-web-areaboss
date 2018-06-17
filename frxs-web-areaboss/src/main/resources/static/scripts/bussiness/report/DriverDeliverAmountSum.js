$(function () {
    //grid绑定
    initGrid();

    //grid高度改变
    gridresize();

    //按需求 默认过账日 起始时间 当月第一天到当天
    var date = new Date();//创建时间对象
    date.setDate(1);//当月的第一天
    var monthFirstDay = date.format('yyyy-MM-dd');//格式化时间
    $("#Sett_Date1").val(monthFirstDay);
    $("#Sett_Date2").val(frxs.nowDateTime("yyyy-MM-dd"));

    //仓库列表绑定
    initDDL();
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
            //查询条件
            SubWID: $("#SubWID").combobox('getValue'),
            OrderId: $.trim($("#OrderId").val()),//订单号
            ShopCode: $.trim($("#ShopCode").val()),//门店编号 
            ShopName: $.trim($("#ShopName").val()),//门店名称
            ShippingUserName: $.trim($("#ShippingUserName").val()),//司机名称
            PackingTime1: $.trim($("#PackingTime1").val()),//装箱时间 起始
            PackingTime2: $.trim($("#PackingTime2").val()),//装箱时间 截止
            Sett_Date1: $.trim($("#Sett_Date1").val()),//日结日期 起始
            Sett_Date2: $.trim($("#Sett_Date2").val()),//日结日期 截止
            S7: $("#S7").combobox('getValue')
        },
        columns: [[
            {
                title: '订单编号', field: 'OrderId', align: 'center', width: 100,
                formatter: function (value, rec) {
                    if (value && value != '合计') {
                        return '<a href="#"  style="cursor:pointer;color:#0066cc " onclick="jumpDetails(\'saleorder\',\'' + value + '\')">' + value + '</a>';
                    } else {
                        return value;
                    }
                }
            },
            {
                title: '公司机构', align: 'center', field: 'SubWName', width: 180, formatter: function (value, rec) {
                    if (rec.WName != rec.SubWName) {
                        return frxs.formatText("【" + rec.SubWCode + "】" + rec.WName + "_" + rec.SubWName);
                    } else {
                        return rec.SubWName;
                    }
                }
            },
            { title: '门店编号', field: 'ShopCode', width: 80, formatter: frxs.replaceCode },
            { title: '门店名称', field: 'ShopName', width: 160, formatter: frxs.replaceCode },
            {
                title: '过账时间', field: 'PackingTime', width: 125, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd HH:mm:ss") : "";
                }
            },
            {
                title: '配送完成时间', field: 'ShippingEndDate', width: 125, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd HH:mm:ss") : "";
                }
            },
            {
                title: '过账日', field: 'Sett_Date', width: 80, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd") : "";
                }
            },
            { title: '配送负责人', align: 'center', field: 'ShippingUserName', width: 70, formatter: frxs.replaceCode },
             {
                 title: '片区', align: 'center', field: 'DictLabel', width: 100
             },
            {
                title: '含税金额', field: 'TotalProductAmt', width: 100, align: 'center', formatter: function (value) {
                   
                    return value ? parseFloat(value).toFixed(4) : parseFloat("0.0000").toFixed(4);
                }
            },
            {
                title: '绩效分', field: 'TotalBasePoint', width: 100, align: 'center', formatter: function (value) {
                  
                    return value ? parseFloat(value).toFixed(4) : parseFloat("0.0000").toFixed(4);
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

//查询
function search() {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }

    var loading = frxs.loading();
    $.ajax({
        url: '../SalesReport/GetDriverDeliverAmountSumData',
        type: 'post',
        data: {
            //查询条件
            SubWID: $("#SubWID").combobox('getValue'),
            OrderId: $.trim($("#OrderId").val()),//订单号
            ShopCode: $.trim($("#ShopCode").val()),//门店编号 
            ShopName: $.trim($("#ShopName").val()),//门店名称
            ShippingUserName: $.trim($("#ShippingUserName").val()),//司机名称
            PackingTime1: $.trim($("#PackingTime1").val()),//装箱时间 起始
            PackingTime2: $.trim($("#PackingTime2").val()),//装箱时间 截止
            Sett_Date1: $.trim($("#Sett_Date1").val()),//日结日期 起始
            Sett_Date2: $.trim($("#Sett_Date2").val()),//日结日期 截止
            S7: $("#S7").combobox('getValue')
        },
        success: function (data) {
            loading.close();
            $('#grid').datagrid({ data: $.parseJSON(data) });
        }
    });
}

//重置
function resetSearch() {
    //$("#SubWID").combobox('setValue', '');
    initDDL();

    $("#OrderId").val('');
    $("#ShopCode").val('');
    $("#ShopName").val('');
    $("#ShippingUserName").val('');
    $("#PackingTime1").val('');
    $("#PackingTime2").val('');
    //$("#Sett_Date1").val('');
    //$("#Sett_Date2").val('');
    //按需求 默认过账日 起始时间 当月第一天到当天
    var date = new Date();//创建时间对象
    date.setDate(1);//当月的第一天
    var monthFirstDay = date.format('yyyy-MM-dd');//格式化时间
    $("#Sett_Date1").val(monthFirstDay);
    $("#Sett_Date2").val(frxs.nowDateTime("yyyy-MM-dd"));
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
            ), "司机发货金额汇总报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
    loading.close();
}

//客户端导出Excel
function exportExcel() {
    var rows = $("#grid").datagrid("getRows");
    if (rows.length <= 0) {
        $.messager.alert("提示", "必须先查询得出数据才能导出。", "info");
        return false;
    }

    var trtdCode = "<tr>";
    trtdCode += "<td style='height:24px'>订单编号</td>";
    trtdCode += "<td>公司机构</td>";
    trtdCode += "<td>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    trtdCode += "<td>过账时间</td>";
    trtdCode += "<td>配送完成时间</td>";
    trtdCode += "<td>过账日</td>";
    trtdCode += "<td>配送负责人</td>";
    trtdCode += "<td>片区</td>";
    trtdCode += "<td>含税金额</td>";
    trtdCode += "<td>绩效分</td>";
    trtdCode += "</tr>";

    for (var i = 0; i < rows.length; i++) {
        trtdCode += "<tr>";
        trtdCode += "<td style='height:20px' x:str=\"'" + rows[i].OrderId + "\">" + rows[i].OrderId + "</td>";
        //公司机构
        var subWName = (rows[i].WName != rows[i].SubWName) ? frxs.replaceCode("【" + rows[i].SubWCode + "】" + rows[i].WName + "_" + rows[i].SubWName) : rows[i].SubWName;
        trtdCode += "<td>" + subWName + "</td>";
        trtdCode += "<td x:str=\"'" + rows[i].ShopCode + "\">" + frxs.replaceCode(rows[i].ShopCode) + "</td>";
        trtdCode += "<td>" + frxs.replaceCode(rows[i].ShopName) + "</td>";

        var packingTime = (rows[i].PackingTime != null && rows[i].PackingTime != "") ? rows[i].PackingTime : "";
        trtdCode += "<td>" + packingTime + "</td>";
        var shippingEndDate = (rows[i].ShippingEndDate != null && rows[i].PackingTime != "") ? rows[i].PackingTime : "";
        trtdCode += "<td>" + shippingEndDate + "</td>";
        var sett_Date = (rows[i].Sett_Date != null && rows[i].Sett_Date != "") ? rows[i].Sett_Date : ""
        trtdCode += "<td>" + sett_Date + "</td>";
        var shippingUserName = (rows[i].ShippingUserName != null) ? rows[i].ShippingUserName : "";
        trtdCode += "<td>" + shippingUserName + "</td>";
        var DictLabel = (rows[i].DictLabel != null) ? rows[i].DictLabel : "";
        trtdCode += "<td>" + DictLabel + "</td>";
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + rows[i].TotalProductAmt + "</td>";
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + rows[i].TotalBasePoint + "</td>";
        trtdCode += "</tr>";
    }

    var dataCode = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>';
    dataCode = dataCode.replace("{table}", trtdCode);
    return dataCode;
}

//JS Date格式化为yyyy-MM-dd类字符串
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//仓库机构 下拉菜单
function initDDL() {
    $.ajax({
        url: '../Common/GetWCList',
        type: 'get',
        data: {},
        success: function (data) {
            //在第一个Item加上请选择
            data = $.parseJSON(data);
            //if (data.length > 1) {
            //    data.unshift({ "WID": "", "WName": "-请选择-" });
            //}
            //data.unshift({ "WID": "", "WName": "-请选择-" });
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