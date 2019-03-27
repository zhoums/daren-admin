define(function(require) {
	// 兼容jquery form begin
	jQuery.browser = {};
	jQuery.browser.msie = false;
	jQuery.browser.version = 0;
	if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
		jQuery.browser.msie = true;
		jQuery.browser.version = RegExp.$1;
	}
	// 兼容jquery form end
	var core = require("core");
	var jqform = require("jqform");
	require("hoverPreview");
	require("dropzone");
	require("dropzoneAmd");
	require("input");
	var dropzoneDemoTemp = require("templates/daren/dropzone");

	var dataUtil = require("common/data");
	var jqraty = require("common/jquery.raty.min");
	var dict;
	var taskDetailInfo = '';
	var isSendImg = false;

	var largeImgWrapperTemp = require("templates/task/large_img_wrapper");
	var mainProductsTemp = require("templates/task/main_products");
	var taskDetailTemp = require("templates/task/task_detail");
	var accountInfoListTemp = require("templates/task/account_info_list");
	var taskResourceListTemp = require("templates/task/task_resource_list");
	var entryEffectTemp = require("templates/task/entry_effect");
	var entryHintTemp = require("templates/task/hint");
	var deliveryArticleTemp = require("templates/task/delivery_article");
	var autoTaskListTemp = require("templates/task/auto_task_list");
	var lastAutoTaskTemp = require("templates/task/last_auto_task");
	var batchReceiveArticleTemp = require("templates/task/batch_receive_article");
	var batchReceiveArticleNewTemp = require("templates/task/batch_receive_article_new");
	var noticeTemp = require("templates/common/notice");
	var drSettleApplyTemp = require("templates/task/dr_settle_apply");
	var financeTaskCfmDetailTemp = require("templates/task/finance_task_cfm_detail");

	function task() {
		// console.log("构造");
	}
	var principalInfo = {};
	var pageTable = {};
	task.init = function(page, data) {
		dict = data.dict;
		var resourceLocation = dict.RESOURCE_LOCATION;
//		resourceLocation[0] = '全选';
		core.setDic("searchResourceLocation", resourceLocation);
        $("#searchResourceLocation").prepend("<option value='0' >全选</option>");
		core.setDic("searchTaskStatus", dict.DR_TASK_STATUS);
		core.selectShopByUserId("searchShopId");
		core.selectAeByUserId("searchAeId");
		core.selectDrByUserId("searchDrId");
		$("#cbCheckAll").click(function() {
			checkAllClick($(this));
		});
		if (page === "my_task") {
			taskList();
		} else if (page === "my_task_effect") {
			taskEffectList();
		} else if (page === "account_info") {
			accountInfoList();
		} else if (page === "media_settle_task_list") {
			getCurPrincipalInfo();
			core.selectShopByUserId("search_shopId");
			core.selectAeByUserId("search_aeId");
			var resourceLocation = dict.RESOURCE_LOCATION;
//			resourceLocation[0] = '请选择';
			core.setDic("search_resourceLocation", resourceLocation);
	        $("#search_resourceLocation").prepend("<option value='0' >请选择</option>");
			var taskStatus = dict.DR_TASK_STATUS;
//			taskStatus[0] = '全选';
			core.setDic("task_status", taskStatus);
	        $("#task_status").prepend("<option value='0' >全选</option>");
			mediaSettleTaskList();
		} else if (page === "auto_delivery_article") {
			autoList();
		}
	};

	// 获取主体信息
	function getCurPrincipalInfo() {
		core.ajax({
			url : "/daren-web/daren/getCurrentUserRegInfo",
			async : false,
			success : function(resp) {
				principalInfo = resp.result;
				$.extend(principalInfo, {
					"paymentSettleMethodStr" : dict.SETTLEMENT_METHOD[principalInfo.paymentSettleMethod],
					"paymentSubjectStr" : dict.FINANCE_RECEIPT_SUBJECT[principalInfo.paymentSubject]||"未设置"
				});
			}
		});
	}

	// 打开达人结算Modal
	task.openDarenSettlementApplyModal = function(that, data) {
		// 结算安全控制
		var taskId = that.attr("taskId");
		var tag = that.attr("tag");
		core.ajax({
			url : "/daren-web/account/settleSecurity/",
			data : {
				taskId : taskId
			},
			type : "post",
			success : function(resp) {
				if (resp.status != 0) {
					core.warning(resp.msg);
				}
			}
		});
		
		if (!dict) {
			dict = data.dict;
			getCurPrincipalInfo();
		}
		
		var period = that.attr("period");
		if (dataUtil.isNotEmpty(period) && period != 0) {
			core.warning("此任务账期还未结束，剩余" + period + "天可以发起结算");
			return;
		}

		var taskId = that.attr("taskId");
		var drFeeAmt = that.attr("drFee");
		var drsmethod = $(that).data("drsmethod");
		core.modal("dr_settle_apply", drSettleApplyTemp({
			taskId : taskId,
			tag : tag,
			drFeeAmt : drFeeAmt,
			settlementInvoiceMethod : principalInfo.settlementInvoiceMethod,
			settlementInvoiceMethodStr : dict.SETTLEMENT_INVOICE_METHOD[principalInfo.settlementInvoiceMethod]
		}));
	}

	// 打开达人结算Modal
	task.openDarenSettlementApplyModal2 = function(that, data) {
		var selectIds = getSelectIds();
		if (!selectIds || selectIds.length == 0) {
			core.warning("没有选中任何记录");
			return;
		} else {
			// console.log(selectIds);
			var taskIds = selectIds.join(",");
			taskIds = taskIds.replaceAll("-", ",");
		}

		var drFeeAmt = getSelectDrFee("tb-list");
		var drsmethod = $(that).data("drsmethod");
		var needInvoice = false;
		if (parseInt(drsmethod) == 2)
			needInvoice = true;
		core.modal("dr_settle_apply", drSettleApplyTemp({
			taskIds : taskIds,
			drFeeAmt : drFeeAmt,
			needInvoice : needInvoice,
			settlementInvoiceMethod : principalInfo.settlementInvoiceMethod,
			settlementInvoiceMethodStr : dict.SETTLEMENT_INVOICE_METHOD[principalInfo.settlementInvoiceMethod]
		}));
		if (principalInfo.settlementInvoiceMethod == 0) {
			$("#dr_settle_apply").on("change", "[name=hasInvoice]", function() {
				var that = this;
				var thatVal = parseInt($(that).val());
				if (thatVal == 1) {
					$("#dr_settle_apply [name=invoiceNum]").addClass("required");
					$("#dr_settle_apply [name=invoiceAmt]").addClass("required");
				} else {
					$("#dr_settle_apply [name=invoiceNum]").removeClass("required");
					$("#dr_settle_apply [name=invoiceAmt]").removeClass("required");
				}
			});
		}
	}
	// 提交达人结算申请
	task.submitDarenSettlementApplyModal = function(that, data) {
		
		var sim = $(that).data("sim");
		var tag = that.attr("tag");
		
		var dynamicMsg = "平台核对后,即将结算到\t";
		//先开票再打款
		if(sim == 1)
			dynamicMsg = "后续流程完成后,平台将结算到\t";
				
		var confirmMsg = "<font style='font-size:18px;'>";
		if (principalInfo.paymentSettleMethod == 1) {
			confirmMsg += "此次申请结算费用总额 applyAmt 元\n" + dynamicMsg + principalInfo.paymentSettleMethodStr;
			confirmMsg += " 账号 " + principalInfo.paymentPayeeVAccount;
		} else {
			confirmMsg += "此次申请结算费用总额 applyAmt 元\n" + dynamicMsg + dict.BANK[principalInfo.paymentPayeeBank];
			confirmMsg += " 账户  " + principalInfo.paymentPayeeBankAccount + "（" + principalInfo.paymentPayeeName + "）";
		}
		confirmMsg += "</font>";
		
		var taskId = that.attr("taskId");
		if (data.taskIds != "") {

			// 计算本次结算总金额
			var applyAmt = 0;
			$("input[id^=check_]:checked").each(function(idx, that) {
				var tr = $(that).parents("[role=row]");
				var applyPrice = parseFloat($(tr.children("td")[10]).text());
				applyAmt += applyPrice;
			});
			confirmMsg = confirmMsg.replace("applyAmt", applyAmt.toFixed(2));

			data.taskId = 0;
			core.confirm(confirmMsg, function() {
				core.ajax({
					url : "/daren-web/task/settle/dr_apply_settle",
					data : data,
					type : "post",
					success : function(resp) {
						core.success("申请成功");
						window.mediaSettleTaskListTable.ajax.reload(null, false);
						core.closeModal("dr_settle_apply");
						if (tag == "waitSettle") {
							if ($("#waitDeliveryArticle"))
								$("#waitDeliveryArticle")[0].click();
						} 
					}
				});
			});
		}
		if (taskId > 0) {
			var applyPrice = parseFloat(data.drFeeAmt).toFixed(2);
			confirmMsg = confirmMsg.replace("applyAmt", applyPrice);
			core.confirm(confirmMsg, function() {
				core.ajax({
					url : "/daren-web/task/settle/dr_apply_settle",
					data : data,
					type : "post",
					success : function(resp) {
						core.success("申请成功");
						window.mediaSettleTaskListTable.ajax.reload(null, false);
						core.closeModal("dr_settle_apply");
						var tag = $("#waitSettle");
						if (tag) 
							$("#waitSettle")[0].click();
					}
				});
			});
		}
	};

	task.mediaSettleTaskListSearch = function(that, data) {
		// console.log("task.taskListSearch--->>[data]" + JSON.stringify(data));
		window.mediaSettleTaskListTable.ajax.reload();
	}

	function mediaSettleTaskList() {
		core.initDatePicker("search_date_from", "search_date_to");
		core.initDatePicker("searchArticleRetrieve_date_from", "searchArticleRetrieve_date_to");

		core.ajax({
			url : "/daren-web/account/priceVisibleIsTrue",
			async : false,
			success : function(resp) {
				if (!resp.result)
					$("#tb-list [field=drFee]").remove();
			}
		});

		// 设置当页面的table id
		pageTable.id = "tb-list";
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/task/mediaSettleTaskPager",
				data : function(d) {
					return d;
				},
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core.fixResp(resp, function(row) {
							row.check = '<input type="checkbox" id="check_' + row.id + '" drFee=' + row.drFee + ' />';
							row.idStr = row.id;
							var _rl = row.resourceLocation;
							row.resourceLocation = dict.RESOURCE_LOCATION[row.resourceLocation];
							if (row.estRetrieveTime) {
								row.estRetrieveTime = row.estRetrieveTime.substring(0, 10);
							}
							if (row.articleRetrieveTime) {
								row.articleRetrieveTime = row.articleRetrieveTime.substring(0, 10);
							}
							//row.statusStr = dict.TASK_STATUS_V2[row.status];
							row.taskStatusStr = dict.TASK_STATUS_V2[row.taskStatus];
							if (row.articleUrl && row.articleUrl.length > 0) {
								row.articleUrl = '[<a class="J_DoCopy" url="' + row.articleUrl + '" title="' + row.articleUrl + '">复制</a>]';
							}
							if (row.financeApplyStatusStr != "已结算") {
								if (row.accountPeriod != 0) {
									if (row.accountPeriod == null) {
										var drOp = "";
									} else {
										var waitSettleDate = row.canSettleDate.split('-');
										var drOp = waitSettleDate[0] + "月" + waitSettleDate[1] + "日" + "</br>可申请结算";
									}
								} else {
									// 只有 第三方审核通过 或 已完成 的任务才可审核请结算
									/*if (row.status == 90 || row.status == 75) {
										// 只有平台审核通过的，才可以做结算
										if (row.drFee && row.drFee > 0.0 && row.drAccountAmt == 0 && row.drIsAccount == 0) {
											var drOp = ' <a class="bind bind-click" code="settle_dr_task" bind-method="openDarenSettlementApplyModal" period=' + row.accountPeriod
													+ ' taskId=' + row.id + ' data-drsmethod=' + row.drSettlementMethod + ' drFee=' + row.drFee + ' ">申请结算</a>';
											row.op = drOp;
										}
									}*/
									
									var drOp = ' <a class="bind bind-click" code="settle_dr_task" bind-method="openDarenSettlementApplyModal" period=' + row.accountPeriod
									+ ' taskId=' + row.id + ' data-drsmethod=' + row.drSettlementMethod + ' drFee=' + row.drFee + ' ">申请结算</a>';
									row.op = drOp;
									
								}
							}

							if (row.accountPeriod != null) {
								row.accountPeriod = row.accountPeriod + "天";
							}
							row.op = drOp;
							
							if(row.cfmStatus > 0 && row.cfmStatus == 3){
								row.op = '<br/><a class="bind bind-click" bind-method="financeTaskCfmDetailModal"'
										+'data-cfmid="'+row.cfmId+'"'
										+'>确认详情</a>';
							}

							if (row.drFee == 0) {
								row.op = "无需结算";
							}
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
		window.mediaSettleTaskListTable = core.dataTable("tb-list", tableConfig);
		pageTable.tb = window.mediaSettleTaskListTable;
		$("#cbCheckAll").click(function() {
			checkAllClick($(this));
		});

	}
	
	//同意调整结算金额
	task.agreeFinanceTaskCfm = function(that){
		var taskId = $(that).data("entityid");
		core.ajax({
			url : "/daren-web/task/agreeFinanceTaskCfm",
			data : {
				"taskId" : taskId
			},
			type : "post",
			success : function(resp) {
				core.success("确认成功",function(){
					core.closeModal("finance_task_confirm_detail_modal");
				});
				window.mediaSettleTaskListTable.ajax.reload(null, false);
			}
		});
	}
	
	//不同意调整结算金额
	task.agreeFinanceTaskCfmFail = function(that){
		var taskId = $(that).data("entityid");
		core.ajax({
			url : "/daren-web/task/agreeFinanceTaskCfmFail",
			data : {
				"taskId" : taskId
			},
			type : "post",
			success : function(resp) {
				core.success("确认成功",function(){
					core.closeModal("finance_task_confirm_detail_modal");
				});
				window.mediaSettleTaskListTable.ajax.reload(null, false);
			}
		});
	}
	
	// 任务确认详情modal
	task.financeTaskCfmDetailModal = function(that) {
		var cfmId = $(that).data("cfmid");
		core.ajax({
			url : "/daren-web/task/financeTaskCfmDetail",
			data : {
				"cfmId" : cfmId
			},
			type : "post",
			success : function(resp) {
				var cfmDetail = resp.result.entity;
				$.extend(cfmDetail,{
					moliMail:resp.result.moli_contact_email
				});
				cfmDetail.applyAmt = cfmDetail.applyAmt.toFixed(2);
				cfmDetail.cfmFee = cfmDetail.cfmFee.toFixed(2);
				core.modal("finance_task_confirm_detail_modal", financeTaskCfmDetailTemp(cfmDetail));
			}
		});
	}

	task.taskListSearch = function(that, data) {
		// console.log("task.taskListSearch--->>[data]" + JSON.stringify(data));
		window.myTaskListTable.ajax.reload();
	}

	function taskList() {
		core.initDatePicker("searchDeliveryDateFrom", "searchDeliveryDateTo");
		core.ajax({
			url : "/daren-web/account/priceVisibleIsTrue",
			async : false,
			success : function(resp) {
				if (!resp.result)
					$("#tb-my-task-list [field=drFee]").remove();
			}
		});

		var tableConfig = {
			"ajax" : {
				url : "/daren-web/task/myTaskList",
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core.fixResp(resp, function(row) {
							var _rl = row.resourceLocation;
							row.resourceLocationStr = dict.RESOURCE_LOCATION[row.resourceLocation];
							if (row.platform) {
								row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
							}
							if (row.estRetrieveTime) {
								row.estRetrieveTime = row.estRetrieveTime.substring(0, 10);
							}
							// if (row.drSettleIsAudit == 0) {
							// row.settlementStatus = "待结算";
							// }
							// if (row.drSettleIsAudit == 1) {
							// row.settlementStatus = "已结算";
							// }

							var op = '';

							op += '<a href="#" class="bind bind-click" bind-method="taskDetail" rl=' + _rl + ' task_id= "{{id}}">详情</a>';
							if (row.status == 90) {
								if (row.aeConfirmStatus == 90) {
									row.settlementStatus = "已通过";
								} else if (row.aeConfirmStatus == 99) {
									row.settlementStatus = "不通过";
								} else {
									row.settlementStatus = "待确认";
								}
							} else {
								if (row.aeConfirmStatus == 90) {
									row.settlementStatus = "已通过";
									op += '<br><a href="#" class="bind bind-click" bind-method="entryEffect" taskId= "{{id}}" effectId= "' + row.effectId + '" >成效录入</a>';
								} else if (row.aeConfirmStatus == 99) {
									op += '<br><a href="#" class="bind bind-click" bind-method="deliveryArticle" taskId= "{{id}}" effectId= "' + row.effectId + '">回填稿件</a>';
									op += '<br><a href="#" class="bind bind-click" bind-method="entryEffect" taskId= "{{id}}" effectId= "' + row.effectId + '" >成效录入</a>';
									row.settlementStatus = "不通过";
								} else {
									op += '<br><a href="#" class="bind bind-click" bind-method="deliveryArticle" taskId= "{{id}}" effectId= "' + row.effectId + '">回填稿件</a>';
									if (row.effectId != 0) {
										op += '<br><a href="#" class="bind bind-click" bind-method="entryEffect" taskId= "{{id}}" effectId= "' + row.effectId + '" >成效录入</a>';
									}
									row.settlementStatus = "待确认";
								}
							}

							row.statusStr = dict.TASK_STATUS_V2[row.status];
							if (row.productIds && row.productIds != 0) {
								row.mainProducts = '<a href="#" class="bind bind-click" bind-method="mainProductsDetail" productIds = ' + row.productIds + ' >查看</a>';
							} else {
								row.mainProducts = '';
							}
							row.idStr = row.id;
							row.articleTitle = row.articleTitle;
							row.op = core.render(row, op);
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
						// core.alert("复制成功");
					});
				})
			}
		};
		window.myTaskListTable = core.dataTable("tb-my-task-list", tableConfig);
	}
	function taskEffectList() {
		core.initDatePicker("searchDeliveryDateFrom", "searchDeliveryDateTo");
//		core.ajax({
//			url : "/daren-web/account/priceVisibleIsTrue",
//			async : false,
//			success : function(resp) {
//				if (!resp.result)
//					$("#tb-my-task-list [field=drFee]").remove();
//			}
//		});

		var tableConfig = {
			"ajax" : {
				url : "/daren-web/task/myTaskEffectList",
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core.fixResp(resp, function(row) {
							var _rl = row.resourceLocation;
							row.resourceLocationStr = dict.RESOURCE_LOCATION[row.resourceLocation];
							if (row.platform) {
								row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
							}
							if (row.estRetrieveTime) {
								row.estRetrieveTime = row.estRetrieveTime.substring(0, 10);
							}
							// if (row.drSettleIsAudit == 0) {
							// row.settlementStatus = "待结算";
							// }
							// if (row.drSettleIsAudit == 1) {
							// row.settlementStatus = "已结算";
							// }

							var op = '';

							op += '<a href="#" class="bind bind-click" bind-method="taskDetail" rl=' + _rl + ' task_id= "{{id}}">详情</a>';
							if (row.status == 90) {
								if (row.aeConfirmStatus == 90) {
									row.settlementStatus = "已通过";
								} else if (row.aeConfirmStatus == 99) {
									row.settlementStatus = "不通过";
								} else {
									row.settlementStatus = "待确认";
								}
							} else {
								if (row.aeConfirmStatus == 90) {
									row.settlementStatus = "已通过";
									op += '<br><a href="#" class="bind bind-click" bind-method="entryEffect" taskId= "{{id}}" effectId= "' + row.effectId + '" >成效录入</a>';
								} else if (row.aeConfirmStatus == 99) {
									op += '<br><a href="#" class="bind bind-click" bind-method="deliveryArticle" taskId= "{{id}}" effectId= "' + row.effectId + '">回填稿件</a>';
									op += '<br><a href="#" class="bind bind-click" bind-method="entryEffect" taskId= "{{id}}" effectId= "' + row.effectId + '" >成效录入</a>';
									row.settlementStatus = "不通过";
								} else {
									op += '<br><a href="#" class="bind bind-click" bind-method="deliveryArticle" taskId= "{{id}}" effectId= "' + row.effectId + '">回填稿件</a>';
									if (row.effectId != 0) {
										op += '<br><a href="#" class="bind bind-click" bind-method="entryEffect" taskId= "{{id}}" effectId= "' + row.effectId + '" >成效录入</a>';
									}
									row.settlementStatus = "待确认";
								}
							}

							row.statusStr = dict.TASK_STATUS_V2[row.status];
							if (row.productIds && row.productIds != 0) {
								row.mainProducts = '<a href="#" class="bind bind-click" bind-method="mainProductsDetail" productIds = ' + row.productIds + ' >查看</a>';
							} else {
								row.mainProducts = '';
							}
							row.idStr = row.id;
//							row.articleTitle = row.articleTitle;
							row.op = core.render(row, op);
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
						// core.alert("复制成功");
					});
				})
			}
		};
		window.myTaskListTable = core.dataTable("tb-my-task-effect-list", tableConfig);
	}
	task.publicAccountInfoList = function(dict, data) {
		accountInfoList(dict);
	}

	task.drTaskListSearch = function(that, data) {
		// console.log("task.drTaskListSearch--->>[data]" +
		// JSON.stringify(data));
		window.drTaskListTable.ajax.reload();
	}

	task.waitDeliveryArticleExport = function(that, data) {
		var action = "/daren-web/task/waitDeliveryArticleExport";
		core.exportAction(that, data, action);
	};

	function accountInfoList(dict) {
		core.ajax({
			url : "/daren-web/account/priceVisibleIsTrue",
			async : false,
			success : function(resp) {
				if (!resp.result)
					$("#tb-dr-task-list [field=drFee]").remove();
			}
		});

		core.setDic("searchSettleAuditStatus", dict.SETTLEMENT_INVOICE_METHOD);
		
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/task/accountInfoList/",
				async : false,
				type : "post",
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						var result = resp.result;
						if (result.taskList == null) {
							$('.tag').attr("disabled", true);
							$('.tag').css("pointer-events", "none");
							return result;
						}
						var taskCount = result;
						var accountInfo = result.taskList;
						var regInfo;
						core.ajax({
							url: "/daren-web/daren/getCurrentUserRegInfo",
							async : false,
			                type:"post",
			                success: function(resp) {
			                	regInfo = resp.result;
			                }
						
						});
						
						if (taskCount.waitDeliveryArticle != 0) {
							var count = taskCount.waitDeliveryArticle;
							$('#waitDeliveryArticle').html("1.待回稿:<br>" + count);
						} else {
							$('#waitDeliveryArticle').html("1.待回稿:<br>0");
						}
						if (taskCount.waitAuditArticle != 0) {
							var count = taskCount.waitAuditArticle;
							$('#waitAuditArticle').html("2.待平台审核:<br>" + count);
						} else {
							$('#waitAuditArticle').html("2.待平台审核:<br>0");
						}
						if (taskCount.waitEntryEffect != 0) {
							var count = taskCount.waitEntryEffect;
							$('#waitEntryEffect').html("3.待回填成效:<br>" + count);
//							core.alert("当前您尚有等待回填发票数据的任务，请尽早完成开票");
//							task.entryHint();
						} else {
							$('#waitEntryEffect').html("3.待回填成效:<br>0");
						}
						if (taskCount.waitAuditEffect != 0) {
							var count = taskCount.waitAuditEffect;
							$('#waitAuditEffect').html("4.待AE确认:<br>" + count);
						} else {
							$('#waitAuditEffect').html("4.待AE确认:<br>0");
						}
						if (taskCount.waitSettle != 0) {
							var count = taskCount.waitSettle;
							var fee = taskCount.waitSettleFee;
							$('#waitSettle').html("5.待申请结算:<br>" + count + "条(" + fee + "元)");
						} else {
							$('#waitSettle').html("5.待申请结算:<br>0");
						}
						// 发票提供类型为-------不开票
						if(regInfo.settlementInvoiceMethod == 1 || regInfo.settlementInvoiceMethod == 0){
							$('#invoiceFirst').remove();
							$('#payFirst').remove();
							if (taskCount.waitAuditSettle != 0) {
								var count = taskCount.waitAuditSettle;
								var fee = taskCount.waitAuditSettleFee;
								$('#waitAuditSettle').html("6.结算中:<br>" + count + "条(" + fee + "元)");
							} else {
								$('#waitAuditSettle').html("6.结算中:<br>0");
							}
							if (taskCount.settledTask != 0) {
								var count = taskCount.settledTask;
								var fee = taskCount.settledTaskFee;
								$('#settledTask').html("7.已结算:<br>" + count + "条(" + fee + "元)");
							} else {
								$('#settledTask').html("7.已结算:<br>0");
							}
						}
						// 发票提供类型为-------先开票后打款
						if(regInfo.settlementInvoiceMethod == 2){
							$('#invoiceFirst').show();
							$('#payFirst').remove();
							$('#noInvoice').remove();
							
							if (taskCount.settleAudit != 0) {
								var count = taskCount.settleAudit;
								$('#settleAudit').html("6.结算确认:<br>" + count);
							} else {
								$('#settleAudit').html("6.结算确认:<br>0");
							}
							
							if (taskCount.waitInvoice != 0) {
								var count = taskCount.waitInvoice;
								$('#waitInvoice').html("7.待开发票:<br>" + count);
							} else {
								$('#waitInvoice').html("7.待开发票:<br>0");
							}
							
							if (taskCount.invoiceAudit != 0) {
								var count = taskCount.invoiceAudit;
								$('#invoiceAudit').html("8.发票待确认:<br>" + count);
							} else {
								$('#invoiceAudit').html("8.发票待确认:<br>0");
							}
							
							if (taskCount.waitAuditSettle != 0) {
								var count = taskCount.waitAuditSettle;
								var fee = taskCount.waitAuditSettleFee;
								$('#waitAuditSettle').html("9.结算中:<br>" + count + "条(" + fee + "元)");
							} else {
								$('#waitAuditSettle').html("9.结算中:<br>0");
							}
							
							if (taskCount.settledTask != 0) {
								var count = taskCount.settledTask;
								var fee = taskCount.settledTaskFee;
								$('#settledTask').html("10.已结算:<br>" + count + "条(" + fee + "元)");
							} else {
								$('#settledTask').html("10.已结算:<br>0");
							}
						}
						// 发票提供类型为-------先打款后开票
						if(regInfo.settlementInvoiceMethod == 3){
							var logincount=document.cookie.split(";")[0].split("=")[1];
							if (taskCount.waitInvoice == 0 && logincount == 0) {
								task.entryHint();
								document.cookie="logincount="+1;
							}
							$('#invoiceFirst').remove();
							$('#payFirst').show();
							$('#noInvoice').show();
							if (taskCount.waitAuditSettle != 0) {
								var count = taskCount.waitAuditSettle;
								var fee = taskCount.waitAuditSettleFee;
								$('#waitAuditSettle').html("6.结算中:<br>" + count + "条(" + fee + "元)");
							} else {
								$('#waitAuditSettle').html("6.结算中:<br>0");
							}
							if (taskCount.settledTask != 0) {
								var count = taskCount.settledTask;
								var fee = taskCount.settledTaskFee;
								$('#settledTask').html("7.已结算:<br>" + count + "条(" + fee + "元)");
							} else {
								$('#settledTask').html("7.已结算:<br>0");
							}
							
							if (taskCount.waitInvoice != 0) {
								var count = taskCount.waitInvoice;
								$('#waitInvoice').html("8.待开发票:<br>" + count);
							} else {
								$('#waitInvoice').html("8.待开发票:<br>0");
							}
							
							if (taskCount.invoiceAudit != 0) {
								var count = taskCount.invoiceAudit;
								$('#invoiceAudit').html("9.发票待确认:<br>" + count);
							} else {
								$('#invoiceAudit').html("9.发票待确认:<br>0");
							}
							
						}
						var accountInfoHtml = '';
						core.fixAcc(accountInfo, function(row) {
							row.check = '<input type="checkbox" id="check_' + row.id + '"/>';
							
							var _rl = row.resourceLocation;
							if (row.estRetrieveTime) {
								row.estRetrieveTime = row.estRetrieveTime.substring(0, 10);
							}

							row.resourceLocationStr = dict.RESOURCE_LOCATION[row.resourceLocation];
							if (row.invoiceAuditStatus != 0) {
								row.invoiceAuditStatusStr = dict.FINANCE_INVOICE_STATUS[row.invoiceAuditStatus];
							}else{
								row.invoiceAuditStatusStr = "待开票";
							}
							if (row.invoiceConfirmStatus) {
								row.invoiceConfirmStatusStr = dict.FINANCE_INVOICE_STATUS[row.invoiceConfirmStatus];
							}
							if (row.platform) {
								row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
							}
							if (row.estRetrieveTime) {
								row.estRetrieveTime = row.estRetrieveTime.substring(0, 10);
							}
//							if (row.drSettleIsAudit == 0) {
//								row.settlementStatus = "待结算";
//							}
//							if (row.drSettleIsAudit == 1) {
//								row.settlementStatus = "已结算";
//							}
							row.statusStr = dict.TASK_STATUS_V2[row.status];
							if (row.productIds && row.productIds != 0) {
								row.mainProducts = '<a href="#" class="bind bind-click" bind-method="mainProductsDetail" productIds = ' + row.productIds + ' >查看</a>';
							} else {
								row.mainProducts = "";
							}
							row.idStr = row.id;
							var op = '';
							op += '<a href="#" class="bind bind-click" bind-method="taskDetail" rl=' + _rl + ' task_id= "{{id}}">查看详情</a>';
							// 待回稿显示回稿
							if (taskCount.searchByWhat == 1) {
								$('#tb-dr-task-list').DataTable().columns('#rowAuditRemark').visible(true);
								op += '<br><a href="#" class="bind bind-click" bind-method="deliveryArticle" taskId= "{{id}}" effectId="' + row.effectId
										+ '" tag= "waitDeliveryArticle">回填稿件</a>';
							} else {
								$('#tb-dr-task-list').DataTable().columns('#rowAuditRemark').visible(false);
							}
							// 回稿状态待审核显示 更新平台审核状态（修改回稿信息）
							if (taskCount.searchByWhat == 2) {
								if (row.status != 90)
									op += '<br><a href="#" class="bind bind-click" bind-method="deliveryArticle" taskId= "{{id}}" effectId="' + row.effectId
											+ '" tag= "waitAuditArticle">更新审核状态</a>';
							}
							// 待回填成效显示录入成效
							if (taskCount.searchByWhat == 3) {
								op += '<br><a href="#" class="bind bind-click" bind-method="entryEffect" tag= "waitEntryEffect" taskId= "{{id}}" effectId="' + row.effectId + '">录入成效</a>';
							}
							// 待AE确认，后续增加类似催单功能
							if (taskCount.searchByWhat == 4) {
							}
							// 待申请结算显示申请结算
							if (taskCount.searchByWhat == 5) {
//								row.settlementStatus = "待申请结算";
								row.settlementStatus = row.financeApplyStatusStr;
//								if (row.status != 95 && row.status != 96 && row.status != 99) {
//									// 只有 第三方审核通过 或 已完成 的任务才可审核请结算
//									if (row.status == 90 || row.status == 75) {
										// 只有平台审核通过的，才可以做结算
//										if (row.drFee && row.drFee > 0.0 && row.drAccountAmt == 0 && row.drIsAccount == 0) {
											var drSettlementMethod = row.drSettlementMethod
											if (row.financeApplyStatusStr != "已结算") {
												if (row.accountPeriod != 0) {
													if (row.accountPeriod == null) {
														var drOp = "";
													} else {
														var waitSettleDate = row.canSettleDate.split('-');
														var drOp = waitSettleDate[0] + "月" + waitSettleDate[1] + "日" + "</br>可申请结算";
														op += "<br>"+drOp;
													}
												} else {
													var drOp = ' <a class="bind bind-click permission" tag="waitSettle" code="settle_dr_task" bind-method="openDarenSettlementApplyModal" period='
															+ row.accountPeriod + ' taskId=' + row.id + ' data-drsmethod=' + row.drSettlementMethod + ' drFee=' + row.drFee 
															+ ' ">申请结算</a>';
													op += "<br>"+drOp;
													if(row.cfmStatus > 0 && row.cfmStatus == 3){
														op += '<br/><a class="bind bind-click" bind-method="financeTaskCfmDetailModal"'
																+'data-cfmid="'+row.cfmId+'"'
																+'>确认详情</a>';
													}
													
												}
											}
//										}
//									}
//								}
							}
							// 待结算显示已申请结算但还没通过审核的任务列表
							if (taskCount.searchByWhat == 6) {
								row.settlementStatus = "结算中";
							}
							// 已结算显示已结算的任务列表
							if (taskCount.searchByWhat == 7) {

							}
							// 结算确认
							if (taskCount.searchByWhat == 8) {
								if(row.cfmStatus > 0 && row.cfmStatus == 3){
									op += '<br/><a class="bind bind-click" bind-method="financeTaskCfmDetailModal"'
											+'data-cfmid="'+row.cfmId+'"'
											+'>确认详情</a>';
								}
							}
							

							// 待回稿、待平台审核、待回填成效的不显示pv、uv、结算状态
							if (taskCount.searchByWhat == 1 || taskCount.searchByWhat == 2 || taskCount.searchByWhat == 3) {
								$('#tb-dr-task-list').DataTable().columns('#rowPV').visible(false);
								$('#tb-dr-task-list').DataTable().columns('#rowUV').visible(false);
								$('#tb-dr-task-list').DataTable().columns('#rowSettlementStatus').visible(false);
							} else {
								$('#tb-dr-task-list').DataTable().columns('#rowPV').visible(true);
								$('#tb-dr-task-list').DataTable().columns('#rowUV').visible(true);
								$('#tb-dr-task-list').DataTable().columns('#rowSettlementStatus').visible(true);
							}

							if (taskCount.searchByWhat != 5) {
								$('#tb-dr-task-list').DataTable().columns('#accountPeriod').visible(false);
								$('#tb-dr-task-list').DataTable().columns('#rowFinanceApplyRemark').visible(false);
							} else {
								$('#tb-dr-task-list').DataTable().columns('#accountPeriod').visible(true);
								$('#tb-dr-task-list').DataTable().columns('#rowFinanceApplyRemark').visible(true);
							}
							if (taskCount.searchByWhat == 8) {
								$('#tb-dr-task-list').DataTable().columns('#invoiceConfirmStatusStr').visible(true);
								$('#tb-dr-task-list').DataTable().columns('#invoiceConfirmRemark').visible(true);
							} else {
								$('#tb-dr-task-list').DataTable().columns('#invoiceConfirmStatusStr').visible(false);
								$('#tb-dr-task-list').DataTable().columns('#invoiceConfirmRemark').visible(false);
							}
							if (taskCount.searchByWhat == 9){
								$('#editInvoice').show();
							}else{
								$('#editInvoice').hide();
							}
							if (taskCount.searchByWhat == 9 || taskCount.searchByWhat == 10) {
								$('#tb-dr-task-list').DataTable().columns('#invoiceAuditStatusStr').visible(true);
								$('#tb-dr-task-list').DataTable().columns('#invoiceAuditRemark').visible(true);
							} else {
								$('#tb-dr-task-list').DataTable().columns('#invoiceAuditStatusStr').visible(false);
								$('#tb-dr-task-list').DataTable().columns('#invoiceAuditRemark').visible(false);
							}
							row.accountPeriod = row.accountPeriod + "天";
							row.op = core.render(row, op);
							// console.log("accountInfo[row]--->>" +
							// JSON.stringify(row));
							accountInfoHtml += accountInfoListTemp(row);
						});
						$('#tb-dr-task-list tbody').html(accountInfoHtml);
						return resp.result.taskList.list;
					}
				},
			},
		// "processing" : false
		// "paging" : true,
