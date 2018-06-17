/// <reference path="../../plugin/My97DatePicker/WdatePicker.js" />


var editDynamicPrompt = {
    save: function () {
        var isValidate = $("#editForm").form("validate");
        var formData = xsjs.SerializeDecodeURL2Json($("#editForm").find("input, textarea, select").serialize(), true);
        //console.log(JSON.stringify(formData))
        if (isValidate) {
            if (!xsjs.validator.IsChinaOrNumbOr_Lett(formData.dynamicPromptName)) {
                window.top.$.messager.alert("温馨提示", "活动提示名称格式不正确!", "warning", function () { presaleActivityName.focus() });
                return;
            }
            if (!xsjs.validator.IsChinaOrNumbOr_Lett(formData.content)) {
                window.top.$.messager.alert("温馨提示", "活动提示内容格式不正确!", "warning", function () { presaleActivityName.focus() });
                return;
            }
            if ($.trim(formData.tmDisplayStart).length == 0) {
                window.top.$.messager.alert("温馨提示", "请填写展示时间", "warning");
                return;
            }
            if ($.trim(formData.tmDisplayEnd).length == 0) {
                window.top.$.messager.alert("温馨提示", "请填写展示时间", "warning");
                return;
            }
            $.ajax({
                url: contextPath+"/setActivityDynamicPrompt/saveDynamicPrompt",
                data: formData,
                type: "POST",
                dataType:"json",
                loadMsg: "正在保存数据，请稍候...",
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "rspDesc" : "error", function () {
                        if (data.rspCode == "success") {
                            if (window.frameElement.wapi && window.frameElement.wapi.pageList) {
                                window.frameElement.wapi.pageList.loadList();
                            }
                            xsjs.pageClose();
                        }
                    });
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("错了")
                   // alert(XMLHttpRequest.status);
                   // alert(XMLHttpRequest.readyState);
                   // alert(textStatus);
                }
            });
        }
    }
}
$(function () {
    ///有效期开始时间
    $("#tmDisplayStart").focus(function () {
        var time1 = new Date();
        WdatePicker({
            dateFmt: 'yyyy-MM-dd HH:mm',
            maxDate: '#F{$dp.$D(\\\'tmDisplayEnd\\\')}',
            minDate: '%y-%M-{%d}'
        });
    });

    //有效期截止时间
    $("#tmDisplayEnd").focus(function () {
        WdatePicker({
            dateFmt: 'yyyy-MM-dd HH:mm',
            minDate: $.trim($("#tmDisplayStart").val()).length > 0 ? '#F{$dp.$D(\\\'tmDisplayStart\\\')}' : '%y-%M-{%d}'
        });
    });

    $("#btnSave").click(function () {
        editDynamicPrompt.save();
    });
});