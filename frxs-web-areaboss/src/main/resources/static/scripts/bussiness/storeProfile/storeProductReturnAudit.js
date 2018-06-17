

$(function () {
    $("#cFirstCheckReasonTypeText").hide();
    $('#cFirstCheckReasonTypeText').validatebox('disableValidation')


    editProducts.init();

    $("#formTable").tabs({
            onSelect: function (title, index) {
                if (index == 1 && pageList.grid == null) {
                    pageList.init();
                }
            }
        }
    );
    $("#Track").height($(window).height() - 210);
});

var editProducts = {
    pageParam: null,
    init: function () {
        this.pageParam = xsjs.SerializeURL2Json();
        this.resize();
        $("#btnSave").click(function () {
            setTimeout( editProducts.saveInfo(),100);
        });
        $("input[name='radiobutton']").click(function () {
            var radiobuttonVal = $("input[name='radiobutton']:checked").val();
            if (radiobuttonVal == "0") {
                $(".auditLi").show();
                $("#lbFirstCheckDesc").html("审核留言")
            }
            else {
                $(".auditLi").hide();
                $("#lbFirstCheckDesc").html("驳回留言")
            }
        });

        $("#ddlFirstCheckReasonTypeCode").combobox({
            onSelect: function () {
                var newPtion = $("#ddlFirstCheckReasonTypeCode").combobox('getValue')
                if (newPtion == "13") {
                    $("#cFirstCheckReasonTypeText").show();
                    $('#cFirstCheckReasonTypeText').validatebox('enableValidation');
                }
                else {
                    $("#cFirstCheckReasonTypeText").hide();
                    $('#cFirstCheckReasonTypeText').validatebox('disableValidation');
                }
            }
        })
        var firstCheckSumAmt = 0;
        var firstCheckVendorAmt = 0;
        var firstCheckServicesFeeAmount = 0;
        var firstCheckCommissionAmount = 0;
        //$("#txtFirstCheckPayAmount").onchage(function () {

        //})
        $("#txtFirstCheckPayAmount").numberbox({
            "onChange": function () {
                $("#txtFirstCheckSumAmount").numberbox('setValue', parseFloat($("#txtFirstCheckPayAmount").numberbox('getValue')) + parseFloat($("#txtFirstCheckServicesFeeAmount").numberbox('getValue')) + parseFloat($("#txtFirstCheckCommissionAmount").numberbox('getValue')));
            }
        });
        $("#txtFirstCheckServicesFeeAmount").numberbox({
            "onChange": function () {
                $("#txtFirstCheckSumAmount").numberbox('setValue', parseFloat($("#txtFirstCheckPayAmount").numberbox('getValue')) + parseFloat($("#txtFirstCheckServicesFeeAmount").numberbox('getValue')) + parseFloat($("#txtFirstCheckCommissionAmount").numberbox('getValue')));
            }
        });
        $("#txtFirstCheckCommissionAmount").numberbox({
            "onChange": function () {
                $("#txtFirstCheckSumAmount").numberbox('setValue', parseFloat($("#txtFirstCheckPayAmount").numberbox('getValue')) + parseFloat($("#txtFirstCheckServicesFeeAmount").numberbox('getValue')) + parseFloat($("#txtFirstCheckCommissionAmount").numberbox('getValue')));
            }
        });
        //.on('change', function () {

        //    firstCheckVendorAmt = $("#txtFirstCheckPayAmount").val();
        //    firstCheckServicesFeeAmount = $("#txtFirstCheckServicesFeeAmount").val();
        //    firstCheckCommissionAmount = $("#txtFirstCheckCommissionAmount").val();
        //    $("#txtFirstCheckSumAmount").val( firstCheckVendorAmt + firstCheckServicesFeeAmount + firstCheckCommissionAmount);
        //});
        //$("#txtFirstCheckServicesFeeAmount").change(function () {
        //    firstCheckVendorAmt = $("#txtFirstCheckPayAmount").val();
        //    firstCheckServicesFeeAmount = $("#txtFirstCheckServicesFeeAmount").val();
        //    firstCheckCommissionAmount = $("#txtFirstCheckCommissionAmount").val();
        //    $("#txtFirstCheckSumAmount").val(firstCheckVendorAmt + firstCheckServicesFeeAmount + firstCheckCommissionAmount);
        //});
        //$("#txtFirstCheckCommissionAmount").on(function () {
        //    firstCheckVendorAmt = $("#txtFirstCheckPayAmount").val();
        //    firstCheckServicesFeeAmount = $("#txtFirstCheckServicesFeeAmount").val();
        //    firstCheckCommissionAmount = $("#txtFirstCheckCommissionAmount").val();
        //    $("#txtFirstCheckSumAmount").val(firstCheckVendorAmt + firstCheckServicesFeeAmount + firstCheckCommissionAmount);
        //});

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


    //保存
    saveInfo: function () {

        //easyUI表单校验
        var isValidate = $("#productInfo").form("validate");



        var formData = xsjs.SerializeDecodeURL2Json($("#productInfo").find("input, textarea, select").serialize(), true);
        formData.firstCheckReasonTypeText = $('#ddlFirstCheckReasonTypeCode').combobox('getText');
        if (formData.radiobutton == 0) {
            formData.status = "FIRSTCHECK_PASS";
            formData.statusName = "初审通过";
        }
        else {
            formData.status = "FIRSTCHECK_REJECT";
            formData.statusName = "初审驳回";
            formData.firstCheckVendorAmt = "0.00" ;
            formData.firstCheckServicesFeeAmt = "0.00" ;
            formData.firstCheckStoreAmt = "0.00" ;
            formData.firstCheckSumAmt = "0.00" ;
        }

        if (isValidate||formData.radiobutton == 1) {
            if ((!formData.firstCheckReasonType || formData.firstCheckReasonType == 0) && formData.radiobutton == 0) {
                window.top.$.messager.alert("温馨提示", "请选择售后类型!", "warning", function () {

                });
                return;
            }

            //if (!formData.FirstCheckDesc || formData.FirstCheckDesc == "") {
            //    window.top.$.messager.alert("温馨提示", "请输入留言!", "warning", function () {
            //    });
            //    return;
            //}
            if (formData.radiobutton == 1) {
                formData.firstCheckReasonType = "";
                formData.firstCheckReasonTypeText = "";
            }
            else {

                if (parseFloat(formData.firstCheckQty) > parseFloat($("#shipmentQty").html())) {
                    window.top.$.messager.alert("温馨提示", "售后数量不能大于订单订货数量!", "warning", function () {
                        $("input[name='firstCheckQty']").prev().focus();
                    });
                    return;
                }

                if (parseFloat(formData.firstCheckQty) <= 0) {
                    window.top.$.messager.alert("温馨提示", "售后数量不能小于等于零!", "warning", function () {
                        $("input[name='firstCheckQty']").prev().focus();
                    });
                    return;
                }

                if (parseFloat(formData.firstCheckSumAmt) <= 0) {
                    window.top.$.messager.alert("温馨提示", "售后合计金额不能小于等于零!", "warning", function () {
                        $("input[name='firstCheckSumAmt']").prev().focus();
                    });
                    return;
                }

                if (parseFloat(formData.firstCheckVendorAmt) > (Math.round(parseFloat($("#singleVendorAmt").html()) * 100) * Math.round(parseFloat(formData.firstCheckQty) * 100)) / 10000) {
                    window.top.$.messager.alert("温馨提示", "供应商货款不能大于订单供应商货款!", "warning", function () {
                        $("input[name='firstCheckVendorAmt']").prev().focus();
                    });
                    return;
                }
/*                if (parseFloat(formData.firstCheckServicesFeeAmt) > (parseFloat($("#singleServicesFeeAmt").html()) * parseFloat(formData.firstCheckQty))) {
                    window.top.$.messager.alert("温馨提示", "平台服务费不能大于订单平台服务费!", "warning", function () {
                        $("input[name='firstCheckVendorAmt']").prev().focus();
                    });
                    return;
                }*/


                if (parseFloat(formData.firstCheckStoreAmt) > (Math.round(parseFloat($("#singlesStoreAmt").html()) * 100) * Math.round(parseFloat(formData.firstCheckQty) * 100)) / 10000) {
                    window.top.$.messager.alert("温馨提示", "门店提成金额不能大于订单门店提成金额!", "warning", function () {
                        $("input[name='firstCheckVendorAmt']").prev().focus();
                    });
                    return;
                }
                if (((Math.round(parseFloat($("#productPrice").html()) * 100) * Math.round(parseFloat($("#shipmentQty").html()) * 100))/ 10000) < parseFloat(formData.firstCheckSumAmt)) {
                    window.top.$.messager.alert("温馨提示", "售后合计金额不能大于商品售价金额!", "warning", function () {
                        $("input[name='firstCheckSumAmt']").prev().focus();
                    });
                    return;
                }


            }

            if (formData.firstCheckReasonType == "13" && formData.cFirstCheckReasonTypeText != "") {
                formData.firstCheckReasonTypeText = formData.cFirstCheckReasonTypeText;
            }



            xsjs.ajax({
                url: contextPath+"/storeProfile/auditStoreAfterSale",
                data: formData,
                type: "POST",
                loadMsg: "正在保存数据，请稍候...",
                success: function (data) {
                    window.top.$.messager.alert("温馨提示", data.rspDesc, data.rspCode == "success" ? "info" : "error");

                    if (data.rspCode == "success") {
                        if (!formData.productId || parseInt(formData.productId) == 0) {
                            window.frameElement.wapi.pageList.loadList();
                            xsjs.pageClose();
                        }
                    }
                },
                error: function () {
                }
            });
            //debugger;
        }
        else {
            window.top.$.messager.alert("温馨提示", "请完善必填项!", "warning", function () {

            });
        }

        //formData
    },
};



function formatState(value, rec) {
    if (!value) {
        return;
    }
    if (value == "WAIT_PAY") {
        return '待划账';
    }
    else if (value == "PAY_SUCCESS") {
        return "划付成功";
    }
    else if (value == "PAY_FAIL") {
        return "划付失败";
    }
    else if (value.slice(0, 10) == 'PAY_NEXTED') {
        return "已经转接到下个划付账单";
    }

    else {
        return "未知";
    }
}


var pageList = {
    //绑定的数据列表
    grid: null,
    pageParam: null,
    init: function () {
        this.pageParam = xsjs.SerializeURL2Json();
        var formData = {storeRefundNo: this.pageParam.storerefundno }
        xsjs.ajax({
            url: contextPath+"/storeProfile/getStoreAfterSaleDetails",
            data: formData,
            type: "POST",
            loadMsg: "正在加载数据，请稍候...",
            success: function (data) {
                if (data.rspCode == "success") {
                    var res = data.record;
                    $("#servicesFeeTransferNO").html(res.servicesFeeRemitDetailId == '' || res.servicesFeeRemitDetailId == null ? '暂无' : res.servicesFeeRemitDetailId);
                    $("#payTransferNO").html(res.vendorAmtRemitDetailId == '' || res.servicesFeeRemitDetailId == null ? '暂无' : res.vendorAmtRemitDetailId);
                    $("#commissionTransferNO").html(res.storeAmtRemitDetailId == '' || res.servicesFeeRemitDetailId == null ? '暂无' : res.storeAmtRemitDetailId);
                    $("#commissionTransferStatus").html(res.vendorAmtRemitstatus == '' || res.servicesFeeRemitDetailId == null ? '暂无' :formatState( res.vendorAmtRemitstatus));
                    $("#servicesFeeTransferStatus").html(res.servicesFeeRemitstatus == '' || res.servicesFeeRemitDetailId == null ? '暂无' : formatState(res.servicesFeeRemitstatus));
                    $("#payTransferStatus").html(res.vendorAmtRemitstatus == '' || res.servicesFeeRemitDetailId == null ? '暂无' : formatState(res.vendorAmtRemitstatus));
                }
            },
            error: function () {
            }
        });

        //列表数据
        var options = {
            //数据请求选项
            data: {
                // kid: "AccountID",
                //del: "/VendorAccount/AccountDelete",
                //lock: "/VendorWithdrawals/GetVendorWithdrawalsAuditList",
                //lockField: "IsFrozen"
            },
            body: $("#Track"),
            edit: {

            },
            //导航选项
            //nav: ["财务管理", "供应商提现审核"],
            //搜索栏选项
            //search: [

            //],
            //数据列表选项
            datagrid: {
                url: contextPath+"/storeProfile/getStoreAfterSaleTrackList",
                queryParams: { storeRefundNo: this.pageParam.storerefundno },
                fitColumns: false,
                pagination: false,
                idField: 'storeRefundNo',         //主键
                columns: [[
                    //{ field: 'StoreAfterSaleTrackID', checkbox: false },
                    {
                        field: 'tmCreate', title: '时间', align: 'center', width: 150, formatter: function (value, rows) {
                            return xsjs.dateFormat(value, "yyyy-MM-dd HH:mm:ss")
                        }
                    },
                    { field: 'createUserName', title: "操作人员", align: 'center', width: 120 },
                    { field: 'trackStatusName', title: "状态", align: 'center', width: 120 }
                ]],

                // xsTdAction: xsTdAction
            }
            //, toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    }
};


