define(function(require, exports, module){
	require('../../ui/frame');
	require('../../ui/util');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var orderParam = null, complete = null;
	
	function createOrderList(json){
		if(json.result == 1){
			var status = json["fail_type"];
			if(status == 0){
				if(json["pay_name"] == "payafter"){
					$("#payafterBox").removeClass("dn");
					var html = '<p class="qConBox_1 qOrderDetailsBox_line">' +
					'<span class="fon_s10 fon_c20 inter_lang_font" lang-key="lang_order_no">'+getLangVal("lang_order_no")+':' + json["order_no"] + '</span> <span' +
						' class="fon_s10 fon_c20 ml2">$' + json["total_price"] + '</span>' +
					'</p>';
					$(html).appendTo("#payafterBoxList");
				}else if(json["pay_name"] == "coobill"){
					$("#coobillBox").removeClass("dn");
					var html = '<p class="qConBox_1 qOrderDetailsBox_line">' +
					'<span class="fon_s10 fon_c20 inter_lang_font" lang-key="lang_order_no">'+getLangVal("lang_order_no")+':' + json["order_no"] + '</span> <span' +
						' class="fon_s10 fon_c20 ml2">$' + json["total_price"] + '</span>' +
					'</p>';
					$(html).appendTo("#coobillBoxList");
				}
			}else if(status == 1){
				$("#inventoryBox").removeClass("dn");
				var html = '<p class="qConBox_1">' +
					'<span class="fon_s10 fon_c20">Goods</span> <span ' +
					'class="fon_s10 fon_c20 ml2">' + json["goods_name"] + '</span> <span ' +
					'class="fon_s10 fon_c20 ml2">$' + json["total_price"] + '</span>' +
					'</p>';
				$(html).appendTo("#inventoryBoxList");
			}else if(status == -2){
				$("#soldoutBox").removeClass("dn");
				var html = '<p class="qConBox_1">' +
					'<span class="fon_s10 fon_c20">Goods</span> <span ' +
					'class="fon_s10 fon_c20 ml2">' + json["goods_name"] + '</span>' +
					'</p>';
				$(html).appendTo("#soldoutBoxList");
			}
			var closeSC = true;
			for(var c = 0; c < complete.length; c ++){
				if(complete[c] == 1){
					complete[c] = 0;
					if(c != complete.length - 1){
						closeSC = false;
					}
					break;
				}
			}
			if(closeSC)
				appFrame.closeShadowCover();
		}
	}

	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		orderParam = JSON.parse(window.localStorage.getItem("orderParam"));
		
		appFrame.showShadowCover(true, null, "orderListWrap");
		complete = new Array();
		if(orderParam && orderParam.length > 0){
			for(var i in orderParam){
				complete[i] = 1;
			}
			for(var p = 0; p < orderParam.length; p ++){
				server.generateOrder(createOrderList, orderParam[p]);
			}
		}
		
		$("#returnToCartBtn, #returnToCartBtn2").on(appFrame.getEventType("up"), function(){
			appFrame.open("cart", "html/cart/cart.html");
		});
		$("#returnToHome,#goHome1,#goHome").on(appFrame.getEventType("up"), function(){
			appFrame.open("home", "html/home.html");
		});
		$("#checkOrder,#checkOrder1,#checkOrder2").on(appFrame.getEventType("up"), function(){
			appFrame.open("my_mall", "html/mymall/my_mall.html");
		});
	};
	
	appFrame.loadPage = function(){
		if(appFrame.isShadowCoverOnShow()){
			return;
		}
		
		$("#soldoutBoxList, #inventoryBoxList, #coobillBoxList, #payafterBoxList").empty().html("");
		$("#payafterBox, #coobillBox, #inventoryBox, #soldoutBox").addClass("dn");
		
		orderParam = JSON.parse(window.localStorage.getItem("orderParam"));
		
		appFrame.showShadowCover(true, null, "orderListWrap");
		complete = new Array();
		if(orderParam && orderParam.length > 0){
			for(var i in orderParam){
				complete[i] = 1;
			}
			for(var p = 0; p < orderParam.length; p ++){
				server.generateOrder(createOrderList, orderParam[p]);
			}
		}
	};
	
});