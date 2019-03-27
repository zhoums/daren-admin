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

	var dropzoneDemoTemp = require("templates/daren/dropzone");
	var jqueryUploadDemoTemp = require("templates/daren/jqueryUploadDemo");

//	require("bootstrap-file-input");
//	require("bfi-zh");
	require("dropzone");
	require("dropzoneAmd");
	

	function demo() {

	}

	demo.init = function(page, data) {
		dict = data.dict;
	};
	
	demo.openDropzoneModal = function(that){
		core.modal("dropzone_modal", dropzoneDemoTemp());
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
		
		var demoDropzone = $("#demoDropzone").dropzone({
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
					uniqueMark : new Date().getTime(),
					accepted : true
				};
				dropzoneObj.emit("addedfile", mockFile);
				dropzoneObj.emit("thumbnail", mockFile, "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=898512556,3418944179&fm=27&gp=0.jpg");
				dropzoneObj.emit("complete", mockFile);
				
				var existingFileCount = 1;
				dropzoneObj.options.maxFiles = dropzoneObj.options.maxFiles - existingFileCount;
				
				var newImgs = new Array();
				newImgs.push({
					key:mockFile.uniqueMark,
					url:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=898512556,3418944179&fm=27&gp=0.jpg"
				});
				$("#img_input").val(JSON.stringify(newImgs));
				
			}
		});
	}

	// 文件上传
	demo.openJquploadDemoModal = function(that) {
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

	return demo;
});
