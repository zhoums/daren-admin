define(function(require) {
    'use strict';
    require("jquery");
    var api = require("api");
    var artTemplate = require("artTemplate");
    var cwindow = require("common/cwindow");
    var datatable = require("common/datatable");
    var data = require("common/data");
    var http = require("common/http");
    var dom = require("dom");
    var DIC = require("DIC");

    function core() {

    }
    /**
     * 动态注册各个公共模块的方法到bl中,业务代码想要调用公共js，只需要跟bl打交道即可
     */
    core.registerMethod = function() {
	var args = arguments;
	for ( var num in args) {
	    var module = args[num];
	    for ( var methodName in module) {
		core[methodName] = module[methodName];
	    }
	}
    }(data, http, dom, cwindow, DIC);

    // 重写加载子窗口
    core.reloadChildBox = function(htmlTemplate) {

    };
    
    /**
	 * 全选，并且是否触发事件
	 */
    core.checkAllClick = function(cb, parentId, trgChange){ 
        $("#"+parentId+" tr").each(function() {        	
            var that = $(this); 
//            alert(that.parent().html());
            that.find("input[id^='check_']").each(function() {
            	if(cb.is(":checked")) {
            		$(this).prop('checked', true);
            	} else {
            		$(this).prop('checked', false);
            	} 
            	if(trgChange) {
            		$(this).trigger("change"); 
            	} 
            });
            
        });
	}
    
    core.getSelectIds = function(parentId) {
		var ids = []; 
        $("#"+parentId+" tr").each(function() {
            var that = $(this); 
            that.find("input[id^='check_']").each(function() {
            	if($(this).is(':checked')) {
            		var id = $(this).attr("id").replace('check_','');
            		ids.push(id);
                }
            });
            
        });
//        console.log("getSelectIds--->>[ids]"+JSON.stringify(ids));
        return ids;
	}
    
  //初始化多选框默认值
	core.multipleSelectInitVal = function (elementId,vals){
	    if(!vals instanceof Array)
		return;
	    $.each(vals,function(){
	    	if(data.isNotEmpty(this)){
	    		var option = eval('$("#'+elementId+' option[value='+this+']")');
	    		option.prop("selected","selected");
	    	}
	    });
	    $("#"+elementId).trigger('change');
	}
	
	core.multipleSelectInitValForAjax = function (elementId,vals){
	    if(!vals instanceof Array)
		return;
	    $.each(vals,function(index){
    		$("#"+elementId).append(new Option(vals[index].nickname, vals[index].id, false, true));
	    });
	    $("#"+elementId).trigger('change');
	}
    
    core.selectAllAe = function(elementId) {
	var options = {
	    element : elementId,
	    name : "nick",
	    value : "id",
	    url : "/admin/rbac/user/ae_select_list?t=0"
	};
	core.select4(options, elementId);
    };

    core.dataTable = function(id, options) {
	return datatable.dataTable(id, options, core);
    };

    core.modal = function(modalId, modalContent, callback) {
	cwindow.modal(modalId, modalContent, callback, core);
    };
    core.closeModal = function(modalId) {
	cwindow.closeModal(modalId);
    }
    /**
     * 每次登陆的时候清空过期的localStorage内容，预防localStorage变得越来越大
     */
    core.deleteInvlidCache = function(account) {
	var keys = [ 'pcs_', 'agents_', 'leagues_', 'resers_', 'menus_', 'permission_defination_', 'permissions_' ];
	for ( var i in keys) {
	    core.deleteCache(keys[i] + account);

	}
    };
    core.appendToolBox = function(title, bindMethod) {
	$("#dropdown-menu").append(
		'<li><a class="bind-click" href="#" bind-method="' + bindMethod + '">' + title + '</a></li>');
	core.listenClick();
    };

    core.select3 = function(options, changeCallback) {
	console.log("core.select3"); // 这里还可以打印出日志来
	dom.select3(options, core, changeCallback);
    };
    core.select4 = function(options, elementId, defaultText, defaultValue, changeCallback) {
	// console.log("core.select4"); //这里还可以打印出日志来
	dom.select3(options, core, changeCallback);
	if (defaultText && defaultValue) {
	    $("#" + elementId).prepend("<option value='" + defaultValue + "' >" + defaultText + "</option>");
	}

    };
    core.select5 = function(options, changeCallback) {
	console.log("core.select5"); // 这里还可以打印出日志来
	dom.select3(options, core, changeCallback, 0);
    };

    core.selectShopByPrincipal = function(elementId) {
	var options = {
	    element : elementId,
	    name : "nickname",
	    value : "id",
	    url : "/daren-web/daren/getDarenPageForSelect"
	};
	core.select4(options, elementId);
    };
    core.selectShop = function(elementId) {
	var options = {
	    element : elementId,
	    name : "name",
	    value : "id",
	    url : "/daren-web/task/shop/select_list"
	};
	core.select4(options, elementId);
    };
    core.selectShopByUserId = function(elementId) {
    	var options = {
    	    element : elementId,
    	    name : "name",
    	    value : "id",
    	    url : "/daren-web/task/shop/select_list_user"
    	};
    	core.select4(options, elementId);
    };
    core.selectAe = function(elementId) {
		var options = {
		    element : elementId,
		    name : "nick",
		    value : "id",
		    url : "/daren-web/rbac/user/ae_select_list"
		};
		core.select4(options, elementId);
    };
	core.selectAeByUserId = function(elementId) {
		var options = {
		    element : elementId,
		    name : "nick",
		    value : "id",
		    url : "/daren-web/task/ae/ae_select_list_user"
		};
		core.select4(options, elementId);
    };
    core.selectDren = function(elementId) {
		var options = {
		    element : elementId,
		    name : "name",
		    value : "id",
		    url : "/daren-web/task/dr/select_list"
		};
		core.select4(options, elementId);
    };
    core.selectDrByUserId = function(elementId) {
		var options = {
		    element : elementId,
		    name : "name",
		    value : "id",
		    url : "/daren-web/task/dr/select_list_user"
		};
		core.select4(options, elementId);
    };
    
    core.selectWaitInvoiceTask = function(elementId) {
    	var options = {
    	    element : elementId,
    	    name : "opName",
    	    value : "opValue",
    	    url : "/daren-web/task/select_pending_invoice_task"
    	};
    	core.select4(options, elementId);
    };
    
    function upload(type, fileId, formId, imgWrapperId) {
    	var fileInput = $('#'+fileId).get(0).files[0];
    	if(!fileInput){
    		core.warning("请选择文件");
    		return;
    	}
	var $imgWrapper = null;
	if (imgWrapperId) {
	    $imgWrapper = $("#" + imgWrapperId)
	} else {
	    $imgWrapper = $('.imgWrapper')
	}

	$("#" + formId).ajaxSubmit(
		{
		    url : '/daren-web/upload/uploadSingle',
		    type : "post",
		    data : {
			'file' : fileId,
		    },
		    success : function(data) {
			if (data.status === 0) {
			    var html = '';
			    if (type == 1) {
				html = '<li><img src="' + data.result + '" f="' + data.result
					+ '"><a href="javascript:;" class="deleteImg"> × </a></li>';
			    } else if (type == 2) {
				html = '<li><img src="/img/filelogo.jpg" f="' + data.result + '" alt="' + data.result
					+ '" title="' + data.result
					+ '" /><a href="javascript:;" class="deleteImg"> × </a></li>';
			    }

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
		    timeout : 10000
		});
    }
    ;
    
    core.uploadFileExtend = function(fileId, formId, imgWrapperId){  
		uploadExtend(fileId, formId, imgWrapperId);
    }
	function uploadExtend(fileId, formId, imgWrapperId) {
		var fileInput = $('#'+fileId).get(0).files[0];
    	if(!fileInput){
    		core.warning("请选择文件");
    		return;
    	}
		var $imgWrapper = null;
		if(imgWrapperId){
			$imgWrapper = $("#"+imgWrapperId)
		} else {
			$imgWrapper = $('.imgWrapper')
		}
        
        $("#"+formId).ajaxSubmit({
            url: '/daren-web/upload/uploadSingle',
            type:"post",
            success: function(data){ 
                if(data.status === 0){
                    var html = '';
                    var fileSuffix = data.result.substring(data.result.lastIndexOf("."),data.result.length);
                    var imgSuffixs = [".png",".jpg",".gif",".jpeg"];
                    if($.inArray(fileSuffix.toLowerCase(), imgSuffixs)>-1){
                    	html = '<li><img src="'+data.result+'" f="'+data.result+'"><a href="javascript:;" class="deleteImg"> × </a></li>';
                    }else{
                    	html = '<li><img src="/img/filelogo.jpg" f="'+data.result+'" alt="'+data.result+'" title="'+data.result+'" /><a href="javascript:;" class="deleteImg"> × </a></li>'; 
                    }
                    $imgWrapper.append(html);
                }
            },
            error:function(data){ 
            	if(data && data.msg) {
            		core.failure(data.msg);
            	} else {
            		core.failure("上传失败！");
            	}                
            },
            clearForm: true,
            timeout: 1200000
        }); 
	}
    
    core.uploadImage = function(fileId, formId, imgWrapperId) {
	upload(1, fileId, formId, imgWrapperId);
    };
    core.uploadFile = function(fileId, formId, imgWrapperId) {
	upload(2, fileId, formId, imgWrapperId);
    };
    core.exportAction = function(that, data, action) {
	var d = {};
	for ( var i in data) {
	    // console.log(i +"-----"+ data[i]);
	    if (data[i]) {
		if (data[i] instanceof Array) {
		    d[i] = data[i].join(",");
		} else {
		    d[i] = data[i];
		}
	    }
	}
	// console.log("exportAction--->>[d]"+JSON.stringify(d));

	$(that).button('loading').delay(10).queue(function() {
	    $(this).ajaxSubmit({
		type : 'post', // 提交方式 get/post
		url : action, // 需要提交的 url
		data : d,
		complete : function() {
		    $(that).button('reset');
		    $(that).dequeue();
		},
		success : function(rest) { // data 保存提交后返回的数据，一般为 json 数据
		    // 此处可对 data 作相关处理
//		     console.log("exportAction--->>[rest]"+JSON.stringify(rest));
		    if (rest.status == 0) {
			dom.download(rest.result);
		    } else {
			cwindow.alert(rest.msg);
		    }
		}
	    });
	});
    };

    return core;
});