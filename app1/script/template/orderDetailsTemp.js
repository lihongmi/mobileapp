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
		prefix = config.IMG_PREFIX_GOODS_SMALL[1];
	}
	
	var temp = 
		'<div class="qOrderDetailsBox shadow"><h1 class="qOrderDetailsBox_tit qOrderDetailsBox_line"><span class="fon_s12 fon_c17">%%lang_order_status%%</span>   <span class="fon_s12 fon_c21 ml1">'+
		'{{if(it.order.order_status == 10 || it.order.order_status == 70){}}'+
			'<span>%%lang_unpaid_orders%%</span>'+
		'{{}else if(it.order.order_status == 30){}}'+
			'<span>%%lang_unreceipted_orders%%</span>'+
		'{{}else if(it.order.order_status == 16 || it.order.order_status == 20){}}'+
			'<span>%%lang_unshipped_orders%%</span>'+
		'{{}else if(it.order.order_status == 99){}}'+
			'<span>%%lang_completed_orders%%</span>'+
		'{{}}}'+	
		'</span></h1><h2 class="fon_s12 fon_c17 qOrderDetailsBox_tit2"><span>%%lang_pro_details%%</span></h2>'+
		'{{for(var i=0; i<it.goodsCart.length;i++){}}'+
			'<dl class="posi_r qOrderDetailsBox_box qOrderDetailsBox_line" on'+appFrame.getEventType("up")+'="openPro({{=it.goodsCart[i].goods.id}})">'+
		    '{{if(it.goodsCart[i].goods.goods_main_photo == null){}}'+
		    	'<dt class="shadow_2 posi_a qOrderDetailsBox_img"><img style="height:7em;" src="../../images/cart_null.png"></dt>'+
		    '{{}else{}}' +
		    	'<dt class="shadow_2 posi_a qOrderDetailsBox_img"><img style="height:7em;" src="'+config.IMG_HOST+'{{=it.goodsCart[i].goods.goods_main_photo.path}}/'+prefix+'{{=it.goodsCart[i].goods.goods_main_photo.name}}'+'"></dt>'+
		    '{{}}}'+
		    	'<dd class="qOrderDetailsBox_de">'+
		        	'<h2 class="fon_s10 fon_c17">{{=it.goodsCart[i].goods.goods_name}}</h2>'+
		            '<p class="fon_s10 fon_c13 word_all"><span>%%lang_quantity%%</span>:{{=it.goodsCart[i].count}}</p>'+
		            '{{if(it.goodsCart[i].spec_info){}}'+
		            	'<p class="fon_s10 fon_c13">{{=it.goodsCart[i].spec_info}}</p>'+
		            '{{}}}'+
		            '<p class="fon_s10 fon_c17 txt_3"><span>%%lang_subtotal%%</span>:<span class="fon_c21">${{=it.goodsCart[i].fact_price}}</span></p>'+
		            '<span class="qOrderDetailsBox_icon posi_a"><img src="../../images/Arrow.png"></span>'+
		        '</dd>'+
		    '</dl>'+
	    '{{}}}'+
		    '<dl class="posi_r qOrderDetailsBox_box2 qOrderDetailsBox_line">'+
		    	'<dt class="posi_a qOrderDetailsBox_tit3"><span class="fon_c17 fon_s12"><span>%%lang_delivery_method%%</span></span></dt>'+
		        '<dd class="qOrderDetailsBox_de2">'+
		            '<span class="fon_s10 fon_c13">'+
		        	'{{if(it.order.transport==1){}}'+
		        		'<span>%%lang_radio_sller_respond%%</span>'+
		        	'{{}else{}}'+
		        		'<span>%%lang_radio_buyer_respond%%</span>'+
		        	'{{}}}'+
		        	'${{=it.order.ship_price}}'+
		        	'</span>'+
		       '</dd>'+
		    '</dl>'+
		    '<dl class="posi_r qOrderDetailsBox_box2 qOrderDetailsBox_line">'+
		    	'<dt class="posi_a qOrderDetailsBox_tit3"><span class="fon_c17 fon_s12"><span>%%lang_address_detail%%</span></span></dt>'+
		        '<dd class="qOrderDetailsBox_de2">'+
		        '{{if(it.addr.areaName!=true){}}'+
		        	'{{if(it.addr.area.parent!=null){}}'+
		            	'<span class="fon_s10 fon_c13 word_all">{{=it.addr.area.areaName}}&nbsp{{=it.addr.area.parent.areaName}}&nbsp{{=it.addr.area_info}}&nbsp{{=it.addr.trueName}}&nbsp{{=it.addr.mobile}}</span>'+     
		            '{{}else{}}'+
		            	'<span class="fon_s10 fon_c13 word_all">{{=it.addr.area.areaName}}&nbsp{{=it.addr.area_info}}&nbsp{{=it.addr.trueName}}&nbsp{{=it.addr.mobile}}</span>'+     
		            '{{}}}'+
		        '{{}else{}}'+
		        	'<span class="fon_s10 fon_c13 word_all">{{=it.addr.area.parent.areaName}}&nbsp{{=it.addr.area_info}}&nbsp{{=it.addr.trueName}}&nbsp{{=it.addr.mobile}}</span>'+     
		        '{{}}}'+
		        '</dd>'+
		    '</dl>'+
		    '<dl class="posi_r qOrderDetailsBox_box2">'+
		    	'<dt class="posi_a qOrderDetailsBox_tit3"><span class="fon_c17 fon_s12"><span>%%lang_order_details%%</span></span></dt>'+
		        '<dd class="qOrderDetailsBox_de2">'+
		            '<span class="fon_s10 fon_c13"><span>%%lang_order_no%%</span>:&nbsp{{=it.order.order_id}}</span>'+
		       '</dd>'+
		    '</dl>'+
		'</div>'+
		'<div class="posi_f qOrderDetailsFoot">'+
		   '<ul> <li class="fon_s7 fon_c22 fl"><span>%%lang_total_amount%%</span>:</li> <li class="fl"><span class="fon_s5 fon_c21">${{=it.order.totalPrice}}</span></li></ul>'+
		    '{{if(it.order.order_status == 10 || it.order.order_status == 70 || it.order.order_status == 80){}}'+
				'<a class="db qOrderDetailsFoot_btn posi_a shadow_3" id="status" order-status="1" store-id="{{=it.goodsCart[0].store.id}}" order-id="{{=it.order.id}}"><span class="fon_c6 fon_s12">%%lang_buttons_paynow%%</span></a>'+
			'{{}else if(it.order.order_status == 30){}}'+
				'<a class="db qOrderDetailsFoot_btn posi_a shadow_3" id="status" order-status="3" store-id="{{=it.goodsCart[0].store.id}}" order-id="{{=it.order.id}}"><span class="fon_c6 fon_s12">%%lang_confirm_receipt%%</span></a>'+
			'{{}else if(it.order.order_status == 16 || it.order.order_status == 20){}}'+
				'<a class="db qOrderDetailsFoot_btn posi_a shadow_3"id="status" order-status="2" store-id="{{=it.goodsCart[0].store.id}}" order-id="{{=it.order.id}}"><span class="fon_c6 fon_s12" >%%lang_remind_shipping%%</span></a>'+
			'{{}else if(it.order.order_status == 99){}}'+
				'{{if(it.order.is_evaluate!= 1){}}'+
					'<a class="db qOrderDetailsFoot_btn posi_a shadow_3" id="status" order-status="4" store-id="{{=it.goodsCart[0].store.id}}" order-id="{{=it.order.id}}"><span class="fon_c6 fon_s12">%%lang_reviews_pad%%</span></a>'+
				'{{}}}'+
			'{{}}}'+
		'</div>';
	module.exports = temp;
});