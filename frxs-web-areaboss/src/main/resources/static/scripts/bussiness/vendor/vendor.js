$(function () {
    //grid绑定
    initGrid();

    //下拉绑定
    initDDL();

    //grid高度改变
    gridresize();

    //查询按钮事件
    $("#aSearch").click(function () {
        search();
    });
    //重置按钮事件
    $("#aReset").click(function () {
        resetSearch();
    });

});

//搜索
function search() {
    //实现刷新栏目中的数据
    initGrid();
}

//初始化查询
function initGrid() {
    $('#grid').datagrid({
        title: '',                      //标题
        iconCls: 'icon-view',               //icon
        methord: 'get',                    //提交方式
        url: '../Vendor/VendorList',          //Aajx地址
        sortName: 'VendorID',                 //排序字段
        sortOrder: 'asc',                  //排序方式
        idField: 'VendorCode',                  //主键
        pageSize: 30,                       //每页条数
        pageList: [10, 30, 50, 100],//可以设置每页记录条数的列表 
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
        onLoadSuccess: function () {
            $('#grid').datagrid('clearSelections');
            $(this).datagrid("fixRownumber");
        },
        onDblClickCell: function (rowIndex) {
            ToView();
        },
        queryParams: {
            //查询条件
            VendorCode: $("#VendorCode").val(),
            VendorName: $("#VendorName").val(),
            VendorTypeID: $("#VendorTypeID").combobox('getValue'),
            LinkMan: $("#LinkMan").val(),
            SettleTimeType: $("#SettleTimeType").combobox('getValue'),
            WStatus: $('#WStatus').combobox('getValue'),
            PaymentDateType: $("#PaymentDateType").combobox('getValue')
        },
        frozenColumns: [[
           //冻结列
           { field: 'ck', checkbox: true }, //选择
           { title: '供应商编码', field: 'VendorCode', width: 80, align: 'center', formatter: frxs.replaceCode }
        ]],
        columns: [[

            { title: '名称', field: 'VendorName', width: 180, formatter: frxs.replaceCode },
            { title: '简称', field: 'VendorShortName', width: 120, formatter: frxs.replaceCode },
            { title: '供应商分类', field: 'VendorTypeName', width: 100, align: 'center', formatter: frxs.replaceCode },
            { title: '结算周期', field: 'SettleTimeTypeName', width: 100, align: 'center', formatter: frxs.replaceCode },
            { title: '账期', field: 'PaymentDateTypeName', width: 60, align: 'center', formatter: frxs.replaceCode },
            //{
            //    title: '状态', field: 'Status', width: 60, align: 'center', formatter: function (value, rec) {
            //        if (value == "0") {
            //            return "<span class='freeze_text'>冻结</span>";
            //        }
            //        else {
            //            return "正常";
            //        }
            //    }
            //},
            { title: 'WStatus', field: 'WStatus', width: 60, align: 'center', hidden: true },
            {
                title: '状态', field: 'WStatusName', width: 60, align: 'center', formatter: function (value, rec) {
                    if (value == "冻结") {
                        return "<span class='freeze_text'>冻结</span>";
                    }
                    else if (value == "正常") {
                        return "正常";
                    } else if (value == "淘汰") {
                        return "淘汰";
                    } else {
                        return "";
                    }
                }
            },
            { title: '联系人', field: 'LinkMan', width: 60, align: 'center', formatter: frxs.replaceCode },
            { title: '电话', field: 'Telephone', width: 100, align: 'center', formatter: frxs.replaceCode },
            { title: '地址', field: 'FullAddress', width: 200, align: 'left', formatter: frxs.formatText }
        ]]
    });
}

