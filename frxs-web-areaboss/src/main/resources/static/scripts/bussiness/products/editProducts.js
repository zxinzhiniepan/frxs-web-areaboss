var ue = null;
$(function () {
    var productId = $("#txtBaseProductID").val();
    var timeUnit = $("#timeUnit").val();
    $("#saleLimitTimeUnit").val(timeUnit);
    xsjs.ajax({
        url: contextPath+"/products/selectProductsById",
        async:false,
        data: {
            productId: productId
        },
        success: function (data) {
            if(data.adImgUrl){
                addGglImage(data.adImgUrl.originalImgUrl, data.adImgUrl.imgUrl60, data.adImgUrl.imgUrl120, data.adImgUrl.imgUrl200, data.adImgUrl.imgUrl400)
            }
            if(data.primaryUrls){
                var primaryUrlsList = data.primaryUrls;
                if (primaryUrlsList) {
                    for (var i in primaryUrlsList) {
                        editProducts.addProductsPictureDetails(primaryUrlsList[i].originalImgUrl, primaryUrlsList[i].imgUrl60, primaryUrlsList[i].imgUrl120, primaryUrlsList[i].imgUrl200, primaryUrlsList[i].imgUrl400);
                    }
                }
            }
            if(data.detailUrls){
                var detailUrlsList = data.detailUrls;
                if (detailUrlsList) {
                    for (var i in detailUrlsList) {
                        addImage(detailUrlsList[i].originalImgUrl, detailUrlsList[i].imgUrl60, detailUrlsList[i].imgUrl120, detailUrlsList[i].imgUrl200, detailUrlsList[i].imgUrl400);
                    }
                }
            }
            $("#txtShareDescription").val(data.briefDesc);
        }
    });

    editProducts.init();
    ue = UE.getEditor('editorDescription', {
        toolbars: [
            ['fullscreen', 'source', 'undo', 'redo'],
            ['bold', 'italic', 'underline', 'fontborder', 'fontfamily', 'fontsize', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc'
            ]
        ],
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        elementPathEnabled:false,
        initialContent: $("#hidDescription").val(),
        initialFrameHeight: 600

    });
});

