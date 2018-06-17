/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />

var editStoreLine = {
    init: function () {
        $("#btnSave").click(function () {
            var formData = xsjs.SerializeDecodeURL2Json($(".xs-forminfo").find("input, textarea, select").serialize(), true);
            if (parseInt($("#oldLineId").val()) > 0 && parseInt($("#oldLineId").val()) != formData.LineID) {
                window.top.$.messager.confirm("温馨提示", "注：修改线路后，提货日期在修改时间之后的，都会按照最新的配送线路进行配送，是否继续修改？", function (data) {
                    if (data) {
                        editStoreLine.save();
                    }
                });
                return;
            }
            editStoreLine.save();
        });

    },
    //保存门店线路信息
    save: function () {

        var formData = xsjs.SerializeDecodeURL2Json($(".xs-forminfo").find("input, textarea, select").serialize(), true);
        formData.warehouseName = $("#ddlWarehouseID option:selected").text();
        if (!formData.storeId || formData.storeId.length == 0) {
            $.messager.alert("温馨提示", "门店信息获取异常！", "warning", function () {
            });
            return false;
        }
        if (!formData.warehouseId ||  parseInt(formData.warehouseId) <= 0) {
            $.messager.alert("温馨提示", "请选择配送仓库！", "warning", function () {
            });
            return false;
        }
        if (!formData.lineId || parseInt(formData.lineId) <= 0) {
            $.messager.alert("温馨提示", "请选择配送线路！", "warning", function () {
                $("input[name='lineId']").focus();
            });
            return false;
        }
        if (!formData.lineSort || parseInt(formData.lineSort) <= 0) {
            $.messager.alert("温馨提示", "请填写线路顺序！", "warning", function () {
                $("input[name='lineId']").focus();
            });
            return false;
        }

        //提交数据
        $.ajax({
            url: contextPath + "/storeProfile/updateStoreLine",
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
    editStoreLine.init();
    $("#ddlWarehouseID").change(function () {
        $.ajax({
            type: 'POST',
            url: contextPath + "/distributionLine/listDistributionLine",
            data: {"warehouseId":$("#ddlWarehouseID option:selected").val()},
            success: function (data) {
                var html = "";

                $.each(data.rows,function (i,item) {
                    html += "<option value="+item.id+">"+item.lineName+"</option>"
                })

                $("#ddlLineID").html(html);
            },

        })
    })
});

