var storage_data;
//////////////////////

if(localStorage.smart_spot == undefined){
	storage_data = set_default_storage_data();
} else {
	storage_data = JSON.parse(localStorage.smart_spot);
}

//////////////////////
function set_default_storage_data(){
	
	var storage_data = {
		
		user : {
			stage  : 1,
			device : {
				device_type : ""
			}
			
		},
		
		stage : {
			stage1 : {
				level	: 0
			},
					
			stage2 : {
				level	: 0
			}
		}
	
		
	};
	
	return storage_data;
}

function save_storage_data(data){

	storage_data.user = $.extend(storage_data.user, data.user);

	storage_data.stage = $.extend(storage_data.stage, data.stage);

	localStorage.smart_spot = JSON.stringify(storage_data);

	console.log(localStorage.smart_spot);
	
}

function get_storage_data(){
	
	var rs = JSON.parse(localStorage.smart_spot);

	return rs;
	
}

