

$(function () {
    editProducts.init();

    $("#formTable").tabs({
            onSelect: function (title, index) {
                if (index == 1 && pageList.grid == null) {
                    pageList.init();
                }
            }
        }
    );
    var txtStatus = $("#txtStatus").val();
    if(txtStatus =="FIRSTCHECK_REJECT"){
        $("#firstcheck_reject").show();
    }else if(txtStatus == "FIRSTCHECK_PASS"){
        $("#nonFirstcheck_reject").show();
    }else if(txtStatus == "STORE_APP"||txtStatus == "CUSTOMSERVICE_CLOSE"||txtStatus == "CONSUMER_CLOSE"){

    }else if(txtStatus == "READY" ||txtStatus == "SUCCESS" ||txtStatus == "FAIL"||txtStatus == "AUDIT_REJECT"){
        $("#nonFirstcheck_reject").show();
        $("#auditDesc").show();
    }
});
var editProducts = {
    pageParam: null,
    init: function () {
        this.pageParam = xsjs.SerializeURL2Json();
        this.resize();
        $("#btnSave").click(function () {
            editProducts.saveInfo();
        });
        $("input[name='radiobutton']").click(function () {
            var radiobuttonVal = $("input[name='radiobutton']:checked").val();
            if (radiobuttonVal == "0") {
                $(".auditLi").show();
            }
            else {
                $(".auditLi").hide();
            }
        })

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






};

function formatState(value, rec) {
    if (!value) {
        return;
    }
    if (value == "INIT") {
        return '待创建批划付文件';
    }
    else if (value == "READY") {
        return "待划账";
    }
    else if (value == "REMITTING") {
        return "划付中";
    }
    else if (value == "SUCCESS") {
        return "划付成功";
    }
    else if (value == "FAIL") {
        return "划付失败";
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
                ]]

                // xsTdAction: xsTdAction
            }
            //, toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    }
};