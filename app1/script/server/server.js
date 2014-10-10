define(function(require, exports, module){
	
	var $ = require('../common/zepto-1.1.2.js');
	var config = require('../config');
//	var wsCallback = {}, unique_id = 0, is_conn = false;
//	var webSocket = new WebSocket('ws://10.0.19.39:8080/coomarts_app_new/core.do');
//	webSocket.onopen = function(){
//		is_conn = true;
//	};
//	webSocket.onmessage = function(event){
//		var jsonData = JSON.parse(event.data);
//		wsCallback[jsonData["callback"]](jsonData);
//		delete wsCallback[jsonData["callback"]];
//	};
	
	var servers = {
		getAdvertsData: function(completedCallback, param, wsCall){
			this.getJSON(config.ADVERTS_LIST, param, completedCallback, wsCall);
		},
		getRecommendedData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_RECOMMENDED, param, completedCallback, wsCall);
		},
		getNewData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_NEW, param, completedCallback, wsCall);
		},
		getSaleData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_SALE, param, completedCallback, wsCall);
		},
		getGoodsClassData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_GOOD_CLASS, param, completedCallback, wsCall);
		},
		getGoodsByClassData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_GOOD_BY_CLASS, param, completedCallback, wsCall);
		},
		getGoodsByKeywordsData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_GOOD_BY_KEYWORDS, param, completedCallback, wsCall);
		},
		getGoodsDetailData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_GOODS_DETAIL, param, completedCallback, wsCall);
		},
		getGoodsStatusData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_GOODS_STATUS, param, completedCallback, wsCall);
		},
		
		isGoodsCollect: function(completedCallback, param, wsCall){
			this.getJSON(config.IS_GOODS_COLLECT, param, completedCallback, wsCall);
		},
		updateGoodsCollect: function(completedCallback, param, wsCall){
			this.getJSON(config.UPDATE_GOODS_COLLECT, param, completedCallback, wsCall);
		},
		getGoodsEval: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_GOODS_EVAL, param, completedCallback, wsCall);
		},
		getGoodsSpecInfo: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_GOODS_SPEC_INFO, param, completedCallback, wsCall);
		},
		updateGoodsClick: function(completedCallback, param, wsCall){
			this.getJSON(config.UPDATE_GOODS_CLICK, param, completedCallback, wsCall);
		},

		addGoodsToCart: function(completedCallback, param, wsCall){
			this.getJSON(config.ADD_GOODS_TO_CART, param, completedCallback, wsCall);
		},
		getGoodsCartData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_GOODS_CART, param, completedCallback, wsCall);
		},
		deleteGoodsFromCartData: function(completedCallback, param, wsCall){
			this.getJSON(config.DELETE_GOODS_FROM_CART, param, completedCallback, wsCall);
		},
		getBuyNowListData: function(completedCallback, param, wsCall){
			this.getJSON(config.BUY_DIRECTLY_LIST, param, completedCallback, wsCall);
		},
		buyNow: function(completedCallback, param, wsCall){
			this.getJSON(config.BUY_DIRECTLY_NO_CART, param, completedCallback, wsCall);
		},
		genOrderCart: function(completedCallback, param, wsCall){
			this.getJSON(config.GEN_ORDER_CART, param, completedCallback, wsCall);
		},
		modifyGoodsNum: function(completedCallback, param, wsCall){
			this.getJSON(config.MODIFY_GOODS_NUM, param, completedCallback, wsCall);
		},

		generateOrder: function(completedCallback, param, wsCall){
			this.getJSON(config.SAVE_ORDER, param, completedCallback, wsCall);
		},
		getNonpayOrderData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_NONPAY_ORDER, param, completedCallback, wsCall);
		},
		getWaitShipOrderData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_WAIT_SHIP_ORDER, param, completedCallback, wsCall);
		},
		sendReminderSms: function(completedCallback, param, wsCall){
			this.getJSON(config.SEND_REMINDER_SMS, param, completedCallback, wsCall);
		},
		getNonReceiveOrderData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_NON_RECEIVE_ORDER, param, completedCallback, wsCall);
		},
		getFinishOrderData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_FINISHED_ORDER, param, completedCallback, wsCall);
		},
		getOrderDetailData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_ORDER_DETAIL, param, completedCallback, wsCall);
		},
		editOrderStatus: function(completedCallback, param, wsCall){
			this.getJSON(config.UPDATE_ORDER_STATUS, param, completedCallback, wsCall);
		},

		submitCoobillPay: function(completedCallback, param, wsCall){
			this.getJSON(config.SAVE_COOBILL_PAY, param, completedCallback, wsCall);
		},
		getCoobillStatus: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_COOBILL_STATUS, param, completedCallback, wsCall);
		},

		getAddressListData: function(completedCallback, param, wsCall){
			this.getJSON(config.QUERY_ADDRESS_LIST, param, completedCallback, wsCall);
		},
		addAddress: function(completedCallback, param, wsCall){
			this.getJSON(config.ADD_ADDRESS, param, completedCallback, wsCall);
		},
		editAddress: function(completedCallback, param, wsCall){
			this.getJSON(config.UPDATE_ADDRESS, param, completedCallback, wsCall);
		},
		deleteAddress: function(completedCallback, param, wsCall){
			this.getJSON(config.DELETE_ADDRESS, param, completedCallback, wsCall);
		},
		setDefaultAddress: function(completedCallback, param, wsCall){
			this.getJSON(config.SET_DEFAULT_ADDRESS, param, completedCallback, wsCall);
		},
		getDefaultAddress: function(completedCallback, param, wsCall){
			this.getJSON(config.GET_DEFALUT_ADDRESS, param, completedCallback, wsCall);
		},

		saveOrderEvalute: function(completedCallback, param, wsCall){
			this.getJSON(config.SAVE_ORDER_EVALUTE, param, completedCallback, wsCall);
		},
		
		checkUser: function(completedCallback, param, wsCall){
			this.getJSON(config.CHECK_USER, param, completedCallback, wsCall);
		},
		checkMail: function(completedCallback, param, wsCall){
			this.getJSON(config.CHECK_MAIL, param, completedCallback, wsCall);
		},
		userRegister: function(completedCallback, param, wsCall){
			this.getJSON(config.USER_REGISTER, param, completedCallback, wsCall);
		},
		userLogin: function(completedCallback, param, wsCall){
			this.getJSON(config.USER_LOGIN, param, completedCallback, wsCall);
		},
		userServiceAgree: function(completedCallback, param, wsCall){
			this.getJSON(config.USER_SERVICE_AGREE, param, completedCallback, wsCall);
		},

		getInterLang: function(completedCallback, param, wsCall){
			this.getJSON(config.GET_INTER_LANG, param, completedCallback, wsCall);
		},
		submitAdvice: function(completedCallback, param, wsCall){
			this.getJSON(config.SUBMIT_ADVICE, param, completedCallback, wsCall);
		},
		goodsFavorite: function(completedCallback, param, wsCall){
			this.getJSON(config.GOODS_FAVORITE, param, completedCallback, wsCall);
		},
		
		getJSON: function(url, param, jsonCallback, wsCall){
			if(!wsCall){
				if(config.DEBUG){
					url = url.replace(".htm", ".json");
				}else{
					url = config.URL_HOST + url + "?jsoncallback=?" ;
					$.getJSON(url, param, jsonCallback);
				}
			}else{
//				if(webSocket && is_conn){
//					if(!param)param = {};
//					unique_id ++;
//					wsCallback["wsCallback_" + unique_id] = jsonCallback;
//					var json = {url: url,param:param,callback:"wsCallback_" + unique_id};
//					webSocket.send(JSON.stringify(json));
//				}else{
//					var me = this;
//					setTimeout(function(){
//						me.getJSON(url, param, jsonCallback, wsCall);
//					}, 100);
//				}
			}
		},
		closeWS: function(){
			if(webSocket){
				is_conn = false;
				webSocket.close();
			}
		}
	};
	module.exports = servers;
});
