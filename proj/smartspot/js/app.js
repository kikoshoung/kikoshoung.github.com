
var app = {

/*
|--------------------------------------------------------------------------
| data
|--------------------------------------------------------------------------
*/
	storageData : {},
	xmlData : {},
	stageData : {},
	windowInfo : {},
	diffPerPage : 3,
	timeToCount : 100,
	timeToCut : 10,

/*
|--------------------------------------------------------------------------
| storageData's functions
|--------------------------------------------------------------------------
*/
	getStorageData : function(callback){
		// localStorage.removeItem("smartspot");
		var localData = localStorage.getItem("smartspot");
		if(!localData){
			app.storageData = app.setDefaultStorageData();
			localStorage.setItem("smartspot", JSON.stringify(app.storageData))
		} else {
			app.storageData = JSON.parse(localData);
		}
	},

	setDefaultStorageData :function(){
		var data = {
			sys : {
				version : "1.0.0",
				name : "Smart找茬"
			},

			user : {
				device : {
					deviceType : ""
				},
				mute : false,
				isNewUser : true
			},

			process : {
				curTheme : 0,

				theme0 : {
					curStage : 0,
					helpNum : 3
				},
				theme1 : {
					curStage : 0,
					helpNum : 3
				},
				theme2 : {
					curStage : 0,
					helpNum : 3
				}
			},

			levels : {

			}

		}

		return data;
	},

	saveStorageData : function(data, callback){
		// if(callback) {
		// 	this.writeCallback = callback;
		// } else {
		// 	this.writeCallback = function(){};
		// }
		
		this.storageData.user = $.extend(this.storageData.user, data.user);
		this.storageData.process = $.extend(this.storageData.process, data.process);
		
		localStorage.setItem("smartspot", JSON.stringify(this.storageData))
		if(callback) callback();
	},


















	
	gotFS_w : function(fileSystem) { 
		fileSystem.root.getFile("storageData.txt", {create: true, exclusive: false}, app.gotFileEntry_w, null); 
	},

	gotFS_r : function(fileSystem) { 
		fileSystem.root.getFile("storageData.txt", {create: true, exclusive: false}, app.gotFileEntry_r, null); 
	},
	
	gotFileEntry_w : function(fileEntry) { 
		fileEntry.createWriter(app.gotFileWriter, null); 
	}, 

	gotFileEntry_r : function(fileEntry) { 
		fileEntry.file(app.gotFileReader, null); 
	}, 
	
	gotFileWriter : function (writer) {
		writer.onwrite = function(evt) { 
			app.writeCallback();
		}; 
		writer.write(JSON.stringify(app.storageData)); 
		// // 文件当前内容是“some sample text”
		// writer.truncate(11); 
		// // 文件当前内容是“some sample” 
		// writer.seek(4); 
		// // 文件当前内容依然是“some sample”，但是文件的指针位于“some”的“e”之后
		// writer.write(" different text"); 
		// // 文件的当前内容是“some different text”
	}, 

	gotFileReader : function(file) {
		app.readAsText(file);
	}, 

	readAsText : function(file) {
		var reader = new FileReader(); 
		reader.onloadend = function(evt) {
			if(evt.target.result.length == 0) { 
				var data = app.setDefaultStorageData();
				app.storageData = data;
				
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.gotFS_w, null);
			} else {
				app.storageData = app.getJSON(evt.target.result);
			}
			app.readCallback();
		}; 
		reader.readAsText(file); 
	},
	getJSON : function(STR){
		STR = JSON.stringify(STR);
		var str = STR.replace(/\\/g, "");
		str = str.replace(/^\"/, "");
		str = str.replace(/\"$/, "");
		return JSON.parse(str);
	},
	  













	preloadingImg : function(){
		var bg1 = new Image();
		var bg2 = new Image();
		var icons = new Image();
		bg1.src = app.gapPath + "images/bg1.jpg";
		bg2.src = app.gapPath + "images/bg2.jpg";
		icons.src = app.gapPath + "images/icons.png";
	},

/*
|--------------------------------------------------------------------------
| stage's functions
|--------------------------------------------------------------------------
*/
	getStageData : function(themeID, stageID){
		//get localStorage data--user stage data(which stage)
		// var curStage = this.storageData.process.stage;
		
		// get xml data--stage data(diff data)
		var stageElData = this.getCurStageData(themeID, stageID, this.xmlData);

		var info = {
			themeID : themeID,
			stageID : stageID,
			helpNum : this.storageData.process["theme" + themeID].helpNum,
			background : stageElData.background,
			elData : this.getRandomEl(stageElData.diffEl),
			themeName : $("#theme"+ (themeID + 1), this.xmlData).attr("title")
		}
		
		this.stageData = info;
		
	},

	getCurStageData : function(themeID, stageID, xmlData){
		var result = {};
		var elArr = [];
		var background = $("#theme"+ (themeID + 1) +" #stage" + (stageID + 1) + " bg", xmlData).attr("url");	

		$("#theme"+ (themeID + 1) +" #stage" + (stageID + 1) + " el", xmlData).each(function(i){
			
			elArr[i] = {};
			
			elArr[i].bgUrl = $(this).attr("url");
			elArr[i].width = $(this).attr("width");
			elArr[i].height = $(this).attr("height");
			elArr[i].left = $(this).attr("left");
			elArr[i].top = $(this).attr("top");

		});	
		
		result.background = background;
		result.diffEl = elArr;
		return result;
	},

	getRandomEl : function(data){
		var result = [],
		resultRandom = [], 
		randomNum ;
		
		while(result.length != this.diffPerPage) {
			
			randomNum = Math.floor(Math.random() * data.length); 
			
			if(result.length == 0) {
				result[result.length] = data[randomNum];
				resultRandom[resultRandom.length] = randomNum;
				
			} else {
				
				var is_diff = true;
				
				for(var i in resultRandom) {

					if(randomNum == resultRandom[i]) {
						is_diff = false;
					}
					
				}
				
				if(is_diff) {
					result[result.length] = data[randomNum];
					resultRandom[resultRandom.length] = randomNum;
				}
			}
			
		}	

		return result;
	},

	setDiffEl : function(){
		var data = this.stageData.elData
		
		this.picDivs.empty();

		this.leftPicDiv.append('<img class="bgimg" src="'+ this.stageData.background +'" />');
		this.rightPicDiv.append('<img class="bgimg" src="'+ this.stageData.background +'" />');
		
		for(var i in data) {
			
			this.leftPicDiv.append('<div id="leftEl'+ i +'" class="leftPart diffEl fresh this mark'+ i +'" val="'+ i +'"></div><img id="rightImg'+ i +'" class="rightPart diffImg this"/>');
			this.rightPicDiv.append('<div id="rightEl'+ i +'" class="rightPart diffEl fresh this mark'+ i +'" val="'+ i +'"></div>');

			$(".diffEl.this").css({
				width		: data[i].width,
				height		: data[i].height,
				left		: data[i].left,
				top			: data[i].top,
				background 	: "white",
				opacity		: 0
			}).removeClass("this");	
			
			$(".diffImg.this").attr({
				src  : data[i].bgUrl
			}).removeClass("this");	
		}	

		this.diffs = $("#stage .diffEl");
	},

/*
|--------------------------------------------------------------------------
| window's functions
|---------------------------------------------------------------------------
*/
	getWindowInfo : function(){
		var info = {
			width : $(window).width(),
			height : $(window).height()
		}
		
		this.windowInfo = info;
	},
	setWindow : function(){
		this.content.css({
			height: app.windowInfo.height * 0.9
		});
		this.toolBars.css({
			height: this.windowInfo.height * 0.1,
			lineHeight: (this.windowInfo.height * 0.1) + "px"
		});
		$("#topBar .progress-bar").css({
			height: this.windowInfo.height * 0.1 * 0.6,
			padding: this.windowInfo.height * 0.1 * 0.1,
			margin: this.windowInfo.height * 0.1 * 0.1,
		});
		$("#topBar .progress-bar .title, #topBar .progress-bar .level").css({
			height : this.counter.outerHeight(),
			lineHeight : this.counter.outerHeight() + "px"
		});
	},
	setIcons : function(){
		var icons = $(".icon");
		icons.each(function(){
			var dependW, dependH;
			dependW = dependH = $(this).parent().height();
			$(this).css({
				width: dependW,
				height: dependH
			});
		});	
		icons.unbind();
		icons.bind("click", function(){
			if(!($(this).hasClass("icon-time") || $(this).hasClass("icon-target") || $(this).hasClass("icon-locked"))) {
				app.playButton();
			}
		})
	},

/*
|--------------------------------------------------------------------------
| media's functions
|--------------------------------------------------------------------------
*/
	
	getPhoneGapPath : function() {
    	var path = window.location.pathname;
    	path = path.substr( path, path.length - 10 );
    	app.gapPath = path;
	},

	playAudio : function(src, callback) { // auto release
		// if(!app.storageData.user.mute) {
		// 	var music = new Media(src, null, null, function(status){
		// 		if(status == 4) { // 播放完毕		
		// 			music.release();			
		// 			if(callback) {
		// 				callback();
		// 			}		
		// 		}
		// 	});
		// 	music.play();
		// }

		this.eventMusicPlayer.attr("src", src)

	},

	playBacgroundMusic : function(src){
		// if(this.backgroundMusic) {
		// 	this.backgroundMusic.release();
		// }

		// this.backgroundMusic = new Media(src, null, null, function(status){
		// 	if(status == 4) { // play complete				
		// 		app.backgroundMusic.play();
		// 	}
		// });

		// if(!app.storageData.user.mute){
		// 	app.vol.addClass("on");
		// 	this.backgroundMusic.play();
		// } else {
		// 	app.vol.addClass("off");
		// }
		this.bgMusicPlayer.attr("src", src)
		
	},
	playButton : function(){
		if(!app.storageData.user.mute) {
			app.playAudio(app.gapPath + "sound/button-40.mp3");
		}
	},
	stopAudio : function() { // stop background music
		if(this.backgroundMusic) {
			this.backgroundMusic.pause();
		}
	},

	vibrate : function(t){
		if("createtouch" in window) navigator.notification.vibrate(t);
	},
	
/*
|--------------------------------------------------------------------------
| events' functions
|--------------------------------------------------------------------------
*/
	bindEvents : function(){
		this.bindStage();

		this.bindBtns();

		var diffCount = app.diffPerPage;
		this.bindDiffEl(diffCount);
	},

	bindStage : function(){
		this.stage.unbind();
		this.stage.bind("click", function(e) {
			app.playAudio(app.gapPath + "sound/error.wav");
			app.vibrate(100);
			app.cutTime();
		});
	},

	bindBtns : function(){
		this.vol.unbind();
		this.vol.bind("click", function(){
			var me = $(this);
			var isMute = me.hasClass("off");
			app.playButton();

			if(isMute) {
				me.addClass("on").removeClass("off");
				app.backgroundMusic.play();
				app.storageData.user.mute = false;
			} else {
				me.addClass("off").removeClass("on");
				app.stopAudio();
				app.storageData.user.mute = true;
			}
			app.saveStorageData(app.storageData);
		});

		this.pause.unbind();
		this.pause.bind("click", function(){
			app.playButton();
			app.popPause();
		});

		this.searchIcon.unbind();
		this.searchIcon.bind("click", function(){
			// app.playButton();
			if(app.stageData.helpNum > 0){
				app.helpToFind();
			}
		});
	},

	bindDiffEl : function(diffCount){
		this.diffs.unbind();
		this.diffs.bind("click", function(e) {
			e.stopPropagation();
			
			var $this = $(this);
			var thisId = $this.attr("val");
			var $bindedImg; 
			// var $bindedEl;	// original	
			var	$bindedEls;
							
			if($this.hasClass("fresh")) {
				
				// if($this.hasClass("leftPart")) {	  // original			
				// 	$bindedImg = $("#leftImg" + thisId);
				// 	$bindedEl = $("#rightEl" + thisId);
				// 	$bindedImg.fadeOut(200);
				// } else {
				// 	$bindedImg = $("#rightImg" + thisId);
				// 	$bindedEl = $("#leftEl" + thisId);
				// 	$bindedImg.fadeIn(200);
				// }

				// $bindedEls = $("#leftEl" + thisId + ", #rightEl" + thisId);
				$bindedEls = $(".mark" + thisId);
				$bindedEls.removeClass("fresh").addClass("marked").css({
					background : "transparent",
					opacity : 1
				});
				
				// $this.removeClass("fresh");		
				// $bindedEl.removeClass("fresh");	// original
				// $bindedEls.removeClass("fresh");	
				
				if(!app.storageData.user.mute) {
					diffCount--;
					app.playAudio(app.gapPath + "sound/correct.wav"); 
					app.leftTarget.html(diffCount);			
					if(diffCount == 0) {
						app.stage.unbind();
						app.stagePassed();
						clearInterval(app.timer);
					}
				} else {
					diffCount--;
					app.leftTarget.html(diffCount);			
					if(diffCount == 0) {
						app.stage.unbind();
						app.stagePassed();
					}
				}
			}
		});
	},

/*
|--------------------------------------------------------------------------
| page functions
|--------------------------------------------------------------------------
*/

	init : function(){
		this.getPhoneGapPath();

		/* cache elements */
		this.cacheElements();

		/* getStorageData */
		// this.getStorageData();

		/* preloading image */
		this.preloadingImg();

		/* 		 stage data from xml*/
		$.get("./stageData.xml", function(xmlData){

			app.getWindowInfo();

			app.setWindow();

			app.landingPage.show();
		
			app.xmlData = xmlData;

			app.getStorageData();

			setTimeout(function(){
				app.renderThemePage(app.xmlData);
				app.toTheme();
				if(app.storageData.user.isNewUser){
					app.pop(app.newUserPop);
				}
			}, 2000);

		}, "xml");
	},

	cacheElements : function(){
		this.bgMusicPlayer = $("#bgMusic");
		this.eventMusicPlayer = $("#eventMusic"); // html5 method on pc

		this.topBar = $("#topBar");
		this.bottomBar = $("#bottomBar");
		this.vol = $("#vol");
		this.pause = $("#pause");
		this.indexBar = $("#indexBar");
		this.toolBars = $("#topBar, #topBar .top-float-bar, #bottomBar, #indexBar");
		this.leftTarget = this.topBar.find("#target");
		this.helpNum = this.topBar.find("#helpNum");
		this.searchIcon = this.topBar.find(".icon-search");
		this.level = this.topBar.find(".level");

		this.content = $(".content");

		this.landingPage = $("#landingPage");

		this.themeIndex = $("#themeIndex");
		this.stage = $("#stage");

		this.leftPicDiv = $("#leftPicDiv");
		this.rightPicDiv = $("#rightPicDiv");
		this.picDivs =  $("#leftPicDiv, #rightPicDiv");

		this.newUserPop = $("#newUserPop");
		this.pausePop = $("#pausePop");
		this.sysPausePop = $("#sysPausePop");
		this.failedPop = $("#failedPop");
		this.counter = $("#counter")
	},

	toTheme : function(refresh){

		if(refresh) {
			this.renderThemePage(this.xmlData);
		} else {
			this.playBacgroundMusic(app.gapPath + "sound/bg.mp3");
		}

		// if(!this.storageData.user.mute) {
		// 	this.backgroundMusic.play();
		// }
		
		this.landingPage.hide();
		this.hidePop();
		this.stage.hide();
		this.topBar.hide();
		this.bottomBar.hide();
		// this.stopAudio();
		this.themePage.show();
		this.themeScroll.scrollToPage(app.storageData.process.curTheme, 0);
		this.themeList.show().css({
			visibility: "visible"
		});
		this.indexBar.show();

		/* after render */
		var stageW = this.themeScroller.find(".stage").outerWidth(true);
		var themeW = this.themeScroller.find("li:first").outerWidth(true) * 0.8;
		this.themeScroller.find(".stageResizeBox").css({
			width: Math.floor(themeW / stageW) * stageW,
			marginLeft: (themeW - (Math.floor(themeW / stageW) * stageW)) / 2
		});

		this.setIcons();
	},

	renderThemePage : function(data){

		var themeNum = 0;
		var themeListHtml = '';
		var themeIndexHtml = '';
		var themes = $("theme", data);

		if($("body").find("#themePage").length) {
			this.themePage.remove();
			// this.stageWrappers.remove();
		}

		$("body").append('<div id="themePage"><div id="themeScroller"><ul id="themeList"></ul></div></div>');
		this.themePage = $("#themePage");
		this.themeScroller = $("#themeScroller");
		this.themeList = $("#themeList");

		themes.each(function(){
			themeNum++;
		});

		/* set css */
		this.themeScroller.css({
			width : themeNum * 100 + "%"
		});

		/* loop in themes */
		for(i = 0; i < themeNum; i++) {
			var theme = themes[i];
			var stageID = app.storageData.process["theme" + i].curStage;
			
			themeListHtml += '<li><div class="theme"><div class="themeTitle orange">'+ $(theme).attr("title") +'</div><div class="stageWrapper" id="theme'+ i +'"><div class="stageScroller"><div class="stageResizeBox clearfix">';
			
			/* loop in stages */
			$("stage", theme).each(function(j){
				
				if(j <= stageID) { // 可玩的关卡
					themeListHtml += '<div class="stage green available" status="available" theme-data="'+ i +'" stage-data="'+ j +'" onclick="app.playButton();">'+ (j + 1) +'</div>';
				} else { // 锁定的关卡
					themeListHtml += '<div class="stage green unavailable" status="unavailable"><span class="icon icon-locked">'+ (j + 1) +'</span></div>';
				}
				
			});
			themeListHtml += '</div></div></div></div></li>';

			/* for index */
			themeIndexHtml +=   '<li id="index'+ i +'">' +
									'<span></span>' +
							  	'</li>';
		}

		this.themeList.html(themeListHtml);
		this.themeIndex.html(themeIndexHtml);

		this.availableStage = $("#themePage .stage.available");

		// this.stageWrappers = $(".stageWrapper");

		/* set css */
		this.themeScroller.find("li").css({
			width : (1 / themeNum) * 100 + "%"
		});

		this.themeScroll = new iScroll('themePage', {
			snap: true,
			momentum: true,
			hScrollbar: false,
			onScrollEnd: function(){
				app.themeIndex.find("li").removeClass("indexed");
				app.themeIndex.find("li").eq(this.currPageX).addClass("indexed");
				app.storageData.process.curTheme = this.currPageX;
				app.saveStorageData(app.storageData);
			}
		});

		for(var i = 0; i < themeNum; i++){
			eval('var themeScroll'+ i +'= new iScroll(theme'+ i +', {snap: true, momentum: true, vScrollbar: true});');
		};

		/* bind events */
		this.themePage.find(".stage").unbind();
		this.themePage.find(".stage").bind("click", function(e){

			var stageObj = $(e.target);
			var status = stageObj.attr("status");
			var themeID = parseInt(stageObj.attr("theme-data"));
			var stageID = parseInt(stageObj.attr("stage-data"));

			app.playingStageID = stageID;

			if(status == "available") {
				/* get this stage's data */
				app.getStageData(themeID, stageID);
				app.toStage();
			} else {
				
			}
		});

		// themeScroll.scrollToPage(app.storageData.process.curTheme, 0);
	},

	gotTips : function(){
		// if(!this.storageData.user.mute) {
		// 	this.backgroundMusic.play();
		// }
		this.hidePop();
		this.storageData.user.isNewUser = false;
		this.saveStorageData(this.storageData);
	},

	toStage : function(){

		// this.setWindow();

		/* hide landing page*/
		this.landingPage.hide();
		this.indexBar.hide();
		this.hidePop();
		this.stage.hide();
		this.themePage.hide();

		this.setDiffEl();
		this.leftTarget.text(this.diffPerPage);
		this.helpNum.text(this.stageData.helpNum);

		this.topBar.fadeIn(100);
		this.stage.fadeIn(100);
		// this.bottomBar.show();

		this.level.html("Level : " + (this.stageData.themeID + 1) + "-" + (this.stageData.stageID + 1));
		this.startCounter();
		this.bindEvents();	
	},

	startCounter : function(time){
		/* ensure it is default width */
		var me = this;
		var counter = this.counter.find("span");
		var title = this.counter.find(".title");
		if(!time) var time = this.timeToCount;

		clearInterval(me.timer);
		
		var width = this.counter.width();
		var gap = width / this.timeToCount;	

		counter.width(time * gap);
		title.html(time).attr("time-left", time);

		this.timer = setInterval(function(){
			var width = counter.width();
			time--;
			title.html(time).attr("time-left", time);
			counter.width(time * gap);
			if(time <= 0) {
				app.diffs.unbind();
				clearInterval(me.timer);
				me.failed();
			}
		}, 1000);
	},
	cutTime : function(){
		var time = this.counter.find(".title").attr("time-left");
		if(time > this.timeToCut) {
			time = time - this.timeToCut;
			this.startCounter(time);
		} else {
			this.counter.find("span").width(0);
			this.counter.find(".title").html("0");
			this.failed();
		}
	},
	failed : function(){
		this.pop(this.failedPop);
	},

	restartStage : function(){
		// if(!this.storageData.user.mute) {
		// 	this.backgroundMusic.play();
		// }
		this.getStageData(this.stageData.themeID, this.stageData.stageID); 
		this.toStage();
	},

	toNextStage : function(){
		// if(!this.storageData.user.mute) {
		// 	this.backgroundMusic.play();
		// }
		this.playingStageID++;
		this.getStageData(this.stageData.themeID, this.stageData.stageID + 1); 
		this.toStage();
	},

	popPause : function(){
		this.pop(this.pausePop);
		// this.stopAudio();
	},
	popSysPause : function(){
		this.stopAudio();
		this.pop(this.sysPausePop);
	},

	sysBack : function(){
		this.hidePop();

		if(this.themePage.css("display") != "none") {
			this.toTheme(true);
		} else if(this.stage.css("display") != "none") {
			var time = this.counter.find(".title").attr("time-left");
			this.startCounter(time);
		}
		
		// if(!this.storageData.user.mute) {
		// 	this.backgroundMusic.play();
		// }
		
	},

	helpToFind : function(){
		this.diffs.each(function(){
			if($(this).hasClass("fresh")) {
				$(this).trigger("click");
				app.stageData.helpNum--;
				app.helpNum.text(app.stageData.helpNum);

				/* save help num immediately */
				app.storageData.process["theme" + app.stageData.themeID].helpNum = app.stageData.helpNum;
				app.saveStorageData(app.storageData);

				return false;
			}
		});
	},

	pop : function(obj){

		clearInterval(this.timer);

		obj = obj || $(".popBox");
		var docH = $(document).height();
		// var popMarginTop = $(window).height() * 0.2;
		var popMarginTop = ($(window).height() - obj.height()) / 2;
		var scrollH = $(document).scrollTop();
	   
		$(".popShelter").css({ height: docH});
		obj.css({ top: scrollH + popMarginTop});
		$(".popShelter").show();
		obj.show(); 
	},

	hidePop : function(obj){
		if(obj) {
			obj.hide();
		} else {
			$(".popShelter, .popBox").hide();
		}
	},

	resume : function(){
		// if(!this.storageData.user.mute) {
		// 	this.backgroundMusic.play();
		// }
		this.hidePop();

		var time = this.counter.find(".title").attr("time-left");
		this.startCounter(time);
	},

	stagePassed : function(){
		setTimeout(function(){
			var curThemeID = app.storageData.process.curTheme;
			var curThemeStages = -1;
			$("stage", $(app.xmlData).find("#theme" + (curThemeID + 1))).each(function(){
				curThemeStages++;
			});
			if(app.playingStageID == curThemeStages) {
				app.saveStorageData(app.storageData, function(){
					$("#themePassedPop").find(".passedTip").text(app.stageData.themeName +" 已全部通过，赶快去其他版块瞧瞧吧~");
					app.pop($("#themePassedPop"));
				});
			} else {
				if(app.storageData.process["theme" + app.stageData.themeID].curStage == app.playingStageID){
					app.storageData.process["theme" + app.stageData.themeID].curStage = app.stageData.stageID + 1;
					app.saveStorageData(app.storageData, function(){
						$("#stagePassedPop").find(".passedTip").text("关卡 "+ (app.stageData.stageID + 1) +" 已通过，继续加油哦~");
						app.pop($("#stagePassedPop"));
					});
				} else {
					$("#stagePassedPop").find(".passedTip").text("关卡 "+ (app.stageData.stageID + 1) +" 已通过，继续加油哦~");
					app.pop($("#stagePassedPop"));
				}
			}
		}, 500)
		

		// // app.saveData.process = app.storageData.process;
		// app.storageData.process["theme" + app.stageData.themeID].curStage = app.stageData.stageID + 1;
		// // app.saveData.stage['stage' + app.saveData.user.stage] = {level: 3};
		// app.saveStorageData(app.storageData);
		// // app.getStorageData();
		// app.getStageData(app.stageData.themeID, app.stageData.stageID + 1);

		// //app.toStage(app.stageData.themeID, app.stageData.stageID);
	}
};

 //app.init();
// document.addEventListener("deviceready", deviceready, false);


function deviceready(){
	_.bindAll(app, "init", "toTheme", "cacheElements", "popPause", "stagePassed");
	app.init();

	document.addEventListener("pause", function(){
		app.popSysPause();
	}, false);
	document.addEventListener("backbutton", function(){
		if(app.stage.css("display") != "none") {
			clearInterval(app.timer);
			app.stage.hide();
			app.topBar.hide();
			// setTimeout(function(){
				app.toTheme(true);

			// }, 10);
		}  else {
			navigator.app.exitApp();
		}
	}, false);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
deviceready();
