var site = {
	siteName: "Kiko's blog",
	IESuportedVersion: 8,
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
		},
		"#ad-killer": {
			fileName: "adKiller",
			titleFragment: " | 广告杀手-插件"
		}
	},
	suguestedBrowsers: [
		{name: "Chrome", downloadLink: "http://www.google.com/intl/zh-CN/chrome/browser"}, 
		{name: "Firefox", downloadLink: "http://firefox.com.cn"},
		{name: "Safari", downloadLink: "http://www.apple.com.cn/safari"},
		{name: "Opera", downloadLink: "http://www.opera.com"},
		{name: "IE9", downloadLink: "http://windows.microsoft.com/zh-cn/internet-explorer/downloads/ie-9/worldwide-languages"}
	],
	init: function(hash){
		var me = this;
			browserSuported = this.checkBrowser(this.IESuportedVersion);
		$(document).ready(function(){
			me.cache();
			if(browserSuported){
				window.onhashchange = function(){
					me.refreshPage();
				};
				if(location.hash == "") location.hash = hash;
				else window.onhashchange();
				// me.preventLinkDefault();
			} else {
				me.showNotSuportedPage();
			}
		})
	},
	cache: function(){
		this.win = $(window);
		this.body = $("body");
		this.container = $(".content .inner");
		this.loading = $(".loading");
	},
	preventLinkDefault: function(){
		this.body.delegate("a", "click", function(e){
			var href = $(this).attr("href");
			e.preventDefault();
			location.hash = href;
		})
	},
	hashchangeHandler: function(){
		var fragment = this.router[location.hash];
		this.refreshPage(fragment);
	},
	refreshPage: function(fragment){
		var hash = location.hash,
			routerMap = this.routerMap,
			IESuportedVersion = this.IESuportedVersion,
			container = this.container,
			me = this,
			fragment, pageTitle, isSuported;

		if(!routerMap[hash]) {
			fragment = "404";
			pageTitle = this.siteName + " | 404"
		} else {
			fragment = routerMap[hash].fileName,
			pageTitle = this.siteName + routerMap[hash].titleFragment
		}

		document.title = pageTitle;
		switch(fragment){
			case "smartspot":
				IESuportedVersion = 9;
				break;
			case "ename":
				IESuportedVersion = 9;
				break;
			case "radarcharts":
				IESuportedVersion = 100;	
				break;
		}

		isSuported = this.checkBrowser(IESuportedVersion);
		if(isSuported){
			container.html("加载中...").load("/page/"+ fragment +".html", function(){
				me.hideLoading();
			});
			this.showLoading();
		} else {
			var container = this.container,
				isIEInclude = (IESuportedVersion == 100) ? false : true,
				suguestedList = this.getSugguestedList(isIEInclude);
			container.html('<h1>该项目需要使用对HTML5特性支持较好的浏览器才能查看</h1>\
								<p class="mt-m mb-s">建议使用以下浏览器查看该项目：</p>');
			container.append(suguestedList);
		}

	},
	showLoading: function(){
		this.loading.css({
			right: 0,
			opacity: 1
		});
	},
	hideLoading: function(){
		var loadingWidth = this.loading.outerWidth();

		this.loading.animate({
			right: "-=100",
			opacity: 0
		})
	},
	checkBrowser: function(IEVersion){ // type: "page" or "project" 
		var userAgent = navigator.userAgent.toLowerCase().match(/(chrome|firefox|safari|opera|msie)/gi)[0],
			version = (userAgent == "msie") ? navigator.userAgent.toLowerCase().match(/msie\s*\d+/gi)[0].match(/\d+/) : 1000;
			IESuportedVersion = IEVersion ? IEVersion : this.IESuportedVersion;

		if(!userAgent){
			userAgent = "other";
		}	

		if(userAgent == "msie"){
			if(version < IESuportedVersion) return false;
		}

		return true;
	},
	showNotSuportedPage: function(){
		var body = this.body;
			suguestedList = this.getSugguestedList(true);
		
		body.html('<div style="width: 40%; margin: 100px auto 0 auto; background-color: #eff5f2;">\
							<div class="inner p-l">\
								<h1>抱歉，您使用的浏览器版本过低</h1>\
								<p class="mt-m mb-s">建议使用以下浏览器浏览本网站：</p>\
							</div>\
						</div>');
		body.find(".inner").append(suguestedList);
	},
	getSugguestedList: function(isIEInclude){
		var list = '<ul>',
			suguestedBrowsers = this.suguestedBrowsers;

		if(!isIEInclude){
			suguestedBrowsers = suguestedBrowsers.slice(0, suguestedBrowsers.length - 1)
		}

		for(var i = 0; i < suguestedBrowsers.length; i++){
			var browser = suguestedBrowsers[i];
			list += '<li><a target="_blank" href="'+ browser.downloadLink +'">'+ browser.name +'</a></li>';
		}
		return list + '</ul>';
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