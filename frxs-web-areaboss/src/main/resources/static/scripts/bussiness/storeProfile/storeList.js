/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />
var toolbarArray = new Array();
var xsTdAction = new Array();

// 按钮权限控制
var isAdd = null;
var isDel = null;
var isLock = null;
var isExprot = null;
var isEditBank = null;
var isEditRoute = null;
var isBatchDownloadRQ = null;
var isBatchImport = null;

var qrCodeUrl = null;

$(function () {
    isAdd =  XSLibray.authorize(92, 131);
    isDel =  XSLibray.authorize(92, 133);
    isLock =  XSLibray.authorize(92, 132);
    isEditBank =  XSLibray.authorize(92, 135);
    isExprot =  XSLibray.authorize(92, 136);
    isEditRoute =  XSLibray.authorize(92, 134);
    isBatchDownloadRQ =  XSLibray.authorize(92, 271);
    //isBatchImport =  XSLibray.authorize(92, 272);

    if(isAdd){
        toolbarArray.push("添加");
        toolbarArray.push("编辑");
        xsTdAction.push("编辑");

        toolbarArray.push({
            text: "批量导入",
            iconCls: "icon-excel",
            handler: function () {
                pageList.UpLoadStoreList()
            }
        });
    }
    if(isDel){
        xsTdAction.push("删除");
    }

    if(isLock){
        toolbarArray.push("锁定");
        xsTdAction.push("锁定");
    }

    if(isExprot){
        toolbarArray.push({
            action: "导出",             //必填（导出 或 export）
            url: contextPath + "/storeProfile/downloadStoreData"   //必填  下载地址
        });
    }

    if(isEditRoute){
        toolbarArray.push({
            text: '编辑配送线路', iconCls: 'icon-edit', handler: function () {
                pageList.EditStoreLine(pageList.grid)
            }
        });
    }

    if(isEditBank){
        toolbarArray.push({
            text: '编辑银行账户', iconCls: 'icon-edit', handler: function () {
                pageList.EidtStoreBankInfo(pageList.grid)
            }
        });
    }

    if(isBatchDownloadRQ){
        toolbarArray.push("批量下载二维码");
    }
})

function datagridAction(value, rowData) {
    /* return "<a href='/storeProfile/downloadStoreQrCode?storeId=" + rowData.storeId
         + "'>商品分享二维码下载</a>";*/
    return '<a id='+'\"'+rowData.storeId+'\"'+' href="javascript:void(0)" onclick="clickFunc(this)" '
        + 'storeId='+rowData.storeId+' storeName = '+rowData.storeName+' storeCode = '+rowData.storeCode+'>商品分享二维码下载</a>'
}

function clickFunc(obj){
    var _storeId = $(obj).attr("storeId");
    var _storeName = $(obj).attr("storeName");
    var _storeCode = $(obj).attr("storeCode");
    var _text = qrCodeUrl+_storeId;
    $("#download").attr("download",_storeCode+"-"+_storeName+".jpg");
    jQuery('#qrcode').qrcode({width: 300,height: 300,text: _text});

    var canvas = $('#qrcode').find("canvas").get(0);
    var url = canvas.toDataURL('image/jpeg');
    $("#download").attr('href', url).get(0).click();
    $('#qrcode').html('<input type="hidden" id="qrcode" />');
    $("#download").html('<a id="download" download="qrcode.jpg" style="display:none"></a> ');
    return false;
};

