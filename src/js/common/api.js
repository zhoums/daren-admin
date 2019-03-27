/**
 * permission:true标示此url需要权限验证
 */
define(function (require) {
	'use strict';
	require('jquery');
	var currentHost = location.host;
	var api = {};
	var env = function () {
		if (currentHost.indexOf("localhost") >= 0) {
			return "local";
		}
		if (currentHost.indexOf("192") >= 0) {
			return "local";
		}
		if (currentHost.indexOf("test") >= 0) {
			return "test";
		}
		if (currentHost.indexOf("dev") >= 0) {
			return "dev";
		} 
	}();


	/*if (env === "local") {
		api.loginUrl = "/login.html";
	}*/
	api.loginUrl = "/login.html";
	api.httpService = location.origin + "/admin";

	return api;
});
