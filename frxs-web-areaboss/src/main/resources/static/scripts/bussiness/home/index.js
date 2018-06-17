function addTabs(title, url, owdoc) {

    var items = {};

    if (typeof title == "object") {
        items = title;
    }
    else
    {
        items = {
            title: title,
            url: url,
            win: owdoc
        };
    }

    if ($('#tabs').tabs('exists', items.title)) {
        $('#tabs').tabs('select', items.title);//选中并刷新

        var currTab = $('#tabs').tabs('getSelected');
        var url = $(currTab.panel('options').content).attr('src');
        if (url != undefined && currTab.panel('options').title != 'Home') {
            if (closeOrRefreshTabsVerify(currTab)) {
                var content = $('<iframe scrolling="auto" frameborder="0" easyuiTabs="true" style="width:100%;height:100%;"></iframe>');
                content.get(0).tabs = items;
                content.attr("src", items.url);

                if (items.win) {
                    content.get(0).tabs.wapi = items.win;
                }
                $('#tabs').tabs('update', {
                    tab: currTab,
                    options: {
                        content: content
                    }
                });
            }
        }
    } else {
        //var content = createFrame(u);
        var content = $('<iframe scrolling="auto" frameborder="0" easyuiTabs="true" style="width:100%;height:100%;"></iframe>');
        content.get(0).tabs = items;
        content.attr("src", items.url);

        if (items.win) {
            content.get(0).tabs.wapi = items.win;
        }
        $('#tabs').tabs('add', {
            title: items.title,
            content: content,
            closable: true,
            icon: items.icon
        });
    }
    tabClose();
}

function tabClose() {
    /*双击关闭TAB选项卡*/
    $(".tabs-inner").dblclick(function () {
        var subtitle = $(this).children(".tabs-closable").text();
        //验证是否可关闭当前页签
        if (closeOrRefreshTabsVerify($('#tabs').tabs('getTab', subtitle))) {
            $('#tabs').tabs('close', subtitle);
        }
    })
    /*为选项卡绑定右键*/
    $(".tabs-inner").bind('contextmenu', function (e) {
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });

        var subtitle = $(this).children(".tabs-closable").text();

        $('#mm').data("currtab", subtitle);
        $('#tabs').tabs('select', subtitle);
        return false;
    });
}

//绑定右键菜单事件
function tabCloseEven() {

    $('#mm').menu({
        onClick: function (item) {
            closeTab(item.id);
        }
    });

    return false;
}

$(function () {
    $.ajaxSetup({ async: false });
    bindData();
    tabCloseEven();

    $('.cs-navi-tab').click(function () {
        var $this = $(this);
        $(this).addClass('active').siblings().removeClass('active')
        var href = $this.attr('src');
        var title = $this.text();
        addTabs(title, href);
    });

    //在关闭页面时弹出确认提示窗口
    $(window).bind('beforeunload', function () {
        if (typeof window.vendorStatementsSyncState == "boolean" && window.vendorStatementsSyncState == true) {
            return '确认要关闭页面吗';
        }
    });
});


function tuichu(url) {
    $.messager.confirm("提示", "退出本系统将不能访问其他第三方系统，确定退出吗?", function (isClose) {
        if (isClose) {
            $.ajaxSetup({ async: false });
            $.get("../Home/Exit", null);
            window.location.href = url;
            //window.location.reload();
        }
    })
    return false;
}


function bindData() {
    $.get(contextPath+"/menu/getMenu", null, function (data) {
        var msg = eval(data);
        //var htmlStr = "";
        //var parentMenuCount = msg.length;
        //for (var i = 0; i < parentMenuCount; i++) {
        //    htmlStr += '<div title="' + msg[i].ModuleName + '">';
        //    var childMenuCount = msg[i].ListChildMenu.length;
        //    for (var j = 0; j < childMenuCount; j++) {
        //        htmlStr += ' <a href="javascript:void(0);" src="' + msg[i].ListChildMenu[j].Link + '" class="cs-navi-tab">' + msg[i].ListChildMenu[j].ItemsName + '</a>';
        //    }
        //    htmlStr += '</div>';
        //}

        //$("#nav").html(htmlStr).accordion({ animate: true });

        var validMenuCount = 0;

        $("#nav").accordion({ animate: true, fit: true, border: false });
        var selectedPanelname = '';
        $.each(msg, function (i, n) {
            var menulist = '';
            menulist += '<ul class="navlist">';

            var sumMenuList = "";
            n.listChildMenu;
            $.each(n.listChildMenu, function (j, o) {
                if (o.link && $.trim(o.link).length > 0) {
                    sumMenuList += '<li><div ><a ref="' + o.sid + '" href="' + o.link + '" onclick="return false;" rel="'+contextPath+'' + o.link + '" title="' + o.itemsName + '"><span icon="icon icon-page" class="icon icon-page" >&nbsp;</span><span class="nav">' + o.itemsName + '</span></a></div> ';
                    sumMenuList += '</li>';
                }
            })

            menulist += sumMenuList;

            menulist += '</ul>';

            if (sumMenuList.length > 0) {
                $('#nav').accordion('add', {
                    title: n.moduleName,
                    content: menulist,
                    border: false,
                    iconCls: 'icon icon-page2'
                });

                if (validMenuCount == 0) {
                    selectedPanelname = n.moduleName;
                }

                validMenuCount++;
            }
        });
        $('#nav').accordion('select', selectedPanelname);

        $('.navlist li a').click(function () {

            var tabTitle = $(this).children('.nav').text();
            var url = $(this).attr("rel");
            var menuid = $(this).attr("ref");
            var icon = $(this).find('.icon').attr("icon") || "";
            var third = $(this).find(menuid);

            if (third && third.child && third.child.length > 0) {
                $('.third_ul').slideUp();

                var ul = $(this).parent().next();
                if (ul.is(":hidden"))
                    ul.slideDown();
                else
                    ul.slideUp();
            }
            else {
                if ($(this).data() && $(this).data().openPageTime) {
                    //防止使用人员不停的单击菜单，间隔两秒单击才有效
                    if (Date.parse(new Date()) - Date.parse($(this).data().openPageTime) < 2000) {
                        return;
                    }
                }
                $(this).data("openPageTime", new Date());

                //addTab(tabTitle, url, icon);
                addTabs({
                    "title": tabTitle,
                    "url": url,
                    "icon": icon
                });

                $('.navlist li div').removeClass("selected");
                $(this).parent().addClass("selected");
            }
        }).hover(function () {
            $(this).parent().addClass("hover");
        }, function () {
            $(this).parent().removeClass("hover");
        });

        //选中第一个
        var panels = $('#nav').accordion('panels');
        var t = panels[0].panel('options').title;
        $('#nav').accordion('select', t);
    });
}

