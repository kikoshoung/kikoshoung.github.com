var gloabal_xml_request;

var global_stage_info;

var global_window_info;

var el_per_stage = 3 //每页不同处数目

var bg_music = null;


// 等待加载PhoneGap
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap加载完毕
function onDeviceReady() {
	
	$.get("./stage_data.xml", function(xml_obj){
		
		global_window_info = get_window_info();
	
		gloabal_xml_request = xml_obj;
	
		set_w_h();
	
		setTimeout(init_stage, 2000);
			
	}, "xml");

	
}

// 音频播放器

// 播放音频
function playAudio(src, callback) {
	var music = new Media(src, null, null, function(status){
		if(status == 4) { // 播放完毕		
			music.release();			
			if(callback) {
				callback();
			}		
		}
	});
	music.play();	
}

// 停止音频播放
function stopAudio() {
	if(my_media) {
		my_media.stop();
	}
	clearInterval(mediaTimer);
	mediaTimer = null;
}

// 创建Media对象成功后调用的回调函数
function onSuccess() {
	console.log("playAudio():Audio Success");
}

// 创建Media对象出错后调用的回调函数
function onError(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

// 设置音频播放位置
function setAudioPosition(position) {
	document.getElementById('audio_position').innerHTML = position;
}