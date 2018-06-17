/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var listStore = [];
var uploadStoreList = {
    storeList: listStore,
    params: null,
    init: function () {
        this.params = xsjs.SerializeURL2Json();
        if (window.frameElement && $(window.frameElement)) {
            var frameData = $(window.frameElement).data();
            if (frameData && frameData.easyuiWindow && frameData.easyuiWindow == true) {
                $("#divBottomButton").addClass("xs-form-bottom").removeClass("divBottomButton");
                $("#divBottom").addClass("xs-form-bottom-right");//.removeClass("xs-form-bottom-left");
                $(window).trigger("resize");
            }
        }

        this.loadProduct();
    },
    del: function (index, evt) {
        xsjs.stopPropagation(evt);
    },
    addRowIndex: 99999001,
    AddNewRow: function () {
        $('#divStore').datagrid('insertRow', {
            index: 0,  // 索引从0开始
            row: {
                storeId: uploadStoreList.addRowIndex,
                storeNo: '',
                storeName: '',
                contacts: '',
                userName: '',
                contactsTel: '',
                lineId: '0',
                lineSort: '',
                storeDeveloper: '',
                weChatGroupName: '',
                shopArea: '',
                busiLicenseFullName: '',
                foodCirculationLicense:'',
                region: '0',
                detailAddress: '',
                bankAccountName: '',
                bankNo: '',
                bankName: '',
                bankAccountNo: '',
                unionPayCID:'',
                unionPayMID:'',
                withdrawalsMode: '2'
            }
        });
        uploadStoreList.addRowIndex = uploadStoreList.addRowIndex + 1;
    },
    //保存数据
    save: function () {
        var row = $('#divStore').datagrid('getSelected');
        var rowIndex = $('#divStore').datagrid('getRowIndex', row);
        $('#divStore').datagrid('endEdit', rowIndex);
        var rows = $('#divStore').datagrid("getRows");
        uploadStoreList.storeList = rows;
        if (uploadStoreList.storeList == null || uploadStoreList.storeList.length == 0) {
            window.top.$.messager.alert("温馨提示", "请添加需要新增的门店信息!", "warning");
            return;
        }
        else {
            for (var pi = 0; pi < uploadStoreList.storeList.length; pi++) {
                var itemStore = uploadStoreList.storeList[pi];

                var rowIndex = $('#divStore').datagrid('getRowIndex', itemStore);

                if (!itemStore.storeCode || itemStore.storeCode == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex+1) + "行," + "门店编号为空!", "warning");
                    return;
                }

                if (!xsjs.validator.IsNumber(itemStore.storeCode)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店编号应该为8位以内的数字！!", "warning");
                    return false;
                }

                if (itemStore.storeCode.length>8) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "门店编号最大长度不能超过8!", "warning");
                    return;
                }

                if (!itemStore.storeName || itemStore.storeName == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店名称为空!", "warning");
                    return;
                }

                if (itemStore.storeName.length > 30) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "门店名称最大长度不能超过30!", "warning");
                    return;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.storeName)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店名称中包含特殊字符!", "warning");
                    return false;
                }

                if (!itemStore.contacts || itemStore.contacts == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的联系人为空!", "warning");
                    return;
                }

                if (itemStore.contacts.length < 2) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "联系人长度不能少于2位!", "warning");
                    return;
                }

                if (!xsjs.validator.IsChn(itemStore.contacts)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的联系人应该用中文填写!", "warning");
                    return false;
                }

                if (itemStore.contacts.length > 10) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "联系人最大长度不能超过10位!", "warning");
                    return;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.contacts)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的联系人中包含特殊字符!", "warning");
                    return false;
                }

                if (!itemStore.userName || itemStore.userName == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店账号为空!", "warning");
                    return;
                }


                if (!xsjs.validator.mobile(itemStore.userName)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店账号格式不正确!", "warning");
                    return;
                }

                if (!itemStore.contactsTel || itemStore.contactsTel == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的联系电话为空!", "warning");
                    return;
                }

                if (!xsjs.validator.phone(itemStore.contactsTel)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的客服电话格式不正确!", "warning");
                    return;
                }

                if (!itemStore.wechatGroupName || itemStore.wechatGroupName == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店微信群名称为空!", "warning");
                    return;
                }

                if (itemStore.wechatGroupName.length>32) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店微信群名称长度不能超过32!", "warning");
                    return;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.wechatGroupName)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店微信群名称中包含特殊字符!", "warning");
                    return false;
                }

                if (!itemStore.shopArea || itemStore.shopArea == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的营业面积为空!", "warning");
                    return;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.shopArea)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的营业面积中包含特殊字符!", "warning");
                    return false;
                }

                if (!itemStore.busiLicenseFullName || itemStore.busiLicenseFullName == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的营业执照为空!", "warning");
                    return;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.busiLicenseFullName)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的营业执照中包含特殊字符!", "warning");
                    return false;
                }

                if (itemStore.busiLicenseFullName.length>30) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的营业执照长度不能超过30!", "warning");
                    return false;
                }

                if (itemStore.storeDeveloper && itemStore.storeDeveloper != "" && itemStore.storeDeveloper.length>10) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店开发人员长度不能超过10!", "warning");
                    return;
                }

                if (itemStore.storeDeveloper && itemStore.storeDeveloper != "" && !xsjs.validator.IsCheckStr2(itemStore.storeDeveloper)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店开发人员中包含特殊字符!", "warning");
                    return false;
                }

                if (!itemStore.foodCirculationLicense || itemStore.foodCirculationLicense == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的食品流通许可证为空!", "warning");
                    return;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.foodCirculationLicense)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的食品流通许可证中包含特殊字符!", "warning");
                    return false;
                }

                if (itemStore.foodCirculationLicense.length>30) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的食品流通许可证长度不能超过30!", "warning");
                    return false;
                }

                if (!itemStore.detailAddress || itemStore.detailAddress == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店地址为空!", "warning");
                    return;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.detailAddress)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店地址中包含特殊字符!", "warning");
                    return false;
                }

                if (itemStore.detailAddress.length>30) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的门店地址长度不能超过30!", "warning");
                    return false;
                }

                if (!itemStore.province || itemStore.province == "" || itemStore.province == "-1") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的省为空!", "warning");
                    return;
                }

                if (!itemStore.city || itemStore.city == "" || itemStore.city == "-1") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的市为空", "warning");
                    return;
                }
                if (!itemStore.county || itemStore.county == "" || itemStore.county == "-1") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的区/县为空!", "warning");
                    return;
                }

                if (!itemStore.bankNo || itemStore.bankNo == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的行号为空!", "warning");
                    return;
                }

                if (!xsjs.validator.IsNumber(itemStore.bankNo)) {
                    $.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的行号只能是数字！", "warning");
                    return false;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.bankNo)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的行号中包含特殊字符!", "warning");
                    return false;
                }

                if (itemStore.bankNo.length>16) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的行号长度不能超过16!", "warning");
                    return false;
                }

                if (!itemStore.bankName || itemStore.bankName == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的开户行为空!", "warning");
                    return;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.bankName)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的开户行包含特殊字符!", "warning");
                    return false;
                }

                if (itemStore.bankName.length>30) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的开户行长度不能超过30!", "warning");
                    return false;
                }

                if (!itemStore.bankAccountName || itemStore.bankAccountName == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的账户名为空!", "warning");
                    return;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.bankAccountName)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的账户名包含特殊字符!", "warning");
                    return false;
                }

                if (itemStore.bankAccountName.length>30) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的账户名长度不能超过30!", "warning");
                    return false;
                }

                if (!itemStore.bankAccountNo || itemStore.bankAccountNo == "") {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的银行帐号为空!", "warning");
                    return;
                }

                if (!xsjs.validator.IsNumber(itemStore.bankAccountNo)) {
                    $.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的银行帐号只能是数字！", "warning");
                    return false;
                }

                if (!xsjs.validator.IsCheckStr2(itemStore.bankAccountNo)) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的银行帐号中包含特殊字符!", "warning");
                    return false;
                }

                if (itemStore.bankAccountNo.length>19) {
                    window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的银行账号长度不能超过19!", "warning");
                    return false;
                }

                if (itemStore.unionPayCID && itemStore.unionPayCID != "" && itemStore.unionPayCID != null) {

                    if (!xsjs.validator.IsNumber(itemStore.unionPayCID)) {
                        $.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的企业用户号只能是数字！", "warning");
                        return false;
                    }

                    if (!xsjs.validator.IsCheckStr2(itemStore.unionPayCID)) {
                        window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的企业用户号中包含特殊字符!", "warning");
                        return false;
                    }

                    if (itemStore.unionPayCID.length>19) {
                        window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的企业用户号长度不能超过19!", "warning");
                        return false;
                    }
                }

                if (itemStore.unionPayMID && itemStore.unionPayMID != "" && itemStore.unionPayMID != null) {

                    if (!xsjs.validator.IsNumber(itemStore.unionPayMID)) {
                        $.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的银联商户号只能是数字！", "warning");
                        return false;
                    }

                    if (!xsjs.validator.IsCheckStr2(itemStore.unionPayMID)) {
                        window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的银联商户号中包含特殊字符!", "warning");
                        return false;
                    }

                    if (itemStore.unionPayMID.length>19) {
                        window.top.$.messager.alert("温馨提示", "第" + (rowIndex + 1) + "行," + "【" + itemStore.storeCode + "】的银联商户号长度不能超过19!", "warning");
                        return false;
                    }
                }

            }
        }
        saveData = JSON.stringify(this.storeList);
        $.ajax({
            url: contextPath +"/storeProfile/saveUploadStoreProfileList",
            data: { storeList: saveData },
            loadMsg: "正在保存门店信息，请稍候...",
            success: function (data) {
                window.top.$.messager.alert("温馨提示", data.rspDesc, (data.rspCode == "success" ? "info" : "error"), function () {
                    if (data.rspCode == "success") {
                        if (window.frameElement.wapi) {
                            window.frameElement.wapi.pageList.loadList();
                        }
                        xsjs.pageClose();
                    }
                });
            },
            error: function () {

            }
        });
    },
    storeEditListIndex: -1,
    //重新加载商品
    loadProduct: function () {
        if (uploadStoreList.storeEditListIndex >= 0) {
            $('#divStore').datagrid('endEdit', uploadStoreList.storeEditListIndex);
            uploadStoreList.storeEditListIndex = -1;
        }
        LoadGrid();
        $("#divStore").datagrid('loadData', this.storeList);
    },
    //移除门店
    removeStore: function (storeId, evt) {
        var row = $('#divStore').datagrid('getSelected');
        var rowIndex = $('#divStore').datagrid('getRowIndex', row);
        $('#divStore').datagrid('endEdit', rowIndex);
        var rows = $('#divStore').datagrid("getRows");
        this.storeList = rows;
        if (evt) {
            xsjs.stopPropagation(evt);
        }

/*        var removeStore = $.grep(this.storeList, function (item, index) {
            return item.storeId == storeId;
        });*/

        for (var i = 0; i < this.storeList.length; i++) {
            if (this.storeList[i].storeId == storeId) {
                this.storeList.splice(i, 1);
                break;
            }
        }
        this.loadProduct();
        $.messager.alert("温馨提示", "移除成功！", "info");
    },

    downLoadExportTemplate: function () {
        $.ajax({
            type: 'GET',
            url: "/storeProfile/downLoadExportTemplate",
            loadMsg: "正在下载模板信息，请稍候...",
            success: function (data) {
            },
            error: function () {
            }
        });
    },
};

