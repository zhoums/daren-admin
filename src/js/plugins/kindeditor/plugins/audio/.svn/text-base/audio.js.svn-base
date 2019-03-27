KindEditor.plugin('audio', function(K) {
    var self = this, name = 'audio', lang = self.lang(name + '.'),
        allowMediaUpload = K.undef(self.allowMediaUpload, true),
        allowFileManager = K.undef(self.allowFileManager, false),
        formatUploadUrl = K.undef(self.formatUploadUrl, true),
        uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php');
    
    function el(url,type){
        var src=url;
        audio.src=src;
        function g(){isNaN(audio.duration) ? requestAnimationFrame(g):f(audio.duration,url,type)}
        requestAnimationFrame(g);
    }
    function formatT(t) {
		var d = Math.floor(t / 60 / 60 / 24);
		var h = Math.floor(t / 60 / 60 % 24);
		var m = Math.floor(t / 60 % 60);
		var s = Math.floor(t % 60);
		return ((h>0?(toD(h)+':'):'') + (m>0?toD(m):'00') + ':' +(s>0?toD(s):'00'));
	}
	function toD(num){
		return num>10?num:('0'+num)
	}
	function f(t,url,type){
//		var time = formatT(t);
		var html = '<p><audio src="'+url+'" controls="controls" type="' + type + '" data-time="' + t + '"></audio><br/></p>';
	    self.insertHtml(html).hideDialog().focus();
	}

    
    self.plugin.media = {
        edit : function() {
            var html = [
                '<div style="padding:20px;">',
                //url
                '<div class="ke-dialog-row">',
                '<label for="keUrl" style="width:60px;">URL</label>',
                '<input class="ke-input-text" type="text" id="keUrl" name="url" value="" style="width:160px;" /> &nbsp;',
                '<input type="hidden" name="length" value=""/>',
                '<audio id="audio" controls="" style="display: none;"></audio>',
                '<input type="button" class="ke-upload-button" value="上传" /> &nbsp;',
                '</div>',
				//type
				'<div class="ke-dialog-row" style="display:none;">',
				'<label for="keType" style="width:60px;">类型</label>',
				'<input type="text" id="keType" class="ke-input-text ke-input-number" name="type" value="" />',
				'</div>',
                '</div>'
            ].join('');
            var dialog = self.createDialog({
                    name : name,
                    width : 450,
                    height : 150,
                    title : self.lang(name),
                    body : html,
                    yesBtn : {
                        name : self.lang('yes'),
                        click : function(e) {
                            var url = K.trim(urlBox.val()),
                                width = widthBox.val(),
                                height = heightBox.val(),
                                length = lengthBox.val(),
    							type = typeBox.val();
                            if (url == 'http://' || K.invalidUrl(url)) {
                                alert(self.lang('invalidUrl'));
                                urlBox[0].focus();
                                return;
                            }
                            if (!/^\d*$/.test(width)) {
                                alert(self.lang('invalidWidth'));
                                widthBox[0].focus();
                                return;
                            }
                            if (!/^\d*$/.test(height)) {
                                alert(self.lang('invalidHeight'));
                                heightBox[0].focus();
                                return;
                            }
                            el(url,type)
//                            var html = '<p><audio src="'+url+'" controls="controls" type="' + type + '" data-time="' + length + '"></audio><br/></p>';
//                            self.insertHtml(html).hideDialog().focus();
                        }
                    }
                }),
            div = dialog.div,
            urlBox = K('[name="url"]', div),
            viewServerBtn = K('[name="viewServer"]', div),
            widthBox = K('[name="width"]', div),
            heightBox = K('[name="height"]', div),
            autostartBox = K('[name="autostart"]', div);
            urlBox.val('http://');
			typeBox = K('[name="type"]', div),
			lengthBox = K('[name="length"]', div);

            if (allowMediaUpload) {
                var uploadbutton = K.uploadbutton({
                    button : K('.ke-upload-button', div)[0],
                    fieldName : 'imgFile',
                    url : K.addParam(uploadJson, 'dir=audio'),
                    afterUpload : function(data) {
                        dialog.hideLoading();
                        if (data.error === 0) {
                            var url = data.url;
                            if (formatUploadUrl) {
                                url = K.formatUrl(url, 'absolute');
                            }
                            urlBox.val(url);
							typeBox.val(data.type);
							lengthBox.val(data.length);
                            if (self.afterUpload) {
                                self.afterUpload.call(self, url);
                            }
                            alert(self.lang('uploadSuccess'));
                        } else {
                            alert(data.message);
                        }
                    },
                    afterError : function(html) {
                        dialog.hideLoading();
                        self.errorDialog(html);
                    }
                });
                uploadbutton.fileBox.change(function(e) {
                    dialog.showLoading(self.lang('uploadLoading'));
                    uploadbutton.submit();
                });
            } else {
                K('.ke-upload-button', div).hide();
            }

            if (allowFileManager) {
                viewServerBtn.click(function(e) {
                    self.loadPlugin('filemanager', function() {
                        self.plugin.filemanagerDialog({
                            viewType : 'LIST',
                            dirName : 'media',
                            clickFn : function(url, title) {
                                if (self.dialogs.length > 1) {
                                    K('[name="url"]', div).val(url);
                                    self.hideDialog();
                                }
                            }
                        });
                    });
                });
            } else {
                viewServerBtn.hide();
            }

            var img = self.plugin.getSelectedMedia();
            if (img) {
                var attrs = K.mediaAttrs(img.attr('data-ke-tag'));
                urlBox.val(attrs.src);
                widthBox.val(K.removeUnit(img.css('width')) || attrs.width || 0);
                heightBox.val(K.removeUnit(img.css('height')) || attrs.height || 0);
                autostartBox[0].checked = (attrs.autostart === 'true');
            }
            urlBox[0].focus();
            urlBox[0].select();
        },
        'delete' : function() {
            self.plugin.getSelectedMedia().remove();
        }
    };
    self.clickToolbar(name, self.plugin.media.edit);
});