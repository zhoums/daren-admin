/*TMODJS:{"version":17,"md5":"4d731e80749b874be95d26ce03200bec"}*/
define(['../../../template',''],function(template){return template('src/artModules/common/menu', function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,url=$data.url,$string=$utils.$string,icon=$data.icon,name=$data.name,$each=$utils.$each,submenus=$data.submenus,item=$data.item,i=$data.i,memu=$data.memu,j=$data.j,$out='';$out+='<li> <a class="J_menuItem" href="';
$out+=$escape(url);
$out+='" data-index="';
$out+=$escape(url);
$out+='" > <i class="';
$out+=$string(icon);
$out+='"></i> <span class="nav-label">';
$out+=$escape(name);
$out+='</span> <span class="fa arrow icon-angle-right"></span> </a> <ul class="nav nav-second-level" aria-expanded="false"> ';
$each(submenus,function(item,i){
$out+=' <li> <a class="J_menuItem" href="';
$out+=$escape(item.url);
$out+='" data-index="';
$out+=$escape(item.url);
$out+='">';
$out+=$escape(item.name);
$out+='</a> ';
if(item.submenus.length>0){
$out+=' <ul class="nav nav-third-level"> ';
$each(item.submenus,function(memu,j){
$out+=' <li><a class="J_menuItem" href="';
$out+=$escape(item.submenus[j].url);
$out+='" data-index="';
$out+=$escape(item.submenus[j].url);
$out+='">';
$out+=$escape(item.submenus[j].name);
$out+='</a></li> ';
});
$out+=' </ul> ';
}
$out+=' </li> ';
});
$out+=' </ul> </li> ';
return new String($out);
});});