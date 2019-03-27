/*TMODJS:{"version":18,"md5":"d1c9c012b8bee4450026bbad83245a86"}*/
define(['../../../template',''],function(template){return template('src/artModules/daren/dr_resource_list_data_by_daren_list', function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,drResources=$data.drResources,item=$data.item,$index=$data.$index,$escape=$utils.$escape,$string=$utils.$string,id=$data.id,platform=$data.platform,$out='';$out+='<div class="pre-scrollable" style="max-height: 280px;"> <table class="table table-hover"> <thead> <tr> <th>渠道</th>  <th>执行价(元)</th> <th>报价备注</th> <th>审核状态</th> <th>操作</th> <th>渠道状态</th> </tr> </thead> <tbody> ';
$each(drResources,function(item,$index){
$out+=' <tr> <td>';
$out+=$escape(item.resourceTypeStr);
$out+='</td> <!-- <td>';
$out+=$escape(item.price);
$out+='</td> --> <td>';
$out+=$escape(item.discountPrice);
$out+='</td> <td>';
$out+=$escape(item.priceRemark);
$out+='</td> <td>';
$out+=$escape(item.auditStatusStr);
$out+='</td> <td>';
$out+=$string( item.op);
$out+='</td> <td>';
$out+=$string( item.isEnabledStr);
$out+='</td> </tr> ';
});
$out+=' </tbody> </table> </div> <a href="javascript:;" class="bind bind-click" data-diid="';
$out+=$escape(id);
$out+='" data-platform="';
$out+=$escape(platform);
$out+='" bind-method="openDarenResourceManagerModalForClick" style="text-decoration: underline;" >添加渠道报价</a>';
return new String($out);
});});