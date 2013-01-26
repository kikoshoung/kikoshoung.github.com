app.search = {
	param: {
		name: "",
		py_name: "",
		sortBy: "", // pronouciation || means 
		gender: "", // m(male) || fe(female)
	},
	listTpl: '<ul>\
					<% if(data.length){ %>\
						<% _.each(data, function(list, key){ %>\
							<li class="p-m <%= (key == 0 ? "first" : "") %>">\
								<p class="mb-s clearfix mb-l"><span class="text-blue font-20 lh-30 fl"><%= list.val %></span><span class="icon icon-30 icon-speaker ml-m fl" data-name="<%= list.val %>"></span></p>\
								<p class="font-14 m-0 text-gray"><strong>译名：</strong><%= list.inchinese %></p>\
								<p class="font-14 m-0 text-gray"><strong>释义：</strong><%= list.means %></p>\
							</li>\
						<% }) %>\
					<% } else { %>\
						<li class="first align-c pt-l pb-l">\
							<p class="text-red">Ooops~没有搜索到结果。</p>\
							<p>我们正在努力扩建词库，</p>\
							<p>在此期间您也可以<a href="list.html" class="underlined-link">自行浏览</a>到中意的结果。</p>\
						</li>\
					<% } %>\
				</ul>',
	analyse: function(){
		var reg = new RegExp("^[A-Za-z\u4e00-\u9fff ]+$");
		if(reg.test(this.param.name)){
			switch(this.param.sortBy){
				case "pronouciation":
					this.sortByPronouciation();
					break;
				case "means":
					this.sortByMeans();
					break;
			}
		} else {
			alert("请输入正确的名字！")
		}
	},
	sortByPronouciation: function(){
		var py_name = this.param.py_name,
			py_name_head = py_name.substr(0, 1),
			originalArr,
			resultArr = [];

		if(app.lib[this.param.gender +"_"+ this.param.sortBy][py_name_head]) {
			originalArr = app.lib[this.param.gender +"_"+ this.param.sortBy][py_name_head].concat(); // copy arr
			for(i in py_name){
				for(var j in originalArr){
					if(originalArr[j].py_val.match(py_name)) {
						resultArr.push(originalArr[j]);
						delete originalArr[j];
					}
				}
				py_name = py_name.substr(0, py_name.length - 1);
			}
		} 

		this.suggestList = resultArr;
		this.showSuggest();
	},
	sortByMeans: function(){
		var reg = new RegExp("^[\u4e00-\u9fff ]+$");
		if(reg.test(this.param.name)){
			var key_words = this.getKeywords(this.param.name),
				originalArr,
				resultArr = [];

			if(app.lib[this.param.gender +"_letter"]){
				originalArr = app.clone(app.lib[this.param.gender +"_letter"]);
				for(var k in key_words){ 
					for(var i in originalArr){
						for(var j in originalArr[i]){
							if(originalArr[i][j].means.match(key_words[k])){
								resultArr.push(originalArr[i][j]);
							}
						}
					}
				}
			}
			
			this.suggestList = this.filterResult(resultArr);
			this.showSuggest();
		} else {
			alert("按释义搜索时，请填写汉字以方便查找。")
		}
		
	},
	filterResult: function(arr){ // 去掉重复的项，如“美丽的少女”会在关键词为“美女”的情况下重复出现，因为关键字为[美， 女]
		var resultArr = [];
		for(var i in arr){
			if(resultArr.length){
				var matched = false;
				for(var j in resultArr){
					if(resultArr[j] == arr[i]){
						matched = true;
					}
				}
				if(!matched){
					resultArr.push(arr[i]);
				}
			} else {
				resultArr.push(arr[i]);
			}
		}

		return resultArr;
	},
	showSuggest: function(){
		var list = _.template(this.listTpl)({data: this.suggestList});
		$(".suggest-list").html(list);
		$("body").scrollTop(0);
	},
	getKeywords: function(str){
		var resultArr = [];
		for(var len = 1; len <= str.length; len++){
			var this_len_arr = []; // len 长度下的 arr
			for(var pos = 0; pos <= str.length - len; pos++){
				this_len_arr.unshift(str.substr(pos, len));
			}
			resultArr = resultArr.concat(this_len_arr);
		}
		resultArr = this.minifyKeywords(resultArr);
		return resultArr.reverse();
	},
	minifyKeywords: function(arr){
		var resultArr = [];
		for(var i in arr){
			if(resultArr.length){
				var isRepeat = false;
				for(var j in resultArr){
					if(resultArr[j] == arr[i]){
						isRepeat = true;
					}
				}
				if(!isRepeat){
					resultArr.push(arr[i]);	
				}
			} else {
				resultArr.push(arr[i]);
			}
		}
		return resultArr;
	}
};
