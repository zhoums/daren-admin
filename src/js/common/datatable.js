define(function (require) {
	'use strict';
	require("jquery");
	var swal = require("sweetalert");
	var cwindow = require("common/cwindow");
	var dataUtil = require ("common/data");
	var api = require("api");
	/**
	 * datatable封装
	 */
	function datatable() {

	}

	function columnSetting(id, options) {
		id = id.startsWith("#") ? id : "#" + id;
		var columnDefs = [];
		var sumColumns = [];
		var hasOrderColumn = false;
		$("thead tr th", id).each(function (i) {
			var columnDef = {};
			columnDef.targets = i;
			columnDef.data = $(this).attr('field');
			if ($(this).attr('orderable')) {
				columnDef.orderable = (/^true$/i).test($(this).attr('orderable'));
				hasOrderColumn = true;
			} else {
				columnDef.orderable = false;
			}
			if ($(this).attr("className")) {
				columnDef.className = $(this).attr("className");
			}
			if ($(this).attr("visible")) {
				columnDef.visible = (/^true$/i).test($(this).attr('visible'));
			}
			if ($(this).attr("sum") && (/^true$/i).test($(this).attr('sum'))) {
				sumColumns.push(i);
			}
			columnDefs.push(columnDef);
		});
		if (options.columnDefs) {
			var i = 0;
			$.each(options.columnDefs, function (index, value) {
				if (value.field) {
					var fields = [].concat(value.field); //value.field 有可能是字符或数组，通过concat来统一使用数据处理
					for (i = 0; i < columnDefs.length; i++) {
						if (jQuery.inArray(columnDefs[i].data, fields) > -1) {
							if (value.render)
								columnDefs[i].render = value.render;
						}
					}
				}
				if (value.targets) {
					var targets = [].concat(value.targets);
					for (i = 0; i < targets.length; i++) {
						var target = targets[i];
						target = target < 0 ? (columnDefs.length + target) : target;
						if (value.render) {
							columnDefs[target].render = value.render;
						}
					}
				}
			})
		}
		options.columnDefs = columnDefs;
		//汇总行
		if (sumColumns.length > 0) {
			//添加表脚
			$("tfoot", id).remove();
			$(id).append("<tfoot><tr></tr></tfoot>");
			for (var x in columnDefs) {
				$("tfoot tr", id).append('<td></td>');
			}
			options.footerCallback = function (row, data, start, end, display) {
				var sumValues = new Array(sumColumns.length);
				for (var x in sumColumns) {
					var api = this.api();
					sumValues[x] = api.column(sumColumns[x]).data().reduce(function (a, b) {
						return a + b;
					}, 0);
					$(api.column(sumColumns[x]).footer()).html(sumValues[x]);
				}
			};
		}
		return options;
	}

	datatable.dataTable = function (id, options, core) {
		// 返回数据总数为0的时候，默认将info显示为空
		var oLanguage = {"sInfoEmpty": ""};
		options.oLanguage = oLanguage;
		
		var lengthMenu = [
			[15, 30, 50, 100, 500],
			["15", "30", "50", "100", "500"]
		];

		options.lengthMenu = lengthMenu;
		var drawCallback = options.drawCallback;
		options.drawCallback = function (e) {
			core.listenClick();
			if (drawCallback) {
				drawCallback(e);
			}
		};

		if (options.bSort === undefined) {
			options.bSort = false;
		}

		if (options.ajax) {
			options.ajax.type = options.ajax.type || "get";
			var dataSrc = options.ajax.dataSrc;

			/** 
			 * TODO:这里还需要重新处理排序相关的参数，默认传太多的参数了
			 */
			options.ajax.dataSrc = function (resp) {
				var status = resp.status;
				if (status === -1) {
					resp.recordsTotal = 0;
					resp.recordsFiltered = 0;
					cwindow.failure("加载列表失败");
					return [];
				} else if (status === 1001) {
					parent.location.href = api.loginUrl;
					return;
				} else if (status === 1007) {
					resp.recordsTotal = 0;
					resp.recordsFiltered = 0;
					cwindow.failure(resp.msg);
					return [];
				}
				if(resp.result){
					if(resp.result.taskList){
						resp.result = resp.result || resp.data || resp.result.taskList || {}; //TODO:到时候约定好看这么放data数据
						resp.recordsTotal = resp.result.taskList.totalCount || resp.result.recordsTotal ||  resp.result.totalCount || resp.result.length || 0;  //
						resp.recordsFiltered = resp.result.taskList.totalCount || resp.result.recordsTotal || resp.result.totalCount || resp.result.length || 0;  //
					}else{
						resp.result = resp.result || resp.data || {}; //TODO:到时候约定好看这么放data数据
						resp.recordsTotal =  resp.result.totalCount || resp.result.recordsTotal || resp.result.length || 0;  //
						resp.recordsFiltered = resp.result.totalCount || resp.result.recordsTotal || resp.result.length || 0;  //
					}
				}else{
					resp.result = resp.result || resp.data || {}; //TODO:到时候约定好看这么放data数据
					resp.recordsTotal =  resp.result.totalCount || resp.result.recordsTotal || resp.result.length || 0;  //
					resp.recordsFiltered = resp.result.totalCount || resp.result.recordsTotal || resp.result.length || 0;  //
				}
				if (options.paging === false) {
					var list = resp.result.list || resp.result || resp.data || []; //TODO:到时候约定好看这么放data数据
					resp.recordsTotal = list.length;
					resp.recordsFiltered = list.length;
				}

				if (dataSrc) {
					return dataSrc(resp);
				} else {
					return resp.result.data;
				}
			};
			var param = options.ajax.data;
			options.ajax.data = function (d) {
				var searchBox = options.searchBox || "search-box";
				var data = d;
				$("#" + searchBox).find("input,select").each(function () {
					if ($(this).attr('name') && $(this).val()) {
						data[$(this).attr("name")] = $.trim($(this).val());//简单的处理，提高了搜索体验
					}
				});
				var queryParams = dataUtil.getUrlQueryParams();
				//将url参数作为搜索条件
				for (var i in queryParams) {
					data[i] = queryParams[i];
				}
				if (!options.searching) {
					d.length = d.length || 15;
					if (d.start === 0) {
						data.page = 1;
					} else {
						data.page = d.start / d.length + 1;

					}
					data.pageSize = d.length;
				}
				if (param) {
					return param(data);
				} else {
					return data;
				}
			};
			options.ajax.url = options.ajax.url || "";
			if (options.ajax.url.indexOf("tempData") >= 0) {
				options.ajax.type = 'get';
			} else {
				options.ajax.type = 'post';
			}

		}
		options.searching = options.searching || false;
		if (options.searching) {
			options.bServerSide = false; //如果显示搜索框，默认一次性从服务器加载数据
		} else {
			options.bServerSide = true;
		}
		if (options.data) {
			options.bServerSide = false;
		}

		var simpleColumns = options.simpleColumns || [];
		if (simpleColumns.length > 0) {
			var columns = [];

			for (var i in options.simpleColumns) {
				var col = {
					"data": options.simpleColumns[i]
				};
				columns.push(col);
			}
			options.columns = columns;

		}
		options = columnSetting(id, options);
		options.processing = true;
		var initComplete = options.initComplete;
		options.initComplete = function (settings, json) {
			if (initComplete) {
				initComplete(settings, json);
			}
		};
		if (options.buttons) {
			options.dom = "<'dataTables_header clearfix'<'col-md-11'l><'col-md-1'CB>r>t<'dataTables_footer clearfix'<'col-md-2'i><'col-md-10'p>>";
		}
		var table = $("#" + id).DataTable(options); //大写的D和小写的d好像不一样，坑
		//绑定xhr事件
		table.on('xhr.dt', function (e, settings, json, xhr) {
			if (xhr.status >= 400 && xhr.status < 500) {
				core.failure("发生错误了");
			} else {
				xhr.statusText = xhr.statusText || "";
				if(xhr.statusText.indexOf("1006")>0) {
					core.failure("没有权限");
					return;
				}
				json = json || {};
				if (json.status === 500) {
					core.failure("列表加载失败");
				}
			}
		});
		return table;
	};

	/**
	 * 合并多行的第一列（分组效果）
	 */
	datatable.rowspan = function (id, field, n ) {
		n = n || 0;
		var element = "#" + id;
		//合并多行第一列
		var table = $('#' + id).DataTable();
		var rows = table.rows().data();
		var lastSameField = null; //同一个属性，最后一次出现的位置
		var duplateCount = 1;
		var needRemoveArr = [];
		var mainTd = null;
		for (var i in rows) {
			if (rows[i][field] !== lastSameField) {
				if (lastSameField) {
					for (var j in needRemoveArr) {
						$(needRemoveArr[j]).remove();
					}
					$(mainTd).attr("rowspan", duplateCount);
				}
				lastSameField = rows[i][field];
				duplateCount = 1;
				needRemoveArr = [];
				mainTd = $(element + ' tbody tr').eq(i).find("td").eq(n); //该行的第n列
			} else {
				duplateCount++;
				var r = $(element + ' tbody tr').eq(i).find("td").eq(n); //该行的第n列
				needRemoveArr.push(r);
			}
		} // 循环结束
	};


	datatable.addIndex = function (resp) {
		var baseIndex = (resp.result.pageNO - 1) * resp.result.pageSize;
		for (var x in resp.result.list) {
			var aData = resp.result.list[x];
			aData.index = baseIndex + parseInt(x, 10) + 1;
		}
	};

	return datatable;



});