define(function(require, exports, module){
	require('../ui/frame');
	var config = require('../config');
	var $ = require('../common/zepto-1.1.2');
	var prefix = "";
	var width = $(document.body).width();
	if(width > 630){
		prefix = config.IMG_PREFIX_GOODS_MEDIUM[0];
	}else if(width > 470){
		prefix = config.IMG_PREFIX_GOODS_MEDIUM[1];
	}else if(width > 310){
		prefix = config.IMG_PREFIX_GOODS_MEDIUM[2];
	}
	var product_list_template = 
		'{{for(var i = 0; i < it.goods.length; i ++){}}' +
		'<li ontouchstart="tStart(this)" ontouchmove="tMove(this)" on'+appFrame.getEventType("up")+'="showDetail({{=it.goods[i]["id"]}}, this)">' + 
			'<div class="goodsD_img posi_1">' + 
				'<a href="javascript:void(0)">' + 
					'{{if(it.goods[i]["goods_main_photo"] == null){}}' + 
					'<img src="../../images/home_noPic_06.png"/>' +
					'{{}else{}}' +
					'<img src="' + config.IMG_HOST + '{{=it.goods[i]["goods_main_photo"].path}}/' + prefix + '{{=it.goods[i]["goods_main_photo"].name}}"  onerror="javascript:this.src=\'../../images/home_noPic_06.png\'" />' +
					'{{}}}' +
				'</a>' +
				'<div class="goodsD_Tbg opac50 posi_2"></div>' + 
				'<div class="goodsd_tit posi_2 word_all">' + 
					'<a href="#">{{=it.goods[i].goods_name}}</a>' +
				'</div>' +
			'</div>' + 
			'<div class="goodsD_price">' +
				'<p>' +
				'<span class="price_new">{{=it.goods[i].store_price}}</span> <span class="price_old">{{=it.goods[i].goods_price}}</span>' + 
				'</p>' + 
				'<p class="goodsD_Snums">'+"<span class='inter_lang_font' langkey='lang_product_month_sale'>" + getLangVal("lang_product_month_sale") + "</span>"+'：{{=it.goods[i].goods_salenum}}</p>' + 
			'</div>' + 
		'</li>' +
		'{{}}}';
	module.exports = product_list_template;
});