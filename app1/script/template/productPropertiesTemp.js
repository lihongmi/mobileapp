define(function(require, exports, module){
	var product_evalute_template = 
		'{{for(var i = 0; i < it.length; i ++){}}' +
		'<div class="qOrderDetailsBox_line4 qOrderDetailsBox_line3 qBox_5">' +
			'<p class="fon_c23 fon_s10">{{=it[i]["name"]}}</p>' + 
			'{{for(var j = 0; j < it[i]["properties"].length; j ++){}}' +
				'{{if(j == 0){}}' +
					'<span class="s_btn_spec rad_3 qBtn_5 mt1 txt_1 dib first" id="_pp_{{=it[i]["properties"][j]["id"]}}" p-index="{{=i}}" p-value="{{=it[i]["properties"][j]["id"]}}">' + 
				'{{}else{}}' +
					'<span class="s_btn_specNO rad_3 qBtn_5 mt1 txt_1 dib" id="_pp_{{=it[i]["properties"][j]["id"]}}" p-index="{{=i}}" p-value="{{=it[i]["properties"][j]["id"]}}">' +
				'{{}}}' +
				'<span class="fon_s10 fon_c23">{{=it[i]["properties"][j]["property"]}}</span></span>' + 
			'{{}}}' +
		'</div>' + 
		'{{}}}';
	module.exports = product_evalute_template;
});