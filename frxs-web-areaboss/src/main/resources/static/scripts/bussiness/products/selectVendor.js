var pageList = {
    //绑定的数据列表
    grid: null,
    params: null,
    singleSelect: true,
    init: function () {

        //列表数据
        var options = {
            //搜索栏选项
            body: $("#div1"),
            search: [
                { text: "供应商编码", attributes: { name: "vendorCode",id:"vendorCode", value: decodeURIComponent(this.params.vendorcode || "") } },
                { text: "供应商名称", attributes: { name: "vendorName",id:"vendorName", value: decodeURIComponent(this.params.vendorname || "") } },
                {
                    text: "供应商分类", type: "select", attributes: { name: "vendorTypeId" },
                    data: {
                        url: contextPath+"/vendorType/getAllList",
                        valueField: "vendorTypeId",
                        textField: "vendorTypeName",
                        emptyOption: {
                            value: "",
                            text: "--全部--"
                        }
                    }
                },
                {
                    text: "省市区", type: "region",
                    attributes: {
                        provinceId: "provinceId",
                        cityId: "cityId",
                        countyId: "countyId"
                    }
                }
            ],
            //数据列表选项
            datagrid: {
                url: contextPath+"/vendor/getPageList",
                fitColumns: false,
                idField: 'vendorId',         //主键
                singleSelect: pageList.singleSelect,
                columns: [[
                    { field: 'vendorId', checkbox: true },
                    { field: 'vendorCode', title: '编码', width: 80, align: 'left', formatter: XSLibray.formatText },
                    { field: 'vendorName', title: '名称', width: 160, align: 'left', formatter: XSLibray.formatText },
                    { field: 'vendorShortName', title: '简称', width: 120, align: 'left' },
                    { field: 'vendorTypeName', title: '供应商分类', align: 'center', width: 150 },
                    { field: 'contacts', title: '联系人', align: 'center', width: 80 },
                    { field: 'contactsTel', title: '电话', align: 'center', width: 100 },
                    { field: 'address', title: '详细地址', align: 'left', width: 320, formatter: XSLibray.formatText },
                    {
                        field: 'vendorStatus', title: '供应商状态', align: 'center', width: 80, formatter: function (value, rowData, rowIndex) {
                            if (value == "FROZEN") {
                                return "<span style='color: red;'>冻结</span>";
                            }else if(value == "AUDITING"){
                                return "审核";
                            } else if(value == "NORMAL"){
                                return "正常";
                            }else {
                                return "删除";
                            }
                        }
                    }
                ]],
                onDblClickRow: function (rowIndex, rowData) {
                    if (pageList.singleSelect == true) {
                        if (window.frameElement.apidata && typeof window.frameElement.apidata.callback == "function") {
                            window.frameElement.apidata.callback(rowData);
                            xsjs.pageClose();
                        }
                        else if (window.frameElement.apiOption && typeof window.frameElement.apiOption.callback == "function") {
                            window.frameElement.apiOption.callback(rowData);
                            xsjs.pageClose();
                        }
                    }
                },
                onLoadSuccess: function () {
                    $(document).trigger("resize");
                }
            },
            onSearchReset: function () {
                $("#vendorCode, #vendorName").val("");
                $("#cityId ,#countyId").html("");
            }
        };

        this.grid = xsjs.datagrid(options);
    },
    loadList: function () {
        this.grid.loadList();
    },
    selected: function () {
        var getSelections = pageList.grid.getGrid.datagrid("getSelections");

        if (getSelections == "" || getSelections.length == 0) {
            $.messager.alert("提示", "请选择供应商信息!", "info");
            return;
        }

        if (window.frameElement.apidata && typeof window.frameElement.apidata.callback == "function") {
            window.frameElement.apidata.callback(pageList.singleSelect == true ? getSelections[0] : getSelections);
            xsjs.pageClose();
        }
        else if (window.frameElement.apiOption && typeof window.frameElement.apiOption.callback == "function") {
            window.frameElement.apiOption.callback(pageList.singleSelect == true ? getSelections[0] : getSelections);
            xsjs.pageClose();
        }
    }
};

$(function () {
    pageList.params = xsjs.SerializeURL2Json();
    if (pageList.params && pageList.params.singleselect === "false") {
        pageList.singleSelect = false;
    }

    pageList.init();

    $("#btnSave").click(function () {
        pageList.selected();
    });
});