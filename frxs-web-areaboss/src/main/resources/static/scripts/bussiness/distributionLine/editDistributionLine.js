/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />

var editShop = {
    pageParam: null,
    init: function () {
        this.pageParam = xsjs.SerializeURL2Json();

        //if (this.pageParam && this.pageParam.id > 0) {
        //    $(".xs-form-bottom-left").removeClass("xs-form-bottom-left").addClass("xs-form-bottom-right");
        //}

        $("#btnSave").click(function () {
            editShop.save();
        });
    },
    //保存门店信息
    save: function () {

        //easyUI表单校验
        var isValidate = $(".xs-forminfo").form("validate");

        if (isValidate) {

            var formData = xsjs.SerializeDecodeURL2Json($(".xs-forminfo").find("input, textarea, select").serialize(), true);
            formData.warehouseName = $("#ddlWarehouseID option:selected").text();
            if ($.trim(formData.lineName).length == 0) {
                window.top.$.messager.alert("温馨提示", "请填写配送线路名称", "warning");
                return;
            }
            if ($.trim(formData.warehouseId).length == 0) {
                window.top.$.messager.alert("温馨提示", "请选择配送仓库", "warning");
                return;
            }

            formData.id = (this.pageParam ? this.pageParam.id : 0);
            console.log(formData);
            //提交数据
            $.ajax({
                url: contextPath+"/distributionLine/saveDistributionLine",
                data: formData,
                type: "POST",
                loadMsg: "正在提交数据，请稍候...",
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "rspDesc" : "error");

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
        }
    }
}

$(function () {
    editShop.init();
});