//add gzj 淘汰供应商
function clearVendor() {
    var rows = $('#grid').datagrid('getSelections');
    if (rows.length > 1) {
        $.messager.alert("提示", "只能选中一条！", "info");
    } else if (rows.length == 0) {
        $.messager.alert("提示", "没有选中记录！", "info");
    } else {
        var row = rows[0];
        if (row.WStatus == 2) {
            $.messager.alert("提示", "该供应商已被淘汰！", "info");
            return;
        }

        $.messager.confirm("提示", "确认淘汰该供应商吗?", function (r) {
            if (r) {
                var loading = frxs.loading();
                $.ajax({
                    url: "../Vendor/CleanVendor",
                    type: "post",
                    dataType: "json",
                    data: { id: row.VendorID },
                    success: function (result) {
                        loading.close();
                        if (result.Flag == "SUCCESS") {
                            $("#grid").datagrid("reload");
                            $('#grid').datagrid('clearSelections');
                            $.messager.alert('提示', "供应商淘汰成功", "info");
                        }
                        else {
                            $.messager.alert('提示', formatAlertMessage(result.Info), "info");
                        }
                    },
                    error: function (request, textStatus, errThrown) {
                        loading.close();
                        if (textStatus) {
                            $.messager.alert('错误', textStatus, 'warning');
                        } else if (errThrown) {
                            $.messager.alert('错误', errThrown, 'warning');
                        } else {
                            $.messager.alert('错误', "供应商淘汰失败", 'warning');
                        }
                    }
                });
            }
        });
    }
}

//add 罗靖 设置商品供应关系
function setVendorProduct() {
    var rows = $('#grid').datagrid('getSelections');
    if (rows.length > 1) {
        $.messager.alert("提示", "只能选中一条！", "info");
    } else if (rows.length == 0) {
        $.messager.alert("提示", "没有选中记录！", "info");
    } else {
        if (rows[0].WStatus == "0") {
            $.messager.alert("警告", "该供应商已被冻结！", "warning");
            return;
        }
        var thisdlg = frxs.dialog({
            title: "供应商商品设置",
            url: "../VerdorProducts/VendorProductsList?vendorId=" + rows[0].VendorID + "&vendorName=" + rows[0].VendorName,
            owdoc: window.top,
            width: 880,
            height: 620,
            buttons: [{
                text: '<div title=【ESC】>关闭</div>',
                iconCls: 'icon-cancel',
                handler: function () {
                    window.focus();
                    thisdlg.dialog("close");
                }
            }]
        });
    }
}

//回调函数，添加商品供应商关系 add 罗靖
function addProductsVendorList(data) {
    $.ajax({
        url: "../ProductsVendor/AddProductsVendorListHandle",
        type: "post",
        dataType: "json",
        data: data,
        success: function (result) {
            if (result.Flag == "SUCCESS") {
                $.messager.alert('提示', "商品设置成功", "info");
            }
            else {
                $.messager.alert('提示', result.Info, "info");
            }
        },
        error: function (request, textStatus, errThrown) {
            if (textStatus) {
                $.messager.alert('错误', textStatus, 'warning');
            } else if (errThrown) {
                $.messager.alert('错误', errThrown, 'warning');
            } else {
                $.messager.alert('错误', "商品设置失败", 'warning');
            }
        }
    });
}


//重置
function resetSearch() {
    $("#VendorCode").val('');
    $("#VendorName").val('');
    $("#VendorTypeID").combobox('setValue', '');
    $('#LinkMan').val('');
    $('#SettleTimeType').combobox('setValue', '');
    $('#WStatus').combobox('setValue', '1');
    $('#PaymentDateType').combobox('setValue', '');
}


//编辑供应商
function ToViewVendor(vendorID) {
    var thisdlg = frxs.dialog({
        title: "查看供应商信息",
        url: "../Vendor/AddOrEditNew?id=" + vendorID,
        owdoc: window.top,
        width: 650,
        height: 580,
        buttons: [{
            text: '关闭',
            iconCls: 'icon-cancel',
            handler: function () {
                thisdlg.dialog("close");
            }
        }]
    });
}

//编辑按钮事件
function ToView() {
    var rows = $('#grid').datagrid('getSelections');
    if (rows.length > 1) {
        $.messager.alert("提示", "只能选中一条！", "info");
    } else if (rows.length == 0) {
        $.messager.alert("提示", "没有选中记录！", "info");
    } else {
        ToViewVendor(rows[0].VendorID);
    }
}