var editProducts = {
    pageParam: null,
    init: function () {
        this.pageParam = xsjs.SerializeURL2Json();
        this.resize();

        $("#btnAddImage").click(function () {
            editProducts.addImageView();
        });

        $("#btnSave").click(function () {
            editProducts.saveInfo();
        });

        $("#btnSave1").click(function () {
            editProducts.saveGraphicDetails();
        });

        $("#btnSelectVendor").click(function () {
            editProducts.selectVendor();
        });

        if (this.pageParam && this.pageParam.productid && this.pageParam.productid > 0) {

        }
        else {
            $("#formTable").tabs("disableTab", 1);
        }

        $(productMainImage).each(function () {
            editProducts.addProductsPictureDetails(this.originalImgUrl, this.imgUrl60, this.imgUrl120, this.imgUrl200, this.imgUrl400);
        });

        $(productGraphicDetails).each(function () {
            addImage(this.originalImgUrl, this.imgUrl60, this.imgUrl120, this.imgUrl200, this.imgUrl400);
        });
        editProducts.graphicDetailsShowState();
        this.upload();
        this.uploadGgt();

        if ($("#txtTXTKID").val() == "") {
            $("#uploadAlbum1").show();
            $("#btnAddImage").hide();
        }
        else {
            $("#uploadAlbum").show();
            $("#uploadAlbum1").hide();
        }
    },
    ///初始化tabs
    resize: function () {
        var navHeight = $(".xs-form-nav:visible").outerHeight() || 0;
        var bottomHeight = $(".xs-form-bottom:visible").outerHeight() || 0;
        $("#formTable").tabs({
            height: $(window).height() - navHeight - bottomHeight - 10
        });

        $(window).resize(function () {
            $("#formTable").tabs("resize", { height: $(window).height() - navHeight - bottomHeight - 10 });
        }).trigger("resize");
    },
    //选择图片视图
    addImageView: function () {

        xsjs.window({
            url: contextPath+"/TxProduct/ShowMultiProductPictureDialog?id=" + (this.pageParam && this.pageParam.txtkproductid ? this.pageParam.txtkproductid : $("#txtTXTKID").val()),
            title: "选择商品主图",
            modal: true,
            width: 900,
            minHeight: 300,
            maxHeight: 800,
            owdoc: window.top
        });

    },
    //添加图片
    addProductsPictureDetails: function (imgPath, imgPath400, imgPath200, imgPath120, imgPath60) {
        var productMainImage = $("#ProductMainImage");
        var productImgBox = $("<div class='product-img-box' />").appendTo(productMainImage);
        $("<img src='" + imgPath200 + "' />").appendTo(productImgBox).data("ImageUrl", {
            originalImgUrl: imgPath,
            imgUrl60: imgPath400,
            imgUrl120: imgPath200,
            imgUrl200: imgPath120,
            imgUrl400: imgPath60,
        });
        $("<div class='closeImage'></div>").appendTo(productImgBox).click(function () {
            var _this = this;
            $.messager.confirm("温馨提示", "确认要删除所选择的图片吗？", function (data) {
                if (data) {
                    $(_this).parent().remove();
                }
            });
        });
    },
    //保存商品
    saveInfo: function () {

        //easyUI表单校验
        var isValidate = $("#productInfo").form("validate");

        var formData = xsjs.SerializeDecodeURL2Json($("#productInfo").find("input, textarea, select").serialize(), true);

        if (isValidate) {
            if (editProducts.pageParam && editProducts.pageParam.productid > 0) {
                formData.productId = editProducts.pageParam.productid;
            }

            if (!formData.vendorId || formData.vendorId == 0) {
                window.top.$.messager.alert("温馨提示", "请选择供应商!", "warning", function () {

                });
                return;
            }

            if (!formData.packageQty) {
                window.top.$.messager.alert("温馨提示", "请填写包装数!", "warning", function () {
                    $("input[name='packageQty']").prev().focus();
                });
                return;
            }

            if (parseFloat(formData.packageQty) <= 0) {
                window.top.$.messager.alert("温馨提示", "包装数必须大于零!", "warning", function () {
                    $("input[name='packageQty']").prev().focus();
                });
                return;
            }

            if (parseFloat(formData.saleAmt) <= parseFloat(formData.perServiceAmt)) {
                window.top.$.messager.alert("温馨提示", "平台服务费应小于商品价格!", "warning", function () {
                    $("input[name='perServiceAmt']").prev().focus();
                });
                return;
            }

            if (parseFloat(formData.marketAmt) < parseFloat(formData.saleAmt)) {
                window.top.$.messager.alert("温馨提示", "商品价格应小于或等于市场价格!", "warning", function () {
                    $("input[name='saleAmt']").prev().focus();
                });
                return;
            }

            if (parseFloat(formData.saleAmt) <= parseFloat(formData.perCommission)) {
                window.top.$.messager.alert("温馨提示", "门店每份提成应小于商品价格!", "warning", function () {
                    $("input[name='perCommission']").prev().focus();
                });
                return;
            }

            if (!formData.perServiceAmt) {
                window.top.$.messager.alert("温馨提示", "请填写平台服务费!", "warning", function () {
                    $("input[name='perServiceAmt']").prev().focus();
                });
                return;
            }

            if (parseFloat(formData.perCommission) == 0) {
                window.top.$.messager.alert("温馨提示", "门店每份提成不能为零!", "warning", function () {
                    $("input[name='perCommission']").prev().focus();
                });
                return;
            }

            if (!formData.perCommission || parseFloat(formData.perCommission) <= 0) {
                window.top.$.messager.alert("温馨提示", "请填写门店每份提成!", "warning", function () {
                    $("input[name='perCommission']").prev().focus();
                });
                return;
            }

            if (parseFloat(formData.saleAmt) <= parseFloat(formData.perCommission) + parseFloat(formData.perServiceAmt)) {
                window.top.$.messager.alert("温馨提示", "门店每份提成<span style='color: red;'>加</span>平台服务费应小于商品价格!", "warning", function () {

                });
                return;
            }

            if (!formData.advertisementImageSrc || $.trim(formData.advertisementImageSrc).length == 0) {
                window.top.$.messager.alert("温馨提示", "请上传广告图片!", "warning", function () {

                });
                return;
            }
            var images = $("#ProductMainImage").find("img");
            if (images.length == 0) {
                window.top.$.messager.alert("温馨提示", "请选择商品图片!", "warning", function () {

                });
                return;
            }

            var imageList = new Array();
            images.each(function () {
                imageList.push($(this).data().ImageUrl);
            });
            formData.detailUrlsArr = JSON.stringify(imageList);

            xsjs.ajax({
                url: contextPath+"/products/updateSingleProduct",
                data:formData,
                type: "POST",
                loadMsg: "正在保存数据，请稍候...",
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
                    if (data.rspCode == "success") {
                        // $('#formTable').tabs('select', 1);
/*                        if (!formData.productId || parseInt(formData.productId) == 0) {
                            xsjs.addTabs({
                                url: "/products/updateSingleProduct?productId=" + data.Data,
                                title: "编辑商品--" + decodeURIComponent(formData.productName)
                            });
                            xsjs.pageClose();
                        }*/
                    }
                },
                error: function () {
                }
            });
            //debugger;
        }
        else {
            if ($.trim(formData.vendorId).length == 0 || parseInt(formData.vendorId) == 0) {
                window.top.$.messager.alert("温馨提示", "请选择供应商!", "warning", function () {

                });
                return;
            }

            if (formData.productName.replace(/[^\x00-\xff]/g, "01").length >= 30) {
                return;
            }

            if (!formData.packageQty) {
                window.top.$.messager.alert("温馨提示", "请填写包装数!", "warning", function () {
                    $("input[name='packageQty']").prev().focus();
                });
                return;
            }

            if (parseFloat(formData.packageQty) <= 0) {
                window.top.$.messager.alert("温馨提示", "包装数必须大于零!", "warning", function () {
                    $("input[name='packageQty']").prev().focus();
                });
                return;
            }

            if (!formData.limitQty || $.trim(formData.limitQty).length == 0 || parseInt(formData.limitQty) <= -1) {
                window.top.$.messager.alert("温馨提示", "请填写限订数量，不限购填0!", "warning", function () {
                    $("input[name='limitQty']").prev().focus();
                });
                return;
            }

            if (!formData.saleAmt || parseFloat(formData.saleAmt) <= 0) {
                window.top.$.messager.alert("温馨提示", "请填写价格!", "warning", function () {
                    $("input[name='saleAmt']").prev().focus();
                });
                return;
            }

            if (!formData.marketAmt || parseFloat(formData.marketAmt) <= 0) {
                window.top.$.messager.alert("温馨提示", "请填写市场价!", "warning", function () {
                    $("input[name='marketAmt']").prev().focus();
                });
                return;
            }

            if (!formData.perServiceAmt || parseFloat(formData.perServiceAmt) == 0) {
                window.top.$.messager.alert("温馨提示", "请填写平台服务费!", "warning", function () {
                    $("input[name='perServiceAmt']").prev().focus();
                });
                return;
            }

            if (!formData.perCommission || parseFloat(formData.perCommission) <= 0) {
                window.top.$.messager.alert("温馨提示", "请填写门店每份提成!", "warning", function () {
                    $("input[name='perCommission']").prev().focus();
                });
                return;
            }
        }

        //formData
    },
    //选择供应商
    selectVendor: function () {
        xsjs.window({
            url: contextPath+"/products/selectVendor",
            title: "选择供应商",
            width: 900,
            modal: true,
            owdoc: window.top,
            apidata: {
                callback: function (data) {
                    $("#txtVendorID").val(data.vendorId);
                    $("#txtVendorName").val(data.vendorName);
                }
            }
        });
    },
    //图片上传
    pictureUpload: function () {
        //当上传框改变触发上传
        $("#flUpload").change(function () {
            //选择的路径名称
            var filename = $("#flUpload").val();
            if (!filename) {
                return false;
            }
            //得到后缀名称
            var fileExt = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename.toLowerCase()) : '';
            //判断后缀名称
            if (fileExt != "png" && fileExt != "jpg") {
                //alert("只能上传.png和.jpg格式的图片");
                window.top.$.messager.alert("", "只能上传.png和.jpg格式的图片", "error");
                return false;
            }
            //调用jquey异步上传方法
            $('#upLoadForm').ajaxSubmit({
                success: function (result) {

                    //处理返回结果
                    var imgurl = result.replace("<pre style=\"word-wrap: break-word; white-space: pre-wrap;\">", "").replace("</pre>", "").replace("<pre>", "");

                    if (imgurl == "max") {
                        //alert("只能上传20kb以内的图片文件");
                        window.top.$.messager.alert("", "只能上传20kb以内的图片文件！", "error");
                    }
                    else {
                        //赋值给占位图片对象
                        $("#image").attr('src', imgurl);
                    }
                    $("#flUpload").val("");
                },
                error: function () {
                    $("#flUpload").val("");
                }
            });
            return false;
        });
    },
    //上传图片
    upload: function () {
        //绑定上传控件
        $("#uploadAlbum").InitUploader({
            filesize: "100",
            btntext: "批量上传",
            multiple: true,
            water: true,
            thumbnail: true,
            duplicate: true,
            sendurl: contextPath+"/uploadFile",
            swf: "../../areaboss/scripts/plugin/webuploader/uploader.swf",
            filetypes: "jpg",
            mimetypes: ".jpg",
            filenumlimit: "10",
            savemethod: 'SaveProductImages',
            fileDir: "productDetailImg"
            // callBack: editProducts.addProductsPictureDetails
        });

        //绑定上传控件
        $("#uploadAlbum1").InitUploader({
            filesize: "100",
            btntext: "批量上传",
            multiple: true,
            water: true,
            thumbnail: true,
            duplicate: true,
            sendurl: contextPath+"/uploadFile",
            swf: "../../areaboss/scripts/plugin/webuploader/uploader.swf",
            filetypes: "jpg",
            mimetypes: ".jpg",
            filenumlimit: "10",
            savemethod: 'SaveProductImages',
            fileDir: "productMainImg",
            callBack: editProducts.addProductsPictureDetails
        });

        setTimeout(function () {
            $(".webuploader-pick").next().css({
                left: -82,
                top: 0,
                position: "relative"
            });
        }, 1000);
    },
    //上传广告图片
    uploadGgt: function () {
        //绑定上传控件
        $("#uploadGgtAlbum").InitUploader({
            filesize: "100",
            btntext: "上传广告图",
            multiple: true,
            water: true,
            thumbnail: true,
            duplicate: true,
            sendurl: contextPath+"/uploadFile",
            swf: "../../areaboss/scripts/plugin/webuploader/uploader.swf",
            filetypes: "jpg",
            mimetypes: ".jpg",
            filenumlimit: "1",
            savemethod: 'SaveProductImages',
            fileDir: "productAdImg",
            callBack: addGglImage
        });

        setTimeout(function () {
            $(".webuploader-pick").next().css({
                left: -82,
                top: 0,
                position: "relative"
            });
        }, 1000);
    },
    //保存图文详情
    saveGraphicDetails: function () {
        var images = $("#GraphicDetails").find("img");
        var imageList = new Array();
        if (images.length > 0) {
            images.each(function () {
                imageList.push($(this).data().ImageUrl);
            });
        }

        var formData = {};
        formData.detailPicArr = JSON.stringify(imageList);
        formData.detailDesc = UE.getEditor('editorDescription').getContent();
        var count = ue.getContentLength(true);
        if(count>10000){
            window.top.$.messager.alert("温馨提示", "图文详情最多输入10000个字符!", "warning", function () {

            });
            return;
        }
        formData.productId = $("#txtBaseProductID").val();

        xsjs.ajax({
            url: contextPath+"/products/updateProductDesc",
            data: formData,
            type: "POST",
            loadMsg: "正在上传图文详情，请稍候...",
            success: function (data) {
                window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");
            },
            error: function () {
            }
        });
        //}
    },
    //图片详情顺序移动
    graphicDetailsOrder: function (obj, state) {
        if (state == 0) {
            $(obj).closest(".product-img-box").insertBefore($(obj).closest(".product-img-box").prev());
        }
        else {
            $(obj).closest(".product-img-box").before($(obj).closest(".product-img-box").next());
        }
        editProducts.graphicDetailsShowState();
    },
    graphicDetailsShowState: function () {
        var GraphicDetails = $("#GraphicDetails");
        if (GraphicDetails.length > 0) {
            GraphicDetails.find(".product-img-box-btn").show();
            GraphicDetails.find(".product-img-box-btn-top:eq(0)").hide();
            GraphicDetails.find(".product-img-box-btn-bottom:last").hide();
        }
    },
    /*    editorBind: function () {
            //实例化编辑器
            //建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
            var ue = UE.getEditor('editorDescription', {
                toolbars: [
                    ['fullscreen', 'source', 'undo', 'redo'],
                    ['bold', 'italic', 'underline', 'fontborder', 'fontfamily', 'fontsize', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc'
                    ]
                ],
                autoHeightEnabled: false,
                autoFloatEnabled: true,
                initialContent: $("#hidDescription").val(),
                initialFrameHeight: 600

            });
        }*/
};

