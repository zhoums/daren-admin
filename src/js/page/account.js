/**
 * 
 */

define(function(require) {
	'use strict';
	var core = require("core");
	var api = require("api");
	jQuery.browser = {};
	jQuery.browser.msie = false;
	jQuery.browser.version = 0;
	if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
		jQuery.browser.msie = true;
		jQuery.browser.version = RegExp.$1;
	}
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
	var cache = require("cache");
	var layer = require("layer");
	var dataUtil = require("common/data");

	var addSubAccountTemp = require("templates/account/add_sub_account");
	var editSubAccountTemp = require("templates/account/edit_sub_account");

	var dict;
	function account() {

	}

	account.init = function(page, data) {
		dict = data.dict;
		if (page === "account_list") {
			getAccountPage();
		}
	};

	function getAccountPage() {
		var tableConfig = {
			"ajax" : {
				url : "/daren-web/account/getSubAccountPage",
				dataSrc : function(resp) {
					if (resp.status != 0) {
						core.alert(resp.msg);
					} else {
						core.fixResp(resp, function(row) {
							row.op = '<a class="bind bind-click" roleid= "5" subaId="' + row.id + '"  rolename="' + row.realName + '" bind-method="getRolePerms">授权</a>';
							row.statusStr = row.status == 0 ? "禁用" : "正常";
							if (row.status == 0) {
								row.op += '&nbsp;&nbsp;<a class="bind bind-click" subaId="' + row.id + '" status=1 bind-method="editStatus">启用</a>';
							} else {
								row.op += '&nbsp;&nbsp;<a class="bind bind-click" subaId="' + row.id + '" status=0 bind-method="editStatus">禁用</a>';
							}
							row.op += '&nbsp;&nbsp;<a class="bind bind-click" subId="' + row.id + '" bind-method="editSubAcc">修改</a>';

						});
						return resp.result.list;
					}

				},
			},
			"paging" : true,
			drawCallback : function(e) {
			}
		};
		window.oTable = core.dataTable("sub-account-list-table", tableConfig);
		paintRolePerms("treeGrid1");
	}

	account.editStatus = function(that) {
		var status = that.attr("status");
		var title = "";
		if (status == 0) {
			title = "是否禁用该用户？";
		} else {
			title = "是否启用该用户？";
		}
		core.confirm(title, function() {
			var subaId = that.attr("subaId");
			core.ajax({
				url : "/daren-web/account/editUserStatus",
				data : {
					subaId : subaId,
					status : status
				},
				type : "post",
				success : function(resp) {
					if (resp.status == 0) {
						if (status == 0) {
							core.success("禁用成功");
						} else {
							core.success("启用成功");
						}
						window.oTable.ajax.reload();
					}
				}
			});
		});
	}

	account.submitEditSubAccount = function(that, data) {
		data.drIds = JSON.stringify(data.drIds);
		var items = $('#editTreeGrid').jqxTreeGrid('getCheckedRows');
		var perms = [];
		for (var i = 0; i < items.length; i++) {
			perms.push(items[i].id);
		}
		data.perms = JSON.stringify(perms);
		core.ajax({
			url : "/daren-web/account/editSubAccount",
			data : data,
			type : "post",
			success : function(resp) {
				if (resp.status == 0) {
					window.oTable.ajax.reload();
					core.closeModal("edit_sub_account_modal");
					core.success("修改成功");
				}
			}
		});
	}

	account.editSubAcc = function(that) {
		var subId = that.attr("subId");
		core.modal("edit_sub_account_modal", editSubAccountTemp({
			subId : subId
		}));
		paintRolePerms("editTreeGrid");
		core.selectShopByPrincipal("edit_sub_account_dr_list");
		getSubDetail(subId);
	}

	function getSubDetail(subId) {
		core.ajax({
			url : "/daren-web/account/getSubDetail/",
			data : {
				subId : subId
			},
			type : "post",
			success : function(resp) {
				if (resp.status != 0) {
					core.alert(resp.msg);
				} else {
					var sub = resp.result;
					var drList;
					core.ajax({
						url : "/daren-web/account/getDrListBySubId",
						async : false,
						data : {
							subId : subId
						},
						type : "post",
						success : function(resp) {
							if (resp.status == 0) {
								drList = resp.result;
							}
						}
					});

					core.multipleSelectInitValForAjax("edit_sub_account_dr_list", drList);
					var permsList = sub.perms.split(',');
					if (permsList) {
						$('#editTreeGrid').jqxTreeGrid('expandRow', 1);
						for ( var x in permsList) {
							$('#editTreeGrid').jqxTreeGrid('checkRow', permsList[x]);
						}
					}
					$('#id').val(sub.id);
					$('#userId').val(sub.userId);
					core.initForm("edit_sub_account_modal_form", sub);
				}
			}
		});
	}

	function paintRolePerms(treeGridId) {
		var source1 = {
			dataType : "json",
			dataFields : [ {
				name : 'id'
			}, {
				name : 'name'
			}, {
				name : 'pId'
			}, {
				name : 'type'
			}, {
				name : 'url'
			}, {
				name : 'code'
			}, {
				name : 'sysId'
			} ],
			hierarchy : {
				keyDataField : {
					name : 'id'
				},
				parentDataField : {
					name : 'pId'
				}
			},
			id : 'id',
			url : '/daren-web/rbac/perms/perms.json?type=2',
			async : false
		};
		var dataAdapter1 = new jQuery.jqx.dataAdapter(source1);
		$("#" + treeGridId).jqxTreeGrid({
			localization : {
				loadText : "加载中...",
				emptyDataString : "找不到数据 ⊙o⊙"
			},
			theme : "metro",
			width : '100%',
			// height: 600,
			columnsResize : true,
			source : dataAdapter1,
			sortable : false,
			hierarchicalCheckboxes : true,
			checkboxes : true,
			icons : true,
			ready : function() {
				$("#" + treeGridId).jqxTreeGrid('expandRow', 1);
			},
			columns : [ {
				text : '菜单',
				dataField : 'name'
			} ]
		});
	}

	account.openAddSubAccountModal = function(that) {
		core.modal("add_sub_account_modal", addSubAccountTemp());
		paintRolePerms("addTreeGrid");
		core.selectShopByPrincipal("add_sub_account_dr_list");
	}

	account.submitAddSubAccount = function(that, data) {
		var pwd = $("#password").val();
		var regx = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,}$/;
		if (pwd.length < 6) {
			core.alert("密码长度不小于6位!");
			$("#password").focus();
			return false;
		}
		if (pwd.match(regx) == null) {
			core.alert("密码必须同时包含字母和数字!");
			$("#password").focus();
			return false;
		}
		data.drIds = JSON.stringify(data.drIds);
		var items = $('#addTreeGrid').jqxTreeGrid('getCheckedRows');
		var perms = [];
		for (var i = 0; i < items.length; i++) {
			perms.push(items[i].id);
		}
		data.perms = perms.join(",");
		core.ajax({
			url : "/daren-web/account/addSubAccount",
			data : data,
			type : "post",
			success : function(resp) {
				if (resp.status == 0) {
					window.oTable.ajax.reload();
					core.closeModal("add_sub_account_modal");
					core.success("添加成功");
				}
			}
		});
	}

	account.getRolePerms = function(that) {
		var rolename = that.attr("rolename");
		var roleid = that.attr("roleid");
		var subaId = that.attr("subaId");
		$("#bindRolePermsButton").attr("roleid", roleid);
		$("#bindRolePermsButton").attr("subaId", subaId);
		$('#div-perm').css('visibility', 'visible');
		$('#perms-title').text(rolename + " - 账号授权");
		var rows = $("#treeGrid1").jqxTreeGrid('getCheckedRows');
		for ( var x in rows) {
			$("#treeGrid1").jqxTreeGrid('uncheckRow', rows[x].id);
		}
		var ajaxParam = {
			url : "/daren-web/rbac/role_perm_list",
			data : {
				roleid : roleid,
				subaId : subaId
			},
			success : function(jsonResult) {
				$('#treeGrid1').jqxTreeGrid('expandRow', 1);
				for ( var x in jsonResult.result) {
					$('#treeGrid1').jqxTreeGrid('checkRow', jsonResult.result[x]);
				}
			}
		};
		core.ajax(ajaxParam);
		
		core.ajax({
			url : "/daren-web/account/getSubDetail",
			data : {
				subId :subaId
			},
			success : function(jsdata){
				var price_visible_dom = $("#price_visible");
				if(jsdata.result.priceVisible == 1){
					price_visible_dom.prop("checked","checked");
				}else{
					price_visible_dom.removeAttr("checked");
				}
			}
		});
		
		
	};

	account.bindRolePerms = function(that) {
		var roleid = that.attr("subaId");
		if (typeof roleid === 'undefined' || !roleid) {
			core.warning('请选择子账户号');
			return;
		}
		var items = $('#treeGrid1').jqxTreeGrid('getCheckedRows');
		var perms = [];
		for (var i = 0; i < items.length; i++) {
			perms.push(items[i].id);
		}
		
		var price_visible = $("#price_visible").is(":checked");
		
		var ajaxParam = {
			url : "/daren-web/rbac/perms_role_bind",
			type : "post",
			data : {
				roleid : roleid,
				perms : perms.join(","),
				priceVisible : price_visible?1:0
			},
			success : function() {
				core.success("设置成功");
			}
		};
		core.ajax(ajaxParam);
	};

	return account;
});
