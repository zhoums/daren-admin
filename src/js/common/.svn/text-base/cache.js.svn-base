 
define(function (require) {
	'use strict';
	require("jquery");
	var api = require("api");
	var http = require("common/http");
	var data = require("common/data");
	var artTemplate = require("artTemplate");

	function cache() {}



	/**
	 * 
	 * @key 缓存的key
	 * @param value 对象字面量
	 * @timeOut 缓存的时间，单位是分钟
	 */
	cache.setCache = function (key, value, timeOut) {
		timeOut = timeOut || 0;
		value = value || {};
		var cacheEndTime = 0;
		var cachedContent = {};
		if (timeOut > 0) {
			var currentDate = new Date().getTime();
			var timeOutms = timeOut * 60 * 1000;
			cacheEndTime = currentDate + timeOutms;
			cachedContent = {
				realValue: value,
				cacheEndTime: cacheEndTime
			};
		} else {
			cachedContent = {
				realValue: value,
				cacheEndTime: cacheEndTime
			};
		}
		window.localStorage.setItem(key, JSON.stringify(cachedContent));

	};



	function render(data, source) {
		var renders = null;
		if (data instanceof Array) {
			source = '{{each list as item i}}' + source + '{{/each}}';
			renders = artTemplate.compile(source);
			return renders({
				"list": data
			});
		} else {
			renders = artTemplate.compile(source);
			return renders(data);
		}

	}


	function select(id, list, name, value, defaultValue, options) {
		$("#" + id).find("option").each(function () {
			if ($(this).val() !== "") {
				$(this).remove();
			}
		});
		defaultValue = defaultValue || '';
		$("#" + id).removeClass("form-control");
		name = name || "name";
		value = value || "value";
		var optionTemplate = '<option value="{{item.' + value + '}}">{{item.' + name + '}} </option> ';
		var html = render(list, optionTemplate);
		$("#" + id).append(html);
		options = options || {};
		options.allowClear = false;
		$("#" + id).select2(options);
		$("#" + id).select2('val', defaultValue);

	}

	cache.deleteCache = function (key) {
		try {
			window.localStorage.removeItem(key);

		} catch (e) {
			console.log(e);
		}
	};
	/**
	 * 登录的时候将用户信息放进缓存中
	 */
	cache.setAccountInfo = function (user, roles) {
		cache.setCache("accountinfo", user, 1000);
	};
	/**
	 * 此信息登录的时候放到缓存中，如果没有跳转到登录页面
	 */
	cache.getAccountInfo = function () {
		var page = $("#current-page").attr("current-page");
		var loginPages = ["login", "sso_login"];

		var accountinfo = cache.getCache("accountinfo");
		if (accountinfo && accountinfo.account) {
			return accountinfo;
		} else if ($.inArray(page, loginPages) >= 0) {
			return undefined;
		} else {
			parent.location.href = api.loginUrl;
		}
	};


	cache.getAccount = function () { 
		return cache.getAccountInfo().account;
	};


	cache.getPermissionConfig = function () {
		var deferred = $.Deferred(); // 新建一个deferred对象
		var ajaxParam = {
			url: "/daren-web/rbac/permission.wb" 
		};
		http.ajax(ajaxParam).then(function (data) {
			deferred.resolve(data.result);
		});
		return deferred;
	};


	cache.checkLogin = function () {
		var deferred = $.Deferred(); // 新建一个deferred对象 
		var ajaxParam = { 
				url: "/daren-web/rbac/checkLogin.wb"
			};
			http.ajax(ajaxParam).then(function (data) { 
				deferred.resolve(data.result);
			});
		return deferred;
	};
	
	/**
	 * 用户菜单列表获取
	 */
	cache.getMenus = function () {
		
		var deferred = $.Deferred();  
		var ajaxParam = { 
			url: "/daren-web/rbac/menus.wb"
		};
		http.ajax(ajaxParam).then(function (data) { 
			deferred.resolve(data.result);
		}); 
		return deferred;
	};
	
	cache.getRoles = function() {
		var deferred = $.Deferred(); // 新建一个deferred对象
//		var ents = cache.getCache("role_" + cache.getAccount()) || [];
		var roles = [];
		if (roles && roles.length > 0) {
			deferred.resolve(roles);
		} else {
			var ajaxParam = {
				url: "/daren-web/rbac/role/select_list.wb"
			};
			http.ajax(ajaxParam).then(function (data) {
//				cache.setCache("role_" + cache.getAccount(), data.result);
				deferred.resolve(data.result);
			});
		}
		return deferred;
	};
	
	cache.clearRoles = function () {
		cache.deleteCache('role_' + cache.getAccount());
	};
	

	cache.getCache = function (key) {
		var cachedContentStr = window.localStorage.getItem(key);
		if (cachedContentStr) {
			var cachedContent = JSON.parse(cachedContentStr);
			var cacheEndTime = cachedContent.cacheEndTime || 0;
			if (cacheEndTime === 0) {
				return cachedContent.realValue;
			} else {
				var currentDate = new Date().getTime();
				if (currentDate <= cacheEndTime) {
					return cachedContent.realValue;
				}
			}
		}
		return undefined;
	}; 
	
	cache.getLocalFilterChainDefination = function () {
		var deferred = $.Deferred(); // 新建一个deferred对象
		var ajaxParam = {
			url: "/daren-web/rbac/localFilterChainDefination.wb"
		};
		http.ajax(ajaxParam).then(function (data) { 
			deferred.resolve(data.result);
		});
		return deferred;
	};



	/**
	 * 每次登陆的时候清空过期的localStorage内容，预防localStorage变得越来越大
	 */
	cache.clearCache = function () {
		localStorage.clear();
	};
 
	cache.clearDict = function() {
		cache.deleteCache("dict");
	};
	cache.getDict = function() {
		var deferred = $.Deferred(); // 新建一个deferred对象
		var dict = cache.getCache("dict");
		if (dict) {
			deferred.resolve(dict);
		} else {
			var ajaxParam = {
				url: "/daren-web/oper/dict/all.wb"
			};
			http.ajax(ajaxParam).then(function (resp) {
				cache.setCache("dict", resp.result);
				deferred.resolve(resp.result);
			});
		}
		return deferred;
	};

	cache.getHplusScript = function () {
		var deferred = $.Deferred(); // 新建一个deferred对象
		var hplusScriptContent = cache.getCache("hplus_script") || "";
		if (hplusScriptContent !== "") {
			deferred.resolve(hplusScriptContent);
		} else {
			var ajaxParam = {
				url: "/js/hplus/hplus.parent.js",
				dataType: "text",
				type: "get"
			};
			http.ajax(ajaxParam).then(function (data) {
				cache.setCache("hplus_script", data);
				deferred.resolve(data);
			});
		}
		return deferred;
	};

	/**
	 * 动态加载css
	 */
	cache.runCss = function (cssContent) {
		document.write('<style type="text/css">' + cssContent + '</style>');
	};
	/**
	 * 动态加载js
	 */
	cache.runJs = function (jsScript) {
		if (window.execScript) {
			window.execScript(jsScript);
		} else {
			window.eval(jsScript);
		}
	};
	/**
	 * 登录以后初始化部分需要较长时间的缓存
	 */
	cache.initCaches = function (account) {
		var deferred = $.Deferred(); // 新建一个deferred对象
		$.when(cache.getMenus(), cache.getLocalFilterChainDefination(), cache.getPermissionConfig(), cache.getDict()).done(function () {
			console.log("缓存初始化完毕");
			deferred.resolve();
		});
		return deferred;
	};


	cache.clearMenus = function () {
		cache.deleteCache('menus_' + cache.getAccount());
	};

	cache.initMenu = function () {
		cache.clearMenus();
		$.when(cache.getMenus()).done(function (menus) {
			var html = '';
			var temp = require("templates/common/menu");
			for (var i in menus) {
				var menu = menus[i];
				html = html + temp(menu);
			}
			parent.$("#side-menu").html("");
			parent.$("#side-menu").html(html);
			if (parent.initMenu) {
				parent.initMenu();
			}
		});

	};



	return cache;

});