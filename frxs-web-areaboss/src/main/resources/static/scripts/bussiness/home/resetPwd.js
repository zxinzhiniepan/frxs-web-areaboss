$(function () {
    $("#btnSave").click(function () {
        savePwd();
    });
});

function savePwd() {
    // debugger;

    if ($("#pwd").val() == undefined || $.trim($("#pwd").val()) == "") {
        window.top.$.messager.alert("提示", "密码为空，请确认！", "warning", "");
        return false;
    }
    if ($("#newPwd").val() == undefined || $.trim($("#newPwd").val()) == "") {
        window.top.$.messager.alert("提示", "新密码为空，请确认！", "warning", "");
        return false;
    }
    if ($("#rePwd").val() == undefined || $.trim($("#rePwd").val()) == "") {
        window.top.$.messager.alert("提示", "再一次输入新密码为空，请确认！", "warning", "");
        return false;
    }
    var pwd = $("#pwd").val();
    var pass1V= $("#newPwd").val();
    var pass2V=$("#rePwd").val();

    if(checkRegexp(pwd,pass1V)) {
        if (pwd == pass1V) {
            window.top.$.messager.alert("提示", "新密码和旧密码不能相同，请确认！", "warning", "");
            return false;
        }
    }else{
        window.top.$.messager.alert("提示", "密码格式为a-zA-Z0-9 6-12位，请确认！", "warning", "");
        return false;
    }

    if(checkRegexp(pass1V,pass2V)) {
        if (pass1V != pass2V) {
            window.top.$.messager.alert("提示", "两次密码输入不一致，请确认！", "warning", "");
            return false;
        }
    }else{
        window.top.$.messager.alert("提示", "密码格式为a-zA-Z0-9 6-12位，请确认！", "warning", "");
        return false;
    }


    var req = {
        pwd: pwd,
        newPwd: pass1V
    };
    //pageList.grid.getSelected().serialize() + "&StatusCode=" + auditRes + "&Remark=" + auditDes;
    xsjs.ajax({
        url: "/resetPwd",
        data: req,
        type: "POST",
        loadMsg: "正在保存数据，请稍候...",
        success: function (data) {
            if (data.rspCode == "success") {
                window.top.$.messager.alert("温馨提示", data.rspDesc, "info");
                if (window.frameElement.wapi && window.frameElement.wapi.pageList) {
                    window.frameElement.wapi.pageList.loadList();
                }
                else {

                }
                xsjs.pageClose();
            } else {
                window.top.$.messager.alert("提示", data.rspDesc, "warning", "");
            }
        },
        error: function () {
        }
    });
}

//验证密码为a-zA-Z0-9 6-12位
function checkRegexp(passVal1,passVal2){
    if(passVal1.length<6||passVal1.length>12){return false;}
    var regexp=/^([0-9a-zA-Z])+$/;
    if(!(regexp.test(passVal1))){return false;}
    return true;
}