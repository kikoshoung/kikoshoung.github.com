var site = {
	siteName: "Kiko's blog",
	IESupportedVersion: 8,
	routerMap: {
		"timeline": {
			fileName: "timeline",
			titleFragment: " | 时间线" 
		},
		"profile": {
			fileName: "profile",
			titleFragment: " | 简历"
		},
		"smart-spot": {
			fileName: "smart-spot",
			titleFragment: " | Smart找茬"
		},
		"e-name": {
			fileName: "ename",
			titleFragment: " | 起个洋名儿"
		},
		"radar-charts": {
			fileName: "radarcharts",
			titleFragment: " | Radarcharts"
		},
		"ad-killer": {
			fileName: "ad-killer",
			titleFragment: " | 广告杀手-插件"
		},
		"scratch-card": {
			fileName: "scratch-card",
			titleFragment: " | 刮刮卡"
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
		var self = this;
			browserSupported = this.checkBrowser(this.IESupportedVersion);
		$(document).ready(function(){
			self.cacheElement();
			if(browserSupported){
				self.bindSidebar();
				window.onhashchange = function(){
					self.refreshPage();
				};
				if(location.hash == "") location.hash = hash;
				else window.onhashchange();
				self.preventLinkDefault();
			} else {
				self.showNotSupportedPage();
			}
		})
	},
	cacheElement: function(){
		this.win = $(window);
		this.body = $("body");
		this.container = $(".content .inner");
		this.loading = $(".loading");
	},
	bindSidebar: function(){
		var win = this.win,
			bar = $('#fix-block'),
			offset = bar.offset(),
			width = bar.outerWidth();

		win.on('scroll', function(e){
			width = bar.outerWidth();
			if(win.scrollTop() >= offset.top){
				bar.addClass('active').width(width);
			} else {
				bar.removeClass('active').width('auto');
			}
		});
		win.on('resize', function(e){
			offset = bar.offset();
			width = bar.outerWidth();
			bar.removeClass('active').width('auto');
		});
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
			IESupportedVersion = this.IESupportedVersion,
			container = this.container,
			self = this,
			fragment, pageTitle, isSupported;

		hash = hash.substr(1, hash.length);

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
			case "ename":
			case "radarcharts":
				IESupportedVersion = 9;	
				break;
		}

		isSupported = this.checkBrowser(IESupportedVersion);
		if(isSupported){
			container.html("加载中...").load("/page/"+ fragment +".html", function(){
				self.hideLoading();
			});
			this.showLoading();
		} else {
			var container = this.container,
				isIEInclude = (IESupportedVersion == 100) ? false : true,
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
			IESupportedVersion = IEVersion ? IEVersion : this.IESupportedVersion;

		if(!userAgent){
			userAgent = "other";
		}	

		if(userAgent == "msie"){
			if(version < IESupportedVersion) return false;
		}

		return true;
	},
	showNotSupportedPage: function(){
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