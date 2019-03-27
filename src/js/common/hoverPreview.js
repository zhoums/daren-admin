(function($) {
    $.fn.extend({
	hoverPreview : function(style) {
	    var that = this;
	    var x = 10;
	    var y = 20;
	    $(that).mouseover(function(e) {
		var iurl = $.trim($(that).data("iurl"));
		if(iurl == null || iurl == "" || iurl == undefined){
		    alert("error：绑定的元素不存在data-iurl属性或为空值！");
		    return;
		}
		var tooltip = "<div id='hp-show-tip' style='position: absolute;border: 1px solid #ccc;background: #333;padding: 2px;display: none;color: #fff;z-index:9999;'><img style='width:100%;' src='" + iurl + "' /><\/div>";
		tooltip = $(tooltip);
		if(style){
		    $.extend(style,{
			"position" : "absolute",
			"border" : "border: 1px solid #ccc",
			"padding" : "2px",
			"display" : "none",
			"z-index":9999
		    });
		    tooltip.css(style);
		}
		$("body").append(tooltip); // 把它追加到文档中
		$("#hp-show-tip").css({
		    "top" : (e.pageY + y) + "px",
		    "left" : (e.pageX + x) + "px"
		}).show("fast"); // 设置x坐标和y坐标，并且显示
	    }).mouseout(function() {
		$("#hp-show-tip").remove(); // 移除
	    }).mousemove(function(e) {
		$("#hp-show-tip").css({
		    "top" : (e.pageY + y) + "px",
		    "left" : (e.pageX + x) + "px"
		});
	    });
	}
    });
})(jQuery);