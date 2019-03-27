/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('vote', function(K) {
	var self = this, name = 'vote', lang = self.lang(name + '.'),
		htmlPath = self.pluginsPath + name + '/';
	function getFilePath(fileName) {
		return htmlPath + fileName + '?ver=' + encodeURIComponent(K.DEBUG ? K.TIME : K.VERSION);
	}
	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			arr = ['<div style="padding:10px 10px;">',
				'<div class="ke-header">',
				// left start
				'<div class="ke-left">'];
//			K.each(lang.fileList, function(key, val) {
//				arr.push('<option value="' + key + '">' + val + '</option>');
//			});
			html = [arr.join(''),
				'</select></div>',
				// right start
				'<div class="ke-right">',
				'</div>',
				'<div class="ke-clearfix"></div>',
				'</div>',
				'<iframe class="ke-textarea" frameborder="0" style="width:580px;height:380px;background-color:#FFF;border:none;"></iframe>',
				'</div>'].join('');
		var dialog = self.createDialog({
			name : name,
			width : 600,
			height:400,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var vote_html = iframe.get(0).contentWindow.getVoteHtml();
					self['insertHtml'](vote_html).hideDialog().focus();
				}
			}
		});
		var selectBox = K('select', dialog.div),
//			checkbox = K('[name="replaceFlag"]', dialog.div),
			iframe = K('iframe', dialog.div);
//		checkbox[0].checked = true;
		iframe.attr('src', getFilePath('vote.html'));
//		selectBox.change(function() {
//			iframe.attr('src', getFilePath(this.value));
//		});
	});
});
