/// <reference path="../../easyui/jquery.min.js" />
/// <reference path="../../easyui/jquery.easyui.min.js" />

if (!Date.format) {
    Date.prototype.format = function (format) {
        /// <summary>日期格式化</summary>
        /// <param type="Date" name="format">格式，如“yyyy年MM月dd日”</param>
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "H+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
}

if (!String.format) {
    String.prototype.format = function (args) {
        /// <summary>将指定字符串中的格式项替换为指定数组中相应对象的字符串表示形式。 指定的参数提供区域性特定的格式设置信息。</summary>
        /// <param name="args"></param>
        if (arguments.length > 0) {
            var result = this;
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] == undefined) {
                        return "";
                    }
                    else {
                        var reg = new RegExp("({[" + i + "]})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
            return result;
        }
        else {
            return this;
        }
    };
}

(function () {

    $.browser = {};
    $.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
    $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());

    //备份jquery的ajax方法
    var _ajax = $.ajax;

    //重写jquery的ajax方法
    $.ajax = function (url, options) {
        //备份opt中error、success、complete函数及context、callbacks。切记不能修改函数的形参及删除成员的声明
        if (typeof url === "object") {
            options = url;
            url = undefined;
        }
        //默认Post提交
        options = $.extend({
            "type": "POST",
            "dataType": "json"
        }, options || {});

        var fn = {
            error: function (XMLHttpRequest, textStatus, errorThrown) { },
            success: function (data, textStatus, jqXHR) { },
            complete: function (XHR, TS) { },
            context: new Object(),
            callbacks: new Object()
        }
        if (options.error) {
            fn.error = options.error;
        }
        if (options.success) {
            fn.success = options.success;
        }
        if (options.complete) {
            fn.complete = options.complete;
        }
        if (options.context) {
            fn.context = options.context;
        }
        if (options.callback) {
            fn.callbacks = options.callback;
        }

        var loadingMsg;
        var isLoading = options.loadMsg && options.loadMsg.length > 0 && xsjs;

        //请求信息时的提示信息
        if (isLoading) {
            loadingMsg = xsjs.easyLoading(options.loadMsg);
        }

        //扩展增强处理
        var _opt = $.extend(options, {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //var networkerror = XMLHttpRequest.statusText.toLowerCase().indexOf("networkerror: failed to execute 'send' on 'xmlhttprequest': failed to load");

                if (XMLHttpRequest.status == 0) {
                    window.top.$.messager.alert("温馨提示", "您的操作失败，失败原因：<br />1、网络断开，请检查网络是否畅通；<br />2、您的登录状态已退出，刷新页面后重新登录后台；<br />3、可能您当前登录的帐号无此操作权限。", "error");
                }
                else {
                    //错误方法增强处理
                    fn.error(XMLHttpRequest, textStatus, errorThrown);
                }
            },
            success: function (data, textStatus, jqXHR) {
                //成功回调方法增强处理
                var isTrue = true;
                if (data && typeof data == "object") {
                    if (data.code == "1001" || (data.Flag && data.Flag == "NotLogin")) {
                        //当无登录超时或未登录时不显示标题，以免单击关闭按钮时无跳转
                        window.top.$.messager.alert("温馨提示", "您没有登录或是您的登录信息已被清除！", "error", function () {
                            window.top.location.href = data.LoginUrl || "/";
                        });
                        isTrue = false;
                        return;
                    }
                    else if (data.code == "1002" || (data.Flag && data.Flag == "NotPrivilege")) {
                        window.top.$.messager.alert("温馨提示", "您没有权限访问页面或操作功能！", "error");
                        isTrue = false;
                        return;
                    }

                    if (data.DataFormat == 1 && !(data.Flag == 0 || data.Flag == "SUCCESS")) {
                        window.top.$.messager.alert("温馨提示", data.Info, "error");
                    }
                }
                fn.success(data, textStatus, jqXHR);
            },
            complete: function (XHR, TS) {
                if (isLoading) {
                    loadingMsg.close();
                }
                fn.complete(XHR, TS);
            }
        });
        _ajax(url, _opt);
    };

    $.extend($.fn.datagrid.defaults.editors, {
        region: {
            init: function (container, options) {
                var _this = this;
                var editorContainer = $('<div class="datagrid-dt-region"/>');
                var ddlProvince = $("<select class='datagrid-dt-region-province'></select>").append("<option value=''>请选择省份</option>");
                var ddlCity = $("<select class='datagrid-dt-region-city'></select>").append("<option value=''>请选择市</option>");
                var ddlCounty = $("<select class='datagrid-dt-region-county'></select>").append("<option value=''>请选择县</option>");

                ddlProvince.change(function () {
                    _this.selectRegionID = parseInt($(this).val());
                    ddlCity.empty().append("<option value=''>请选择市</option>");
                    ddlCounty.empty().append("<option value=''>请选择县</option>");
                    xsjs.getChildRegion(_this.selectRegionID, function (data) {
                        $(data).each(function () {
                            ddlCity.append('<option value="' + this.orgAreaId + '" orgAreaFullName="' + this.orgAreaFullName + '">' + this.orgAreaName + '</option>');
                        });
                    });
                })

                ddlCity.change(function () {
                    _this.selectRegionID = parseInt($(this).val());
                    ddlCounty.empty().append("<option value=''>请选择县</option>");
                    xsjs.getChildRegion(_this.selectRegionID, function (data) {
                        $(data).each(function () {
                            ddlCounty.append('<option value="' + this.orgAreaId + '" orgAreaFullName="' + this.orgAreaFullName + '">' + this.orgAreaName + '</option>');
                        });
                    });
                });

                ddlCounty.change(function () {
                    _this.selectRegionID = parseInt($(this).val());
                });

                editorContainer.append(ddlProvince);
                editorContainer.append(ddlCity);
                editorContainer.append(ddlCounty);

                editorContainer.appendTo(container);
                return editorContainer;
            },
            getValue: function (target) {

                var regionID = $(target).find(".datagrid-dt-region-county").val()
                    || ($(target).find(".datagrid-dt-region-city").val() || $(target).find(".datagrid-dt-region-province").val());

                var regionText = $(target).find(".datagrid-dt-region-county option:checked").attr("orgAreaFullName")
                    || ($(target).find(".datagrid-dt-region-city option:checked").attr("orgAreaFullName")
                        || ($(target).find(".datagrid-dt-region-province option:checked").attr("orgAreaFullName")
                            || ""));

                return regionID;

                //return "<div regionID='" + regionID + "'>" + regionText + "</div>";
            },
            getText: function (target) {
                var regionText = $(target).find(".datagrid-dt-region-county option:checked").attr("orgAreaFullName")
                    || ($(target).find(".datagrid-dt-region-city option:checked").attr("orgAreaFullName")
                        || ($(target).find(".datagrid-dt-region-province option:checked").attr("orgAreaFullName")
                            || ""));

                return regionText;
            },
            setValue: function (target, value) {

                var ddlProvince = $(target).find(".datagrid-dt-region-province");
                var ddlCity = $(target).find(".datagrid-dt-region-city")
                var ddlCounty = $(target).find(".datagrid-dt-region-county");
                ddlProvince.empty().append('<option value="">请选择省份</option>');
                ddlCity.empty().append('<option value="">请选择市</option>');
                ddlCounty.empty().append('<option value="">请选择县</option>');

                var _this = this;

                var defaultID = parseInt(value);// value != "0" && /<\/div>/g.test(value) ? parseInt($(value).attr("regionID")) : 0;
                var regions = {};
                if (defaultID > 100000) {//精确到县
                    regions.countyID = defaultID;
                    regions.cityID = parseInt(defaultID.toString().substr(0, 4));
                    regions.provinceID = parseInt(defaultID.toString().substr(0, 2));
                }
                else if (defaultID > 1000) {//精确到市州
                    regions.cityID = defaultID;
                    regions.provinceID = parseInt(defaultID.toString().substr(0, 2));
                }
                else if (defaultID > 10) {//精确到省份
                    regions.provinceID = defaultID;
                }

                xsjs.getChildRegion(0, function (data) {
                    $(data).each(function () {
                        ddlProvince.append('<option value="' + this.orgAreaId + '" orgAreaFullName="' + this.orgAreaFullName + '">' + this.orgAreaName + '</option>');
                    });

                    if (regions.provinceID > 0) {
                        ddlProvince.val(regions.provinceID);

                        xsjs.getChildRegion(regions.provinceID, function (data) {
                            $(data).each(function () {
                                ddlCity.append('<option value="' + this.orgAreaId + '" orgAreaFullName="' + this.orgAreaFullName + '">' + this.orgAreaName + '</option>');
                            });

                            if (regions.cityID) {
                                ddlCity.val(regions.cityID);
                                xsjs.getChildRegion(regions.cityID, function (data) {
                                    $(data).each(function () {
                                        ddlCounty.append('<option value="' + this.orgAreaId + '" orgAreaFullName="' + this.orgAreaFullName + '">' + this.orgAreaName + '</option>');
                                    });

                                    if (regions.countyID) {
                                        ddlCounty.val(regions.countyID);
                                    }
                                });
                            }
                        });
                    }
                });
            },
            resize: function (target, width) {
                var span = $(target);
                if ($.boxModel == true) {
                    span.width(width - (span.outerWidth() - span.width()) - 10);
                } else {
                    span.width(width - 10);
                }
            },
            //当前选中的编号
            selectRegionID: 0
        },
        m97DateTime: {
            init: function (container, options) {
                var _this = this;
                var editorContainer = $('<div />');

                var dateFmtDef = 'yyyy-MM-dd HH:mm:ss';
                var dateFmt = options ? options.format || dateFmtDef : dateFmtDef;
                var input = $("<input />").click(function () { WdatePicker({ dateFmt: dateFmt }); }).focus(function () { WdatePicker({ dateFmt: dateFmt }); });

                editorContainer.append(input);

                editorContainer.appendTo(container);

                if (options && options.isFocus) {
                    input.focus();
                }

                return input;
            },
            getValue: function (target) {
                return $(target).val();
            },
            getText: function (target) {
                return $(target).val();
            },
            setValue: function (target, value) {
                return $(target).val(value);
            },
            resize: function (target, width) {
                var span = $(target);
                if ($.boxModel == true) {
                    span.width(width - (span.outerWidth() - span.width()) - 10);
                } else {
                    span.width(width - 10);
                }
            }
        }
    });
})(jQuery);

