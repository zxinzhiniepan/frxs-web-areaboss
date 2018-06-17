
$(function () {
    storeAudit.init();
});

var storeAudit = {
    pageParam: null,
    // ids: null,
    nos: null,
    formData: null,
    init: function () {
        this.pageParam = xsjs.SerializeURL2Json();

        $("#radio1").click(function () {
            $("#checkDescLi").hide();
        });
        $("#radio2").click(function () {
            $("#checkDescLi").show();
        });

        $("#btnSave").click(function () {
            storeAudit.saveInfo();
        });
    },
    saveInfo: function () {
        if (!$("#myform").form('validate')) {
            return;
        }

        //驳回描述
        var desc;
        var sWithdrawalsStatusCode;
        //申请单号list
        var listWithdrawNo = window.frameElement.wapi.pageList.grid.getSelected().serialize().replace(/&storeWithdrawNo=/g, ',').replace(/storeWithdrawNo=/g, '');
        // .split(',');

        var radioAudit = $("#radio1").prop("checked");
        if (radioAudit == "checked" || radioAudit == true) {
            sWithdrawalsStatusCode = "FIRSTCHECK_PASS";
            sWithdrawalsStatusText = "审核通过(待复核)";
        } else {
            sWithdrawalsStatusCode = "FIRSTCHECK_REJECT";
            sWithdrawalsStatusText = "审核驳回";
        }

        this.formData = {
            status : sWithdrawalsStatusCode,
            listWithdrawNo : listWithdrawNo,
            desc: sWithdrawalsStatusCode == "FIRSTCHECK_PASS" ? "" : $("#firstCheckDesc").val()
        };

        window.top.$.messager.confirm("提示", "确定审核" + (sWithdrawalsStatusCode == "FIRSTCHECK_PASS" ? "通过" : "驳回") + "？", function (r) {
            if (r) {
                storeAudit.repeated();
            }
        });
    },
    repeated: function () {
        xsjs.ajax({
            url: contextPath + "/financialAudit/storeWithdrawalsAudit",//?listWithdrawNo="+ this.formData.listWithdrawNo +"&status="+ this.formData.status +"&desc="+ this.formData.desc,
            data: this.formData,
            type: "POST",
            //loadMsg: "当前正在初审“" + no + "”单据，请稍候...",
            loadMsg: "正在审核，请稍候...",
            success: function (data) {
                var message ="";
                if(data.listFailAuditRet.length > 0){
                    message ="</br>" +  data.successCnt + "条记录处理成功," + data.failCnt  + "条记录处理失败!失败记录如下：</br>"
                    for(var i=0;i<data.listFailAuditRet.length;i++){
                        for(var i=0;i<data.listFailAuditRet.length;i++){
                            message += "单号：" + data.listFailAuditRet[i].withdrawNo + ",失败原因：" + data.listFailAuditRet[i].rspDesc + ";</br>";
                        }
                    }
                }else{
                    message = data.listSuccessAuditRet.length + "条记录全部处理成功!";
                }
                window.top.$.messager.alert("温馨提示",message , data.success == true ? "info" : "error");
                if (data.success == true) {
                    window.frameElement.wapi.pageList.loadList();
                    xsjs.pageClose();
                }
            }
        });
    }
}