/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />

var editStoreBank = {
    init: function () {
        $("#btnSave").click(function () {
            window.top.$.messager.confirm("温馨提示", "确定修改所选供应商银行账户信息？", function (data) {
                if (data) {
                    editStoreBank.save();
                }
            });
        });

    },
    //保存门店银行账户信息
    save: function () {

        var formData = xsjs.SerializeDecodeURL2Json($(".xs-forminfo").find("input, textarea, select").serialize(), true);

        if (!formData.vendorId || formData.vendorId.length == 0) {
            $.messager.alert("温馨提示", "门店信息获取异常！", "warning", function () {
            });
            return false;
        }

        if (!formData.bankAccountName || formData.bankAccountName.length == 0) {
            $.messager.alert("温馨提示", "请填写收款人帐户！", "warning", function () {
                $("input[name='bankAccountName']").focus();
            });
            return false;
        }

        if (formData.bankAccountName.length > 64) {
            $.messager.alert("温馨提示", "收款人帐户最大长度为32！", "warning", function () {
                $("input[name='bankAccountName']").focus();
            });
            return false;
        }


        if (!xsjs.validator.IsCheckStr2(formData.bankAccountName)) {
            $.messager.alert("温馨提示", "收款人帐户格式不正确，名称中包含特殊字符！", "warning", function () {
                $("input[name='bankAccountName']").focus();
            });
            return false;
        }

        if (!formData.bankNo || formData.bankNo.length == 0) {
            $.messager.alert("温馨提示", "请填写开户行行号！", "warning", function () {
                $("input[name='bankNo']").focus();
            });
            return false;
        }

        if (formData.bankNo.length > 32) {
            $.messager.alert("温馨提示", "开户行行号最大长度为32！", "warning", function () {
                $("input[name='bankNo']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2(formData.bankNo)) {
            $.messager.alert("温馨提示", "开户行行号格式不正确，名称中包含特殊字符！", "warning", function () {
                $("input[name='bankNo']").focus();
            });
            return false;
        }

        if (!formData.bankName || formData.bankName.length == 0) {
            $.messager.alert("温馨提示", "请填写开户银行！", "warning", function () {
                $("input[name='bankName']").focus();
            });
            return false;
        }

        if (formData.bankName.length > 64) {
            $.messager.alert("温馨提示", "开户银行最大长度为64！", "warning", function () {
                $("input[name='bankName']").focus();
            });
            return false;
        }


        if (!xsjs.validator.IsCheckStr2(formData.bankName)) {
            $.messager.alert("温馨提示", "开户银行格式不正确，名称中包含特殊字符！", "warning", function () {
                $("input[name='bankName']").focus();
            });
            return false;
        }



        if (!formData.bankAccountNo || formData.bankAccountNo.length == 0) {
            $.messager.alert("温馨提示", "请填写银行账号！", "warning", function () {
                $("input[name='bankAccountNo']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsNumber(formData.bankAccountNo)) {
            $.messager.alert("温馨提示", "银行帐号只能是数字！", "warning", function () {
                $("input[name='bankAccountNo']").focus();
            });
            return false;
        }

        if (formData.bankAccountNo.length > 25) {
            $.messager.alert("温馨提示", "银行帐号最大长度为25！", "warning", function () {
                $("input[name='bankAccountNo']").focus();
            });
            return false;
        }


        //提交数据
        $.ajax({
            url: contextPath + "/vendor/updateVendorBankInfo",
            data: formData,
            type: "POST",
            loadMsg: "正在提交数据，请稍候...",
            success: function (data) {
                window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");

                if (data.rspCode == "success") {
                    if (window.frameElement.wapi && window.frameElement.wapi.pageList) {
                        window.frameElement.wapi.pageList.loadList();
                    }
                    xsjs.pageClose();
                }
            },
            error: function () {
            }
        });
    },
}

$(function () {
    editStoreBank.init();
});