(function (window, undefined) {
    window["XSLibray"] = {
        //当前应用的皮肤
        skins: ""
    };
    window.xsjs = XSLibray;

    //是否IE浏览器
    XSLibray.isIE = (navigator.userAgent.indexOf("MSIE") > 0);
    //是否IE6浏览器
    XSLibray.isIE6 = (navigator.userAgent.toLowerCase().indexOf("msie 6.0") != -1);
    //是否火狐浏览器
    XSLibray.isFirefox = (navigator.userAgent.indexOf("Firefox") > 0);

    ///序列化URL
    XSLibray.SerializeURL2KeyVal = function (url, isToLowerCase) {
        /// <summary>序列化URL</summary>
        /// <param name="url" type="string">序列为键值对。 不填写 默认为当前地址</param>
        url = url || window.location.search;
        url = url.split("?"),
            url = url[url.length - 1];
        var parameter = url.split("&");
        var result = [];
        for (var i = 0; i < parameter.length; i++) {
            var val = parameter[i].split("=");
            result.push({ key: isToLowerCase === false ? val[0] : val[0].toLowerCase(), value: $.trim(val[1]) });
        }
        return $(result);
    };

    ///序列化URL
    XSLibray.SerializeURL2Json = function (url) {
        /// <summary>序列化URL</summary>
        /// <param name="url" type="string">序列为键值对。 不填写 默认为当前地址</param>
        var result = {};
        this.SerializeURL2KeyVal(url).each(function () {
            result[this.key] = this.value;
        });
        return result;
    };

    ///序列化URL()
    XSLibray.SerializeDecodeURL2Json = function (url, isTrim) {
        /// <summary>序列化URL</summary>
        /// <param name="url" type="string">序列为键值对。 不填写 默认为当前地址</param>
        /// <param name="isTrim" type="bool">是否去除空格</param>
        var result = {};
        this.SerializeURL2KeyVal(url, false).each(function () {
            result[this.key] = decodeURIComponent(this.value.replace(new RegExp("\\+", 'gi'), " "));

            if (isTrim === true) {
                result[this.key] = $.trim(result[this.key]);
            }
        });
        return result;
    };

    ///json转url参数
    ///param: json
    ///key: 对象名
    XSLibray.ParseParam = function (param, key) {
        var paramStr = "";
        if (param instanceof String || param instanceof Number || param instanceof Boolean) {
            paramStr += "&" + key + "=" + encodeURIComponent(param);
        } else {
            $.each(param, function (i) {
                var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
                paramStr += '&' + xsjs.ParseParam(this, k);
            });
        }
        return paramStr.substr(1);
    };

    ///json 值去除两边空格
    XSLibray.JsonTrim = function (param) {
        if (param instanceof Object) {
            var _param = param instanceof Array ? new Array() : new Object();
            if (param instanceof Array) {
                for (var key in param) {
                    _param.push(xsjs.JsonTrim(param[key]));
                }
            }
            else {
                for (var key in param) {
                    if (typeof param[key] == "object") {
                        _param[key] = xsjs.JsonTrim(param[key]);
                    }
                    else {
                        _param[key] = typeof param[key] == "string" ? $.trim(param[key]) : param[key];
                    }
                }
            }
            return _param;
        } else {
            return param;
        }
    };

    //去除url参数两边的空格
    XSLibray.paramTrim = function (url) {
        url = url || window.location.search;
        if ($.trim(url) == 0) {
            return url;
        }
        var keyVal = this.SerializeURL2KeyVal(url.replace(new RegExp("\\+", 'gi'), " "), false);
        var paramStr = "";
        for (var i = 0; i < keyVal.length; i++) {
            var item = keyVal[i];
            paramStr += i > 0 ? "&" : "";
            paramStr += item.key + "=" + $.trim(decodeURIComponent(item.value));
        }
        return paramStr;
    }

    //核定按钮权限
    XSLibray.authorize = function (pid,sid){
        var result = null;
        xsjs.ajax({
            url: contextPath+"/menu/checkButton",
            async:false,
            data: {
                pid: pid,
                sid: sid
            },
            success: function (data) {
                result = data;
            }
        });
        return result;
    }

    /// ajax提交数据
    XSLibray.ajax = function (options) {
        /// <summary>
        ///     <para>ajax提交数据</para>
        /// </summary>
        /// <param name="options" type="json">
        ///     <para>格式与jQuery.ajax一样</para>
        /// </param>

        options = $.extend({ url: "/Data/getAjax.ashx" }, options || {});

        var fn = {
            error: function (XMLHttpRequest, textStatus, errorThrown, data) { },
            success: function (data, textStatus) { }
        }
        if (options.error) {
            fn.error = options.error;
        }
        if (options.success) {
            fn.success = options.success;
        }

        //扩展增强处理
        var _opt = $.extend(options, {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //错误方法增强处理

                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (data, textStatus) {
                //成功回调方法增强处理
                var r_data = data;
                if (data != null && typeof data == "object") {
                    if (data.issyslogin === false) {
                        var doc = window.top.$.messager ? window.top.$.messager : window.$.messager;
                        if (doc) {
                            doc.alert("温馨提示", "您未登录或是您的登录信息已经被清除，请先登录！", "warning", function () {
                                window.top.location.href = "/Admin/Exit.aspx";
                            });
                        }
                        else {
                            alert("您未登录或是您的登录信息已经被清除，请先登录！");
                            window.top.location.href = "/Admin/Exit.aspx";
                        }
                        return;
                    }
                    else if (data.ispurview === false) {
                        var doc = window.top.$.messager ? window.top.$.messager : window.$.messager;
                        if (doc) {
                            doc.alert("温馨提示", "您没有权限访问当前页面或进行当前操作！", "warning", function () {
                                window.location.href = "/Admin/NotPurview.aspx";
                            });
                        }
                        else {
                            alert("您没有权限访问当前页面或进行当前操作！");
                            window.location.href = "/Admin/NotPurview.aspx";
                        }
                        return;
                    }

                    var doc = window.top.$.messager ? window.top.$.messager : window.$.messager;
                    r_data = r_data && (r_data.data || typeof r_data.data == "number" || typeof r_data.data == "boolean")
                        ? (typeof r_data.data == "string" ? decodeURIComponent(r_data.data) : r_data.data)
                        : r_data;
                    if ((data.code == 2 || data.code == 3) && data.msg) {
                        doc.alert("温馨提示", decodeURIComponent(data.msg), data.code == 3 ? "info" : "error", function () {
                            fn.success(r_data, textStatus);
                        });
                        if (data.code == 2) {
                            fn.error(null, textStatus, null, data);
                            return;
                        }
                        else {
                            return;
                        }
                    }
                }
                fn.success(r_data, textStatus);
            }
        });

        $.ajax(_opt);
    };

    /// jquery-easyui iframe弹窗
    XSLibray.window = function (items) {
        /// <summary>jquery-easyui iframe弹窗</summary>
        /// <param name="items" type="json">
        ///     <para>items:继承easyui window属性</para>
        ///     <para>添加新属性:  winid: 窗口ID，</para>
        ///     <para>url: 页面地址,</para>
        ///     <para>isReload: 是否重新加载此页面（注：当winid不为空时此属性生效）</para>
        ///     <para>owdoc: 弹窗对象(默认值为window, 可为window、window.top、window.parent)</para>
        /// </param>
        items = $.extend({
            "width": ($((items && items.owdoc) || window).width()) - 20,
            "height": ($((items && items.owdoc) || window).height()) - 20,
            "collapsible": false,
            "minimizable": false,
            "maximizable": false,
            "dialog": false,
            "owdoc": window
        }, items);
        var winid = items.winid || ("winid_" + Math.random() * 10000000000000000);
        items.owdoc.$("#" + winid).remove();
        var div = items.owdoc.$("<div id='" + winid + "' style='overflow: hidden;'></div>").appendTo(items.owdoc.document.body);
        var iframe = $("<iframe width='100%' frameborder='0' height='100%' data-easyui-window='true'/>").appendTo(div);

        iframe.get(0).apidata = items.apidata || {};
        iframe.get(0).apiOption = items;
        iframe.get(0).wapi = window;

        //加载loading
        var loadingBg = $("<div style='position: absolute; background-color: #000000; opacity: 0.3;'></div>").hide().appendTo(div);
        var loadingMsg = $("<div style='position: absolute; background-color: #ffffff; display: inline; border-radius: 5px; padding: 8px 10px;'>" + (items.loadMsg || "拼命加载中，请稍候...") + "</div>").hide().appendTo(div);
        if (items.loadMsg || items.showLoad === true) {
            loadingBg.show();
            loadingMsg.show();
        }

        iframe.load(function () {
            div.subpage = iframe.get(0).contentWindow;
            loadingBg.hide();
            loadingMsg.hide();
        });

        iframe.attr("src", items.url);
        if (items.dialog) {
            div.dialog(items);
        } else {
            div.window(items);
        }

        if (items.loadMsg || items.showLoad === true) {
            iframe.get(0).loading = {
                show: function (msg) {
                    if (msg) {
                        loadingMsg.html(msg);
                        iframe.get(0).loading.resize();
                    }
                    loadingBg.show();
                    loadingMsg.show();
                },
                hide: function () {
                    loadingBg.hide();
                    loadingMsg.hide();
                },
                resize: function () {
                    loadingBg.css({
                        "width": iframe.width(),
                        "height": iframe.height(),
                        "top": "28px"
                    });

                    var msgLeft = ((iframe.width() / 2) - (loadingMsg.width() / 2)) + "px";
                    loadingMsg.css({
                        "top": (28 + (iframe.height() / 2)) + "px",
                        "left": msgLeft
                    });
                }
            }
            iframe.get(0).loading.resize();
        }

        return div;
    };

    ///生成进度条
    XSLibray.loading = function (options, closeTime) {
        /// <summary>
        ///     <para>生成进度条</para>
        /// </summary>
        /// <param name="options" type="json">
        /// </param>

        if (typeof options == "string") {
            options = {
                loadMsg: options
            };
        }

        options = $.extend({
            loadMsg: "正在处理数据，请稍候...",
            owdoc: window
        }, options || {});

        if (closeTime) {
            options.closeTime = closeTime;
        }

        var _loading = options.owdoc.$("<div class='xsjs-jwindow-loading' style='border-top-width: 1px;'>" + options.loadMsg + "</div>").window({
            width: 160,
            minimizable: false,
            maximizable: false,
            closable: false,
            collapsible: false,
            title: "",
            modal: true,
            width: 260
        });

        XSLibray.AppendSkins({ owdoc: options.owdoc });

        _loading.xsClose = function () {
            _loading.window("close");
        }

        if (options.closeTime > 0) {
            setTimeout(function () {
                _loading.window("close");
            }, options.closeTime);
        }
        return _loading;
    };

    /// 关闭jquery-easyui iframe弹窗
    XSLibray.pageClose = function (isReload) {
        /// <summary>关闭jquery-easyui iframe弹窗</summary>
        /// <param name="isReload" type="json">是否刷新弹出此页的来源页面(默认为false)。</param>
        if (window != window.top) {
            //$(window.frameElement).closest(".tabs-panels").children(".panel")
            //$(window.frameElement).closest(".tabs-panels").children(".panel").index($(window.frameElement).closest(".panel"))
            //window.parent.$(".tabs-wrap li").eq($(window.frameElement).closest(".tabs-panels").children(".panel").index($(window.frameElement).closest(".panel")))
            //window.parent.$(".tabs-wrap li").eq($(window.frameElement).closest(".tabs-panels").children(".panel").index($(window.frameElement).closest(".panel"))).find(".tabs-close").trigger("click");
            if (typeof isReload == "boolean" && isReload == true) {
                window.frameElement.wapi.location.href = window.frameElement.wapi.location.href;
            }
            if (window.parent == window) {

            }
            else {
                var _frame = $(window.frameElement);
                if (_frame.attr("easyuiTabs") == "true") {
                    window.parent.$(".tabs-wrap li").eq($(window.frameElement).closest(".tabs-panels").children(".panel").index($(window.frameElement).closest(".panel"))).find(".tabs-close").trigger("click");
                }
                else {
                    try {
                        window.parent.$(window.frameElement).closest("div").window('close', true);
                        window.parent.$(window.frameElement).closest("div.window").remove();
                    } catch (e) {

                    }
                }
                if (typeof CollectGarbage == "function") {
                    CollectGarbage();
                }
            }
            //window.document.write('');
            //window.close();
        }
        else {
            this.window.opener = null;
            window.close();
        }
    };

    /// 日期格式转换为正常格式
    XSLibray.dateFormat = function (objDate, format) {
        /// <summary>日期格式转换为正常格式</summary>
        /// <param name="objDate" type="string or number">要转化的日期(可为能转换成日期格式的字符串、数字)</param>
        /// <param name="format" type="string">格式(例：yyyy年MM月dd日 HH:mm:ss)</param>
        try {
            var date;
            switch (typeof objDate) {
                case "object":
                    date = objDate;
                    break;
                case "number":
                    date = new Date(objDate);
                    break;
                case "string":
                    objDate = objDate.replace("/Date(", "").replace(")/", "").replace(/-/g, "/");
                    var re = /^[1-9]+[0-9]*]*$/;
                    if (re.test(objDate)) {
                        date = new Date(parseInt(objDate));
                    }
                    else {
                        date = new Date(objDate);
                    }
                    break;
                default:
                    return "";
            }
            if (date.getDate().toString().toLocaleLowerCase() != "nan") {
                var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                var milliseconds = date.getMilliseconds();
                format = format || "yyyy-MM-dd";
                return date.format(format);
            }
            else {
                return "";
            }
        } catch (ex) {
            return "";
        }
    };
    //数据库datetime类型转字符串
    XSLibray.datetimeFormat = function (val){
        var date;
        if(val){
            var da = new Date(val.replace("/Date(", "").replace(")/" , "").split( "+")[0]);
            var hour = "";
            if(da.getHours() >= 16){
                hour = "0"+(da.getHours()-16);
                da = new Date((da/1000+86400)*1000);
            }else if(da.getHours() < 2){
                hour = "0"+(da.getHours()+8);
            }else{
                hour=da.getHours() +8;
            }
            date = da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1):(da.getMonth() + 1))+ "-" + (da.getDate() < 10 ? "0" + da.getDate():da.getDate()) + " "
                + hour + ":" + (da.getMinutes()<10?"0"+da.getMinutes():da.getMinutes()) + ":" + (da.getSeconds()<10?"0"+da.getSeconds():da.getSeconds());
            return date;
        }
    };

    XSLibray.dateFtt = function (val,format)
    { //author: fygu
        var date;
        if(val){
            var da = new Date(val.replace("/Date(", "").replace(")/" , "").split( "+")[0]);
            var hour = "";
            if(da.getHours() >= 16){
                hour = "0"+(da.getHours()-16);
            }else if(da.getHours() < 2){
                hour = "0"+(da.getHours()+8);
            }else{
                hour=da.getHours() +8;
            }
            if(format == "yyyy-MM-dd"){
                date = da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1):(da.getMonth() + 1))+ "-" + (da.getDate() < 10 ? "0" + da.getDate():da.getDate());
                return date;
            }else{
                date = da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1):(da.getMonth() + 1))+ "-" + (da.getDate() < 10 ? "0" + da.getDate():da.getDate()) + " "
                    + hour + ":" + (da.getMinutes()<10?"0"+da.getMinutes():da.getMinutes()) + ":" + (da.getSeconds()<10?"0"+da.getSeconds():da.getSeconds());
                return date;
            }
        }
    };

    ///获取当前js文件路径
    XSLibray.getUrl = (function () {
        var sc = document.getElementsByTagName("script");
        var bp = '';
        var re = 'xslibrary/js/xslibrary';
        if (sc.length > 0) {
            for (var i = 0; i < sc.length; i++) {
                //if (sc[i].src.indexOf(re) >= 0) {
                if (sc[i].src.toLocaleLowerCase().indexOf("xslibrary.debug.js") >= 0 || sc[i].src.toLocaleLowerCase().indexOf("xslibrary.js") >= 0 || sc[i].src.toLocaleLowerCase().indexOf("xslibrary.min.js") >= 0) {
                    bp = !!document.querySelector ?
                        sc[i].src : sc[i].getAttribute('src', 4);
                    break;
                }
            }
            return bp;
        }
        else {
            return "";
        }
    })();

    ///获取当前js库所在库根目录
    XSLibray.getPath = XSLibray.getUrl.substr(0, XSLibray.getUrl.lastIndexOf('/js/XSLibrary.') + 1);

    ///加载皮肤样式文件
    XSLibray.AppendSkins = function (skins, functionName) {
        /// <summary>加载皮肤样式文件</summary>
        /// <param name="skins" type="string or json">
        ///     <para>皮肤，可为字符串或json</para>
        ///     <para>json事例:</para>
        ///     <para>{</para>
        ///     <para>skins: "皮肤"</para>
        ///     <para>loaded: "加载完成后执行的代码"</para>
        ///     <para>}</para>
        /// </param>
        var options = {
            "skins": this.skins,
            "loaded": null,
            "owdoc": window
        };
        if (skins) {
            if (typeof skins == "string") {
                options = $.extend(options, { "skins": skins });
            }
            else {
                options = $.extend(options, skins);
            }
        }

        // options.href = this.getPath + "skins/" + options.skins + "/XSLibrary.css";
        options.href = this.getPath + "scripts/common/XSLibrary.css";

        this.appendJs(options);
    }

    ///加载皮肤样式或ks文件
    XSLibray.appendJs = function (options) {
        //
        options = $.extend({
            "owdoc": window
        }, options);

        var link = options.owdoc.document.getElementsByTagName(options.type == "js" ? "script" : "link");
        if (link.length > 0) {
            for (var i = 0; i < link.length; i++) {
                if ((options.type == "js" ? link.item(i).src : link.item(i).href) == options.href) {
                    if (options.loaded != null && typeof options.loaded == "function") {
                        $(link.item(i)).load(function () {
                            options.loaded();
                        });
                    }
                    return;
                }
            }
        }

        var link = options.owdoc.$(options.type == "js" ? "<script>" : "<link>",
            options.type == "js" ? {
                    "type": "text/javascript"
                } :
                {
                    "type": "text/css",
                    "rel": "stylesheet"
                }).appendTo(options.owdoc.$("head").eq(0));

        if (options.loaded != null && typeof options.loaded == "function") {
            link.load(function () {
                options.loaded();
            });
            link.error(function () {
                options.loaded();
            });
        }
        link.attr(options.type == "js" ? "src" : "href", options.href);
    }

    ///加载本框架下的样式或js文件
    XSLibray.thisAppendJs = function (options) {
        options = $.extend({
            "owdoc": window
        }, options);
        options.href = this.getPath + options.href;
        this.appendJs(options);
    }

    ///数据列表行单击事件（单击选中或取消选中当前行）
    XSLibray.repRowClickChecked = function (obj) {
        /// <summary>数据列表行单击事件（单击选中或取消选中当前行）</summary>
        var objCheckbox = $(obj).children("td:eq(0)").children("input:checkbox");
        if (objCheckbox.length == 0) {
            return;
        }
        objCheckbox.get(0).checked = !objCheckbox.get(0).checked;
        if (objCheckbox.get(0).checked) {
            $(obj).addClass("xs-table-tr-select");
        }
        else {
            $(obj).removeClass("xs-table-tr-select");
        }
    };

    XSLibray.replaceCode = function (value) {
        if (value == undefined || value == null) {
            return "";
        }
        return value.toString().replace(/</g, '&lt;').replace('/>/', '&gt;');
    };

    XSLibray.formatText = function (value) {
        if(value) {
            value = XSLibray.replaceCode(value);
            return "<div style='table-layout:fixed;width:100%;'><div style='border:none;white-space:nowrap;overflow:hidden; text-overflow:ellipsis;' title='"
                + value + "'>" + value + "</div></div>";
        }
        return value;
    };

    ///数据列表全选事件
    XSLibray.repListCbkAll = function (obj, listTable) {
        /// <summary>数据列表全选事件</summary>
        /// <param name="obj" type="object">全选控件</param>
        /// <param name="listTable" type="jquery">数据列表</param>
        var actionCheckbox = listTable.find(".action-checkbox");
        actionCheckbox.each(function () {
            this.checked = obj.checked;
        });
        if (obj.checked) {
            listTable.find("tbody tr").addClass("xs-table-tr-select");
        }
        else {
            listTable.find("tbody tr").removeClass("xs-table-tr-select");
        }
    };

    ///数据列表行单击事件（单击选中或取消选中当前行）
    XSLibray.repRowClickRadio = function (obj) {
        /// <summary>数据列表行单击事件（单击选中或取消选中当前行）</summary>
        var objCheckbox = $(obj).children("td:eq(0)").children("input:radio");
        objCheckbox.get(0).checked = true;
        $(".xs-table-tr-select").removeClass("xs-table-tr-select");
        $(obj).addClass("xs-table-tr-select");
    };

    ///冒泡，兼容IE
    XSLibray.stopPropagation = function (evt) {
        evt = evt || window.event;
        if (window.ActiveXObject) {
            evt.cancelBubble = true;
        }
        else {
            evt.stopPropagation();
        }
    }

    /// <summary>格式验证</summary>
    XSLibray.validator = {
        ///手机号码
        mobile: function (str) {
            var pattern = /^1[3-9][0-9]{9}$/g;
            return pattern.test(str);
        },
        // 固定电话
        fixedLine: function (str) {
            var reg = /^((\d{4}|\d{3})(-|)(\d{7,8})|(\d{4}|\d{3})(-|)(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/;
            return reg.test(str);
        },
        // 电话号码(包含手机号码和固定电话号码)
        phone: function (str) {
            return this.mobile(str) || this.fixedLine(str);
        },
        // 验证日期格式
        IsDate: function (str, strFormat) {
            ///<summary>验证日期格式</summary>
            /// <param type="string" name="str">要验证的字符串</param>
            /// <param type="string" name="strFormat">要验证的时间格式：默认(yyyy-MM-dd)</param>
            strFormat = strFormat || "yyyy-MM-dd";
            var DateFormatter = {
                Patterns: {
                    YEAR: /y/g,
                    MONTH: /M/g,
                    DAY: /d/g,
                    HOUR: /H/g,
                    MINUTE: /m/g,
                    SECOND: /s/g,
                    MILSECOND: /f/g
                },
                FormatPatterns: function (format) {
                    return eval("/" +
                        format
                            .replace(this.Patterns.YEAR, '[0-9]')
                            .replace(this.Patterns.MONTH, '[0-9]')
                            .replace(this.Patterns.DAY, '[0-9]')
                            .replace(this.Patterns.HOUR, '[0-9]')
                            .replace(this.Patterns.MINUTE, '[0-9]')
                            .replace(this.Patterns.SECOND, '[0-9]')
                            .replace(this.Patterns.MILSECOND, '[0-9]') +
                        "/g");
                },
                DateISO: function (value, format) {
                    var formatReg = "";
                    if (value == "" || format == "")
                        return false;
                    formatReg = this.FormatPatterns(format);
                    return formatReg.test(value);
                }
            }
            //var reg = /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/;
            return DateFormatter.DateISO(str, strFormat);
        },
        ///是否为有效的数字
        IsNumber: function (str) {
            var reg = /^[-]?[0-9]*[.]?[0-9]*$/;
            return reg.test(str);
        },
        ///验证是否为正整数
        IsPositiveInt: function (str) {
            var reg = /^\d+$/;
            return reg.test(str);
        },
        IsChn: function (str) {
            /// <summary>判断是否为汉字</summary>
            var reg = /^[\u4E00-\u9FA5]+$/;
            if (!reg.test(str)) {
                return false;
            }
            return true;
        },
        ///判断是否是汉字、字母、数字组成
        IsChinaOrNumbOrLett: function (str) {
            /// <summary>判断是否是汉字、字母、数字组成</summary>
            var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";
            var re = new RegExp(regu);
            if (re.test(str)) {
                return true;
            } else {
                return false;
            }
        },
        ///判断是否是汉字、字母、数字和下划线组成
        IsChinaOrNumbOr_Lett: function (str) {
            /// <summary>判断是否是汉字、字母、数字组成</summary>
            var regu = "^[0-9a-zA-Z\_\u4e00-\u9fa5]+$";
            var re = new RegExp(regu);
            if (re.test(str)) {
                return true;
            } else {
                return false;
            }
        },
        IsNumberOr_Letter: function (str) {
            /// <summary>检查输入字符串是否只由英文字母和数字和下划线组成</summary>
            var regu = "^[0-9a-zA-Z\_]+$";
            var re = new RegExp(regu);
            if (re.test(str)) {
                return true;
            } else {
                return false;
            }
        },
        IsNumberOrLetter: function (str) {
            /// <summary>判断是否是数字或字母</summary>
            var regu = "^[0-9a-zA-Z]+$";
            var re = new RegExp(regu);
            if (re.test(str)) {
                return true;
            } else {
                return false;
            }
        },
        //是否包特殊字符    [`~!@#$%^&*()_+<>?:"{},.\/;'[\]]
        IsCheckStr: function (str) {
            var pattern = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
            if (pattern.test(str)) {
                return false;
            }
            return true;
        },
        //是否包特殊字符二    /[`~!@#$%^&*()+<>?:"{},\/;'[\]]/im
        IsCheckStr2: function (str) {
            var pattern = /[`~!@#$%^&*()+<>?:"{},\/;'[\]]/im;
            if (pattern.test(str)) {
                return false;
            }
            return true;
        },
        //是否包特殊字符三    /[`~!@#$%^&<>?:"{},\;'[\]]/im
        IsCheckStr3: function (str) {
            var pattern = /[`~!@#$%^&<>?:"{},\;'[\]]/im;
            if (pattern.test(str)) {
                return false;
            }
            return true;
        },
        checkTwoDate: function (startDate, endDate, strFormat) {
            /// <summary>检查输入的起止日期是否正确，规则为两个日期的格式正确，</summary>
            /// <param type="string" name="startDate">起始日期</param>
            /// <param type="string" name="startDate">且结束如期</param>
            /// <param type="string" name="strFormat">要验证的时间格式：默认"yyyy-MM-dd"</param>
            strFormat = strFormat || "yyyy-MM-dd";
            if (!this.IsDate(startDate)) {
                return false;
            } else if (!this.IsDate(endDate)) {
                return false;
            } else {
                var startDate = new Date(Date.parse(startDate.replace(/-/g, "/")));
                var endDate = new Date(Date.parse(endDate.replace(/-/g, "/")));
                if (startDate > endDate) {
                    return false;
                }
            }
            return true;
        },
        IsEmail: function (strEmail) {
            /// <summary>检查输入的Email信箱格式是否正确</summary>
            //var emailReg = /^[_a-z0-9]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/;
            var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            if (emailReg.test(strEmail)) {
                return true;
            } else {
                return false;
            }
        },
        IsURL: function (str) {
            /// <summary>检查输入的URL地址是否正确</summary>
            if (str.match(/(http[s]?|ftp):\/\/[^\/\.]+?\..+\w$/i) == null) {
                return false
            }
            else {
                return true;
            }
        },
        //验证是否包含html标记
        IsHtml: function (str) {
            var reg = new RegExp('^<([^>\s]+)[^>]*>(.*?<\/\\1>)?$');
            if (reg.test(str)) {
                return true;
            } else {
                return false;
            }
        }
    };

    ///分页插件
    XSLibray.pages = function (options) {
        /// <summary>分页插件</summary>
        /// <param type="json" name='options'>
        /// <para>{</para>
        /// <para>  rightText: "共{total}条 每页{pageSize}条 当前第{curPage}页 共{totalPage}页",   //右侧显示的文字</para>
        /// <para>  total: 0,       //总记录</para>
        /// <para>  pageSize: 10,   //页显示数</para>
        /// <para>  curPage: 1,     //当前页</para>
        /// <para>  numCount: 9,    //数字栏显示的分页按钮数</para>
        /// <para>  pageCon: document.body, //页码占位对象</para>
        /// <para>  gotofn: null    //数字跳转分页事件</para>
        /// <para>}</para>
        /// </param>
        var items = $.extend({
            rightText: "共{total}条 每页{pageSize}条 当前第{curPage}页 共{totalPage}页",   //右侧显示的文字
            total: 0,       //总记录
            pageSize: 10,   //页显示数
            curPage: 1,     //当前页
            numCount: 9,    //数字栏显示的分页按钮数
            homeText: "首 页",      //首页按钮文字，当为flase时不显示
            prevText: "上一页",    //上一页按钮文字，当为flase时不显示
            nextText: "下一页",    //下一页按钮文字，当为flase时不显示
            lastText: "尾 页",      //尾页按钮文字，当为flase时不显示
            pageCon: $(document.body) //页码占位对象
        }, options);

        function gotoPage(val) {
            var type = /^[0-9]*[1-9][0-9]*$/;
            var re = new RegExp(type);
            if (val.match(re)) {
                if (val <= 0) {
                    alert('请输入大于0的整数');
                }
                items.gotofn(parseInt(val));
            }
            else {
                alert("请输入整数");
            }
        }

        var totalPage = Math.ceil(items.total / items.pageSize);
        var rightText = items.rightText ? items.rightText.replace("{total}", items.total).replace("{pageSize}", items.pageSize).replace("{curPage}", items.curPage).replace("{totalPage}", totalPage) : "";

        var container = items.pageCon;
        $(container).find(".pages_bar").remove();
        var pages = $("<div class='pages_bar'></div>").appendTo(container);

        //首页、上一页
        var page_tags = $("<div class='page_tags'></div>").appendTo(pages);
        if (typeof items.homeText == "string" || items.homeText == true) {
            var page_first = $("<a href='javascript:void(0);' class='page_first'>" + items.homeText + "</a>").appendTo(page_tags);
            if (items.curPage > 1) {
                page_first.click(function () {
                    gotoPage("1");
                });
            }
            else {
                page_first.addClass("page_first_disabled");
            }
        }
        if (typeof items.prevText == "string" || items.prevText == true) {
            var page_prev = $("<a href='javascript:void(0);' class='page_prev'>" + items.prevText + "</a>").appendTo(page_tags);
            if (items.curPage > 1) {
                page_prev.click(function () {
                    gotoPage((items.curPage - 1) + "");
                });
            }
            else {
                page_prev.addClass("page_prev_disabled");
            }
        }

        //数字分页
        if (items.numCount > 0) {
            var _totalPage = totalPage > 0 ? totalPage : 1;
            var page_number = $("<div class='page_number'></div>").appendTo(pages);
            var startIndex = items.curPage - Math.ceil(items.numCount / 2) + 1;
            startIndex = startIndex > 1 ? startIndex : 1;
            var endIndex = items.curPage + Math.floor(items.numCount / 2);
            endIndex = endIndex < _totalPage ? endIndex : _totalPage;
            for (var i = startIndex; i <= endIndex; i++) {
                var a = $("<a href='javascript:void(0);'>" + i + "</a>").appendTo(page_number);
                if (i == items.curPage) {
                    a.addClass("page_cur");
                }
                else {
                    if (typeof items.gotofn == "function") {
                        a.click(function () {
                            gotoPage($(this).html());
                        });
                    }
                }
            }
        }

        //下一页、尾页
        var page_tags2 = $("<div class='page_tags'></div>").appendTo(pages);
        if (typeof items.nextText == "string" || items.nextText == true) {
            var page_next = $("<a href='javascript:void(0);' class='page_next'>" + items.nextText + "</a>").appendTo(page_tags2);
            if (items.curPage < totalPage) {
                page_next.click(function () {
                    gotoPage((items.curPage + 1) + "");
                });
            }
            else {
                page_next.addClass("page_next_disabled");
            }
        }
        if (typeof items.lastText == "string" || items.lastText == true) {
            var page_last = $("<a href='javascript:void(0);' class='page_last'>" + items.lastText + "</a>").appendTo(page_tags2);
            if (items.curPage < totalPage) {
                page_last.click(function () {
                    gotoPage(totalPage + "");
                });
            }
            else {
                page_last.addClass("page_last_disabled");
            }
        }

        //跳转至指定页
        if (typeof items.gotofn == "function") {
            var page_goto = $("<div class='page_goto'></div>").appendTo(pages);
            page_goto.append("<span>转到</span>");
            var page_enter = $("<input type='text' value='" + items.curPage + "' class='page_enter'/>").keyup(function (evt) {
                evt = evt || window.event;
                if (evt.keyCode == 13) {
                    gotoPage($(this).val());
                }
            }).appendTo(page_goto);
            page_goto.append("<span>页</span>");
            var page_goto_button = $("<a href='javascript:void(0);' class='page_goto_button'>确 定</a>").click(function () {
                gotoPage(page_enter.val());
            }).appendTo(page_goto);
        }

        //数据分页相关信息
        var page_right = $("<div class='page_right'></div>").html(rightText).appendTo(pages);
    };

    ///添加选项卡
    XSLibray.addTabs = function (options) {
        /// <summary>分页插件</summary>
        /// <param type="json" name='options'>
        /// <para>{</para>
        /// <para>  title: "标题"</para>
        /// <para>  url: "页面地址"</para>
        /// <para>}</para>
        /// </param>
        var items = $.extend({
            closable: true
        }, options);

        if (window.top.addTabs) {
            window.top.addTabs(options);
        }
        else {
            return true;
        }
        return false;
    };

    ///jquery easyui
    XSLibray.tabs = {
        // 刷新列表
        loadList: function (options) {
            /// <summary>
            /// 刷新列表
            /// </summary>
            /// <param type='object' name='options'>
            ///   <para>win：对象<para>
            ///   <para>isSelect：是否将window对象所在页选中<para>
            /// </param>
            (options.win || window).$("#aSearch").trigger("click");
            if (options.isSelect === true) {
                this.select(options.win);
            }
        },
        ///刷新列表当前所在页数据
        loadCurrentList: function (options) {
            /// <summary>
            /// 刷新列表当前所在页数据(开发中，暂时禁止调用)
            /// </summary>
            /// <param type='object' name='options'>
            ///   <para>win：对象<para>
            ///   <para>isSelect：是否将window对象所在页选中<para>
            /// </param>
            (options.win || window).xsjs.listReLoad();
            if (options.isSelect === true) {
                this.select(options.win);
            }
        },
        ///刷新页面
        refreshPage: function (options) {
            /// <summary>
            /// 刷新页面
            /// </summary>
            /// <param type='object' name='options'>
            ///   <para>win：对象<para>
            ///   <para>isSelect：是否将window对象所在页选中<para>
            /// </param>
            (options.win || window).location.href = (options.win || window).location.href;
            if (options.isSelect === true) {
                this.select(options.win);
            }
        },
        ///将win所在页选中
        select: function (win) {
            /// <summary>
            /// 刷新页面
            /// </summary>
            /// <param type='object' name='win'>window对象</param>
            window.top.$('#tabs').tabs('select', (win || window).frameElement.tabs.title);//选中并刷新
        }
    };

    // 验证是否登录或是否有权限
    // data: 要验证的数据
    XSLibray.loginAndPrivilegeValidator = function (data) {
        if (data && typeof data == "object") {
            if (data.isLogin === false) {
                $.messager.alert("温馨提示", "您没有登录或是您的登录信息已被清除！", "error", function () {
                    window.top.location.href = "/";
                });
                return false;
            }
            else if (data.isPrivilege === false) {
                $.messager.alert("温馨提示", "您没有权限访问页面或操作功能！", "error");
                return false;
            }
        }
        return true;
    }

    //ajax easyui遮罩
    XSLibray.easyLoading = function (message) {
        var height = $(window).height();
        var left = ($(document.body).outerWidth(true) - 190) / 2;
        var top = ($(window).height() - 45) / 2;
        var guid = XSLibray.newGuid();
        var htmCode = "<div class=\"datagrid-mask\" id=\"" + guid + "\" style=\"display: block; width: 100%; height: " + height + "px;\"></div><div class=\"datagrid-mask-msg\" id=\"msg" + guid + "\" style=\"display: block; left: " + left + "px; top: " + top + "px;\">" + (message ? message : "正在处理，请稍候。。。") + "</div>";

        var loading = $(htmCode).appendTo("body");

        loading.close = function () {
            $("#" + guid).remove();
            $("#msg" + guid).remove();
        };
        return loading;
    };

    //New GUID
    XSLibray.newGuid = function () {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    };

    // 客户端Cookie处理
    XSLibray.cookie = function (key, value, options) {

        // key and value given, set cookie...
        if (arguments.length > 1 && (value === null || typeof value !== "object")) {
            options = jQuery.extend({}, options);

            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? String(value) : encodeURIComponent(String(value)),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    };

    //省市县选择控件
    XSLibray.region = function (options) {
        var items = {
            parent: XSLibray,
            init: function (option) {
                ///<summary>省市县初始化</summary>
                ///<param type="json" name="option">
                ///<para>ddlProvince: 省份控件</para>
                ///<para>ddlCity: 市控件</para>
                ///<para>ddlCounty: 县控件</para>
                ///<para>defaultID: 默认选择项</para>
                ///<para>provinceID: 省份ID</para>
                ///<para>cityID: 市州ID</para>
                ///<para>countyID: 区县ID</para>
                ///<para>onLoadnd: 加载完后</para>
                ///</param>
                var _this = this;
                _this.parent.thisAppendJs({
                    type: "js", href: "/js/region.js", loaded: function () {

                        option.ddlProvince.empty().append('<option value>全部</option>');
                        option.ddlCity.empty().append('<option value>全部</option>');
                        option.ddlCounty.empty().append('<option value>全部</option>');

                        //省份信息
                        var pname = $.grep(region, function (item, i) {
                            return item.p == 0;
                        });

                        //省
                        $(pname).each(function () {
                            option.ddlProvince.append("<option value=\"" + this.id + "\">" + this.n + "</option>");
                        });
                        //市
                        option.ddlProvince.change(function () {
                            option.ddlCity.empty().append('<option value="">全部</option>');
                            option.ddlCounty.empty().append('<option value="">全部</option>');

                            if (option.ddlProvince.val() > 0) {
                                //市州信息
                                var cname = $.grep(region, function (item, i) {
                                    return item.p == option.ddlProvince.val();
                                });

                                $(cname).each(function () {
                                    option.ddlCity.append("<option value=\"" + this.id + "\">" + this.n + "</option>");
                                });
                            }

                            if (option.provinceChange) {
                                option.provinceChange(this);
                            }
                        });
                        //县
                        option.ddlCity.change(function () {
                            option.ddlCounty.empty().append('<option value="">全部</option>');

                            if (option.ddlCity.val() > 0) {
                                //区县信息
                                var countyName = $.grep(region, function (item, i) {
                                    return item.p == option.ddlCity.val();
                                });

                                $(countyName).each(function () {
                                    option.ddlCounty.append("<option value=\"" + this.id + "\">" + this.n + "</option>");
                                });
                            }

                            if (option.cityChange) {
                                option.cityChange(this);
                            }
                        });

                        option.ddlCounty.change(function () {
                            if (option.countyChange) {
                                option.countyChange(this);
                            }
                        });

                        //默认值
                        _this.bindDefault(option);

                        if (typeof option.onLoaded == "function") {
                            option.onLoaded();
                        }
                    }
                });
            },
            //绑定默认值
            bindDefault: function (option) {
                if (option.defaultID > 0) {
                    var queName = $.grep(region, function (item, i) {
                        return item.id == option.defaultID;
                    });

                    //未查到相关的ID
                    if (queName.length > 0) {
                        if (queName[0].p > 0) {
                            //查询上一级信息
                            var queName1 = $.grep(region, function (item, i) {
                                return item.id == queName[0].p;
                            });

                            if (queName1.length > 0) {
                                if (queName1[0].p > 0) {
                                    option.countyID = option.defaultID;
                                    option.provinceID = queName1[0].p;
                                    option.cityID = queName[0].p;
                                }
                                else {
                                    //市
                                    option.provinceID = queName[0].p;
                                    option.cityID = option.defaultID;
                                }
                            }
                        }
                        else {
                            option.provinceID = option.defaultID;
                        }
                    }
                }

                this.bindSelect(option);
            },
            //绑定默认值到控件
            bindSelect: function (option) {
                if (option.provinceID > 0) {
                    option.ddlProvince.val(option.provinceID).trigger("change");

                    if (option.cityID > 0) {

                        option.ddlCity.val(option.cityID).trigger("change");
                        if (option.countyID > 0) {
                            option.ddlCounty.val(option.countyID);
                        }
                    }
                }
            },
            //html绑定
            htmlInit: function () {
                //初始化
                if ($("select[conRegionSelectProvince]").length > 0) {
                    var rSelect = [];
                    for (var i = 0; i < $("select[conRegionSelectProvince]").length; i++) {
                        rSelect.push({
                            ddlProvince: $("select[conRegionSelectProvince=" + (i + 1) + "]"),
                            ddlCity: $("select[conRegionSelectCity=" + (i + 1) + "]"),
                            ddlCounty: $("select[conRegionSelectCounty=" + (i + 1) + "]"),
                            defaultID: $("select[conRegionSelectProvince=" + (i + 1) + "]").attr("defaultID") || 0,
                            provinceID: $("select[conRegionSelectProvince=" + (i + 1) + "]").attr("provinceID") || 0,
                            cityID: $("select[conRegionSelectCity=" + (i + 1) + "]").attr("cityID") || 0,
                            countyID: $("select[conRegionSelectCounty=" + (i + 1) + "]").attr("countyID") || 0
                        });
                    }

                    for (var j = 0; j < rSelect.length; j++) {
                        this.init(rSelect[j]);
                    }
                }
            }
        }
        if (options) {
            items.init(options);
        }
        else {
            items.htmlInit();
        }
    };

    //刷新当前页数据(注，只适应“蔡叔”的前端列表框架使用)
    XSLibray.listReLoad = function () {
        //刷新当前页数据
        //$('#aSearch')：此按钮所在from表单中的查询项做为查询条件
        var pagerMainList = $("th[name='pagerMain']").closest("table").attr("name");
        eval("if(typeof " + pagerMainList + "List == 'object'){ " + pagerMainList + "List.List($('#aSearch')); }");
    };

    /*
    Ajax请求
      arg=Ajax请求参数
      loadmsg=数据处理时的文字描述
    */
    XSLibray.$Ajax = function (arg, loadmsg, callback) {
        var loading = undefined;
        var _param = {
            type: 'POST'
            , dataType: 'json'
            , beforeSend: function () {
                loading = xsjs.easyLoading(loadmsg || "数据处理中，请稍候...");
            }
            , success: function (res) {
                if (res.rspCode == "success" || res.rspCode == "0") {
                    if (callback && typeof (callback) == 'function')
                        callback(res.record || {});
                }
                else {
                    window.top.$.messager.alert("温馨提示", res.rspDesc, "error");
                }
            },
            error: function (xhr, errorType, error) {
                window.top.$.messager.alert("温馨提示", "获取数据异常", "error");
            },
            complete: function () {
                loading && loading.close();
            }
        }
        var option = $.extend(_param, arg);
        $.ajax(option);
    }
    XSLibray.nowDateTime = function (formatter) {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
        var day = date.getDate() > 9 ? date.getDate() : ("0" + date.getDate());
        var hours = date.getHours() > 9 ? date.getHours() : ("0" + date.getHours());
        var minutes = date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes());
        var seconds = date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds());
        var dateStr = year + "-" + month + "-" + day + " " + hours + ":" + minutes;
        if (formatter) {
            formatter = formatter.replace(/yyyy/g, year);
            formatter = formatter.replace(/YYYY/g, year);
            formatter = formatter.replace(/MM/g, month);
            formatter = formatter.replace(/dd/g, day);
            formatter = formatter.replace(/DD/g, day);
            formatter = formatter.replace(/hh/g, hours);
            formatter = formatter.replace(/HH/g, hours);
            formatter = formatter.replace(/mm/g, minutes);
            formatter = formatter.replace(/ss/g, seconds);
            formatter = formatter.replace(/SS/g, seconds);
            dateStr = formatter;
        }
        return dateStr;
    };
    XSLibray.pigshow = function (url) {
        var html = $("<div style='position:fixed; z-index:999999; top:0px; bottom:0px; left:0px; width:100%;right:0px;background-color:#333;  opacity:0.4;' id='bgdiv_chy'></div><div style='position:fixed; z-index:1000000; top:10%; bottom:1rem; left:10%; width:80%; right:10%; bottom:10%; text-align:center'  id='kk_chy'><div style='width:100%; height:100%; position:relative'  ><img ></div></div>");
        window.top.$("body").append(html);
        html.find("img").load(function () {
            autoSize(this);
        }).attr("src", url).click(function () {
            window.top.$("#bgdiv_chy").remove();
            window.top.$("#kk_chy").remove();
        });

    };
    //银行卡每四位一个空格
    XSLibray.BankCardShow = function (arr) {
        var str = arr.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
        return str;
    }

})(window, this);

//项目私有或各项目间代码有差异的
(function () {
    /*
    //绑定列表：继承easyui datagrid
    options: {
        //数据请求和参数设置
        data: {
            kid: "主键ID字段名称",
            delParamName: "删除数据时传入后台的参数ID名称",
            lockParamName: "冻结/解冻数据时传入后台的参数ID名称",
            editParamName: "编辑数据时传入后台的参数ID名称",
            detailsParamName: "查看详情数据时传入后台的参数ID名称",
            lockField: "冻结/解冻字段名称",
            deleteUrl: "删除数据url地址",
            del: "delete", //删除数据url地址(与上面类似，新写的代码用“deleteUrl”，此属性后期去掉),
            lock: "lock" //冻结解冻数据url地址
        },
        //搜索栏选项
        search：[
            {
                text: "所属配送站",
                attributes: { name: "StoreName", style:"" },
                type: "控件类型,包含自定义控件"
                          格式如下：<br>: 换行，
                                    select: 下拉列表框，
                                    text：文本框，
                                    number：数字（基于easyui），
                                    date：日期，
                                    time：时间，
                                    datetime：日期+时间，
                                    dateMonth：选择年月，
                                    region：省市县，
                                    warehouse：仓库，
                                    vendor：供应商, 示例：{
                                        text: "供应商", type: "vendor", option: {
                                            vendorCodeID: "VendorCode", --供应商编码 html ID
                                            vendorNameID: "VendorName", --供应商名称 html ID
                                            defaultIDValue: "ID默认值",
                                            defaultCodeValue: "编码默认值",
                                            defaultNameValue: "名称默认值"
                                        }
                                    },
                                    selectList: 示例：{
                                        text: "订货门店",
                                        type: "selectList",
                                        option: {
                                            keyID: "ShopID",
                                            codeID: "ShopCode",
                                            nameID: "ShopName",
                                            defaultIDValue: "ID默认值",
                                            defaultCodeValue: "编码默认值",
                                            defaultNameValue: "名称默认值"
                                        },
                                        //动态的查询参数，非必填。
                                        queryParams: function () {
                                            return "WID=" + $("#WID").val();
                                        },
                                        //获取数据
                                        urlData: {
                                            title: "选择门店",
                                            //选择页面地址
                                            selectUrl: "/Shop/SelectShop",
                                            //数据查询地址
                                            url: "/Shop/GetList"
                                        },
                                        //选择后的回调函数
                                        callback: function (data) {

                                        }
                                    },
            },
        ],
        搜索栏自定义按钮
        searchButtons: [[]],
        //添加页面，弹窗，基于easyui
        add: { },
        //编辑页面，弹窗，基于easyui
        edit: { },
        //查看详情，弹窗，基于easyui
        details: { },
        数据列表，继承easyui datagrid
        datagrid: {
            //表格中封装的操作按钮
            xsTdAction: ["编辑", "删除", "锁定"]
        },
        //工具栏中封装的操作按钮
        toolbar: ["添加", "编辑", "删除", "锁定"]
    }
    */
    XSLibray.datagrid = function (options) {
        var items = {
            //上级
            parent: XSLibray,
            //页面参数
            param: {},
            //选项
            option: {
                body: $(document.body),
                //数据处理
                data: {
                    //kid: "主键ID字段名称",
                    //delParamName: "删除数据时传入后台的参数ID名称",
                    //lockParamName: "冻结/解冻数据时传入后台的参数ID名称",
                    //editParamName: "编辑数据时传入后台的参数ID名称",
                    //detailsParamName: "查看详情数据时传入后台的参数ID名称",
                    //lockField: "冻结/解冻字段名称",
                    //deleteUrl: "删除数据url地址",
                    del: "delete", //删除数据url地址(与上面类似，新写的代码用“deleteUrl”，此属性后期去掉),
                    lock: "lock" //冻结解冻数据url地址
                },
                //是否显示查询按钮
                isShowSearch: true,
                //是否显示清空按钮
                isShowEmpty: true,
                //添加页面属性
                //add : {},    //参数与edit属性基本一致
                //编辑页面
                edit: {
                    title: "添加数据",
                    editTitle: "编辑数据",
                    width: 880,
                    height: $(window.top).height() * 0.9,
                    url: "edit.aspx",
                    modal: true,
                    owdoc: window.top
                },
                //查看详情
                details: {
                    title: "添加数据",
                    editTitle: "编辑数据",
                    width: 880,
                    height: $(window.top).height() * 0.9,
                    url: "details.aspx",
                    modal: true,
                    owdoc: window.top
                },
                //数据列表
                datagrid: {
                    //url: "/data/getAjax.ashx",
                    //queryParams: searchParams,
                    striped: true,
                    //singleSelect: true,
                    //pageSize: 10,
                    pageList: [5, 10, 15, 20, 30, 50, 100],
                    border: 0,
                    pagination: true,
                    rownumbers: true,
                    toolbar: []
                },
                //工具
                toolbar: []
            },
            //打开添加页面
            addPage: function (kid) {
                var _url = (kid > 0 || ($.trim(kid).length > 0 && kid != 0)) ? (this.option.edit.editUrl || this.option.edit.url) : this.option.edit.url;
                var url = this.option.edit.url + (this.option.edit.url.indexOf("?") >= 0 ? "&" : "?") + (this.option.data.editParamName || "id") + "=" + kid;
                var ex = { url: url };
                if ((kid > 0 || ($.trim(kid).length > 0 && kid != 0)) && this.option.edit.editTitle) {
                    ex.title = this.option.edit.editTitle;
                };
                ex = $.extend({}, this.option.edit, ex);
                this.parent.window(ex);
            },
            //获取当前页选中行
            getSelected: function () {
                return this.option.body.find("input[name='" + this.option.data.kid + "']:checked");
            },
            //获取当前页选中行数据
            getSelectedData: function () {
                if (this.getSelected().length == 0) {
                    return [];
                }

                var _this = this;

                var _getSelected = this.getSelected().serialize().replace(new RegExp("&" + this.option.data.kid + "=", "gi"), ",").replace(this.option.data.kid + "=", ",") + ",";
                var _getSelectedData = new Array();
                $(this.getGrid.datagrid("getRows")).each(function () {
                    if (_getSelected.indexOf("," + eval("this." + _this.option.data.kid) + ",") >= 0) {
                        _getSelectedData.push(this);
                    }
                });

                return _getSelectedData;
            },
            //编辑行
            editPage: function (kid) {
                if (kid && $.trim(kid).length > 0) {
                    this.addPage(kid);
                    return;
                }
                var grid = this.option.body.find(".xll-datagrid");
                var getSelected = this.getSelected();
                if (getSelected && getSelected.length > 0) {
                    if (getSelected.length > 1) {
                        window.top.$.messager.alert("温馨提示", "编辑时不能选择多行!");
                    }
                    else {
                        this.addPage(getSelected.val());
                    }
                }
                else {
                    window.top.$.messager.alert("温馨提示", "请选择要编辑的行!");
                }
            },
            tdEditPage: function (obj, evt, kid) {
                this.parent.stopPropagation(evt);
                this.editPage(kid);
            },
            //批量下载二维码
            batchDownloadQRCode:function () {
                var _this = this;
                $.ajax({
                    url: _this.option.data.createBatchQRCodeZip,
                    data: _this.getSearch(),
                    loadMsg: "正在压缩二维码，请稍候...",
                    success: function (data) {
                        if (data && data.rspCode == "success") {
                            setTimeout(function () {
                                window.location.href = _this.option.data.batchDownloadQRCode+"?fileName=" + data.record ;
                                //createDownloadImage();
                            }, 500);
                        }
                        else {
                            $.messager.alert("温馨提示", "二维码下载失败", "error");
                        }
                    },
                    error: function () {
                        $.messager.alert("温馨提示", "二维码下载失败", "error");
                    }
                });
            },
            //重置密码
            resetPwd:function () {
                var _this = this;
                var grid = this.option.body.find(".xll-datagrid");
                var getSelected = this.getSelected();
                if (getSelected && getSelected.length > 0) {
                    if (getSelected.length > 1) {
                        window.top.$.messager.alert("温馨提示", "重置密码时不能选择多行!");
                    }
                    else {
                        window.top.$.messager.confirm("确认", "您确认要重置密码吗？", function (data) {
                            if (data) {
                                console.log(getSelected)
                                $.ajax({
                                    url: _this.option.data.resetPwd,
                                    data: {"id":getSelected.val()},
                                    loadMsg: "正在重置密码，请稍候...",
                                    dataType: "json",
                                    success: function (data) {
                                        window.top.$.messager.alert("温馨提示", data.rspDesc, (data.rspCode == "success" ? "info" : "error"), function () {
                                            if (data.rspCode == "success") {
                                                _this.reload(true);
                                            }
                                        });
                                    }
                                });
                            }
                        });

                    }
                }else {
                    window.top.$.messager.alert("温馨提示", "请选择要重置密码的行!");
                }
            },
            //查看详情
            showDetails: function (kid) {
                if (kid && $.trim(kid).length > 0) {
                    this.details(kid);
                    return;
                }
                var grid = this.option.body.find(".xll-datagrid");
                var getSelected = this.getSelected();
                if (getSelected) {
                    if (getSelected.length > 1) {
                        window.top.$.messager.alert("温馨提示", "查看时不能选择多行!");
                    }
                    else {
                        this.details(getSelected.val());
                    }
                }
                else {
                    window.top.$.messager.alert("温馨提示", "请选择要编辑的行!");
                }
            },
            tdShowDetails: function (obj, evt, kid) {
                this.parent.stopPropagation(evt);
                this.showDetails(kid);
            },
            details: function (kid) {
                var url = this.option.details.url + (this.option.details.url.indexOf("?") >= 0 ? "&" : "?") + (this.option.data.detailsParamName || "id") + "=" + kid;
                var ex = { url: url };
                //拷贝一份数据;
                ex = $.extend({}, this.option.details, ex);
                this.parent.window(ex);
            },
            //删除
            del: function (kid) {
                var _this = this;
                var grid = this.option.body.find(".xll-datagrid");

                var getSelected = this.getSelected().serialize();
                if (kid || getSelected) {
                    window.top.$.messager.confirm("温馨提示", "是否删除选择的行！", function (data) {
                        if (data) {
                            var _delParamName = _this.option.data.delParamName || _this.option.data.kid;

                            var _getSelected;
                            if (!kid) {
                                console.log("kid: " + kid);
                                _getSelected = getSelected.replace(new RegExp(_this.option.data.kid + "=", 'gi'), _delParamName + "=");
                            }

                            $.ajax({
                                url: _this.option.data.deleteUrl || _this.option.data.del,
                                data: kid ? _delParamName + "=" + kid : {"ids":_getSelected},//ids在dto里写个string接
                                loadMsg: "正在删除数据，请稍候...",
                                dataType: "json",
                                success: function (data) {
                                    window.top.$.messager.alert("温馨提示", data.rspDesc, (data.rspCode == "success" || data.rspCode == "0" ? "info" : "error"), function () {
                                        if (data.rspCode == "success" || data.rspCode == "0") {
                                            _this.reload(true);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    window.top.$.messager.alert("温馨提示", "请选择要删除的行！");
                }
            },
            tdDel: function (obj, evt, kid) {
                this.parent.stopPropagation(evt);
                this.del(kid);
            },
            //锁定
            lock: function (lockState, kid) {
                var _this = this;
                var grid = this.option.body.find(".xll-datagrid");
                var getSelected = this.getSelected().serialize();
                var strLock = lockState == 1 ? "冻结" : "解冻";
                if (kid || getSelected) {
                    window.top.$.messager.confirm("温馨提示", "是否" + strLock + "选择的行！", function (data) {
                        if (data) {
                            var _lockParamName = _this.option.data.lockParamName || _this.option.data.kid;

                            var _getSelected;
                            if (!kid) {
                                _getSelected = getSelected.replace(new RegExp(_this.option.data.kid + "=","gi"), _lockParamName + "=");
                            }
                            var data = {"status":lockState, "ids": _getSelected, "id" : kid};

                            $.ajax({
                                url: _this.option.data.lock,
                                data: data,//"state=" + lockState + "&" + (kid ? _lockParamName + "=" + kid : "ids="+_getSelected),
                                loadMsg: "正在" + strLock + "数据，请稍候...",
                                success: function (data) {
                                    window.top.$.messager.alert("温馨提示", data.rspDesc, (data.rspCode == "success" || data.rspCode == "0" ? "info" : "error"), function () {
                                        if (data.rspCode == "success" || data.rspCode == "0") {
                                            _this.reload(true);
                                        }
                                    });
                                    //else {
                                    //    window.top.$.messager.alert("温馨提示", data.Info || "操作失败!");
                                    //}
                                }
                            });
                        }
                    });
                }
                else {
                    window.top.$.messager.alert("温馨提示", "请选择要" + strLock + "的行!");
                }
            },
            tdLock: function (obj, evt, kid, lockState) {
                this.parent.stopPropagation(evt);
                this.lock(lockState, kid);
            },
            //搜索栏事件绑定
            bindSearchEvent: function (obj, item) {
                if (item && item.type) {
                    switch (item.type) {
                        case "number":
                            $(obj).numberbox(
                                $.extend({
                                    precision: 0,
                                    width: 100
                                }, item.option)
                            );
                            break;
                        case "date":
                            if (!item.attributes.onfocus) {
                                $(obj).attr("onfocus", "WdatePicker(" + (item.option || "") + ");");
                                $(obj).addClass("Wdate");
                            }
                            break;
                        case "time":
                            if (!item.attributes.onfocus) {
                                $(obj).attr("onfocus", "WdatePicker({ dateFmt: 'HH:mm:ss' });");
                                $(obj).addClass("Wdate");
                            }
                            break;
                        case "datetime":
                            if (!item.attributes.onfocus) {
                                $(obj).attr("onfocus", "WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss' });");
                                $(obj).addClass("Wdate");
                            }
                            break;
                        case "dateMonth":
                            if (!item.attributes || !item.attributes.onfocus) {
                                $(obj).attr("onfocus", "WdatePicker({ dateFmt: 'yyyy-MM' });");
                                $(obj).addClass("Wdate");
                            }
                            break;
                        default:

                            break;
                    }
                }
            },
            //绑定搜索项
            //index: 搜索栏索引值
            //item: 搜索项
            //prevObj: 将搜索项绑定至此元素
            bindSearch: function (index, item, divSearch, prevObj) {

                if (item && (item.type == "<br>" || item.type == "<br/>" || item.type == "<br />")) {
                    divSearch.append("<br />");
                    return;
                }

                var _this = this;

                var searchItem = $("<div class='list-search-item' />");
                if (item && item.text) {
                    $("<span class='list-search-title' />").html(item.text + (prevObj ? "" : "：")).appendTo(prevObj || searchItem);
                }

                var searchName = item && item.name ? item.name : ("search_" + index);
                var _attr = $.extend({
                    name: "search_" + index,
                    id: "search_" + index
                }, item && item.attributes ? item.attributes : {});

                switch (item && item.type ? item.type : "") {
                    case "<br>":
                    case "<br/>":
                    case "<br />":
                        divSearch.append("<br />");
                        break;
                    case "select":
                        var sSelect = $("<select />", _attr).appendTo(prevObj || searchItem);
                        $(item.option).each(function () {
                            $("<option />", this).appendTo(sSelect);
                        });
                        //选择事件
                        if (typeof item.onChange == "function") {
                            $(sSelect).change(function () {
                                item.onChange(this);
                            });
                        }
                        if (typeof item.data == "object") {

                            if (item.data.emptyOption) {
                                sSelect.append("<option value='"
                                    + item.data.emptyOption.value + "' "
                                    + (item.data.selected
                                        ? " selected='selected' " : "") + ">"
                                    + item.data.emptyOption.text + "</option>");
                            }
                            $.ajax({
                                url: item.data.url,
                                data: item.data.data || {},
                                dataType: "json",
                                success: function (data) {
                                    if (data) {
                                        var _data = data.rows || (data.ItemList
                                            || data);
                                        var valueField = item.data.valueField
                                            || "ID";
                                        var textField = item.data.textField
                                            || "Text";
                                        $(_data).each(function () {
                                            sSelect.append("<option value='"
                                                + eval("this." + valueField)
                                                + "'>" + eval("this."
                                                    + textField) + "</option>");
                                        });
                                    }

                                    if (item.combobox) {
                                        sSelect.combobox(item.combobox);
                                        if (!(item.defValue
                                                && item.defValue.length > 0)) {
                                            sSelect.combobox("clear");
                                        }
                                    }
                                    //加载完成
                                    if (typeof item.loaded == "function") {
                                        item.loaded(sSelect);
                                    }
                                }
                            });
                        }
                        else {
                            if (item.combobox) {
                                sSelect.combobox(item.combobox);
                                if (!(item.defValue && item.defValue.length > 0)) {
                                    sSelect.combobox("clear");
                                }
                            }
                            //加载完成
                            if (typeof item.loaded == "function") {
                                item.loaded(sSelect);
                            }
                        }

                        break;
                    case "checkboxlist":
                        $(item.option).each(function () {
                            var ckbID = "ckb_" + Math.random().toString().replace(".", "");
                            var ckbOption = $("<input type='checkbox' name='" + _attr.name + "' value='" + this.value + "' id='" + ckbID + "'/>").appendTo(prevObj || searchItem);
                            var ckbLabel = $("<label for='" + ckbID + "'>" + this.text + "</label>").appendTo(prevObj || searchItem);
                            if (this.isAll === true) {
                                ckbOption.click(function () {
                                    $("input[name='" + _attr.name + "']").prop("checked", $(this).is(":checked"));
                                });
                            }
                        });

                        if (item.data && item.data.emptyOption) {
                            var ckbID = "ckb_" + Math.random().toString().replace(".", "");
                            var ckbOption = $("<input type='checkbox' name='" + _attr.name + "' value='" + item.data.emptyOption.value + "' id='" + ckbID + "'/>").appendTo(prevObj || searchItem);
                            var ckbLabel = $("<label for='" + ckbID + "'>" + item.data.emptyOption.text + "</label>").appendTo(prevObj || searchItem);
                            if (item.data.emptyOption.isAll === true) {
                                ckbOption.click(function () {
                                    $("input[name='" + _attr.name + "']").prop("checked", $(this).is(":checked"));
                                });
                            }
                        }

                    function changeList() {
                        if (item.data && item.data.emptyOption) {
                            var thisList = $(prevObj || searchItem).find("input[name='" + _attr.name + "']");
                            thisList.not("input[value='" + item.data.emptyOption.value + "']").change(function () {
                                var allCkb = $(prevObj || searchItem).find("input[value='" + item.data.emptyOption.value + "']");
                                if ($("input[name='"+ _attr.name +"']")
                                        .not("input[value='" + item.data.emptyOption.value + "']")
                                        .filter(":checked").length < thisList.length - 1
                                ) {
                                    allCkb.removeProp("checked");
                                }
                                else {
                                    allCkb.prop("checked", "checked");
                                }
                            });
                        }
                    }

                        if (typeof item.data == "object") {
                            $.ajax({
                                url: item.data.url,
                                data: item.data.data || {},
                                dataType: "json",
                                success: function (data) {
                                    if (data) {
                                        var _data = data.rows || (data.ItemList || data);
                                        var valueField = item.data.valueField || "ID";
                                        var textField = item.data.textField || "Text";

                                        $(_data).each(function () {
                                            var ckbID = "ckb_" + Math.random().toString().replace(".", "");
                                            var ckbOption = $("<input type='checkbox' name='" + _attr.name + "' value='" + eval("this." + valueField) + "' id='" + ckbID + "'/>").appendTo(prevObj || searchItem);
                                            var ckbLabel = $("<label for='" + ckbID + "'>" + eval("this." + textField) + "</label>").appendTo(prevObj || searchItem);
                                        });
                                    }
                                    //加载完成
                                    if (typeof item.loaded == "function") {
                                        item.loaded(sSelect);
                                    }
                                    changeList();
                                }
                            });
                        }
                        else
                        {
                            //加载完成
                            if (typeof item.loaded == "function") {
                                item.loaded(sSelect);
                            }
                            changeList();
                        }

                        break;
                    case undefined:
                    case null:
                    case "":
                    case "text":
                    case "number":
                    case "date":
                    case "time":
                    case "datetime":
                    case "dateMonth":
                        _attr = $.extend(_attr, { type: "text" });
                        var sTxt = $("<input />", _attr).appendTo(prevObj || searchItem);
                        _this.bindSearchEvent(sTxt, item);
                        if (_attr && _attr.value && $.trim(_attr.value).length > 0) {
                            sTxt.attr("resetVal", _attr.value);
                        };
                        break;
                    case "region":

                        var regionAttributes = {
                            provinceClientID: "provinceId",
                            cityClientID: "cityId",
                            countyClientID: "countyId"
                        }

                        if (item.attributes) {
                            $.extend(regionAttributes, item.attributes);
                        }

                        var pRegion = $("<select id='" + regionAttributes.provinceClientID + "' name='" + regionAttributes.provinceClientID + "'></select>").appendTo(prevObj || searchItem);
                        var cRegion = $("<select id='" + regionAttributes.cityClientID + "' name='" + regionAttributes.cityClientID + "'></select>").appendTo(prevObj || searchItem);
                        var aRegion = $("<select id='" + regionAttributes.countyClientID + "' name='" + regionAttributes.countyClientID + "'></select>").appendTo(prevObj || searchItem);
                        //debugger;
                        //setTimeout(function () {
                        this.parent.region({
                            ddlProvince: pRegion,
                            ddlCity: cRegion,
                            ddlCounty: aRegion,
                            defaultID: (item.option ? (item.option.defaultID || 0) : 0)
                        });
                        //}, 200);

                        break;
                    case "shopCategory":
                        var category = {
                            ddlOne: "ddlShopCategory1",
                            ddlTwo: "ddlShopCategory2"
                        }

                        if (item.attributes) {
                            $.extend(category, item.attributes);
                        }

                        var ddlShopCategory1 = $("<select id='" + category.ddlOne + "' name='" + category.ddlOne + "'></select>").appendTo(prevObj || searchItem);
                        $(prevObj || searchItem).append("-");
                        var ddlShopCategory2 = $("<select id='" + category.ddlTwo + "' name='" + category.ddlTwo + "'></select>").appendTo(prevObj || searchItem);

                        _this.parent.shopCategory($.extend({}, category,
                            {
                                ddlOne: ddlShopCategory1,
                                ddlTwo: ddlShopCategory2
                            }
                        ));

                        break;

                    //选择仓库
                    case "warehouse":
                        var warehouseItem = $.extend({}, item);
                        if (warehouseItem.option == undefined) {
                            warehouseItem.option = {};
                        }
                        warehouseItem.option.parentElement = $(prevObj || searchItem);
                        if (warehouseItem.attributes == undefined) {
                            warehouseItem.attributes = {};
                        }

                        warehouseItem.attributes = $.extend({
                            name: "listWarehouse",
                            id: "listWarehouse"
                        }, warehouseItem.attributes);

                        this.loadingCount += 1;

                        this.parent.cWarehouse(warehouseItem, this,_attr,prevObj,searchItem);
                        break;

                    case "oparea":
                        var opAreaItem = $.extend({}, item);
                        if (opAreaItem.option == undefined) {
                            opAreaItem.option = {};
                        }
                        opAreaItem.option.parentElement = $(prevObj || searchItem);
                        if (opAreaItem.attributes == undefined) {
                            opAreaItem.attributes = {};
                        }

                        opAreaItem.attributes = $.extend({
                            name: "OporgAreaId",
                            id: "OporgAreaId"
                        }, opAreaItem.attributes);

                        this.loadingCount += 1;

                        this.parent.bindOpArea(opAreaItem, this);

                        break;

                    //区域和配送线路控件
                    case "opaeraAndLine":
                        var opAreaItem = $.extend({}, item);
                        if (opAreaItem.option == undefined) {
                            opAreaItem.option = {};
                        }
                        opAreaItem.option.parentElement = $(prevObj || searchItem);
                        if (opAreaItem.attributes == undefined) {
                            opAreaItem.attributes = {};
                        }

                        opAreaItem.attributes = $.extend({
                            name: "OporgAreaId",
                            id: "OporgAreaId"
                        }, opAreaItem.attributes);

                        this.loadingCount += 1;

                        this.parent.bindOpArea(opAreaItem, this);

                        _this.bindSearch(index + 1, { text: "配送线路", type: "select", attributes: { name: "LineID" } }, divSearch, searchItem);
                        break;
                    case "vendor":
                        item.option = $.extend({
                            keyID: item.option.vendorId,
                            codeID: item.option.vendorCodeId,
                            nameID: item.option.vendorNameId
                        }, item.option);

                        item.urlData = {
                            title: "选择供应商",
                            //选择页面地址
                            selectUrl: contextPath+"/products/selectVendor",
                            url: contextPath+"/products/selectVendor",
                            callback: function (data) {
                                if (item.urlData.callback) {
                                    item.urlData.callback(data);
                                }
                            }
                        }

                    //break;
                    case "selectList":

                        var htmlCodeID = item.option.codeID || (item.option.keyID || "search_code_" + index);
                        //编码
                        var txtVendorCode = $("<input />", {
                            name: htmlCodeID,
                            id: htmlCodeID,
                            type: "text",
                            value: (item.option ? (item.option.defaultCodeValue || "") : ""),
                            placeholder: item.option ? (item.option.codePlaceholder || "") : ""
                        }).appendTo(prevObj || searchItem);

                        //选择按钮
                        var btnVendorCode = $("<input type='button' value=' ... ' />", {
                            id: "btn_search_code_" + index,
                        }).appendTo(prevObj || searchItem);

                        var htmlNameID = item.option.nameID || "search_name_" + index;
                        //名称
                        var txtVendorName = $("<input />", {
                            name: htmlNameID,
                            id: htmlNameID,
                            type: "text",
                            value: (item.option ? (item.option.defaultNameValue || "") : ""),
                            placeholder: item.option ? (item.option.namePlaceholder || "") : ""
                        }).appendTo(prevObj || searchItem);

                        var htmlKeyID = item.option.keyID || "search_key_" + index;
                        //编号
                        var txtVendorID = $("<input />", {
                            name: htmlKeyID,
                            id: htmlKeyID,
                            type: "text",
                            value: (item.option ? (item.option.defaultIDValue || "") : "")
                        }).appendTo(prevObj || searchItem).hide();

                    function selectListChange(data) {
                        txtVendorID.val(eval("data." + (item.option.keyField || (item.option.keyID || (item.option.codeField || (item.option.codeID || "code"))))));
                        txtVendorCode.val(eval("data." + (item.option.codeField || (item.option.codeID || "code"))));
                        txtVendorName.val(eval("data." + (item.option.nameField || (item.option.nameID || "code"))));
                        if (typeof item.callback == "function") {
                            item.callback(data);
                        }
                    }

                        ///文本框变更事件
                    function listChange(evt) {
                        xsjs.stopPropagation(evt);
                        if (item.urlData && item.urlData.url) {

                            var queParam = item.queryParams && item.queryParams() ? item.queryParams() : {};
                            if (typeof queParam == "string" && queParam.length > 0) {
                                queParam = xsjs.SerializeDecodeURL2Json(queParam);
                            }

                            queParam = $.extend(queParam, xsjs.SerializeDecodeURL2Json($(txtVendorCode).serialize().replace(new RegExp("\\+", 'gi'), " ")), xsjs.SerializeDecodeURL2Json($(txtVendorName).serialize().replace(new RegExp("\\+", 'gi'), " ")));

                            $.ajax({
                                url: item.urlData.url,
                                data: queParam,
                                success: function (data) {
                                    if (data || data.rows) {
                                        var _jdata = data && data.rows ? data.rows : data;
                                        if (_jdata.length == 1) {
                                            selectListChange(_jdata[0]);
                                            return;
                                        }
                                    }

                                    btnVendorCode.trigger("click");
                                },
                                error: function () {
                                }
                            });
                        }

                        return false;
                    };

                        $(txtVendorCode).change(function (evt) {
                            listChange(evt);
                        });
                        $(txtVendorName).change(function (evt) {
                            listChange(evt);
                        });

                        btnVendorCode.click(function () {
                            xsjs.window($.extend({
                                    title: "选择",
                                    width: 960,
                                    minHeight: 500,
                                    owdoc: window.top,
                                    modal: true
                                }, item.urlData,
                                {
                                    url: item.urlData.selectUrl + (item.urlData.selectUrl.lastIndexOf("?") == item.urlData.selectUrl.length - 1 || item.urlData.selectUrl.lastIndexOf("&") == item.urlData.selectUrl.length - 1 ? "" : item.urlData.selectUrl.indexOf("?") >= 0 ? "&" : "?")
                                    + (item.queryParams && item.queryParams() ? item.queryParams() + "&" : "")
                                    + (item.option.codeID || (item.option.codeID || "code")) + "=" + $.trim(txtVendorCode.val())
                                    + "&" + (item.option.nameID || "name") + "=" + $.trim(txtVendorName.val()),
                                    callback: function (data) {
                                        selectListChange(data);
                                    }
                                }));
                        });
                        break;
                    default:
                        //显示自己配送的项
                        var sTxt = $("<" + item.type + " />", _attr).appendTo(prevObj || searchItem);
                        if (item.html) {
                            sTxt.html(item.html);
                        }
                        _this.bindSearchEvent(sTxt, item);
                        break;
                }

                if (prevObj == null || prevObj == undefined) {
                    searchItem.appendTo(divSearch);

                    //加载完成事件
                    if (item && typeof item.onLoaded == "function") {
                        item.onLoaded(searchItem);
                    }
                }
                return searchItem;
            },
            //加载搜索区域
            loadSearch: function () {
                if (this.option && this.option.search) {

                    var _this = this;
                    var formSearch = $("<div class='xll-list-search list-search fixeElement'/>").appendTo(this.option.body);
                    var divSearch = $("<form />").appendTo(formSearch);

                    var preObj;

                    for (var i = 0; i < this.option.search.length; i++) {
                        var item = _this.option.search[i];
                        preObj = _this.bindSearch(i, item, divSearch);

                        if (item && item.column && item.column > 0) {
                            for (var j = i + 1; j < (i + item.column > _this.option.search.length ? _this.option.search.length : i + item.column) ; j++) {
                                _this.bindSearch(j, _this.option.search[j], divSearch, preObj);
                            }
                            i = i + item.column - 1;
                        }
                    }

                    var btnSearchItem = $("<div class='list-search-item'></div>").appendTo(divSearch);

                    var btnSearch;
                    //是否显示搜索栏查询按钮
                    if (this.option.isShowSearch) {
                        btnSearch = $("<a iconCls='icon-search'>查询</a>").appendTo(btnSearchItem).linkbutton();
                    }
                    btnSearchItem.append("\r\n");

                    //是否显示清空按钮
                    if (this.option.isShowEmpty) {
                        var btnCal = $("<a iconCls='icon-back'>清空</a>").appendTo(btnSearchItem).linkbutton().click(function () {
                            _this.option.body.find(".xll-list-search form").get(0).reset();

                            _this.option.body.find(".xll-list-search form").find(".numberbox-f").numberbox("reset");

                            _this.option.body.find(".xll-list-search form input[type='text']").each(function () {
                                if ($(this).attr("resetVal") != "undefined") {
                                    $(this).val($(this).attr("resetVal"));
                                }
                            });
                            _this.option.body.find(".xll-list-search form").find("input[numberboxname='userOrderNumber']").numberbox("reset");
                            if (typeof _this.option.onSearchReset == "function") {
                                _this.option.onSearchReset();
                            }
                        });
                    }

                    if (_this.option.searchButtons) {
                        $(_this.option.searchButtons[0]).each(function () {
                            var sBtn = $("<a></a>");
                            btnSearchItem.append(sBtn);
                            sBtn.linkbutton(this);
                            if (this.handler) {
                                var sthis = this;
                                sBtn.click(function () {
                                    sthis.handler();
                                });
                            }
                        });
                    }

                    var btnSubmitDiv = $("<div style='display: none;'></div>").appendTo(btnSearchItem);
                    var btnSubmit = $("<input type='submit' class='list-btnsearch' value='查询'/>").appendTo(btnSubmitDiv).click(function () {
                        _this.loadList();
                        if (typeof _this.option.searchSubmit == "function") {
                            _this.option.searchSubmit();
                        }
                        return false;
                    });

                    if (this.option.isShowSearch) {
                        btnSearch.click(function () {
                            _this.loadList();
                            return false;
                        });
                    }
                }
            },
            //获取当前搜索栏中值
            //rtnJson: 是否为json
            getSearch: function (rtnJson) {
                var listSearch = $(this.option.body.find(".xll-list-search").find("input,select"));
                var strSerialize = listSearch.serialize().replace(new RegExp("\\+", 'gi'), " ");
                var _datagrid = this.option.datagrid;
                if (rtnJson === true) {
                    var searchParams = listSearch.serialize().length > 0 ? this.parent.SerializeDecodeURL2Json(strSerialize, true) : [];
                    return $.extend({}, _datagrid.queryParams, searchParams);
                }
                else {
                    var _queryParams = "";
                    /*                    for (var p in _datagrid.queryParams) {
                                            _queryParams += p + "=" + _datagrid.queryParams[p] + '&';
                                        }*/
                    return _queryParams + strSerialize;
                }
            },

            //导出excel查询条件去空格处理
            getSearchTrim : function () {
                var listSearch = $(this.option.body.find(".xll-list-search").find("input,select"));
                return xsjs.paramTrim(listSearch.serialize());
            },
            //获取搜索条件
            getSearchJson: function () {
                var listSearch = $(this.option.body.find(".xll-list-search").find("input,select"));
                var searchParams = listSearch.serialize().length > 0 ? this.parent.SerializeDecodeURL2Json(listSearch.serialize().replace(new RegExp("\\+", 'gi'), " "), true) : [];

                var _datagrid = this.option.datagrid;
                var queryParams = $.extend({}, _datagrid.queryParams, searchParams);
                return queryParams;
            },
            //需等待异步加载数量
            loadingCount: 0,
            //已经异步加载完成的数量
            loadedCount: 0,
            //加载数据列表
            loadList: function (isPageLoad) {
                if (this.loadedCount < this.loadingCount) {
                    return;
                }

                if (typeof options.onSearchVerify == "function") {
                    if (!options.onSearchVerify(this.getSearchJson())) {
                        return;
                    }
                }

                var listSearch = $(this.option.body.find(".xll-list-search").find("input,select"));
                var searchParams = listSearch.serialize().length > 0 ? this.parent.SerializeDecodeURL2Json(listSearch.serialize().replace(new RegExp("\\+", 'gi'), " "), true) : [];

                var _datagrid = this.option.datagrid;

                var _params = "";
                if (listSearch && listSearch.length > 0 && listSearch.serialize().length > 0 && _datagrid.bakurl) {
                    var bakurl = "";
                    _datagrid.url = _datagrid.bakurl + (_datagrid.bakurl.indexOf("?") > 0 ? "&" : "?");
                    // _datagrid.url += listSearch.serialize();
                    _datagrid.url += xsjs.paramTrim(listSearch.serialize());
                    _datagrid.url += bakurl;
                }

                if (!(isPageLoad === true)) {
                    if (this.option.body.find(".xll-datagrid").datagrid("getSelections").length > 0) {
                        this.option.body.find(".xll-datagrid").datagrid("clearSelections");
                    }
                    this.option.body.find(".xll-datagrid").datagrid({ "url": _datagrid.url });
                    return;
                }

                if (!this.option.datagrid.height) {
                    var fixeHeight = 0;
                    this.option.body.find(".fixeElement:visible").each(function () {
                        fixeHeight += $(this).outerHeight(true)
                    });

                    if (this.option.freeze) {
                        this.option.freeze.each(function () {
                            fixeHeight += $(this).outerHeight(true);
                        });
                    }
                    fixeHeight = (this.option.body.get(0).nodeName == "BODY" ? $(window) : this.option.body).height() - fixeHeight;

                    this.option.datagrid.height = fixeHeight;
                    //alert(this.option.datagrid.height);
                }

                if (!_datagrid.pageSize) {
                    var gridHeight = this.option.datagrid.height / 25;
                    if (gridHeight > 33) {
                        _datagrid.pageSize = 30;
                    }
                    else if (gridHeight > 23) {
                        _datagrid.pageSize = 20;
                    }
                    else if (gridHeight > 18) {
                        _datagrid.pageSize = 15
                    }
                }

                //var _datagrid = this.option.datagrid;
                //_datagrid.queryParams = $.extend(_datagrid.queryParams, searchParams);
                //if (listSearch && listSearch.length > 0 && listSearch.serialize().length > 0 && _datagrid.url) {
                //    _datagrid.url += _datagrid.url.indexOf("?") > 0 ? "&" : "?";
                //    _datagrid.url += listSearch.serialize();
                //}

                var dataGridOptions = _datagrid;

                //绑定列表
                if (_datagrid.subgrid) {

                    dataGridOptions = { options: _datagrid, subgrid: _datagrid.subgrid };
                    //alert('');
                    //debugger;
                    this.option.body.find(".xll-datagrid").datagrid({
                        //height: 1000
                    }).datagrid("subgrid", dataGridOptions);

                    //this.option.body.find(".xll-datagrid").datagrid(_datagrid);
                }
                //debugger;
                else {
                    this.option.body.find(".xll-datagrid").datagrid(_datagrid);
                }
            },
            //刷新列表
            //isCancelCheckbox：是否取消已选择的行，默认为false
            reload: function (isCancelCheckbox) {
                this.option.body.find(".xll-datagrid").datagrid("unselectAll").datagrid("reload");
            },
            //验证权限
            //item：选项
            //sys: 是否为系统默认项
            verifyPrivileges: function (item, sys) {

                var _this = this;
                var thisItem = {};

                if (typeof item == "string") {
                    thisItem.action = item;
                    thisItem.text = item;
                }
                else {
                    thisItem = item;
                }

                //是否需验证权限
                if (thisItem.bcode || thisItem.mcode) {

                    if (_this.parent.pagePrivileges == null || _this.parent.pagePrivileges == undefined) {
                        return false;
                    }

                    if (_this.parent.pagePrivileges.isAll === true) {
                        return true;
                    }
                    else {
                        //是否有操作权限
                        if (thisItem.bcode && _this.parent.pagePrivileges.bCode.indexOf("," + thisItem.bcode + ",") < 0) {
                            return false;
                        }
                        //是否有页面权限
                        else if (thisItem.mcode && _this.parent.pagePrivileges.bCode.indexOf("," + thisItem.mcode + ",") < 0) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                }
                else {
                    return true;
                }
            },
            //绑定列表工具栏
            bindToolbar: function (obj) {
                if (obj.toolbar) {
                    var _this = this;
                    //debugger;
                    for (var ti = 0; ti < obj.toolbar.length; ti++) {
                        var item = obj.toolbar[ti];
                        //}

                        if (!this.verifyPrivileges(item)) {
                            continue;
                        }

                        //$(obj.toolbar).each(function (index, item) {
                        var objItem = {
                            itemAction: null,
                            itemText: null
                        };

                        if (typeof item == "string") {
                            objItem.itemAction = item;
                        }
                        else if (item.action) {
                            objItem = $.extend(objItem, item);
                            objItem.itemAction = item.action;
                            objItem.itemText = item.Text || item.text;
                        }

                        if (objItem.itemAction && objItem.itemAction != undefined && objItem.itemAction != null) {
                            switch (objItem.itemAction) {
                                case "-":
                                    if (_this.option.datagrid.toolbar.lastIndexOf("-") != _this.option.datagrid.toolbar.length - 1 && _this.option.datagrid.toolbar.length > 0) {
                                        _this.option.datagrid.toolbar.push("-");
                                    }
                                    break;
                                //添加按钮
                                case "add":
                                case "添加":
                                    _this.option.datagrid.toolbar.push({
                                        id: 'btnAdd',
                                        text: objItem.itemText || '添加',
                                        iconCls: 'icon-add',
                                        handler: function () {
                                            _this.addPage(0);
                                        }
                                    });
                                    break;
                                case "edit":
                                case "编辑":
                                    _this.option.datagrid.toolbar.push({
                                        id: 'btnEdit',
                                        text: '编辑',
                                        iconCls: 'icon-edit',
                                        handler: function () {
                                            _this.editPage();
                                        }
                                    });
                                    break;
                                case "delete":
                                case "删除":
                                    _this.option.datagrid.toolbar.push({
                                        id: 'btnDelete',
                                        text: '删除',
                                        iconCls: 'icon-remove',
                                        handler: function () {
                                            _this.del();
                                        }
                                    });
                                    break;
                                case "reload":
                                case "刷新":
                                    _this.option.datagrid.toolbar.push({
                                        text: '刷新',
                                        iconCls: 'icon-reload',
                                        handler: function () {
                                            _this.reload();
                                        }
                                    });
                                    break;
                                case "show":
                                case "查看":
                                    _this.option.datagrid.toolbar.push({
                                        text: '查看',
                                        iconCls: 'icon-show',
                                        handler: function () {
                                            _this.showDetails();
                                        }
                                    });
                                    break;
                                case "lock":
                                case "锁定":
                                    var lockMenu = $("<div />").appendTo("body");
                                    var linkLock = $("<div data-options=\"iconCls:'icon-lock'\">冻结</div>").appendTo(lockMenu).click(function () {
                                        _this.lock(1);
                                    });
                                    var linkLock = $("<div data-options=\"iconCls:'icon-unlock'\">解冻</div>").appendTo(lockMenu).click(function () {
                                        _this.lock(0);
                                    });
                                    _this.option.datagrid.toolbar.push({
                                        type: "menubutton",
                                        text: '冻结',
                                        iconCls: 'icon-lock',
                                        menu: lockMenu,
                                        handler: function () {
                                            _this.lock(1);
                                        }
                                    });
                                    break;
                                case "export":
                                case "导出":
                                function setExcel(excelItem) {
                                    _this.option.datagrid.toolbar.push({
                                        text: excelItem.itemText || '导出',
                                        iconCls: excelItem.iconCls || 'icon-excel',
                                        handler: function () {
                                            xsjs.download({
                                                action: excelItem.url,
                                                data: _this.getSearch(),
                                                loadMsg: excelItem.loadMsg || "正在导出数据，请稍候..."
                                            });
                                        }
                                    });
                                }
                                    setExcel(objItem);
                                    break;
                                case "resetPwd":
                                case "重置密码":
                                    _this.option.datagrid.toolbar.push({
                                        id: 'btnResetPwd',
                                        text: '重置密码',
                                        iconCls: 'icon-resetNew',
                                        handler: function () {
                                            _this.resetPwd();
                                        }
                                    });
                                    break;
                                case "batchDownloadQRCode":
                                case "批量下载二维码":
                                    _this.option.datagrid.toolbar.push({
                                        id: 'btnBatchDownloadQRCode',
                                        text: '批量下载二维码',
                                        iconCls: 'icon-download',
                                        handler: function () {
                                            _this.batchDownloadQRCode();
                                        }
                                    });
                                    break;
                                default:
                                    break;
                            }
                        }
                        else {
                            if (item.menubutton) {
                                var bMenu = $("<div />").appendTo(document.body).hide();
                                $(item.menubutton).each(function () {
                                    var _item = this;
                                    var linkMenu = $("<div />").attr({ "iconCls": this.iconCls || "" }).html(this.text).appendTo(bMenu).click(function () {
                                        _item.handler();
                                    });
                                });
                                item.menu = bMenu;
                            }
                            _this.option.datagrid.toolbar.push(item);
                        }
                    };
                }
            },
            //绑定导航
            bindNav: function (obj) {
                if (obj && obj.nav && obj.nav.length > 0) {
                    var _this = this;
                    var divNav = $("<div id='sysNav' class='xllpage-nav fixeElement'/>").appendTo(this.option.body);
                    divNav.html("<span class='xllpage-nav-default'>位置：</span>");

                    var navUl = $("<ul class='xllpage-nav-ul'>").appendTo(divNav);

                    for (var i = 0; i < obj.nav.length; i++) {
                        var item = obj.nav[i];
                        if (item.href) {
                            navUl.append("<li><a class='xllpage-nav-title' href='" + item.href + "'>" + item.text + "</a></li>");
                        }
                        else {
                            navUl.append("<li><a href='javascript:void(0)' class='xllpage-nav-title'>" + (typeof item == "string" ? item : item.text) + "</a></li>");
                        }
                    }
                }
            },
            //绑定列操作列表
            bindAction: function (obj) {
                var _this = this;
                //$(body).
                function getActionStr(item, rowData) {
                    var str = "";

                    var thisItem = {};
                    if (typeof item == "string") {
                        thisItem.action = item;
                        thisItem.text = item;
                    }
                    else {
                        thisItem = item;
                    }

                    if (!_this.verifyPrivileges(item)) {
                        return "";
                    }

                    switch (thisItem.action) {
                        case "delete":
                        case "删除":
                            //$(".xll-iframeBody").get(0).options
                            str += "<a href='javascript:void(0);' onclick=\"$(this).closest('.xll-iframeBody').get(0).options.tdDel(this, event, '" + eval("rowData." + _this.option.data.kid) + "')\">" + (thisItem.text || "删除") + "</a>";
                            break;
                        case "lock":
                        case "锁定":
                            var lockValue = eval("rowData." + _this.option.data.lockField);
                            if (lockValue == "FROZEN" || lockValue == true) {
                                str += "<a href='javascript:void(0);' onclick=\"$(this).closest('.xll-iframeBody').get(0).options.tdLock(this, event, '" + eval("rowData." + _this.option.data.kid) + "', 0)\">解冻</a>";
                            }
                            else {
                                str += "<a href='javascript:void(0);' onclick=\"$(this).closest('.xll-iframeBody').get(0).options.tdLock(this, event, '" + eval("rowData." + _this.option.data.kid) + "', 1)\">冻结</a>";
                            }
                            break;
                        case "edit":
                        case "编辑":
                            str += "<a href='javascript:void(0);' onclick=\"$(this).closest('.xll-iframeBody').get(0).options.tdEditPage(this, event, '" + eval("rowData." + _this.option.data.kid) + "')\">" + (thisItem.text || "编辑") + "</a>";
                            break;
                        case "show":
                        case "查看":
                            str += "<a href='javascript:void(0);' onclick=\"$(this).closest('.xll-iframeBody').get(0).options.tdShowDetails(this, event, '" + eval("rowData." + _this.option.data.kid) + "')\">" + (thisItem.text || "查看") + "</a>";
                            break;
                        default:

                            break;
                    }
                    return str;
                };

                $(obj.datagrid.columns[0]).each(function (index, item) {
                    if (item.dataType && typeof item.formatter == "undefined") {
                        switch (item.dataType) {
                            //金额转换两位小数
                            case "money":
                                item.formatter = function (value, rows) {
                                    if (xsjs.validator.IsNumber(value)) {
                                        return value.toFixed(2);
                                    }
                                }
                                if (!item.align) {
                                    item.align = "right";
                                }
                                break;
                            //日期
                            case "dateTime":
                            case "date":
                            case "time":
                                item.formatter = function (value, rows) {
                                    return xsjs.dateFormat(value, item.dataType == "dateTime"
                                        ? "yyyy-MM-dd HH:mm:ss"
                                        : (item.dataType == "date" ? "yyyy-MM-dd" : "HH:mm:ss"));
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });

                if (obj.datagrid.xsTdAction) {
                    var indexDataGridAction = -1;
                    $(obj.datagrid.columns[0]).each(function (index, item) {
                        if (item.field == "datagrid-action") {
                            indexDataGridAction = index;
                        }
                    });
                    //操作栏显示按钮
                    if (indexDataGridAction >= 0) {
                        _this.option.datagrid.columns[0][indexDataGridAction].formatterBack = obj.datagrid.columns[0][indexDataGridAction].formatter;
                        _this.option.datagrid.columns[0][indexDataGridAction].formatter = function (value, rowData) {
                            var str = "";
                            for (var ai = 0; ai < obj.datagrid.xsTdAction.length; ai++) {
                                str += getActionStr(obj.datagrid.xsTdAction[ai], rowData);
                            }
                            return str + this.formatterBack(value, rowData);
                        };
                    }
                    else {
                        _this.option.datagrid.columns[0].push({
                            field: 'datagrid-action', "class": "ffffff", title: '操作', align: 'center', formatter: function (value, rowData) {
                                var str = "";
                                for (var ai = 0; ai < _this.option.datagrid.xsTdAction.length; ai++) {

                                    str += getActionStr(_this.option.datagrid.xsTdAction[ai], rowData);
                                }
                                return str;
                            }
                        });
                    }
                }
            },
            //当数据载入成功时触发。
            onLoadSuccess: function (data) {
                if (data && data.code) {
                    if (data.code == 10 || data.code == 11) {
                        window.top.$.messager.alert("", decodeURIComponent(data.msg), "info", function () {
                            if (data.data == 10) {
                                window.location.href = "/admin/NotPurview.aspx";
                            }
                            else {
                                window.top.location.href = "/login.aspx";
                            }
                        });
                    }
                }
            },
            //在请求载入数据之前触发，如果返回false将取消载入。
            onBeforeLoad: function () {
                var getPager = this.option.body.find(".xll-datagrid").datagrid("getPager");
                if (getPager.length > 0) {
                    var getPagerOptions = getPager.pagination("options");
                    var endSize = getPagerOptions.pageNumber * getPagerOptions.pageSize;
                    var autoNumberWidth = $("#autoNumberWidth").length > 0 ? $("#autoNumberWidth") : $("<style id='autoNumberWidth' type='text/css'></style>").appendTo("head");
                    if (endSize >= 1000) {
                        //加载数据列表时自动计算序号列的宽度
                        var rownumberWidth = endSize.toString().length * 7;
                        autoNumberWidth.html(".datagrid-cell-rownumber,.datagrid-header-rownumber{width: " + rownumberWidth + "px} .pagination .pagination-num{width: " + rownumberWidth + "px}");
                    } else {
                        autoNumberWidth.html("");
                    }
                    this.option.body.find(".xll-datagrid").datagrid("autoSizeColumn");
                }
            },
            onLoadError: function (none) {

            },
            //绑定
            bind: function (obj) {
                /// <summary>初始化绑定</summary>
                /// <param type="object" name="obj">
                /// <para>{</para>
                /// <para>editUrl: "编辑页url"</para>
                /// <para>}</para>
                /// </param>

                var _this = this;

                if (obj) {

                    //是否验证操作权限
                    if (obj.data && obj.data.mcode) {
                        this.parent.pagePrivileges.getPrivileges(obj.data.mocde);
                    }

                    if (obj.body) {
                        this.option.body = obj.body;
                    }

                    if (obj.isVPrivileges) {
                        this.option.isVPrivileges = obj.isVPrivileges;
                    }

                    //编辑
                    if (obj.edit) {
                        this.option.edit = $.extend(this.option.edit, obj.edit);
                    }

                    if (obj.details) {
                        this.option.details = $.extend(this.option.details, obj.details);
                    }

                    //数据处理
                    this.option.data = $.extend(this.option.data, obj.data);

                    //数据列表
                    if (obj.datagrid) {
                        this.option.datagrid = $.extend(this.option.datagrid, obj.datagrid);
                        this.option.datagrid.bakurl = this.option.datagrid.url;

                        this.option.datagrid.queryParams = $.extend(this.option.datagrid.queryParams || {}, {
                            m: this.option.data ? (this.option.data.method || 0) : 0,
                            a: this.option.data ? (this.option.data.list || "") : 0,
                            opt: this.option.data ? (this.option.data.list || "") : ""
                        });

                        this.bindAction(obj);

                        //当数据载入成功时触发。
                        if (this.option.datagrid.onLoadSuccess) {
                            var datagrid_loadSuccess = this.option.datagrid.onLoadSuccess;
                            this.option.datagrid.onLoadSuccess = function (data) {
                                _this.onLoadSuccess(data);
                                datagrid_loadSuccess(data);

                                setTimeout(function () {
                                    $(window).resize();
                                }, 100);
                            }
                        }
                        else {
                            this.option.datagrid.onLoadSuccess = function (data) {
                                _this.onLoadSuccess(data);

                                setTimeout(function () {
                                    $(window).resize();
                                }, 100);
                            }
                        }

                        //在请求载入数据之前触发，如果返回false将取消载入。
                        if (this.option.datagrid.onBeforeLoad) {
                            var datagrid_beforeLoad = this.option.datagrid.onBeforeLoad;
                            this.option.datagrid.onBeforeLoad = function (data) {
                                _this.onBeforeLoad(data);
                                datagrid_beforeLoad(data);
                            }
                        }
                        else {
                            this.option.datagrid.onBeforeLoad = function (data) {
                                _this.onBeforeLoad(data);
                            }
                        }
                    }

                    this.bindToolbar(obj);

                    if (typeof obj.isShowSearch == "boolean") {
                        this.option.isShowSearch = obj.isShowSearch;
                    }

                    if (typeof obj.isShowEmpty == "boolean") {
                        this.option.isShowEmpty = obj.isShowEmpty;
                    }

                    if (obj.search) {
                        this.option.search = obj.search;
                    }

                    if (obj.searchButtons) {
                        this.option.searchButtons = obj.searchButtons;
                    }

                    this.bindNav(obj);

                    if (obj.freeze) {
                        this.option.freeze = obj.freeze;
                    }
                }

                //清空按钮回调事件
                if (typeof obj.onSearchReset == "function") {
                    this.option.onSearchReset = obj.onSearchReset;
                }

                this.param = _this.parent.SerializeURL2Json();
                this.loadSearch();
                this.option.body.addClass("xll-iframeBody");
                var grid = $("<div class='xll-datagrid'>").appendTo(this.option.body);

                if (typeof obj.onBeforeLoad == "function") {
                    obj.onBeforeLoad();
                }

                this.loadList(true);

                this.option.body.get(0).options = this;

                $(window).resize(function () {

                    var fixeHeight = 0;

                    $(_this.option.body).find(".fixeElement:visible").each(function () {
                        fixeHeight += $(this).outerHeight(true)
                    });
                    if (obj.freeze) {
                        obj.freeze.each(function () {
                            fixeHeight += $(this).outerHeight(true)
                        });
                    }

                    fixeHeight = ($(_this.option.body).get(0).nodeName == "BODY" ? $(window) : $(_this.option.body)).height() - fixeHeight;

                    //当浏览器尺寸发生变化时重新设置表格的大小
                    _this.option.body.find(".xll-datagrid").datagrid('resize', {
                        height: fixeHeight,
                        width: $(_this.option.body).width()
                    });
                });

                //
                this.getGrid = grid;
                return this;
            },
            //编辑字段
            //items: {
            //  filed: 字段名称
            //  saveFn：保存事件
            //  getFnValue：设置当前要编辑的文档框的值
            //}
            editFiled: function (editItems) {
                var _this = this;
                $(".datagrid-btable td[field='" + editItems.filed + "']").dblclick(function (evt) {
                    xsjs.stopPropagation(evt);
                    var divobj = $(this).find("div:eq(0)");
                    if (divobj.is(":visible")) {
                        if ($(this).find("div").length > 1) {
                            $(this).find("div:eq(1)").show();
                        }
                        else {
                            //获取datagrid加载的数据
                            var getDatagrid = _this.option.body.find(".xll-datagrid").datagrid('getData').rows;

                            var productId = eval("getDatagrid[parseInt($(this).closest('tr').attr('datagrid-row-index'))]." + _this.option.data.kid);

                            var thisEditModel = $.grep(getDatagrid, function (item, index) {
                                var isE = eval("item." + _this.option.data.kid + " == " + productId);
                                return isE;
                            });

                            if (editItems.verify) {
                                if (!editItems.verify(thisEditModel[0])) {
                                    return;
                                }
                            }

                            $(this).find("div:eq(0)").hide();

                            var editDiv = $("<div />").appendTo(this);

                            var editValue = eval("thisEditModel[0]." + editItems.filed);
                            if (editItems.getFnValue) {
                                editValue = editItems.getFnValue(thisEditModel[0]);
                            }

                            var editText = $("<input type='text' maxlength='" + (editItems.maxLength || 6) + "' style='width: " + ($(this).outerWidth() - 6) + "px;' value='" + editValue + "'/>").appendTo(editDiv);
                            var br = $(editDiv).append("<br/>");
                            var btn = $("<a href='javascript: void(0)'>保存</a>").appendTo(editDiv).click(function (evt) {
                                xsjs.stopPropagation(evt);

                                //保存事件
                                editItems.saveFn({
                                    //主键值
                                    kid: productId,
                                    //要保存的值
                                    val: editText.val(),
                                    //编辑字段
                                    filed: editItems.filed,
                                    //回调事件
                                    //data="success"：编辑成功
                                    //data="其它任何值都失败"
                                    callback: function (data) {
                                        if (data.rspCode == "0" || data.rspCode == "success") {
                                            $.messager.show({
                                                title: '温馨提示',
                                                msg: data.rspDesc,
                                                showType: 'show'
                                            });

                                            _this.reload();
                                            _this.getGrid.datagrid("fixRowHeight");
                                        }
                                        else {
                                            $.messager.alert('温馨提示', data.rspDesc, 'error', function () {
                                                editText.focus();
                                            });
                                        }
                                    },
                                    //当前编辑的行数据
                                    rows: thisEditModel[0]
                                });
                            }).linkbutton();

                            var cancel = $("<a href='javascript:void(0);'>取消</a>").appendTo(editDiv).click(function (evt) {
                                xsjs.stopPropagation(evt);

                                editDiv.hide();
                                divobj.show();

                                _this.getGrid.datagrid("fixRowHeight");
                            }).linkbutton();
                        }
                    }
                    _this.getGrid.datagrid("fixRowHeight");
                });
            }
        };

        return items.bind(options);
    };

    //省市县选择控件
    XSLibray.region = function (options) {
        var items = {
            //根据 区域ID(orgAreaId) 或 父级(ID parentId) 从数据库中取地区信息
            getGetSysArea: function (strSearchType, id, fn) {
                $.ajax({
                    url: contextPath+'/orgArea/getByParentId',
                    type: 'post',
                    async: false,
                    data: { parentId: id },
                    dataType: "json",
                    success: function (data) {
                        fn(data);
                    },
                    error: function (e) {
                    }
                });
            },
            parent: XSLibray,
            init: function (option) {
                ///<summary>省市县初始化</summary>
                ///<param type="json" name="option">
                ///<para>ddlProvince: 省份控件</para>
                ///<para>ddlCity: 市控件</para>
                ///<para>ddlCounty: 县控件</para>
                ///<para>defaultID: 默认选择项</para>
                ///<para>provinceID: 省份ID</para>
                ///<para>cityID: 市州ID</para>
                ///<para>countyID: 区县ID</para>
                ///<para>onLoadnd: 加载完后</para>
                ///</param>
                var _this = this;

                this.item = option;

                var _this = this;

                //市州
                option.ddlProvince.change(function () {
                    _this.bindProvinceChange();
                });
                //县
                option.ddlCity.change(function () {
                    _this.bindCityChange();
                });

                option.ddlProvince.append('<option value="0">全部</option>');
                this.getGetSysArea("parentId", 0, function (obj) {
                    $(obj).each(function () {
                        option.ddlProvince.append("<option value=\"" + this.orgAreaId + "\">" + this.orgAreaName + "</option>");
                    });

                    //默认值
                    _this.bindDefault(option);
                })
            },
            //下拉事件
            bindProvinceChange: function (fn) {
                var _this = this;
                _this.item.ddlCity.empty().append('<option value="0">全部</option>');
                _this.item.ddlCounty.empty().append('<option value="0">全部</option>');

                if (_this.item.ddlProvince.val() > 0) {
                    this.getGetSysArea("parentId", _this.item.ddlProvince.val(), function (obj) {
                        $(obj).each(function () {
                            _this.item.ddlCity.append("<option value=\"" + this.orgAreaId + "\">" + this.orgAreaName + "</option>");
                        });
                        if (fn) {
                            fn();
                        }
                    })
                }
            },
            //地级市绑定事件
            bindCityChange: function (fn) {
                var _this = this;
                _this.item.ddlCounty.empty().append('<option value="0">全部</option>');
                if (_this.item.ddlCity.val() > 0) {
                    this.getGetSysArea("parentId", _this.item.ddlCity.val(), function (obj) {
                        $(obj).each(function () {
                            _this.item.ddlCounty.append("<option value=\"" + this.orgAreaId + "\">" + this.orgAreaName + "</option>");
                        });
                        if (fn) {
                            fn();
                        }
                    })
                }
            },
            //绑定默认值
            bindDefault: function (option) {

                if (option.defaultID > 100000) {//精确到县
                    option.countyID = option.defaultID;
                    option.cityID = option.defaultID.toString().substr(2, 2);
                    option.provinceID = option.defaultID.toString().substr(0, 2);
                }
                else if (option.defaultID > 1000) {//精确到市州
                    option.cityID = option.defaultID;
                    option.provinceID = option.defaultID.toString().substr(0, 2);
                }
                else if (option.defaultID > 10) {//精确到省份
                    option.provinceID = option.defaultID;
                }

                this.bindSelect(option);
            },
            //绑定默认值到控件
            bindSelect: function (option) {
                if (option.provinceID > 0) {

                    var _this = this;
                    option.ddlProvince.val(option.provinceID);//.trigger("change");
                    if (this.item.cityID > 0) {
                        _this.bindProvinceChange(function () {
                            _this.item.ddlCity.val(_this.item.cityID);

                            _this.bindCityChange(function () {
                                _this.item.ddlCounty.val(_this.item.countyID);
                            });
                        });
                    }
                }
            },
            //html绑定
            htmlInit: function () {
                //初始化
                if ($("select[conRegionSelectProvince]").length > 0) {
                    var rSelect = [];
                    for (var i = 0; i < $("select[conRegionSelectProvince]").length; i++) {
                        rSelect.push({
                            ddlProvince: $("select[conRegionSelectProvince=" + (i + 1) + "]"),
                            ddlCity: $("select[conRegionSelectCity=" + (i + 1) + "]"),
                            ddlCounty: $("select[conRegionSelectCounty=" + (i + 1) + "]"),
                            defaultID: $("select[conRegionSelectProvince=" + (i + 1) + "]").attr("defaultID") || 0,
                            provinceID: $("select[conRegionSelectProvince=" + (i + 1) + "]").attr("provinceID") || 0,
                            cityID: $("select[conRegionSelectCity=" + (i + 1) + "]").attr("cityID") || 0,
                            countyID: $("select[conRegionSelectCounty=" + (i + 1) + "]").attr("countyID") || 0
                        });
                    }

                    for (var j = 0; j < rSelect.length; j++) {
                        this.init(rSelect[j]);
                    }
                }
            }
        }
        if (options) {
            items.init(options);
        }
        else {
            items.htmlInit();
        }
    };

    //获取下属行政区域
    XSLibray.getChildRegion = function (id, fn) {
        fn($.grep(sysRegion, function (n, i) {
            return n.parentId == id;
        }));
    };

    //获取下属行政区域
    XSLibray.getRegion = function (id) {
        var objRegion = $.grep(sysRegion, function (n, i) {
            return n.orgAreaId == id;
        });

        return objRegion != null && objRegion.length > 0 ? objRegion[0] : null;
    };

    //获取省市县对象
    XSLibray.getAllRegion = function (id) {
        var objRegion = {
            Province: {},
            City: {},
            County: {}
        };

        if (!id || id.toString().length == 0) {
            return objRegion;
        }

        var thisRegion = $.grep(sysRegion, function (n, i) {
            return n.orgAreaId == id;
        });

        if (thisRegion != null && thisRegion.length > 0) {
            if ((thisRegion[0].orgAreaId).toString().length > 4) {
                objRegion.County = thisRegion[0];

                var cityRegion = $.grep(sysRegion, function (n, i) {
                    return n.orgAreaId == objRegion.County.parentId;
                });
                objRegion.City = cityRegion[0];

                var countyRegion = $.grep(sysRegion, function (n, i) {
                    return n.orgAreaId == objRegion.City.parentId;
                });
                objRegion.Province = countyRegion[0];
            }
            else if ((thisRegion[0].orgAreaId).toString().length > 2) {
                objRegion.City = thisRegion[0];

                var countyRegion = $.grep(sysRegion, function (n, i) {
                    return n.orgAreaId == objRegion.City.parentId;
                });
                objRegion.Province = countyRegion[0];
            }
            else {
                objRegion.Province = thisRegion[0];
            }
        }

        return objRegion;
    };

    //下载文件
    //options: {
    //  action: 页面地址
    //  data: 参数
    //  method：请求方式
    //  loadMsg: 等待提示
    //}
    XSLibray.download = function (options) {    // 获得url和data
        exportData(options);
    };

    //绑定运营分类
    XSLibray.shopCategory = function (item) {
        ///<summary>绑定运营分类</summary>
        ///<param type="json" name="options">
        ///<para>ddlOne: 一级运营分类ID</para>
        ///<para>ddlTwo: 二级运营分类ID</para>
        ///<para>defaultID: 默认值</para>
        ///<para>categoryID1: 一级运营分类ID默认值</para>
        ///<para>categoryID2: 二级运营分类ID默认值</para>
        ///<para>onLoaded: 加载完成事件</para>
        ///<para>IsShowAll: true</para>
        ///</param>

        var options = $.extend({
            IsShowAll: true,
            SupplierID: 0
        }, item);

        $.extend(options, {
            //是否显示全部分类
            DataCategories: [],
            OneBind: function (thisValue, defaultID) {
                var _this = this;
                _this.ddlTwo.empty();
                _this.ddlTwo.append("<option value=\"\">--请选择--</option>");

                var ParentCategories = $.grep(_this.DataCategories, function (n, i) {
                    if (_this.IsShowAll) {
                        return n.CategoryId == thisValue;
                    }
                    else {
                        return (n.CategoryId == thisValue && n.SupplierCategoryID > 0);
                    }
                });

                if (ParentCategories && ParentCategories.length > 0 && ParentCategories[0].children && ParentCategories[0].children.length > 0) {
                    $(ParentCategories[0].children).each(function () {
                        _this.ddlTwo.append("<option value=\"" + this.CategoryId + "\">" + this.CategoryName + "</option>");
                    });
                }

                if (defaultID && defaultID > 0) {
                    this.ddlTwo.find("option[value='" + defaultID + "']").attr("selected", true);
                }
            },
            Bind: function () {
                var _this = this;
                $.ajax({
                    url: "/ShopCategories/GetShopCategoriesChildren",
                    success: function (data) {
                        //debugger;
                        _this.DataCategories = data;
                        _this.ddlOne.change(function () {
                            _this.OneBind(this.value);
                        });

                        if (_this.DataCategories && _this.DataCategories.length > 0) {
                            var ParentCategories = $.grep(_this.DataCategories, function (n, i) {
                                return n.ParentCategoryId == 0;
                            });
                            _this.ddlOne.append("<option value=\"\">--请选择--</option>");
                            if (ParentCategories && ParentCategories.length > 0) {
                                $(ParentCategories).each(function () {
                                    _this.ddlOne.append("<option value=\"" + this.CategoryId + "\">" + this.CategoryName + "</option>");
                                });
                            }
                        }

                        if (_this.CategoryId > 0) {
                            var thisSelectCategories = $.grep(_this.DataCategories, function (n, i) {
                                return n.CategoryId == _this.CategoryId;
                            });
                            if (thisSelectCategories && thisSelectCategories.length > 0) {
                                if (thisSelectCategories[0].ParentCategoryId > 0) {
                                    _this.ddlOne.find("option[value='" + thisSelectCategories[0].ParentCategoryId + "']").attr("selected", true);
                                    _this.OneBind(thisSelectCategories[0].ParentCategoryId, thisSelectCategories[0].CategoryId);
                                }
                                else {
                                    _this.ddlOne.find("option[value='" + thisSelectCategories[0].CategoryId + "']").attr("selected", true);
                                    _this.OneBind(thisSelectCategories[0].CategoryId);
                                }
                            }
                        }
                    }
                });
            }
        });

        options.Bind();
    };

    /*
    仓库下拉列表绑定
    options: {
        option: {
            parentElement: "绑定对象",
            defaultID: "默认ID"
        },
        attributes{
            name: ""
        },
    }
    */
    XSLibray.bindWarehouse = function (options, datagrid) {
        var warehouse = $("<select></select>", options.attributes || {});

        ///是否有请选择项
        if (options.emptyOption) {
            warehouse.append("<option value=''>--请选择仓库--</option>");
        }

        options.option.parentElement.append(warehouse); 1
        this.ajax({
            url: "/Warehouse/GetList",
            dataType: "json",
            success: function (data) {
                if (data && data.rows) {
                    $(data.rows).each(function () {
                        warehouse.append("<option value='" + this.WID + "'>" + this.ParentWName + (this.ParentWName != '' ? '_' : '') + this.WName + "</option>");
                    });
                }
                if (datagrid) {
                    ++datagrid.loadedCount;
                    datagrid.loadList(true);
                }
            },
            complete: function () {
                if (typeof options.onChange == "function") {
                    warehouse.change(function () {
                        options.onChange(this);
                    }).trigger("change");
                }
            }
        });
    };

    /*
仓库下拉列表绑定
options: {
    option: {
        parentElement: "绑定对象",
        defaultID: "默认ID"
    },
    attributes{
        name: ""
    },
}
*/
    XSLibray.bindOpArea = function (options, datagrid) {
        var warehouse = $("<select></select>", options.attributes || {});

        ///是否有请选择项
        if (options.emptyOption) {
            warehouse.append("<option value=''>--请选择区域--</option>");
        }

        options.option.parentElement.append(warehouse); 1
        this.ajax({
            url: "/OpArea/GetAllList",
            dataType: "json",
            success: function (data) {
                if (data && data.rows) {
                    $(data.rows).each(function () {
                        warehouse.append("<option value='" + this.OporgAreaId + "'>" + this.OporgAreaName + "</option>");
                    });
                }
                if (datagrid) {
                    ++datagrid.loadedCount;
                    datagrid.loadList(true);
                }
            },
            complete: function () {
                if (typeof options.onChange == "function") {
                    warehouse.change(function () {
                        options.onChange(this);
                    }).trigger("change");
                }
            }
        });
    };



    XSLibray.cWarehouse = function (options, datagrid,_attr,prevObj,searchItem) {
        if (typeof options.data == "object") {

            if (options.data.emptyOption) {
                var ckbID = "ckb_" + Math.random().toString().replace(".", "");
                var ckbOption = $("<input type='checkbox' name='" + _attr.name + "' value='" + options.data.emptyOption.value + "' id='" + ckbID + "'/>").appendTo(prevObj || searchItem);
                var ckbLabel = $("<label for='" + ckbID + "'>" + options.data.emptyOption.text + "</label>").appendTo(prevObj || searchItem);
                if (options.data.emptyOption.isAll === true) {
                    ckbOption.click(function () {
                        $("input[name='" + _attr.name + "']").prop("checked", $(this).is(":checked"));
                    });
                }
            }

            function selects(list) {
                if(list!=""&&list!=null){
                    $.ajax({
                        type: 'POST',
                        url: contextPath + "/distributionLine/listDistributionLine",
                        data: {"ids":list},
                        success: function (data) {
                            var _data = data.rows;
                            var i = _data.length;
                            var html = "<option value='0'>--全部--</option>";
                            if( _data != null){
                                $(_data).each(function (i) {
                                    html += "<option value='" + _data[i].id + "'>"+ _data[i].lineName +"</option>"
                                })
                            }

                            $("select[name='lineId']").html(html);
                        },
                    })
                }else{
                    var html = "<option value='0'>--全部--</option>";
                    $("select[name='lineId']").html(html);
                }
            }

            $.ajax({
                url: options.data.url,
                data: options.data.data || {},
                dataType: "json",
                success: function (data) {
                    if (data) {
                        var _data = data.rows || (data.ItemList || data);
                        var valueField = options.data.valueField || "ID";
                        var textField = options.data.textField || "Text";

                        $(_data).each(function () {
                            var ckbID = "ckb_" + Math.random().toString().replace(".", "");
                            var ckbOption = $("<input type='checkbox' name='" + _attr.name + "' value='" + eval("this." + valueField) + "' id='" + ckbID + "'/>").appendTo(prevObj || searchItem);
                            var ckbLabel = $("<label for='" + ckbID + "'>" + eval("this." + textField) + "</label>").appendTo(prevObj || searchItem);
                        });
                        //点击事件
                        $('input:checkbox').click(function () {
                            var list = "";
                            $.each($('input:checkbox'),function(){
                                if(this.checked){
                                    list +="id="+$(this).val()+"&";
                                }
                            });
                            if (list.length > 0) {
                                list = list.substr(0, list.length-1);
                            }
                            if(!$('input:checkbox').is(":checked")) {
                                window.top.$.messager.alert("温馨提示",
                                    "请选择要需要查询的仓库!");
                            }
                            //重新查询路线信息
                            selects(list);
                        });
                    }
                    //加载完成
                    if (datagrid) {
                        $('input:checkbox').attr("checked",'checked');
                        ++datagrid.loadedCount;
                        datagrid.loadList(true);
                    }
                }
            });
        }
    };

    //控制图片自动大小
    XSLibray.autoSize = function (ImgD) {
        $(ImgD).css({
            "maxWidth": $(window.top).width() - 50,
            "maxHeight": $(window.top).height() - 50,
            "position": "absolute"
        });

        $(ImgD).css({
            "top": "50%",
            "left": "50%",
            "marginLeft": (-($(ImgD).width()) / 2) + "px",
            "marginTop": (-($(ImgD).height()) / 2) + "px"
        });
    };
    //弹出层显示图片详情
    XSLibray.pigshow = function (url) {
        var html = $("<div style='position:fixed; z-index:999999; top:0px; bottom:0px; left:0px; width:100%;right:0px;background-color:#333;  opacity:0.4;' id='bgdiv_chy'></div><div style='position:fixed; z-index:1000000; top:10%; bottom:1rem; left:10%; width:80%; right:10%; bottom:10%; text-align:center'  id='kk_chy'><div style='width:100%; height:100%; position:relative'  ><img ></div></div>");
        window.top.$("body").append(html);
        html.find("img").load(function () {
            XSLibray.autoSize(this);
        }).attr("src", url).click(function () {
            window.top.$("#bgdiv_chy").remove();
            window.top.$("#kk_chy").remove();
        });
    };


})(XSLibray);

$(function () {
    $(window).resize(function () {
        var xsFormMain = $(".xs-form-main");
        if (xsFormMain) {
            var navHeight = $(".xs-form-nav:visible").outerHeight() || 0;
            var bottomHeight = $(".xs-form-bottom:visible").outerHeight() || 0;
            //表单初始化
            xsFormMain.height($(window).height() - navHeight - bottomHeight);
        }
    }).trigger("resize");

    var repListCbk = $("input[name='repListCbk']");
    repListCbk.click(function (evt) {
        // 阻止冒泡
        if (window.event) {
            // Chrome,IE6,Opera
            window.event.cancelBubble = true;
        } else {
            // FireFox 3
            evt.stopPropagation();
        }
        /// <summary>数据列表行单击事件（单击选中或取消选中当前行）</summary>
        if (this.checked) {
            $(this).closest("tr").addClass("xs-table-tr-select");
        }
        else {
            $(this).closest("tr").removeClass("xs-table-tr-select");
        }
    });

    xsjs.thisAppendJs({
        type: "css",
        href: contextPath+"/content/css/XSLibrary.css"
    });
    //xsjs.AppendSkins();
});