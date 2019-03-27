/**
 * 
 */

define(function(require) {
	jQuery.browser = {};
	jQuery.browser.msie = false;
	jQuery.browser.version = 0;
	if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
		jQuery.browser.msie = true;
		jQuery.browser.version = RegExp.$1;
	}
	var jqform = require("jqform");
	var core = require("core");
	var dataUtil = require("common/data");

	var addDarenInfoTemp = require("templates/daren/add_daren_info");
	var modifyDarenInfoTemp = require("templates/daren/modify_daren_info");
	var modifyDarenResourceTemp = require("templates/daren/modify_daren_resource");
	var drTbodyResourceListTemp = require("templates/daren/dr_resource_list_data");
	var drTbodyResourceListByDarenListTemp = require("templates/daren/dr_resource_list_data_by_daren_list");
	var setIncludingTaxModalTemp = require("templates/daren/set_including_tax");
	var noticeTemp = require("templates/common/notice");
	var batchImportDrenTemp = require("templates/daren/batch_import_dren");
	var settledTaskListDetailTemp = require("templates/task/settled_task_list_detail");
	
	var dict;
	var articleChannelDesc = {
		0 : "未设置",
		10 : "微淘"
	};
	var isEnabledDesc = {
		1 : "服务中",
		2 : "暂停服务"
	};
	function daren() {

	}
	

	function loadMediaChangeLog(entityType,entityId,elementId) {
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/daren/loadCMSOptionLog",
				data:function(d){
					$.extend(d,{
						"entityType":entityType,
						"entityId":entityId
					});
					return d;
				},
				dataSrc : function(resp) {
					var datas = resp.result;
					core.fixDatas(datas, function(row) {
						
					});
					return datas;
				},
			},
			paging : false
		};
		if(!window[elementId]){
			$.extend(window,{
				elementId:{}
			});
		}
		window[elementId] = core.dataTable(elementId, tableConfig);
	}
	
	daren.init = function(page, data) {
		dict = data.dict;
		if (page === "dr_list") {
			core.setDic("searchMediaPlatform", dict.WE_MEDIA_PLATFORM);
			core.setDic("searchResourceType", dict.RESOURCE_LOCATION);
			$("#searchMediaPlatform").prepend("<option value='0' >请选择</option>");
			$("#searchResourceType").prepend("<option value='0' >请选择</option>");
			mediaDarenList();
		}
		if (page === "media_reconciliation_manager_page") {
			core.initDatePicker("search_date_from", "search_date_to");
			darenReconciliationManagerPager();
		}
	};
	
	daren.darenReconciliationManagerExport = function(that, data){
		var action = "/daren-web/daren/darenReconciliationManagerExport";
		core.exportAction(that, data, action);
	}
	daren.darenReconciliationManagerPagerSearch = function (that,data){
		window.darenReconciliationManagerTable.ajax.reload();
	}
	function darenReconciliationManagerPager(){
		
		core.ajax({
			url : "/daren-web/account/priceVisibleIsTrue",
			async : false,
			success : function(resp) {
				if (!resp.result)
					$("#daren-reconciliation-manager-table [field=settleTotalAmt]").remove();
			}
		  });
		
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/daren/darenReconciliationManagerPager",
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core.fixResp(resp, function(row) {
							row.settleTotalAmt = row.settleTotalAmt.toFixed(2);
							row.op = "<a class='bind bind-click' bind-method='showSettledTaskListDetailModal' href='javascript:;' data-ssn='"+row.settleSerialNumber+"' data-tids='"+row.taskIds+"' >任务明细</a>";
						});
						return resp.result.list;
					}

				},
			},
			"bSort" : false,
			drawCallback : function(e) {
			}
		};
		window.darenReconciliationManagerTable = core.dataTable("daren-reconciliation-manager-table", tableConfig);
	}
	
	daren.showSettledTaskListDetailModal = function(that){
		var ssn = $(that).data("ssn");
		var taskIds = $(that).data("tids");
		core.modal("settled_task_list_detail_modal", settledTaskListDetailTemp({
			ssn:ssn
		}));
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/task/getTaskListByids",
				data : function(d){
					$.extend(d,{
						tids:taskIds
					});
				},
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core.fixResp(resp, function(row) {
							row.platformStr = dict.WE_MEDIA_PLATFORM[row.mediaPlatform];
						},"result");
						return resp.result;
					}
				}
			},
			"bSort" : false,
			drawCallback : function(e) {
			}
		};
		window.settledTaskListDetailTable = core.dataTable("settled-task-list-detail-table", tableConfig);
	}

	daren.mediaDarenPageSearch = function(that, data) {
		window.mediaDarenPageTab.ajax.reload();
	}

	function mediaDarenList() {
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/daren/getDarenPager",
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core.fixResp(resp, function(row) {

							if (row.articleUrl && row.articleUrl.length > 0) {
								row.articleUrl = '[<a class="J_DoCopy" url="' + row.articleUrl + '" title="' + row.articleUrl + '">复制</a>]';
							}

							row.articleChannelStr = articleChannelDesc[row.articleChannel];

							row.nickname += "<br><a class='bind bind-click' bind-method='openModifyDrInfoModal' data-diid='" + row.id + "'>修改</a>";
							row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
							row.statusStr = dict.DREN_STATUS[row.status];
							// row.auditStatusStr =
							// dict.MEDIA_AUDIT_STATUS[row.auditStatus];

							for ( var i in row.drResources) {

								if (row.drResources[i].resourceType) {
									row.drResources[i].resourceTypeStr = dict.RESOURCE_LOCATION[row.drResources[i].resourceType];
								}

								// 只有审核通过的渠道才有暂停服务功能
								if (row.drResources[i].drenResourceId > 0) {
									var isEnabledStr = "";
									if (row.drResources[i].isEnabled == 1) {
										isEnabledStr += "<font color='green'>" + isEnabledDesc[row.drResources[i].isEnabled] + "</font>";
										isEnabledStr += "<br><a class='bind bind-click' bind-method='enabledOrDisableRes' data-isenabled='2' data-resid='" + row.drResources[i].id
												+ "'>暂停服务</a>";
									}
									if (row.drResources[i].isEnabled == 2) {
										isEnabledStr += "<font color='red'>" + isEnabledDesc[row.drResources[i].isEnabled] + "</font>";
										isEnabledStr += "<br><a class='bind bind-click' bind-method='enabledOrDisableRes' data-isenabled='1' data-resid='" + row.drResources[i].id
												+ "'>恢复服务</a>";
									}
									row.drResources[i].isEnabledStr = isEnabledStr;
								}

								row.drResources[i].op = "<a class='bind bind-click' bind-method='openDarenResourceManagerModalForClick' data-resid='" + row.drResources[i].id
										+ "' data-diid='" + row.id + "' data-platform='" + row.platform + "'>修改</a><br>";
								// row.drResources[i].auditStatusStr =
								// dict.MEDIA_AUDIT_STATUS[row.drResources[i].auditStatus];
							}
							row.resourceManager = drTbodyResourceListByDarenListTemp(row);

							row.accountTypeStr = dataUtil.isEmpty(row.accountTypeStr) ? '未设置' : row.accountTypeStr;
							row.domainStr = dict.DR_DOMAIN[row.domain];
							row.levelStr = dict.DR_LEVEL[row.level];
							row.op += "<a class='bind bind-click' bind-method='openDarenResourceManagerModalForClick' data-diid='" + row.id + "'>管理渠道报价</a><br>";
						});
						return resp.result.list;
					}

				},
			},
			"bSort" : false,
			drawCallback : function(e) {
				$('.J_DoCopy').each(function(index, that) {
					$(that).click(function(ev) {
						var oEvent = ev || event;
						// console.log(oEvent.clientX + "--" + oEvent.clientY);
						var url = $(that).attr("url");
						var transfer = document.getElementById('J_CopyTransfer');
						if (!transfer) {
							transfer = document.createElement('textarea');
							transfer.id = 'J_CopyTransfer';
							transfer.style.position = 'fixed';
							// transfer.style.display = 'none';
							transfer.style.left = '-99999px';
							transfer.style.top = '-99999px';
							document.body.appendChild(transfer);
						}
						transfer.value = url;
						transfer.focus();
						transfer.select();
						document.execCommand('Copy', false, null);
					});
				})
			}
		};
		window.mediaDarenPageTab = core.dataTable("media-daren-list-tab", tableConfig);
	}

	daren.openModifyDrInfoModal = function(that) {
		core.ajax({
			url : "/daren-web/daren/getDarenInfoDetail",
			data : {
				diId : $.trim($(that).data("diid"))
			},
			type : "post",
			success : function(resp) {
				core.modal("modify_daren_info", modifyDarenInfoTemp(resp.result));
				
				//获取达人修改日志
				//loadMediaChangeLog("t_dren",resp.result.drenId,"media_daren_history_tab");

				$("#modify_daren_info #platform").change(function() {
					var that = this;
					var type = $(that).val();
					if (type == 1) {
						$("#modify_daren_info .article_url_group").show();
					} else {
						$("#modify_daren_info .article_url_group").hide();
					}
				});

				core.setDic("platform", dict.WE_MEDIA_PLATFORM, resp.result.platform);
				core.setDic("edit_domain", dict.DR_DOMAIN, resp.result.domain);
				// core.setDic("resourceType", dict.RESOURCE_LOCATION,
				// resp.result.articleChannel);
				$("#platform").prepend("<option value='0' >请选择</option>");
				// $("#resourceType").prepend("<option value='0'
				// >请选择</option>");

			}
		});
	}

	daren.submitModifyDrInfo = function(that, data) {
		core.ajax({
			url : "/daren-web/daren/modifyMediaDarenInfo",
			data : data,
			type : "post",
			success : function(resp) {
				if (parseInt(resp.result) > 0) {
					core.closeModal("modify_daren_info");
					core.success("更新成功");
					window.mediaDarenPageTab.ajax.reload();
					return;
				}
				core.success("更新失败");
			}
		});
	}

	daren.openAddDrInfoModal = function(that) {
		core.modal("add_daren_info", addDarenInfoTemp());

		$("#add_daren_info #add_daren_info_platform").change(function() {
			var that = this;
			var type = $(that).val();
			if (type == 1) {
				$("#add_daren_info .article_url_group").show();
			} else {
				$("#add_daren_info .article_url_group").hide();
			}
		});
		core.setDic("add_domain", dict.DR_DOMAIN);
		core.setDic("add_daren_info_platform", dict.WE_MEDIA_PLATFORM);
		$("#add_daren_info_platform").prepend("<option value='0' >请选择</option>");

		// core.setDic("add_daren_info_resourceType", dict.RESOURCE_LOCATION);
		// $("#add_daren_info_resourceType").prepend("<option value='0'
		// >请选择</option>");
	}

	daren.submitDrInfo = function(that, data) {
		if (data.platform == 1) {
			if (data.articleUrl == "" || !data.articleUrl) {
				$("#articleUrl").focus();
				core.warning("选择平台是淘宝时，已发布文章链接必填！");
				return false;
			}
		}

		core.ajax({
			url : "/daren-web/daren/addDaren",
			data : data,
			type : "post",
			success : function(resp) {
				if (resp.result) {
					core.closeModal("add_daren_info");
					core.success("新增达人成功，继续添加渠道报价", function() {
						// window.drMediaRegInfoLogTable.ajax.reload(null,
						// false);
						$.extend(resp.result, {
							platformStr : dict.WE_MEDIA_PLATFORM[resp.result.platform],
							articleChannelStr : articleChannelDesc[resp.result.articleChannel]
						});
						openDarenResourceManagerModal(resp.result);
						window.mediaDarenPageTab.ajax.reload();
					});
					return;
				}
				core.success("新增失败");
			}
		});
	}

	/** **************添加渠道相关************************** */

	daren.enabledOrDisableRes = function(that) {
		var resid = $(that).data("resid");
		var isenabled = $(that).data("isenabled");
		var isenabledStr = isenabled == 1 ? '恢复' : '暂停';
		core.confirm("确定要" + isenabledStr + "该渠道服务吗", function() {
			core.ajax({
				url : "/daren-web/daren/modifyResourceDisableOrEnable",
				data : {
					resId : resid,
					type : isenabled
				},
				success : function(resp) {
					// {msg: "成功", result: 1, status: 0}
					if (resp.status == 0) {
						window.mediaDarenPageTab.ajax.reload();
						core.success("操作成功");
					} else {
						core.failure(resp.msg);
					}
				}
			});
		});
	}

	function bindDrenResourceData(drId, targetRes) {
		core.ajax({
			url : "/daren-web/daren/resource_list/" + drId,
			success : function(resp) {
				var datas = resp.result;
				var html = "";
				for ( var i in datas) {
					if (datas[i].expiryDate) {
						datas[i].expiryDateStr = datas[i].expiryDate.substring(0, 10);
					}
					if (datas[i].resourceType) {
						datas[i].resourceTypeStr = dict.RESOURCE_LOCATION[datas[i].resourceType];
					}
					html += drTbodyResourceListTemp(datas[i]);
				}
				$("#detail-tbody-dr-media-list").append(html);
				$("#detail-tbody-dr-media-list input[id^='ipt_expiry_date_']").each(function() {
					var dipt = $(this).attr("id");
					core.initDatePicker(dipt);
				});
				core.listenClick();

				// 高亮选中行
				/*
				 * var targetTr = $("#detail-tbody-dr-media-list
				 * tr[rid="+targetRes+"]");
				 * targetTr.siblings("tr").removeClass("targetRes");
				 * targetTr.addClass("targetRes");
				 */
			}
		});
	}

	daren.deleteDrenResource = function(that) {
		core.confirm("确定删除该达人渠道?", function() {
			var id = that.attr("id");
			core.ajax({
				url : "/daren-web/daren/resource_delete",
				data : {
					id : id
				},
				type : "post",
				success : function(resp) {
					if (resp.status == 0) {
						$("#dren_resource_" + id).remove();
						core.success("删除成功！");
					} else {
						core.warning(resp.msg);
					}

				}
			});
		});
	};

	var targetResourceId = 0;
	daren.openDarenResourceManagerModalForClick = function(that) {
		var diid = $(that).data("diid");
		targetResourceId = $(that).data("resid");
		core.ajax({
			url : "/daren-web/daren/getDarenInfoDetail",
			data : {
				diId : diid
			},
			type : "post",
			success : function(resp) {
				$.extend(resp.result, {
					platformStr : dict.WE_MEDIA_PLATFORM[resp.result.platform],
					articleChannelStr : articleChannelDesc[resp.result.articleChannel]
				});
				openDarenResourceManagerModal(resp.result);
			}
		});
	}

	function openDarenResourceManagerModal(drInfo) {
		core.ajax({
			url : "/daren-web/daren/getCurrentUserRegInfo",
			type : "post",
			success : function(resp) {
				$.extend(drInfo, {
					includingTax : resp.result.includingTax,
					includingTaxStr : dict.INCLUDING_TAX[resp.result.includingTax],
					pinfo : resp.result.id
				});
				core.modal("modify_daren_resource_modal", modifyDarenResourceTemp(drInfo));

				// 获取目标渠道焦点
				$("#modify_daren_resource_modal").on("shown.bs.modal", function(e) {
					if (targetResourceId != 0) {
						$("#modify_daren_resource_modal #dren_resource_" + targetResourceId).find("[name=price]").focus();
					}
				});

				bindDrenResourceData(drInfo.id, drInfo.targetRes);
			}
		});
	}

	daren.addDrenResource = function(that) {
		var drId = that.attr("drId");
		core.modal("add_dr_resource", addDrenResourceTemp({
			drId : drId
		}));
		core.setDic("add_resourceType", dict.RESOURCE_LOCATION);
		core.initDatePicker("add_dr_expiryDate");
		core.listenClick();
	};

	var batchResourceLineNo = 0;
	daren.addDrenResourceNewLine = function(that) {
		$("tr[id^='dren_resource_']").each(function() {
			batchResourceLineNo++;
		});
		var obj = {
			lineNo : batchResourceLineNo
		};
		var drName = that.attr("drName");
		var platform = that.attr("platform");
		var tpl = $("#add_dren_resource_batch_tpl").html();
		tpl = tpl.replaceAll("REPLACE_LINENO", "L_" + batchResourceLineNo).replaceAll("REPLACE_DREN_NAME", drName);
		var html = core.render(obj, tpl);
		$("#detail-tbody-dr-media-list").append(html);
		initDrenResourceBatchInput(platform);
		core.listenClick();
	};

	daren.delDrenResourceLine = function(that) {
		var lineNo = that.attr("line_no");
		if (lineNo) {
			$("#dren_resource_" + lineNo).remove();
		}

	}

	function initDrenResourceBatchInput(platform) {
		$("select[id^='ipt_resource_type_']").each(function() {
			var sel = $(this).val();
			var resourceLocation = {};
			core.ajax({
				url : "/daren-web/daren/getResourceLocationByPlatform",
				data : {
					"platform" : platform
				},
				type : "post",
				async : true,
				success : function(resp) {
					var result = resp.result;
					$.each(result, function(idx, item) {
						resourceLocation[item.resourceId] = item.name;
					});
				}
			});
			core.setDic($(this).attr("id"), resourceLocation, sel);

		});
		$("input[id^='ipt_expiry_date_']").each(function() {
			core.initDatePicker($(this).attr("id"));
		});
	}

	daren.batchEditDrenResource = function(that) {
		var flag = true;
		var resourceLocations = [];
		$("tr[id^='dren_resource_']").each(function() {
			var rid = $(this).attr("rid");
			if (rid == 0) {
				// 新增
				rid = $(this).attr("lineno");
				var resourceLocation = $("#ipt_resource_type_" + rid).val();
				if (!resourceLocation || resourceLocation == 0) {
					core.warning("渠道必填");
					flag = false;
				} else {
					if (resourceLocations.length > 0 && resourceLocations.indexOf(resourceLocation) >= 0) {
						core.warning("渠道重复了");
						flag = false;
					} else {
						resourceLocations.push(resourceLocation);
					}
				}
			} else {
				var resourceLocation = $("#ipt_resource_type_" + rid).attr("value");
				if (resourceLocations.length > 0 && resourceLocations.indexOf(resourceLocation) >= 0) {
					core.warning("渠道重复了");
					flag = false;
				} else {
					resourceLocations.push(resourceLocation);
				}
			}

			// 刊例价
			var ipt_price = parseFloat($.trim($("#ipt_price_" + rid).val()));
			// 执行价
			var ipt_discount_price = parseFloat($.trim($("#ipt_discount_price_" + rid).val()));

			/*if (ipt_price < ipt_discount_price) {
				core.warning("渠道【" + dict.RESOURCE_LOCATION[resourceLocation] + "】的执行价不能大于标准报价 ");
				flag = false;
			}*/
		});
		if (flag) {
			core.confirm("提交渠道报价数据？", function() {
				// 批量修改达人资源
				var resources = getDrenBatchResource();
				if (resources && resources.length > 0) {
					core.ajax({
						url : "/daren-web/daren/resource_batch_save",
						data : {
							"drId" : that.attr("drId"),
							"resourceStr" : JSON.stringify(resources)
						},
						type : "post",
						success : function(resp) {
							if (resp.status === 0) {
								core.closeModal("modify_daren_resource_modal");
								core.success("批量修改成功", function() {
									window.mediaDarenPageTab.ajax.reload();
								});
							} else {
								core.warning(resp.msg);
							}
						}
					});
				}
			});
		}

	};

	function getDrenBatchResource() {
		var resources = [];
		$("tr[id^='dren_resource_']").each(function() {
			var resource = {};
			var rid = $(this).attr("rid");
			if (rid == 0) {
				// 新增
				rid = $(this).attr("lineno");
				var resourceLocation = $("#ipt_resource_type_" + rid).val();
				resource.resourceType = resourceLocation;
			} else {
				resource.id = rid || 0;
			}
			var price = $("#ipt_price_" + rid).val();
			var discountPrice = $("#ipt_discount_price_" + rid).val();
			var expiryDate = $("#ipt_expiry_date_" + rid).val();
			var priceRemark = $("#ipt_price_remark_" + rid).val();

			resource.price = price || 0.0;
			resource.discountPrice = discountPrice || 0.0;
			resource.expiryDate = expiryDate || null;
			resource.priceRemark = priceRemark;
			resources.push(resource);
		});
		return resources;
	}

	daren.openSetIncludingTaxModal = function(that) {
		var itax = $(that).data("itax");
		var pinfo = $(that).data("pinfo");
		core.modal("set_including_tax_modal", setIncludingTaxModalTemp({
			includingTax : itax,
			id : pinfo
		}));
	}

	daren.submitSetIncludingTax = function(that, data) {
		if (dataUtil.isEmpty(data.tax)) {
			core.warning("请选择税费类型");
			return;
		}
		core.ajax({
			url : "/daren-web/daren/modifyMediaRegInfoByIncludingTax",
			data : data,
			type : "post",
			success : function(resp) {
				if (resp.result > 0) {
					$("#modify_daren_resource_modal #taxStr").text(dict.INCLUDING_TAX[data.tax]);
					$("#modify_daren_resource_modal #tax_a").data("itax", data.tax);
					core.closeModal("set_including_tax_modal");
					core.success("设置成功");
				} else {
					core.success("设置失败");
				}
			}
		});
	}

	/** **************添加渠道相关************************** */

	// 批量导入达人
	daren.batchImportDren = function(that, data) {
		core.modal("batchImportDren", batchImportDrenTemp());
	}

	daren.submitBatchImportDren = function(that, data) {
		var filePath = $("#file").val();
		if (!filePath || filePath.length == 0) {
			core.warning("请选择文件");
		} else if (filePath.indexOf(".xls") < 0 && filePath.indexOf(".xlsx") < 0) {
			core.warning("文件格式有误");
		} else {
			var size = $("#file")[0].files[0].size;
			// 文件大小是否符合要求 20971520
			if (size > 20971520) {
				core.warning("文件大小超出限制，文件不能超过20M");
			} else {
				core.confirm("批量导入达人?", function() {
					$(that).button('loading').delay(10).queue(function() {
						$("#fileForm").ajaxSubmit({
							url : '/daren-web/daren/batchImport',
							type : "post",
							complete : function() {
								$(that).button('reset');
								$(that).dequeue();
							},
							success : function(data) {
								if (data.status === 0) {
									if (data.result && data.result.length > 0) {
										var rst = "<div style='text-align:left; font-size:medium'>";
										for (var i = 0; i < data.result.length; i++) {
											rst += (i + 1) + ":" + data.result[i] + "<br>";
										}
										rst += "</div>";

										core.modal("noticeDiv", noticeTemp());
										$("#noticeMsg").html(rst);
										// core.success("批量导入完成,失败记录如下:"+rst);
									} else {
										core.success("批量导入成功");
									}
									core.closeModal("batchImportDren");
									window.droTable.ajax.reload(null, false);
								} else {
									core.failure("批量导入失败");
								}
							},
							error : function(data) {
								if (data && data.msg) {
									core.failure(data.msg);
								} else {
									core.failure("上传出错了！");
								}
							},
							clearForm : true,
							timeout : 3000000
						});
					});
				});
			}
		}
	}

	return daren;
});
