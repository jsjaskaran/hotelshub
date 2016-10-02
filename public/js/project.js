var globalApiUrl = "/api/v1";

// bring results
// specify full url, and name for template
function bringResults(url, name){

	$.get('/data-templates/'+name+'.ejs', function(template){

		var func = ejs.compile(template);

		$.ajax({
			url: url,
			type: 'GET',
			success: function(d){
				if(d['status'] == "success"){
					var html = '';
					html += func({content: d['data']['documents']});
					$(".all-results").html(html);
					getStatsData();
				}
			},
			error: function(err){
				console.log(err);
			}
		});
	});

}

function makeNormalCall(){
	var url = globalApiUrl + '/list';
	bringResults(url, 'list');
}

function getUrlParams(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

function getStatsData(){
	$.get('/data-templates/stats.ejs', function(template){

		var func = ejs.compile(template);

		$.ajax({
			url: globalApiUrl + '/stats',
			type: 'GET',
			success: function(d){
				if(d['status'] == "success"){
					var html = '';
					html += func({content: d['data']});
					$(".stats-content").html(html);
				}
			},
			error: function(err){
				console.log(err);
			}
		});
	});
}

function processSearch(val){
	$.get('/data-templates/list.ejs', function(template){

		var func = ejs.compile(template);

		$.ajax({
			url: globalApiUrl + '/search?query=' + val,
			type: 'GET',
			success: function(d){
				if(d['status'] == "success"){
					var html = '';
					html += func({content: d['data']});
					$(".search-results").html(html);
				}
			},
			error: function(err){
				console.log(err);
			}
		});
	});
}

$(".search-now").on('click', function(e){
	e.preventDefault();
	window.location = '/search?query='+ $("#main-search").val();
});
$("#search-hotels").on('submit', function(e){
	e.preventDefault();
	window.location = '/search?query='+ $("#main-search").val();
});

$(".breadcrumb a").on('click', function(e){
	e.preventDefault();
	var param = getUrlParams('sortBy', window.location);

	if(param == null){
		window.location = '/list?page=' + $(this).attr('data-href');
	}else{
		window.location = '/list?sortBy=' + param + '&page=' + $(this).attr('data-href');
	}
});

$("input[name='sort-results']").on('click', function(){
	var param = getUrlParams('page', window.location);

	if(param == null){
		window.location = '/list?sortBy=' + $(this).attr('data-sort-name');
	}else{
		window.location = '/list?page=' + param + '&sortBy=' + $(this).attr('data-sort-name');
	}
});

/* defining routes */
var route = {
	_routes : {}, // the routes will be stored here

	add : function(url, action){
		this._routes[url] = action;
	},

	run: function(){
		jQuery.each(this._routes, function(pattern){
			if(location.href.match(pattern)){
				this();
			}
		});
	}
};

route.add('/list', function(){
	makeNormalCall();
});

route.add('/list.*', function(){
	var pageNum = getUrlParams('page', window.location);
	var sortOrder = getUrlParams('sortBy', window.location);
	var url = '';

	if(pageNum != undefined && sortOrder != undefined){
		url = globalApiUrl + '/list?page=' + pageNum + '&sortBy=' + sortOrder;
	}else if(pageNum != undefined && sortOrder == undefined){
		url = globalApiUrl + '/list?page=' + pageNum;
	}else if(pageNum == undefined && sortOrder != undefined){
		url = globalApiUrl + '/list?sortBy=' + sortOrder;
	}
	bringResults(url, 'list');
	if(pageNum != undefined)
		$('.pagination a[data-href='+pageNum+']').parent().addClass('active');
	if(sortOrder != undefined){
		console.log('rating: ', sortOrder);
		$('#'+sortOrder+'-radio').attr('checked', 'checked');
	}
});

route.add('/stats', function(){
	getStatsData();
});

route.add('/search\\?query=[a-zA-Z0-9]+', function(){
	var query = getUrlParams('query', window.location);
	processSearch(query);
});

route.run();