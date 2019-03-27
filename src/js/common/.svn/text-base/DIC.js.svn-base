
/** 
 * 前端数据字典
 */
define(function (require) {
	'use strict';
	var cache = require("cache");

	var DIC = {

	};
	DIC.init = function () {
		var args = arguments;
		for (var num in args) {
			var module = args[num];
			for (var methodName in module) {
				DIC[methodName] = module[methodName];
			}
		}
	}(cache);

	DIC.getNameByValue = function(type, value) {
		var objs = DIC[type] || {};

		for( var i in objs) {
			var obj = objs[i];
			if(obj.value === value) {
				return obj.name;
			}
		}
		return "";
	};

	return DIC;

});