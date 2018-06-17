$.extend($.fn.validatebox.defaults.rules, {
    maxLenFormat: {
        validator: function (value, param) {
            if (param && param.length > 1 && param[1] == true) {
                var len = $.trim(value.replace(/[^\x00-\xff]/g, "aa")).length;
                if (param) {
                    this.message = '输入值长度必须等于{0}，注：双节字字符占用两个长度！'.replace(new RegExp(
                        "\\{" + 0 + "\\}", "g"), param[0]);
                }
                return len <= param[0];
            }
            else {
                var len = $.trim(value).length;
                if (param) {
                    this.message = '输入值长度必须等于{0}！'.replace(new RegExp(
                        "\\{" + 0 + "\\}", "g"), param[0]);
                }
                return len <= param[0];
            }
        },
        message: '输入值长度必须小于等于{0}！'
    },
    minLenFormat: {
        validator: function (value, param) {
            var len = $.trim(value).length;
            if (param) {
                this.message = '输入值长度必须大于等于{0}！'.replace(new RegExp(
                    "\\{" + 0 + "\\}", "g"), param[0]);
            }
            return len >= param[0];
        },
        message: '输入值长度必须大于等于{0}！'
    },
    telFormat: {
        validator: function (value) {
            if (value.length > 0) {
                return /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/.test(value) || /^\d{10}$/.test(value) || /^\d{11}$/.test(value) || /^\d{12}$/.test(value) || /^(13|14|15|18)[0-9]{9}$/.test(value);
            } else {
                return true;
            }
        },
        message: '电话格式错误！'
    },
    mobileFormat: {
        validator: function (value) {
            if (value.length > 0) {
                return /^1\d{10}$/.test(value);
            } else {
                return true;
            }
        },
        message: '手机号格式错误！'
    },
    numberFormat: {
        validator: function (value) {
            if (value.length > 0) {
                return /^(\d+)$/.test(value);
            } else {
                return true;
            }
        },
        message: '必须为正整数！'
    },
    floatFormat: {
        validator: function (value) {
            if (value.length > 0) {
                return /^\d+(\.\d+)?$/.test(value);
            } else {
                return true;
            }
        },
        message: '必须为正浮点数！'
    },

    phoneRex: {
        validator: function (value) {
            var rex = /^1[3-8]+\d{9}$/;
            //var rex=/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
            //区号：前面一个0，后面跟2-3位数字 ： 0\d{2,3}
            //电话号码：7-8位数字： \d{7,8
            //分机号：一般都是3位数字： \d{3,}
            //这样连接起来就是验证电话的正则表达式了：/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/		 
            var rex2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
            if (rex.test(value) || rex2.test(value)) {
                // alert('t'+value);
                return true;
            } else {
                //alert('false '+value);
                return false;
            }

        },
        message: '请输入正确电话或手机格式'
    },
    chineseLength: {
        //汉子长度验证@data_options="validType:['chineseLength[10]']"
        validator: function (value, param) {
            var len = $.trim(value).replace(/[^\x00-\xff]/g, "01").length;
            if (len > param[0] * 2) {
                return false;
            }
            return true;
        },
        message: '必须在{0}个汉字以内'
    },
    numberLength: {
        //数字字符验证@data_options="validType:['numberLength[10]']"
        validator: function (value, param) {
            var rex = /^(\d+)$/;
            var len = $.trim(value).length;
            if (len > param[0]) {
                return false;
            } else if (!rex.test($.trim(value))) {
                return false;
            }
            return true;
        },
        message: '必须为{0}个字符内的数字型字符串！'
    },
    trim: {
        //去除空格验证@data_options="validType:['trim']"
        validator: function (value, param) {
            if ($.trim(value) == "") {
                return false;
            }
            return true;
        },
        message: '该输入项不能全部为空格'
    },
    riskStr: {
        //是否包含特殊字符
        validator: function (value, param) {
            var t = /[`~!@$#%^&<>?{},;]/im;
            if (t.test(value)) {
                return false;
            }

            return true;
        },
        message: '该输入项不允许输入特殊字符'
    },
    riskStr_ts: {
        //是否包含特殊字符
        validator: function (value, param) {
            var t = /[`~!@$%^&<>?{},;]/im;
            if (t.test(value)) {
                return false;
            }

            return true;
        },
        message: '该输入项不允许输入特殊字符'
    },
    riskRule: {
        //只容许输入常规字符
        validator: function (value, param) {
            var t = /^[0-9a-zA-Z_()（）\u4e00-\u9fa5]+$/;
            if (!t.test(value)) {
                return false;
            }
            return true;
        },
        message: '只容许输入汉子字母数字下划线小括号'
    },
    riskNoquo: {
        //是否包含特殊字符
        validator: function (value, param) {
            var t = /[`~!@$%^&<>?{},;']/im;
            if (t.test(value)) {
                return false;
            }

            return true;
        },
        message: '该输入项不允许输入特殊字符'
    },
    maxLength: {//长度不能超过指定值
        validator: function (value, param) {
            var len = $.trim(value).length;
            if (param) {
                this.message = '输入值长度必须小于等于{0}！'.replace(new RegExp(
                    "\\{" + 0 + "\\}", "g"), param[0]);
            }
            return len <= param[0];
        },
        message: '输入值长度必须小于等于{0}！'
    }
    , numMinMaxFormat: {
        validator: function (value, param) {
            var val = parseFloat(value);
            if (param) {
                this.message = '输入值必须是{0}-{1}区间(包含)里的数字！'.replace(new RegExp(
                    "\\{" + 0 + "\\}", "g"), param[0], param[1]);
            }
            if (val < param[0] || val > param[1]) {

                return false;
            } else {
                return true;
            }
        },
        message: '输入值必须是{0}-{1}区间里的数字！'
    },
});



/**  
 * my97 - jQuery EasyUI  
 * Licensed under the GPL:  
 * http://www.gnu.org/licenses/gpl.txt  
 * Copyright 2013 小雪转中雪 [ caoguanghuicgh@163.com ] [http://www.easyui.info]  
 */
(function ($) {
    //如果没有my97控件，则添加之。   
    (function () {
        var hasmy97 = false;
        var plugins = $.parser.plugins;
        for (var i = plugins.length - 1; i > -1; i--) {
            if (plugins[i] === "my97") {
                hasmy97 = true;
                break;
            }
        }
        if (hasmy97 == false) {
            $.parser.plugins[$.parser.plugins.length] = "my97";
        }
    })();
    function init(target) {
        $(target).addClass("my97-text")
        var wrap = $("<span class=\"my97-wrap\"></span>").insertBefore(target);
        wrap[0].appendChild(target);
        var arrow = $("<span class=\"my97-arrow\"></span>").insertAfter(target);
        return wrap;
    };
    /**
     * 绑定事件用以触发原生的my97控件  
     * @param  {[type]} target [description]  
     * @return {[type]}        [description]  
     */
    function bindEvents(target) {
        var data = $.data(target, "my97");
        var opts = data.options;
        var wrap = $.data(target, "my97").my97;
        var input = wrap.find(".my97-text");
        var arrow = wrap.find(".my97-arrow");
        input.unbind(".my97");
        arrow.unbind(".my97");
        if (!opts.disabled) {
            input.bind("click.my97", function (e) {
                //TODO 触发my97   
                WdatePicker(opts);
            });
            arrow.bind("click.my97", function () {
                //TODO 触发my97   
                WdatePicker($.extend({}, opts, { el: opts.id }));
            }).bind('mouseenter.my97',
                function (e) {
                    $(this).addClass('my97-arrow-hover');
                }).bind('mouseout.my97',
                function (e) {
                    $(this).removeClass('my97-arrow-hover');
                }
            );
        }
    };
    /**
     * 销毁组件  
     * @param  {document object} target 承载组件的输入框  
     * @return {[type]}        [description]  
     */
    function destroy(target) {
        var input = $.data(target, "my97").my97.find("input.my97-text");
        input.validatebox("destroy");
        $.data(target, "my97").my97.remove();
        $(target).remove();
    };
    function validate(target, doit) {
        var opts = $.data(target, "my97").options;
        var input = $.data(target, "my97").my97.find("input.my97-text");
        input.validatebox(opts);
        if (doit) {
            input.validatebox("validate");
        }
    };
    function initValue(target) {
        var opts = $.data(target, "my97").options;
        var input = $.data(target, "my97").my97.find("input.my97-text");
        input.val(opts.value);
    }
    function setDisabled(target, disabled) {
        var ops = $.data(target, "my97").options;
        var my97 = $.data(target, "my97").my97;
        var arrow = my97.find('.my97-arrow');
        if (disabled) {
            ops.disabled = true;
            $(target).attr("disabled", true);
            arrow.unbind('click.my97');
            arrow.unbind('hover.my97');
        } else {
            ops.disabled = false;
            $(target).removeAttr("disabled");
            arrow.unbind('click.my97').bind('click.my97', function () {
                WdatePicker(opts);
            });
            arrow.unbind('mouseenter.my97').unbind('mouseout').bind('mouseenter.my97',
                function (e) {
                    this.addClass('my97-arrow-hover');
                }).bind('mouseenter.my97',
                function (e) {
                    this.removeClass('my97-arrow-hover');
                }
            );
        }
    };
    /**
     * 设置输入框宽度，主要这里是指box模型的width  
     * @param {document object} target 承载控件的输入框  
     * @param {number} width  宽度  
     */
    function setWidth(target, width) {
        var opts = $.data(target, "my97").options;
        opts.width = width;
        $(target).width(width);
    }
    function setValue(target, value) {
        $(target).val(value);
    }
    function getValue(target) {
        return $(target).val();
    }
    /**
     * 因为my97图片触发方式，必要id，所以在没有设置id的情况下，设置一个唯一ID  
     * @param {[type]} target [description]  
     */
    function setId(target) {
        var pre = "_easyui_my97_id_";
        var opts = $.data(target, "my97").options;
        opts.id = pre + $.fn.my97.defaults.count;
        $(target).attr("id", opts.id);
        $.fn.my97.defaults.count++;
    }
    $.fn.my97 = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.my97.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'my97');
            var opts;
            if (state) {
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, $.fn.my97.defaults, $.fn.my97.parseOptions(this), options);
                var wrap = init(this);
                state = $.data(this, 'my97', {
                    options: opts,
                    my97: wrap
                });
            }
            if (opts.id == undefined) {
                setId(this);
            }
            setWidth(this, state.options.width);
            setDisabled(this, state.options.disabled);
            bindEvents(this);
            validate(this);
            initValue(this);
        });
    };
    $.fn.my97.methods = {
        options: function (jq) {
            return $.data(jq[0], 'my97').options;
        },
        destroy: function (jq, param) {
            return jq.each(function () {
                destroy(this, param);
            });
        },
        setWidth: function (jq, param) {
            return jq.each(function () {
                setWidth(this, param);
            });
        },
        setValue: function (jq, param) {
            setValue(jq[0], param);
        },
        getValue: function (jq, param) {
            return getValue(jq[0]);
        }
    };
    /**
     * 属性转换器，继承validatebox组件属性  
     * @param  {document object} target 承载my97的输入框  
     * @return {object}        属性列表  
     */
    $.fn.my97.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target, ["width", "height", "weekMethod", "lang", "skin", "dateFmt", "realDateFmt", 'realTimeFmt', 'realFullFmt', 'minDate', 'maxDate', 'startDate',
            {
                doubleCalendar: "boolean",
                enableKeyboard: "boolean",
                enableInputMask: "boolean",
                isShowWeek: "boolean",
                highLineWeekDay: "boolean",
                isShowClear: "boolean",
                isShowOthers: "boolean",
                readOnly: "boolean",
                qsEnabled: "boolean",
                autoShowQS: "boolean",
                opposite: "boolean"
            }, {
                firstDayOfWeek: "number",
                errDealMode: "number"
            }]),
            {
                value: (t.val() || undefined),
                disabled: (t.attr("disabled") ? true : undefined),
                id: (t.attr("id") || undefined)
            });
    };
    $.fn.my97.defaults = {
        id: null,
        count: 0,
        value: '',
        width: 109,
        height: 22,
        disabled: false,
        doubleCalendar: false,
        enableKeyboard: true,
        enableInputMask: true,
        weekMethod: 'ISO8601',
        position: {},
        lang: 'auto',
        skin: 'default',
        dateFmt: 'yyyy-MM-dd',
        realDateFmt: 'yyyy-MM-dd',
        realTimeFmt: 'HH:mm:ss',
        realFullFmt: '%Date %Time',
        minDate: '1900-01-01 00:00:00',
        maxDate: '2099-12-31 23:59:59',
        startDate: '',
        firstDayOfWeek: 0,
        isShowWeek: false,
        highLineWeekDay: true,
        isShowClear: true,
        isShowOthers: true,
        readOnly: false,
        errDealMode: 0,
        qsEnabled: true,
        autoShowQS: false,
        opposite: false,
        quickSel: [],
        disabledDays: null,
        disabledDates: null,
        specialDates: null,
        specialDays: null,
        onpicking: function () {
        },
        onpicked: function () {
        },
        onclearing: function () {
        },
        oncleared: function () {
        }
    };
})(jQuery);
//改造日期插件
$.extend($.fn.datagrid.defaults.editors, {
    datebox: {//datetimebox就是你要自定义editor的名称   
        init: function (container, options) {
            var input = $('<input class="Wdate"  >')
                    .appendTo(container);
            input.click(function (evt) {
                //阻止冒泡事件
                var e = evt || window.event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
                if (e && e.stopPropagation) {
                    // this code is for Mozilla and Opera
                    e.stopPropagation();
                } else if (window.event) {
                    // this code is for IE
                    window.event.cancelBubble = true;
                }
                WdatePicker({ dateFmt: 'yyyy-MM-dd' });
            });
            if (typeof options.onChange == "function") {
                input.get(0).frxsOptions = options.onChange;
            }
            if (options.isFocus) {
                setTimeout(function () {
                    //input.hide();
                    input.focus(function () {
                        WdatePicker({ dateFmt: 'yyyy-MM-dd' });
                    });
                    debugger;
                    input.get(0).click();
                }, 0);
            };
            return input;
        },
        getValue: function (target) {
            if (typeof target.get(0).frxsOptions == "function") {
                target.get(0).frxsOptions($(target).val());
            };

            return $(target).val();
        },
        setValue: function (target, value) {
            
            //if(value.length>10){
            //    value = value.substr(0, 10);
                
            //}
            $(target).val(value);
           
        },
        resize: function (target, width) {
            var input = $(target);
            if ($.boxModel == true) {
                input.width(width
                        - (input.outerWidth() - input.width()));
            } else {
                input.width(width);
            }
        }
    }
});


















