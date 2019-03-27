/*TMODJS:{"version":18,"md5":"cbbafdafb6365209ba38e4e7bfdc943c"}*/
define(['../../../template',''],function(template){return template('src/artModules/daren/media_reg_info', function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,id=$data.id,mediaType=$data.mediaType,principalName=$data.principalName,principalDescription=$data.principalDescription,contacts=$data.contacts,contactPhone=$data.contactPhone,contactTitle=$data.contactTitle,contactWechat=$data.contactWechat,contactQq=$data.contactQq,contactWangwang=$data.contactWangwang,contactDingding=$data.contactDingding,paymentPayeeName=$data.paymentPayeeName,paymentPayeeBankAccount=$data.paymentPayeeBankAccount,paymentPayeeBankBranch=$data.paymentPayeeBankBranch,paymentPayeePhone=$data.paymentPayeePhone,paymentPayeeIdCard=$data.paymentPayeeIdCard,paymentPayeeVAccount=$data.paymentPayeeVAccount,includingTax=$data.includingTax,$out='';$out+='<div class="modal fade" id="media_reg_info_modal"> <div class="modal-dialog" style="width: 60%;"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title">达人主体信息</h4> </div> <div class="modal-body col-sm-12"> <div>  <ul class="nav nav-tabs" role="tablist"> <li role="presentation" class="active"> <a href="#regInfo_basic" aria-controls="regInfo_basic" role="tab" data-toggle="tab">基本信息</a> </li> <li role="presentation"> <a href="#regInfo_contactMethod" aria-controls="regInfo_contactMethod" role="tab" data-toggle="tab">联系方式</a> </li> <li role="presentation"> <a href="#regInfo_SettMethod" aria-controls="regInfo_SettMethod" role="tab" data-toggle="tab">付款方式</a> </li> </ul>  <div class="tab-content"> <div role="tabpanel" class="tab-pane active" id="regInfo_basic">  <br> <form class="form-horizontal" id="regInfo_basic_form"> <input type="hidden" name="id" value="';
$out+=$escape(id);
$out+='" /> <div class="form-group"> <label for="mediaType" class="col-sm-3 control-label">账号类型</label> <div class="col-sm-9"> <label class="radio-inline"> <input type="radio" name="mediaType" value="1" ';
if(mediaType == 1){
$out+='checked="checked"';
}
$out+='> 个人 </label> <label class="radio-inline"> <input type="radio" name="mediaType" value="2" ';
if(mediaType == 2){
$out+='checked="checked"';
}
$out+='> 公司/工作室 </label> </div> </div> <div class="form-group"> <label for="principalName" class="col-sm-3 control-label">公司/工作室名称</label> <div class="col-sm-9"> <input type="text" class="form-control" id="principalName" name="principalName" value="';
$out+=$escape(principalName);
$out+='"> </div> </div> <div class="form-group"> <label for="principalDescription" class="col-sm-3 control-label">公司/工作室简介</label> <div class="col-sm-9"> <textarea class="form-control" rows="3" id="principalDescription" name="principalDescription"> ';
$out+=$escape(principalDescription);
$out+='</textarea> </div> </div> <div class="form-group"> <div class="col-sm-offset-11 col-sm-10"> <button type="button" class="btn btn-default bind bind-click" validate-form="regInfo_basic_form" bind-method="submitMediaRegInfo" data-rtype="1">保存</button> </div> </div> </form> </div> <div role="tabpanel" class="tab-pane" id="regInfo_contactMethod">  <br /> <form class="form-inline" id="regInfo_contractMethod_form"> <input type="hidden" name="id" value="';
$out+=$escape(id);
$out+='" /> <div class="form-group col-sm-4"> <label for="">业务联系人*</label> <input type="text" class="form-control" id="contacts" name="contacts" style="width: 100%;" value="';
$out+=$escape(contacts);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">联系电话*</label> <input type="text" class="form-control" id="contactPhone" name="contactPhone" style="width: 100%;" value="';
$out+=$escape(contactPhone);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">职位</label> <input type="text" class="form-control" id="contactTitle" name="contactTitle" style="width: 100%;" value="';
$out+=$escape(contactTitle);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">微信号</label> <input type="text" class="form-control" id="contactWechat" name="contactWechat" style="width: 100%;" value="';
$out+=$escape(contactWechat);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">QQ号</label> <input type="text" class="form-control" id="contactQq" name="contactQq" style="width: 100%;" value="';
$out+=$escape(contactQq);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">旺旺号</label> <input type="text" class="form-control" id="contactWangwang" name="contactWangwang" style="width: 100%;" value="';
$out+=$escape(contactWangwang);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">钉钉号</label> <input type="text" class="form-control" id="contactDingding" name="contactDingding" style="width: 100%;" value="';
$out+=$escape(contactDingding);
$out+='"> </div> <div class="form-group col-sm-12"> <div class="col-sm-offset-11 col-sm-10"> <button type="button" class="btn btn-default bind bind-click" validate-form="regInfo_contractMethod_form" bind-method="submitMediaRegInfo" data-rtype="2">保存</button> </div> </div> </form> </div> <div role="tabpanel" class="tab-pane" id="regInfo_SettMethod">  <br /> <form class="form-inline" id="regInfo_SettMethod_form"> <input type="hidden" name="id" value="';
$out+=$escape(id);
$out+='" /> <div class="form-group col-sm-4"> <label for="">结算方式*</label> <select class="form-control required" id="add_or_edit_settlement_method" name="paymentSettleMethod" style="width: 100%;"> </select> </div> <div class="form-group col-sm-4"> <label for="">结算周期*</label> <select class="form-control required" id="add_or_edit_settlement_period" name="paymentSettlePeriod" style="width: 100%;"> </select> </div> <div class="form-group col-sm-4"> <label for="">开票类型*</label> <select class="form-control required" id="add_or_edit_invoice_type" name="paymentInvoiceType" style="width: 100%;"> </select> </div> <div class="form-group col-sm-4"> <label for="">收款人姓名*</label> <input type="text" class="form-control" id="paymentPayeeName" name="paymentPayeeName" style="width: 100%;" value="';
$out+=$escape(paymentPayeeName);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">收款人银行卡号*</label> <input type="text" class="form-control" id="paymentPayeeBankAccount" name="paymentPayeeBankAccount" style="width: 100%;" value="';
$out+=$escape(paymentPayeeBankAccount);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">开户银行*</label> <select class="form-control " id="add_dr_payee_bank" name="paymentPayeeBank" style="width: 100%;"> </select> </div> <div class="form-group col-sm-4"> <label for="">开户支行*</label> <input type="text" class="form-control" id="paymentPayeeBankBranch" name="paymentPayeeBankBranch" style="width: 100%;" value="';
$out+=$escape(paymentPayeeBankBranch);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">收款人电话</label> <input type="text" class="form-control" id="paymentPayeePhone" name="paymentPayeePhone" style="width: 100%;" value="';
$out+=$escape(paymentPayeePhone);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">收款人身证号</label> <input type="text" class="form-control" id="paymentPayeeIdCard" name="paymentPayeeIdCard" style="width: 100%;" value="';
$out+=$escape(paymentPayeeIdCard);
$out+='"> </div> <div class="form-group col-sm-4"> <label for="">V账号</label> <input type="text" class="form-control" id="paymentPayeeVAccount" name="paymentPayeeVAccount" style="width: 100%;" value="';
$out+=$escape(paymentPayeeVAccount);
$out+='"> </div> <div class="form-group col-sm-8"> <label for="mediaType" class="col-sm-3 control-label">费用报价*</label> <br /> <div class="col-sm-12"> <label class="radio-inline"> <input type="radio" class="required" name="includingTax" value="1" ';
if(includingTax == 1){
$out+='checked="checked"';
}
$out+='> 代缴税费 </label> <label class="radio-inline"> <input type="radio" class="required" name="includingTax" value="2" ';
if(includingTax == 2){
$out+='checked="checked"';
}
$out+='> 含税 </label> </div> </div> <div class="form-group col-sm-12"> <div class="col-sm-offset-11 col-sm-10"> <button type="button" class="btn btn-default bind bind-click" validate-form="regInfo_SettMethod_form" bind-method="submitMediaRegInfo" data-rtype="3">保存</button> </div> </div> </form> </div> </div> </div> </div> <div class="modal-footer"></div> </div> </div> </div> ';
return new String($out);
});});