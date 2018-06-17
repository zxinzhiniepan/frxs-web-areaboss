
$(function () {
    storeWithdrawal.init();
    $("#formTable").tabs({
            onSelect: function (title, index) {
                if (index == 1 && pageList.grid == null) {
                    pageList.init();
                }
            }
        }
    );
});

var storeWithdrawal = {
    pageParam: null,
    init: function () {
        this.pageParam = xsjs.SerializeURL2Json();
        this.resize();

        $("#btnSave").click(function () {
            storeWithdrawal.saveInfo();
        });

        $("#radio1").click(function () {
            storeWithdrawal.hideFirstCheckDesc();
        });
        $("#radio2").click(function () {
            storeWithdrawal.showFirstCheckDesc();
        });


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
        if (!$("#myform").form('validate')) {
            return;
        }
        //提现单号
        var listWithdrawNo=[];
        listWithdrawNo.push($("#storeWithdrawalsId").val());
        var desc = "";
        var sWithdrawalsStatusCode;
        var sWithdrawalsStatusText;

        var radioAudit = $("#radio1").prop("checked");
        if (radioAudit == "checked" || radioAudit == true) {
            sWithdrawalsStatusCode = "FIRSTCHECK_PASS";
            sWithdrawalsStatusText = "审核通过(待复核)";
        } else {
            sWithdrawalsStatusCode = "FIRSTCHECK_REJECT";
            sWithdrawalsStatusText = "审核驳回";
            desc = $("#auditRemarks").val();
        }
        window.top.$.messager.confirm("提示", "确定审核" + (sWithdrawalsStatusCode=="FIRSTCHECK_PASS"?"通过":"驳回") + "？", function (r) {
            if(r) {
                xsjs.ajax({
                    url: contextPath + "/financialAudit/storeWithdrawalsAudit?listWithdrawNo="+ listWithdrawNo +"&status="+ sWithdrawalsStatusCode +"&desc="+ desc,
                    type: "POST",
                    loadMsg: "正在保存数据，请稍候...",
                    success: function (data) {
                            var message ="";
                            if(data.listSuccessAuditRet.length > 0){
                                message = "单号：" + data.listSuccessAuditRet[0].withdrawNo + "," + data.listSuccessAuditRet[0].rspDesc;
                            }else if(data.listFailAuditRet.length > 0){
                                message = "单号：" + data.listFailAuditRet[0].withdrawNo + ",失败原因：" + data.listFailAuditRet[0].rspDesc;
                            }
                            else{
                                message = "审核失败";
                            }
                            window.top.$.messager.alert("温馨提示",message , data.success == true ? "info" : "error");
                            if (data.success == true) {
                                if (window.frameElement.tabs.wapi && window.frameElement.tabs.wapi.pageList) {
                                    window.frameElement.tabs.wapi.pageList.loadList();
                                }
                                xsjs.pageClose();
                            }
                    }
                });
            }
        });
    },
    hideFirstCheckDesc:function () {
        $("#checkDescLi").hide();
    },
    showFirstCheckDesc:function () {
        $("#checkDescLi").show();
    }
};

var pageList = {
    //绑定的数据列表
    grid: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
            },
            body: $("#track"),
            edit: {
            },

            //数据列表选项
            datagrid: {
                url: contextPath + "/financialAudit/getStoreWithdrawalsTrackList",
                queryParams: {
                    storeWithdrawNo: xsjs.SerializeDecodeURL2Json().storeWithdrawNo
                },
                fitColumns: false,
                columns: [[
                    { field: 'tmCreate', title: '时间', align: 'center', width: 150},
                    { field: 'createUserName', title: "操作人员", align: 'center', width: 120 },
                    { field: 'trackStatusName', title: "状态", align: 'center', width: 120 },
                ]]
            }
        };

        this.grid = xsjs.datagrid(options);
    }
};