/// <reference path="../../plugin/easyui/jquery.min.js" />
/// <reference path="../../plugin/easyui/jquery.easyui.min.js" />
/// <reference path="../../plugin/XSLibrary/js/XSLibrary.js" />

function DT_AddAttrParent(row, data) {
    $.each(data, function (index, item) {
        $(".datagrid").find("input[value='" + item.MID + "'][name='MID']").attr("mpid", item.MParentID);
        //$('#sysNav').datagrid('checkRow', index);
        if (item.children) {
            DT_AddAttrParent(row, item.children);
        }
    });
}

///获取当前已选中的菜单权限和操作权限
function getCheckNav() {
    var navData = "[";
    var pCheckbox = $(".datagrid").find("input[name='MID']:checked");
    for (var j = 0; j < pCheckbox.length; j++) {
        var item = pCheckbox[j];
        if (j > 0) {
            navData += ",";
        }

        navData += "{";
        var cCheckbox = $(".datagrid").find("input[mid='" + item.value + "']:checked");
        var aStr = "";
        for (var i = 0; i < cCheckbox.length; i++) {
            if (i > 0) {
                aStr += ",";
            }
            aStr += cCheckbox[i].value;
        }
        navData += "\"MID\":" + item.value;
        navData += ",\"BArrID\": \"" + aStr + "\"";

        navData += "}";
    }
    navData += "]";
    return navData;
}

function getActionTypeAll(value, rowData) {
    var action_type = "";
    var MParentID = rowData.MParentID;
    for (var i = 0; i < value.length; i++) {
        if (i > 0) {
            action_type += "&nbsp;&nbsp;";
        }
        if (i > 0 && i % 5 == 0) {
            action_type += "<br />";
        }
        action_type += getActionType(value[i], rowData, MParentID);
    }
    return action_type;
}

function getActionType(ActionType, rowData, MParentID) {
    var isChecked = ActionType.isChecked ? "checked='checked'" : "";
    var inputID = "nav_" + rowData.MID + "_" + ActionType.BID;
    var _rtn = "<input id='" + inputID + "' name='boption' " + isChecked + " mid='" + rowData.MID + "' mpid='" + MParentID + "' value='" + ActionType.BID + "' type='checkbox' />";
    _rtn += "<label for='" + inputID + "'>" + ActionType.BName + "</label>";
    return _rtn;
}

function listOnCheck(rowData) {
    var getTreeData = $("#sysNav").treegrid("getData");

    //将所有操作选择
    $(".datagrid input[mid='" + rowData.MID + "']").prop("checked", true);

    if (rowData.MParentID == 0) {
        $(".datagrid input[mpid='" + rowData.MID + "']").prop("checked", true);
    }

    checkTreeParent(rowData.MParentID, getTreeData, 1);

}

function listOnUnCheck(rowData) {
    var getTreeData = $("#sysNav").treegrid("getData");

    //将所有操作取消
    $(".datagrid input[mid='" + rowData.MID + "']").prop("checked", false);
    $(".datagrid input[mpid='" + rowData.MID + "']").prop("checked", false);

    //子结点取消选择
    checkTreeChildren(rowData.children);

    //获取上级菜单信息
    checkTreeParent(rowData.MParentID, getTreeData, 0);
}

//子结点取消选择
function checkTreeChildren(treeData) {
    if (treeData) {
        for (var i = 0; i < treeData.length; i++) {

            $(".datagrid input[mpid='" + treeData[i].MID + "']").prop("checked", false);

            checkTreeChildren(treeData[i].children);
        }
    }
}

/*
获取上级菜单信息
1、当为选择状态时只选择上级菜单的菜单权限，操作和数据权限需再次选择。
2、当为取消状态时，当前取消的菜单为第三级菜单则取消上级菜单不做取消操作。
*/
function checkTreeParent(mid, treeData, checkedState) {
    for (var i = 0; i < treeData.length; i++) {
        if (treeData[i].MID == mid) {

            if (checkedState == 1) {
                if ($(".datagrid input[mpid='" + treeData[i].MID + "']:checked").length > 0) {
                    $(".datagrid input[value='" + treeData[i].MID + "'][name='MID']").prop("checked", true);
                }
            }
            else {
                if ($(".datagrid input[mpid='" + treeData[i].MID + "']:checked").length == 0 && treeData[i].MParentID == 0) {
                    $(".datagrid input[value='" + treeData[i].MID + "'][name='MID']").prop("checked", false);
                }
            }

            checkTreeParent(treeData[i].MParentID, $("#sysNav").treegrid("getData"), checkedState);

            return treeData[i];
        }
        else if (treeData[i].children && treeData[i].children.length > 0) {
            var item1 = checkTreeParent(mid, treeData[i].children, checkedState);
            if (item1) {
                return null;
            }
        }
    }
    return null;
}


