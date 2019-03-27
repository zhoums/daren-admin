/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('video', function(K) {
	var self = this, name = 'video', lang = self.lang('media' + '.'),
		allowMediaUpload = K.undef(self.allowMediaUpload, true),
		allowFileManager = K.undef(self.allowFileManager, false),
		formatUploadUrl = K.undef(self.formatUploadUrl, true),
		extraParams = K.undef(self.extraFileUploadParams, {}),
		filePostName = K.undef(self.filePostName, 'imgFile'),
		uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php');
	self.plugin.media = {
		edit : function() {
			var html = [
				'<div style="padding:20px;">',
				//url
				'<div class="ke-dialog-row">',
				'<label for="keUrl" style="width:60px;">' + lang.url + '</label>',
				'<input class="ke-input-text" type="text" id="keUrl" name="url" value="" style="width:160px;" /> &nbsp;',
				'<input type="button" class="ke-upload-button" value="' + lang.upload + '" /> &nbsp;',
				'<span class="ke-button-common ke-button-outer">',
				'<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
				'</span>',
				'</div>',
				//width
				'<div class="ke-dialog-row">',
				'<label for="keWidth" style="width:60px;">' + lang.width + '</label>',
				'<input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="550" maxlength="4" />',
				'</div>',
				//height
				'<div class="ke-dialog-row">',
				'<label for="keHeight" style="width:60px;">' + lang.height + '</label>',
				'<input type="text" id="keHeight" class="ke-input-text ke-input-number" name="height" value="400" maxlength="4" />',
				'</div>',
				//cover,size,length,originalDefinition
				'<div class="ke-dialog-row" style="display:none;">',
				'<label for="keCover" style="width:60px;">封面,大小,长度,尺寸</label>',
				'<input type="text" id="keCover" class="ke-input-text ke-input-number" name="cover" value="" />',
				'<input type="text" id="keSize" class="ke-input-text ke-input-number" name="size" value="" />',
				'<input type="text" id="keLength" class="ke-input-text ke-input-number" name="length" value="" />',
				'<input type="text" id="keOriginal" class="ke-input-text ke-input-number" name="original" value="" />',
				'</div>',
				//type
				'<div class="ke-dialog-row" style="display:none;">',
				'<label for="keType" style="width:60px;">类型</label>',
				'<input type="text" id="keType" class="ke-input-text ke-input-number" name="type" value="" />',
				'</div>',
				//autostart
				'<div class="ke-dialog-row">',
				'<label for="keAutostart">' + lang.autostart + '</label>',
				'<input type="checkbox" id="keAutostart" name="autostart" value="" /> ',
				'</div>',
				'</div>'
			].join('');
			var dialog = self.createDialog({
				name : name,
				width : 450,
				height : 230,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var url = K.trim(urlBox.val()),
							width = widthBox.val(),
							height = heightBox.val(),
							cover = coverBox.val(),
							size = sizeBox.val(),
							length = lengthBox.val(),
							original = originalBox.val(),
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
						var id = "video_" + Date.parse(new Date());
//						var html = K.mediaVideo(self.themesPath + 'common/blank.gif', {
//							id : id,
//							src : url,
//							type : K.mediaType(url),
//							width : width,
//							height : height,
//							autostart : autostartBox[0].checked ? 'true' : 'false',
//							loop : 'true',
//							cover : cover,
//							type : type
//						});
						var html = '<p><video src="'+url+'" width="' + width + '" height="' + height + '" controls="controls" ' +
								   'size="' + size + '" length="' + length + '" original="' + original + '" type="' + type + '" poster="' + cover + '"></video><br/></p>';
						self.insertHtml(html).hideDialog().focus();
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
			coverBox = K('[name="cover"]', div);
			sizeBox = K('[name="size"]', div);
			lengthBox = K('[name="length"]', div);
			originalBox = K('[name="original"]', div);
			typeBox = K('[name="type"]', div);

			if (allowMediaUpload) {
				var uploadbutton = K.uploadbutton({
					button : K('.ke-upload-button', div)[0],
					fieldName : filePostName,
					extraParams : extraParams,
					url : K.addParam(uploadJson, 'dir=media'),
					afterUpload : function(data) {
						dialog.hideLoading();
						if (data.error === 0) {
							var url = data.url;
							if (formatUploadUrl) {
								url = K.formatUrl(url, 'absolute');
							}
							urlBox.val(url);
							coverBox.val(data.cover);
							typeBox.val(data.type);
							if (self.afterUpload) {
								self.afterUpload.call(self, url, data, name);
								try {
									sizeBox.val(data.video.video_size);
									lengthBox.val(data.video.video_length);
									originalBox.val(data.video.original_definition);
									var width = 400;
									var size = data.video.original_definition.split('x');
									size[0] = parseInt(size[0]);
									size[1] = parseInt(size[1]);
									widthBox.val(width);
									heightBox.val(size[1] * Math.ceil(width/size[0]));
								} catch(e) {
								}
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
									if (self.afterSelectFile) {
										self.afterSelectFile.call(self, url);
									}
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
			// [IE] 删除图片后立即点击图片按钮出错
			self.addBookmark();
		}
	};
	self.clickToolbar(name, self.plugin.media.edit);
});
