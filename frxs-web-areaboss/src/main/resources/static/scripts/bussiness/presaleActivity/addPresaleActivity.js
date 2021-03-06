var listProduct = [];
var addPresaleActivity = {
    productList: listProduct,
    params: null,
    init: function () {
        this.params = xsjs.SerializeURL2Json();
        if (window.frameElement && $(window.frameElement)) {
            var frameData = $(window.frameElement).data();
            if (frameData && frameData.easyuiWindow && frameData.easyuiWindow == true) {
                $("#divBottomButton").addClass("xs-form-bottom").removeClass("divBottomButton");
                $("#divBottom").addClass("xs-form-bottom-right");
                $(window).trigger("resize");
            }
        }
        this.loadProduct();
        this.bindDateTime();
    },
    //活动区域全选状态设置
    areaSelectStatus: function () {
        var tableRegion = $("#tableRegion");
        if (tableRegion.find("input[id!='Region_All']").length != tableRegion.find("input[id!='Region_All']:checked").length) {
            $("#Region_All").removeProp("checked");
        }
        else {
            $("#Region_All").prop("checked", "checked");
        }
    },
    del: function (index, evt) {
        xsjs.stopPropagation(evt);
    },
    //选择商品
    selectProduct: function () {
        xsjs.window({
            title: "选择商品",
            url: contextPath+"/products/selectProductList",
            owdoc: window.top,
            maxWidth: 1200,
            modal: true
        });
    },
    //保存数据
    save: function () {

        $('#divProduct').datagrid('endEdit', addPresaleActivity.productEditListIndex);
        addPresaleActivity.productEditListIndex = -1;

        var listDisabled = $("input:disabled");
        listDisabled.each(function () {
            $(this).removeAttr("disabled");
        });
        var presaleActivityName = $("#PresaleActivityName");
        if ($.trim(presaleActivityName.val()) == 0) {
            window.top.$.messager.alert("温馨提示", "请填写活动名称!", "warning", function () { presaleActivityName.focus() });
            return;
        }

/*        if (!xsjs.validator.IsChinaOrNumbOr_Lett(presaleActivityName.val().trim())) {
            window.top.$.messager.alert("温馨提示", "活动名称格式不正确!", "warning", function () { presaleActivityName.focus() });
            return;
        }*/

        var expiryDateStart = $("#ExpiryDateStart");
        if ($.trim(expiryDateStart.val()) == 0) {
            window.top.$.messager.alert("温馨提示", "请选择购买起始时间!", "warning", function () { expiryDateStart.focus() });
            return;
        }

        var expiryDateEnd = $("#ExpiryDateEnd");
        if ($.trim(expiryDateEnd.val()) == 0) {
            window.top.$.messager.alert("温馨提示", "请选择购买截止时间!", "warning", function () { expiryDateEnd.focus() });
            return;
        }

        var deliveryTime = $("#DeliveryTime");
        if ($.trim(deliveryTime.val()) == 0) {
            window.top.$.messager.alert("温馨提示", "请选择提货时间!", "warning", function () { deliveryTime.focus() });
            return;
        }

        if (new Date(expiryDateStart.val()) > new Date(expiryDateEnd.val())) {
            window.top.$.messager.alert("温馨提示", "购买起始时间不能大于截止时间!", "warning", function () { });
            return;
        }

        if (new Date(deliveryTime.val()) <= new Date(expiryDateEnd.val())) {
            window.top.$.messager.alert("温馨提示", "提货时间不能小于活动截止时间!", "warning", function () { });
            return;
        }

        var showStartTime = $("#ShowStartTime");
        if (new Date(showStartTime.val()) > new Date(expiryDateStart.val())) {
            window.top.$.messager.alert("温馨提示", "显示起始时间不能大于购买起始时间!", "warning", function () { });
            return;
        }

        var showEndTime = $("#ShowEndTime");
        if (new Date(showEndTime.val()) < new Date(expiryDateEnd.val())) {
            window.top.$.messager.alert("温馨提示", "显示截止时间不能小于购买截止时间!", "warning", function () { });
            return;
        }

        if (addPresaleActivity.productList == null || addPresaleActivity.productList.length == 0) {
            window.top.$.messager.alert("温馨提示", "请选择要参加活动的商品!", "warning");
            return;
        }
        else {
            for (var pi = 0; pi < addPresaleActivity.productList.length; pi++) {
                var itemProduct = addPresaleActivity.productList[pi];

                if (!itemProduct.limitQty && itemProduct.limitQty != "0") {
                    window.top.$.messager.alert("温馨提示", "请填写【" + itemProduct.productName + "】的商品限订数量!", "warning");
                    return;
                }

                if (parseFloat(itemProduct.limitQty) < 0) {
                    window.top.$.messager.alert("温馨提示", "【" + itemProduct.productName + "】的限订数量不能小于0，限订数量为0不限购!", "warning");
                    return;
                }

                if (parseFloat(itemProduct.limitQty) > 0 && parseFloat(itemProduct.userLimitQty) > 0 && parseFloat(itemProduct.limitQty) < parseFloat(itemProduct.userLimitQty)) {
                    window.top.$.messager.alert("温馨提示", "【" + itemProduct.productName + "】的用户限订数量不能大于商品限订数量!", "warning");
                    return;
                }

                if (!itemProduct.saleAmt || parseFloat(itemProduct.saleAmt) <= 0) {
                    window.top.$.messager.alert("温馨提示", "【" + itemProduct.productName + "】的价格不能为空!", "warning");
                    return;
                }

                if (!itemProduct.marketAmt || parseFloat(itemProduct.marketAmt) <= 0) {
                    window.top.$.messager.alert("温馨提示", "【" + itemProduct.productName + "】的市场价不能为空!", "warning");
                    return;
                }

                if (parseFloat(itemProduct.marketAmt) < parseFloat(itemProduct.saleAmt)) {
                    window.top.$.messager.alert("温馨提示", "【" + itemProduct.productName + "】的商品价格应小于或等于市场价格!", "warning");
                    return;
                }

                if (!itemProduct.perServiceAmt && itemProduct.perServiceAmt != "0") {
                    window.top.$.messager.alert("温馨提示", "请填写【" + itemProduct.productName + "】的平台服务费!", "warning");
                    return;
                }

                if (parseFloat(itemProduct.saleAmt) <= parseFloat(itemProduct.perServiceAmt)) {
                    window.top.$.messager.alert("温馨提示", "【" + itemProduct.productName + "】的平台服务费应小于价格!", "warning");
                    return;
                }

                if (!itemProduct.perCommission && itemProduct.perCommission != "0") {
                    window.top.$.messager.alert("温馨提示", "请填写【" + itemProduct.productName + "】的门店提成!", "warning");
                    return;
                }

                if (parseFloat(itemProduct.perCommission) <= 0) {
                    window.top.$.messager.alert("温馨提示", "【" + itemProduct.productName + "】门店提成应大于0!", "warning");
                    return;
                }
                if (parseFloat(itemProduct.saleAmt) <= parseFloat(itemProduct.perCommission)) {
                    window.top.$.messager.alert("温馨提示", "【" + itemProduct.productName + "】的门店每份提成应小于价格!", "warning");
                    return;
                }

                if (parseFloat(itemProduct.saleAmt) <= parseFloat(itemProduct.perCommission) + parseFloat(itemProduct.serviceAmt)) {
                    window.top.$.messager.alert("温馨提示", "【" + itemProduct.productName + "】的门店每份提成<span style='color: red;'>加</span>平台服务费应小于价格!", "warning", function () {
                    });
                    return;
                }
            }
        }

        var saveData = xsjs.SerializeDecodeURL2Json($(".xs-form-table").find("input,select").serialize(), true);
        if (!(+new Date(saveData.tmBuyStart) > 0)) {
            window.top.$.messager.alert("温馨提示", "购买起始时间格式不正确!", "warning");
            return;
        }

        if (!(+new Date(saveData.tmBuyEnd) > 0)) {
            window.top.$.messager.alert("温馨提示", "购买截止时间格式不正确!", "warning");
            return;
        }

/*        if (+new Date(saveData.tmBuyStart) < +new Date()) {
            window.top.$.messager.alert("温馨提示", "购买起始时间不能小于当前时间!", "warning");
            return;
        }*/

        if (saveData.tmDisplayStart && !(+new Date(saveData.tmDisplayStart) > 0)) {
            window.top.$.messager.alert("温馨提示", "显示起始时间格式不正确!", "warning");
            return;
        }

        if (saveData.tmDisplayEnd && !(+new Date(saveData.tmDisplayEnd) > 0)) {
            window.top.$.messager.alert("温馨提示", "显示截止时间格式不正确!", "warning");
            return;
        }

        ///当商品无排序编号时默认为0
        for (var productSort = 0; productSort < this.productList.length; productSort++) {
            this.productList[productSort].sortSeq = this.productList[productSort].sortSeq || 0;
            this.productList[productSort].userLimitQty = this.productList[productSort].userLimitQty && $.trim(this.productList[productSort].userLimitQty).length > 0 ? this.productList[productSort].userLimitQty : 0;
        }

        saveData.preproductArry = JSON.stringify(this.productList);

        $.ajax({
            url: contextPath+"/activity/addActivity",
            data: saveData,
            loadMsg: "正在保存活动信息，请稍候...",
            success: function (data) {
                window.top.$.messager.alert("温馨提示", data.rspDesc, (data.rspCode == "success" ? "info" : "error"), function () {
                    if (data.rspCode == "success") {
                        if (window.frameElement.wapi) {
                            window.frameElement.wapi.pageList.loadList();
                        }
                        xsjs.pageClose();
                    }
                });
            },
            error: function () {

            }
        });

        listDisabled.each(function () {
            $(this).attr("disabled", "disabled");
        });
    },
    productEditListIndex: -1,
    //重新加载商品
    loadProduct: function () {

        if (addPresaleActivity.productEditListIndex >= 0) {
            $('#divProduct').datagrid('endEdit', addPresaleActivity.productEditListIndex);
            addPresaleActivity.productEditListIndex = -1;
        }

        var dataColumns = [[
            { field: 'sku', title: '商品编码', width: 120, align: 'center' },
            { field: 'productName', title: '商品名称', width: 200 },
            { field: 'imgUrl120', title: 'img', width: 55, hidden: 'true' },
            { field: 'attrs', title: '规格', width: 70, align: 'center', formatter: function (value) {
                    if(value!=null){
                        return value[0].attrVal;
                    }
                } },
            { field: 'packageQty', title: '包装数', width: 40, align: 'center' },
            { field: 'vendorCode', title: '供应商编码', width: 65, align: 'center' },
            { field: 'vendorName', title: '供应商名称', width: 100 },
            { field: 'sortSeq', title: '商品排序', width: 55, editor: { type: "numberbox", options: { precision: 0, min: 0, max: 999999 } } },
            { field: 'limitQty', title: '限订数量', width: 55, editor: { type: 'numberbox', options: { precision: 0, min: 0, max: 999999 } }, align: 'right' },
            { field: 'userLimitQty', title: '用户限订数量', width: 75, editor: { type: 'numberbox', options: { precision: 0, min: 0, max: 999999 } }, align: 'right' },
            { field: 'saleAmt', title: '价格', width: 65, editor: { type: 'numberbox', options: { precision: 2, max: 99999999.99 } }, align: 'right' },
            { field: 'marketAmt', title: '市场价', width: 65, editor: { type: 'numberbox', options: { precision: 2, max: 99999999.99 } }, align: 'right' },
            { field: 'perServiceAmt', title: '平台服务费', width: 65, editor: { type: 'numberbox', options: { precision: 2, max: 99999999.99 } }, align: 'right' },
            { field: 'perCommission', title: '门店每份提成', width: 80, editor: { type: 'numberbox', options: { precision: 2, max: 99999999.99 } }, align: 'right' },
            {
                field: 'directMining', title: '是否直采', width: 55, editor: {
                    type: 'checkbox', options: {
                        on: "TRUE",
                        off: "FALSE"
                    }
                }, formatter: function (value, rowData, index) {
                    if (value == "TRUE") {
                        return "是";
                    }
                }
                , align: 'center'
            },
            { field: 'saleLimitTime', title: '售后期限', width: 90, formatter: function (value,rowData,index) {
                    if(rowData.saleLimitTime!=null&&rowData.saleLimitTimeUnit!=null){
                        return rowData.saleLimitTime+"("+(rowData.saleLimitTimeUnit=="DAY"?"天":"小时")+")";
                    }
                }},
            {
                field: 'datagrid-action', title: '操作', formatter: function (value, rowData, index) {
                    var del = "";
                    del = '<a href="javascript:void(0);" onclick="addPresaleActivity.removeProduct(' + rowData.productId + ', event)">移除</a>';
                    return del;
                }
            }
        ]];

        $("#divProduct").datagrid({
            idField: 'productId',         //主键
            data: this.productList,
            title: "已选择的商品",
            singleSelect: true,
            height:200,
            columns: dataColumns,

            onClickRow: function (rowIndex) {
                //alert(0);
                if (addPresaleActivity.productEditListIndex != rowIndex) {
                    $('#divProduct').datagrid('endEdit', addPresaleActivity.productEditListIndex);
                    $('#divProduct').datagrid('beginEdit', rowIndex);
                }
                addPresaleActivity.productEditListIndex = rowIndex;
            }
        });

        $(".datagrid-body").css("overflow-x", "scroll");

    },
    //移除商品
    removeProduct: function (productId, evt) {

        if (addPresaleActivity.productEditListIndex >= 0) {
            $('#divProduct').datagrid('endEdit', addPresaleActivity.productEditListIndex);
        }

        if (evt) {
            xsjs.stopPropagation(evt);
        }
        var removeProduct = $.grep(this.productList, function (item, index) {
            return item.productId == productId;
        });

        for (var i = 0; i < this.productList.length; i++) {
            if (this.productList[i].productId == productId) {
                this.productList.splice(i, 1);
                break;
            }
        }

        this.loadProduct();
    },
    ///时间选择事件
    bindDateTime: function () {
        ///有效期开始时间
        $("#ExpiryDateStart").focus(function () {
            expiryDateStartInput();
        });

        $("#ExpiryDateStart").click(function () {
            expiryDateStartInput();
        });

        //有效期截止时间
        $("#ExpiryDateEnd").focus(function () {
            expiryDateEndInput();
        });

        $("#ExpiryDateEnd").click(function () {
            expiryDateEndInput();
        });

        //提货日期
        $("#DeliveryTime").focus(function () {

            deliveryTimeInput();
        });

        //提货日期
        $("#DeliveryTime").click(function () {

            deliveryTimeInput();
        });

        ///有效期开始时间
        $("#ShowStartTime").focus(function () {
            showStartTimeInput();
        });

        $("#ShowStartTime").click(function () {
            showStartTimeInput();
        });

        //有效期截止时间
        $("#ShowEndTime").focus(function () {
            showEndTimeInput();
        });

        $("#ShowEndTime").click(function () {
            showEndTimeInput();
        });
    }
};

$(function () {
    addPresaleActivity.init();

    $("#btnSelectProduct").click(function () {
        addPresaleActivity.selectProduct();
    });

    $("#btnSave").click(function () {
        addPresaleActivity.save();
    });

    $("input[name='PayRules']").click(function () {
        if (this.value == "1") {
            $("#liPayTail").hide();
            $("#liPresalePercent").hide();
        }
        else {
            $("#liPayTail").show();
            $("#liPresalePercent").show();
        }
    });
});