$(function () {

    GetLineData();
    //GetWithdrawalsData();
    $("#btnUpLoad").click(function () {
        if ($("#file1").val().length > 0) {
            ajaxFileUpload();
        }
        else {
            $.messager.alert("温馨提示", "请选择上传文件！", "info");
        }
    });

    uploadStoreList.init();

    $("#btnSave").click(function () {
        uploadStoreList.save();
    });

    $("#btnExportTemplate").click(function () {
        uploadStoreList.downLoadExportTemplate();
    });
});

var comboboxLineData = "";
function GetLineData() {
    $.ajax({
        url: contextPath +"/storeProfile/distributionLine/getPageList",
        type: 'post',
        async: false,//此处必须是同步
        dataTye: 'json',
        success: function (data) {

            comboboxLineData = data;
        }
    })
    return comboboxLineData;
}

var comboboxWithdrawalsData = "";
function GetWithdrawalsData() {
    $.ajax({
        url: contextPath +"/storeProfile/getWithdrawalsData",
        type: 'post',
        async: false,//此处必须是同步
        dataTye: 'json',
        success: function (data) {
            comboboxWithdrawalsData = data;
        }
    })
    return comboboxWithdrawalsData;
}


function isAllowFileType(filepath) {
    var extStart = filepath.lastIndexOf(".");
    var ext = filepath.substring(extStart, filepath.length).toUpperCase();
    if (ext != ".XLS" && ext != ".XLSX") {
        $.messager.alert("温馨提示", "上传文件类型不正确，请上传xls或xlsx类型文件！", "info");
        return false;
    }
    return true;
}


