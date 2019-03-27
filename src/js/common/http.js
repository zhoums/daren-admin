/** 
 * 页面元素处理
 */
define(function (require) {
	'use strict';
	require("jquery");
	var cwindow = require("common/cwindow");
	var ipConfig = require("api");
	var loginUrl = ipConfig.loginUrl;
	function http2() {

	}

	http2.ajax = function (options) {
		var deferred = null; // 新建一个deferred对象
		if (!options.success) {
			deferred = $.Deferred();
		}
		options = options || {};
		var api = options.api || {};
		var data = options.data || {};
		var url = options.url || api.url;


		if (api.localJson) {
			url = "/js/tempData/" + api.localJson + ".json";
		}
		var myOptions = {
			"dataType": options.dataType || "json",
			"type": options.type || "GET",
			"timeout": options.timeout || 10000,
			"async": (options.async === undefined) ? true : false
		};
		var ajaxParam = {
			url: url,
			async: myOptions.async,
			dataType: myOptions.dataType,
			data: data,
			cache: false,
			timeout: myOptions.timeout,
			type: myOptions.type,
		};

		ajaxParam.success = function (result) {
			if(ajaxParam.dataType !== "json") {
				deferred.resolve(result);
				return;
			}
			result = result || {};
//			console.log("http2.ajax--->>[result]"+JSON.stringify(result));
			if (result.errcode === 0 || result.status === 0 || result.status === 1100 || result.status === 1130) {
				if (options.success) {
					options.success(result);
				} else {
					deferred.resolve(result);
				}

			} else if (result.status === 1001) {
				parent.location.href = loginUrl;
			}else if (result.status === 1006) {
				cwindow.warning("没有权限");
			} else if (result.status === 1007) {
				cwindow.warning(result.msg);
			} else { //TODO:扩展提示登录处理，页面跳转处理，弹框处理，页面跳转处理
				if (result.msg) {
					cwindow.failure(result.msg);
				} else {
					cwindow.failure("操作失败");
				}
			}
		};

		ajaxParam.error = function (XMLHttpRequest, textStatus, errorThrown) {
			cwindow.failure("系统繁忙");
		};

		if (options.success) {
			return $.ajax(ajaxParam);
		} else {
			$.ajax(ajaxParam);
			return deferred;
		}

	};

	return http2;

});