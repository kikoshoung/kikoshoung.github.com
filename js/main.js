var site = {
	router: {
		"#index": "index",
		"#profile": "profile"
	},
	init: function(hash){
		var me = this;
		this.cache();
		window.onhashchange = function(){
			me.hashchangeHandler();
		};
		if(location.hash == "") location.hash = hash;
		else window.onhashchange();

	},
	cache: function(){
		this.container = $(".content .inner");
	},
	hashchangeHandler: function(){
		var fragment = this.router[location.hash];
		this.refreshPage(fragment);
	},
	refreshPage: function(fragment){
		if(!fragment) fragment = "404";
		this.container.html("加载中...").load("/page/"+ fragment +".html");
	}
}

site.init("index");