//页签右键菜单
function closeTab(action) {
    var alltabs = $('#tabs').tabs('tabs');
    var currentTab = $('#tabs').tabs('getSelected');
    var allTabtitle = [];
    $.each(alltabs, function (i, n) {
        allTabtitle.push($(n).panel('options').title);
    })

    onlyOpenTitle = "首页";
    switch (action) {
        case "refresh":
            var iframe = $(currentTab.panel('options').content);
            var src = iframe.attr('src');
            //验证是否可刷新当前页签
            if (closeOrRefreshTabsVerify(currentTab) == true) {
                $('#tabs').tabs("getSelected").find("iframe").get(0).contentWindow.location.href = $('#tabs').tabs("getSelected").find("iframe").get(0).contentWindow.location.href;
            }
            break;
        case "close":
            ////验证是否可关闭当前页签
            if (closeOrRefreshTabsVerify(currentTab) == true) {
                var currtab_title = currentTab.panel('options').title;
                $('#tabs').tabs('close', currtab_title);
            }
            break;
        case "closeall":
            $.each(allTabtitle, function (i, n) {
                if (closeOrRefreshTabsVerify($('#tabs').tabs('getTab', n))) {
                    if (n != onlyOpenTitle) {
                        $('#tabs').tabs('close', n);
                    }
                }
                else {
                    return;
                }
            });
            break;
        case "closeother":
            var currtab_title = currentTab.panel('options').title;
            $.each(allTabtitle, function (i, n) {
                if (closeOrRefreshTabsVerify($('#tabs').tabs('getTab', n))) {
                    if (n != currtab_title && n != onlyOpenTitle) {
                        $('#tabs').tabs('close', n);
                    }
                }
                else {
                    return;
                }
            });
            break;
        case "closeright":
            var tabIndex = $('#tabs').tabs('getTabIndex', currentTab);

            if (tabIndex == alltabs.length - 1) {
                return false;
            }
            $.each(allTabtitle, function (i, n) {
                if (i > tabIndex) {
                    if (closeOrRefreshTabsVerify($('#tabs').tabs('getTab', n))) {
                        if (n != onlyOpenTitle) {
                            $('#tabs').tabs('close', n);
                        }
                    }
                    else {
                        return;
                    }
                }
            });

            break;
        case "closeleft":
            var tabIndex = $('#tabs').tabs('getTabIndex', currentTab);
            if (tabIndex == 1) {
                return false;
            }
            $.each(allTabtitle, function (i, n) {
                if (i < tabIndex) {
                    if (closeOrRefreshTabsVerify($('#tabs').tabs('getTab', n))) {
                        if (n != onlyOpenTitle) {
                            $('#tabs').tabs('close', n);
                        }
                    }
                    else {
                        return;
                    }
                }
            });

            break;
        case "exit":
            $('#closeMenu').menu('hide');
            break;
    }
}

function exitsys() {
    var url = contextPath+"/logout";
    $.messager.confirm("提示", "退出区域管理系统，确定退出吗?", function (isClose) {
        if (isClose) {
            window.location.href = url;
        }
    })
    return false;
}

function resetssoPwd() {

    var url = contextPath+"/changePwd";
    xsjs.window({
        title: "修改密码",
        url: url,
        modal: true,
        width: 360,
        Height: 200,
        maxHeight: 240,
        owdoc: window.top
    });
}




//验证tabs 页签中是否存在TabsRefresh方法，当有且返回false时禁止刷新或关闭页
function closeOrRefreshTabsVerify(currTab) {
    return typeof currTab.children().get(0).contentWindow.TabsRefresh == "undefined"
        || typeof currTab.children().get(0).contentWindow.TabsRefresh == undefined
        || currTab.children().get(0).contentWindow.TabsRefresh() == true;
}