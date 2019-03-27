/**
 * 拉拽文件上传
 *
 * $('#dropTarget').dndFileUploader({url:'http://hostname/upload.php'});
 *
 */
(function($){
	$.fn.dndFileUploader = function(options){
		console.log('dndFileUploader');
		// 检查浏览器是否支持FileReader
		if (!window.FileReader) return this;

		var defaults = {
			url: '/upload',
			fieldName: 'imgFile',
			acceptTypes: '.*'
		};

		options = options || {};

		$.extend(defaults, options);

		var self = this;

		self.on('dragover', function(evt){
			evt.stopPropagation();
			evt.preventDefault();
		});

		self.on('drop', function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			var files = evt.originalEvent.dataTransfer.files;
			if (files.length) {
				uploadFiles($(this), files);
			}
		});

		/**
		 * 上传多个文件
		 *
		 * @param Array files
		 */
		function uploadFiles(elem, files) {
			files = filterFiles(files);
			if (!files || files.length == 0) {
				return;
			}

			elem.trigger({type:'beforeUpload', files: files});

			var xhrs = [];
			$(files).each(function(){
				xhrs.push(_uploadFile(this));
			});

			$.when.apply(null, xhrs).done(function(){
				elem.trigger({type: 'afterUpload', files: files});
			});
		}

		/**
		 * 上传文件
		 *
		 * @param FileEntry file
		 */
		function _uploadFile(file) {
			var formData = new FormData();
			formData.append(defaults['fieldName'], file);

			return $.ajax({
				url: defaults['url'],
				type: 'post',
				data: formData,
				dataType: 'json',
				cache: false,
				processData: false,
				contentType: false,
				success: function(data){
					$(file).trigger({type: 'success', file: file, response: data});
				},
				xhr: function() {
		            var myXhr = $.ajaxSettings.xhr();
		            if(myXhr.upload){
		                $(myXhr.upload).on('abort error load loadstart progress timeout loadend', {file:file}, uploadEventHandler);
		            }
		            return myXhr;
		        }
			});
		}

		function uploadEventHandler(evt) {
			var orgEvt = evt.originalEvent;
			$(evt.data.file).trigger({type:evt.type, loaded:orgEvt.loaded,total:orgEvt.total});
		}

		/**
		 * 过滤不匹配需求的文件
		 *
		 * @param Array files
		 * @return Array
		 */
		function filterFiles(files) {
			var matchFiles = [];
			var types = defaults['acceptTypes'].split(',');

			$(files).each(function(){
				var file = this;
				$(types).each(function(){console.log('filetype:'+file.type+';match:'+this);
					if (file.type.match(this)) {
            			matchFiles.push(file);
            			return false;
        			}
				});
			});

			return matchFiles;
		}

		return self;
	};
})(jQuery);