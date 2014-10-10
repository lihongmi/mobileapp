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
	var cart_list_template = 
		'{{for(var i = 0; i < it.store.length; i ++){}}' +
		'<div class="cart_list" id="cart_{{=i}}">' + 
			'<h1>' + 
				'<span>{{=it.store[i].store_name}}  （{{=it.store[i].gcs.length}}）</span>' +
				'<span style="display:inline-block;position:absolute;height:100%;width:5em;top:0;right:0;" class="store_check_btn">' +
				'<span class="check_one_store" style="line-height:1.4em;">' +
					'<img class="check_img_btn" check-status="0" cid="cart_{{=i}}" src="../../images/cart_check_all.png"/></span></h1>' + 
				'</span>' +
			'{{for(var j = 0; j < it.store[i].gcs.length; j ++){}}' +
			'<div class="cart_dl_list" id="item_{{=it.store[i].gcs[j].id}}">' +
				'<div class="posi_1">' +
					'<dl>' +
					'{{if(it.store[i].gcs[j].goods.goods_main_photo == null){}}' +
					'<dt on'+appFrame.getEventType("up")+'="showDetail({{=it.store[i].gcs[j].goods.id}})"><img src="../../images/home_noPic_06.png"/></dt>' +
					'{{}else{}}' +
					'<dt on'+appFrame.getEventType("up")+'="showDetail({{=it.store[i].gcs[j].goods.id}})"><img src="' + config.IMG_HOST + '{{=it.store[i].gcs[j].goods.goods_main_photo.path}}/' + prefix + '{{=it.store[i].gcs[j].goods.goods_main_photo.name}}"  onerror="javascript:this.src=\'../../images/home_noPic_06.png\'"/></dt>' +
					'{{}}}' +
					'<dd>' + 
						'<p class="fon_s11 fa_cont_d1">{{=it.store[i].gcs[j].goods.goods_name}}</p>' + 
						'<p class="fon_s11 fa_cont_d3">{{=it.store[i].gcs[j].spec_info}}</p>' + 
						'<p class="fon_s10 fa_cont_d2">' +
							'<span class="dib" style="width:3em;" id="pprice_{{=i}}_{{=j}}">' +
								'${{=(it.store[i].gcs[j].price * it.store[i].gcs[j].count * 1000) / 1000}}</span>' +
							'<span class="rad_1 dib ml1 shadow_4 txt_1" style="width:3em;" gid="{{=it.store[i].gcs[j].id}}" box-idx="_{{=i}}_{{=j}}" id="buyNumBtn_{{=i}}_{{=j}}">' +
								'<b class="fon_s10 qInt_1 fon_c23" id="buyNum_{{=i}}_{{=j}}">{{=it.store[i].gcs[j].count}}</b></span></p>' + 
						'{{if(it.store[i].gcs[j].goods.goods_status == -5 || it.store[i].gcs[j].goods.goods_status == -4){}}' +
						'<p class="fon_s10 fa_cont_d2"><span class="inter_lang_font" langkey="lang_deleted_pad">' + getLangVal("lang_deleted_pad") + '</span></p>' +
						'{{}else if(it.store[i].gcs[j].goods.goods_status == 1 || it.store[i].gcs[j].goods.goods_status == -2){}}' +
						'<p class="fon_s10 fa_cont_d2"><span class="inter_lang_font" langkey="lang_sold_out_pad">' + getLangVal("lang_sold_out_pad") + '</span></p>' +
						'{{}}}' +
						'{{if(it.store[i].gcs[j].count > it.store[i].gcs[j].spec_count){}}' +
						'<p class="fon_s10 fa_cont_d2" id="tip_{{=i}}_{{=j}}"><span class="inter_lang_font" langkey="lang_lable_exceeded_stock">' + getLangVal("lang_lable_exceeded_stock") + '</span></p>' +
						'{{}}}' +
					'</dd>' + 
					'</dl>' + 
					'{{if(it.store[i].gcs[j].goods.goods_status == 0){}}' +
					'<div style="position:absolute;width: 5em;height:100%;right:0;top:0;" class="goods_check_btn" sid="cart_{{=i}}">' +
					'<span class="fa_list_arrow check_one_store" style="width:1.4em; right:1.5em;">' +
						'<img class="check_img_list_btn" ' +
							 'id="ckbox_{{=i}}_{{=j}}" ' +
							 'box-idx="{{=i}}" ' +
							 'check-status="0" ' +
							 'pid="{{=it.store[i].gcs[j].goods.id}}" ' +
							 'pprice="{{=it.store[i].gcs[j].price}}" ' +
							 'pcount="{{=it.store[i].gcs[j].count}}" ' +
							 'sidx="{{=it.store[i].gcs[j].spec_ids}}" ' +
							 '{{if(it.store[i].gcs[j].count > it.store[i].gcs[j].spec_count){}}' +
							 'ocount="1" ' +
							 'gid="{{=it.store[i].gcs[j].id}}" src="../../images/checkbox_item.png"/></span>' + 
							 '{{}else{}}' +
							 'ocount="0" ' +
							 'gid="{{=it.store[i].gcs[j].id}}" src="../../images/cart_check_all.png"/></span>' + 
							 '{{}}}' +
					'{{}else{}}' +
					'<div style="position:absolute;width: 5em;height:100%;right:0;top:0;" class="goods_delete_btn" sid="cart_{{=i}}">' +
					'<span class="fa_list_arrow check_one_store" style="width:1.4em; right:1.5em;border:none;">' +
						'<img class="delete_img_list_btn" ' +
						 	 'id="ckbox_{{=i}}_{{=j}}" ' +
							 'box-idx="{{=i}}" ' +
							 'check-status="0" ' +
							 'pid="{{=it.store[i].gcs[j].goods.id}}" ' +
							 'pprice="{{=it.store[i].gcs[j].price}}" ' +
							 'pcount="{{=it.store[i].gcs[j].count}}" ' +
							 'sidx="{{=it.store[i].gcs[j].spec_ids}}" ' +
							 'gid="{{=it.store[i].gcs[j].id}}" src="../../images/delectAddress.png"/></span>' + 
					'{{}}}' +
					'</div>' +
				'</div>' + 
			'</div>' + 
			'{{}}}' +
		'</div>' + 
		'{{}}}';
	module.exports = cart_list_template;
});
