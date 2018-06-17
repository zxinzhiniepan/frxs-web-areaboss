/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />

$(function () {
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
            window.top.$.messager.alert("", "供应商分类名称中不能输入特殊字符！", "warning", function () {
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
            url: contextPath+"/vendorType/saveVendorType",
            loadMsg: "正在添加供应商分类",
            data: {
                vendorTypeName: vendorTypeNameVal
            },
            success: function (data) {
                window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");

                if (data.rspCode == "success") {
                    location.reload();
                }
            },
            error: function () {
            }
        });
    });

    ///删除供应商分类
    $("#btnDelete").click(function () {

        var selectVendorType = $("#ddlVendorTypeName option:checked");
        if (selectVendorType.length == 0) {
            $.messager.alert("温馨提示", "请选择要删除的供应商分类！", "warning");
            return;
        }

        var listVendorType = "isdelete=1";
        selectVendorType.each(function () {
            listVendorType += "&vendorTypeId=" + $(this).val();
        });

        xsjs.ajax({
            url: contextPath + "/vendorType/vendorTypeDelete",
            data: listVendorType,
            loadMsg: "正在删除的供应商分类，请稍候...",
            success: function (data) {
                window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");

                if (data.rspCode == "success") {
                    $("#ddlVendorTypeName option:checked").remove();
                }
            },
            error: function () {
            }
        });
    });

    $("#ddlVendorTypeName").dblclick(function () {
        xsjs.window({
            url: contextPath+"/vendorType/editVendorType?vendorTypeName=" + decodeURIComponent($(this).find("option:checked").html()),
            title: "编辑供应商分类",
            height: 360,
            width: 500,
            apidata: {
                vendorTypeId: $(this).find("option:checked").val(),
                vendorTypeName: $(this).find("option:checked").html(),
            },
            modal: true,
            owdoc: window.top
        });
        return false;
    });
});