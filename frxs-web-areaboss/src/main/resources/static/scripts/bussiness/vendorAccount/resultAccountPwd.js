/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
$(function () {

    var params = xsjs.SerializeDecodeURL2Json();
    params.id = params.id == "0" ? "" : params.id;

    $("#btnSave").click(function () {
        //easyUI表单校验
        var isValidate = $(".xs-forminfo").form("validate");
        var fromData = xsjs.SerializeDecodeURL2Json($(".xs-form-main").find("*").serialize().replace(new RegExp("\\+", 'gi'), " "));
        if (isValidate) {

            if (fromData.Pwd.replace(" ", "").replace("　", "").length != fromData.Pwd.length) {
                window.top.$.messager.alert("温馨提示", "密码中不能包含空格", "info", function () {
                    $("#txtPassword1").focus();
                });
                return false;
            }

            if (fromData.Pwd != fromData.Password2) {
                window.top.$.messager.alert("温馨提示", "输入密码不一致", "info", function () {
                    $("#txtPassword1").focus();
                });
                return;
            }

            //if (!/^[0-9a-zA-Z]+$/.test(fromData.Password) || (/^[0-9]+$/.test(fromData.Password) || /^[a-zA-Z]+$/.test(fromData.Password))) {
            //    window.top.$.messager.alert("温馨提示", "请输入字母+数字6-12位的组合密码！", "info", function () {
            //        $("#txtPassword1").focus();
            //    });
            //    return;
            //}

            fromData.AccountID = params.id || "";

            xsjs.ajax({
                url: "/VendorAccount/saveResultAccountPwd",
                data: fromData,
                loadMsg: "正在重置密码，请稍候...",
                dataType: "json",
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.Info, data.Flag == "SUCCESS", function () {
                        if (data.Flag == "SUCCESS") {
                            xsjs.pageClose();
                        };
                    });
                },
                error: function () { }
            });
        }
    });
});