(function(){
	if(this.adKillerCounter) clearInterval(this.adKillerCounter);
	var regexCompany = /(baidu|google|alimama|mediav|sogou)/,
		regexVendor = /(000dn|ggmm777|17leyi|37cs|49ko|91hui|91mangrandi|91tiger|14yaa|144gg|a135|arpg2|game3737|mediav|qiyou|sogou|twcczhu)/,
		suspectableDoms = [];

	var domScanner = function(root){
		var childLength = root.children.length;

		if(childLength){
			for(var i = 0, children = root.children; i < childLength; i++){
				var child = children[i],
					tagName = child.tagName;

				// ignore javascript tag
				if(child.tagName === 'SCRIPT') continue; 

				var suspectableAttr = '' + child.id + child.className + child.name + child.src + child.href + child.style.background;

				// filter out suspectable dom
				if(child.tagName === 'IFRAME' && child.onload) {
					suspectableAttr += child.onload.toString();
				}
				if((child.tagName === 'IFRAME' && suspectableAttr.match(regexCompany)) || suspectableAttr.match(regexVendor)) {
					suspectableDoms.push(child);
					continue;
				}
				arguments.callee(child);
			}
		}
	}

	var killSuspectableDoms = function(child){
		var parent = child.parentNode,
			suspectableAttr = '' + parent.id + parent.className + parent.name + parent.src + parent.href + parent.style.background;
		parent.removeChild(child);
		if(suspectableAttr.match(regexCompany)) parent.parentNode.removeChild(parent);
	}

	domScanner(document.querySelector('body'));
	for(var i = 0; i < suspectableDoms.length; i++){
		killSuspectableDoms(suspectableDoms[i]);
	}
	
}).call(this);











