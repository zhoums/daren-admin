define(function (require) {
	'use strict';
	var core = require("core");
	var api = require("api");
	var jqxBaseFramework = window.minQuery || window.jQuery || jQuery;
	window.jqxBaseFramework = jqxBaseFramework;
	window.jQuery = jQuery;
	window.minQuery = jQuery;
	require("bootstrap-multiselect");
	require("jqxcore");
	require("jqxdata");
	require("jqxbuttons");
	require("jqxscrollbar");
	require("jqxdatatable");
	require("jqxtreegrid");
	require("jqxmenu");
	require("select2");
	require("common/es6-promise");
	var cache = require("cache");
	var layer = require("layer"); 
	var task = require("page/task"); 
	var dataUtil = require("common/data");
	
	var mediaRegInfoTemp = require("templates/daren/media_reg_info");
    var taskDetailTemp = require("templates/task/task_detail");
    var taskResourceListTemp = require("templates/task/task_resource_list");
    var checkChromeTemp = require("templates/admin/check_chrome");
	
	var dict;
	function admin() {

	}
	
	// 提交达人结算申请
    admin.submitDarenSettlementApplyModal = function(that, data) {
    	var sim = $(that).data("sim");
    	
    	var principalInfo = {};
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
		
		data.drFeeAmt = data.drFeeAmt || 0.0;
		
		confirmMsg = confirmMsg.replace("applyAmt", parseFloat(data.drFeeAmt).toFixed(2));
		
		var taskId = that.attr("taskId");
		core.confirm(confirmMsg, function() {
			core.ajax({
				url : "/daren-web/task/settle/dr_apply_settle",
				data : data,
				type : "post",
				success : function(resp) {
					core.success("申请成功");
					core.closeModal("dr_settle_apply");
					var tag = $("#waitSettle");
					if (tag) 
						$("#waitSettle")[0].click();
				}
			});
		});
	};

	/**
	 * 模块方法入口
	 */
	admin.init = function (page,data) {
    	dict = data.dict; 
    	$("#cbCheckAll").click(function() {
			checkAllClick($(this));
		});
		if(page === "login") {
			$.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
			$.browser.vendor = /google/.test(navigator.vendor.toLowerCase());
		    if (!$.browser.chrome || !$.browser.vendor) { 
//		        core.warning("当前浏览器不是谷歌Chrome浏览器，必须使用谷歌Chrome浏览器！");
		    	core.modal("check_chrome", checkChromeTemp());
		    }
//			if(core.getAccountInfo()){
//				location.href = "index.html";
//			}
		    
		    // 账号输入框失去焦点
			$(".showCaptcha").on("blur", function(event){
				var account = $("#account").val();
				
				if(dataUtil.isNotEmpty(account)){
					core.ajax({
		                url: "/daren-web/rbac/isShowCaptcha",
		                async: false,
		                type: "post",
		                data:{
		                	account : account
		                },
		                success: function(resp) {
		                	var data = resp.result;
		                	if(data == "error"){
		                		$('#captchaShow').css('display', 'block');
		                		$("#loginbut").attr("captId", 2);
		                	}else{
		                		$('#captchaShow').css('display', 'none');
		                		$("#loginbut").attr("captId", 1);
		                	}
		                }
		        	});
				}else{
					$('#captchaShow').css('display', 'none');
            		$("#loginbut").attr("captId", 1);
				}
			});
		    
			$("#login_captcha_img").on("click",function(event){ 
        		$(this).attr("src",$(this).attr("src"))
        	});
        	$("#forget_captcha_img").on("click",function(event){
        		$(this).attr("src",$(this).attr("src"))
        	});
			core.listenClick();
		} else if(page == "home"){
		    /*
		    core.ajax({
	                url: "/daren-web/daren/mediaPrincipalInfoIsPerfect",
	                type:"post",
	                success: function(resp) {
	                    if(resp.result.isPerfect == 0){
	                	core.modal("media_reg_info_modal",mediaRegInfoTemp(resp.result.pinfo));
				core.setDic("add_dr_payee_bank", dict.BANK,resp.result.paymentPayeeBank);     
				core.setDic("add_or_edit_invoice_type", dict.SETTLEMENT_INVOICE_TYPE,resp.result.pinfo.paymentInvoiceType);
				core.setDic("add_or_edit_settlement_period", dict.SETTLEMENT_PERIOD,resp.result.pinfo.paymentSettlePeriod);    
				core.setDic("add_or_edit_settlement_method", dict.SETTLEMENT_METHOD,resp.result.pinfo.paymentSettleMethod);
				$("#add_dr_payee_bank").prepend("<option value='0'>请选择</option>");
	                    }
	                }
	            }); 
		    */
		    /*
	            core.ajax({
	                url: "/daren-web/daren/getCurrentUserRegInfo",
	                type:"post",
	                success: function(resp) {
	                    core.modal("media_reg_info_modal",mediaRegInfoTemp(resp.result));
			    core.setDic("add_dr_payee_bank", dict.BANK,resp.result.paymentPayeeBank);     
			    core.setDic("add_or_edit_invoice_type", dict.SETTLEMENT_INVOICE_TYPE,resp.result.paymentInvoiceType);
			    core.setDic("add_or_edit_settlement_period", dict.SETTLEMENT_PERIOD,resp.result.paymentSettlePeriod);    
			    core.setDic("add_or_edit_settlement_method", dict.SETTLEMENT_METHOD,resp.result.paymentSettleMethod);
			    $("#add_dr_payee_bank").prepend("<option value='0'>请选择</option>");
	                }
	            }); 
	            */
	    	$(".row").attr("style","display:block");
        	core.selectDrByUserId("searchDrId");
        	core.selectAeByUserId("searchAeId");
        	task.publicAccountInfoList(dict);
        	adminTooltip();
    		$("#infoViewExport").hide();
		}
	};
	
	function checkAllClick(cb) {
		core.checkAllClick(cb, "tb-dr-task-list", true);
	}
	function getSelectIds() {
		return core.getSelectIds("tb-dr-task-list");
	}
	
	/** 开票begin **/
	var financeBillingInvoiceTemp = require("templates/task/finance_billing_invoice");
	
	function getSelectedTaskIds(){
		var ids = [];
		$("#selectedTaskArray .del-item").each(function(){
			var that = this;
			ids.push($(that).data("tid"));
		});
		return ids.join(",");
	}
	
	function getTaskCfmTotalAmt(taskIds){
		var taskTotalAmt = 0;
		core.ajax({
			url : "/daren-web/task/getTaskCfmTotalAmt",
			async : false,
			data : {ids:taskIds},
			success : function(resp) {
				taskTotalAmt = resp.result.toFixed(2);
			}
		});
		return taskTotalAmt;
	}
	
	admin.addInvoiceTask = function(that){
		var taskId = $(that).siblings("#addTaskInput").val();
		var selectedTaskIds = getSelectedTaskIds().split(",");
		if(dataUtil.isEmpty(taskId))
			return;
		if($.inArray(taskId,selectedTaskIds) > -1){
			core.warning("任务已存在");
			return;
		}
		var item = $('<a class="btn del-item" href="javascript:;" role="button" data-tid="'+taskId+'" >'+taskId+'<font class="d-btn">X</font></a>');
		$("#finance_billing_invoice_modal #selectedTaskArray").append(item);
		$("#finance_billing_invoice_modal #taskTotalAmt").val(getTaskCfmTotalAmt(getSelectedTaskIds()));
	}
	
	admin.financeBillingInvoiceModal = function(that){
		
		var selectIds = getSelectIds();
		var invoiceTitleInfo = {};
		var taskIds = "";
		var taskTotalAmt = 0;
		var invoiceNum = "";
		var invoiceId = 0;
		var invoiceFiles = [];
		var type;
		var courierCompany = "";
		var waybillNumber = "";
		
		var tag = that.attr("tag");
		if (!selectIds || selectIds.length == 0) {
			core.warning("没有选中任何记录");
			return;
		}
		
		var isUpdate = $(that).data("update");
		if(isUpdate){
			if(selectIds.length > 1){
				core.warning("“修改发票”只需选择其中一项即可进行修改");
				return;
			}
			var noNext = false;
			core.ajax({
				url : "/daren-web/task/getFinanceInvoiceDetailByTask",
				async : false,
				data : {
					taskId:selectIds[0]
				},
				success : function(resp) {
					if(resp.result.error){
						core.failure(resp.result.msg,function(){});
						noNext = true;
						return;
					}
					
					selectIds = [];
					$.each(resp.result.detail,function(idx,item){
						selectIds.push(item.taskId);
					});
					taskIds = selectIds.join(",");
					
					var files = resp.result.invoice.invoiceFile.split(",");
					
					$.each(files,function(){
						var fileObj = {};
						var str = this;
						fileObj.url = str;
						
			            var fileSuffix = str.substring(str.lastIndexOf("."),str.length);
			            var imgSuffixs = [".png",".jpg",".gif",".jpeg"];
			            if($.inArray(fileSuffix.toLowerCase(), imgSuffixs)>-1){
			            	fileObj.isImg = 1;
			            }else{
			            	fileObj.isImg = 2;
			            }
			            invoiceFiles.push(fileObj);
					});
					
					taskTotalAmt = resp.result.invoice.invoiceAmt;
					invoiceNum = resp.result.invoice.invoiceNum;
					invoiceId = resp.result.invoice.id;
					type = resp.result.invoice.type;
					courierCompany = resp.result.invoice.courierCompany;
					waybillNumber = resp.result.invoice.waybillNumber;
				}
			});
			
			if(noNext)
				return;
			
		}else{
			taskIds = selectIds.join(",");
			taskTotalAmt = getTaskCfmTotalAmt(taskIds);
		}
		
		var principalInfo = {};
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
		$.extend(invoiceTitleInfo,{
			companyName:principalInfo.companyName,
			taxpayerId:principalInfo.taxpayerId,
			companyAddr:principalInfo.companyAddr,  
			companyPhone:principalInfo.companyPhone, 
			bankName:principalInfo.bankName,     
			bankAccount:principalInfo.bankAccount  
		});
		
		core.modal("finance_billing_invoice_modal",financeBillingInvoiceTemp({
			"taskIdArray":selectIds,
			"taskTotalAmt":taskTotalAmt,
			"invoiceTitleInfo":invoiceTitleInfo,
			"invoiceNum":invoiceNum,
			"invoiceId":invoiceId,
			"invoiceFile":invoiceFiles,
			"type" : type,
			"courierCompany" : courierCompany,
			"waybillNumber" : waybillNumber,
			"tag" : tag
		}));
		
		core.selectWaitInvoiceTask("addTaskInput");
		
		$("#finance_billing_invoice_modal").on("click","[name=type]",function(){
			var type = parseInt($(this).val());
			if(type == 1){
				$("#finance_billing_invoice_modal .invoice_type_1").show();
				$("#finance_billing_invoice_modal .invoice_type_2").hide();
			}
			if(type == 2){
				$("#finance_billing_invoice_modal .invoice_type_2").show();
				$("#finance_billing_invoice_modal .invoice_type_1").hide();
			}
		});
		$("#selectedTaskArray").on("click",".d-btn",function(){
			var that = this;
			$(that).parents(".del-item").remove();
			$("#finance_billing_invoice_modal #taskTotalAmt").val(getTaskCfmTotalAmt(getSelectedTaskIds()));
		});
		
		if(dataUtil.isNotEmpty(type+"")){
			$("#finance_billing_invoice_modal [name=type][value="+type+"]").click();
		}
	}
	
	admin.submitInvoiceFile = function() {
		core.uploadFileExtend("add_invoice_file", "invoiceFileForm", "invoiceFileWrapper");
	};
	
	admin.submitFinanceInvoiceBatch = function(that,data){
		var tag = that.attr("tag");
		
		if(dataUtil.isEmpty(data.invoiceNum)){
			core.warning('请输入发票号码');
			return;
		}
		if(dataUtil.isEmpty(data.invoiceAmt)){
			core.warning('请输入发票金额');
			return;
		}
		if(dataUtil.isEmpty(data.type)){
			core.warning('请选择发票类型');
			return;
		}
		var image = [];
		$('#invoiceFileWrapper li').map(function(index, target) {
			image.push($(target).find('img').attr('f'));
		});
		if(data.type == 1){
			if(image.length == 0){
				core.warning('电子发票，请上传附件');
				return;
			}
		}
		if(data.type == 2){
			if(dataUtil.isEmpty(data.courierCompany)){
				core.warning('纸质发票，请填写快递公司');
				return;
			}
			if(dataUtil.isEmpty(data.waybillNumber)){
				core.warning('纸质发票，请填写快递单号');
				return;
			}
		}
		$.extend(data,{
			invoiceFile:image.join(",")
		});
		
		var jsonParam = {};
		$.extend(jsonParam,{
			"ids":getSelectedTaskIds(),
			"param":data
		});
		
		core.ajax({
			url : "/daren-web/task/darenTaskBilling",
			data : {
				'jsonParam':JSON.stringify(jsonParam)
			},
			type : "post",
			success : function(resp) {
				core.success("申请成功",function(){
					core.closeModal("finance_billing_invoice_modal");
					if (tag == "waitInvoice") {
						if ($("#waitInvoice"))
							$("#waitInvoice")[0].click();
					} 
				});
			}
		});
	}
	/** 开票end **/
	
	admin.drTaskListSearch = function(that, data){
		
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(0);
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	admin.mainProductsDetail = function(that){
		task.mainProductsDetail(that);
    }
	admin.taskDetail = function(that){
		var dic = dict;
		task.taskDetail(that,dic);
	}
	admin.getAutoDeliveryArticle = function(that){
		var dic = dict;
		task.getAutoDeliveryArticle(that,dic);
	}
	admin.waitDeliveryArticle = function(that, data){
		$("#waitDeliveryArticle").attr("style","background:#ec5fff");
		
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		$("#settledTask").attr("style","background:#f5b0ff");
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(1);
		$("#SettleAuditStatus").hide();
		$("#infoViewExport").show();
    	task.drTaskListSearch(that, data);
    }
	admin.waitAuditArticle = function(that, data){
		$("#waitAuditArticle").attr("style","background:#ec5fff");	

		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		$("#settledTask").attr("style","background:#f5b0ff");
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(2);
		$("#SettleAuditStatus").hide();
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	admin.waitEntryEffect = function(that, data){
		$("#waitEntryEffect").attr("style","background:#ec5fff");	

		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		$("#settledTask").attr("style","background:#f5b0ff");
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(3);
		$("#SettleAuditStatus").hide();
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	admin.waitAuditEffect = function(that, data){
		$("#waitAuditEffect").attr("style","background:#ec5fff");	

		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		$("#settledTask").attr("style","background:#f5b0ff");
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(4);
		$("#SettleAuditStatus").hide();
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	admin.waitSettle = function(that, data){
		$("#waitSettle").attr("style","background:#ec5fff");

		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		$("#settledTask").attr("style","background:#f5b0ff");
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(5);
		$("#SettleAuditStatus").hide();
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	admin.waitAuditSettle = function(that, data){
		$("#waitAuditSettle").attr("style","background:#ec5fff");

		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#settledTask").attr("style","background:#f5b0ff");
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(6);
		$("#SettleAuditStatus").hide();
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	admin.settledTask = function(that, data){
		$("#settledTask").attr("style","background:#ec5fff");

		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(7);
		$("#SettleAuditStatus").hide();
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	admin.settleAudit = function(that, data){
		$("#settleAudit").attr("style","background:#ec5fff");

		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		$("#settledTask").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		
		$("#searchByWhat").val(8);
		$("#SettleAuditStatus").show();
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	admin.waitInvoice = function(that, data){
		$("#waitInvoice").attr("style","background:#ec5fff");

		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#settledTask").attr("style","background:#f5b0ff");
		$("#invoiceAudit").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(9);
		$("#SettleAuditStatus").hide();
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	admin.invoiceAudit = function(that, data){
		$("#invoiceAudit").attr("style","background:#ec5fff");

		$("#waitAuditEffect").attr("style","background:#f5b0ff");	
		$("#waitEntryEffect").attr("style","background:#f5b0ff");	
		$("#waitAuditArticle").attr("style","background:#f5b0ff");	
		$("#waitDeliveryArticle").attr("style","background:#f5b0ff");
		$("#waitSettle").attr("style","background:#f5b0ff");
		$("#waitAuditSettle").attr("style","background:#f5b0ff");
		$("#settleAudit").attr("style","background:#f5b0ff");
		$("#waitInvoice").attr("style","background:#f5b0ff");
		$("#settledTask").attr("style","background:#f5b0ff");
		
		$("#searchByWhat").val(10);
		$("#SettleAuditStatus").hide();
		$("#infoViewExport").hide();
    	task.drTaskListSearch(that, data);
    }
	
	
	
	admin.deliveryArticle = function(that){
		var dic = dict;
		task.deliveryArticle(that,dic);
	}
	admin.submitDeliveryArticle = function(that, data){
		task.submitDeliveryArticle(that, data);
	}
	admin.submitImages = function(){
		task.submitImages();
	}
	admin.entryEffect = function(that){
		var dic = dict;
		task.entryEffect(that,dic);
	}
	admin.autoTaskList = function(that){
		var dic = dict;
		task.autoTaskList(that,dic);
	}
	admin.lastAutoTask = function(that){
		var dic = dict;
		task.lastAutoTask(that,dic);
	}
	admin.openDarenSettlementApplyModal = function(that){
		var dic = dict;
		var data = [];
		data.drsmethod = that.attr("drsmethod");
		$.extend(data,{
			dict:dict
		})
		task.openDarenSettlementApplyModal(that,data);
	}
	admin.submitEntryEffect = function(that, data){
		task.submitEntryEffect(that, data);
	}
	admin.submitEffectImages = function(){
		task.submitEffectImages();
	}
	admin.submitArticleImages = function(){
		task.submitArticleImages();
	}
	admin.showMainProducts = function(that){
		task.showMainProducts(that);
	}
	admin.showRemark = function(that){
		task.showRemark(that);
	}
	admin.showArticleUrl = function(that){
		task.showArticleUrl(that);
	}
	admin.viewAutoTab = function(that) { 
		var o = "/page/task/auto_delivery_article.html",
		m = "/page/task/auto_delivery_article.html",
		l = "智能回填";
		var p = '<a href="javascript:;" class="active J_menuTab" data-id="' + o + '">' + l + ' <i class="fa fa-times-circle"></i></a>';
		parent.$(".J_menuTab").removeClass("active");
		var n = '<iframe class="J_iframe" name="iframe' + m + '" width="100%" height="100%" src="' + o + '" frameborder="0" data-id="' + o + '" seamless></iframe>';
		parent.$(".J_mainContent").find("iframe.J_iframe").hide().parents(".J_mainContent").append(n);
		parent.$(".J_menuTabs .page-tabs-content").append(p);
//		core.genTab(parent.$(".J_menuTab.active"));
	}
	admin.waitDeliveryArticleExport = function(that,data){
		task.waitDeliveryArticleExport(that,data); 
	}
	admin.financeTaskCfmDetailModal = function(that,data){
		task.financeTaskCfmDetailModal(that);
	}
	admin.agreeFinanceTaskCfm = function(that,data){
		task.agreeFinanceTaskCfm(that);
	}
	admin.agreeFinanceTaskCfmFail = function(that,data){
		task.agreeFinanceTaskCfmFail(that);
	}
	
	
	admin.initContextMenu = function () {
		var contextMenu = $("#Menu").jqxMenu({
			width: 200,
			height: 87,
			autoOpenPopup: false,
			mode: 'popup'
		});
		$("#treeGrid").on('contextmenu', function () {
			return true;
		});
		$("#treeGrid").on('rowClick', function (event) {
			var args = event.args;
			if (args.originalEvent.button == 2) {
				var scrollTop = $(window).scrollTop();
				var scrollLeft = $(window).scrollLeft();
				contextMenu.jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
				return false;
			}
		});
		$("#Menu").on('itemclick', function (event) {
			var args = event.args;
			$('#perm-submit').unbind();
			$('#perm-form-reset').click();
			$('#perm-modal .modal-header h3').text(jQuery.trim($(args).text()));

			var selection = $("#treeGrid").jqxTreeGrid('getSelection');
			var rowid = selection[0].uid
			if (jQuery.trim($(args).text()) == "添加子节点") {
				$('#parent_name').text(selection[0].name);
				$('#pId').val(selection[0].id);
				$('#perm-modal').modal('show');
				$('#perm-submit').bind('click', addPerm);
			} else if (jQuery.trim($(args).text()) == "编辑节点") {
				if (!selection[0].pId) {
					core.warning('不能编辑根节点');
					return;
				}
				$('#pId').val(selection[0].pId);
				var rows = $("#treeGrid").jqxTreeGrid('getRows');
				for (var x in rows) {
					if (rows[x].id == selection[0].pId) {
						$('#parent_name').val(rows[x].name);
						break;
					}
				}
				$('#id').val(selection[0].id);
				$('#name').val(selection[0].name);
				$("#type").val(selection[0].type);
				$("#type").multiselect("refresh");
				$('#url').val(selection[0].url);
				$('#icon').val(selection[0].icon);
				$('#rank').val(selection[0].rank);
				$('#perm-modal').modal('show');
				$('#perm-submit').bind('click', updatePerm);
			} else if (jQuery.trim($(args).text()) == '删除节点') {
				if (!selection[0].pId) {
					layer.msg("不能删除根节点");
					return;
				}
				delPerm(selection[0].id);
			}
		});

		$('.multiselect').multiselect({
			buttonClass: 'btn btn-white btn-primary',
			templates: {
				button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"></button>',
				ul: '<ul class="multiselect-container dropdown-menu"></ul>',
				li: '<li><a href="javascript:void(0);"><label></label></a></li>',
				divider: '<li class="multiselect-item divider"></li>',
				liGroup: '<li class="multiselect-item group"><label class="multiselect-group"></label></li>'
			},
			onChange: function (element, checked) {
				alert(1)
			}
		});

		$('#perm-modal').on('show.bs.modal', function () {
			$('#type').multiselect('refresh');
			switch (parseInt($('#type').val())) {
			case 1:
				$('#rank').closest('.form-group').show()
				break;
			default:
				$('#rank').closest('.form-group').hide()
			}
		});
		$('#type').multiselect({
			onChange: function (element, checked) {
				switch (parseInt($('#type').val())) {
				case 1:
					$('#rank').closest('.form-group').show()
					break;
				default:
					$('#rank').closest('.form-group').hide()
				}
			}
		});
	}
	
	admin.submitMediaRegInfo = function(that,data){
	    var rtype = parseInt($(that).data("rtype"));
	    var url;
	    if(rtype==1){
		url = "/daren-web/daren/submitMediaRegInfoAuditForBasic";
	    }
            if(rtype==2){
        	url = "/daren-web/daren/submitMediaRegInfoAuditForContactMethod";	
            }
            if(rtype==3){
        	url = "/daren-web/daren/submitMediaRegInfoAuditForSettMethod";
        	if(data.paymentSettleMethod == 1){
        	    if(dataUtil.isEmpty(data.paymentPayeeVAccount)){
        		core.warning("V账号 不能为空");
        		return;
        	    }
        	}else{
        	    if(dataUtil.isEmpty(data.paymentPayeeName)){
        		core.warning("收款人姓名 不能为空");
        		return;
        	    }
        	    if(dataUtil.isEmpty(data.paymentPayeeBankAccount)){
        		core.warning("收款人银行卡号 不能为空");
        		return;
        	    }
        	    if(dataUtil.isEmpty(data.paymentPayeeBank)||data.paymentPayeeBank == 0){
        		core.warning("开户银行 不能为空");
        		return;
        	    }
        	    if(dataUtil.isEmpty(data.paymentPayeeBankBranch)){
        		core.warning("开户支行 不能为空");
        		return;
        	    }
        	}
        	
            }
            core.ajax({
                url: url,
                type:"post",
                data: data,
                success: function(resp) {
                    core.success("操作成功");
                }
            });
	}
    
	
	admin.forgetPwd = function (that) { 
		$("#forget_password").modal("show");
//		document.getElementById("forget-password-form").reset(); 
		$("#forget-password-form #forgetEmail").val("");
		$("#forget-password-form #foget_captcha").val("");
		$("#forget-password-form #forget_captcha_img").click();
	}
	
	admin.submitForgetPassword = function(that, data) {
		//发送忘记密码邮件 
		core.ajax({
			url: "/daren-web/rbac/forgetPwd.wb",
			data:data, 
			type: "post",
			success: function(resp) {
//				console.log(JSON.stringify(resp));
				if(resp.status==0) {
					core.alert("已发送验证码到登录邮箱！");
					$("#forget_password").modal("hide");
					$("#forget_password_verify").modal("show");
					document.getElementById("forget-password-verify-form").reset(); 
//					core.success(resp.result);
				}				
			}
		})
	}

	admin.submitForgetPasswordVerify = function(that, data) {
		var newPassword = $("#newPassword").val();
		var rePassword = $("#rePassword").val();
    	var regx =/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,}$/;
		if(rePassword!=newPassword) {
			core.warning("两次输入密码不相同");
		}else if(newPassword.length<6){
    		core.warning("密码长度不小于6位!");
    	}else if(newPassword.match(regx)==null){
    		core.warning("密码必须同时包含字母和数字!");
    	} else {
			core.ajax({
				url: "/daren-web/rbac/verify.wb", 
				type: "post",
				data:data,
				success: function(resp) {
					if(resp.status==0) {
						$("#forget_password_verify").modal("hide");
						core.alert("重置密码成功，请重新登录");						
					}
				}
			})
		}
		
	}

	admin.login = function (that) {
		
		
		var account = $("#account").val() || '';
		if (account === '') {
			core.warning("请输入用户名", function () {
				$("#account").focus();
			});
			return;
		}
		var password = $("#password").val() || '';
		if (password === '') {
			core.warning("密码不能为空", function () {
				$("#password").focus();
			});
			return;
		}
		
		var captid = that.attr("captid");
		if(captid == 2){
			var captcha = $("#captcha").val() || '';
			if (captcha === '') {
				core.warning("验证码不能为空", function () {
					$("#captcha").focus();
				});
				return;
			}
		}
		
		var data = {
			account: account,
			password: password,
			captcha:captcha
		};
		var ajaxParam = {
			data: data,
			url: "/daren-web/rbac/login.wb",
			type: "post"
		};
		
//		var csrc = $("#login_captcha_img").attr("src"); 
//		$("#login_captcha_img").attr("src",csrc);
        	core.ajax({
        	    data : data,
        	    url : "/daren-web/rbac/login.wb",
        	    type : "post",
        	    async : false,
        	    success : function(jsonResult) {
        	    	if (jsonResult.result === 1130) {
            		    core.failure("验证码错误", function () {
            		    	$("#login_captcha_img").click();
            			});
            		    return;
            		}
        	    	
	        		if (jsonResult.status === 0) {
	        		    var user = jsonResult.result.data1;
	        		    var roles = jsonResult.result.data2 || [];
	        		    user.roles = roles;
	        		    cache.clearCache();
	        		    cache.setAccountInfo(user);
	        		    document.cookie="logincount="+0;
	        		    $.when(cache.initCaches(user.account)).done(function(done) {
	        			location.href = "index.html";
	        		    });
	        		} else if (jsonResult.status === 1100) {
	        		    $("#first_time_login_reset_pwd").modal("show");
	        		    $("#first_time_login_reset_pwd [name=token]").val(jsonResult.msg);
	        		}else {
	        		    core.failure("登录失败");
	        		}
        	    	}
        	});

	};
	

    	admin.submitFirstTimeLoginResetPwd = function(that, data) {
        	var newPassword = data.password;
        	var rePassword = data.rePassword;
        	var regx =/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,}$/;
        	if (rePassword != newPassword) {
        	    core.warning("两次输入密码不相同!");
        	}else if(newPassword.length<6){
        		core.warning("密码长度不小于6位!");
        	}else if(newPassword.match(regx)==null){
        		core.warning("密码必须同时包含字母和数字!");
        	}else {
        	    core.ajax({
        		url : "/daren-web/rbac/user/resetPwd",
        		type : "post",
        		data : data,
        		success : function(resp) {
        		    if (resp.status == 0) {
        			$("#first_time_login_reset_pwd").modal("hide");
        			core.alert("重置密码成功，请重新登录");
        			$("#login-form #password").val("");
        			$("#login-form #captcha").val("");
        			$("#login_captcha_img").click();
        		    }
        		}
        	    })
        	}
        }
	
        function adminTooltip(){ 
            $('[data-toggle="tooltip"]').tooltip();  
        }
    	
    	
	return admin;

});