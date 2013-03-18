(function(){
	if(!window.adKiller_by_kikoshoung) {
		var script, panel,
			mode = 1, // 0: dev, 1: online
			domain = !mode ? 'http://localhost' : 'http://kikoshoung.me';

		script = document.createElement('script');
		script.src = domain + '/dist/component/ad-killer.js';

		panel = document.createElement('div');
		panel.id = 'ad-killer-panel',
		panel.style.cssText = 'position: fixed; z-index: 99999; top: 0; left: 0; padding: 5px 10px; background-color: white; color: black; font-size: 12px;';
		panel.innerHTML = '\u6B63\u5728\u4E3A\u60A8\u52A0\u8F7D\u5E7F\u544A\u6740\u624B...';
		document.body.appendChild(panel);
		document.body.appendChild(script);
	} else {
		window.adKiller_by_kikoshoung.domScanner(document.getElementsByTagName('body')[0]);
		window.adKiller_by_kikoshoung.excu();
	}
})()