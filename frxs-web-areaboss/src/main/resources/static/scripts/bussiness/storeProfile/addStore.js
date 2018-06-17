/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />

var editShop = {
    pageParam: null,
    init: function () {

        this.pageParam = xsjs.SerializeURL2Json();
        if (this.pageParam && this.pageParam.id > 0) {
            $("#txtshopid").attr("disabled", "disabled");
            $("#txtshopname").attr("disabled", "disabled");
        }

        xsjs.region();


        //门店添加事件
        $("#BtnAdd").click(function () {
            var ddlSupplierAll = $("#ddlSupplierAll").find("option:selected");
            if (ddlSupplierAll.length > 0) {
                var ddlSupplierSelect = $("#ddlSupplierSelect");
                for (var i = 0; i < ddlSupplierAll.length; i++) {
                    ddlSupplierSelect.append(ddlSupplierAll[i]);
                    $("#hid").val($("#hid").val() + "," + ddlSupplierAll[i].value);//赋值
                }
            }
        });

        //门店删除事件
        $("#BtnDel").click(function () {
            var ddlSupplierSelect = $("#ddlSupplierSelect").find("option:selected");
            if (ddlSupplierSelect.length > 0) {
                var ddlSupplierAll = $("#ddlSupplierAll");
                for (var i = 0; i < ddlSupplierSelect.length; i++) {
                    ddlSupplierAll.append(ddlSupplierSelect[i]);

                    var id = ddlSupplierSelect[i].value;
                    var wcid = $("#hid").val();
                    wcid = wcid.replace("," + id, "");
                    $("#hid").val(wcid);//赋值
                }
            }
        });

        if (this.pageParam && this.pageParam.id > 0) {
            $(".xs-form-bottom-left").removeClass("xs-form-bottom-left").addClass("xs-form-bottom-right");
        }

        $("#btnSave").click(function () {
            var formData = xsjs.SerializeDecodeURL2Json($(".xs-forminfo").find("input, textarea, select").serialize(), true);
            if (parseInt($("#oldLineId").val()) > 0 && parseInt($("#oldLineId").val()) != formData.lineId) {

                window.top.$.messager.confirm("温馨提示", "注：修改线路后，提货日期在修改时间之后的，都会按照最新的配送线路进行配送，是否继续修改？", function (data) {
                    if (data) {
                        editShop.save();
                    }
                });

                return;
            }
            editShop.save();
        });

        //记录原始线路ID
        $("#oldLineId").val($("#ddlLineID").val());

        //支付方式
        $("#ddlPayMethod").change(function () {
            if (this.value == 2) {
                $(".PayMethod").show();
            }
            else {
                $(".PayMethod").hide();
            }
        }).trigger("change");

        this.uploadBusiLicenseFullNameImgSrc();
        this.uploadFoodCirculationLicenseImgSrc();
    },
    //仓库线路级联
    warehouseLine:function () {
        $("select[name='warehouseId']").change(function () {
            var warehouseId = $("select[name='warehouseId']").val();
            var html = "<option value=''>--请选择配送线路--</option>";
            if(warehouseId!=""&&warehouseId!=null){
                $.ajax({
                    type: 'POST',
                    url: contextPath + "/storeProfile/distributionLine/getPageList",
                    data: {"warehouseId":warehouseId},
                    success: function (data) {

                        $.each(data,function (i,item) {
                            html += "<option value="+item.id+">"+item.lineName+"</option>"
                        })
                        $("#ddlLineID").html(html);
                    },
                })
            }else{
                $("#ddlLineID").html(html);
            }

        });
    },


    //检索未绑定门店的商圈
    linkCircle: function () {
        var loading = xsjs.easyLoading("正在查询商圈，请稍候...");
        xsjs.ajax({
            data: {
                m: 104100,
                opt: "getAll",
                queProvince: $("#circleRange_ddlProvince").val(),
                queCity: $("#circleRange_ddlCity").val(),
                queCounty: $("#circleRange_ddlCounty").val(),
                txtName: $("#txtSerch").val(),
                ddlBinding: 0,
            },
            success: function (data) {

                var ddlCircleSelect = $("#ddlSupplierSelect");
                var strCircleID = ",";
                $(ddlCircleSelect.find("option")).each(function () {
                    strCircleID += $(this).val() + ",";
                });

                var ddlSupplierAll = $("#ddlSupplierAll");
                ddlSupplierAll.empty();
                $(data).each(function () {
                    if (strCircleID.indexOf("," + this.businessCircleID + ",") < 0) {
                        ddlSupplierAll.append("<option value='" + this.businessCircleID + "' title='" + this.circleName + "'>" + this.circleName + "</option>");
                    }
                })
                loading.close();
            },
            error: function () {
                loading.close();
            }
        });
    },
    //保存门店信息
    save: function () {

        var formData = xsjs.SerializeDecodeURL2Json($(".xs-forminfo").find("input, textarea, select").serialize(), true);
        formData.warehouseName = $("#ddlWarehouseID option:selected").text();
        if (this.pageParam && this.pageParam.id <= 0) {
            if (!formData.storeCode || formData.storeCode.length == 0) {
                $.messager.alert("温馨提示", "请填写门店编号！", "warning", function () {
                    $("input[name='storeCode']").focus();
                });
                return false;
            }

            if (!xsjs.validator.IsPositiveInt(formData.storeCode) || parseInt(formData.storeCode) <= 0 || formData.storeCode.length > 8) {
                $.messager.alert("温馨提示", "门店编号请输入8位以内的数字！", "warning", function () {
                    $("input[name='storeCode']").focus();
                });
                return false;
            }
        }

        if (!formData.storeName || formData.storeName.length == 0) {
            $.messager.alert("温馨提示", "请填写门店名称！", "warning", function () {
                $("input[name='storeName']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2(formData.storeName)) {
            $.messager.alert("温馨提示", "门店名称格式不正确，名称中包含特殊字符！", "warning", function () {
                $("input[name='storeName']").focus();
            });
            return false;
        }

        if (!formData.contacts || formData.contacts.length == 0) {
            $.messager.alert("温馨提示", "请填写联系人！", "warning", function () {
                $("input[name='contacts']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsChn(formData.contacts) || formData.contacts.length < 2) {
            $.messager.alert("温馨提示", "联系人格式不正确，请输入两位或两位以上的汉字！", "warning", function () {
                $("input[name='contacts']").focus();
            });
            return false;
        }

        if (this.pageParam && this.pageParam.id <= 0) {
            if (!formData.userName || formData.userName.length == 0) {
                $.messager.alert("温馨提示", "请填写门店帐号！", "warning", function () {
                    $("input[name='userName']").focus();
                });
                return false;
            }

            if (!xsjs.validator.mobile(formData.userName)) {
                $.messager.alert("温馨提示", "门店账号格式不正确！", "warning", function () {
                    $("input[name='userName']").focus();
                });
                return false;
            }
        }

        if (!formData.contactsTel || parseInt(formData.contactsTel) <= 0) {
            $.messager.alert("温馨提示", "请填写客服电话！", "warning", function () {
                $("input[name='ContactsTel']").focus();
            });
            return false;
        }

        if (!xsjs.validator.phone(formData.contactsTel)) {
            $.messager.alert("温馨提示", "客服电话格式不正确！", "warning", function () {
                $("input[name='contactsTel']").focus();
            });
            return false;
        }

       /* if (formData.warehouseId == ""||formData.warehouseId == null) {
            $.messager.alert("温馨提示", "请选择配送仓库！", "warning", function () {
                $("input[name='warehouseId']").focus();
            });
            return false;
        }*/

        /*if (formData.lineId == ""||formData.lineId == null) {
           $.messager.alert("温馨提示", "请选择配送线路！", "warning", function () {
               $("input[name='lineId']").focus();
           });
           return false;
        }

        if (!formData.lineSort || parseInt(formData.lineSort) <= 0) {
            $.messager.alert("温馨提示", "请填写配送顺序！", "warning", function () {
                $("input[name='lineSort']").prev().focus();
            });
            return false;
        }*/

        //if (!formData.StoreDeveloper || formData.StoreDeveloper.length == 0) {
        //    $.messager.alert("温馨提示", "请填写门店开发人员！", "warning", function () {
        //        $("input[name='StoreDeveloper']").focus();
        //    });
        //    return false;
        //}

        //if (!xsjs.validator.IsChn(formData.StoreDeveloper)) {
        //    $.messager.alert("温馨提示", "门店开发人员格式不正确，请输入两位或两位以上的汉字！", "warning", function () {
        //        $("input[name='StoreDeveloper']").focus();
        //    });
        //    return false;
        //}

        //if (!xsjs.validator.IsCheckStr2(formData.StoreDeveloper)) {
        //    $.messager.alert("温馨提示", "门店开发人员格式不正确，开发人员中包含特殊字符！", "warning", function () {
        //        $("input[name='StoreDeveloper']").focus();
        //    });
        //    return false;
        //}

        if (!formData.wechatGroupName || formData.wechatGroupName.length == 0) {
            $.messager.alert("温馨提示", "请填写门店微信群名称！", "warning", function () {
                $("input[name='wechatGroupName']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr3(formData.wechatGroupName)) {
            $.messager.alert("温馨提示", "门店微信群名称格式不正确，名称中包含特殊字符！", "warning", function () {
                $("input[name='wechatGroupName']").focus();
            });
            return false;
        }

        if (!formData.shopArea || formData.shopArea.length == 0) {
            $.messager.alert("温馨提示", "请填写营业面积！", "warning", function () {
                $("input[name='shopArea']").focus();
            });
            return false;
        }

        if (!formData.busiLicenseFullName || formData.busiLicenseFullName.length == 0) {
            $.messager.alert("温馨提示", "请填写营业执照！", "warning", function () {
                $("input[name='busiLicenseFullName']").focus();
            });
            return false;
        }

        if (!formData.foodCirculationLicense || formData.foodCirculationLicense.length == 0) {
            $.messager.alert("温馨提示", "请填写食品流通许可证！", "warning", function () {
                $("input[name='foodCirculationLicense']").focus();
            });
            return false;
        }

        if (!formData.provinceId || parseInt(formData.provinceId) <= 0) {
            $.messager.alert("温馨提示", "请选择门店所在省份！", "warning", function () {
                $("input[name='provinceId']").focus();
            });
            return false;
        }

        if (!formData.cityId || parseInt(formData.cityId) <= 0) {
            $.messager.alert("温馨提示", "请选择门店所在地级市！", "warning", function () {
                $("input[name='cityId']").focus();
            });
            return false;
        }

        if (!formData.countyId || parseInt(formData.countyId) <= 0) {
            $.messager.alert("温馨提示", "请选择门店所在区县！", "warning", function () {
                $("input[name='countyId']").focus();
            });
            return false;
        }

        if (!formData.detailAddress || formData.detailAddress.length == 0) {
            $.messager.alert("温馨提示", "请填写门店详细地址！", "warning", function () {
                $("input[name='detailAddress']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2(formData.detailAddress)) {
            $.messager.alert("温馨提示", "门店地址格式不正确，地址中包含特殊字符！", "warning", function () {
                $("input[name='detailAddress']").focus();
            });
            return false;
        }


        if (!formData.shopArea || formData.shopArea.length == 0) {
            $.messager.alert("温馨提示", "请填写营业面积！", "warning", function () {
                $("input[name='shopArea']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2(formData.shopArea)) {
            $.messager.alert("温馨提示", "营业面积格式不正确，不能包含特殊字符！", "warning", function () {
                $("input[name='shopArea']").focus();
            });
            return false;
        }

        if (!formData.busiLicenseFullName || formData.busiLicenseFullName.length == 0) {
            $.messager.alert("温馨提示", "请填写营业执照！", "warning", function () {
                $("input[name='busiLicenseFullName']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2(formData.busiLicenseFullName)) {
            $.messager.alert("温馨提示", "营业执照格式不正确，不能包含特殊字符！", "warning", function () {
                $("input[name='busiLicenseFullName']").focus();
            });
            return false;
        }

        if (!formData.foodCirculationLicense || formData.foodCirculationLicense.length == 0) {
            $.messager.alert("温馨提示", "请填写食品流通许可证！", "warning", function () {
                $("input[name='foodCirculationLicense']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2(formData.foodCirculationLicense)) {
            $.messager.alert("温馨提示", "食品流通许可证格式不正确，不能包含特殊字符！", "warning", function () {
                $("input[name='foodCirculationLicense']").focus();
            });
            return false;
        }

        if (this.pageParam && this.pageParam.id <= 0) {

            if (!formData.bankAccountName || formData.bankAccountName.length == 0) {
                $.messager.alert("温馨提示", "请填写收款人帐户！", "warning", function () {
                    $("input[name='bankAccountName']").focus();
                });
                return false;
            }

            if (formData.bankAccountName.length > 32) {
                $.messager.alert("温馨提示", "收款人帐户最大长度为32！", "warning", function () {
                    $("input[name='bankAccountName']").focus();
                });
                return false;
            }


            if (!xsjs.validator.IsCheckStr2(formData.bankAccountName)) {
                $.messager.alert("温馨提示", "收款人帐户格式不正确，名称中包含特殊字符！", "warning", function () {
                    $("input[name='bankAccountName']").focus();
                });
                return false;
            }

            if (!formData.bankNo || formData.bankNo.length == 0) {
                $.messager.alert("温馨提示", "请填写开户行行号！", "warning", function () {
                    $("input[name='bankNo']").focus();
                });
                return false;
            }

            if (formData.bankNo.length > 16) {
                $.messager.alert("温馨提示", "开户行行号最大长度为16！", "warning", function () {
                    $("input[name='bankNo']").focus();
                });
                return false;
            }

            /*if (!xsjs.validator.IsCheckStr2(formData.bankNo)) {
                $.messager.alert("温馨提示", "开户行行号格式不正确，名称中包含特殊字符！", "warning", function () {
                    $("input[name='bankNo']").focus();
                });
                return false;
            }*/
            if (!xsjs.validator.IsNumber(formData.bankNo)) {
                $.messager.alert("温馨提示", "开户行行号只能是数字！", "warning", function () {
                    $("input[name='bankNo']").focus();
                });
                return false;
            }

            if (!formData.bankName || formData.bankName.length == 0) {
                $.messager.alert("温馨提示", "请填写开户银行！", "warning", function () {
                    $("input[name='bankName']").focus();
                });
                return false;
            }

            if (formData.bankName.length > 32) {
                $.messager.alert("温馨提示", "开户银行最大长度为32！", "warning", function () {
                    $("input[name='bankName']").focus();
                });
                return false;
            }


            if (!xsjs.validator.IsCheckStr2(formData.bankName)) {
                $.messager.alert("温馨提示", "开户银行格式不正确，名称中包含特殊字符！", "warning", function () {
                    $("input[name='bankName']").focus();
                });
                return false;
            }


            if (!formData.bankAccountNo || formData.bankAccountNo.length == 0) {
                $.messager.alert("温馨提示", "请填写银行账号！", "warning", function () {
                    $("input[name='bankAccountNo']").focus();
                });
                return false;
            }

            if (!xsjs.validator.IsNumber(formData.bankAccountNo)) {
                $.messager.alert("温馨提示", "银行帐号只能是数字！", "warning", function () {
                    $("input[name='bankAccountNo']").focus();
                });
                return false;
            }

            if (formData.bankAccountNo.length > 25) {
                $.messager.alert("温馨提示", "银行帐号最大长度为25！", "warning", function () {
                    $("input[name='bankAccountNo']").focus();
                });
                return false;
            }

            if (!xsjs.validator.IsNumber(formData.unionPayCID)) {
                $.messager.alert("温馨提示", "企业用户号只能是数字！", "warning", function () {
                    $("input[name='unionPayCID']").focus();
                });
                return false;
            }

            if (!xsjs.validator.IsNumber(formData.unionPayMID)) {
                $.messager.alert("温馨提示", "银联商户号只能是数字！", "warning", function () {
                    $("input[name='unionPayMID']").focus();
                });
                return false;
            }
        }

        var provinceName = $("#ddlProvince option[value=" + formData.provinceId + "]").text();
        var cityName = $("#ddlCity option[value=" + formData.cityId + "]").text();
        var countyName = $("#ddlCounty option[value=" + formData.countyId + "]").text();
        var address = formData.detailAddress;
        formData.detailAddress = (provinceName == cityName ? cityName : provinceName+cityName) + countyName +address;
        formData.storeId = (this.pageParam ? this.pageParam.id : 0);
        formData.oldLineId = $("#oldLineId").val();

        //提交数据
        $.ajax({
            url: contextPath + "/storeProfile/saveStore",
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
    //上传营业执照
    uploadBusiLicenseFullNameImgSrc: function () {
        //绑定上传控件
        $("#uploadBusiLicenseFullName").InitUploader({
            filesize: "1024",
            btntext: "上传营业执照",
            multiple: true,
            water: true,
            thumbnail: true,
            duplicate: true,
            sendurl: contextPath+"/uploadFile",
            swf: "../../scripts/plugin/webuploader/uploader.swf",
            filetypes: "jpg",
            mimetypes: ".jpg",
            filenumlimit: "1",
            savemethod: 'saveProductImages',
            fileDir: "storeBusinessLicenseImg",
            callBack: function (imgPath, imgPath400, imgPath200, imgPath120, imgPath60) {
                $("#hidBusiLicenseFullNameImgSrc").val(imgPath);
                $("#imgBusiLicenseFullName").empty();
                $("<img src='" + imgPath200 + "' />").appendTo($("#imgBusiLicenseFullName")).data("imageUrl", {
                    imageUrlOrg: imgPath,
                    imageUrl400x400: imgPath400,
                    imageUrl200x200: imgPath200,
                    imageUrl120x120: imgPath120,
                    imageUrl60x60: imgPath60,
                });
            }
        });

        setTimeout(function () {
            $(".webuploader-pick").next().css({
                left: -82,
                top: 0,
                position: "relative"
            });
        }, 1000);
    },
    //上传食品流通许可证
    uploadFoodCirculationLicenseImgSrc: function () {
        //绑定上传控件
        $("#uploadFoodCirculationLicense").InitUploader({
            filesize: "1024",
            btntext: "上传食品流通许可证",
            multiple: true,
            water: true,
            thumbnail: true,
            duplicate: true,
            sendurl: contextPath+"/uploadFile",
            swf: "../../scripts/plugin/webuploader/uploader.swf",
            filetypes: "jpg",
            mimetypes: ".jpg",
            filenumlimit: "1",
            savemethod: 'saveProductImages',
            fileDir: "storeFoodCirculationLicenseImg",
            callBack: function (imgPath, imgPath400, imgPath200, imgPath120, imgPath60) {
                    $("#hidFoodCirculationLicenseImgSrc").val(imgPath);
                    $("#imgFoodCirculationLicense").empty();
                    $("<img src='" + imgPath200 + "' />").appendTo($("#imgFoodCirculationLicense")).data("ImageUrl", {
                        imageUrlOrg: imgPath,
                        imageUrl400x400: imgPath400,
                        imageUrl200x200: imgPath200,
                        imageUrl120x120: imgPath120,
                        imageUrl60x60: imgPath60,
                    });
            }
        });

        setTimeout(function () {
            $(".webuploader-pick").next().css({
                left: -82,
                top: 0,
                position: "relative"
            });
        }, 1000);
    }
}

$(function () {

    initMap(); //创建和初始化地图
    var markerold = new BMap.Marker(new BMap.Point($("#hdMyPosX").val(), $("#hdMyPosY").val()));  // 创建标注
    map.addOverlay(markerold);

    editShop.init();

});

//创建和初始化地图函数：
function initMap() {
    createMap(); //创建地图
    setMapEvent(); //设置地图事件
    addMapControl(); //向地图添加控件
}

//创建地图函数：
function createMap() {
    var map = new BMap.Map("dituContent"); //在百度地图容器中创建一个地图
    var point = new BMap.Point(112.979353, 28.213478); //定义一个中心点坐标
    map.centerAndZoom(point, 12); //设定地图的中心点和坐标并将地图显示在地图容器中
    window.map = map; //将map变量存储在全局
    map.addEventListener("click", showInfo);
}

//地图事件设置函数：
function setMapEvent() {
    map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
    map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard(); //启用键盘上下左右键移动地图
}

//地图控件添加函数：
function addMapControl() {
    //向地图中添加缩放控件
    var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
    map.addControl(ctrl_nav);
    //向地图中添加缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
    map.addControl(ctrl_ove);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    map.addControl(ctrl_sca);
}

function addressChange() {
    map.clearOverlays();
    var provinceName = $("#ddlProvince option:selected").text();
    var cityName = $("#ddlCity option:selected").text();
    var countyName = $("#ddlCounty option:selected").text();
    var city = provinceName + cityName + countyName;
    //var city = $("#ddlRegions1").find("option:selected").text() + $("#ddlRegions2").find("option:selected").text() + $("#ddlRegions3").find("option:selected").text();
    var address = $("#txtAddress").val();
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(city + address, function (point) {
        if (point) {
            map.centerAndZoom(point, 16);
            map.addOverlay(new BMap.Marker(point));
            $("#txtMyPosX").val(point.lng + "," + point.lat);
            $("#txtMyPosY").val();
            $("#hdMyPosX").val(point.lng);
            $("#hdMyPosY").val(point.lat);
        }
    }, city);
}

function showInfo(e) {
    map.clearOverlays();
    $("#txtMyPosX").val(e.point.lng + "," + e.point.lat);
    $("#txtMyPosY").val();
    $("#hdMyPosX").val(e.point.lng);
    $("#hdMyPosY").val(e.point.lat);
    var marker1 = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));  // 创建标注
    map.addOverlay(marker1);
}

window.onload = function () {
    var detailAddress = $("#txtAddress").attr("detailAddress");
    if(detailAddress){
        var provinceName = $("#ddlProvince option[value=" + $("#ddlProvince").attr("provinceId") + "]").text();
        var cityName = $("#ddlCity option[value=" + $("#ddlCity").attr("cityId") + "]").text();
        var countyName = $("#ddlCounty option[value=" + $("#ddlCounty").attr("countyId") + "]").text();
        var detail = provinceName == cityName ? cityName+countyName : provinceName+cityName+countyName;
        var address = detailAddress.replace(detail,"");
        $("#txtAddress").val(address);
    }
};