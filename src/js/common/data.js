/**
 * core.js去遍历data的所有方法，然后注入到core.js中成为core.js的方法
 * 数据处理工具
 */
define(function (require) {
	'use strict';
	require("jquery");
	var cwindow = require("common/cwindow");

	function data() {

	}

	/**
	 * 函数名称：Trim 函数功能：去除字符串两边的空格 函数参数：str,需要处理的字符串
	 */
	data.trim = function (str) {
		str = str || "";
		return str.replace(/(^\s*)|(\s*$)/g, "");
	};

	data.padLeft = function(num, n) {
		  var len = num.toString().length;
		  while(len < n) {
		    num = "0" + num;
		    len++;
		  }
		  return num;
	}
	
	// 校验是否为空(先删除二边空格再验证)
	data.isNull = function (obj) {
		if (obj === null || typeof (obj) === "null" || typeof (obj) === "undefined") {
			return true;

		} else {
			return false;

		}
	};

	/**
	 * 函数名称：isEmpty 函数功能：判断给定字符串是否为空 函数参数：str,需要处理的字符串
	 */
	data.isEmpty = function (obj) {
		if (obj === null) {
			return true;
		}
		if (!data.isNull(obj) &&
			data.trim(obj).length > 0) {
			return false;

		} else {
			return true;
		}
	};

	/**
	 * 判断字符串不为空
	 */
	data.isNotEmpty = function (obj) {
		return !data.isEmpty(obj);
	};



	/**
	 * 拼接请求参数
	 */
	data.buildQueryString = function (params) {
		var kvs = [];
		for (var p in params) {
			kvs.push(p + '=' + params[p]);
		}
		return '?' + kvs.join('&');
	};

	/**
	 * 获取URL的所有查询参数,url中如果包含中文慎用
	 */
	data.getUrlQueryParams = function () {
		var params = {};
		var regex = /[\?&]([a-zA-Z_]+)=([\w\-\.\s\+\%\:\/\@]*)/g;
		var results;
		while ((results = regex.exec(window.location.href)) !== null) {
			params[results[1]] = results[2];
		}
		return params || {};
	};

	data.getParentUrlQueryParams = function () {
		var params = {};
		var regex = /[\?&]([a-zA-Z_]+)=([\w\-\.\s\+\%\:\/\@]*)/g;
		var results;
		while ((results = regex.exec(parent.window.location.href)) !== null) {
			params[results[1]] = results[2];
		}
		return params || {};
	};

	/**
	 *   变量是否为数字
	 */
	data.isNumber = function (str) {
		var regExp = /^\d+$/g;
		return regExp.test(str);
	};
	data.getMaxDay = function (year, month) {
		if (month === 4 || month === 6 || month === 9 || month === 11)
			return "30";
		if (month == 2)
			if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)
				return "29";
			else
				return "28";
		return "31";
	};

	/**
	 * 判断字符串是否为日期格式
	 */
	data.isDate = function (str, formatStr) {
		formatStr = formatStr || "yyyy-MM-dd";
		var yIndex = formatStr.indexOf("yyyy");
		if (yIndex == -1) {
			return false;
		}
		var year = str.substring(yIndex, yIndex + 4);
		var mIndex = formatStr.indexOf("MM");
		if (mIndex == -1) {
			return false;
		}
		var month = str.substring(mIndex, mIndex + 2);
		var dIndex = formatStr.indexOf("dd");
		if (dIndex == -1) {
			return false;
		}
		var day = str.substring(dIndex, dIndex + 2);
		if (!data.isNumber(year) || year > "2100" || year < "1900") {
			return false;
		}
		if (!data.isNumber(month) || month > "12" || month < "01") {
			return false;
		}
		if (day > data.getMaxDay(year, month) || day < "01") {
			return false;
		}
		return true;
	};
	data.initSingelDatePicker = function (element, options) {
		element = element || "date_from";
		options = options || {};
		var istoday = options.istoday || false;
		var begin = {
			elem: '#' + element,
			istime: true,
			istoday: istoday,

			format: 'YYYY-MM-DD',
			choose: function (datas) { //选择日期完毕的回调

			}
		};


		$("#" + element).click(function () {

			window.laydate(begin);
			//去掉时分秒的显示
			$("#laydate_hms").hide();
		});

		$(".laydate-icon").focusout(function () {
			//点击今天的时候时间是动态赋值的需要一定时间来反应才能够获取到值
			setTimeout(function () {
				var date = $("#" + element).val();
				if (!data.isDate(date)) {
					$("#" + element).val("");
					date = "";
				}


			}, 500);
		});

	};


	data.initDatePicker = function (beginElement, endElement, options) {
		beginElement = beginElement || "date_from";
		endElement = endElement || "date_to";
		options = options || {};
		var istoday = options.istoday || false;
		var begin = {
			elem: '#' + beginElement,
			istime: true,
			istoday: istoday,

			format: 'YYYY-MM-DD',
			choose: function (datas) { //选择日期完毕的回调
				var endDate = $("#" + endElement).val();
				var beginDate = datas;
				if (data.isNotEmpty(endDate) && data.isNotEmpty(beginDate)) {
					endDate = endDate.replace(/-/g, "");
					beginDate = beginDate.replace(/-/g, "");
					if (parseInt(beginDate, 10) > parseInt(endDate, 10)) {
						$("#" + beginElement).val("");
					}
				}
			}
		};

		var end = {
			elem: '#' + endElement,
			istime: true,
			istoday: istoday,
			format: 'YYYY-MM-DD',
			choose: function (datas) { //选择日期完毕的回调
				var endDate = datas;
				var beginDate = $("#" + beginElement).val();
				if (data.isNotEmpty(endDate) && data.isNotEmpty(beginDate)) {
					endDate = endDate.replace(/-/g, "");
					beginDate = beginDate.replace(/-/g, "");
					if (parseInt(beginDate, 10) > parseInt(endDate, 10)) {
						$("#" + endElement).val("");
					}
				}
			}
		};
		$("#" + beginElement).click(function () {

			window.laydate(begin);
			//去掉时分秒的显示
			$("#laydate_hms").hide();
		});
		$("#" + endElement).click(function () {
			window.laydate(end);
			$("#laydate_hms").hide();
		});
		$(".laydate-icon").focusout(function () {
			//点击今天的时候时间是动态赋值的需要一定时间来反应才能够获取到值
			setTimeout(function () {
				var begin = $("#" + beginElement).val();
				if (!data.isDate(begin)) {
					$("#" + beginElement).val("");
					begin = "";
				}

				var end = $("#" + endElement).val();
				if (!data.isDate(end)) {
					$("#" + beginElement).val("");
					end = "";
				}
				if (data.isNotEmpty(begin) && data.isNotEmpty(end)) {
					end = end.replace(/-/g, "");
					begin = begin.replace(/-/g, "");
					if (parseInt(begin, 10) > parseInt(end, 10)) {
						cwindow.warning("开始时间不能大于结束时间");
						$("#" + endElement).val("");
						$("#" + beginElement).val("");

					}
				}
			}, 500);
		});
		
		$("#"+beginElement).prop("autocomplete","off");
		$("#"+endElement).prop("autocomplete","off");

	};
	/**
	 * 从约定的元素获取值
	 */
	data.getAttr = function (key) {
		return $("#current-page").attr(key);
	};
	data.insertAtCursor = function(fieldId, myValue) {
		var myField = document.getElementById(fieldId);
        if (document.selection) {
            //IE support
            myField.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
            sel.select();
        } else if (myField.selectionStart || myField.selectionStart == '0') {
            //MOZILLA/NETSCAPE support
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            var beforeValue = myField.value.substring(0, startPos);
            var afterValue = myField.value.substring(endPos, myField.value.length);

            myField.value = beforeValue + myValue + afterValue;

            myField.selectionStart = startPos + myValue.length;
            myField.selectionEnd = startPos + myValue.length;
            myField.focus();
        } else {
            myField.value += myValue;
            myField.focus();
        }
    }
	/**
	 * 在页面约定的元素上存储数据
	 */
	data.setAttr = function (key, val) {
		$("#current-page").attr(key, val);
	};
	data.timestampToDate = function (value) {
		var date = new Date(value);
		var month = date.getMonth() + 1;
		month = month < 10 ? ("0" + month) : month;
		var day = date.getDate();
		day = day < 10 ? ("0" + day) : day;
		return date.getFullYear() + "-" + month + "-" + day;
	};


	data.timestampToDateTime = function (value) {
		var date = new Date(value);
		var month = date.getMonth() + 1;
		month = month < 10 ? ("0" + month) : month;
		var day = date.getDate();
		day = day < 10 ? ("0" + day) : day;
		var hour = date.getHours();
		hour = hour < 10 ? ("0" + hour) : hour;
		var mi = date.getMinutes();
		mi = mi < 10 ? ("0" + mi) : mi;
		var si = date.getSeconds();
		si = si < 10 ? ("0" + si) : si;
		return date.getFullYear() + "-" + month + "-" + day + " " +
			hour + ":" + mi + ":" + si;
	};

	data.timestampToDateStr = function (value, format) {
		var x = new Date(value);
		var z = {
			y: x.getFullYear(),
			M: x.getMonth() + 1,
			d: x.getDate(),
			H: x.getHours(),
			m: x.getMinutes(),
			s: x.getSeconds()
		};
		return format.replace(/(y+|M+|d+|H+|m+|s+)/g, function (v) {
			return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2));
		});
	};
	
	/**
	 * 判断id是否是sequenceid
	 */
	data.isSequenceid = function (name) {
		var regExp  = /^[0-9a-zA-Z]*$/g; //英文或者数字表示输入的是幼儿园id
		return regExp.test(name);
	};


	/**
	 * 正在表达式
	 */
	data.match = function(regExp, str) {
		return regExp.test(str);
	};

	/**
	 * 回调处理datatable返回的json报文
	 */
	data.fixResp = function (resp, callback, keyName) {
		var i;
		if (resp.result instanceof Array) {
			for (i in resp.result) {
				callback(resp.result[i]);
			}
		} else {
			var list = resp.result[keyName || 'list'] || [];
			for (i in list) {
				callback(list[i]);
			}
		}
	};
	
	data.fixAcc = function (resp, callback, keyName) {
		var i;
		if (resp.result instanceof Array) {
			for (i in resp.result) {
				callback(resp.result[i]);
			}
		} else {
			var list = resp[keyName || 'list'] || [];
			for (i in list) {
				callback(list[i]);
			}
		}
	};


	data.fixDatas = function (datas, callback) {
		datas = datas || [];
		for (var i in datas) {
			callback(datas[i]);
		}
	};

	
	String.prototype.replaceAll = function (target, replacement) {
		return this.split(target).join(replacement);
	};
 
	data.hasElementInArray = function(arr, element) {
		for(var i=0;i<arr.length;i++){  
			if(element==arr[i]) {
				return true;
			}
		}
	}

	data.longToShortDate = function(longTypeDate) {
		if(!longTypeDate) {
			return "";
		}
		var dateType = "";
		var date = new Date();
		date.setTime(longTypeDate);
		dateType += date.getFullYear(); // 年
		dateType += "-" + getMonth(date); // 月
		dateType += "-" + getDay(date); // 日
		return dateType;
	}

	data.longToLongDate = function(longTypeDate) {
		if(!longTypeDate) {
			return "";
		}
		var datetimeType = "";
		var date = new Date();
		date.setTime(longTypeDate);
		datetimeType += date.getFullYear(); // 年
		datetimeType += "-" + getMonth(date); // 月
		datetimeType += "-" + getDay(date); // 日
		datetimeType += "  " + getHours(date); // 时
		datetimeType += ":" + getMinutes(date); // 分
		datetimeType += ":" + getSeconds(date); // 分
		return datetimeType;
	}
	//返回 01-12 的月份值  
	function getMonth(date) {
		var month = "";
		month = date.getMonth() + 1; //getMonth()得到的月份是0-11 
		if (month < 10) {
			month = "0" + month;
		}
		return month;
	}
	//返回01-30的日期 
	function getDay(date) {
		var day = "";
		day = date.getDate();
		if (day < 10) {
			day = "0" + day;
		}
		return day;
	}
	//返回小时
	function getHours(date) {
		var hours = "";
		hours = date.getHours();
		if (hours < 10) {
			hours = "0" + hours;
		}
		return hours;
	}
	//返回分
	function getMinutes(date) {
		var minute = "";
		minute = date.getMinutes();
		if (minute < 10) {
			minute = "0" + minute;
		}
		return minute;
	}
	//返回秒
	function getSeconds(date) {
		var second = "";
		second = date.getSeconds();
		if (second < 10) {
			second = "0" + second;
		}
		return second;
	}
		

	return data;
});