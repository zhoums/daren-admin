/** 
 * 页面元素处理
 */
define(function (require) {
	'use strict';
	var cwindow = require("common/cwindow");
	var artTemplate = require("artTemplate");
	var cache = require("cache");


	function dom() {

	}
	
	dom.download = function (url) {
		console.log("download--->>[url]"+url);
		var $form = $('<form method="GET"></form>');
        $form.attr('action', url);
        $form.appendTo($('body'));
        $form.submit();
	}

	/**
	 * html模板直接从页面中拿，页面模板在页面中先隐藏
	 */
	dom.renderById = function (data, id) {

		var source = $("#" + id).html();
		var render = null;
		var html = null;
		var flag = data.hide;
		if (data instanceof Array) {
			source = '{{each list as item i}}' + source + '{{/each}}';
			render = artTemplate.compile(source);
			html = render({
				"list": data
			});
		} else {
			render = artTemplate.compile(source);
			html = render(data);
		}
		return html;
	};

	dom.reset = function (id) {
		$("#" + id)[0].reset();
	};

	dom.render = function (data, source) {
		var render = null;
		if (data instanceof Array) {
			source = '{{each list as item i}}' + source + '{{/each}}';
			render = artTemplate.compile(source);
			return render({
				"list": data
			});
		} else {
			render = artTemplate.compile(source);
			return render(data);
		}

	};
	dom.select = function (id, list, name, value, defaultValue, options) {
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
		var html = dom.render(list, optionTemplate);
		$("#" + id).append(html);
		options = options || {};
		options.allowClear = false;
		options.placeholder = "请选择";
		$("#" + id).select2(options);
		$("#" + id).val(defaultValue);
		$("#" + id).trigger("change");


	};
	 
	/**
	 * select data from remote(每次请求)
	 */
	dom.select3 = function (options, core, changeCallback, minimumInputLength) {
		
//		console.log("dom.select3:"+JSON.stringify(options));	//这里没有任何日志打出来
		if(!minimumInputLength) {
			minimumInputLength = 1;
		} 
		options = options || {};
		options.id = options.value || "value";
		options.text = options.name || "name";
		var id = options.element;
//		console.log("dom.select3[id]--->>:"+id);
		$("#" + id).select2({
			ajax: {
				type: 'GET',
				url: options.url,
				dataType: 'json',
				delay: 250,
				data: function (params) {
					if (options.data) {
						params = options.data(params);
					}
					console.log("dom.select3[params]--->>:"+JSON.stringify(params));
					return params;
				},
				processResults: function (resp, params) {
					params.page = params.page || 1;
					//console.log("dom.select3[resp]--->>:"+JSON.stringify(resp));
					if (resp.status !== 0) {
						if (resp.status === 1001) {
							parent.location.href = "/login.html";
						} else if (resp.status === 1006) {
							core.warning("没有权限");
						} else if (resp.status === 1007) {
							core.warning(resp.msg);
						} else { //TODO:扩展提示登录处理，页面跳转处理，弹框处理，页面跳转处理
							if (resp.msg) {
								cwindow.failure(resp.msg);
							} else {
								cwindow.failure("操作失败");
							}
						}
						return {
							results: []
						};
					}

					var items = [];
					if (resp.result.totalCount !== undefined) {
						items = resp.result.list || [];
					} else {
						items = resp.result || [];
					}
					for (var i in items) {
						items[i].id = items[i][options.id];
						items[i].text = items[i][options.text];
					}
					return {
						results: items, //itemList
						pagination: {
							more: (params.page * 30) < 1000
						}
					};
				},
				cache: options.cache
			},
			placeholder: '请选择', //默认文字提示
			language: "zh-CN",
			tags: options.tags, //允许手动添加
			allowClear: options.allowClear, //允许清空
			escapeMarkup: function (markup) {
				return markup;
			}, // 自定义格式化防止xss注入
			minimumInputLength: 0, //最少输入多少个字符后开始查询
			formatResult: function formatRepo(repo) {
				console.log(repo);
				return repo.text;
			}, // 函数用来渲染结果
			formatSelection: function formatRepoSelection(repo) {
					console.log(repo);
					return repo.text;
				} // 函数用于呈现当前的选择
		}).change(function(){
			if(typeof changeCallback ==='function') {
				changeCallback();
			} else {
				
			}
		});
	};

	/**
	 * select from remote data请求一次
	 */
	dom.select4 = function (options, core) {
		
	};


	dom.setList = function (dic) {
		var list = [];
		for (var key in dic) {
			list.push({
				name: dic[key],
				value: key
			});
		}
		return list;
	};
	/**
	 * 将数据字段转为下拉
	 */
	dom.setDic = function (id, dic, defaultValue) {
		var list = dom.setList(dic);
		dom.select(id, list, "name", "value", defaultValue);
	};


	dom.setSelect = function (id, val) {
		if ($("#" + id).hasClass("select2")) {
			$("#" + id).select2('val', val);
		}
	};

	dom.reset = function (formid) {
		$("#" + formid)[0].reset();
		$("select, #" + formid).each(function () {
			if ($(this).hasClass("select2-offscreen")) {
				$(this).select2('val', "");

			}
		});
	};

	dom.multiselect = function (id, list, name, value, options) {
		name = name || "name";
		value = value || "value";
		var optionTemplate = '<option value="{{item.' + value + '}}">{{item.' + name + '}} </option> ';
		var html = dom.render(list, optionTemplate);
		$("#" + id).html(html);
		options = options || {};
		options.width = options.width || "200px";
		$("#" + id).multiselect(options);
	};


	/**
	 * 获取表单数据
	 */
	dom.getFormData = function (id) {
		id = id || "form-v";
		var datas = {};
		$('input,select,textarea,radio', '#' + id).each(function () {
			if ($(this).attr('name')) {
				if ($(this).attr("type") === "radio") {
					var name = $(this).attr("name");
					var val = $('input[name="' + name + '"]:checked').val();
					datas[$(this).attr('name')] = val;
				} else {
					datas[$(this).attr('name')] = $(this).val();
				}
			}
		});
		return datas;
	};


	function initSingelDatePicker(element, options) {
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

	}


	/**
	 * 解决模块化开发无法在页面直接onclick=method的问题,此方法可以重复调用
	 */
	dom.listenClick = function () {
		/**
		 * 每个需要绑定时间的方法都使用class=bind,这样dom遍历 只需要遍历一次就可以了，元素遍历是很耗性能的
		 */
		$(".bind").each(function () {
			if ($(this).hasClass("bind-click")) {
				bindClick($(this));
			}

			if ($(this).hasClass("bind-change")) {
				bindChange($(this));
			}

			if ($(this).hasClass("bind-enter")) {
				bindEnter($(this));
			}

			if ($(this).hasClass("bind-keyup")) {
				bindKeyup($(this));
			}


			if ($(this).hasClass("permission")) {
				handlePermission($(this));
			}

			if ($(this).hasClass("bind-date")) {
				var id = $(this).attr("id");
				initSingelDatePicker(id);
			}

		});



	};



	function bindKeyup(that) {
		that.unbind("keyup"); //假设已经绑定过将会重新绑定，主要是一些动态添加的内容可能会频繁绑定解绑
		that.bind("keyup", function (event) {
			var method = that.attr("bind-method");
			//如果没有指定target-module属性，默认使用当前页面target-module属性
			var currentModule = that.attr("target-module") || $("#current-page").attr("target-module");
			if (currentModule) {
				require(["page/" + currentModule], function (currentModule) {
					currentModule[method](that);
				});
			}
		});
	}

	function bindEnter(that) {
		that.unbind("keyup"); //假设已经绑定过将会重新绑定，主要是一些动态添加的内容可能会频繁绑定解绑
		that.bind("keyup", function (event) {
			if (event.keyCode === 13) { //键盘 enter操作
				var method = that.attr("bind-method");
				//如果没有指定target-module属性，默认使用当前页面target-module属性
				var currentModule = that.attr("target-module") || $("#current-page").attr("target-module");
				if (currentModule) {
					require(["page/" + currentModule], function (currentModule) {
						currentModule[method](that);
					});
				}
			}
		});
	}

	function bindChange(that) {
		that.unbind("change"); //假设已经绑定过将会重新绑定，主要是一些动态添加的内容可能会频繁绑定解绑
		that.bind("change", function () {
			var method = that.attr("bind-method");
			//如果没有指定target-module属性，默认使用当前页面target-module属性
			var currentModule = that.attr("target-module") || $("#current-page").attr("target-module");
			if (currentModule) {
				require(["page/" + currentModule], function (currentModule) {
					currentModule[method](that);
				});
			}
		});
	}

	function bindClick(that) {
		that.unbind("click"); //假设已经绑定过将会重新绑定，主要是一些动态添加的内容可能会频繁绑定解绑
		that.bind("click", function () {
			var method = that.attr("bind-method");
			var formData;
			var validateForm = that.attr("validate-form");
			//如果按钮配置了这个属性，触发表单验证，不需要再手动验证表单
			if (validateForm) {
				var valid = $("#" + validateForm).valid();
				//这里可以加一些自定义的表单验证
				if (!valid) {
					return;
				}
				formData = dom.getFormData(validateForm);
			}
			//如果没有指定target-module属性，默认使用当前页面target-module属性
			var currentModule = that.attr("target-module") || $("#current-page").attr("target-module");
			if (currentModule) {
				require(["page/" + currentModule], function (currentModule) {
					if (currentModule[method]) {
						currentModule[method](that, formData); //formData是表单数据如果配置了validate-form的话	
					} else {
						console.log(currentModule + "-" + method + " isNotExit");
					}

				});
			}
		});
	}

	/**
	 * 获取选择框的值
	 */
	dom.getSelectVal = function (id) {

	};


	/**
	 * 获取单选组的值
	 */
	dom.getRadioValue = function (name) {
		$("input[type=radio][name=" + name + "][checked]").val();
	};

	/**
	 * 设置单选组的值
	 */
	dom.setRadioValue = function (name, val) {
		$("input[type=radio][name=" + name + "][value=" + val + "]").attr("checked", true);
	};

	dom.toggle = function (toggleContent, childId, parentId) {
		childId = childId || "child-box";

		parentId = parentId || "list-box";
		$("#" + parentId).hide();
		//防止链接被连续点击
		if ($("#" + childId).length > 0) {
			console.log("链接被连续点击");
			return;
		}
		$("body").append(toggleContent);
		if (childId === "child-box") {
			$("#child-box .ibox-tools").first().html('<a class="close-link"><i class="fa fa-times"></i></a>');

		} else {
			$("#grandchild-box .ibox-tools").first().html('<a class="close-link"><i class="fa fa-times"></i></a>');
		}


		$("." + childId + " .close-link").unbind("click");
		$("." + childId + " .close-link,.box-close").click(function () {
			var o = $(this).closest("div." + childId);
			o.remove();
			if (childId === "child-box") {
				$(".child-modal").each(function () {
					$(this).remove();
				});
			} else if (childId === "grandchild-box") {
				$(".grandchild-modal").each(function () {
					$(this).remove();
				});
			}

			$("#" + parentId).show();
		});

		dom.listenClick();
	};
	/**
	 * 表单内容初始化，支持text,select,radio,hidden
	 */
	/*dom.initForm = function (id, obj) {
		$("#" + id + " input,select,textarea").each(function () {

			var type = $(this).attr("type");
			var name = $(this).attr("name");
			var val = obj[$(this).attr('name')];
			if ($(this).attr("type") === "button") {
				return true; //continue
			} else if ($(this).is("select")) {
				$(this).find("option[value='" + obj[$(this).attr('name')] + "']").attr("selected", true).parent().val(obj[$(this).attr('name')]);
				if ($(this).attr("name") === 'province') {
					$(this).trigger("change");
				}

				if ($(this).hasClass("select2-hidden-accessible")) {
					$(this).val(val);
					$(this).trigger("change");
				}
			} else {
				$(this).val(obj[$(this).attr('name')]);
			}
		});
	};*/
	
	 
	
	dom.initForm = function (id, obj, exclusion) {
		var ex = {};
		if(exclusion) {
			ex = exclusion.split(",");
		}
		$("#" + id + " input,select,textarea").each(function () {
			
			var type = $(this).attr("type");
			var name = $(this).attr("name");
			var val = obj[$(this).attr('name')];
			if(ex.length>0) {
				for(var i=0;i< ex.length;i++) {
					if(name==$.trim(ex[i])) {
						return true;
					}
				}	
			}
					
			if ($(this).attr("type") === "button") {
				return true; //continue
			} else if ($(this).is("select")) {
				$(this).find("option[value='" + obj[$(this).attr('name')] + "']").attr("selected", true).parent().val(obj[$(this).attr('name')]);
				if ($(this).attr("name") === 'province') {
					$(this).trigger("change");
				}

				if ($(this).hasClass("select2-hidden-accessible")) {
					$(this).val(val);
					$(this).trigger("change");
				}
			} else {
				$(this).val(obj[$(this).attr('name')]);
			}
		});
	};
	
	dom.commonKindEditorOption = function () {
		var uploads = [];
		var editeOption = {
			basePath: "/js/plugins/kindeditor/",
			cssPath: [],
			jsPath: ['/assets/console/js/libs/jquery-1.10.2.min.js'],
			filterMode: false, //是否开启过滤模式
			newlineTag: 'p',
			autoSetDataMode: true,
			emoticonsPath: '',
			allowFileManager: true,
			uploadJson: '/kms/file/upload',
			items: [
				'source', '|', '|', 'justifyleft', 'justifycenter', 'justifyright', 'template',
				'justifyfull', 'indent', 'outdent', 'clearhtml', 'selectall', '|', 'fullscreen', '/',
				'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
				'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image', 'multiimage', 'video', 'audio',
				'link', 'unlink'
			],
			extraFileUploadParams: {

			},
			afterUpload: function (url, data, name) {
				uploads.push(data);
			}
		};
		return editeOption;
	};

	/**
	 * 省市处理封装
	 */
	dom.province = {
		field: 'province',
		render: function (data, type, row) {
			row.province = row.province || "";
			row.city = row.city || "";
			return row.province + " " + row.city;
		}
	};

	/**
	 * 休眠（毫秒数）
	 */
	dom.sleep = function (numberMillis) {
		var now = new Date();
		var exitTime = now.getTime() + numberMillis;
		while (true) {
			now = new Date();
			if (now.getTime() > exitTime) {
				return;
			}

		}
	};

	/**
	 * 判断是否是谷歌浏览器
	 */
	dom.isChrome = function () {
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		if (userAgent.indexOf("Chrome") > 0) {
			return true;
		} else {
			return false;
		}
	};

	dom.isAdmin = function () {
		return cache.getAccountInfo().type === 1;
	};

	/**
	 *解决用了!important的问题
	 */
	function showPermission(that) {
		that.attr("style", "display:inline-block!important");
	}
	/**
	 * 1、遍历所有带class=permission的元素（默认隐藏）
	 * 2、判断是否需要hasUrl权限或者什么角色的权限多个角色用逗号隔开
	 * 3、针对列表的权限可以对真个div加class=permission 
	 * 4、api.js中如果配置了permission=true，同样需要进行permission判断
	 * 5、此方法可以多次调用（针对动态新增的内容需要进行权限判断）
	 */
	function handlePermission(that) {
		var currentPage = $("#current-page").attr("current-page");
		var targetModule = $("#current-page").attr("target-module");
		if (currentPage === 'login' || currentPage === 'sso_login') {
			return;
		}
		$.when(cache.getLocalFilterChainDefination(), cache.getPermissionConfig()).done(function (definations, permissionConfig) {
//			console.log("definations--->>"+JSON.stringify(definations)+", permissionConfig--->>"+JSON.stringify(permissionConfig));
			showPermission(that);
			
			if (dom.isAdmin()) {
				showPermission(that);
				//that.attr("style", "display:show !important");
			} else {
				var code = that.attr("code") || that.attr("id");
				code = targetModule + "_" + currentPage + "_" + code;				
				var config = getPermissionConfigByCode(code, permissionConfig);			
				
				if (!config) {
					return true; //continue
				}
//				console.info("handlePermission[code]--->>"+code+", [config]--->>"+JSON.stringify(config));
				
				var needUrl = config.needUrl;
				var needRoles = config.needRoles;
				var roles = cache.getAccountInfo().roles;
				
//				console.log("needUrl--->>"+needUrl+", needRoles--->>"+needRoles+", roles--->>"+JSON.stringify(roles));
				
				var i, j;
				if (needUrl) {
					var urlNeedRoles = definations[needUrl] || [];
//					console.log("urlNeedRoles--->>"+urlNeedRoles+", definations--->>"+JSON.stringify(definations)+", permissionConfig--->>"+JSON.stringify(permissionConfig));
					for (i in urlNeedRoles) {
						for (j in roles) {
//							console.log("urlNeedRoles[i]--->>"+urlNeedRoles[i]+", roles[j]--->>"+roles[j]);
							if (urlNeedRoles[i] === roles[j]) {								
								showPermission(that);
							}
						}
					}
				}
				if (needRoles) {
					needRoles = needRoles.split(",");
					for (i in needRoles) {
						for (j in roles) {
							if (needRoles[i] === roles[j]) {
								showPermission(that);
							}
						}
					}
				}


			}

		});
	}


	function getPermissionConfigByCode(code, permissionConfig) {
		var currentPage = $("#current-page").attr("current-page");
		var targetModule = $("#current-page").attr("target-module");

		var moduleConfigs = permissionConfig[targetModule] || [];
		for (var i in moduleConfigs) {
			var config = moduleConfigs[i];

			if (config.code === code) {
				return config;
			}
		}
		return undefined;
	}

	function getLocalPermissions() {
		var permissions = cache.getCache("permission_defination_" + cache.getAccount());
		return permissions;
	}
	/**
	 * 判断用户是否有某个url的权限
	 */
	dom.hasUrl = function (url) {
		if (dom.isAdmin()) {
			return true;
		}
		var roles = cache.getAccountInfo().roles;
		var result = false;
		var permissions = getLocalPermissions();
		var urlNeedRoles = permissions[url] || [];
		for (var i in urlNeedRoles) {
			for (var j in roles) {
				if (urlNeedRoles[i] === roles[j]) {
					result = true;
				}
			}
		}
		return result;
	};
	return dom;

});