function ajaxFileUpload() {
    var fileName = $("#file1").val();
    if (!isAllowFileType(fileName)) {
        return false;
    }

    var bg=$("<div style='position: absolute; background-color: #000000; opacity: 0.3; z-index: 21;width: 100%;height:100%;top:0px;left:0px'></div>").appendTo("body");
    var loadingMsg = $("<div style='position: absolute; background-color: #ffffff; display: inline; border-radius: 5px; padding: 8px 10px;width: 120px;height: 20px;left: 50%;top:50%; z-index: 22;text-align: center'>" + ("拼命加载中，请稍候...") + "</div>").appendTo("body");

    $.ajaxFileUpload({
        url: contextPath +'/storeProfile/loadUpLoadStore', //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'file1', //文件上传域的ID
        dataType: 'content', //返回值类型 一般设置为json/content
        success: function (data) {
            $(bg).remove();
            $(loadingMsg).remove();
            var objData = $.parseJSON(data.replace(/<.*?>/ig,""));
            //var objData = eval("(" + data + ")");
            if (objData.rspCode == "success") {
                $("#divStore").datagrid('endEdit', -1);
                //uploadStoreList.storeList = $('#divStore').datagrid("getRows");
                uploadStoreList.storeList = [];
                LoadGrid();
                if (objData.record.length > 0) {
                    for (var i = 0; i < objData.record.length; i++) {
                        objData.record[i].storeId = i;
                        uploadStoreList.storeList.push(objData.record[i]);
                    }
                }
                $("#divStore").datagrid('loadData', uploadStoreList.storeList);
                var rows = $('#divStore').datagrid("getRows");
                uploadStoreList.storeList = rows;
                $("#file1").val("");
                $.messager.alert("温馨提示", "操作成功！", "info");
            } else {
                $("#file1").val("");
                $("#divStore").datagrid('loadData', []);
                if(objData.record == null || objData.record.length == 0){
                    $.messager.alert("温馨提示", "文件未解密或模板不正确", "error");
                }else {
                    $.messager.alert("温馨提示", "excel第"+objData.record+"行数据异常", "error");
                }
            }
        },
        error: function (data, status, e)//服务器响应失败处理函数
        {
            $(bg).remove();
            $(loadingMsg).remove();
            $.messager.alert("温馨提示", "上传失败，网络错误", "error");
        }
    });
}