var arrParam;

///菜单绑定
function menuBind() {
    $("#sysNav").treegrid({
        url: '/vendorRole/getAllMenu?rid=' + (arrParam.id || ""),
        treeField: 'MName',
        idField: 'MID',
        rownumbers: true,
        fitColumns: true,
        animate: true,
        singleSelect: true,
        selectOnCheck: false,
        checkOnSelect: false,
        columns: [[
            {
                field: 'MID', checkbox: true
            },
            {
                field: 'MName', title: '菜单名称', width: 100, editor: 'text'
            },
            {
                field: 'btnJson', title: '操作类型', editor: 'text', hidden: true, width: 100, formatter: function (value, rowData) {
                    if (value && value.length > 0) {
                        return getActionTypeAll(eval(value), rowData);
                    }
                }
            }
        ]],
        onCheck: function (rowData) {
            listOnCheck(rowData);
        },
        onUncheck: function (rowIndex, rowData) {
            listOnUnCheck(rowIndex, rowData);
        },
        onCheckAll: function (rowIndex, rowData) {
            $(".datagrid td[field='btnJson'] input[type='checkbox']").prop("checked", true);
        },
        onUncheckAll: function (rowIndex, rowData) {
            $(".datagrid td[field='btnJson'] input[type='checkbox']").prop("checked", false);
        },
        onLoadSuccess: function (row, data) {
            DT_AddAttrParent(row, data);
            $(".datagrid td[field='btnJson'] input[type='checkbox']").click(function () {
                $(this).closest("tr").find("input[type='checkbox']:eq(0)").prop("checked", true);
                if ($(this).attr("mpid") > 0) {
                    $(".datagrid input[value='" + $(this).attr("mpid") + "'][name='MID']").prop("checked", true);
                }
            });

            if ($(".datagrid-body input:checked").length == $(".datagrid-body input").length)
            {
                $(".datagrid-htable input").prop("checked", "checked");
            }
        }
    });
}

///保存角色
function saveRole() {
    if ($.trim($("#txtRoleName").val()).length == 0) {
        window.top.$.messager.alert("", "请填写角色名称!", "warning", "function(){$('#txtRoleName').focus()}");
        return false;
    }
    else if (!xsjs.validator.IsChinaOrNumbOr_Lett($.trim($("#txtRoleName").val()))) {
        window.top.$.messager.alert("", "角色名称格式不正确，<br />请填写汉字、字母、数字或下划线!", "warning", "function(){$('#txtRoleName').focus()}");
        return false;
    }
    else if ($.trim($("#txtRoleName").val()) == "系统管理员") {
        window.top.$.messager.alert("", "角色名称不能为系统默认角色管理!", "warning", "function(){$('#txtRoleName').focus()}");
        return false;
    }

    var _getCheckNav = getCheckNav();
    if (_getCheckNav == "[]") {
        window.top.$.messager.alert("", "请选择权限!", "warning", "function(){$('#txtRoleName').focus()}");
        return false;
    }

    //var _loading = xsjs.loading("正在保存数据，请稍候...");
    $.ajax({
        url: "/VendorRole/SaveRole",
        data: {
            "rid": arrParam.id,
            "nav": encodeURIComponent(_getCheckNav),
            "rolename": $("#txtRoleName").val()
            //"vendorID": $("#hidVendorID").val(),
            //"vendorName": $("#txtVendorName").val()
        },
        loadMsg: "正在保存数据，请稍候...",
        type: 'POST',
        success: function (data) {
            window.top.$.messager.alert("温馨提示", data.Info, (data.Flag == "SUCCESS" ? "info" : "error"), function () {
                if (data.Flag == "SUCCESS") {
                    window.frameElement.wapi.pageList.loadList();
                    xsjs.pageClose();
                }
            });
        },
        error: function () {

        }
    });
}

$(function () {
    arrParam = xsjs.SerializeURL2Json();
    arrParam.id = arrParam.id == "0" ? "" : arrParam.id;

    menuBind();

    $("#btnSave").click(function () {
        saveRole();
    });
})