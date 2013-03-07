(function(){
	var regexVendor = /(baidu|google|alimama|000dn|ggmm777|17leyi|37cs|49ko|91mangrandi|14yaa|144gg|arpg2|twcczhu|qiyou)/,
		iframes = document.getElementsByTagName('iframe'), // include ad iframe & useful iframe
		firstLevelDoms = document.body.children,
		scanCounter = 10,
		adIframes;


	var getAdDoms = function(doms, type){ // filter out ad iframe, type: 0-iframe, 1-float ad
		var ret = [];
		for(var i = 0; i < doms.length; i++){
			var dom = doms[i],
				sensitiveStr = type ? dom.outerHTML : dom.id + dom.className + dom.src;
			if(sensitiveStr.match(regexVendor)) {
				if(type){
					if(isFloadtAd(dom)) ret.push(dom);
				} else {
					ret.push(dom);
				}
			}
		}
		return ret;
	}

	var killAd = function(target){
		var parent = target.parentNode,
			sensitiveStr = parent.id + parent.className;
		parent.removeChild(target);
		if(sensitiveStr.match(regexVendor)) parent.parentNode.removeChild(parent);
	}

	var isFloadtAd = function(dom){
		var reg = /(fixed|absolute)/
		if(dom.style.position.match(reg) || (dom.children.length && dom.children[0].style.position.match(reg))){
			return true;
		} else {
			return false;
		}
	}

	var excu = function(){
		/* kill iframe ad */
		adIframes = getAdDoms(iframes, 0);
		for(var i = 0; i < adIframes.length; i++){
			killAd(adIframes[i]);
		}

		/* kill float ad */
		adFloatDoms = getAdDoms(firstLevelDoms, 1);
		for(var i = 0; i < adFloatDoms.length; i++){
			killAd(adFloatDoms[i]);
		}

		// for(var i = 0; i < firstLevelDoms.length; i++){
		// 	if(firstLevelDoms[i].outerHTML.match(regexVendor)) console.log(firstLevelDoms[i])
		// }
	}

	excu();
	var counter = setInterval(function(){
		console.log('Page was scaned by ad-killer...');
		if(--scanCounter) excu();
		else clearInterval(counter);
	}, 1000);

	
})()