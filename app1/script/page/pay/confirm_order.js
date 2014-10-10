define(function(require, exports, module){
	require('../../ui/frame');
	require('../../ui/util');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var Swipe = require('../../common/swipe');
	var doT = require('../../common/doT');
	var config = require('../../config');
	
	var buyNowListTempl = require('../../template/buyNowListTemp');
	var userId=window.localStorage['userId'];
	var parme=null;
	var parme1=null;
	var ids='';
	var temp='';
	var temp1='';
	var imgPath='';
	var total=0, isSubmit = false;
	var addChange=false;
	//返回
	$('#back').on(appFrame.getEventType("up"),Goback);
	function Goback(){
		appFrame.back();
		window.localStorage.removeItem("cartIdx");
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		ids=window.localStorage["cartIdx"];
		parme1={'user_id':userId};
		appFrame.showShadowCover(true, null, "orderListWrap");
		if(window.localStorage['buyNowParam']){
			parme=window.localStorage['buyNowParam'];
			parme=eval('(' + parme + ')');
			server.buyNow(getCarts,parme);
		}else{
			parme={'user_id':userId,'ids':ids};
			server.getBuyNowListData(getCarts,parme);
		}
		server.getDefaultAddress(getAdd,parme1);
		
		$("#submitBtn").on(appFrame.getEventType("up"), function(){
			$(this).get(0).focus();
			if($('#address').find('p').length == 0){//提交判断是否有地址
				confirmAdd();
			}else{
				if(window.localStorage['buyNowParam']){
					parme=window.localStorage['buyNowParam'];
					parme = eval('(' + parme + ')');
					if(!isSubmit)
					server.genOrderCart(function(data){
						isSubmit = true;
						if(data.result == 1){
							if(data.fail_type == 1){
								appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_stock_shortage_pad">' + getLangVal("lang_stock_shortage_pad") + '</span>', 1000);
								isSubmit = false;
								return;
							}else if(data.fail_type == -2){
								appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_gdo_pad">' + getLangVal("lang_gdo_pad") + '</span>', 1000);
								isSubmit = false;
								return;
							}
							var ids=data.goodsCart[0].id;
							var param1 = {};
							$("#payCont div.order_info_item").each(function(){
								var $this = $(this);
								param1.cart_user_id = userId;
								param1.cart_store_id = $this.attr("sid");
								param1.pay_name = $this.find("span.pay_item").html();
								param1.pay_id = $this.find("span.pay_item").attr("pid");
								param1.addr_id = $('#address').attr("aid");
								param1.ship_name = "ABC";
								param1.ship_price = $this.find("span.trans_item").html();
								param1.total_price = $this.find("span.total_price_item").html();
								param1.gc_ids = ids;
								window.localStorage.setItem("orderParam", JSON.stringify(params));
							});
							server.generateOrder(function(data){
								if(data.result==1){
									window.localStorage['coob_order_id']=data.order_id;
									var payWay=$('.pay_item').text();
									if(payWay!='payafter'){//非货到付款
										appFrame.open("cooBillConfirm", "html/pay/cooBillConfirm.html");
									}else{
										window.localStorage.setItem('payafter',true);
										window.localStorage.setItem('total',data.total_price);
										appFrame.open('successfulPayment','html/pay/successfulPayment.html');
									};
								}
							},param1);
						}
					}, parme);
						
				}else{
					var params = [];
					$("#payCont div.order_info_item").each(function(){
						var param = {}, $this = $(this);
						param.cart_user_id = userId;
						param.cart_store_id = $this.attr("sid");
						param.pay_name = $this.find("span.pay_item").html();
						param.pay_id = $this.find("span.pay_item").attr("pid");
						param.addr_id = $('#address').attr("aid");
						param.ship_name = "ABC";
						param.ship_price = $this.find("span.trans_item").html();
						param.total_price = $this.find("span.total_price_item").html();
						var ids = [];
						$this.find("dl.cart_item").each(function(){
							ids.push($(this).attr("gid"));
						});
						param.gc_ids = ids.join(",");
						params.push(param);
					});
					
					window.localStorage.setItem("orderParam", JSON.stringify(params));
					appFrame.open("orderList", "html/pay/order_list.html");	
				}
			}
		});
		$('#address').on(appFrame.getEventType("up"),function(){
			if(!addChange){
				addChange=true;
				window.localStorage.setItem("checkAddress",true);
				appFrame.open('delivery_address', "html/mymall/delivery_address.html");
			}
		});
	};
	
	appFrame.loadPage = function(){
		isSubmit = false;
		addChange=false;
		userId=window.localStorage['userId'];
		$("#payCont ul.pay_type_list li.fon_s11").off(appFrame.getEventType("up"));
		$("#payCont div.pay_type_btn").off(appFrame.getEventType("up"));
		$("#payCont, #address").empty().html("");
		ids=window.localStorage["cartIdx"];
		parme1={'user_id':userId};
		appFrame.showShadowCover(true, null, "orderListWrap");
		if(window.localStorage['buyNowParam']){
			parme=window.localStorage['buyNowParam'];
			parme=eval('(' + parme + ')');
			server.buyNow(getCarts,parme);
		}else{
			parme={'user_id':userId,'ids':ids};
			server.getBuyNowListData(getCarts,parme);
		}
		server.getDefaultAddress(getAdd,parme1);
	};
	
	function getCarts(data){
		if(data.result==1){
			var obj = from2BToData(data);
			var doTtmpl = doT.template(buyNowListTempl.replace(/%%(\w*)%%/g, function($0,$1,$2){
				return getLangVal($1);
			}));
			$("#payCont").html(doTtmpl(obj));
			var price = 0;
			for(p in obj){
				price += parseFloat(obj[p]["totalPrice"]) * 100;
			}
			$("#orderTotal").html(price / 100);
			$("#payCont div.pay_type_btn").on(appFrame.getEventType("up"), function(){
				$(this).next().toggleClass("dn");
			});
			$("#payCont ul.pay_type_list li.fon_s11").on(appFrame.getEventType("up"), function(){
				var $this = $(this);
				var pid = $this.attr("pid"), pname = $this.text();
				$this.parent().toggleClass("dn").prev().find("span.pay_item").attr("pid", pid).html(pname);
			});
			appFrame.closeShadowCover();
		}
	}
	
	function getAdd(data){
		if(data.result==1){
			if(data.addr!=null){
				var html ='<div class="posi_r" id="changeAdd">'+
	               '<h2 class="qTit_3"><span class="fon_c24 fon_s7 inter_lang_font" langkey="lang_sa">'+getLangVal("lang_sa")+'</span></h2>'+
	               '<p class="qCon_1 word_all">'+
	                '<span class="fon_s11 fon_c23">';
	                if(data.addr.area.areaName){
	                	html += data.addr.area.areaName+'&nbsp;';
	                }
	                if(data.addr.area.parent){
	                	html += data.addr.area.parent.areaName+'&nbsp;';
	                }
	                html += data.addr.area_info+'&nbsp;'+data.addr.trueName+'&nbsp;'+data.addr.mobile+'</span>'+
	               '</p>'+
	               '<span class="qIcon_1 posi_a"><img src="../../images/q_icon_1.png"></span>'+
	           '</div>';
				$('#address').attr("aid", data.addr.id).html(html);
			}else{
				var html ='<div class="posi_r" id="changeAdd">'+
	               '<h2 class="qTit_3"><span class="fon_c24 fon_s7 inter_lang_font" langkey="lang_sa">'+getLangVal("lang_sa")+'</span></h2></div>';
				$('#address').html(html);
				confirmAdd();
			}
		}
	}
	function confirmAdd(){
		var options = {	
				id: "abc",
				header: {
					text: '<span class="inter_lang_font" langkey="lang_sa">' + getLangVal("lang_sa") + '</span>'
				},
			confirm: {
				text: '<span class="inter_lang_font" langkey="lang_msg_no_address">' + getLangVal("lang_msg_no_address") + '</span>',
				buttonOK: {
					text: '<span class="inter_lang_font" langkey="lang_done">' + getLangVal("lang_done") + '</span>'
				},
				buttonNO: {
					text: '<span class="inter_lang_font" langkey="lang_btn_cancel">' + getLangVal("lang_btn_cancel") + '</span>'
				},
				confirmFunction: function(){
					appFrame.open('shipping_address','html/mymall/shipping_address.html');
					appFrame.closeConfirm();
				},
				cancelFunction: function(){
					appFrame.closeConfirm();
				}
			}
		};
		appFrame.showConfirm(options);
	}
	function from2BToData(data){
		var PBData = data["goodsCart"];
		var obj = {};
		for(var i = 0; i < PBData.length; i ++){
			var o = PBData[i]["goods"];
			var key = o["goods_store"]["id"] + "";
			if(!obj[key]){
				obj[key] = o["goods_store"];
				obj[key]["goods"] = [];
				obj[key]["totalPrice"] = 0;
				obj[key]["goods"]["transfee"] = 0;
			}
		}
		for(var i = 0; i < PBData.length; i ++){
			var o = PBData[i];
			var key = o["goods"]["goods_store"]["id"] + "";
			if(key in obj){
				obj[key]["goods"].push(o);
				if(!window.localStorage['buyNowParam']){
					obj[key]["goods"]["goods_transfee"] = o["goods"]["goods_transfee"];
					if(o["goods"]["goods_transfee"]==0){
						obj[key]["goods"]["transfee"] += parseFloat(o["goods"]["goods_store"]["trans"][0][key]);
					}
				}else{
					obj[key]["goods"]["transfee"] = data.transport.trans_express_fee;
				}
				obj[key]["totalPrice"] = (parseFloat(obj[key]["totalPrice"]) * 1000 + 
						parseFloat(o["fact_price"] ? o["fact_price"] : o["price"]) * 1000 * parseInt(o["count"]) + parseFloat(obj[key]["goods"]["transfee"]) * 1000) / 1000;
				if(data["payments"]){
					obj[key]["pays"] = data["payments"];
				}
				var temp = new Array().concat(obj[key]["pays"]);
				obj[key]["pays"] = [];
				for(var p in temp){
					if(temp[p]["mark"] == "coobill" || temp[p]["mark"] == "payafter"){
						obj[key]["pays"].push(temp[p]);
					}
				}
			}
		}
		return obj;
	}
	
});