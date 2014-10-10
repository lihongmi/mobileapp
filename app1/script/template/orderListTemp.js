define(function(require, exports, module){
	require('../ui/frame');
	var config = require('../config');
	var prefix = "";
	var width = $(document.body).width();
	if(width > 630){
		prefix = config.IMG_PREFIX_GOODS_SMALL[0];
	}else if(width > 470){
		prefix = config.IMG_PREFIX_GOODS_SMALL[1];
	}else if(width > 310){
		prefix = config.IMG_PREFIX_GOODS_SMALL[2];
	}
	var temp = 
		'{{for(var i=0;i<it.orders.length;i++){}}' +
		'<div class="posi_1" on'+appFrame.getEventType("up")+'="toOrderDetail({{=it.orders[i].id}})">' + 
				'<dl>' + 
					'{{if(it.orders[i]["goods"][0]["goods_main_photo"] == null){}}' + 
					'<dt><img src="../../images/home_noPic_06.png"/></dt>' +
					'{{}else{}}' +
					'<dt><img src="'+config.IMG_HOST+'{{=it.orders[i]["goods"][0].goods_main_photo.path}}/'+prefix+'{{=it.orders[i]["goods"][0].goods_main_photo.name}}'+'"/></dt>' +
					'{{}}}' +
					'<dd>' +
						'<p class="fon_s11 fa_cont_d1">{{=it.orders[i].goods[0].goods_name}}</p>' +
						'<p class="fon_s11 fa_cont_d3">{{=it.orders[i].addTime}}</p>' + 
						'<p class="fon_s11 fa_cont_d3">{{=it.orders[i].order_id}}</p>' + 
						'<p class="fon_s11 fa_cont_d3"><span class="fa_cont_d1">%%lang_product_price%%</span>:</span><span class="fa_cont_d2">${{=it.orders[i].totalPrice}}</span>| {{=it.orders[i].goods.length}}%%lang_many_items%%</span></p>' + 
					'</dd>' + 
				'</dl>' + 
			'<img class="fa_list_arrow posi_2" src="../../images/Arrow.png"/>' +
		'</div>' + 
		'{{}}}';
	module.exports = temp;
});