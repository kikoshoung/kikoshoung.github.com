(function(){
	var killer = this.adKiller_by_kikoshoung = {};
		regexCompany = /(baidu|google|alimama|mediav|sogou)/,
		regexVendor = /(000dn|ggmm777|17leyi|37cs|49ko|91hui|91mangrandi|91tiger|14yaa|144gg|a135|arpg2|game3737|mediav|qiyou|sogou|twcczhu)/,
		suspectableDoms = [],
		fullscreen = [document.documentElement.clientWidth, document.documentElement.clientHeight];

	killer.domScanner = function(root){
		var childLength = root.children.length;

		if(childLength){
			for(var i = 0, children = root.children; i < childLength; i++){
				var child = children[i],
					positionType = child.style.position,
					position = child.position,
					tagName = child.tagName;

				// ignore javascript tag
				if(child.tagName === 'SCRIPT') continue; 

				var suspectableAttr = '' + child.id + child.className + child.name + child.src + child.href + child.style.background;

				if(child.onload) {
					suspectableAttr += child.onload.toString();
				}

				// filter out suspectable dom
				if((child.tagName === 'IFRAME' && suspectableAttr.match(regexCompany)) || suspectableAttr.match(regexVendor)) {
					suspectableDoms.push(child);
					console.log(suspectableAttr)
					console.log(regexVendor)
					console.log('iframe')
					continue;
				}
				if((positionType === 'absolute' || positionType === 'fixed') && fullscreen[0] === parseInt(child.style.clientWidth) && fullscreen[1] <= parseInt(child.style.clientHeight)){
					suspectableDoms.push(child);
					console.log('float')
					continue;
				}
				arguments.callee(child);
			}
		}
	}

	killer.killSuspectableDoms = function(child){
		var parent = child.parentNode,
			suspectableAttr = '' + parent.id + parent.className + parent.name + parent.src + parent.href + parent.style.background;
		parent.removeChild(child);
		if(suspectableAttr.match(regexCompany)) parent.parentNode.removeChild(parent);
	}

	killer.domScanner(document.getElementsByTagName('body')[0]);
	for(var i = 0; i < suspectableDoms.length; i++){
		killer.killSuspectableDoms(suspectableDoms[i]);
	}
	
}).call(this);











