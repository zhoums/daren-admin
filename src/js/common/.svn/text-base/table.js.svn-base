var DATATABLE_SETTINGS = {
	dom: "<'dataTables_header clearfix'<'col-md-4'l><'col-md-8'Cf>r>t<'dataTables_footer clearfix'<'col-md-2'i><'col-md-10'p>>",
	scrollY:        "540px",
    lengthMenu: 	[[15, 30, 50, -1], [15, 30, 50, "全部"]],
    processing: 	true,
    order: 			[[ 0, "desc" ]],
}

function columnSetting(id, options) {
	id = id.startsWith("#") ? id : "#" + id;
	var columnDefs = []
	var sumColumns = [];
	$("thead tr th",id).each(function(i){
		var columnDef = {}
		columnDef.targets = i
		columnDef.data = $(this).attr('field')
		if ($(this).attr('orderable'))
			columnDef.orderable = (/^true$/i).test($(this).attr('orderable'))
		if ($(this).attr("className")) {
			columnDef.className = $(this).attr("className")
		}
		if ($(this).attr("visible")) {
			columnDef.visible = (/^true$/i).test($(this).attr('visible'))
		}
		if ($(this).attr("sum") && (/^true$/i).test($(this).attr('sum'))) {
			sumColumns.push(i)
		}
		columnDefs.push(columnDef)
	})
	
	if (options.columnDefs) {
		$.each(options.columnDefs, function(index, value){
			if (value.field) {
				var fields = [].concat(value.field); //value.field 有可能是字符或数组，通过concat来统一使用数据处理
				for (var i = 0; i < columnDefs.length; i++) {
					if (jQuery.inArray(columnDefs[i].data, fields) > -1) {
						if (value.render)
							columnDefs[i].render = value.render
					}
				}
			}
			if (value.targets) {
				var targets = [].concat(value.targets);
				for (var i = 0; i < targets.length; i++) {
					var target = targets[i];
					var target = target < 0 ? (columnDefs.length + target) : target;
					if (value.render)
						columnDefs[target].render = value.render
				}
			} 
		})
	}
	options.columnDefs = columnDefs
	//汇总行
	if (sumColumns.length > 0) {
		//添加表脚
		$("tfoot",id).remove()
		$(id).append("<tfoot><tr></tr></tfoot>")
		for (var x in columnDefs) {
			$("tfoot tr",id).append('<td></td>')
		}
		options.footerCallback = function(row, data, start, end, display){
			sumValues = new Array(sumColumns.length);
			for (var x in sumColumns) {
				var api = this.api()
				sumValues[x] = api.column(sumColumns[x]).data().reduce(function (a, b) {
	                return a + b;
	            }, 0);
				$(api.column(sumColumns[x]).footer()).html(sumValues[x]);
			}
		}
	}
	return options
}

function fixedColumnsTable(id, options) {
	id = id.startsWith("#") ? id : "#" + id;
	var options = columnSetting(id, options)
	var settings = $.extend({}, DATATABLE_SETTINGS, {
		paging		: true,
		serverSide	: true,
	})
	var table = $(id).DataTable($.extend(settings, options));
	return table;
}

function serverSideTable(id, options) {
	id = id.startsWith("#") ? id : "#" + id;
	var options = columnSetting(id, options)
	var settings = $.extend({}, DATATABLE_SETTINGS, {})
	var table = $(id).DataTable($.extend(settings, options));
	if (options.index) {
		table.on( 'order.dt search.dt', function () {
			table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	}
	return table;
}



