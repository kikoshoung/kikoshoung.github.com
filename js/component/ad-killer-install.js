(function(){
	var script,
		domain = document.domain == 'localhost' ? 'http://localhost' : 'http://kikoshoung.me';
	if(!window.adKiller_by_kikoshoung) {
		script = document.createElement('script');
		script.src = '/dist/component/ad-killer.js';
		document.body.appendChild(script);
	} else {
		window.adKiller_by_kikoshoung.domScanner();
	}
})()