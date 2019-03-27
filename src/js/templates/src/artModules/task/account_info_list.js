/*TMODJS:{"version":6,"md5":"0748aeee40b4c251996bda0fde9dca7f"}*/
define(['../../../template',''],function(template){return template('src/artModules/task/account_info_list', function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,idStr=$data.idStr,resourceItemIdStr=$data.resourceItemIdStr,estRetrieveTime=$data.estRetrieveTime,shopNames=$data.shopNames,aeName=$data.aeName,resourceLocationStr=$data.resourceLocationStr,drName=$data.drName,drFee=$data.drFee,mainProducts=$data.mainProducts,platformStr=$data.platformStr,statusStr=$data.statusStr,pv=$data.pv,uv=$data.uv,settlementStatus=$data.settlementStatus,auditRemark=$data.auditRemark,op=$data.op,$out='';$out+='<tr> <td>';
$out+=$escape(idStr);
$out+='</td> <td>';
$out+=$escape(resourceItemIdStr);
$out+='</td> <td>';
$out+=$escape(estRetrieveTime);
$out+='</td> <td>';
$out+=$escape(shopNames);
$out+='</td> <td>';
$out+=$escape(aeName);
$out+='</td> <td>';
$out+=$escape(resourceLocationStr);
$out+='</td> <td>';
$out+=$escape(drName);
$out+='</td> <td>';
$out+=$escape(drFee);
$out+='</td> <td>';
$out+=$escape(mainProducts);
$out+='</td> <td>';
$out+=$escape(platformStr);
$out+='</td> <td>';
$out+=$escape(statusStr);
$out+='</td> <td>';
$out+=$escape(pv);
$out+='</td> <td>';
$out+=$escape(uv);
$out+='</td> <td>';
$out+=$escape(settlementStatus);
$out+='</td> <td>';
$out+=$escape(auditRemark);
$out+='</td> <td>';
$out+=$escape(op);
$out+='</td> </tr> ';
return new String($out);
});});