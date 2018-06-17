$(function () {
    var operation = xsjs.SerializeURL2Json();
    if (operation!=null&& operation.operation == 1) {
        $("#btnReject").hide();
    }
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
function saveInfo(id, imgTextStatus, type) {

    if (type == 3) {
        var reasonInfo = $("#txtAuditReason").val();
        if (reasonInfo == "") {
            window.top.$.messager.alert("温馨提示", "驳回理由不能为空", "error");
            return;
        }
    }
    window.top.$.messager.confirm("提示", type == 2 ? "确定通过审核?" : "确定驳回审核?", function (isSave) {
        if (isSave) {
            var reason = $("#txtAuditReason").val();
            var formData = { imgtextId: id, isAudit: imgTextStatus, action: type, reason: reason };
            xsjs.ajax({
                url: contextPath+"/teletext/teletextAudit",
                data: formData,
                type: "POST",
                loadMsg: "正在保存数据，请稍候...",
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.Flag == "success" ? "info" : "error");

                    if (data.rspCode == "success") {
                        if (type == 3) {
                            window.frameElement.wapi.frameElement.wapi.pageList.loadList();
                            window.frameElement.wapi.xsjs.pageClose();
                        } else {
                            window.frameElement.wapi.pageList.loadList();
                        }
                        xsjs.pageClose();
                    }
                },
                error: function () {

                }
            });
        }
    })
}

//function showRejectInfo(teletextId, isAudit, evt) {
//    xsjs.stopPropagation(evt);
//    var url = "/Teletext/TeletextReject?teletextId=" + teletextId + "&isAudit=" + isAudit;

//    xsjs.window({
//        url: url,
//        title: "驳回图文直播",
//        modal: true,
//        width: 420,
//        minHeight: 250,
//        maxHeight: 360,
//        owdoc: window.top,
//        height:300

//    });
//}

function showRejectInfo(type) {

    var imgtextId =document.getElementById("imgtextId").value;

    window.top.$.messager.confirm("提示", "确定驳回审核?", function (isSave) {
        var detailsIds = "";
        if (isSave) {
            var str=$("input[type='checkbox']:checked");
            var objarray=str.length;

        }
        if(objarray == 0){
            window.top.$.messager.alert("温馨提示", "请选择需要驳回的图片.", "info");
        }
        for(var i = 0;i<objarray;i++){
            if(str[i].checked == true) {
                detailsIds +=str[i].value+",";
            }
        }
        detailsIds = detailsIds.substring(0, detailsIds.length - 1);
        /*for (var i = 0; i < list.length; i++) {
            if (detailsIds == "") {

                return;
            } else {
                detailsIds = detailsIds.substring(0, detailsIDs.length - 1);
            }*/

            var formData = { imgtextId: imgtextId, imgIds: detailsIds ,imgTextStatus:type};

            xsjs.ajax({
                url: contextPath+"/teletext/teletextAudit",
                data: formData,
                type: "POST",
                loadMsg: "正在保存数据，请稍候...",
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");

                    if (data.rspCode == "success") {
                        window.frameElement.wapi.pageList.loadList();
                        xsjs.pageClose();
                    }
                },
                error: function () {

                }
            });

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
    var html = $("<div style='position:fixed; z-index:999999; top:0px; bottom:0px; left:0px; width:100%;right:0px;background-color:#333;  opacity:0.4;' id='bgdiv_chy'></div><div style='position:fixed; z-index:1000000; top:10%; bottom:1rem; left:10%; width:80%; right:10%; bottom:10%; text-align:center'  id='kk_chy'><div style='width:100%; height:100%; position:relative'  ><img ></div></div>");
    window.top.$("body").append(html);
    html.find("img").load(function () {
        autoSize(this);
    }).attr("src", url).click(function () {
        window.top.$("#bgdiv_chy").remove();
        window.top.$("#kk_chy").remove();
    });
}

