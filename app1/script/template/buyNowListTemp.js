define(function(require, exports, module){
	var config = require('../config');
	var $ = require('../common/zepto-1.1.2');
	var prefix = "";
	var width = $(document.body).width();
	if(width > 630){
		prefix = config.IMG_PREFIX_GOODS_SMALL[0];
	}else if(width > 470){
		prefix = config.IMG_PREFIX_GOODS_SMALL[1];
	}else if(width > 310){
		prefix = config.IMG_PREFIX_GOODS_SMALL[2];
	}
	var buy_now_list_template = 
		'{{for(var i in it){}}' + 
		'<div class="bg_c1 shadow mt1 order_info_item" sid="{{=it[i]["id"]}}">' +
			'<h1 class="qTit_2 shadow posi_r">' +
				'<span class="fon_s13 fon_c24">{{=it[i]["store_name"]}}</span> <span ' +
					'class="fon_s10 fon_c21 posi_a qTit_4">$<span class="total_price_item">{{=parseFloat(it[i]["totalPrice"]*100/100) }}</span></span>' +
			'</h1>' +
			'{{for(var j = 0; j < it[i]["goods"].length; j ++){}}' +
			'<dl class="posi_r qOrderDetailsBox_box qOrderDetailsBox_line mt1 cart_item" gid="{{=it[i]["goods"][j]["id"]}}">' +
				'<dt class="shadow_2 posi_a qOrderDetailsBox_img" style="height:7.1em;">' +
					'{{if(it[i]["goods"][j]["goods"]["goods_main_photo"] == null){}}' +
					'<img src="../../images/home_noPic_06.png">' + 
					'{{}else{}}' +
					'<img style="height:7.1em;" src="' + config.IMG_HOST + '{{=it[i]["goods"][j]["goods"]["goods_main_photo"]["path"]}}/'+prefix+'{{=it[i]["goods"][j]["goods"]["goods_main_photo"]["name"]}}" onerror="javascript:this.src=\'../../images/home_noPic_06.png\'">' +
					'{{}}}' +
				'</dt>' +
				'<dd class="qOrderDetailsBox_de qLine_2">' +
					'<h2 class="fon_s11 fon_c17 word_all">{{=it[i]["goods"][j]["goods"]["goods_name"]}}</h2>' +
					'<p class="fon_s11 fon_c13"><span>%%lang_product_price%%</span>:$' + 
					'{{if(it[i]["goods"][j]["fact_price"] != null){}}' + 
					'{{=it[i]["goods"][j]["fact_price"]}}' + 
					'{{}else{}}' +
					'{{=it[i]["goods"][j]["price"]}}' + 
					'{{}}}' +
					' <span>%%lang_quantity%%</span>:{{=it[i]["goods"][j]["count"]}}</p>' +
					'{{if(it[i]["goods"][j]["spec_info"] != ""){}}' +
					'<p class="fon_s11 fon_c13"><span>%%lang_color_pad%%</span>: {{=it[i]["goods"][j]["spec_info"]}}</p>' +
					'{{}}}' + 
					'<p class="fon_s11 fon_c17 txt_3">' +
						'<span>%%lang_subtotal%%</span>:<span class="fon_c21">${{=(parseFloat(it[i]["goods"][j]["fact_price"] ? it[i]["goods"][j]["fact_price"]*1000/1000 : it[i]["goods"][j]["price"]) * 1000/1000* parseInt(it[i]["goods"][j]["count"]))}}</span>' +
					'</p>' +
				'</dd>' +
			'</dl>' +
			'{{}}}' +
			'<div class="qBox_4">' +
				'<div class="posi_r qConBox_3">' +
					'<span class="fon_s13">%%lang_payment_method%%</span>:' +
					'<div class="posi_a qConBox_2 rad_2 pay_type_btn">' +
						'<span class="fon_s13 fon_c11 pay_item" pid="{{=it[i]["pays"][0]["id"]}}">{{=it[i]["pays"][0]["mark"]}}</span> <span class="posi_a qIcon_2"><img ' +
							'src="../../images/q_icon_2.png"></span>' +
					'</div>' +
					'<ul class="qConBox_4 bg_c1 rad_2 posi_a dn pay_type_list">' +
						'{{for(var p = 0; p < it[i]["pays"].length; p ++){}}' +
						'{{if(p == 0){}}' +
						'<li class="qOrderDetailsBox_line2 fon_s11" pid="{{=it[i]["pays"][p]["id"]}}">' + 
						'{{}else{}}' +
						'<li class="fon_s11" pid="{{=it[i]["pays"][p]["id"]}}">' +
						'{{}}}' +
						'{{=it[i]["pays"][p]["mark"]}}' +
						'</li>' +
						'{{}}}' +
						'<li class="qIcon_3 posi_a"><img ' +
							'src="../../images/q_icon_4.png"></li>' +
					'</ul>' +
				'</div>' +
		
				'<div class="posi_r qConBox_3 mt1">' +
					'<span class="fon_s13 ">%%lang_shipping%%</span>:' +
					'<div class="posi_a qConBox_2 rad_2">' +
					'{{if(it[i]["goods"]["goods_transfee"]==1){}}'+
						'<span class="fon_s13 fon_c11">Mail $<span class="trans_item">0</span></span> <span ' +
							'class="posi_a qIcon_2"></span>' +
					'{{}else{}}'+
						'<span class="fon_s13 fon_c11">Mail $<span class="trans_item">{{=it[i]["goods"]["transfee"]*1000/1000}}</span></span> <span ' +
						'class="posi_a qIcon_2"></span>' +
					'{{}}}'+
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'{{}}}';
	module.exports = buy_now_list_template;
});