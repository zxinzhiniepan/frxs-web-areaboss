/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
var editShop = {
    pageParam: null,
    init: function () {
        this.pageParam = xsjs.SerializeURL2Json();

        xsjs.region();

        if (this.pageParam && this.pageParam.id > 0) {
            $(".xs-form-bottom-left").removeClass("xs-form-bottom-left").addClass("xs-form-bottom-right");
        }

        $("#btnSave").click(function () {
            editShop.save();
        });

        this.upload();
        this.uploadBusiLicenseFullNameImgSrc();
        this.uploadFoodCirculationLicenseImgSrc();
        if(this.pageParam.id > 0){
            this.vendorTypeEcho(this.pageParam.id);
        }
    },

    //供应商分类回显
    vendorTypeEcho:function(vendorId){
        $.ajax({
            url: contextPath + "/vendorType/vendorTypeIdList",
            data: {"vendorId":vendorId},
            type: "POST",
            success: function (data) {
                if (data.rspCode == "success") {
                    var ids = data.record;
                    $(ids).each(function (i,id) {
                        $(":checkbox[value='"+id+"']").prop("checked",true);
                    })
                }
            },
            error: function () {
            }
        });
    },

    // //下拉绑定
    // selectBind:function () {
    //     $('#cmbVendorType').combobox({
    //         url: '/vendorType/getAllList',
    //         valueField: 'vendorTypeId', //绑定字段ID
    //         textField: 'vendorTypeName',//绑定字段Name
    //         panelHeight: 'auto', //自适应
    //         multiple: true,
    //         formatter: function(row) {
    //             var opts = $(this).combobox('options');
    //             return '<input type="checkbox" class="combobox-checkbox" name="vendorTypeId" id="' + row[opts.valueField] + '">' + row[opts.textField]
    //         },
    //
    //         onShowPanel: function() {
    //             var opts = $(this).combobox('options');
    //             var target = this;
    //             var values = $(target).combobox('getValues');
    //             console.log("onShowPanel:"+values);
    //             $.map(values, function(value) {
    //                 var el = opts.finder.getEl(target, value);
    //                 el.find('input.combobox-checkbox')._propAttr('checked', true);
    //             })
    //         },
    //         onLoadSuccess: function() {
    //             var opts = $(this).combobox('options');
    //             var target = this;
    //             var values = $('#cmbVendorTypeHid').val();
    //             console.log("onLoadSuccess:"+values);
    //
    //             for (var i = 0; i<values.length; i++){
    //                 var el = opts.finder.getEl(target,values[i]);
    //                 el.find('input.combobox-checkbox')._propAttr('checked', true);
    //         }
    //
    //             // var values = $(target).combobox('getValues');
    //             // $.map(values, function(value) {
    //             //     var el = opts.finder.getEl(target, value);
    //             //     el.find('input.combobox-checkbox')._propAttr('checked', true);
    //             // })
    //         },
    //         onSelect: function(row,value) {
    //             var opts = $(this).combobox('options');
    //             var el = opts.finder.getEl(this, row[opts.valueField]);
    //             el.find('input.combobox-checkbox')._propAttr('checked', true);
    //         },
    //         onUnselect: function(row) {
    //             var opts = $(this).combobox('options');
    //             var el = opts.finder.getEl(this, row[opts.valueField]);
    //             el.find('input.combobox-checkbox')._propAttr('checked', false);
    //         }
    //     });
    // },

    //检索未绑定门店的商圈
    linkCircle: function () {
        var loading = xsjs.easyLoading("正在查询商圈，请稍候...");
        xsjs.ajax({
            data: {
                m: 104100,
                opt: "GetAll",
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
                    if (strCircleID.indexOf("," + this.businessCircleId + ",") < 0) {
                        ddlSupplierAll.append("<option value='" + this.businessCircleId + "' title='" + this.circleName + "'>" + this.circleName + "</option>");
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
        var arrs=new Array();
        $("input[name='vendorTypeId']:checkbox").each(function(){
            if(this.checked){
                arrs.push($(this).val());
            }
        });
        formData.vendorTypeId = arrs.join(",");

        formData.userName = $("#txtshopname").val();
        if (!formData.vendorName || formData.vendorName.length == 0) {
            $.messager.alert("温馨提示", "请填写供应商名称！", "warning", function () {
                $("input[name='vendorName']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2($.trim(formData.vendorName))) {
            $.messager.alert("温馨提示", "供应商名称格式不正确，名称中包含特殊字符！", "warning", function () {
                $("input[name='vendorName']").focus();
            });
            return false;
        }

        if (!formData.vendorShortName || formData.vendorShortName.length == 0) {
            $.messager.alert("温馨提示", "请填写供应商简称！", "warning", function () {
                $("input[name='vendorShortName']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2($.trim(formData.vendorShortName))) {
            $.messager.alert("温馨提示", "供应商简称格式不正确，名称中包含特殊字符！", "warning", function () {
                $("input[name='vendorShortName']").focus();
            });
            return false;
        }

        if (!this.pageParam && this.pageParam.id <= 0){
            if (!formData.vendorCode || formData.vendorCode.length == 0) {
                $.messager.alert("温馨提示", "请填写供应商编码！", "warning", function () {
                    $("input[name='vendorCode']").focus();
                });
                return false;
            }

            if (!xsjs.validator.IsPositiveInt(formData.vendorCode) || parseInt(formData.vendorCode) <= 0) {
                $.messager.alert("温馨提示", "供应商编码只能是纯数字！", "warning", function () {
                    $("input[name='vendorCode']").focus();
                });
                return false;
            }
        }

        if (!formData.contacts || formData.contacts.length == 0) {
            $.messager.alert("温馨提示", "请填写联系人！", "warning", function () {
                $("input[name='contacts']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsChn(formData.contacts)) {
            $.messager.alert("温馨提示", "联系人格式不正确，联系人由两个或两个以上的汉字组成！", "warning", function () {
                $("input[name='contacts']").focus();
            });
            return false;
        }

        /*if (this.pageParam && this.pageParam.id <= 0) {
            if (!formData.userName || formData.userName.length == 0) {
                $.messager.alert("温馨提示", "请填写供应商帐号！", "warning", function () {
                    $("input[name='userName']").focus();
                });
                return false;
            }
        }*/

        if (!formData.contactsTel || formData.contactsTel.length == 0) {
            $.messager.alert("温馨提示", "请填写联系电话！", "warning", function () {
                $("input[name='telephone']").focus();
            });
            return false;
        }

        if (xsjs.validator.phone(formData.contactsTel) == 0) {
            $.messager.alert("温馨提示", "联系电话格式不正确！", "warning", function () {
                $("input[name='contactsTel']").focus();
            });
            return false;
        }
        if (!formData.provinceId || formData.provinceId.length == 0 || formData.provinceId <= 0) {
            $.messager.alert("温馨提示", "请选择省份！", "warning", function () {
                $("select[name='provinceId']").focus();
            });
            return false;
        }

        if (!formData.cityId || formData.cityId.length == 0 || formData.cityId <= 0) {
            $.messager.alert("温馨提示", "请选择地级市！", "warning", function () {
                $("select[name='cityId']").focus();
            });
            return false;
        }

        if (!formData.countyId || formData.countyId.length == 0 || formData.countyId <= 0) {
            $.messager.alert("温馨提示", "请选择区县！", "warning", function () {
                $("select[name='countyId']").focus();
            });
            return false;
        }

        if (!formData.address || formData.address.length == 0) {
            $.messager.alert("温馨提示", "请填写供应商详细地址！", "warning", function () {
                $("input[name='address']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2(formData.address)) {
            $.messager.alert("温馨提示", "地址格式不正确，地址中包含特殊字符！", "warning", function () {
                $("input[name='address']").focus();
            });
            return false;
        }

        if (!formData.vendorTypeId || formData.vendorTypeId.length == 0) {
            $.messager.alert("温馨提示", "请选择供应商分类！", "warning", function () {
                $("select[name='vendorTypeId']").focus();
            });
            return false;
        }

        if (!formData.contacts || formData.contacts.length == 0) {
            $.messager.alert("温馨提示", "请填写联系人！", "warning", function () {
                $("input[name='contacts']").focus();
            });
            return false;
        }

        if (!formData.legalPeople || formData.legalPeople.length == 0) {
            $.messager.alert("温馨提示", "请填写法定代表人！", "warning", function () {
                $("input[name='legalPeople']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2(formData.legalPeople)) {
            $.messager.alert("温馨提示", "法人代表格式不正确，不能包含特殊字符！", "warning", function () {
                $("input[name='legalPeople']").focus();
            });
            return false;
        }

        if (!formData.vendorArea || formData.vendorArea.length == 0) {
            $.messager.alert("温馨提示", "请填写营业面积！", "warning", function () {
                $("input[name='vendorArea']").focus();
            });
            return false;
        }

        if (!xsjs.validator.IsCheckStr2(formData.vendorArea)) {
            $.messager.alert("温馨提示", "营业面积格式不正确，不能包含特殊字符！", "warning", function () {
                $("input[name='vendorArea']").focus();
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
            if (!formData.bankAccountName || formData.bankAccountName.length
                == 0) {
                $.messager.alert("温馨提示", "请填写收款人账户！", "warning", function () {
                    $("input[name='bankAccountName']").focus();
                });
                return false;
            }

            if (!xsjs.validator.IsCheckStr2(formData.bankAccountName)) {
                $.messager.alert("温馨提示", "收款人账户格式不正确，不能包含特殊字符！", "warning",
                    function () {
                        $("input[name='bankAccountName']").focus();
                    });
                return false;
            }

            if (!formData.bankName || formData.bankName.length == 0) {
                $.messager.alert("温馨提示", "请填写开户行！", "warning", function () {
                    $("input[name='bankName']").focus();
                });
                return false;
            }

            if (!xsjs.validator.IsCheckStr2(formData.bankName)) {
                $.messager.alert("温馨提示", "开户行格式不正确，不能包含特殊字符！", "warning",
                    function () {
                        $("input[name='bankName']").focus();
                    });
                return false;
            }

            if (!formData.bankAccountNo || formData.bankAccountNo.length == 0) {
                $.messager.alert("温馨提示", "请填写银行帐号！", "warning", function () {
                    $("input[name='bankAccountNo']").focus();
                });
                return false;
            }

            if (!xsjs.validator.IsCheckStr2(formData.bankAccountNo)) {
                $.messager.alert("温馨提示", "银行帐号格式不正确，不能包含特殊字符！", "warning",
                    function () {
                        $("input[name='bankAccountNo']").focus();
                    });
                return false;
            }

            if (!formData.bankNo || formData.bankNo.length == 0) {
                $.messager.alert("温馨提示", "请填写开户行号！", "warning", function () {
                    $("input[name='bankNo']").focus();
                });
                return false;
            }

            if (!xsjs.validator.IsCheckStr2(formData.bankNo)) {
                $.messager.alert("温馨提示", "开户行行号格式不正确，不能包含特殊字符！", "warning",
                    function () {
                        $("input[name='bankNo']").focus();
                    });
                return false;
            }
        }
        var provinceName = $("#ddlProvince option[value=" + formData.provinceId + "]").text();
        var cityName = $("#ddlCity option[value=" + formData.cityId + "]").text();
        var countyName = $("#ddlCounty option[value=" + formData.countyId + "]").text();
        var aAddress = formData.address;
        formData.address = (provinceName == cityName ? cityName : provinceName+cityName) + countyName +aAddress;
        formData.userName = formData.vendorCode;
        formData.vendorId = (this.pageParam ? this.pageParam.id : 0);

        //提交数据
        $.ajax({
            url: contextPath + "/vendor/saveVendor",
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
    //上传图片
    upload: function () {
        //绑定上传控件
        $("#uploadAlbum").InitUploader({
            filesize: "100",
            btntext: "上传Logo",
            multiple: true,
            water: true,
            thumbnail: true,
            duplicate: true,
            sendurl: contextPath+"/uploadFile",
            swf: "../../areaboss/scripts/plugin/webuploader/uploader.swf",
            filetypes: "jpg",
            mimetypes: ".jpg",
            filenumlimit: "1",
            savemethod: 'saveProductImages',
            fileDir: "vendorLogoImg",
            callBack: function (imgPath, imgPath400, imgPath200, imgPath120, imgPath60) {
                $("#hidVendorLogo").val(imgPath);
                $("#GgtDetails").empty();
                $("<img src='" + imgPath200 + "' />").appendTo($("#GgtDetails")).data("ImageUrl", {
                    ImageUrlOrg: imgPath,
                    ImageUrl400x400: imgPath400,
                    ImageUrl200x200: imgPath200,
                    ImageUrl120x120: imgPath120,
                    ImageUrl60x60: imgPath60,
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
            swf: "../../areaboss/scripts/plugin/webuploader/uploader.swf",
            filetypes: "jpg",
            mimetypes: ".jpg",
            filenumlimit: "1",
            savemethod: 'saveProductImages',
            fileDir:"vendorBusinessLicenseImg",
            callBack: function (imgPath, imgPath400, imgPath200, imgPath120, imgPath60) {
                $("#hidBusiLicenseFullNameImgSrc").val(imgPath);
                $("#ImgBusiLicenseFullName").empty().append('<div class="closeImage" onclick="editShop.busiLicenseFullNameImgSrcRemove()"></div>');
                $("<img src='" + imgPath200 + "' />").appendTo($("#ImgBusiLicenseFullName")).data("imageUrl", {
                    ImageUrlOrg: imgPath,
                    ImageUrl400x400: imgPath400,
                    ImageUrl200x200: imgPath200,
                    ImageUrl120x120: imgPath120,
                    ImageUrl60x60: imgPath60,
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
            swf: "../../areaboss/scripts/plugin/webuploader/uploader.swf",
            filetypes: "jpg",
            mimetypes: ".jpg",
            filenumlimit: "1",
            savemethod: 'saveProductImages',
            fileDir: "vendorFoodCirculationLicenseImg",
            callBack: function (imgPath, imgPath400, imgPath200, imgPath120, imgPath60) {
                $("#hidFoodCirculationLicenseImgSrc").val(imgPath);
                $("#ImgFoodCirculationLicense").empty().append('<div class="closeImage" onclick="editShop.imgFoodCirculationLicenseRemove()"></div>');
                $("<img src='" + imgPath200 + "' />").appendTo($("#ImgFoodCirculationLicense")).data("imageUrl", {
                    ImageUrlOrg: imgPath,
                    ImageUrl400x400: imgPath400,
                    ImageUrl200x200: imgPath200,
                    ImageUrl120x120: imgPath120,
                    ImageUrl60x60: imgPath60,
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
    //删除营业执照图片
    busiLicenseFullNameImgSrcRemove: function () {
        $("#ImgBusiLicenseFullName").empty();
        $("#hidBusiLicenseFullNameImgSrc").val("");
    },
    //删除食品流通许可证图片
    imgFoodCirculationLicenseRemove: function () {
        $("#ImgFoodCirculationLicense").empty();
        $("#hidFoodCirculationLicenseImgSrc").val("");
    }
}

$(function () {
    editShop.init();
    vendorUserNameBind();
});

window.onload = function () {
    var detailAddress = $("#txtAddress").attr("address");
    if(detailAddress){
        var provinceName = $("#ddlProvince option[value=" + $("#ddlProvince").attr("provinceId") + "]").text();
        var cityName = $("#ddlCity option[value=" + $("#ddlCity").attr("cityId") + "]").text();
        var countyName = $("#ddlCounty option[value=" + $("#ddlCounty").attr("countyId") + "]").text();
        var detail = provinceName == cityName ? cityName+countyName : provinceName+cityName+countyName;
        var address = detailAddress.replace(detail,"");
        $("#txtAddress").val(address);
    }
};

vendorUserNameBind = function () {
    $("#txtVendorCode").blur(function () {
        var vendorCode = $(this).val();
        $("#txtshopname").val(vendorCode);
    });
}