function initDDL() {

    $.ajax({
        url: '../Common/GetVendorTypes',
        type: 'get',
        dataType: 'json',
        async: false,
        data: {},
        success: function (data) {
            //data = $.parseJSON(data);
            //在第一个Item加上请选择
            data.unshift({ "VendorTypeID": "", "VendorTypeName": "-请选择-" });
            //创建控件
            $("#VendorTypeID").combobox({
                data: data,                       //数据源
                valueField: "VendorTypeID",       //id列
                textField: "VendorTypeName"       //value列
            });
        }, error: function (e) {

        }
    });
    $.ajax({
        url: '../Common/GetVendorDllInfo',
        type: 'get',
        dataType: 'json',
        async: false,
        data: { dictType: "VendorSettleTimeType" },
        success: function (data) {
            //data = $.parseJSON(data);
            //在第一个Item加上请选择
            data.unshift({ "DictValue": "", "DictLabel": "-请选择-" });
            //创建控件
            $("#SettleTimeType").combobox({
                data: data,                       //数据源
                valueField: "DictValue",       //id列
                textField: "DictLabel"       //value列
            });
        }, error: function (e) {

        }
    });
    $.ajax({
        url: '../Common/GetVendorDllInfo',
        type: 'get',
        dataType: 'json',
        async: false,
        data: { dictType: "PaymentDateType" },
        success: function (data) {
            //data = $.parseJSON(data);
            //在第一个Item加上请选择
            data.unshift({ "DictValue": "", "DictLabel": "-请选择-" });
            //创建控件
            $("#PaymentDateType").combobox({
                data: data,                       //数据源
                valueField: "DictValue",       //id列
                textField: "DictLabel"       //value列
            });
        }, error: function (e) {

        }
    });
}

