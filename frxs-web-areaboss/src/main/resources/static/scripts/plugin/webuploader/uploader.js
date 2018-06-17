function alert(msg) {
    window.top.$.messager.alert("提示", msg, "info");
}

function show(msg) {
    window.top.$.messager.show({
        title: '提示',
        msg: msg,
        timeout: 1000,
        showType: 'slide'
    });
}

$(function () {

    //初始化绑定默认的属性
    $.upLoadDefaults = $.upLoadDefaults || {};
    $.upLoadDefaults.property = {
        multiple: false, //是否多文件
        water: false, //是否加水印
        thumbnail: false, //是否生成缩略图
        sendurl: null, //发送地址

        filetypes: "jpg", //文件类型
        mimetypes: ".jpg",
        filesize: "2048", //文件大小
        btntext: "浏览...", //上传按钮的文字
        swf: null, //SWF上传控件相对地址
        savemethod: null,
        filenumlimit: "100"
    };
    //初始化上传控件
    $.fn.InitUploader = function (b) {

        var fun = function (parentObj) {
            var p = $.extend({}, $.upLoadDefaults.property, b || {});
            var btnObj = $('<div class="upload-btn">' + p.btntext + '</div>').appendTo(parentObj);
            //初始化属性
            p.sendurl += "?action=UpLoadFile";
            if (p.water) {
                p.sendurl += "&IsWater=1";
            }
            if (p.savemethod) {
                p.sendurl += "&savemethod=" + p.savemethod;
            }
            if (p.thumbnail) {
                p.sendurl += "&IsThumbnail=1";
            }
            if (p.fileDir) {
                p.sendurl += "&fileDirEnum="+p.fileDir;
            }
            if (!p.multiple) {
                p.sendurl += "&DelFilePath=" + parentObj.siblings(".upload-path").val();
            }

            //初始化WebUploader
            var uploader = WebUploader.create({
                auto: true, //自动上传
                swf: p.swf, //SWF路径
                server: p.sendurl, //上传地址
                pick: {
                    id: btnObj,
                    multiple: p.multiple
                },
                accept: {
                    title: 'Images',
                    extensions: p.filetypes,
                    mimeTypes: p.mimetypes
                },
                formData: {
                    'DelFilePath': '' //定义参数
                },
                fileNumLimit: p.filenumlimit,
                fileVal: 'Filedata', //上传域的名称
                fileSingleSizeLimit: p.filesize * 1024 //文件大小
            });



            //当validate不通过时，会以派送错误事件的形式通知
            uploader.on('error', function (type) {
                switch (type) {
                    case 'Q_EXCEED_NUM_LIMIT':
                        show("错误：上传文件数量过多！");
                        break;
                    case 'Q_TYPE_DENIED':
                        show("错误：禁止上传该类型文件！");
                        break;
                    case 'Q_EXCEED_SIZE_LIMIT':
                        show("错误：文件总大小超出限制！");
                        break;
                    case 'F_EXCEED_SIZE':
                        show("错误：文件大小超出限制！");
                        break;
                    case 'F_DUPLICATE':
                        show("错误：请勿重复上传该文件！");
                        break;
                    default:
                        show('错误代码：' + type);
                        break;
                }
            });





            //当有文件添加进来的时候
            uploader.on('fileQueued', function (file) {
                //如果是单文件上传，把旧的文件地址传过去
                if (!p.multiple) {
                    uploader.options.formData.DelFilePath = parentObj.siblings(".upload-path").val();
                }
                //防止重复创建
                if (parentObj.children(".upload-progress").length == 0) {
                    //创建进度条
                    var fileProgressObj = $('<div class="upload-progress"></div>').appendTo(parentObj);
                    var progressText = $('<span class="txt">正在上传，请稍候...</span>').appendTo(fileProgressObj);
                    var progressBar = $('<span class="bar"><b></b></span>').appendTo(fileProgressObj);
                    var progressCancel = $('<a class="close" title="取消上传">关闭</a>').appendTo(fileProgressObj);
                    //绑定点击事件
                    progressCancel.click(function () {
                        uploader.cancelFile(file);
                        fileProgressObj.remove();
                    });
                }
            });

            //文件上传过程中创建进度条实时显示
            uploader.on('uploadProgress', function (file, percentage) {
                var progressObj = parentObj.children(".upload-progress");
                progressObj.children(".txt").html(file.name);
                progressObj.find(".bar b").width(percentage * 100 + "%");
            });

            //当文件上传出错时触发
            uploader.on('uploadError', function (file, reason) {
                uploader.removeFile(file); //从队列中移除
                if(reason=="abort"){
                    window.top.$.messager.alert("温馨提示", "您没有登录或是您的登录信息已被清除！", "error", function () {
                        window.top.location.href =  "/";
                    });
                }else{
                    show(file.name + "上传失败");
                    //alert(file.name + "上传失败，错误代码：" + reason);
                }
            });

            //当文件上传成功时触发
            uploader.on('uploadSuccess', function (file, data) {
                if (data) {
                    for (var i in data) {
                        if (data[i].status == 'failed') {
                            var progressObj = parentObj.children(".upload-progress");
                            progressObj.children(".txt").html(data[i].msg);
                            show(data[i].msg);
                        }
                        if (data[i].status == 'success') {
                            //如果是单文件上传，则赋值相应的表单
                            if (!p.multiple) {
                                parentObj.siblings(".upload-name").val(data[i].name);
                                parentObj.siblings(".upload-path").val(data[i].path);
                                parentObj.siblings(".upload-size").val(data[i].size);
                                parentObj.siblings(".upload-imgurl").attr("src", data[i].path).attr("alt", data[i].name);
                            } else {
                                if (typeof (p.callBack) == "function") {
                                    p.callBack(data[i].originalImgUrl, data[i].imgUrl60, data[i].imgUrl120, data[i].imgUrl200, data[i].imgUrl400);
                                }
                                else {
                                    addImage(data[i].originalImgUrl, data[i].imgUrl60, data[i].imgUrl120, data[i].imgUrl200, data[i].imgUrl400);
                                }
                            }
                            var progressObj = parentObj.children(".upload-progress");
                            progressObj.children(".txt").html("上传成功：" + file.name);
                        }
                        uploader.removeFile(file); //从队列中移除
                    }
                }
            });

            //不管成功或者失败，文件上传完成时触发
            uploader.on('uploadComplete', function (file) {
                var progressObj = parentObj.children(".upload-progress");
                progressObj.children(".txt").html("上传完成");
                //如果队列为空，则移除进度条
                if (uploader.getStats().queueNum == 0) {
                    progressObj.remove();
                }
            });
        };

        return $(this).each(function () {
            fun($(this));
        });

    };
});

