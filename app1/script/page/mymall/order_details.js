define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var config = require('../../config');
	var doT = require('../../common/doT');
	var temp = require('../../template/orderDetailsTemp');
	var userId=window.localStorage['userId'];
	var msg_flag=0;////提醒卖家语言  0为中文  1为英文
	var order_id='';
	var parme=null;
	//返回
	$('#back').on(appFrame.getEventType("up"),Goback);
	function Goback(){
		appFrame.close();
		window.localStorage.removeItem('orderId');
		window.localStorage.removeItem('evaluation_orderId');
	};
	appFrame.loadPage = function(){
		var lang = window.localStorage.getItem("lang");
		msg_flag = lang=='en_US' ? 1: 0;
		$('#orderDetails').html('');
		order_id=window.localStorage['orderId'];
		var parme={'id':order_id};
		server.getOrderDetailData(getSuccess,{'id':order_id});
		$('#submit').addClass('dn');
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		msg_flag = lang=='en_US' ? 1: 0;
		changeInterLang(lang);
		order_id=window.localStorage['orderId'];
		var parme={'id':order_id};
		server.getOrderDetailData(getSuccess,{'id':order_id});
		$('#submit').addClass('dn');
	};
	function getSuccess(data){
		if(data.result==1){
			var temp1 = doT.template(temp.replace(/%%(\w*)%%/g, function($0,$1,$2){
				return getLangVal($1);
			}));
			$('#orderDetails').html(temp1(data));
			giveUpOrder($('#status').attr("order-status"));
			setTimeout(function(){
				$('#status').on(appFrame.getEventType("up"), function(){
					var $this = $(this);
					orderStatus($this.attr("order-status"),$this.attr("store-id"),$this.attr("order-id"));
				});
			}, 300);
		}else{
			appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_se">' + getLangVal("lang_se") + '</span>',2000);
		};
	};
	function giveUpOrder(order_status){
		if(order_status==1){
			$('#submit').removeClass('dn');
		}else if(order_status==2){
			$('#submit').addClass('dn');
		}else if(order_status==3){
			$('#submit').addClass('dn');
		}else{
			$('#submit').addClass('dn');
		}
	};
	function orderStatus(order_status,store_id,order_id){
		if(order_status==1){
			goPay(order_id);
		}else if(order_status==2){
			reminderSms(store_id,order_id);
		}else if(order_status==3){
			confirm_receipt(order_id);
		}else{
			evaluation(order_id);
		}
	};
	//立即支付
	function goPay(order_id){
		window.localStorage['coob_order_id']=order_id;
		appFrame.open('cooBillConfirm','html/pay/cooBillConfirm.html');
	}
	//提醒卖家发货
	function reminderSms(store_id,order_id){
		var parme={'cart_user_id':userId,'cart_store_id':store_id,'order_id':order_id,'msg_flag':msg_flag};
		server.sendReminderSms(function(data){
			if(data.result==1){
				appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_shipping_s">' + getLangVal("lang_msg_shipping_s") + '</span>',2000);
			}
		},parme);
	}
	//确认收货
	function confirm_receipt( order_id ){
		var parme={'id':order_id,'opt_type':3};
		server.editOrderStatus(function(data){
			if(data.result==1){
				appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_confirm_receive">' + getLangVal("lang_msg_confirm_receive") + '</span>',1000);
				setTimeout(function(){
					appFrame.close();
				},1010);
			}
		},parme);
	}
	//评价
	function evaluation(order_id){
		window.localStorage['evaluation_orderId']=order_id;
		appFrame.open('orders_evaluation','html/mymall/orders_evaluation.html');
	}
	//取消订单
	$('#submit').on(appFrame.getEventType("up"),function(){
		var options = {
				id: "abc",
				header: {
					text: '<span class="inter_lang_font" langkey="lang_cancel_order_pad">' + getLangVal("lang_cancel_order_pad") + '</span>'
				},
				selectList: [{
					text: '<span class="inter_lang_font" langkey="lang_not_buy">' + getLangVal("lang_not_buy") + '</span>',
					value:'0'
				},{
					text: '<span class="inter_lang_font" langkey="lang_wrong_information">' + getLangVal("lang_wrong_information") + '</span>',
					value:'1'
				},{
					text: '<span class="inter_lang_font" langkey="lang_out_stock">' + getLangVal("lang_out_stock") + '</span>',
					value:'2'
				},{
					text: '<span class="inter_lang_font" langkey="lang_other_reasons">' + getLangVal("lang_other_reasons") + '</span>',
					value:'3'
				}],
				selectFunction: function(val, txt, index){
					if(index==0){
						parme={'id':order_id,'opt_type':1,'cancel_reason':index+1};
						isOK(parme);
					}else if(index==1){
						parme={'id':order_id,'opt_type':1,'cancel_reason':index+1};
						isOK(parme);
					}else if(index==2){
						parme={'id':order_id,'opt_type':1,'cancel_reason':index+1};
						isOK(parme);
					}else if(index==3){
						parme={'id':order_id,'opt_type':1,'cancel_reason':index+1};
						isOK(parme);
					}
				}
			};
			appFrame.showConfirm(options);
	});
	function isOK(parme){
		server.editOrderStatus(function(data){
			if(data.result==1){
				appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_cancelled_order_s">' + getLangVal("lang_cancelled_order_s") + '</span>',1000);
				setTimeout(function(){
					appFrame.close();
				},1000);
			}
		},parme);
	}
});