//导出事件
function Export() {
    var loading = window.top.frxs.loading("正在导出数据，如数据量大可能需要长一点时间...");

    //获取全部数据后导出到Excel
    $.ajax({
        url: '../Vendor/VendorList',          //Aajx地址
        type: "post",
        dataType: "json",
        data: {
            //查询条件
            VendorCode: $("#VendorCode").val(),
            VendorName: $("#VendorName").val(),
            VendorTypeID: $("#VendorTypeID").combobox('getValue'),
            LinkMan: $("#LinkMan").val(),
            SettleTimeType: $("#SettleTimeType").combobox('getValue'),
            WStatus: $('#WStatus').combobox('getValue'),
            PaymentDateType: $("#PaymentDateType").combobox('getValue'),
            page: 1,
            sort: 'VendorID',
            order: 'asc',
            rows: 100000000//页数
        },
        success: function (result) {
            if (result != undefined && result.rows != undefined) {
                var rows = result.rows;
                if (rows.length <= 0) {
                    $.messager.alert("提示", "没有查询到数据。", "info");
                    return false;
                }

                //标题行
                var trtdCode = "<tr>";
                trtdCode += "<td>ID</td>";
                trtdCode += "<td style='height:24px'>供应商编码</td>";
                trtdCode += "<td>供应商名称</td>";
                trtdCode += "<td>供应商简称</td>";
                trtdCode += "<td>供应商分类</td>";
                trtdCode += "<td>结算周期</td>";
                trtdCode += "<td>账期</td>";
                trtdCode += "<td>状态</td>";
                trtdCode += "<td>联系人</td>";
                trtdCode += "<td>电话</td>";
                trtdCode += "<td>地址</td>";
                trtdCode += "<td>Email</td>";
                trtdCode += "<td>传真</td>";
                trtdCode += "<td>负责人</td>";

                trtdCode += "<td>商贸标示</td>";
                trtdCode += "<td>一般纳税人</td>";
                trtdCode += "<td>结算方式</td>";
                trtdCode += "<td>公司电话</td>";
                //v1.7.1 add 
                trtdCode += "<td>法人身份证号码</td>";
                trtdCode += "<td>营业执照号码</td>";
                trtdCode += "<td>食品经营许可证号码</td>";
                trtdCode += "<td>收款人姓名</td>";
                trtdCode += "<td>收款人开户行</td>";
                trtdCode += "<td>收款人帐号</td>";
                trtdCode += "<td>新建日期</td>";
                trtdCode += "<td>备注2</td>";
                trtdCode += "<td>备注3</td>";
                trtdCode += "<td>备注4</td>";
                trtdCode += "<td>备注5</td>";
                trtdCode += "</tr>";

                //装入数据
                for (var i = 0; i < rows.length; i++) {
                    trtdCode += "<tr>";
                    trtdCode += "<td>" + rows[i].VendorID + "</td>";
                    trtdCode += "<td style='height:20px' x:str=\"'" + rows[i].VendorCode + "\">" + rows[i].VendorCode + "</td>";
                    trtdCode += "<td>" + frxs.replaceCode(rows[i].VendorName) + "</td>";
                    trtdCode += "<td>" + frxs.replaceCode(rows[i].VendorShortName) + "</td>";
                    trtdCode += "<td>" + frxs.replaceCode(rows[i].VendorTypeName) + "</td>";
                    trtdCode += "<td>" + rows[i].SettleTimeTypeName + "</td>";
                    trtdCode += "<td>" + rows[i].PaymentDateTypeName + "</td>";

                    //var strStatus = (rows[i].Status == "0") ? "冻结" : "正常";
                    //trtdCode += "<td>" + strStatus + "</td>";
                    trtdCode += "<td>" + rows[i].WStatusName + "</td>";

                    trtdCode += "<td>" + rows[i].LinkMan + "</td>";
                    trtdCode += "<td>" + rows[i].Telephone + "</td>";
                    trtdCode += "<td>" + rows[i].FullAddress + "</td>";
                    trtdCode += "<td>" + rows[i].Email + "</td>";
                    trtdCode += "<td>" + rows[i].Fax + "</td>";
                    trtdCode += "<td>" + rows[i].LegalPerson + "</td>";

                    trtdCode += "<td>" + rows[i].VExt1 + "</td>";

                    var strIsAvgTaxpayer = "";
                    if (rows[i].IsAvgTaxpayer == 0) {
                        strIsAvgTaxpayer = "否";
                    }
                    else if (rows[i].IsAvgTaxpayer == 1) {
                        strIsAvgTaxpayer = "是";
                    }
                    else {
                        strIsAvgTaxpayer = "";
                    }
                    trtdCode += "<td>" + strIsAvgTaxpayer + "</td>";

                    var strSettType = "";
                    if (rows[i].SettType == "01") {
                        strSettType = "现结";
                    }
                    else if (rows[i].SettType == "02") {
                        strSettType = "银行";
                    }
                    trtdCode += "<td>" + strSettType + "</td>";
                    trtdCode += "<td>" + rows[i].CompanyPhone + "</td>";
                    //v1.7.1 add : 
                    trtdCode += excelExport.numToStr(rows[i].LegalPersonIdCard);//长数字，显示前导0
                    trtdCode += excelExport.numToStr(rows[i].BusinessLicenseNo);
                    trtdCode += excelExport.numToStr(rows[i].FoodLicense);
                    trtdCode += excelExport.fieldToTd(rows[i].PayeeName);
                    trtdCode += excelExport.fieldToTd(rows[i].PayeeBankName);
                    trtdCode += excelExport.numToStr(rows[i].PayeeBankAccount);
                    trtdCode += excelExport.numToStr(rows[i].Remark1);
                    trtdCode += excelExport.numToStr(rows[i].Remark2);
                    trtdCode += excelExport.numToStr(rows[i].Remark3);
                    trtdCode += excelExport.numToStr(rows[i].Remark4);
                    trtdCode += excelExport.numToStr(rows[i].Remark5);

                    trtdCode += "</tr>";
                }

                //文件流
                var dataCode = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>';
                dataCode = dataCode.replace("{table}", trtdCode);

                if (dataCode) {
                    event.preventDefault();
                    var bb = self.Blob;
                    saveAs(
                        new bb(
                            ["\ufeff" + dataCode] //\ufeff防止utf8 bom防止中文乱码
                            , { type: "html/plain;charset=utf8" }
                        ), "供应商信息导出_" + frxs.nowDateTime("yyyyMMdd") + ".xls"
                    );
                }
            }
            loading.close();
        },
        error: function (request, textStatus, errThrown) {
            if (textStatus) {
                $.messager.alert("提示", textStatus, "info");
            } else if (errThrown) {
                $.messager.alert("提示", errThrown, "info");
            } else {
                $.messager.alert("提示", "出现错误", "info");
            }
            loading.close();
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

//格式化弹出消息(超出长度的字符串则显示滚动条)
function formatAlertMessage(msgInfo) {
    var resultHeightStyle = '';
    if (msgInfo.length > 200) {
        resultHeightStyle = 'height:116px;';
    }
    var resultInfo = "<div style='" + resultHeightStyle + " overflow-y:auto; overflow-x:hidden; word-wrap:break-word;word-break:break-all;'>";
    resultInfo += msgInfo + "</div>";
    return resultInfo;
}
