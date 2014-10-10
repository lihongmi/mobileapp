define(function(require, exports, module){
	require('../ui/frame');
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
	var product_list_template = 
		'{{for(var i = 0; i < it.goods.length; i ++){}}' +
		'<div class="search_cont_box">' + 
			'<a href="javascript:void(0)">' + 
				'<dl ontouchstart="tStart(this)" ontouchmove="tMove(this)" on'+appFrame.getEventType("up")+'="showDetail({{=it.goods[i]["id"]}}, this)">' + 
					'{{if(it.goods[i]["goods_main_photo"] == null){}}' + 
					'<dt><img src="../../images/home_noPic_06.png"/></dt>' +
					'{{}else{}}' +
					'<dt><img src="' + config.IMG_HOST + '{{=it.goods[i]["goods_main_photo"].path}}/' + prefix + '{{=it.goods[i]["goods_main_photo"].name}}"  onerror="javascript:this.src=\'../../images/home_noPic_06.png\'"/></dt>' +
					'{{}}}' +
					'<dd>' +
						'<p class="fon_s11 fa_cont_d1 word_all">{{=it.goods[i].goods_name}}</p>' +
						'<p class="fon_s10 fa_cont_d2">{{=it.goods[i].store_price}}</p>' + 
						'<p class="fon_s11 fa_cont_d3">'+"<span class='inter_lang_font' langkey='lang_product_month_sale'>" + getLangVal("lang_product_month_sale") + "</span>"+': {{=it.goods[i].goods_salenum}}</p>' + 
					'</dd>' + 
				'</dl>' + 
			'</a>' +
		'</div>' + 
		'{{}}}';
	module.exports = product_list_template;
});