var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    init: function () {

        //列表数据
        var options = {
            //数据请求选项
            data: {
                kid: "storeId",
                del: contextPath + "/storeProfile/storeDelete",
                lock: contextPath + "/storeProfile/storeLock",
                batchDownloadQRCode: contextPath + "/storeProfile/batchDownloadStoreQrCode",
                createBatchQRCodeZip: contextPath+"/storeProfile/createBatchQRCodeZip",
                lockField: "storeStatus"
            },
            //导航选项
            nav: ["门店管理"],
            edit: {
                width: 900,
                minHeight: 360,
                maxHeight: 860,
                url: contextPath + "/storeProfile/addStore",
                title: "添加门店",
                editTitle: "编辑门店"
            },
            //搜索栏选项
            search: [
                { text: "门店编号", attributes: { name: "storeCode" } },
                { text: "门店名称", attributes: { name: "storeName" } },
                { text: "门店帐号", attributes: { name: "userName" } },
                { text: "联系人", attributes: { name: "contacts" } },
                {
                    text: "省市区", type: "region",
                    attributes: {
                        provinceClientId: "provinceId",
                        cityClientId: "cityId",
                        countyClientId: "regionId"
                    }
                },

                { type: "<br>" },
                {
                    text: "状态", type: "select", attributes: { name: "storeStatus" },
                    option: [
                        { text: "--全部--", value: "" },
                        { text: "正常", value: "normal" },
                        { text: "冻结", value: "frozen" }
                    ]
                },

                { text: "多次下单次数", type: "number", attributes: { name: "userOrderNumber", value: 2, maxLength: 5 }, option: { min: 1, max: 99999 } },

                {
                    text: "配送线路", type: "select", attributes: { name: "lineId" },
                    data: {
                        url: contextPath + "/distributionLine/listDistributionLineByWarehouseId",
                        data: {
                            IsLock: 0
                        },
                        valueField: "id",
                        textField: "lineName",
                        emptyOption: {
                            value: "",
                            text: "--全部--"
                        }
                    }
                },
                { text: "所属仓库", type: "warehouse",
                    attributes: {
                        name: "listWarehouse",
                        id: "txtListWarehouse",
                        width :140,
                        editable: false
                    },
                    data: {
                        url: contextPath + "/storeProfile/getWarehouselist",
                        valueField: "wareHouseId",
                        textField: "wareHouseName"
                    }
                }

                //,
                //{
                //    text: "提现支付方式", type: "select", attributes: { name: "WithdrawalsMode" },
                //    option: [
                //        { text: "--全部--", value: "" },
                //        { text: "微信提现", value: "1" },
                //        { text: "公司转账", value: "2" },
                //    ]
                //}
            ],
            //数据列表选项
            datagrid: {
                url: contextPath + "/storeProfile/getPageList",
                fitColumns: false,
                idField: 'storeId',         //主键
                //singleSelect: true,
                //sortName: "LineName,LineSort",
                showFooter: true,
                frozenColumns: [[
                    { field: 'storeId', checkbox: true },
                    { field: 'warehouseName', title: '仓库', width: 70, align: 'center', sortable: true },
                    { field: 'lineName', title: '配送线路', width: 70, align: 'center', sortable: true },
                    { field: 'lineSort', title: '顺序', width: 60, align: 'center', sortable: true },
                    { field: 'storeName', title: '门店名称', width: 200, align: 'left', formatter: XSLibray.formatText , formatter:function (value,rowData) {
                            if(!rowData.warehouseName){
                                return "<span style='color:#f00'>"+value+"</span>";
                            }else {
                                return value;
                            }
                        }},
                    { field: 'storeCode', title: '门店编号', width: 100, align: 'center', formatter:function (value,rowData) {
                            if(!rowData.warehouseName){
                                return "<span style='color:#f00'>"+value+"</span>";
                            }else {
                                return value;
                            }
                        }}
                ]],
                columns: [[
                    {
                        field: 'filedNull', title: '门店分享ID', width: 120, align: 'center', formatter: function (value, rowData) {
                            return rowData.storeId;
                        }
                    },
                    { field: 'userName', title: '管理员帐号', width: 90, align: 'center' },
                    { field: 'contacts', title: '联系人', width: 80, align: 'center' },
                    { field: 'contactsTel', title: '联系电话', width: 100, align: 'center' },
                    { field: 'detailAddress', title: '门店地址', width: 360, align: 'left', formatter: XSLibray.formatText },
                    { field: 'wechatGroupName', title: '门店微信群名称', width: 180, align: 'left', formatter: XSLibray.formatText },
                    { field: 'storeDeveloper', title: '门店开发人员', width: 80, align: 'center' },
                    {
                        field: 'storeStatus', title: '状态', align: 'center', width: 50, formatter: function (value, rowData) {
                            if (value == "NORMAL") {
                                return "正常";
                            }
                            else if(value == "FROZEN") {
                                return "<span style='color:#f00'>冻结</span>";
                            }
                        }
                    },
                    //{
                    //    field: 'WithdrawalsMode', title: '提现支付方式', align: 'center', width: 100, formatter: function (value, rowData) {
                    //        if (value == "1") {
                    //            return "微信提现";
                    //        }
                    //        else {
                    //            return "公司转账";
                    //        }
                    //    }
                    //},
                    { field: 'tmOnLine', title: '上线时间', dataType: "date",width: 80, align: 'center'/*, formatter: function (value, rowData){
                            return xsjs.dateFtt(value,"yyyy-MM-dd");
                        }*/
                     },
                    { field: 'countOrder', title: '订单数', width: 60, align: 'right' },
                    { field: 'countUserId', title: '会员数', width: 60, align: 'right' },
                    { field: 'countUserOrder', title: '2次下单会员数', width: 100, align: 'right' },
                    {
                        field: 'datagrid-action', title: '操作', align: 'center', formatter: function (value, rowData) {
                            return datagridAction(value, rowData);
                        }
                    }
                ]],
                xsTdAction: xsTdAction,
                onLoadSuccess: function (data) {
                    pageList.editFiled();
                    if (pageList.grid != null && pageList.grid.getSearchJson() != null) {
                        var countOrderUserTitle = pageList.grid.getSearchJson().userOrderNumber + "次下单会员数"
                        $(".datagrid-htable td[field='countUserOrder'] span:eq(0)").html(countOrderUserTitle);
                        var userOrderNumberIndex = -1;
                        for (var i = 0; i < pageList.grid.option.datagrid.columns[0].length; i++) {
                            if (pageList.grid.option.datagrid.columns[0][i].field == "countUserOrder") {
                                //修改列表中的标题
                                pageList.grid.option.datagrid.columns[0][i].title = pageList.grid.getSearchJson().userOrderNumber + "次下单会员数";
                                break;
                            }
                        }
                    }
                }
            },
            onSearchVerify: function () {
                var warehouse = $("input[name='listWarehouse']").is(":checked");
                if (!warehouse) {
                    window.top.$.messager.alert("温馨提示", "请选择要需要查询的仓库!");
                    return false;
                }
                var _value = $("input[name='userOrderNumber']").val();
                if(!_value){
                    window.top.$.messager.alert("温馨提示", "多次下单次数不能为空!");
                    return false;
                }
                    return true;
            },
            toolbar: toolbarArray,
            onSearchReset:function () {
                $("#cityId").empty();
                $("#countyId").empty();
            }
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    //编辑字段
    editFiled: function () {
        //if (btnPrivileges.Stock) {
        //修改库存
        this.grid.editFiled({
            filed: "lineSort",
            saveFn: function (items) {

                if (isNaN(items.val) || !xsjs.validator.IsPositiveInt(items.val) || parseInt(items.val) <= 0 || parseInt(items.val) > 10000) {
                    window.top.$.messager.alert("提示", "请输入大于0小于或等于10000的整型数字！", "info");
                    return;
                }

                items.loadMsg = "正在保存库存信息，请稍候...";
                pageList.saveFiled(items);
            }
        });
        //}
    },
    //保存单个字段信息
    saveFiled: function (items) {
        $.ajax({
            url: contextPath + "/storeProfile/editFiled",
            loadMsg: items.loadMsg,
            data: {
                filed: items.filed,
                val: items.val,
                storeId: items.kid
            },
            success: function (data) {
                items.callback(data);
            },
            error: function () {

            }
        })
    },

    ///编辑门店配送路线
    EditStoreLine: function (obj) {
        var getSelected = $(obj)[0].getSelected();
        if (getSelected && getSelected.length > 0) {
            if (getSelected.length > 1) {
                window.top.$.messager.alert("温馨提示", "编辑时不能选择多行!");
                return;
            }
        }
        else {
            window.top.$.messager.alert("温馨提示", "请选择要编辑的行!");
            return;
        }
        var kid = getSelected.val();
        if (kid == "" || kid <= 0 || kid == undefined) {
            window.top.$.messager.alert("温馨提示", "编辑的门店信息不正确!");
            return;
        }
        var url = contextPath + "/storeProfile/getStoreLine?id=" + kid;
        xsjs.window({
            title: "编辑配送线路",
            url: url,
            modal: true,
            width: 400,
            minHeight: 200,
            maxHeight: 300,
            owdoc: window.top
        });
    },

    ///编辑门店银行账户
            EidtStoreBankInfo: function (obj) {
                var getSelected = $(obj)[0].getSelected();
                if (getSelected && getSelected.length > 0) {
                    if (getSelected.length > 1) {
                        window.top.$.messager.alert("温馨提示", "编辑时不能选择多行!");
                        return;
                    }
                }
                else {
                    window.top.$.messager.alert("温馨提示", "请选择要编辑的行!");
                    return;
                }
                var kid = getSelected.val();
                if (kid == "" || kid<=0||kid == undefined) {
                    window.top.$.messager.alert("温馨提示", "编辑的门店信息不正确!");
                    return;
                }
                var url = contextPath + "/storeProfile/getStoreBankInfo?id=" + kid;
                xsjs.window({
                    title: "编辑银行账户",
                    url: url,
                    modal: true,
                    width: 500,
                    minHeight: 360,
            maxHeight: 450,
            owdoc: window.top
        });
    },

    ///批量导入门店信息
    UpLoadStoreList: function (obj) {
        xsjs.window({
            title: "新增门店信息",
            url: contextPath + "/storeProfile/loadUpLoadStoreView",
            modal: true,
            maxWidth: 1200,
            minHeight: 400,
            maxHeight: 700,
            owdoc: window.top
        });
    },
   /* warehouse:function () {
        $("select[name='warehouseId']").change(function () {
            var warehouseId = $("select[name='warehouseId']").val();
            if(warehouseId!=""&&warehouseId!=null){
                $.ajax({
                    type: 'POST',
                    url: contextPath + "/storeProfile/distributionLine/getPageList",
                    data: {"warehouseId":warehouseId},
                    success: function (data) {
                        var html = "<option value=''>--全部--</option>";
                        $.each(data,function (i,item) {
                            html += "<option value="+item.id+">"+item.lineName+"</option>"
                        })

                        $("select[name='lineId']").html(html);
                    },
                })
            }else{
                var html = "<option value=''>--全部--</option>";
                $("select[name='lineId']").html(html);
            }

        })
    },*/
    getQrCodeUrl:function () {
        $.ajax({
            type: 'POST',
            url: contextPath + "/storeProfile/getQrCodeUrl",
            success: function (data) {
                qrCodeUrl = data.record;
            },
        })
    }
};

$(function () {
    pageList.getQrCodeUrl();
    pageList.init();
   // pageList.warehouse();
});

//供应商帐号管理
function accountManager(vendorId, vendorName, evt) {
    if (evt) {
        xsjs.stopPropagation(evt);
    }
    var url = "/vendorAccount/vendorAccountList?vendorId=" + vendorId + "&vendorName=" + escape(vendorName);
    var title = "帐号管理";
    xsjs.addTabs({ title: title, url: url });
}

//导出
function exportData(options){

    var timeStr = xsjs.dateFormat(new Date(),"yyyyMMddHHmmss");
    var excelType = options.action.substring(options.action.lastIndexOf("\/")+1,options.action.length);
    var colNameMap;
    var fileName;
    if( excelType == "downloadStoreData"){
        colNameMap = {
            "warehouseName": "配送仓库",
            "lineName": "配送线路",
            "lineSort": "顺序",
            "storeName": "门店名称",
            "storeCode": "门店编号",
            "storeId": "门店分享ID",
            "userName": "管理员账号",
            "areaName": "区域",
            "contacts": "联系人",
            "contactsTel": "联系电话",
            "detailAddress": "门店地址",
            "wechatGroupName": "门店微信群",
            "storeDeveloper": "门店开发人员",
            "storeStatus": "状态",
            "bankAccountName": "收款人账户",
            "bankNo": "开户行行号",
            "bankName": "开户银行",
            "bankAccountNo": "银行账号",
            "unionPayCID": "企业用户号",
            "unionPayMID": "银联商户号"
        };

        fileName = "门店管理_"+timeStr;
    }

    if(excelType=="downloadStoreBankData"){
        colNameMap = {
            "storeName": "门店名称",
            "storeCode": "门店编号",
            "bankAccountName": "收款人账户",
            "bankNo": "开户行行号",
            "bankName": "开户银行",
            "bankAccountNo": "银行账号",
            "unionPayCID": "企业用户号",
            "unionPayMID": "银联商户号"
        };

        fileName = "门店管理银行卡信息_"+timeStr;
    }

    xsjs.ajax({
        url: options.action,
        loadMsg: "正在导出数据，请稍候...",
        data: options.data,
        success: function (data) {
            var list = data;
            if (list) {
                for (var i in list) {
                    if("NORMAL" == list[i].storeStatus){
                        list[i].storeStatus = "正常";
                    }else if("FROZEN" == list[i].storeStatus){
                        list[i].storeStatus = "冻结";
                    }

                }
                saveExcel(list, colNameMap, fileName);
            }
        }
    });
}