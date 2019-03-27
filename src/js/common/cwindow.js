define(function (require) {
	'use strict';
	require("jquery");
	var swal = require("sweetalert");
	/**
	 * 自定义窗口插件
	 */
	function cwindow() {

	}

	cwindow.alert = function (msg, callback) {
		swal({
			title: msg,
			text: "",
			type: "info",
			showCancelButton: false,
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			closeOnConfirm: true,
			closeOnCancel: true
		}, function (isSure) {
			if (isSure && callback) {
				callback();
			}
		});
	};

	/**
	 * 打开一个窗口,如果想新起来一个窗口，后面带上_=new Date()
	 */
	cwindow.openTab = function (page) {

		if (parent.openTab) {
			parent.openTab(page);
		} else {
			window.open(page);
		}
	};

	/**
	 * 关闭指定窗口
	 */
	cwindow.closeTab = function (page) {
		if (parent.openTab) {
			parent.$(".J_menuTab").each(function () {
				if (page === $(this).attr("data-id")) {
					$(this).find("i").click();

				}
			});
		}
	};

	/**
	 * 关闭当前窗口
	 */
	cwindow.close = function () {
		if (parent.openTab) {
			parent.$(".J_menuTab.active").find("i").click();
		} else {
			window.opener = null;
			window.close();
		}
	};

	cwindow.warning = function (title, callback) {
		var timer = callback ? undefined : 1500;
		swal({
			title: title,
			text: '',
			type: 'warning',
			timer: timer
		}).then(function (isSure) {
			if (callback) {
				callback();
			}
		}).catch(function () {
			if (callback) {
				callback();
			}
		});
	};
	cwindow.confirm = function (title, callback, swalConfig) {
		swalConfig = swalConfig || {};
		swal({
			title: title,
			text: "",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: "取消",
			confirmButtonText: '确定'
		}).then(function (isSure) {
			if (isSure && callback) {
				callback();
			} else {
				console.log("取消");
			}
		}).catch(function () {});
	};

	cwindow.promptArea = function (title, callback) {
		swal({
			title: title + ":",
			text: "",
			input: "textarea",
			showCancelButton: true,
			animation: "slide-from-top",
			inputPlaceholder: "输入内容",
			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					if (value) {
						resolve();
					} else {
						reject('输入内容不能为空');
					}
				});
			}
		}).then(function (inputValue) {
			inputValue = inputValue || "";
			swal.close();
			callback(inputValue);
		}).catch(function () {});
	};

	cwindow.prompt = function (title, callback, inputType) {
		swal({
			title: title + ":",
			text: "",
			input: inputType || 'text',
			showCancelButton: true,
			animation: "slide-from-top",
			inputPlaceholder: "输入内容",
			inputValidator: function (value) {
				return new Promise(function (resolve, reject) {
					if (value) {
						resolve();
					} else {
						reject('输入内容不能为空');
					}
				});
			}
		}).then(function (inputValue) {
			inputValue = inputValue || "";
			swal.close();
			callback(inputValue);
		}).catch(function () {});
	};

	/**
	 * 成功提示
	 */
	cwindow.success = function (title, callback) {
		var timer = 1500;
		swal({
			title: title,
			text: '',
			type: 'success',
			timer: timer
		}).then(function (isSure) {
			if (callback) {
				setTimeout(function () {
					callback();
				}, 500);
			}
		}).catch(function () {
			if (callback) {
				setTimeout(function () {
					callback();
				}, 500);
			}
		});
	};
	/**
	 * 失败提示
	 */
	cwindow.failure = function (title, callback) {
		var timer = callback ? undefined : 3000;
		swal({
			title: title,
			text: '',
			type: 'error',
			timer: timer
		}).then(function (isSure) {
			if (callback) {
				callback();
			}
		}).catch(function () {
			if (callback) {
				callback();
			}
		});
	};

	/**
	 * 动态打开一个模态
	 */
	cwindow.modal = function (modalId, modalContent, callback, core) {
		if($('#'+modalId + 'Dialog').length){
			$('#'+modalId + 'Dialog').html(modalContent)
		}else{
			modalContent = '<div id="' + modalId + 'Dialog">' + modalContent + '</div>';
			$("body").append(modalContent);
		}
		$("#" + modalId).modal({
	            backdrop: "static",//点击空白处不关闭对话框
	            keyboard: false,//键盘关闭对话框
	            show:true//弹出对话框
	        });
		if (callback) {
			callback();
		}
		core.listenClick();
		// if (modalId === 'hide') {
		// 	$("#custom_modal .modal").each(function () {
		// 		$(this).modal("hide");
		// 	});
		// 	return;
		// }

		// //添加自定义窗口之前，调用modal方法之前需要确保页面所有模块窗口已经关闭
		// $("#custom_modal").remove();
		// modalContent = '<div id="' + (domId || 'custom_modal') + '">' + modalContent + '</div>';
		// $("body").append(modalContent);
		// $("#" + modalId).modal("show");
		// if (callback) {
		// 	callback();
		// }
		// core.listenClick();

	};

	cwindow.closeModal = function (modalId) {
		$("#"+modalId+" .close").click();
	};


	window.collection = function (sURL, sTitle) {
		try {
			window.external.addFavorite(sURL, sTitle);
		} catch (e) {
			try {
				window.sidebar.addPanel(sTitle, sURL, "");
			} catch (e) {
				cwindow.warning("使用Ctrl+D快速收藏本页");
			}
		}
	};

	/**
	 * 弹窗提示信息封装
	 */
	cwindow.notice = function (id, msg) {
		if ($("#" + id).length > 0) {
			$("#" + id).text(msg);
			setTimeout(function () {
				if ($("#" + id)) {
					$("#" + id).text("");
				}
			}, 2000);
		} else {
			$("." + id)[0].text(msg);
			setTimeout(function () {
				if ($("." + id).length > 0) {
					$("." + id)[0].text("");
				}
			}, 2000);
		}


	};


	return cwindow;



});