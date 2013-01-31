var site = {
	siteName: "K-Site",
	routerMap: {
		"#timeline": {
			fileName: "timeline",
			titleFragment: " | 时间线" 
		},
		"#profile": {
			fileName: "profile",
			titleFragment: " | 简历"
		},
		"#smart-spot": {
			fileName: "smartspot",
			titleFragment: " | Smart找茬"
		},
		"#e-name": {
			fileName: "ename",
			titleFragment: " | 起个洋名儿"
		},
		"#radar-charts": {
			fileName: "radarcharts",
			titleFragment: " | Radarcharts"
		}
	},
	suportedBrowsers: [
		{name: "Chrome", downloadLink: ""}, 
		{name: "Firefox", downloadLink: ""},
		{name: "Safari", downloadLink: ""}
	],
	init: function(hash){
		var me = this;
		this.cache();
		window.onhashchange = function(){
			me.refreshPage();
		};
		if(location.hash == "") location.hash = hash;
		else window.onhashchange();

	},
	checkBrowser: function(){

	},
	cache: function(){
		this.container = $(".content .inner");
	},
	hashchangeHandler: function(){
		var fragment = this.router[location.hash];
		this.refreshPage(fragment);
	},
	refreshPage: function(fragment){
		var hash = location.hash,
			routerMap = this.routerMap,
			fragment, pageTitle;

		if(!routerMap[hash]) {
			fragment = "404";
			pageTitle = this.siteName + " | 404"
		} else {
			fragment = routerMap[hash].fileName,
			pageTitle = this.siteName + routerMap[hash].titleFragment
		}

		document.title = pageTitle;
		this.container.html("加载中...").load("/page/"+ fragment +".html");
	},
	codeareaHandler: function(area){
		area.each(function(){
			var thisArea = $(this),
				// codeStr = $.trim(thisArea.text()),
				codeStr = $.trim(thisArea.text()),
				// codeStr = codeStr.replace(/\n.*$/, ""),
				codeRows = codeStr.match(/((.*)\n|\n?(.*)\n?)/g),
				codeRows = codeRows.slice(0, codeRows.length - 1), // ugly method!
				len = codeRows.length,
				rowList = '<ul class="code-row-list">',
				handledCodeStr = '';

			for(var i = 1; i <= len; i++){
				handledCodeStr += '<p><span class="num">'+ i +'</span>'+ codeRows[i - 1] +'</p>';
			}
			rowList += '</ul>';
			handledCodeStr = '<code>'+ handledCodeStr +'</code>';
			thisArea.html(handledCodeStr);
			console.log(codeRows)
			console.log(thisArea.text().match(/var/))
			console.log($.trim(thisArea.text()))
		})
		
	}
}

site.init("timeline");