$(function () {
    setTimeout(function () {
        //定义打印按键
        var btn = $('<input id="BtnPrint" type="button" title="点击按键可在线浏览和打印PDF文件" value="在线打印" style="position:fixed;right:80px;top:16px;color:blue;" />');
        var fileUrl = getUrl();
        if (fileUrl) {
            $(btn).on("click", function () {//PDF打印按键事件--打开新的在线预览窗口
                window.open("../../Scripts/plugin/pdfjs/web/Viewer.html?PdfUrl=" + fileUrl);
            });
            $('#form1').append(btn);
        }
    }, 300)//加载完异步数据后添加打印按键
});

/********************自定义的函数***********************/

//获取打印按键上绑定事件的PDF资源的URL值
function getUrl() {
    var targetUrl = $('input[name="print_pdf"]').attr("onclick");
    if (targetUrl) {
        targetUrl = targetUrl.replace("window.open('", "").replace("')", "");
    }
    return targetUrl;
}