var editIndex = -1;
function LoadGrid() {
    $("#divStore").datagrid({
        striped: true,
        loadMsg: "Loading",
        rownumbers: true,
        idField: "storeId",
        checkOnSelect: false,
        selectOnCheck: false,
        singleSelect: true,
        columns: [[
            { field: 'storeId', title: '门店主键编号', width: 100, align: 'center', hidden: 'true' },
            { field: 'storeCode', title: '门店编号', width: 80, align: 'center' },
            { field: 'storeName', title: '门店名称', width: 150 },
            { field: 'contacts', title: '联系人', width: 80, align: 'center' },
            { field: 'userName', title: '门店账号', width: 80 },
            { field: 'contactsTel', title: '客服电话', width: 80, align: 'center', },
/*            {
                field: 'lineId', title: '配送线路', width: 100,
                formatter: function (value, row) {
                    for (var i = 0; i < comboboxLineData.length; i++) {
                        if (comboboxLineData[i].lineId == value) {
                            return comboboxLineData[i].lineName;
                        }
                    }
                    return "";
                },
                //editor: {
                //    type: 'combobox',
                //    options: {
                //        url: "/StoreProfile/GetAllLineList",
                //        valueField: "LineID",
                //        textField: "LineName",
                //        editable: false,
                //        panelHeight: 70,
                //        required: true
                //    }
                //}
            },*/
            /*{ field: 'lineSort', title: '配送顺序', width: 55, align: 'center' },*/
            { field: 'storeDeveloper', title: '门店开发人员', width: 100, align: 'center'},
            { field: 'wechatGroupName', title: '门店微信群名称', width: 100, align: 'center' },
            { field: 'shopArea', title: '营业面积', width: 55,  align: 'center' },
            { field: 'busiLicenseFullName', title: '营业执照', width: 100,  align: 'center' },
            { field: 'foodCirculationLicense', title: '食品流通许可证', width: 100,  align: 'center' },
            {
                field: 'region', title: '省市县', width: 600, align: 'center', formatter: function (value, rows) {
                    //获取省市县的数据对像
                    // var getRegion = xsjs.getRegion(value);
                    var getRegion = rows.province+rows.city+rows.county;
                    //获取省市县全称
                    // return getRegion ? getRegion.AreaFullName : "";
                    return getRegion ? getRegion : "";
                }
            },
            { field: 'detailAddress', title: '门店地址', width: 150,  align: 'center' },
            { field: 'bankAccountName', title: '账户名', width: 120, align: 'center' },
            { field: 'bankNo', title: '行号', width: 120,  align: 'center' },
            { field: 'bankName', title: '开户行', width: 120, align: 'center' },
            { field: 'bankAccountNo', title: '银行账号', width: 120,  align: 'center' },
            { field: 'unionPayCID', title: '企业用户号', width: 120, align: 'center' },
            { field: 'unionPayMID', title: '银联商户号', width: 120,  align: 'center' },
            /*{ field: 'withdrawalsMode', title: '提成支付方式', width: 120, align: 'center', hidden: 'true' },*/
            //{
            //    field: 'WithdrawalsMode', title: '提成支付方式', width: 120,
            //    formatter: function (value, row) {
            //        for (var i = 0; i < comboboxWithdrawalsData.length; i++) {
            //            if (comboboxWithdrawalsData[i].WithdrawalsMode == value) {
            //                return comboboxWithdrawalsData[i].WithdrawalsModeName;
            //            }
            //        }
            //        return "";
            //    },
            //    editor: {
            //        type: 'combobox',
            //        options: {
            //            url: "/StoreProfile/GetWithdrawalsData",
            //            valueField: "WithdrawalsMode",
            //            textField: "WithdrawalsModeName",
            //            editable: false,
            //            panelHeight: 70,
            //            required: true
            //        }
            //    }
            //},
            {
                field: 'datagrid-action', title: '操作', formatter: function (value, rowData, index) {
                    var del = "";
                    del = '<a href="javascript:void(0);" onclick="uploadStoreList.removeStore(' + rowData.storeId + ', event)">移除</a>';
                    return del;
                }
            }
        ]],
        toolbar: [{
            //    text: '添加', iconCls: 'icon-add', handler: function () {
            //        if (editIndex != undefined) {
            //            $("#divStore").datagrid('endEdit', editIndex);
            //            editIndex = -1;
            //        }
            //        if (editIndex == -1) {
            //            uploadStoreList.AddNewRow();
            //        }
            //    }
            //}, '-', {
            text: '删除', iconCls: 'icon-remove', handler: function () {
                var row = $("#divStore").datagrid('getSelections');
                if (row.length <= 0) {
                    $.messager.alert("温馨提示", "请选择删除记录！", "info");
                    return;
                }
                for (var i = 0;i<row.length;i++){
                    uploadStoreList.removeStore(row[i].storeId, event);
                }

            }
        }],
        onClickRow: function (rowIndex) {
            if (editIndex != rowIndex) {
                $('#divStore').datagrid('endEdit', editIndex);
                $('#divStore').datagrid('beginEdit', rowIndex);
            }
            editIndex = rowIndex;
        },
/*        onAfterEdit: function (index, row, changes) {
            var objRegion = xsjs.getAllRegion(row.region);
            row.provinceId = objRegion.Province.AreaID || 0;
            row.cityId = objRegion.City.AreaID || 0;
            row.countyId = objRegion.County.AreaID || 0;
            var thisRegion = xsjs.getRegion(row.region);
            if (thisRegion) {
                row.regionName = thisRegion.AreaFullName;
            }
        },*/
        onBeforeEdit: function (index, row) {

        }
    });
}

