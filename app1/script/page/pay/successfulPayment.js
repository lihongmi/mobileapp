define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var config = require('../../config');
	var temp = '';
	var userId=window.localStorage['userId'];
	var order_id='';
	var parme=null;
	var parme1=null;
	var total=0;

	appFrame.loadPage = function(){
		$('#cooBill').val('');
		total=window.localStorage.getItem('total');
		order_id=window.localStorage['coob_order_id'];
		parme1={'user_id':userId};
		isPayafter();
		server.getDefaultAddress(getAdd,parme1);
		if(window.localStorage.getItem('payafter')){
			$('#isSuccessful').html('<span class="fon_s5 fon_c21 inter_lang_font" langkey="lang_ord_gen_pad">'+getLangVal('lang_ord_gen_pad')+'</span>');
		}else{
			$('#isSuccessful').html('<span class="fon_s5 fon_c21 inter_lang_font" langkey="lang_msg_pay_success">'+getLangVal('lang_msg_pay_success')+'</span>');
		}
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		if(window.localStorage.getItem('payafter')){
			$('#isSuccessful').html('<span class="fon_s5 fon_c21 inter_lang_font" langkey="lang_ord_gen_pad">'+getLangVal('lang_ord_gen_pad')+'</span>');
		}else{
			$('#isSuccessful').html('<span class="fon_s5 fon_c21 inter_lang_font" langkey="lang_msg_pay_success">'+getLangVal('lang_msg_pay_success')+'</span>');
		}
		total=window.localStorage.getItem('total');
		$('#cooBill').val('');
		order_id=window.localStorage['coob_order_id'];
		parme1={'user_id':userId};
		isPayafter();
		server.getDefaultAddress(getAdd,parme1);
	};
	
	function isPayafter(){
		if(window.localStorage.getItem('payafter')=='true'){
			$('#againPay').addClass('dn');
		}else{
			$('#againPay').removeClass('dn');
		}
	}
	
	//获取地址信息
	function getAdd(data){
		if(data.result==1){
			var temp='';
			if(data.addr.area.areaName){
				temp+=data.addr.area.areaName;
			}
			if(data.addr.area.parent){
				temp+='&nbsp;'+data.addr.area.parent.areaName;
			}
			temp+='&nbsp;'+data.addr.area_info+'&nbsp;'+data.addr.trueName+'&nbsp;'+data.addr.mobile;
			$('#pay_addr').html(temp);
			$('#total').html('<span class="inter_lang_font" langkey="lang_product_price">' + getLangVal("lang_product_price") + '</span>'+'：$'+total*100/100);
		}
	}
	//查看订单
	$('#ToOrder').on(appFrame.getEventType("up"),function(){
		window.localStorage.removeItem('coob_order_id');
		appFrame.open('my_mall','html/mymall/my_mall.html');
	});
	//继续购物
	$('#ToShop').on(appFrame.getEventType("up"),function(){
		window.localStorage.removeItem('coob_order_id');
		appFrame.open('home','html/home.html');
	});
	//重新支付
	$('#ToPay').on(appFrame.getEventType("up"),function(){
		order_id=window.localStorage['coob_order_id'];
		parme={'orderid':order_id};
		server.getCoobillStatus(function(data){
			if(data.result==1){
				if(data.paystatusA==0){
					appFrame.close();
				}else if(data.paystatusA==1){
					appFrame.showTooltip('该订单已支付成功',1000);
				}
			}
		},parme);
	});
});
