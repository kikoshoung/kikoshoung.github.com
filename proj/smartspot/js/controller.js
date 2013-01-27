
function get_window_info(){
	
	var info = {
		width : $(window).width(),
		height : $(window).height()
	}
	
	return info;
}

function set_w_h(){
	
	$(".content").css({
		height: global_window_info.height * 0.8,
		top: global_window_info.height * 0.1
	});
// 	
	// $(".left_pic_div, .right_pic_div").css({
		// height: "100%"
	// });
// 	
	$(".top_bar, .bottom_bar").css({
		height: global_window_info.height * 0.1
	});
	
}

function get_stage_info(){ //stage_data is form xml
	//获取localStorage数据
	var cur_stage = storage_data.user.stage;
	
	// 获取xml数据
	var stage_el_data = get_xml_data(cur_stage, gloabal_xml_request);


	var info = {
		stage : cur_stage,
		el_data : get_random_el(stage_el_data)
	}
	
	return info;
}

function get_xml_data(cur_stage, xml_obj){
	
	var rs = [];		

	$("#stage" + cur_stage + " el", xml_obj).each(function(i){
		
		rs[i] = {};
		
		rs[i].bg_url = $(this).attr("url");
		rs[i].width = $(this).attr("width");
		rs[i].height = $(this).attr("height");
		rs[i].left = $(this).attr("left");
		rs[i].top = $(this).attr("top");

	});	
	
	return rs;
	
}

function get_random_el(data){
	
	var result = [],
		result_random = [], 
		random_num ;
		
	while(result.length != el_per_stage) {
		result.length
		
		random_num = Math.floor(Math.random() * data.length); 
		
		if(result.length == 0) {
			
			result[result.length] = data[random_num];
			result_random[result_random.length] = random_num;
			
		} else {
			
			var is_diff = true;
			
			for(var i in result_random) {

				if(random_num == result_random[i]) {
					is_diff = false;
				}
				
			}
			
			if(is_diff) {
				result[result.length] = data[random_num];
				result_random[result_random.length] = random_num;
			}
		}
		
	}	

	return result;
}

function init_stage(){
	
	var sava_data = {};
		save_data.user = {};
		save_data.stage = {};
	//////////////////////////////////////// reset
	$("#stage").hide();
	
	$("#stage .left_pic_div, #stage .right_pic_div").empty();
	
	el_per_stage = 3;
	
	/////////////////////////////////////////

	global_stage_info = get_stage_info();
	
	var stage_num = global_stage_info.stage;
	
	var bg_url = "url(./images/stage" + stage_num + ".jpg) no-repeat";
	
	$("#stage .left_pic_div, #stage .right_pic_div").css({
		background : bg_url
	});

	$("#app_init").hide();
	
	$("#stage").fadeIn();
	
	set_diff_el();	
	
	$("#stage").fadeIn();

	start_bg_music("/android_asset/www/sound/bg1.mp3");

	
	$("#stage").unbind();
	$("#stage").bind("click", function() {

		playAudio("/android_asset/www/sound/w_spot1.mp3");

		vibrate(100);

	});
	
	$("#stage .diff_el").unbind();
	$("#stage .diff_el").bind("click", function(e) {
		
		e.stopPropagation();
		
		var $this = $(this);
		var this_id = $this.attr("val");
		var $binded_img; 
		var $binded_el;
				
		
		if($this.hasClass("fresh")) {
			
			if($this.hasClass("left_part")) {			
				$binded_img = $("#left_img" + this_id);
				$binded_el = $("#right_el" + this_id);
				
				$binded_img.fadeOut(200);
			} else {
				$binded_img = $("#right_img" + this_id);
				$binded_el = $("#left_el" + this_id);
				
				$binded_img.fadeIn(200);
			}
			
			$this.removeClass("fresh");		
			$binded_el.removeClass("fresh");	
			
			playAudio("/android_asset/www/sound/r_spot1.mp3", function(){ // 处理函数应需要播放完action音乐回调使用，所以写进了playAudio方法内
				
				el_per_stage--;				
				
				if(el_per_stage == 0) {
					
					save_data.user.stage = global_stage_info.stage + 1;
					
					save_data.stage['stage' + global_stage_info.stage] = {level: 3};
					
					save_storage_data(save_data);
					
					init_stage();
					
				}
				
			}); 
		}

	});
}

function poccess_stage(){
	
	
	
}

function start_bg_music(src){
	
	if(bg_music) {
		bg_music.release();
	}
	
	bg_music = new Media(src, null, null, function(status){
		if(status == 4) { // 播放完毕
			
			bg_music.play();
			
		}
	});
	
	bg_music.play();
}

function set_diff_el(){
	
	var left_part = $("#stage .left_pic_div"),
		right_part = $("#stage .right_pic_div");
	
	var data = global_stage_info.el_data
	
	left_part.empty();	
	right_part.empty();
	
	for(var i in data) {
		
		left_part.append('<div id="left_el'+ i +'" class="left_part diff_el fresh this" val="'+ i +'"></div><div id="left_img'+ i +'" class="left_part diff_img this"></div>');
		right_part.append('<div id="right_el'+ i +'" class="right_part diff_el fresh this" val="'+ i +'"></div><div id="right_img'+ i +'" class="right_part diff_img this"></div>');
		
		$(".diff_el.this", left_part).css({
			width		: data[i].width,
			height		: data[i].height,
			left		: data[i].left,
			top			: data[i].top
		}).removeClass("this");	
		
		$(".diff_el.this", right_part).css({
			width		: data[i].width,
			height		: data[i].height,
			left		: data[i].left,
			top			: data[i].top
		}).removeClass("this");		
		
		
		$(".diff_img.this", left_part).css({
			background  : "url("+ data[i].bg_url +") no-repeat"
		}).removeClass("this");	
		
		$(".diff_img.this", right_part).css({
			background  : "url("+ data[i].bg_url +") no-repeat"
		}).removeClass("this");	
		
	}	
	
}

function pause_game(){
	
}

function resume_game(){
	
}

function stage_failed(){
	
}

function replay_stage(){
	
}

function stage_successed(){
	
}

function to_next_stage(){
	
}

function play_action_sound(){
	
}

function vibrate(t){
	navigator.notification.vibrate(t);
}
function play_bg_music(uri){
	
}