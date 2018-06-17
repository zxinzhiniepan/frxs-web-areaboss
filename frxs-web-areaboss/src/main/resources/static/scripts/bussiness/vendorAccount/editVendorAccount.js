/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
$(function () {

    var params = xsjs.SerializeDecodeURL2Json();
    params.id = params.id == "0" ? "" : params.id;

    ///选择供应商
    $("#btnSelectVendor").click(function () {
        var _dialog = xsjs.window({
            owdoc: window.top,
            url: "/vendorAccount/selectVendor",
            width: 839,
            title: "选择供应商",
            dialog: true,
            modal: true,
            apidata: {
                VendorID: $("#hidVendorID").val(),
                callback: function (rows) {
                    $("#hidVendorID").val(rows.VendorID);
                    $("#txtVendorName").val(rows.VendorName);
                }
            }
        });
    });

    $("#btnSave").click(function () {
        //easyUI表单校验
        var isValidate = $(".xs-forminfo").form("validate");
        var fromData = xsjs.SerializeDecodeURL2Json($(".xs-form-main").find("*").serialize().replace(new RegExp("\\+", 'gi'), " "));
        if (isValidate) {

            if (fromData.VendorID == 0) {
                window.top.$.messager.alert("温馨提示", "请选择所属供应商", "info");
                return;
            }

            if (xsjs.validator.mobile(fromData.AccountNo)) {
                window.top.$.messager.alert("温馨提示", "帐号不能是手机号码", "info");
                return;
            }

            if (fromData.Password.indexOf(" ") != -1)
            {
                window.top.$.messager.alert("温馨提示", "输入密码中不能有空格", "info", function () {
                    $("#txtPassword1").focus();
                });
                return;
            }

            if (fromData.Password2.indexOf(" ") != -1) {
                window.top.$.messager.alert("温馨提示", "输入密码中不能有空格", "info", function () {
                    $("#txtPassword2").focus();
                });
                return;
            }

            if (fromData.Password != fromData.Password2) {
                window.top.$.messager.alert("温馨提示", "输入密码不一致", "info", function () {
                    $("#txtPassword1").focus();
                });
                return;
            }

            //if (fromData.Password.length > 0 && (!/^[0-9a-zA-Z]+$/.test(fromData.Password) || (/^[0-9]+$/.test(fromData.Password) || /^[a-zA-Z]+$/.test(fromData.Password)))) {
            //    window.top.$.messager.alert("温馨提示", "请输入字母+数字6-12位的组合密码！", "info", function () {
            //        $("#txtPassword1").focus();
            //    });
            //    return;
            //}

            fromData.AccountID = params.id || "";

            xsjs.ajax({
                url: "/VendorAccount/SaveAccount",
                data: fromData,
                loadMsg: "正在保存数据，请稍候...",
                dataType: "json",
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.Info, data.Flag == "SUCCESS", function () {
                        if (data.Flag == "SUCCESS") {
                            xsjs.pageClose();
                        };
                    });
                    if (data.Flag == "SUCCESS") {
                        window.frameElement.wapi.pageList.grid.reload();
                    }
                },
                error: function () { }
            });
        }
    });
});