var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
               // kid: "ID",
                //del: "/SmsData/SmsDataList"
            },
            edit: {

            },
            //导航选项
            //nav: ["首页", "系统管理"],
            //搜索栏选项
            search: [
                { text: "手机号码", attributes: { name: "phoneNum" } },
               
                 {
                     text: "发送时间", type: "date", attributes: {
                         id: 'txtDateStart',
                         name: "tmSendStart",
                         // value: yesterdayDate,
                         onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'#F{$dp.$D(\\\'txtExpiryDateEnd\\\')}'})"
                     }, column: 2
                 },
                {
                    text: "&nbsp&nbsp至&nbsp&nbsp", type: "date", attributes: {
                        id: "txtExpiryDateEnd",
                        name: "tmSendEnd",
                        // value: newDate,
                        onfocus: "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'#F{$dp.$D(\\\'txtDateStart\\\')}'})"
                    }
                },
                { type: "<br/>" },
                 {
                     text: "短信类型", type: "select", attributes: { name: "smsType" },
                     option: [
                         { text: "全部", value: "" },
                         { text: "找回密码", value: "FINDPWD" },
                         { text: "修改密码", value: "UPDATEPWD" },
                         { text: "登录验证码", value: "LOGIN" },
                         { text: "提现", value: "WITHDRAWAL" }
                     ]
                 },
                {
                    text: "发送状态", type: "select", attributes: { name: "smsStatus" },
                     option: [
                         { text: "全部", value: "" },
                         { text: "失败", value: "SENDFAIL" },
                         { text: "发送成功", value: "SENDED" },
                         { text: "已使用", value: "USED" }
                     ]
                 }
               

            ],
            //数据列表选项
            datagrid: {
                url: contextPath+'/sms/getSmsList',
                fitColumns: false,
                idField: 'id',         //主键
                //singleSelect: true,
                columns: [[
                    { field: 'phoneNum', title: '手机号码', width: 85, align: 'center' },
                    { field: 'content', title: '短信内容', width: 340, align: 'left' },
                    { field: 'verificationCode', title: '验证码', align: 'center', width: 80 },
                    {
                        field: 'tmSend', title: '发送时间', width: 150, align: 'center', formatter: function (value) {
                            return value;
                        }
                    },
                   
                    { field: 'smsStatus', title: '短信状态', align: 'center', width: 80, formatter: function (value) {
                            if(value == "SENDED"){
                                return "发送成功";
                            }else if(value == "USED"){
                                return "已使用";
                            }else if(value == "SENDFAIL"){
                                return "发送失败";
                            }
                        } },
                    { field: 'smsType', title: '验证码类型', align: 'center', width: 100, formatter: function (value) {
                            if(value == "FINDPWD"){
                                return "找回密码";
                            }else if(value == "UPDATEPWD"){
                                return "修改密码";
                            }else if(value == "LOGIN"){
                                return "登录验证码";
                            }else{
                                return "体现"
                            }
                        } }
                   
                ]]
                // xsTdAction: xsTdAction
            },
            //toolbar: toolbarArray
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    }
  
};

$(function () {
    pageList.init();
});

