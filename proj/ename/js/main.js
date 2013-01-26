var app = {
	lib: {},
	clone: function(obj){ // for {} object, array use concat
		var str = JSON.stringify(obj);
		return JSON.parse(str);
	},
	checkConnection: function(){
		if("createTouch" in window){
			var networkState = navigator.network.connection.type;
		    if(networkState == "unknown" || networkState == "none"){
		    	return false;
		    } else {
		    	return true;
		    }
		} else return true;
		
	    // var states = {};
	    // states[Connection.UNKNOWN]  = 'Unknown connection';
	    // states[Connection.ETHERNET] = 'Ethernet connection';
	    // states[Connection.WIFI]     = 'WiFi connection';
	    // states[Connection.CELL_2G]  = 'Cell 2G connection';
	    // states[Connection.CELL_3G]  = 'Cell 3G connection';
	    // states[Connection.CELL_4G]  = 'Cell 4G connection';
	    // states[Connection.NONE]     = 'No network connection';
	},
	speaker: $("<audio autoplay></audio>"),
	spinner: $('<div class="spinner fade fl ml-m">\
					<div class="e1"></div>\
					<div class="e2"></div>\
					<div class="e3"></div>\
					<div class="e4"></div>\
					<div class="e5"></div>\
					<div class="e6"></div>\
					<div class="e7"></div>\
					<div class="e8"></div>\
					<div class="e9"></div>\
					<div class="e10"></div>\
					<div class="e11"></div>\
					<div class="e12"></div>\
				</div>').hide(),
	events: {
		klick: ("createTouch" in document) ? "touchstart" : "click",
		mouseup: ("createTouch" in document) ? "touchend" : "mouseup",
		mousedown: ("createTouch" in document) ? "touchstart" : "mousedown",
	}
}