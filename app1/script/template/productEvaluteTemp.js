define(function(require, exports, module){
	var product_evalute_template = 
		'{{for(var i = 0; i < it.evas.length; i ++){}}' +
		'{{if(i == 0){}}' +
		'<div class="qOrderDetailsBox_line3 qBox_7">' + 
		'{{}else{}}' +
		'<div class="qOrderDetailsBox_line3 qOrderDetailsBox_line4 qBox_7">' + 
		'{{}}}' +
			'<p class="fon_s10 fon_c23">{{=it.evas[i]["evaluate_info"]}}</p>' + 
			'{{if(it.evas[i]["gcs"][0]){}}'+
				'<p class="fon_s13 fon_c12">{{=it.evas[i]["gcs"][0]["spec_info"]}}</p>' +
			'{{}}}'+
			'<div class="fon_s13 fon_c12 posi_r">' +
				'{{=it.evas[i]["evaluate_user"]["userName"]}}  ' +
				'{{for(var p = 0; p < it.evas[i]["evaluate_user"]["user_credit"].credit; p ++){}}' +
					'<img class="qImg_3 val_m" src="{{=it.evas[i]["evaluate_user"]["user_credit"].src}}">' +
				'{{}}}' +
				'<p class="fon_s13 posi_a fon_c12 qTit_5">{{=it.evas[i]["addTime"]}}</p>' + 
			'</div>' +
		'</div>' + 
		'{{}}}';
	module.exports = product_evalute_template;
});
