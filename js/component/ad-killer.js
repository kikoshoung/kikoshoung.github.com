(function(){
	var _killer = this.adKiller_by_kikoshoung = {},
		_regexCompany = /(baidu|google|alimama|mediav|sogou)/,
		_regexVendor = /(000dn|ggmm777|17leyi|37cs|49ko|91hui|91mangrandi|91tiger|14yaa|144gg|a135|arpg2|game3737|mediav|qiyou|sogou|twcczhu)/,
		_suspectableDoms = [],
		_fullscreen = [document.documentElement.clientWidth, document.documentElement.clientHeight],
		_panel = {
			dom: document.getElementById('ad-killer-panel')
		};

	_killer.domScanner = function(root){
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
				if((child.tagName === 'IFRAME' && suspectableAttr.match(_regexCompany)) || suspectableAttr.match(_regexVendor)) {
					_suspectableDoms.push(child);
					continue;
				}
				if((positionType === 'absolute' || positionType === 'fixed') && _fullscreen[0] === parseInt(child.style.clientWidth) && _fullscreen[1] <= parseInt(child.style.clientHeight)){
					_suspectableDoms.push(child);
					console.log('float')
					continue;
				}
				arguments.callee(child);
			}
		}
	}

	_killer.killSuspectableDoms = function(child){
		var parent = child.parentNode,
			suspectableAttr = '' + parent.id + parent.className + parent.name + parent.src + parent.href + parent.style.background;
		parent.removeChild(child);
		if(suspectableAttr.match(_regexCompany)) parent.parentNode.removeChild(parent);
	}

	_killer.excu = function(){
		_panel.dom.style.display = 'block';

		_panel.dom.innerHTML = '\u6B63\u5728\u626B\u63CF\u6076\u610F\u5E7F\u544A...';
		_panel.dom.style.backgroundColor = 'red';
		_panel.dom.style.color = 'white';

		_killer.domScanner(document.getElementsByTagName('body')[0]);
	
		for(var i = 0; i < _suspectableDoms.length; i++){
			_killer.killSuspectableDoms(_suspectableDoms[i]);
		}

		_panel.dom.innerHTML = '\u5DF2\u4E3A\u4F60\u6E05\u9664\u4E86' + _suspectableDoms.length + '\u4E2A\u6076\u610F\u5E7F\u544A';
		_panel.dom.style.backgroundColor = 'green';

		_suspectableDoms = [];

		setTimeout(function(){
			_panel.dom.style.display = 'none';
		}, 2000);

	}
	
	_killer.excu();	
	
}).call(this);











