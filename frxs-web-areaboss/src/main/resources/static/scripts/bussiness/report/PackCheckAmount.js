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
        pagination: true,                   //是否显示分页
        pageSize: 30,
        pageList: [30, 50, 100, 300],
        showFooter: true,
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
            SubWID: $("#SubWID").combobox('getValue'),//仓库子机构
            OrderId: $.trim($("#OrderId").val()),//订单号
            ShopCode: $.trim($("#ShopCode").val()),//门店编号 
            ShopName: $.trim($("#ShopName").val()),//门店名称
            PackingEmpName: $.trim($("#PackingEmpName").val()),//装箱员名称
            PackingTime1: $.trim($("#PackingTime1").val()),//装箱时间 起始
            PackingTime2: $.trim($("#PackingTime2").val()),//装箱时间 截止
            Sett_Date1: $.trim($("#Sett_Date1").val()),//日结日期 起始
            Sett_Date2: $.trim($("#Sett_Date2").val()),//日结日期 截止
            QueType: 2
        },
        columns: [[
            { title: '装箱员', align: 'center', field: 'PackingEmpName', width: 200, formatter: frxs.replaceCode },
            {
                title: '含税金额', field: 'TotalProductAmt', width: 200, align: 'center', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
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

//查询
function search(pageIndex, pageSize) {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }
    
    var loading = frxs.loading();
    $.ajax({
        url: '../SalesReport/GetPackCheckAmountData',
        type: 'post',
        dataType: "json",
        data: {
            //查询条件
            SubWID: $("#SubWID").combobox('getValue'),
            OrderId: $.trim($("#OrderId").val()),//订单号
            ShopCode: $.trim($("#ShopCode").val()),//门店编号 
            ShopName: $.trim($("#ShopName").val()),//门店名称
            PackingEmpName: $.trim($("#PackingEmpName").val()),//装箱员名称
            PackingTime1: $.trim($("#PackingTime1").val()),//装箱时间 起始
            PackingTime2: $.trim($("#PackingTime2").val()),//装箱时间 截止
            Sett_Date1: $.trim($("#Sett_Date1").val()),//日结日期 起始
            Sett_Date2: $.trim($("#Sett_Date2").val()),//日结日期 截止
            QueType: 2,
            page: pageIndex || 1,
            rows: pageSize || 30
        },
        success: function (data) {

            var columns = new Array();


            var curColumn = "{title:'装箱员',align:'center',field:'PackingEmpName',width:200,formatter:frxs.replaceCode},{title:'含税金额',field:'TotalProductAmt',width:200,align:'center',formatter:function(value){value=((value==\"\"||!value)?\"0\":value);return parseFloat(value).toFixed(4);}}"


            //$.parseJSON(data).each(function () {
            //    var column = {};
            //    column["title"] = $(this).;
            //    column["field"] = field;
            //    column["width"] = 50;
            //    columns.push(column);
            //});
            loading.close();
            var attArr = data.rows[0];
            var isBegin = false;
            for (var i in attArr) {
                if (isBegin) {
                    //var column = {};
                    //    column["title"] = i;
                    //    column["field"] = i;
                    ////column["width"] = 80;
                    //    column["formatter"] = "function (value) { return parseFloat(value).toFixed(4); }";
                    //    columns.push(column);

                        curColumn += "," + "{title:'" + i + "',field:'" + i + "',width:200,align:'center',formatter:function(value){value=((value==\"\"||!value)?\"0\":value);return parseFloat(value).toFixed(4);}}"
                }
                if (i == "TotalBasePoint") {
                    isBegin = true;
                }
               
            }
            
            $('#grid').datagrid({ columns: eval("[[" + curColumn  + "]]") });
                        
            loading.close();

            $('#grid').datagrid({
                pagination: true,
                pageNumber: pageIndex || 1,
                pageSize: pageSize || 30,
                data: data
            });

            var pg = $("#grid").datagrid("getPager");
            if (pg) {
                
                $(pg).pagination({
                    pageNumber: pageIndex || 1,
                    pageSize: pageSize || 30,
                    onSelectPage: function (pageNumber, pageSize) {
                        search(pageNumber, pageSize);
                    }
                });
            }
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
    $("#PackingEmpName").val('');
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
    var loading = frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");

    $.ajax({
        url: '../SalesReport/GetPackCheckAmountData',
        type: 'post',
        dataType: "json",
        data: {
            //查询条件
            SubWID: $("#SubWID").combobox('getValue'),
            OrderId: $.trim($("#OrderId").val()),//订单号
            ShopCode: $.trim($("#ShopCode").val()),//门店编号 
            ShopName: $.trim($("#ShopName").val()),//门店名称
            PackingEmpName: $.trim($("#PackingEmpName").val()),//装箱员名称
            PackingTime1: $.trim($("#PackingTime1").val()),//装箱时间 起始
            PackingTime2: $.trim($("#PackingTime2").val()),//装箱时间 截止
            Sett_Date1: $.trim($("#Sett_Date1").val()),//日结日期 起始
            Sett_Date2: $.trim($("#Sett_Date2").val()),//日结日期 截止
            QueType: 1,
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
    trtdCode += "<td style='height:24px'>订单编号</td>";
    trtdCode += "<td>公司机构</td>";
    trtdCode += "<td>门店编号</td>";
    trtdCode += "<td>门店名称</td>";
    trtdCode += "<td>确认时间</td>";
    trtdCode += "<td>过账时间</td>";
    trtdCode += "<td>过账日</td>";
    trtdCode += "<td>装箱员</td>";
    trtdCode += "<td>含税金额</td>";


    var attArr = rows[0]
    var isBegin = false;
    var Arr = new Array();
    var j=0;
    for (var i in attArr) {
        if (isBegin) {
           
            trtdCode += "<td>" + i + "</td>";
            Arr[j] = i;
            j++;
        }
        if (i == "TotalBasePoint") {
            isBegin = true;
        }

    }

    trtdCode += "</tr>";

    for (var i = 0; i < rows.length; i++) {
       
        trtdCode += "<tr>";
        trtdCode += "<td style='height:20px' x:str=\"'" + rows[i].OrderId + "\">" + rows[i].OrderId + "</td>";
        //公司机构
        var subWName = (rows[i].WName != rows[i].SubWName) ? frxs.replaceCode("【" + rows[i].SubWCode + "】" + rows[i].WName + "_" + rows[i].SubWName) : rows[i].SubWName;
        trtdCode += "<td>" + subWName + "</td>";
        trtdCode += "<td x:str=\"'" + rows[i].ShopCode + "\">" + frxs.replaceCode(rows[i].ShopCode) + "</td>";
        trtdCode += "<td>" + frxs.replaceCode(rows[i].ShopName) + "</td>";

        var confDate = (rows[i].ConfDate != null && rows[i].ConfDate != "") ? rows[i].ConfDate : "";
        trtdCode += "<td>" + confDate + "</td>";

        var packingTime = (rows[i].PackingTime != null && rows[i].PackingTime != "") ? rows[i].PackingTime : "";
        trtdCode += "<td>" + packingTime + "</td>";

        var sett_Date = (rows[i].Sett_Date != null && rows[i].Sett_Date != "") ? rows[i].Sett_Date : ""
        trtdCode += "<td>" + sett_Date + "</td>";

        trtdCode += "<td>" + rows[i].PackingEmpName + "</td>";
        var TotalProductAmt = (rows[i].TotalProductAmt != null && rows[i].TotalProductAmt != "") ? rows[i].TotalProductAmt : 0;
        trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + TotalProductAmt + "</td>";

        for (n = 0; n < j; n++)
        {
            
            if (rows[i][Arr[n]] == null)
            {
                trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>0</td>";
            }
            else
            {
                trtdCode += "<td style='mso-number-format:\"#,##0.0000\";'>" + rows[i][Arr[n]] + "</td>";
            }
        }

        trtdCode += "</tr>";
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
            ), "装箱员复核金额查询报表导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
        );
    }
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

}

//明细列表
function expandRow(obj, index, row) {

    ////绑定促销列表
    //this.bindSubgridList(obj, index, row);
    var ddv = $(obj).datagrid('getRowDetail', index).find('table.ddv');

    ddv.datagrid({
        title: "装箱员复核金额查询明细表",
        //url: '../SalesReport/GetPackCheckAmountData',
        queryParams: {
            //查询条件
            SubWID: $("#SubWID").combobox('getValue'),
            OrderId: $.trim($("#OrderId").val()),//订单号
            ShopCode: $.trim($("#ShopCode").val()),//门店编号 
            ShopName: $.trim($("#ShopName").val()),//门店名称
            PackingEmpID: row.PackingEmpID,//装箱员ID
            PackingEmpName: row.PackingEmpName,//装箱员名称
            PackingTime1: $.trim($("#PackingTime1").val()),//装箱时间 起始
            PackingTime2: $.trim($("#PackingTime2").val()),//装箱时间 截止
            Sett_Date1: $.trim($("#Sett_Date1").val()),//日结日期 起始
            Sett_Date2: $.trim($("#Sett_Date2").val()),//日结日期 截止
            QueType: 3
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
                title: '订单编号', align: 'center', field: 'OrderId', width: 100,
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
                title: '确认时间', field: 'ConfDate', width: 125, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd HH:mm:ss") : "";
                }
            },
            {
                title: '过账时间', field: 'PackingTime', width: 125, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd HH:mm:ss") : "";
                }
            },
            {
                title: '过账日', field: 'Sett_Date', width: 80, align: 'center', formatter: function (value) {
                    return value ? frxs.dateTimeFormat(value, "yyyy-MM-dd") : "";
                }
            },
            {
                title: '含税金额', field: 'TotalProductAmt', width: 100, align: 'center', formatter: function (value) {
                    return parseFloat(value).toFixed(4);
                }
            }

        ]]
    });
    //var topDetail = $(obj).datagrid('getRowDetail', index).find("div.xs-list-subgrid-topDetail");
    //topDetail.html(row.PickUserName);

    expandRowSearch(ddv, row);

    //设置当前行行高
    $('#grid').datagrid('fixDetailRowHeight', index);
}

//查询
function expandRowSearch(expandObj, row, pageIndex, pageSize) {
    var validate = $("#myForm").form('validate');
    if (!validate) {
        return false;
    }

    var loading = frxs.loading();
    $.ajax({
        url: '../SalesReport/GetPackCheckAmountData',
        type: 'post',
        dataType: "json",
        data: {
            //查询条件
            SubWID: $("#SubWID").combobox('getValue'),
            OrderId: $.trim($("#OrderId").val()),//订单号
            ShopCode: $.trim($("#ShopCode").val()),//门店编号 
            ShopName: $.trim($("#ShopName").val()),//门店名称
            PackingEmpID: row.PackingEmpID,//装箱员ID
            PackingEmpName: row.PackingEmpName,//装箱员名称
            PackingTime1: $.trim($("#PackingTime1").val()),//装箱时间 起始
            PackingTime2: $.trim($("#PackingTime2").val()),//装箱时间 截止
            Sett_Date1: $.trim($("#Sett_Date1").val()),//日结日期 起始
            Sett_Date2: $.trim($("#Sett_Date2").val()),//日结日期 截止
            queType: 3,
            page: pageIndex || 1,
            rows: pageSize || 10
        },
        success: function (data) {

            var columns = new Array();


            var curColumn = "{title:'订单编号',align:'center',field:'OrderId',width:100,formatter:function(value,rec){if(value&&value!='合计'){return'<a href=\"#\"  style=\"cursor:pointer;color:#0066cc \" onclick=\"jumpDetails(\\'saleorder\\',\\''+value+'\\')\">'+value+'</a>';}else{return value;}}},{title:'公司机构',align:'center',field:'SubWName',width:180,formatter:function(value,rec){if(rec.WName!=rec.SubWName){return frxs.formatText(\"【\"+rec.SubWCode+\"】\"+rec.WName+\"_\"+rec.SubWName);}else{return rec.SubWName;}}},{title:'门店编号',field:'ShopCode',width:80,formatter:frxs.replaceCode},{title:'门店名称',field:'ShopName',width:160,formatter:frxs.replaceCode},{title:'确认时间',field:'ConfDate',width:125,align:'center',formatter:function(value){return value?frxs.dateTimeFormat(value,\"yyyy-MM-dd HH:mm:ss\"):\"\";}},{title:'过账时间',field:'PackingTime',width:125,align:'center',formatter:function(value){return value?frxs.dateTimeFormat(value,\"yyyy-MM-dd HH:mm:ss\"):\"\";}},{title:'过账日',field:'Sett_Date',width:80,align:'center',formatter:function(value){return value?frxs.dateTimeFormat(value,\"yyyy-MM-dd\"):\"\";}},{title:'含税金额',field:'TotalProductAmt',width:100,align:'center',formatter:function(value){value=((value==\"\"||!value)?\"0\":value);return parseFloat(value).toFixed(4);}}"

            loading.close();
            var attArr = data.rows[0];
            var isBegin = false;
            for (var i in attArr) {
                if (isBegin) {
                    
                    curColumn += "," + "{title:'" + i + "',field:'" + i + "',width:100,align:'center',formatter:function(value){value=((value==\"\"||!value)?\"0\":value);return parseFloat(value).toFixed(4);}}"
                }
                if (i == "TotalBasePoint") {
                    isBegin = true;
                }

            }

            expandObj.datagrid({ columns: eval("[[" + curColumn + "]]") });


            loading.close();
            expandObj.datagrid({
                pageNumber: pageIndex || 1,
                pageSize: pageSize || 30,
                data: data
            });

            var pg = expandObj.datagrid("getPager");
            if (pg) {
                $(pg).pagination({
                    pageNumber: pageIndex || 1,
                    pageSize: pageSize || 1,
                    onSelectPage: function (pageNumber, pageSize) {
                        expandRowSearch(expandObj, row, pageNumber, pageSize);
                    }
                });
            }
        }
    });
}