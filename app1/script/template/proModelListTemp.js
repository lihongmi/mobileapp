define(function(require, exports, module){
	require('../ui/frame');
	var config = require('../config');
	var $ = require('../common/zepto-1.1.2');
	var prefix = "", prefix2= "";
	var width = $(document.body).width();
	if(width > 630){
		prefix = config.IMG_PREFIX_SPEC_SMALL[0];
		prefix2= config.IMG_PREFIX_GOODS_SMALL[0];
	}else if(width > 470){
		prefix = config.IMG_PREFIX_SPEC_SMALL[1];
		prefix2= config.IMG_PREFIX_GOODS_SMALL[1];
	}else if(width > 310){
		prefix = config.IMG_PREFIX_SPEC_SMALL[2];
		prefix2= config.IMG_PREFIX_GOODS_SMALL[2];
	}
	var pro_model_list_template = 
		'<h2 class="Home_box_tit posi_1">' +
			'{{=it.title}}' + 
			'<ul class="posi_2" id="{{=it.model}}Points">' +
			'{{for(var p = 0; p < it.goods.length / 3; p ++){}}' + 
				'<li><a href="#" class="{{if(p == 0){}}Hbut_on{{}}}"></a></li>' + 
			'{{}}}' +
			'</ul>' +
		'</h2>' +
		'<div class="Home_box_cont posi_1 swipe" id="{{=it.model}}List">' +
			'<div class="swipe-wrap">' + 
			'{{for(var i = 0; i < it.goods.length / 3; i ++){}}' +
				'<div>' +
					'<div class="Hbox_cont_L fl">' +
						'<div class="Hbox_cont_L_t posi_1 click_goods_item" ontouchstart="tStart(this)" ontouchmove="tMove(this)" on'+appFrame.getEventType("up")+'="goToDetail({{=it.goods[i * 3].id}}, this)">' +
							'<div class="Hbox_word_s">' +
								'<p class="Hprice_tit word_normal"><a href="#">{{=it.goods[i * 3].goods_name}}</a></p>' +
		                        '<span class="Hprice_new fl word_normal">{{=it.goods[i * 3].store_price}}</span>' +
							'</div>' +
							'<div class="Hbox_img_s">' +
							'{{if(it.goods[i * 3]["goods_main_photo"] == null){}}' +
								'<a href="javascript:void(0)"><img src="../images/home_noPic_06.png"></a>' +
							'{{}else{}}' +
								'<a href="javascript:void(0)"><img src="' + config.IMG_HOST + '{{=it.goods[i * 3]["goods_main_photo"].path}}/{{if(it.model == "recommend"){}}' + prefix + '{{}else{}}' + prefix2 + '{{}}}{{=it.goods[i * 3]["goods_main_photo"].name}}" onerror="javascript:this.src=\'../images/home_noPic_06.png\'"></a>' +
							'{{}}}' +
							'</div>' +
						'</div>' +
						'{{if(it.goods[i * 3 + 1] != null){}}' +
						'<div class="Hbox_cont_L_t posi_1 Bline_no click_goods_item" ontouchstart="tStart(this)" ontouchmove="tMove(this)" on'+appFrame.getEventType("up")+'="goToDetail({{=it.goods[i * 3 + 1].id}}, this)">' +
							'<div class="Hbox_word_s">' +
								'<p class="Hprice_tit word_normal"><a href="#">{{=it.goods[i * 3 + 1].goods_name}}</a></p>' +
		                        '<span class="Hprice_new fl word_normal">{{=it.goods[i * 3 + 1].store_price}}</span>' +
							'</div>' +
							'<div class="Hbox_img_s">' +
							'{{if(it.goods[i * 3 + 1]["goods_main_photo"] == null){}}' +
								'<a href="javascript:void(0)"><img src="../images/home_noPic_06.png"></a>' +
							'{{}else{}}' +
								'<a href="javascript:void(0)"><img src="' + config.IMG_HOST + '{{=it.goods[i * 3 + 1]["goods_main_photo"].path}}/{{if(it.model == "recommend"){}}' + prefix + '{{}else{}}' + prefix2 + '{{}}}{{=it.goods[i * 3 + 1]["goods_main_photo"].name}}" onerror="javascript:this.src=\'../images/home_noPic_06.png\'"></a>' +
							'{{}}}' +
							'</div>' +
						'</div>' +
						'{{}}}' +
					'</div>' +
					'{{if(it.goods[i * 3 + 2] != null){}}' +
					'<div class="Hbox_cont_R fl click_goods_item" ontouchstart="tStart(this)" ontouchmove="tMove(this)" on'+appFrame.getEventType("up")+'="goToDetail({{=it.goods[i * 3 + 2].id}}, this)">' +
						'<div class="Hbox_img_b">' +
						'{{if(it.goods[i * 3 + 2]["goods_main_photo"] == null){}}' +
							'<a href="javascript:void(0)"><img src="../images/home_noPic_06.png"></a>' +
						'{{}else{}}' +
							'<a href="javascript:void(0)"><img src="' + config.IMG_HOST + '{{=it.goods[i * 3 + 2]["goods_main_photo"].path}}/{{if(it.model == "recommend"){}}' + prefix + '{{}else{}}' + prefix2 + '{{}}}{{=it.goods[i * 3 + 2]["goods_main_photo"].name}}" onerror="javascript:this.src=\'../images/home_noPic_06.png\'"></a>' +
						'{{}}}' +
						'</div>' +
						'<h3>' +
							'<a href="javascript:void(0)">{{=it.goods[i * 3 + 2].goods_name}}</a>' +
						'</h3>' +
						'<div class="Hbox_word_b">' +
			                '<span class="Hprice_new fl word_normal">{{=it.goods[i * 3 + 2].store_price}}</span>' +
						'</div>' +
					'</div>' +
					'{{}}}' +
				'</div>' +
			'{{}}}' +
			'</div>' +
		'</div>';
	module.exports = pro_model_list_template;
});
