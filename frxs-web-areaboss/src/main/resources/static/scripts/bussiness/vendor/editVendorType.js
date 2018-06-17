/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />

$(function () {
    $("#txtVendorTypeName").val(window.frameElement.apidata.vendorTypeName);

    //添加供应商分类
    $("#btnSave").click(function () {
        var vendorTypeNameVal = $.trim($("#txtVendorTypeName").val());
        if (vendorTypeNameVal.length == 0) {
            $.messager.alert("温馨提示", "请填写供应商分类名称！", "warning", function () {
                $("#txtVendorTypeName").focus();
            });
            return false;
        }
        else if (!xsjs.validator.IsCheckStr($.trim(vendorTypeNameVal))) {
            window.top.$.messager.alert("温馨提示", "供应商分类名称中不能输入特殊字符!", "warning", function () {
                $('#txtVendorTypeName').focus()
            });
            return false;
        }else if(!xsjs.validator.IsChn(vendorTypeNameVal)){
            $.messager.alert("温馨提示", "供应商分类名称只能是汉字！", "warning", function () {
                $('#txtVendorTypeName').focus()
            });
            return false;
        }

        xsjs.ajax({
            url: contextPath + "/vendorType/saveVendorType",
            loadMsg: "正在保存供应商分类，请稍候...",
            data: {
                vendorTypeName: vendorTypeNameVal,
                vendorTypeId: window.frameElement.apidata.vendorTypeId
            },
            success: function (data) {
                window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");

                if (data.rspCode == "success") {
                    window.frameElement.wapi.$("#ddlVendorTypeName").find("option[value='" + window.frameElement.apidata.vendorTypeId + "']").html(vendorTypeNameVal);
                    xsjs.pageClose();
                }
            },
            error: function () {
            }
        });
    });
});