function addImage(imgPath, imgPath400, imgPath200, imgPath120, imgPath60, updateShowState) {
    var productMainImage = $("#GraphicDetails");
    var productImgBox = $("<div class='product-img-box' />").appendTo(productMainImage);
    $("<img src='" + imgPath200 + "' />").appendTo(productImgBox).data("ImageUrl", {
        originalImgUrl: imgPath,
        imgUrl60: imgPath400,
        imgUrl120: imgPath200,
        imgUrl200: imgPath120,
        imgUrl400: imgPath60,
    });
    $("<div class='closeImage'></div>").appendTo(productImgBox).click(function () {
        var _this = this;
        $.messager.confirm("温馨提示", "确认要删除所选择的图片吗？", function (data) {
            if (data) {
                $(_this).parent().remove();
                editProducts.graphicDetailsShowState();
            }
        });
    });
    var divOption = $("<div/>").appendTo(productImgBox);
    $("<a class='product-img-box-btn product-img-box-btn-top' onclick='editProducts.graphicDetailsOrder(this, 0)'>前移<a/>").appendTo(divOption);
    $("<a class='product-img-box-btn product-img-box-btn-bottom' onclick='editProducts.graphicDetailsOrder(this, 1)'>后移<a/>").appendTo(divOption);

    if (updateShowState != false) {
        editProducts.graphicDetailsShowState();
    }
}

function addGglImage(imgPath, imgPath400, imgPath200, imgPath120, imgPath60, updateShowState) {
    $("#hidAdvertisementImageSrc").val(imgPath);
    $("#GgtDetails").empty();
    $("<img src='" + imgPath + "' />").appendTo($("#GgtDetails")).data("ImageUrl", {
        originalImgUrl: imgPath,
        imgUrl60: imgPath400,
        imgUrl120: imgPath200,
        imgUrl200: imgPath120,
        imgUrl400: imgPath60,
    });
};