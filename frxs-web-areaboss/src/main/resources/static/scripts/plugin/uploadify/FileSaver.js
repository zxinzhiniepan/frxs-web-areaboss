/*! FileSaver.js
 *  A saveAs() FileSaver implementation.
 *  2014-01-24
 *
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  // IE 10+ (native saveAs)
  || (typeof navigator !== "undefined" &&
      navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  // Everyone else
  || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" &&
	    /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, URL = view.URL || view.webkitURL || view
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = !view.externalHost && "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		, deletion_queue = []
		, process_deletion_queue = function() {
			var i = deletion_queue.length;
			while (i--) {
				var file = deletion_queue[i];
				if (typeof file === "string") { // file is an object URL
					URL.revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			}
			deletion_queue.length = 0; // clear queue
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, FileSaver = function(blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, get_object_url = function() {
					var object_url = get_URL().createObjectURL(blob);
					deletion_queue.push(object_url);
					return object_url;
				}
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_object_url(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						window.open(object_url, "_blank");
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_object_url(blob);
				// FF for Android has a nasty garbage collection mechanism
				// that turns all objects that are not pure javascript into 'deadObject'
				// this means `doc` and `save_link` are unusable and need to be recreated
				// `view` is usable though:
				doc = view.document;
				save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
				save_link.href = object_url;
				save_link.download = name;
				var event = doc.createEvent("MouseEvents");
				event.initMouseEvent(
					"click", true, false, view, 0, 0, 0, 0, 0
					, false, false, false, false, 0, null
				);
				save_link.dispatchEvent(event);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									deletion_queue.push(file);
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	view.addEventListener("unload", process_deletion_queue, false);
	saveAs.unload = function() {
		process_deletion_queue();
		view.removeEventListener("unload", process_deletion_queue, false);
	};
	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module !== null) {
  module.exports = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
  define([], function() {
    return saveAs;
  });
}

//Excel导出辅助类(王锐 add)
var excelExport = (function (self, saveAs) {
    //空对象，减少创建对象的内存消耗
    var instance = function () { };
    //采用原型链模式,确保所有实例方法指向同一个对象,减少内存消耗
    instance.prototype = {
        //普通字段格式化到Excel的单元格
        fieldToTd: function (dataObj) {
            if (dataObj != undefined && dataObj != null && dataObj != '') {
                return "<td>" + dataObj + "</td>";
            }
            else {
                return "<td> </td>";
            }
        },

        //解决数字字符串前导零被隐藏的问题
        numToStr: function (dataObj) {
            if (dataObj != undefined && dataObj != null && dataObj != '') {
                return "<td x:str=\"'" + dataObj + "\">" + dataObj + "</td>";
            }
            else {
                return "<td> </td>";
            }
        },

        //导出Excel导出时的数字格式问题  precisionScale指小数点后的位数（默认至少1位）
        fmtNum: function (dataObj, precisionScale) {
            var basicNumString = "";
            if (precisionScale != undefined && precisionScale > 0) {
                for (var i = 0; i < precisionScale; i++) {
                    basicNumString += "0";
                }
            }
            else {
                basicNumString = "0";
            }
            basicNumString = "0." + basicNumString;
            var returnString = "<td style='mso-number-format:\"#,##" + basicNumString + "\";'>" + basicNumString + "</td>";

            if (dataObj == undefined || dataObj == null || dataObj == "") {//解决存储过程返回null的问题
                return returnString;
            }
            else {
                returnString = "<td style='mso-number-format:\"#,##" + basicNumString + "\";'>" + dataObj + "</td>";
                return returnString;
            }
        },

        //生成导出Excel的标题行 (入参为对象数组)
        buildTitle: function (arrayObj) {
            //保存当前this指针，解决$.each方法找不到所需的方法的问题
            var self = this;
            var tr = "<tr>";
            $.each(arrayObj, function (index, data) {
                if (index == 0) {
                    tr += "<td style='height:20px'>" + data.title + "</td>";
                }
                else {
                    tr += self.fieldToTd(data.title);
                }
            });
            tr += "</tr>";
            return tr;
        },

        //根据数组生成标题行
        buildTitleByArray: function (titleArray) {
            //保存当前this指针，解决$.each方法找不到所需的方法的问题
            var self = this;
            var tr = "<tr>";
            $.each(titleArray, function (index, data) {
                if (index == 0) {
                    tr += "<td style='height:20px'>" + data + "</td>";
                }
                else {
                    tr += self.fieldToTd(data);
                }
            });
            tr += "</tr>";
            return tr;
        },

        //生成导出Excel的数据行 (入参为 行数据对象、列配置的对象数组)
        buildDataRow: function (dataObj, arrayObj) {
            //保存当前this指针，解决$.each方法找不到所需的方法的问题
            var self = this;
            var tr = "<tr>";
            //用于formatter函数处理
            var tempStr = "";
            //遍历 处理每列数据
            $.each(arrayObj, function (index, data) {
                if (data.type) {
                    switch (data.type) {
                        case 'string':
                            //处理特殊格式化需求
                            if (data.formatter && typeof data.formatter === 'function') {
                                tempStr = data.formatter(dataObj[data.field]);
                                tr += self.fieldToTd(tempStr);
                            }
                            else {
                                tr += self.fieldToTd(dataObj[data.field]);
                            }
                            break;
                            //长数字转字符串 解决前导0不显示的问题 例如 商品编码/条码
                        case 'numStr':
                            tr += self.numToStr(dataObj[data.field]);
                            break;
                        case 'decimal':
                            //允许设置小数位数
                            if (data.scale) {
                                tr += self.fmtNum(dataObj[data.field], data.scale);
                            }
                            else {
                                tr += self.fmtNum(dataObj[data.field], 1);
                            }
                            break;
                        default:
                            //处理特殊格式化需求
                            if (data.formatter && typeof data.formatter === 'function') {
                                tempStr = data.formatter(dataObj[data.field]);
                                tr += self.fieldToTd(tempStr);
                            }
                            else {
                                tr += self.fieldToTd(dataObj[data.field]);
                            }
                            break;
                    }
                }
                else {
                    //处理特殊格式化需求
                    if (data.formatter && typeof data.formatter === 'function') {
                        tempStr = data.formatter(dataObj[data.field]);
                        tr += self.fieldToTd(tempStr);
                    }
                    else {
                        tr += self.fieldToTd(dataObj[data.field]);
                    }
                }
            });
            tr += "</tr>";
            return tr;
        },

        //调用FileSaver.js的核心功能，输出Excel文件
        ///trtdCode 拼接的表格数据
        ///excelFileName 指定的文件名称
        saveExcel: function (trtdCode, excelFileName) {
            //文件流
            var dataCode = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>';
            dataCode = dataCode.replace("{table}", trtdCode);

            if (dataCode) {
                if (!event.preventDefault) {
                    //导出组件执行失败 event对象被覆盖，请检查代码中是否有自定义的event函数
                    $.messager.alert("\u5BFC\u51FA\u7EC4\u4EF6\u6267\u884C\u5931\u8D25", "event\u5BF9\u8C61\u88AB\u8986\u76D6\uFF0C\u8BF7\u68C0\u67E5\u4EE3\u7801\u4E2D\u662F\u5426\u6709\u81EA\u5B9A\u4E49\u7684event\u51FD\u6570", "info");
                }
                //阻止元素发生默认的行为（例如，当点击提交按钮时阻止对表单的提交）
                event.preventDefault();
                //Blob对象
                var bb = self.Blob;
                //1.call修正作用域; 2.\ufeff防止utf8 bom防止中文乱码;
                saveAs.call(this, new bb(["\ufeff" + dataCode], { type: "html/plain;charset=utf8" }), excelFileName + frxs.nowDateTime("yyyyMMdd") + ".xls");
            }
            else {
                //导出失败  没有查询到数据。
                $.messager.alert("\u5BFC\u51FA\u5931\u8D25", "\u6CA1\u6709\u67E5\u8BE2\u5230\u6570\u636E\u3002", "info");
                return false;
            }
        },

        ///封装的导出方法
        ///excelFileName 导出的文件名
        ///ajaxUrl 异步请求获取数据的地址
        ///queryData 拉取数据的请求参数
        ///rowsName 返回的数据集合在对象中的名称,不传参数则直接使用默认返回的数据集合
        ///columns 配置的列参数 一个对象数组 
        ///title: 列标题, field: 字段名, type: 格式类型
        ///(type 分类：1.string 普通文本; 2.numStr: 数字转成字符串格式，解决前导0不显示的问题; 3.decimal:小数; scale：小数位数)       
        ///依赖关系： 1.jquery；2.FileSaver.js(Blob.js);3.easyui；4.frxs.commomn.js;
        exportPacking: function (exportArgs) {
            if ((typeof self.Blob !== "function") || (typeof saveAs !== "function")) {
                //提示 未加载到FileSaver.js组件,无法导出!
                $.messager.alert("\u63D0\u793A", "\u672A\u52A0\u8F7D\u5230FileSaver.js\u7EC4\u4EF6\2C\u65E0\u6CD5\u5BFC\u51FA\21", "info");
                return false;
            }
            //必需参数验证 
            if (!exportArgs) {
                //未正确配置参数，无法导出！
                $.messager.alert("\u63D0\u793A", "\u672A\u6B63\u786E\u914D\u7F6E\u53C2\u6570\uFF0C\u65E0\u6CD5\u5BFC\u51FA\uFF01", "info");
                return false;
            }
            //验证ajaxUrl
            if (exportArgs.ajaxUrl == undefined || exportArgs.ajaxUrl == null) {
                //未正确配置网络请求地址参数，无法导出！
                $.messager.alert("\u63D0\u793A", "\u672A\u6B63\u786E\u914D\u7F6E\u7F51\u7EDC\u8BF7\u6C42\u5730\u5740\u53C2\u6570\uFF0C\u65E0\u6CD5\u5BFC\u51FA\uFF01", "info");
                return false;
            }
            //验证columns
            if (exportArgs.columns == undefined || exportArgs.columns == null) {
                //未正确配置数据列的配置参数，无法导出！
                $.messager.alert("\u63D0\u793A", "\u672A\u6B63\u786E\u914D\u7F6E\u6570\u636E\u5217\u7684\u914D\u7F6E\u53C2\u6570\uFF0C\u65E0\u6CD5\u5BFC\u51FA\uFF01", "info");
                return false;
            }
            //保存当前对象指针
            var thisPtr = this;
            //设置 默认文件名
            var excelFileName = (exportArgs && exportArgs.excelFileName) ? (exportArgs.excelFileName) : ("导出Exce文件" + frxs.nowDateTime("yyyyMMdd"));
            //ajaxUrl
            var ajaxUrl = (exportArgs && exportArgs.ajaxUrl) ? exportArgs.ajaxUrl : "";
            //设置兜底的查询参数
            var queryData = (exportArgs && exportArgs.queryData) ? exportArgs.queryData : {};
            //各数据列的配置
            var columns = (exportArgs && exportArgs.columns) ? exportArgs.columns : {};
            //提示语（Unicode编码，防止浏览器乱码） ：  正在导出数据，如数据量大可能需要长一点时间...
            var loading = window.frxs.loading("\u6B63\u5728\u5BFC\u51FA\u6570\u636E\uFF0C\u5982\u6570\u636E\u91CF\u5927\u53EF\u80FD\u9700\u8981\u957F\u4E00\u70B9\u65F6\u95F4...");

            //获取全部数据后导出到Excel
            $.ajax({
                url: ajaxUrl,//Aajx地址
                type: "post",
                dataType: "json",
                data: queryData,
                success: function (result) {
                    loading.close();
                    //处理服务器返回的数据集合
                    var rows = (exportArgs && exportArgs.rowsName) ? result[exportArgs.rowsName] : result;
                    if (rows != undefined) {
                        if (rows.length <= 0) {
                            //提示  没有查询到数据。
                            $.messager.alert("\u63D0\u793A", "\u6CA1\u6709\u67E5\u8BE2\u5230\u6570\u636E\u3002", "info");
                            return false;
                        }
                        //生成标题行数据
                        var trtdCode = thisPtr.buildTitle(columns);

                        //装入集合数据
                        for (var i = 0; i < rows.length; i++) {
                            trtdCode += thisPtr.buildDataRow(rows[i], columns);
                        }

                        //输出Excel文件
                        thisPtr.saveExcel(trtdCode, excelFileName);
                    }
                    else {
                        //提示 没有收到服务端的有效数据
                        $.messager.alert("\u63D0\u793A", "\u6CA1\u6709\u6536\u5230\u670D\u52A1\u7AEF\u7684\u6709\u6548\u6570\u636E\u3002", "info");
                        return false;
                    }
                },
                error: function (request, textStatus, errThrown) {
                    if (textStatus) {
                        $.messager.alert("\u63D0\u793A", textStatus, "info");
                    } else if (errThrown) {
                        $.messager.alert("\u63D0\u793A", errThrown, "info");
                    } else {
                        //提示 出现错误
                        $.messager.alert("\u63D0\u793A", "\u51FA\u73B0\u9519\u8BEF", "info");
                    }
                    loading.close();
                }
            });
        }
    };
    //向外界暴露的对象
    return new instance();
})(window.self, window.saveAs);//构造函数参数要传入FileSaver.js的关键对象