/*图片相册处理事件
=====================================================*/
//添加图片相册

//
function addImage1(imageUrlOrg, imageUrl400X400, imageUrl200X200, imageUrl120X120, imageUrl60X60) {
    //插入到相册UL里面
    var newIndex = $(".photo-list").children("ul").children("li").length;
    var newLi = $('<li>'
    + '<input type="hidden" name="ProductObject.ProductsDescriptionPicture[' + newIndex + '].ImageUrlOrg" value="' + imageUrlOrg + '"/>'
    + '<input type="hidden" name="ProductObject.ProductsDescriptionPicture[' + newIndex + '].ImageUrl400x400" value="' + imageUrl400X400 + '"/>'
    + '<input type="hidden" name="ProductObject.ProductsDescriptionPicture[' + newIndex + '].ImageUrl200x200" value="' + imageUrl200X200 + '" />'
    + '<input type="hidden" name="ProductObject.ProductsDescriptionPicture[' + newIndex + '].ImageUrl120x120" value="' + imageUrl120X120 + '"/>'
    + '<input type="hidden" name="ProductObject.ProductsDescriptionPicture[' + newIndex + '].ImageUrl60x60" value="' + imageUrl60X60 + '"/>'
    + '<input type="hidden" name="ProductObject.ProductsDescriptionPicture[' + newIndex + '].OrderNumber" value="' + (newIndex + 1) + '" />'
    + '<div class="img-box">'
    + '<img  alt="图文详情"  src="' + imageUrl200X200 + '"/>'
    + '</div>'
    + '<a href="javascript:;" onclick="delImg(this);">删除</a>'
    + '</li>');
    newLi.appendTo($(".photo-list").children("ul"));
}


//删除图片LI节点
function delImg(obj) {
    var parentObj = $(obj).parent().parent();
    $(obj).parent().remove(); //删除的LI节点
    //重新赋值
    initUpdateSeq();
}


function initUpdateSeq() {
    //重新赋值
    var licountLength = $(".photo-list").children("ul").children("li").length;
    for (var i = 0; i < licountLength; i++) {
        $(".photo-list ul li:eq(" + i + ") input:eq(0)").attr("name", "ProductObject.ProductsDescriptionPicture[" + i + "].ImageUrlOrg");
        $(".photo-list ul li:eq(" + i + ") input:eq(1)").attr("name", "ProductObject.ProductsDescriptionPicture[" + i + "].ImageUrl400x400");
        $(".photo-list ul li:eq(" + i + ") input:eq(2)").attr("name", "ProductObject.ProductsDescriptionPicture[" + i + "].ImageUrl200x200");
        $(".photo-list ul li:eq(" + i + ") input:eq(3)").attr("name", "ProductObject.ProductsDescriptionPicture[" + i + "].ImageUrl120x120");
        $(".photo-list ul li:eq(" + i + ") input:eq(4)").attr("name", "ProductObject.ProductsDescriptionPicture[" + i + "].ImageUrl60x60");
        $(".photo-list ul li:eq(" + i + ") input:eq(5)").attr("name", "ProductObject.ProductsDescriptionPicture[" + i + "].OrderNumber");
        $(".photo-list ul li:eq(" + i + ") input:eq(5)").attr("value", i + 1);
    }
}