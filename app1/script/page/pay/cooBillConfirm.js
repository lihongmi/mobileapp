define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var config = require('../../config');
	var temp = '';
	var userId=window.localStorage['userId'];
	var order_id='';
	var reg=/^038\d{6,8}$|^020\d{6,8}$/;
	var msg_flag=0;////提醒卖家语言  0为中文  1为英文
	var parme1=null;
	var isCLick=true;
	//返回
	$('#back').on(appFrame.getEventType("up"),Goback);
	function Goback(){
		appFrame.close();
		window.localStorage.removeItem('coob_order_id');
	};
	appFrame.loadPage = function(){
		isCLick=true;
		$('#cooBill').val('');
		var lang = window.localStorage.getItem("lang");
		msg_flag = lang=='en_US' ? 1: 0;
		order_id=window.localStorage['coob_order_id'];
		var parme={'id':order_id};
		server.getOrderDetailData(getSuccess,parme);
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		msg_flag = lang=='en_US' ? 1: 0;
		changeInterLang(lang);
		$('#cooBill').val('');
		order_id=window.localStorage['coob_order_id'];
		var parme={'id':order_id};
		server.getOrderDetailData(getSuccess,parme);
	};
	
	function getSuccess(data){
		window.localStorage['total']=data.order.totalPrice;
		temp='<p class="fon_c23 fon_s13">'+data.goodsCart[0].goods.goods_name+'</p>'+
	         '<p class="fon_c23 fon_s13 mt_5"><span class="inter_lang_font" langkey="lang_intro46">'+getLangVal("lang_intro46")+'</span>:coomarts</p>'+
	         '<p class="mt_5"><span class="fon_c23 fon_s13 inter_lang_font" langkey="lang_total_amount_3">' + getLangVal("lang_total_amount_3") + '</span><span class="fon_s7 fon_c21">$'+data.order.totalPrice+'</span></p>';
		$('#cooBill_mail').html(temp);
	}
	
	$('#ConfirmPurchase').on(appFrame.getEventType("up"),function(){
		$(this).get(0).focus();
		if(isCLick){
			isCLick=false;
			var val=$('#cooBill').val();
			if(reg.test(val)){
				parme1={'cootel_id':val,'cart_user_id':userId,'order_id':order_id,'msg_flag':msg_flag};
				server.submitCoobillPay(function(data){
					if(data.result==1){
						if(data.fail_type==-1){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_exceeded_stock">' + getLangVal("lang_exceeded_stock") + '</span>', 1000);
							return;
						}else if(data.fail_type==-2){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_gdo_pad">' + getLangVal("lang_gdo_pad") + '</span>', 1000);
							return;
						}
						window.localStorage.setItem('payafter',false);
						appFrame.open('successfulPayment','html/pay/successfulPayment.html');
					}
				},parme1);
			}else{
				isCLick=true;
				appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_lable_input_coobill">' + getLangVal("lang_lable_input_coobill") + '</span>', 1000);
			}
		}
	});
});
