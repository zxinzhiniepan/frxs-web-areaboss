/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />

$(function () {
    if ($("#lblAudit").html().trim() != "<span>待审核</span>") {
        $("ul li:last-child").remove();
    }
    $("#btnDownloadImage").linkbutton({
        iconCls: "icon-download"
    }).click(function () {
        downloadImage();
    });
});

//查看大图
function addImageView(OriginalImgUrl) {
    var img = $("<img src='" + OriginalImgUrl + "' />");
    xsjs.window({
        title: "选择商品主图",
        modal: true,
        width: 900,
        minHeight: 300,
        maxHeight: 800,
        owdoc: window.top,
        content: img
    });
}
//审核驳回操作
function saveInfo(type) {
    var reasonInfo = $("#txtAuditReason").val().trim();
    var id = $("#vendorProductDataId").val();
    var special = /[`~!@#$%^&<>?{},;\'\"]/im;
    if (special.test(reasonInfo)) {
        window.top.$.messager.alert("温馨提示", "审核通过/驳回理由不能输入特殊字符", "error");
        return;
    }

    if (type == 'REJECT') {
        if (reasonInfo == "") {
            window.top.$.messager.alert("温馨提示", "驳回理由不能为空", "error");
            return;
        }
    }

    window.top.$.messager.confirm("提示", type == 'PASS' ? "确定通过审核?" : "确定驳回审核?",
        function (isSave) {
            if (isSave) {
                var reason = $("#txtAuditReason").val();
                var formData = {
                    vendorProductDataId: id,
                    auditStatus: type,
                    auditRession: reason
                };
                xsjs.ajax({
                    url: contextPath + "/vendor/vendorProductAudit",
                    data: formData,
                    type: "POST",
                    loadMsg: "正在保存数据，请稍候...",
                    success: function (data) {
                        window.top.$.messager.alert("温馨提示", data.rspDesc,
                            data.rspCode == "success" ? "info" : "error");

                        if (data.rspCode == "success") {
                            window.frameElement.wapi.pageList.loadList();
                            xsjs.pageClose();
                        }
                    },
                    error: function () {

                    }
                });
            }
        })
}

function autoSize(ImgD) {

    $(ImgD).css({
        "maxWidth": $(window.top).width() - 50,
        "maxHeight": $(window.top).height() - 50,
        "position": "absolute"
    });

    $(ImgD).css({
        "top": "50%",
        "left": "50%",
        "marginLeft": (-($(ImgD).width()) / 2) + "px",
        "marginTop": (-($(ImgD).height()) / 2) + "px"
    });

}

function pigshow(url) {
    var html = $(
        "<div style='position:fixed; z-index:999999; top:0px; bottom:0px; left:0px; width:100%;right:0px;background-color:#333;  opacity:0.4;' id='bgdiv_chy'></div><div style='position:fixed; z-index:1000000; top:10%; bottom:1rem; left:10%; width:80%; right:10%; bottom:10%; text-align:center'  id='kk_chy'><div style='width:100%; height:100%; position:relative'  ><img ></div></div>");
    window.top.$("body").append(html);
    html.find("img").load(function () {
        autoSize(this);
    }).attr("src", url).click(function () {
        window.top.$("#bgdiv_chy").remove();
        window.top.$("#kk_chy").remove();
    });
}

var imageZipSrc = "";

///下载图片
function downloadImage() {
    var urls = "";
    $("#ProductMainImage img").each(function () {
        urls += "," + $(this).attr("imageUrlOrg");
    });

    if (urls.length > 0) {
        urls = urls.substr(1, urls.length - 1);
    }
    else {
        $.messager.alert("温馨提示", "无图片可下载", "warning");
        return "";
    }
    var fileName = encodeURI($("#lblProductName").html());
    $('#downloadImgForm').form('submit', {
        url: contextPath + "/vendor/downloadImage",
        onSubmit: function (param) {
            param.urls = urls;
            param.fileName = fileName;
        }
    });

}