//		"pagingType":   "input"
		}
		window.drTaskListTable = core.dataTable("tb-dr-task-list", tableConfig);
	}

	task.taskDetail = function(that, dic) {
		var taskId = that.attr("task_id");
		var resourceLocation = that.attr("rl");
		core.toggle(taskDetailTemp({
			"taskId" : taskId,
			"resourceLocation" : resourceLocation
		}));
		if (dic == null) {
			dic = dict;
		}
		getTaskDetail(taskId, dic);
	};

	function getTaskDetail(taskDetailId, dict) {
		core.ajax({
			url : "/daren-web/task/detail/" + taskDetailId,
			type : "post",
			success : function(resp) {
				var result = resp.result;
				taskDetailInfo = result;
				var taskEffectInfo = result.taskEffectInfo;
				var resources = result.resources;
				var taskEffectInfoAuditLog = result.taskEffectInfoAuditLog;
				var resourseListHtml = '', taskEffectInfoAuditLogHtml = '';
				var taskStatusStr = dict.TASK_STATUS_V2[result.status];
				if(taskStatusStr){
					if (taskStatusStr.indexOf("服务已完成") != -1) {
						$("#deliveryArticle").remove();
					}
				}
				
				if (taskEffectInfo == null) {
					$("#entryEffect").hide();
					$("#deliveryArticle").attr("disabled", false).attr("style", "display:block;");

				} else {
					// $("#deliveryArticle").hide();
					$("#entryEffect").attr("disabled", false).attr("style", "display:block;").attr("effectId", taskEffectInfo.id);
					$("#deliveryArticle").attr("disabled", false).attr("style", "display:block;").attr("taskId", result.id).attr("effectId", taskEffectInfo.id);
					$("#deliveryArticle").html("修改回稿信息");
				}

				resources.map(function(row) {
					// console.log("getTaskDetail[row]--->>" +
					// JSON.stringify(row));
					row.idStr = row.id;
					if (row.postTimeFrom && row.postTimeTo) {
						row.postTime = row.postTimeFrom.substring(0, 10) + " -- " + row.postTimeTo.substring(0, 10);
					}
					if (row.upTime) {
						row.upTime = row.upTime.substring(0, 10);
					}
					row.resourceLocation = dict.RESOURCE_LOCATION[row.resourceLocation];
					var commissionLinks = "";
					if (row.commissionLinks && row.commissionLinks.length > 0) {
						for (var i = 0; i < row.commissionLinks.length; i++) {
							var link = row.commissionLinks[i];
							commissionLinks += link.link + "\r\n";
						}
					}
					row.commissionLink = commissionLinks;
					var mainProducts = "";
					if (row.products && row.products.length > 0) {
						for (var i = 0; i < row.products.length; i++) {
							var product = row.products[i];
							if (i > 0) {
								mainProducts += "---------------------------------------------<br>";
							}
							if (product.name) {
								mainProducts += "商品名称：" + product.name + "<br>";
							}
							if (product.productUrl) {
								mainProducts += "商品链接：" + product.productUrl + "<br>";
							}
							if (product.picUrl) {
								mainProducts += "白底图链接：" + product.picUrl + "<br>";
							}
							if (product.salesPoint) {
								mainProducts += "卖点：" + product.salesPoint + "<br>";
							}
							if (product.remark) {
								mainProducts += "商品备注：" + product.remark + "<br>";
							}
						}
					} else {
						mainProducts = row.mainProducts;
					}
					row.mainProducts = mainProducts;
					row.statusStr = dict.RESOURCE_ITEM_STATUS[row.status];
					resourseListHtml += taskResourceListTemp(row)
				});
				$('#tb-task-resource-item-list tbody').html(resourseListHtml);
				taskTooltip();

				if (taskEffectInfoAuditLog != null && taskEffectInfoAuditLog.length > 0) {
					var status = taskEffectInfoAuditLog[0].auditStatus;
					if (status == 3) {
						$('#entryEffect').html("修改成效");
						$('#entryEffect').attr("effectId", taskEffectInfo.id);
					}
				}

				taskEffectInfoAuditLog.map(function(row) {
					var img = '';
					if (row.effectFile) {
						var imgs = [];
						if (row.effectFile.indexOf("|") != -1) {
							imgs = row.effectFile.split('|');
						} else {
							imgs.push(row.effectFile);
						}
						for (var i = 0; i < imgs.length; i++) {
							img += '<img class="auditLogImg" src="' + imgs[i]
									+ '" style="max-width: 40px;max-height:40px;margin-right: 10px;border:1px solid black;cursor:pointer;"/> &nbsp;&nbsp;'
						}
					}
					if (row.createDate) {
						row.createDate = row.createDate.substring(0, 10);
					}
					if (row.collectTime) {
						row.collectTime = row.collectTime.substring(0, 10);
					}
					if (row.retrieveMethod) {
						row.retrieveMethodStr = dict.MEDIA_EFFECT_RETRIEVE_METHOD[row.retrieveMethod];
					}

					taskEffectInfoAuditLogHtml += '<tr>';
					taskEffectInfoAuditLogHtml += '<td>' + row.createTime + '</td><td>' + row.username + '</td><td>' + row.pv + '</td><td>' + row.uv + '</td>';
					taskEffectInfoAuditLogHtml += '<td>' + row.interactions + '</td><td>' + row.comments + '</td><td>' + row.praises + '</td><td>' + row.retransmissions
							+ '</td><td>' + row.collectTime + '</td>';
					taskEffectInfoAuditLogHtml += '<td>' + img + '</td><td>' + row.articleStatusStr + '</td>';
					taskEffectInfoAuditLogHtml += '<td><span id="span_ArticleUrl_' + row.id + '" style="display:none">' + row.articleUrl + '<br></span>';
					if (row.articleUrl && row.articleUrl != "") {
						taskEffectInfoAuditLogHtml += '<a data-toggle="tooltip" data-placement="top" title="' + row.articleUrl
								+ '" data-html="true" class="bind bind-click" bind-method="showArticleUrl" logId="' + row.id + '">查看</a>';
					}
					taskEffectInfoAuditLogHtml += '</td>';

					taskEffectInfoAuditLogHtml += '<td>' + row.retrieveMethodStr + '</td><td>' + row.auditStatusStr + '</td><td>' + row.auditRemark + '</td>';
					taskEffectInfoAuditLogHtml += '</tr>';
				});
				$('#tb-task-effect-info-audit-log-list tbody').html(taskEffectInfoAuditLogHtml);
				taskTooltip();
				$('#taskId').html(result.id);

				var statusStr2 = dict.TASK_STATUS_V2[result.status];
				if (result.failRemark && result.failRemark.length > 0) {
					statusStr2 += "[" + result.failRemark + "]";
				}
				$('#statusStr').html(statusStr2);

				if (result.aeConfirmStatus == 90) {
					$('#aeConfirmStatus').html("已通过");
					$('#deliveryArticle').remove();
				} else if (result.aeConfirmStatus == 99) {
					$('#aeConfirmStatus').html("不通过");
				} else {
					$('#aeConfirmStatus').html("待确认");
				}

				$('#aeName').html(result.aeName);
				if (result.estRetrieveTime) {
					$('#estRetrieveTime').html(result.estRetrieveTime.substring(0, 10));
				}
				var resourceLocationStr = dict.RESOURCE_LOCATION[result.resourceLocation];
				$('#resourceLocation').html(resourceLocationStr);
				$('#drFee').html(result.drFee == -1 ? "--" : result.drFee);
				$('#drName').html(result.drName);
				$('#remark').html(result.remark);

				if (taskEffectInfo != null) {
					$("#articleInfoHtml").attr("disabled", false).attr("style", "display:block;");
					$('#articleStatusStr').html(taskEffectInfo.articleStatusStr);
					$('#articleTitleStr').html(taskEffectInfo.articleTitle);
					$('#articleUrlStr').html(taskEffectInfo.articleUrl);

					$("#effectInfoHtml").attr("disabled", false).attr("style", "display:block;");
					$('#pvStr').html(taskEffectInfo.pv);
					$('#uvStr').html(taskEffectInfo.uv);
					$('#interactionsStr').html(taskEffectInfo.interactions);
					$('#commentsStr').html(taskEffectInfo.comments);
					$('#praisesStr').html(taskEffectInfo.praises);
					$('#retransmissionsStr').html(taskEffectInfo.retransmissions);
					if (taskEffectInfo.pv == 0) {
						$('#effectInfoHtml').hide();
					}
				} else {
					$('#articleInfoHtml').hide();
					$('#effectInfoHtml').hide();
				}

				core.listenClick();
				// 要放在core.listenClick后面
			}
		});
	}

	function taskTooltip() {
		$('[data-toggle="tooltip"]').tooltip();
	}

	var imgeffect; //成效图片数组
	function getEffectInfo(effectId, taskId, dict) {
		core.ajax({
			url : "/daren-web/task/getEffectInfo/",
			data : {
				"effectId" : effectId,
				"taskId" : taskId
			},
			type : "post",
			success : function(resp) {
				var effectimg = resp.result.effectFile;
				if (effectimg != null && effectimg != undefined){
					imgeffect = effectimg.split('|');
				}else {
					imgeffect = [];
				}
				if (resp.status != 0) {
					core.alert(resp.msg);
				} else {
					var effect = resp.result;
					if (effect) {
						if (effect.collectTime && effect.collectTime.length >= 10) {
							effect.collectTime = effect.collectTime.substring(0, 10);
						}
						if (effect.issueDate && effect.issueDate.length >= 10) {
							effect.issueDate = effect.issueDate.substring(0, 10);
						}
						if (effect.effectFile) {
							var $imgWrapper = $('#imgEffectWrapper');
							var img = effect.effectFile.split('|');
//							for (var i = 0; i < img.length; i++) {
//								html = '<li><img src="' + img[i] + '" f="' + img[i] + '"/><a href="javascript:void(0);" class="deleteImg"> × </a></li>';
//								$imgWrapper.append(html);
//							}
						}
						if (effect.images) {
							var $imgWrapper = $('#imgArticleWrapper');

							var img = effect.images.split('|');
							for (var i = 0; i < img.length; i++) {
								if(dataUtil.isNotEmpty(img[i])){
									html = '<li><img src="' + img[i] + '" f="' + img[i] + '"/></li>';
									$imgWrapper.append(html);
								}
							}
						}
						core.initForm("entryEffect-form", effect);
						core.initForm("article-form", effect);
					}
				}
				task.openDropzoneModalEffetc();
			},
		});
	}

	task.entryHint = function() {
		
		core.modal("entry_hint", entryHintTemp({}));
	}
	
	task.entryEffect = function(that, dic) {
		var isAuto = that.attr("isAuto");
		var taskId = that.attr("taskId");
		var effectId = that.attr("effectId");
		var tag = that.attr("tag");
		core.modal("entry_effect", entryEffectTemp({
			"taskId" : taskId,
			"effectId" : effectId,
			"tag" : tag
		}));
		if (dic != null) {
			dict = dic;
		}
		getEffectInfo(effectId, taskId, dict);
		$(".exampleImg").hoverPreview({
			width : '500px',
			height : '100px',
			backgroundColor : 'white'
		});
	}
	task.submitEffectImages = function() {
		// console.log($('#effectFile').val());
		if (!$('#effectFile').val()) {
			core.alert('请选择成效图片');
			return;
		}
		var $imgWrapper = $('#imgEffectWrapper')
		if ($imgWrapper.find('li').length >= 5) {
			core.alert('最多上传5张图片');
			return;
		}
		$("#effectFileForm").ajaxSubmit({
			url : '/daren-web/upload/uploadEffectImg',
			type : "post",
			success : function(data) {
				if (data.status === 0) {
					var html = '';
					html = '<li><img src="' + data.result + '" f="' + data.result + '"><a href="javascript:;" class="deleteImg"> × </a></li>';
					$imgWrapper.append(html);
				}
			},
			error : function(data) {
				if (data && data.msg) {
					core.failure(data.msg);
				} else {
					core.failure("上传失败！");
				}
			},
			clearForm : true,
			timeout : 3000000
		});
	}
	task.submitArticleImages = function() {
		// console.log($('#articleFile').val());
		if (!$('#articleFile').val()) {
			core.alert('请选择回稿图片');
			return;
		}
		var $imgWrapper = $('#imgArticleWrapper')
		if ($imgWrapper.find('li').length >= 5) {
			core.alert('最多上传5张图片');
			return;
		}
		$("#articleFileForm").ajaxSubmit({
			url : '/daren-web/upload/uploadArticleImg',
			type : "post",
			success : function(data) {
				if (data.status === 0) {
					var html = '';
					html = '<li><img src="' + data.result + '" f="' + data.result + '"><a href="javascript:;" class="deleteImg"> × </a></li>';
					$imgWrapper.append(html);
				}
			},
			error : function(data) {
				if (data && data.msg) {
					core.failure(data.msg);
				} else {
					core.failure("上传失败！");
				}
			},
			clearForm : true,
			timeout : 3000000
		});
	}
	task.submitEntryEffect = function(that, data) {
		var imgs = JSON.parse($("#img_input_effetc").val());
		var str = "";
		for (var i = 0; i < imgs.length; i++) {
			str += imgs[i].url + "|";
		}
		data.effectFile = str.substring(0,str.length-1);
		if (data.pv == 0) {
			core.alert("阅读次数不能为0");
			$("#pv").focus();
			return;
		}
		if (data.uv == 0) {
			core.alert("引导进店人数不能为0");
			$("#uv").focus();
			return;
		}

		var articleImgs = [];
		var effectImgs = [];
		$('#imgArticleWrapper li').map(function(index, target) {
			articleImgs.push($(target).find('img').attr('src'))
		});
		$('#imgEffectWrapper li').map(function(index, target) {
			effectImgs.push($(target).find('img').attr('src'))
		});
//		data.images = articleImgs.join('|'); // 拼接几张图片，用竖线分隔，如：http://www.baidu.com|http://www.163.com
//		data.effectFile = effectImgs.join('|'); // 拼接几张图片，用竖线分隔，如：http://www.baidu.com|http://www.163.com
		if (!data.effectFile || data.effectFile == "") {
			core.alert("成效图片未上传");
			return;
		}
		data.id = data.id || 0;
		core.ajax({
			url : "/daren-web/task/entryEffect",
			type : "post",
			data : data,
			success : function(resp) {
				core.closeModal("entry_effect");
				getTaskDetail(data.taskId, dict);
				core.success("提交成功");
				var tag = $("#waitEntryEffect");
				if (tag)
					$("#waitEntryEffect")[0].click();
			},
			error : function(resp) {
				core.closeModal("entry_effect");
				core.alert(resp.msg);
			}

		});
	};

	function autoList() {
		console.log("autoList()");
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/task/getAutoDeliveryArticle",
				type : "post",
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core
								.fixResp(
										resp,
										function(row) {
											if (row.platform) {
												row.platformStr = dict.WE_MEDIA_PLATFORM[row.platform];
											}
											if (row.lastSyncTime) {
												row.lastSyncTime += '<br><font color="red">已回填任务数:' + row.taskCount
														+ '<font> <br><a href="#" class="bind bind-click" bind-method="lastAutoTask" drId = "' + row.drId + '" lastSyncTime = "'
														+ row.lastSyncTime + '">数据详情</a>';
											}
											var op = '';

											// if (row.waitFee) {
											row.waitFee = row.waitFee + '<br><a href="#" class="bind bind-click" bind-method="autoTaskList" drId= "' + row.drId + '">详情</a>';
											// }
											row.refresh = '<a href="#" class="bind bind-click" bind-method="refreshAutoList" >刷新</a>';

											op += '<a href="#" class="bind bind-click" bind-method="smartRollBack" data-drId="{{drId}}" data-darenId="{{darenId}}" data-token="{{token}}" data-darenName="{{drName}}" >智能回填数据</a>';

											row.op = core.render(row, op);
											core.listenClick();
											// 要放在core.listenClick后面

										});
						return resp.result;
					}
				},
			},
			"paging" : false,
			"info" : false,
			"bSort" : false
		};
		window.autoList = core.dataTable("tb-auto-delivery-article-list", tableConfig);
	}

	task.refreshAutoList = function(that, data) {
		window.autoList.ajax.reload();
	}

	task.lastAutoTask = function(that, dic) {
		var drId = that.attr("drId");
		var syncTime = that.attr("lastSyncTime");
		getLastAutoTask(drId, syncTime);
	}

	function getLastAutoTask(drId, syncTime) {
		console.log("drId=[" + drId + "],syncTime=[" + syncTime + "]");
		core.modal("last_auto_task", lastAutoTaskTemp());
		console.log("2");
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/task/getLastAutoTask",
				data : function(d) {
					return $.extend(d, {
						drId : drId,
						syncTime : syncTime
					});
				},

				// data:{
				// "taskId":taskId,
				// "syncTime":syncTime
				// },
				type : "post",
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core.fixResp(resp, function(row) {
							core.listenClick();
							// 要放在core.listenClick后面
						});
						return resp.result;
					}
				},
			},
			"paging" : false,
		// "info" : false,
		}
		window.lastAutoTaskTable = core.dataTable("tb-last-auto-task", tableConfig);
	}

	task.autoTaskList = function(that, dic) {
		var drId = that.attr("drId");
		getAutoTaskList(drId, dic);
	}

	function getAutoTaskList(drId, dic) {
		if (dic != null) {
			dict = dic;
		}

		core.modal("auto_task_list", autoTaskListTemp());
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/task/getAutoTaskList/" + drId,
				type : "post",
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core.fixResp(resp, function(row) {
							if (row.articleRetrieveTime) {
								row.articleRetrieveTime = row.articleRetrieveTime.substring(0, 10);
							}
							core.listenClick();
							// 要放在core.listenClick后面
						});
						return resp.result;
					}
				},
			},
			"paging" : false,
		// "info" : false,
		}
		window.autoTaskListTable = core.dataTable("tb-auto-task-list", tableConfig);
	}
	var echoimgarr;//回稿图片
	task.deliveryArticle = function(that, dic) {
		if (dic != null) {
			dict = dic;
		}
		;
		var taskId = that.attr("taskId");
		var effectId = that.attr("effectId");
		var tag = that.attr("tag");
		core.modal("delivery_article", deliveryArticleTemp({
			"taskId" : taskId,
			"tag" : tag
		}));
		echoimgarr = "";
        core.setDic("article_status", dict.PLATFORM_ARTICLE_STATUS);
        
		if (effectId && effectId != 0) {
			core.ajax({
				url : "/daren-web/task/getEffectInfo",
				data : {
					"effectId" : effectId,
					"taskId" : taskId
				},
				type : "post",
				async : false,
				success : function(resp) {
					echoimgarr = resp.result.images.split('|');
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						var effect = resp.result;
						if (effect) {
							if (effect.issueDate && effect.issueDate.length >= 10) {
								effect.issueDate = effect.issueDate.substring(0, 10);
							}

							if (effect.images) {
								var $imgWrapper = $('#imgDeArticleWrapper');
//								$('#imgs_show').append(html);
//								for (var i = 0; i < img.length; i++) {
//									html = '<li><img src="' + img[i] + '" f="' + img[i] + '"/><a href="javascript:;" class="deleteImg"> × </a></li>';
//									$imgWrapper.append(html);
//								}
							}

							$("#articleRemark").html(effect.articleRemark);
							core.initForm("article-form", effect);
						}
					}
					
				},
				
			});
		}
		task.openDropzoneModal();	
	};
	task.submitImages = function() {
		// console.log($('#file').val());
		if (!$('#file').val()) {
			core.alert('请选择图片');
			return;
		}
		var $imgWrapper = $('.imgWrapper')
		if ($imgWrapper.find('li').length >= 5) {
			core.alert('最多上传5张图片');
			return;
		}

		if (!isSendImg) {
			core.uploadImage("file", "fileForm");
			isSendImg = false;
		}
	}

	task.submitDeliveryArticle = function(that, data) {
		var img_str_arr = $("#img_input").val();
		var dataimages = JSON.parse(img_str_arr);
//		var image = [];
//		$('.imgWrapper li').map(function(index, target) {
//			image.push($(target).find('img').attr('src'))
//		});
//		data.images = image.join('|'); // 拼接几张图片，用竖线分隔，如：http://www.baidu.com|http://www.163.com
		data.id = data.id || 0;
		var tag = that.attr("tag");
		core.ajax({
			url : "/daren-web/task/taskHasSameUrl",
			type : "post",
			data : { taskId : data.taskId , url : data.articleUrl},
			success : function(resp) {
				var result = resp.result;
				if (result != "") {
					core.confirm("您填写的稿件链接，与其他任务重复【任务ID号：" + result + "】，是否确定继续？", function() {
						canDeliveryArticle(data, tag, dataimages);
					})
				} else {
					canDeliveryArticle(data, tag, dataimages);
				}

			}
		});
	};

	function canDeliveryArticle(data, tag, dataimages) {
		
		var imgstr = "";
		for(var j = 0; j < dataimages.length; j++){
			imgstr += dataimages[j].url + "|";// 拼接几张图片，用竖线分隔，如：http://www.baidu.com|http://www.163.com
		}
		imgstr = imgstr.substring(0,imgstr.length-1)
		data.images = imgstr;
		var arr = [];
		for (var i = 0; i < dataimages.length; i++) {
		    arr.push(dataimages[i].url); //属性
		    //arr.push(obj[i]); //值
		}
		echoimgarr = arr;
		core.ajax({
			url : "/daren-web/task/deliveryArticle",
			type : "post",
			data : data,
			success : function(resp) {
				core.closeModal("delivery_article");
				getTaskDetail(data.taskId, dict);
				core.success("提交成功");
				if (tag == "waitDeliveryArticle") {
					if ($("#waitDeliveryArticle"))
						$("#waitDeliveryArticle")[0].click();
				} else if (tag == "waitAuditArticle") {
					if ($("#waitAuditArticle"))
						$("#waitAuditArticle")[0].click();
				}
			},
			error : function(resp) {
				core.closeModal("delivery_article");
				core.alert(resp.msg);
			}
		});
	}

	// 批量回收稿件
	task.batchReceiveArticleNew = function(that, data) {
		core.modal("batchReceiveArticleNew", batchReceiveArticleNewTemp());
//		var option = {
//			url : "/daren-web/task/batchReceiveArticle", // 上传地址
//			addRemoveLinks : "dictRemoveFile",
//			maxFiles : 10,
//			maxFilesize : 512,
//			uploadMultiple : false,
//			parallelUploads : 1,
//			previewsContainer : "#imgs_show",
//			acceptedFiles : ".png,.gif,.jpg,.jpeg,.xlsx,.xls",
//			success : function(file, response, e) {
//				console.log(file);
//				console.log(response);
//			}
//		};

		var batchDeliveryArticleDropzone = $("#batchDeliveryArticleDropzone").dropzone({
			addRemoveLinks : false,
//			previewsContainer : "#imgs_show",
			dictRemoveFile : "删除",

			maxFiles : 10, // 一次性上传的文件数量上限
			maxFilesize : 20, // MB
			acceptedFiles : ".png,.gif,.jpg,.jpeg,.xlsx,.xls",
			parallelUploads : 3,
			uploadMultiple : false,
			dictMaxFilesExceeded : "您最多只能上传10个文件！",
			dictResponseError : '文件上传失败!',
			dictInvalidFileType : "你不能上传该类型文件,文件类型只能是*.jpg,*.gif,*.png,*.jpeg,*.xlsx,*.xls",
			dictFallbackMessage : "浏览器不受支持",
			dictFileTooBig : "文件过大上传文件最大支持.",

			success : function(file, response, e) {
//				$.extend(file, {
//					response : response,
//					uniqueMark : new Date().getTime()
//				});
//				var imgs = JSON.parse($("#img_input").val());
//				imgs.push({
//					key : file.uniqueMark,
//					url : file.response.result
//				});
//				$("#img_input").val(JSON.stringify(imgs));
				if(response && response.result && response.result.length>0) {
//					var msgs = JSON.stringify(response.result);
					var str = response.result[0];
//            		core.failure(JSON.parse(str).msg);
					try {
						core.failure(JSON.parse(str).msg);
						}
						catch(err){
							core.failure(str);
						}
            	}else{
            		core.success("批量导入成功");
            		  
            	} 

			}
		});
	}

	task.batchReceiveArticle = function(that, data) {
		core.modal("batchReceiveArticle", batchReceiveArticleTemp());
	}

	task.submitBatchReceiveArticleExcel = function(that, data) {
		var filePath = $("#batchReceiveArticle #excelFile").val();
		if (!filePath || filePath.length == 0) {
			core.warning("请选择文件");
		} else {
			var size = $("#batchReceiveArticle #excelFile")[0].files[0].size;
			// console.log("submitBatchReceiveArticleExcel--->>[size]" + size);
			// 文件大小是否符合要求 20971520
			if (size > 20971520) {
				core.warning("文件大小超出限制，文件不能超过20M");
			} else {
				core.confirm("批量回收稿件?", function() {
					$("#batchReceiveArticle #excelFileForm").ajaxSubmit({
						url : '/daren-web/task/batchReceiveArticleExcel',
						type : "post",
						success : function(data) {
							if (data.status === 0) {
								if (data.result && data.result.length > 0) {
									var rst = "";
									for (var i = 0; i < data.result.length; i++) {
										rst += "<p>" + (i + 1) + ":" + data.result[i] + "</p>";
									}
									core.modal("noticeDiv", noticeTemp());
									$("#noticeMsg").html(rst);
									// core.success("批量导入完成,失败记录如下:"+rst);
								} else {
									core.success("导入成功");
								}
								core.closeModal("batchReceiveArticle");
								window.myTaskListTable.ajax.reload(null, false);
							} else {
								core.failure("导入失败");
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
			}

		}
	}

	task.submitBatchReceiveArticleImgs = function(that, data) {
		var filePath = $("#batchReceiveArticle #imgsFile").val();
		if (!filePath || filePath.length == 0) {
			core.warning("请选择文件");
		} else {
			var size = $("#batchReceiveArticle #imgsFile")[0].files[0].size;
			// console.log("submitBatchReceiveArticleImgs--->>[size]" + size);
			// 文件大小是否符合要求 20971520
			if (size > 20971520) {
				core.warning("文件大小超出限制，文件不能超过20M");
			} else {
				core.confirm("确认上传图片?", function() {
					$("#batchReceiveArticle #imgFileForm").ajaxSubmit({
						url : '/daren-web/task/batchReceiveArticleImgs',
						type : "post",
						success : function(data) {
							if (data.status === 0) {
								if (data.result && data.result.length > 0) {
									var rst = "";
									for (var i = 0; i < data.result.length; i++) {
										rst += "<p>" + (i + 1) + ":" + data.result[i] + "</p>";
									}
									core.modal("noticeDiv", noticeTemp());
									$("#noticeMsg").html(rst);
									// core.success("批量导入完成,失败记录如下:"+rst);
								} else {
									core.success("导入成功");
								}
								core.closeModal("batchReceiveArticle");
								window.myTaskListTable.ajax.reload(null, false);
							} else {
								core.failure("导入失败");
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
			}

		}
	}

	task.mainProductsDetail = function(that) {
		var pid = that.attr("productIds");
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/task/getMainProductsById/" + pid,
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else if (resp.result.length == 0) {
						core.alert("无主推商品");
						core.closeModal("main_products");
					} else {
						return resp.result;
					}
				}
			},
			paging : false
		};

		core.modal("main_products", mainProductsTemp({
			"id" : pid
		}));
		window.mpTable = core.dataTable("tb-main-product-list", tableConfig);
	}

	task.showMainProducts = function(that) {
		var resourceItemId = that.attr("resource_item_id");
		$("#span_MainProduct_" + resourceItemId).toggle(500);
	};
	task.showArticleUrl = function(that) {
		var logId = that.attr("logId");
		$("#span_ArticleUrl_" + logId).toggle(500);
	};
	task.showRemark = function(that) {
		var resourceItemId = that.attr("resource_item_id");
		$("#span_Remark_" + resourceItemId).toggle(500);
	};

	task.taskListSearchExport = function(that, data) {
		var action = "/daren-web/task/taskListSearchExport";
		core.exportAction(that, data, action);
	};
	
	task.taskEffectListSearchExport = function(that, data) {
		var action = "/daren-web/task/taskEffectListSearchExport";
		core.exportAction(that, data, action);
	};
	
	task.mediaSettleTaskListExport = function(that, data) {
		var action = "/daren-web/task/mediaSettleTaskListExport";
		core.exportAction(that, data, action);
	};

	task.smartRollBack = function(that) {
		// todo if need to update plug
		var isforced = $("#smartTip", parent.document).attr("data-isforced");
		// console.log('lllll', isforced, !!isforced);
		// 检查是否更新插件
		if (isforced == 1) {
			var reinstall_plug_wrap = $(".plug-reinstall-win", parent.document);
			reinstall_plug_wrap.find(".window-panel").width(960).height(550).css("margin-left", -480);

			$("#reinstall-download-chrome", parent.document).attr("href", '/daren-web/daren/chrome_download.wb?tk=' + that.attr('data-token') + '&version=1.0')
			reinstall_plug_wrap.fadeIn("fast");
			return;
		}
		// 检查是否更新插件

		var check_plug_wrap = $(".plug-step-win", parent.document);
		check_plug_wrap.find(".window-panel").width(960).height(550).css("margin-left", -480);
		// console.log('isforced', $("#smartTip", parent.document), isforced)
		if (confirm("您即将要进行的是达人【" + that.attr('data-darenname') + "】的智能回填，请确保在淘宝达人创作平台【https://we.taobao.com】已登录该账号。如已登录，请点击确定进行数据智能回填操作")) {
			that.css("cursor", "default");
			that.attr('bind-method', '');

			// check_plug_wrap.find(".title").find(":header").html('插件');
			// check_plug_wrap.fadeIn("fast");
			// $(".plug-step-win .window-panel").focus();
			// mizhu.open('插件');
			var checkNode = $("#my-chrome-extension-installed", parent.document);
			if (checkNode.length > 0) {
				check_plug_wrap.find("#install-alerdy").show();
				check_plug_wrap.find("#install-guide").hide();
				check_plug_wrap.find(".title").find(":header").html('请登录创作平台');

				$("#content-main #lbDarenName", window.parent.document).html(that.attr('data-darenname'));

				check_plug_wrap.find(".window-panel").height(290);
				check_plug_wrap.find("#step-login").addClass("step-current");
				check_plug_wrap.find("#s-step-tip-1").hide();
				check_plug_wrap.find("#s-step-tip-2").show();
				// 在插件content.js页面操作
				var installNode = $("#smartSet", parent.document)[0];
				var eventFromChrome = document.createEvent('Event');
				eventFromChrome.initEvent('EventFromChrome', true, true);

				// 发出事件
				console.log('开始回填数据。。。。')
				installNode.dispatchEvent(eventFromChrome);
			} else {
				// 未安装插件，默认状态
				check_plug_wrap.find(".title").find(":header").html('请先安装插件');
				$("#download-plug", parent.document).attr("href", '/daren-web/daren/daren_plugin_download.wb?tk=' + that.attr('data-token') + '&version=1.0')
				$("#download-chrome", parent.document).attr("href", '/daren-web/daren/chrome_download.wb?tk=' + that.attr('data-token') + '&version=1.0')

				check_plug_wrap.find("#install-alerdy").hide();
				check_plug_wrap.find("#install-guide").show();
				var finish_install_plug_btn = $('#fish-install', parent.document);
				finish_install_plug_btn.on('click', function() {
					window.parent.location.href = '/index.html?pg=smartpage';
				})
			}
			check_plug_wrap.fadeIn("fast");

			var smartSetBtn = $("#smartSet", parent.document);
			smartSetBtn.attr({
				"data-darenname" : that.attr('data-darenname'),
				"data-darenid" : that.attr('data-darenid'),
				"data-token" : that.attr('data-token'),
				"data-sid" : that.attr('data-drid')
			})
			smartSetBtn.trigger("click");
		}

	}

	task.viewAutoTab = function(that) {
		var o = "/page/task/auto_delivery_article.html", m = "/page/task/auto_delivery_article.html", l = "智能回填";
		var p = '<a href="javascript:;" class="active J_menuTab" data-id="' + o + '">' + l + ' <i class="fa fa-times-circle"></i></a>';
		parent.$(".J_menuTab").removeClass("active");
		var n = '<iframe class="J_iframe" name="iframe' + m + '" width="100%" height="100%" src="' + o + '" frameborder="0" data-id="' + o + '" seamless></iframe>';
		parent.$(".J_mainContent").find("iframe.J_iframe").hide().parents(".J_mainContent").append(n);
		parent.$(".J_menuTabs .page-tabs-content").append(p);
		// core.genTab(parent.$(".J_menuTab.active"));
	}

	task.openBatchDarenSettlementApplyModal = function() {
		core.modal("batchImportInvoice", batchImportInvoiceTemp());
	}

	function getSelectDrFee(tableId) {
		var DrFeeAmt = 0;
		$("#" + tableId + " tr").each(function() {
			var that = $(this);
			that.find("input[id^='check_']").each(function() {
				if ($(this).is(':checked')) {
					var drFee = $(this).attr("drFee");
					DrFeeAmt += Number(drFee);
				}
			});
		});
		// console.log("getSelectIds--->>[ids]"+JSON.stringify(ids));
		return DrFeeAmt;
	}

	function getSelectIds() {
		return core.getSelectIds(pageTable.id);
	}

	function checkAllClick(cb) {
		core.checkAllClick(cb, pageTable.id, true);
	}

	

	task.openDropzoneModal = function(that){
//		core.modal("dropzone_modal", dropzoneDemoTemp());
		var option = {
			url : "/daren-web/upload/uploadSingle", // 上传地址
			addRemoveLinks : "dictRemoveFile",
			maxFiles : 10,
			maxFilesize : 512,
			uploadMultiple : false,
			parallelUploads : 100,
			previewsContainer : "#imgs_show",
			acceptedFiles : ".png,.gif,.jpg,.xlsx",
			success : function(file, response, e) {
				console.log(file);
				console.log(response);
			}
		};
		
		var deliveryArticleDropzone = $("#deliveryArticleDropzone").dropzone({
			addRemoveLinks:true,
			previewsContainer : "#imgs_show",
			dictRemoveFile : "删除",
			
			maxFiles:10,//一次性上传的文件数量上限
	        maxFilesize: 20, //MB
	        acceptedFiles: ".jpg,.gif,.png", //上传的类型
	        parallelUploads: 3,
	        dictMaxFilesExceeded: "您最多只能上传10个文件！",
	        dictResponseError: '文件上传失败!',
	        dictInvalidFileType: "你不能上传该类型文件,文件类型只能是*.jpg,*.gif,*.png",
	        dictFallbackMessage:"浏览器不受支持",
	        dictFileTooBig:"文件过大上传文件最大支持.",
			
			success : function(file, response, e) {
				$.extend(file, {
					response:response,
					uniqueMark:new Date().getTime()
				});
				var imgs = JSON.parse($("#img_input").val());
				imgs.push({
					key:file.uniqueMark,
					url:file.response.result
				});
				$("#img_input").val(JSON.stringify(imgs));
			},
			init: function() {
				var newImgs = new Array();
				if(echoimgarr == undefined) {
					echoimgarr = [];
				}
				for (var i = 0; i < echoimgarr.length; i++) {
					if(dataUtil.isNotEmpty(echoimgarr[i])){
						this.on("removedfile", function(file) {
							var imgs = JSON.parse($("#img_input").val());
							var newImgs = new Array();
		
							$.each(imgs, function(index, that) {
								if (that.key == file.uniqueMark)
									return true;
								newImgs.push(that);
							});
		
							$("#img_input").val(JSON.stringify(newImgs));
						});
						
						//回显图片
						var dropzoneObj = this;
						var mockFile = {
							name : "回显图片", // 需要显示给用户的图片名
							type : '.gif,.jpg,.png,.jpeg',// 图片文件类型
							uniqueMark : new Date().getTime()+Math.random(),
							accepted : true
						};
						task.imgsecho(dropzoneObj,mockFile,echoimgarr[i]);
						
						var existingFileCount = 1;
						dropzoneObj.options.maxFiles = dropzoneObj.options.maxFiles - existingFileCount;
						
						
						newImgs.push({
							key:mockFile.uniqueMark,
							url:echoimgarr[i]
						});
					}
				}
				$("#img_input").val(JSON.stringify(newImgs));
			}
		});
	}

	
	task.imgsecho = function(dropzoneObj,mockFile,url) {
		dropzoneObj.emit("addedfile", mockFile);
		dropzoneObj.emit("thumbnail", mockFile, url);
		dropzoneObj.emit("complete", mockFile);
	}
	// 文件上传
	task.openJquploadDemoModal = function(that) {
		core.modal("jq_upload_demo_modal", jqueryUploadDemoTemp());
		$("#file-0d").fileinput({
			language : 'zh', // 设置语言
			uploadUrl : "/daren-web/upload/uploadSingle", // 上传的地址
			allowedFileExtensions : [ 'jpg', 'gif', 'png' ],// 接收的文件后缀
			showUpload : false, // 是否显示上传按钮
			showCaption : true,// 是否显示标题
			browseClass : "btn btn-primary", // 按钮样式
			// dropZoneEnabled: false,//是否显示拖拽区域
			// minImageWidth: 50, //图片的最小宽度
			// minImageHeight: 50,//图片的最小高度
			// maxImageWidth: 1000,//图片的最大宽度
			// maxImageHeight: 1000,//图片的最大高度
			// maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
			// minFileCount: 0,
			maxFileCount : 10, // 表示允许同时上传的最大文件个数
			enctype : 'multipart/form-data',
			validateInitialCount : true,
			previewFileIcon : "<i class='glyphicon glyphicon-king'></i>",
			msgFilesTooMany : "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
		}).on("filebatchselected", function(event, files) {
			$(this).fileinput("upload");
		}).on('fileuploaded', function(event, data, previewId, index) {
			var urls = $("#urlArray").val();
			var urlArray = new Array();
			if(dataUtil.isNotEmpty(urls)){
				urlArray = JSON.parse(urls);
			}
			urlArray.push(data.response.result);
			$("#urlArray").val(JSON.stringify(urlArray));
		}).on('fileremoved', function(event, id, index) {
			var urls = $("#urlArray").val();
			var urlArray = JSON.parse(urls);
			urlArray.splice(index,1);
			$("#urlArray").val(JSON.stringify(urlArray));
		});
	}	
	
	
/*	*************************/
	
	task.openDropzoneModalEffetc = function(that){
//		core.modal("dropzone_modal", dropzoneDemoTemp());
		var option = {
			url : "/daren-web/upload/uploadSingle", // 上传地址
			addRemoveLinks : "dictRemoveFile",
			maxFiles : 10,
			maxFilesize : 512,
			uploadMultiple : false,
			parallelUploads : 100,
			previewsContainer : "#imgs_show_effetc",
			acceptedFiles : ".png,.gif,.jpg,.xlsx",
			success : function(file, response, e) {
				console.log(file);
				console.log(response);
			}
		};
		
		var demoDropzone = $("#demoDropzoneEffetc").dropzone({
			addRemoveLinks:true,
			previewsContainer : "#imgs_show_effetc",
			dictRemoveFile : "删除",
			
			maxFiles:10,//一次性上传的文件数量上限
	        maxFilesize: 20, //MB
	        acceptedFiles: ".jpg,.gif,.png", //上传的类型
	        parallelUploads: 3,
	        dictMaxFilesExceeded: "您最多只能上传10个文件！",
	        dictResponseError: '文件上传失败!',
	        dictInvalidFileType: "你不能上传该类型文件,文件类型只能是*.jpg,*.gif,*.png",
	        dictFallbackMessage:"浏览器不受支持",
	        dictFileTooBig:"文件过大上传文件最大支持.",
			
			success : function(file, response, e) {
				$.extend(file, {
					response:response,
					uniqueMark:new Date().getTime()
				});
				var imgs = JSON.parse($("#img_input_effetc").val());
				imgs.push({
					key:file.uniqueMark,
					url:file.response.result
				});
				$("#img_input_effetc").val(JSON.stringify(imgs));
			},
			init: function() {
				var newImgs = new Array();
				for (var i = 0; i < imgeffect.length; i++) {
					if(dataUtil.isNotEmpty(imgeffect[i])){
						this.on("removedfile", function(file) {
							var imgs = JSON.parse($("#img_input_effetc").val());
							var newImgs = new Array();
		
							$.each(imgs, function(index, that) {
								if (that.key == file.uniqueMark)
									return true;
								newImgs.push(that);
							});
		
							$("#img_input_effetc").val(JSON.stringify(newImgs));
						});
						
						//回显图片
						var dropzoneObj = this;
						var mockFile = {
							name : "", // 需要显示给用户的图片名
							type : '.gif,.jpg,.png,.jpeg',// 图片文件类型
							uniqueMark : new Date().getTime()+Math.random(),
							accepted : true,
							size : "1024"
						};
		
						task.imgseffectecho(dropzoneObj,mockFile,imgeffect[i]);
						
						var existingFileCount = 1;
						dropzoneObj.options.maxFiles = dropzoneObj.options.maxFiles - existingFileCount;
						
						
						newImgs.push({
							key:mockFile.uniqueMark,
							url:imgeffect[i]
						});
					}
				}
				$("#img_input_effetc").val(JSON.stringify(newImgs));
				
			}
		});
	}

	task.imgseffectecho = function(dropzoneObj,mockFile,url) {
		dropzoneObj.emit("addedfile", mockFile);
		dropzoneObj.emit("thumbnail", mockFile, url);
		dropzoneObj.emit("complete", mockFile);
	}
	

	
	
	return task;
});