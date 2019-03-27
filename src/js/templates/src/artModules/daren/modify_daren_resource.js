/*TMODJS:{"version":18,"md5":"7fe4ae124cb9080043bc71402d9b016d"}*/
define(['../../../template',''],function(template){return template('src/artModules/daren/modify_daren_resource', function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,platformStr=$data.platformStr,nickname=$data.nickname,articleChannelStr=$data.articleChannelStr,articleUrl=$data.articleUrl,id=$data.id,platform=$data.platform,$out='';$out+='<div class="modal fade" id="modify_daren_resource_modal"> <div class="modal-dialog" style="width: 90%;"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title">达人渠道报价管理</h4> </div> <div class="modal-body col-md-12"> <div class="row"> <div class="form-group"> <div class="col-md-2"> <p class="text-right"> <strong>平台</strong> </p> </div> <div class="col-md-10"> <p>';
$out+=$escape(platformStr);
$out+='</p> </div> </div> <div class="form-group"> <div class="col-md-2"> <p class="text-right"> <strong>昵称</strong> </p> </div> <div class="col-md-10"> <p>';
$out+=$escape(nickname);
$out+='</p> </div> </div> ';
if(articleChannelStr){
$out+=' <div class="form-group"> <div class="col-md-2"> <p class="text-right"> <strong>';
$out+=$escape(articleChannelStr);
$out+='-文章链接</strong> </p> </div> <div class="col-md-10"> <p>';
$out+=$escape(articleUrl);
$out+='</p> </div> </div> ';
}
$out+=' </div> <div class="row"> <div class="form-group" style="border-top: none;"> <table id="tb-dr-media-list" class="table table-striped table-bordered table-hover table-highlight-head table-responsive"> <thead> <tr> <th>达人名称</th> <th width="180px">渠道</th>  <th>执行价（元）</th> <th>报价备注</th> <th width="80px">操作</th> </tr> </thead> <tbody id="detail-tbody-dr-media-list"> </tbody> </table> </div> <div class="form-actions fluid"> <div class="row"> <div class="col-sm-12 text-center"> <button type="button" class="btn btn-lg btn-info bind bind-click" drId="';
$out+=$escape(id);
$out+='" drName="';
$out+=$escape(nickname);
$out+='" platform="';
$out+=$escape(platform);
$out+='" bind-method="addDrenResourceNewLine">添加更多渠道</button> <button type="button" class="btn btn-lg btn-info bind bind-click" drId="';
$out+=$escape(id);
$out+='" bind-method="batchEditDrenResource">提交</button> </div> </div> </div> </div> </div> <div class="modal-footer" style="margin-top: 0;"> </div> </div> </div> </div> <script id="add_dren_resource_batch_tpl" type="text/html"> <tr id="dren_resource_REPLACE_LINENO" lineNo="REPLACE_LINENO" rid="0" > <td>REPLACE_DREN_NAME</td> <td ><select class="form-control required" name="resourceType_REPLACE_LINENO" id="ipt_resource_type_REPLACE_LINENO" style="width:90%"></select></td> <td ><input type="hidden" onkeyup="value=value.replace(/[^\\d.]/g,\'\')" id="ipt_price_REPLACE_LINENO" name="price_REPLACE_LINENO" class="form-control required" /><input type="text" onkeyup="value=value.replace(/[^\\d.]/g,\'\')" id="ipt_discount_price_REPLACE_LINENO" name="discountPrice_REPLACE_LINENO" class="form-control required" /></td> <td ><input type="text" id="ipt_price_remark_REPLACE_LINENO" name="priceRemark_REPLACE_LINENO" class="form-control" /></td> <td ><a class="bind bind-click" line_no="REPLACE_LINENO" bind-method="delDrenResourceLine">删除</a></td> </tr> </script> ';
return new String($out);
});});