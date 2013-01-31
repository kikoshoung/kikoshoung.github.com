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
	init: function(hash){
		var me = this;
			browserSuported = this.checkBrowser("page");
		$(document).ready(function(){
			if(browserSuported){
				me.cache();
				window.onhashchange = function(){
					me.refreshPage();
				};
				if(location.hash == "") location.hash = hash;
				else window.onhashchange();
			} else {
				$("body").html("not suprted!");
			}
		})
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
	checkBrowser: function(type, callback){ // "page" or "project" 
		var userAgent = navigator.userAgent.toLowerCase().match(/(chrome|firefox|safari|opera|msie)/gi)[0],
			notSuportedBrowsers = {
				page: {name: "IE", version: 7},
				project: {name: "IE", version: "all"}
			},
			suportedBrowsers = [
				{name: "Chrome", downloadLink: ""}, 
				{name: "Firefox", downloadLink: ""},
				{name: "Safari", downloadLink: ""},
				{name: "Opera", downloadLink: ""}
			];
			
		if(!userAgent){
			userAgent = "other";
		}	
		if(!type || type == "page"){ 
			if(userAgent == "msie"){
				var version = navigator.userAgent.toLowerCase().match(/msie\s*\d/gi)[0].match(/\d/);
				if(version < notSuportedBrowsers["page"].version) return false;
			}
		} else { 
			if(userAgent == "msie") return false;
		}
		console.log(userAgent);
		return true;
	},
	codeareaHandler: function(area){
		area.each(function(){
			var thisArea = $(this),
				codeStr = $.trim(thisArea.text()),
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
		})
	}
}

site.init("timeline");