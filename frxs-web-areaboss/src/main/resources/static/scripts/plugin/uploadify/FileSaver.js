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

//Excel����������(���� add)
var excelExport = (function (self, saveAs) {
    //�ն��󣬼��ٴ���������ڴ�����
    var instance = function () { };
    //����ԭ����ģʽ,ȷ������ʵ������ָ��ͬһ������,�����ڴ�����
    instance.prototype = {
        //��ͨ�ֶθ�ʽ����Excel�ĵ�Ԫ��
        fieldToTd: function (dataObj) {
            if (dataObj != undefined && dataObj != null && dataObj != '') {
                return "<td>" + dataObj + "</td>";
            }
            else {
                return "<td> </td>";
            }
        },

        //��������ַ���ǰ���㱻���ص�����
        numToStr: function (dataObj) {
            if (dataObj != undefined && dataObj != null && dataObj != '') {
                return "<td x:str=\"'" + dataObj + "\">" + dataObj + "</td>";
            }
            else {
                return "<td> </td>";
            }
        },

        //����Excel����ʱ�����ָ�ʽ����  precisionScaleָС������λ����Ĭ������1λ��
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

            if (dataObj == undefined || dataObj == null || dataObj == "") {//����洢���̷���null������
                return returnString;
            }
            else {
                returnString = "<td style='mso-number-format:\"#,##" + basicNumString + "\";'>" + dataObj + "</td>";
                return returnString;
            }
        },

        //���ɵ���Excel�ı����� (���Ϊ��������)
        buildTitle: function (arrayObj) {
            //���浱ǰthisָ�룬���$.each�����Ҳ�������ķ���������
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

        //�����������ɱ�����
        buildTitleByArray: function (titleArray) {
            //���浱ǰthisָ�룬���$.each�����Ҳ�������ķ���������
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

        //���ɵ���Excel�������� (���Ϊ �����ݶ��������õĶ�������)
        buildDataRow: function (dataObj, arrayObj) {
            //���浱ǰthisָ�룬���$.each�����Ҳ�������ķ���������
            var self = this;
            var tr = "<tr>";
            //����formatter��������
            var tempStr = "";
            //���� ����ÿ������
            $.each(arrayObj, function (index, data) {
                if (data.type) {
                    switch (data.type) {
                        case 'string':
                            //���������ʽ������
                            if (data.formatter && typeof data.formatter === 'function') {
                                tempStr = data.formatter(dataObj[data.field]);
                                tr += self.fieldToTd(tempStr);
                            }
                            else {
                                tr += self.fieldToTd(dataObj[data.field]);
                            }
                            break;
                            //������ת�ַ��� ���ǰ��0����ʾ������ ���� ��Ʒ����/����
                        case 'numStr':
                            tr += self.numToStr(dataObj[data.field]);
                            break;
                        case 'decimal':
                            //��������С��λ��
                            if (data.scale) {
                                tr += self.fmtNum(dataObj[data.field], data.scale);
                            }
                            else {
                                tr += self.fmtNum(dataObj[data.field], 1);
                            }
                            break;
                        default:
                            //���������ʽ������
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
                    //���������ʽ������
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

        //����FileSaver.js�ĺ��Ĺ��ܣ����Excel�ļ�
        ///trtdCode ƴ�ӵı������
        ///excelFileName ָ�����ļ�����
        saveExcel: function (trtdCode, excelFileName) {
            //�ļ���
            var dataCode = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>export</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table></body></html>';
            dataCode = dataCode.replace("{table}", trtdCode);

            if (dataCode) {
                if (!event.preventDefault) {
                    //�������ִ��ʧ�� event���󱻸��ǣ�����������Ƿ����Զ����event����
                    $.messager.alert("\u5BFC\u51FA\u7EC4\u4EF6\u6267\u884C\u5931\u8D25", "event\u5BF9\u8C61\u88AB\u8986\u76D6\uFF0C\u8BF7\u68C0\u67E5\u4EE3\u7801\u4E2D\u662F\u5426\u6709\u81EA\u5B9A\u4E49\u7684event\u51FD\u6570", "info");
                }
                //��ֹԪ�ط���Ĭ�ϵ���Ϊ�����磬������ύ��ťʱ��ֹ�Ա����ύ��
                event.preventDefault();
                //Blob����
                var bb = self.Blob;
                //1.call����������; 2.\ufeff��ֹutf8 bom��ֹ��������;
                saveAs.call(this, new bb(["\ufeff" + dataCode], { type: "html/plain;charset=utf8" }), excelFileName + frxs.nowDateTime("yyyyMMdd") + ".xls");
            }
            else {
                //����ʧ��  û�в�ѯ�����ݡ�
                $.messager.alert("\u5BFC\u51FA\u5931\u8D25", "\u6CA1\u6709\u67E5\u8BE2\u5230\u6570\u636E\u3002", "info");
                return false;
            }
        },

        ///��װ�ĵ�������
        ///excelFileName �������ļ���
        ///ajaxUrl �첽�����ȡ���ݵĵ�ַ
        ///queryData ��ȡ���ݵ��������
        ///rowsName ���ص����ݼ����ڶ����е�����,����������ֱ��ʹ��Ĭ�Ϸ��ص����ݼ���
        ///columns ���õ��в��� һ���������� 
        ///title: �б���, field: �ֶ���, type: ��ʽ����
        ///(type ���ࣺ1.string ��ͨ�ı�; 2.numStr: ����ת���ַ�����ʽ�����ǰ��0����ʾ������; 3.decimal:С��; scale��С��λ��)       
        ///������ϵ�� 1.jquery��2.FileSaver.js(Blob.js);3.easyui��4.frxs.commomn.js;
        exportPacking: function (exportArgs) {
            if ((typeof self.Blob !== "function") || (typeof saveAs !== "function")) {
                //��ʾ δ���ص�FileSaver.js���,�޷�����!
                $.messager.alert("\u63D0\u793A", "\u672A\u52A0\u8F7D\u5230FileSaver.js\u7EC4\u4EF6\2C\u65E0\u6CD5\u5BFC\u51FA\21", "info");
                return false;
            }
            //���������֤ 
            if (!exportArgs) {
                //δ��ȷ���ò������޷�������
                $.messager.alert("\u63D0\u793A", "\u672A\u6B63\u786E\u914D\u7F6E\u53C2\u6570\uFF0C\u65E0\u6CD5\u5BFC\u51FA\uFF01", "info");
                return false;
            }
            //��֤ajaxUrl
            if (exportArgs.ajaxUrl == undefined || exportArgs.ajaxUrl == null) {
                //δ��ȷ�������������ַ�������޷�������
                $.messager.alert("\u63D0\u793A", "\u672A\u6B63\u786E\u914D\u7F6E\u7F51\u7EDC\u8BF7\u6C42\u5730\u5740\u53C2\u6570\uFF0C\u65E0\u6CD5\u5BFC\u51FA\uFF01", "info");
                return false;
            }
            //��֤columns
            if (exportArgs.columns == undefined || exportArgs.columns == null) {
                //δ��ȷ���������е����ò������޷�������
                $.messager.alert("\u63D0\u793A", "\u672A\u6B63\u786E\u914D\u7F6E\u6570\u636E\u5217\u7684\u914D\u7F6E\u53C2\u6570\uFF0C\u65E0\u6CD5\u5BFC\u51FA\uFF01", "info");
                return false;
            }
            //���浱ǰ����ָ��
            var thisPtr = this;
            //���� Ĭ���ļ���
            var excelFileName = (exportArgs && exportArgs.excelFileName) ? (exportArgs.excelFileName) : ("����Exce�ļ�" + frxs.nowDateTime("yyyyMMdd"));
            //ajaxUrl
            var ajaxUrl = (exportArgs && exportArgs.ajaxUrl) ? exportArgs.ajaxUrl : "";
            //���ö��׵Ĳ�ѯ����
            var queryData = (exportArgs && exportArgs.queryData) ? exportArgs.queryData : {};
            //�������е�����
            var columns = (exportArgs && exportArgs.columns) ? exportArgs.columns : {};
            //��ʾ�Unicode���룬��ֹ��������룩 ��  ���ڵ������ݣ����������������Ҫ��һ��ʱ��...
            var loading = window.frxs.loading("\u6B63\u5728\u5BFC\u51FA\u6570\u636E\uFF0C\u5982\u6570\u636E\u91CF\u5927\u53EF\u80FD\u9700\u8981\u957F\u4E00\u70B9\u65F6\u95F4...");

            //��ȡȫ�����ݺ󵼳���Excel
            $.ajax({
                url: ajaxUrl,//Aajx��ַ
                type: "post",
                dataType: "json",
                data: queryData,
                success: function (result) {
                    loading.close();
                    //������������ص����ݼ���
                    var rows = (exportArgs && exportArgs.rowsName) ? result[exportArgs.rowsName] : result;
                    if (rows != undefined) {
                        if (rows.length <= 0) {
                            //��ʾ  û�в�ѯ�����ݡ�
                            $.messager.alert("\u63D0\u793A", "\u6CA1\u6709\u67E5\u8BE2\u5230\u6570\u636E\u3002", "info");
                            return false;
                        }
                        //���ɱ���������
                        var trtdCode = thisPtr.buildTitle(columns);

                        //װ�뼯������
                        for (var i = 0; i < rows.length; i++) {
                            trtdCode += thisPtr.buildDataRow(rows[i], columns);
                        }

                        //���Excel�ļ�
                        thisPtr.saveExcel(trtdCode, excelFileName);
                    }
                    else {
                        //��ʾ û���յ�����˵���Ч����
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
                        //��ʾ ���ִ���
                        $.messager.alert("\u63D0\u793A", "\u51FA\u73B0\u9519\u8BEF", "info");
                    }
                    loading.close();
                }
            });
        }
    };
    //����籩¶�Ķ���
    return new instance();
})(window.self, window.saveAs);//���캯������Ҫ����FileSaver.js�Ĺؼ�����