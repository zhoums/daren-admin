/*TMODJS:{"version":8,"md5":"df35258ef4d658907ee57cac494fb4a6"}*/
define(['../../../template',''],function(template){return template('src/artModules/daren/set_including_tax', function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,includingTax=$data.includingTax,$escape=$utils.$escape,id=$data.id,$out='';$out+='<div class="modal fade" id="set_including_tax_modal"> <div class="modal-dialog" style="width: 40%;"> <div class="modal-content"> <div class="modal-header"> ';
if(includingTax > 0){
$out+=' <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> ';
}
$out+=' <text class="modal-title">请先设置税费类型，设置后，您可以在付费方式处进行修改</text> </div> <div class="modal-body col-sm-12"> <form id="set_including_tax_form"> <input type="hidden" name="pinfo" value="';
$out+=$escape(id);
$out+='" /> <div class="form-group col-sm-8"> <label for="mediaType" class="col-sm-12 control-label">税费类型</label><br /> <div class="col-sm-12"> <label class="radio-inline"> <input type="radio" name="tax" value="2" ';
if(includingTax == "2" ){
$out+=' checked="checked" ';
}
$out+=' /> 代缴税费 </label> </div> <div class="col-sm-12 col-sm-offset-1"> 税费需要茉莉传媒代缴 </div> <br> <div class="col-sm-12"> <label class="radio-inline"> <input type="radio" name="tax" value="1" ';
if(includingTax == "1"){
$out+=' checked="checked" ';
}
$out+=' /> 含税 </label> </div> <div class="col-sm-6 col-sm-offset-1"> 已经包含税费 </div> </div> <div class="form-group col-sm-12"> <div class="col-sm-offset-6 col-sm-3"> <button type="button" class="btn btn-default bind bind-click" validate-form="set_including_tax_form" bind-method="submitSetIncludingTax">设置</button> </div> </div> </form> </div> <div class="modal-footer"></div> </div> </div> </div>';
return new String($out);
});});