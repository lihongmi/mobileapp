define(function(require, exports, module){
	//引入页面所需JS文件
	require('../../ui/frame');
	require('../../ui/util');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var config = require('../../config');
	var doT = require('../../common/doT');
	var proEvalTempl = require('../../template/productEvaluteTemp');
	var proPropTempl = require('../../template/productPropertiesTemp');
	
	var id = null;
	var uName = null;
	var isCollect = false;
	var storeId = null;
	var propertyArr = [];
	var buyORadd=0;//0为购买 1为加入购物车
	var prefix = "";
	var width = $(document.body).width();
	if(width > 630){
		prefix = config.IMG_PREFIX_GOODS_BIG[0];
	}else if(width > 470){
		prefix = config.IMG_PREFIX_GOODS_BIG[1];
	}else if(width > 310){
		prefix = config.IMG_PREFIX_GOODS_BIG[2];
	}
	function getProDetail(json){
		var goods = json["goods"][0];
		checkUserFavorite();
		
		if(goods["goods_main_photo"]){
			var url = config.IMG_HOST + goods["goods_main_photo"].path + "/" + prefix + goods["goods_main_photo"].name;
			new Image().preLoad("proImg,proImg2", url, "../../images/home_noPic_06.png");
		}else{
			$("#proImg, #proImg2").attr("src", "../../images/home_noPic_06.png");
		}
		$("#proName, #proName2").html(goods["goods_name"]);
		$("#proFavoriteNum").html(goods["goods_collect"]);
		$("#proStorePrice, #proStorePrice2").html(goods["store_price"]);
		$("#proGoodsPrice, #proGoodsPrice2").html("$" + goods["goods_price"]);
		$("#proWeight").html(goods["goods_weight"]);
		$("#proSaleNum").html(goods["goods_salenum"]);
		var areaStr = "";
		if(goods["goods_store"]["area"]["parent"] && goods["goods_store"]["area"]["parent"]["areaName"]){
			areaStr = goods["goods_store"]["area"]["parent"]["areaName"] + " ";
		}
		$("#proArea").html(areaStr + goods["goods_store"]["area"]["areaName"]);
		if(goods["goods_transfee"] == 0){
			$("#proTrans").html("CooExpress: " + goods["trans_fee"]);
		}else{
			$("#proTrans").html("<span class='inter_lang_font' langkey='lang_radio_sller_respond'>" + getLangVal("lang_radio_sller_respond") + "</span>");
		}
		$("#proAtten").html(goods["goods_click"]);
		showEvaluateStar("evalDes", goods["goods_store"]["point"]["description_evaluate"]);
		showEvaluateStar("evalSer", goods["goods_store"]["point"]["service_evaluate"]);
		showEvaluateStar("evalShip", goods["goods_store"]["point"]["ship_evaluate"]);
		showEvaluateStar("evalStor", Math.round((json["badEvaluate"] * 1 + json["goodsEvaluate"] * 5 + json["middleEvaluate"] * 3) * 10 /(goods["evalCount"] == 0? 1:goods["evalCount"])) / 10);
		
		storeId = goods["goods_store"]["id"];
		
		$("#proDetailInfo").html(goods["goods_details"]);
		server.getGoodsEval(getGoodsEval, {id: id});
		
		getProductProperties(goods);
		
		var picsArr = new Array().concat([goods["goods_main_photo"]], goods["goods_photos"]);
		initPicViewer(picsArr);
		
		appFrame.closeShadowCover();
	}
	//缓存轮播图片信息
	function initPicViewer(picArray){
		if(picArray && picArray.length > 0){
			window.localStorage.setItem("picViewerArray", JSON.stringify(picArray));
		}
	}
	var priceList = null;
	//初始化商品规格列表
	function getProductProperties(obj){
		var doTtmpl = doT.template(proPropTempl);
		$("#proProperties").html(doTtmpl(obj["goods_properties"]));
		if(obj["goods_properties"].length <= 0 || obj["goods_inventory_detail"].length <= 0){
			$("#proCount").html(obj["goods_inventory"]);
			if(parseInt(obj["goods_inventory"]) != 0){
				$("#buyNum").html(1);
				$("#totalPrice").html($("#proStorePrice2").html());
			}
		}else{
			$("#proCount").html(0);
		}
		setTimeout(function(){
			$("#proProperties span.rad_3").on(appFrame.getEventType("up"), function(){
				var $this = $(this);
				var pValue = $this.attr("p-value");
				var pIndex = $this.attr("p-index");
				$this.addClass("s_btn_spec").removeClass("s_btn_specNO").siblings(".s_btn_spec").removeClass("s_btn_spec").addClass("s_btn_specNO");
				
				propertyArr[pIndex] = pValue;
				showPriceAndCount();
			});
			$("#proProperties div span.first").trigger(appFrame.getEventType("up"));
		}, 300);
		initPriceList(obj["goods_inventory_detail"]);
	}
	
	function initPriceList(list){
		priceList = new Object();
		if(list.length > 0){
			for(var i = 0; i < list.length; i ++){
				var p = list[i];
				var key = p["id"].substring(0, p["id"].length-1).split("_").sort(function(n1, n2){return n1 - n2;}).join("_");
				priceList[key] = p["price"] + "_" + p["count"];
			}
		}
	}
	
	function showPriceAndCount(){
		var id = propertyArr.concat(new Array()).sort(function(n1, n2){return n1 - n2;}).join("_");
		if(id in priceList){
			var param = priceList[id].split("_");
			$("#proStorePrice2").html(param[0]);
			$("#proCount").html(param[1]);
			if(param[1] != 0){
				$("#totalPrice").html(param[0]);
				$("#buyNum").html(1);
				$("#proNumInput").val(1);
			}else{
				$("#proNumInput").val(0);
			}
		}
	}
	
	function getGoodsEval(json){
		if(json["result"] == 1){
			for(var i = 0; i < json["evas"].length; i ++){
				var c = json["evas"][i]["evaluate_user"]["user_credit"] | 0;
				json["evas"][i]["evaluate_user"]["user_credit"] = getUserCredit(c);
			}
			var doTtmpl = doT.template(proEvalTempl);
			if(doTtmpl(json)!=''){
				$("#evalInfoList").html(doTtmpl(json));
			}else{
				$("#evalInfoList").html("<div style='text-align:center;font-size:1.4em; margin-top:12em;'><span class='inter_lang_font' langkey='lang_no_evaluation'>" + getLangVal("lang_no_evaluation") + "</span></div>");
			}
		}
	}
	
	function showEvaluateStar(id, num){
		$("#" + id + " img").each(function(index){
			var fIdx = Math.floor(num);
			if(index < fIdx){
				$(this).attr("src", "../../images/pro_star_1.png");
			}else if(index == fIdx && fIdx != num){
				$(this).attr("src", "../../images/pro_star_2.png");
			}else{
				$(this).attr("src", "../../images/pro_star_3.png");
			}
		});
		$("#" + id + "Num").html(num);
	}
	
	function checkUserFavorite(){
		if(uName){
			server.isGoodsCollect(function(json){
				if(json["userCollect"]){
					$("#proFavorite").attr("src", "../../images/pro_icon.png");
					isCollect = true;
				}else{
					$("#proFavorite").attr("src", "../../images/pro_icon_gray.png");
					isCollect = false;
				}
			}, {"goods_id": id, "user_id": window.localStorage.getItem("userId")});
		}
	}
	
	function isLogin(){
		if(!uName){
			$("#proFavorite").attr("src", "../../images/pro_icon_gray.png");
		}
	}
	
	function getUserCredit(num){
		var credit = num;
        var imagePath = "../../images/Product_E_icon01.png";
        if (credit >= 0 && credit < 10) {
            credit = credit / 2;
            credit++;
        } else if (credit >= 10 && credit < 20) {
            credit = (credit - 10) / 2;
            credit++;
            imagePath = "../../images/Product_E_icon02.png";
        } else {
            credit = (credit - 20) / 2;
            credit++;
            imagePath = "../../images/Product_E_icon03.png";
        }
        if (credit > 5) 
            credit = 5;
        return {credit: credit, src: imagePath};
	}
	
	function checkInventory(){
		server.getGoodsSpecInfo(function(json){
			if(json["result"] != 1){
				return;
			}
			if($("#proNumInput").val() > json["count"]){
				$("#proNumInput").val(0);
				appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_lable_exceeded_stock'>" + getLangVal("lang_lable_exceeded_stock") + "</span>", 1000);
			}else{
				$("#buyNum").html($("#proNumInput").val());
				$("#totalPrice").html($("#proStorePrice2").html() * 1000 * $("#proNumInput").val() / 1000);
				appFrame.closeConfirm();
			}
		}, {"goods_id": id, "gsp_ids": propertyArr.join(",")});
	}
	
	function resetPage(){
		$("#proImg").attr("src", "../../images/pro_loading.gif");
		$("#proName,#proFavoriteNum,#proStorePrice,#proGoodsPrice,#proWeight,#proSaleNum,#proArea,#proTrans,#proAtten").html("");
		$("#evalDes img, #evalSer img, #evalShip img").each(function(){
			$(this).attr("src", "../../images/pro_star_3.png");
		});
		$("#evalDesNum, #evalSerNum, #evalShipNum").html("");
		$("#totalPrice, #buyNum").html(0);
		$("#detailWrapper").scrollTop(0);
		$("#detaileMenu li.first").trigger(appFrame.getEventType("up"));
		propertyArr = [];
		$("#confirmPurchase").addClass("dn");
	}
	function addPageEvent(){
		//注册返回事件
		$("a.feed_back").on("click", function(){
			appFrame.close();
		});
		//注册关闭规格页面事件
		$("span.feed_back").on("click", function(e){
			e = e || window.event;  
		    if(e.stopPropagation) { //阻止冒泡
		        e.stopPropagation();  
		    }
			$("#confirmPurchase").addClass("dn");
		});
		//注册收藏事件
		$("#favoriteBtn").on(appFrame.getEventType("up"),favoriteBtn);
		//注册详情菜单导航事件
		$("#detaileMenu li").on(appFrame.getEventType("up"), function(){
			var $this = $(this);
			$this.addClass("list_on").siblings(".list_on").removeClass("list_on");
			var idx = $this.index();
			$("div.detail_wrapper").addClass("dn").eq(idx).removeClass("dn");
		});
		//注册添加到购物车事件
		$("#addCartBtn").on(appFrame.getEventType("up"),ToAddCart);
		//注册弹出购买数量事件
		$("#buyNumBtn").on(appFrame.getEventType("up"),
				function(){
			var options = {
					id: "confirmPopup",
					header: {
						text: "<span class='inter_lang_font' langkey='lang_intro22'>" + getLangVal("lang_intro22") + "</span>"
					},
					confirm: {
						text: '<span class="dib qBtn_7 ml2" style="width:3em;"><img ' +($("#buyNum").html()==0?'src="../../images/cart_minus_gray.png"':'src="../../images/cart_minus.png"')+ ' on'+appFrame.getEventType("up")+'="changeNum(-1)" id="minusBtn"></span>'+
		        '<span class="dib ml1"> <span class="bg_c1 qConBox_6 rad_1 mt1 shadow_4 db txt_1"><input class="fon_s10 qInt_1 fon_c23 txt_1" type="number" value="0" onkeypress="return checkInput()" id="proNumInput" onblur="checkNum()"/></span></span>'+
		        '<span class="dib qBtn_7 ml1" style="width:3em;"><img ' +($("#buyNum").html()==$("#proCount").html()?'src="../../images/cart_plus_gray.png"':'src="../../images/cart_plus.png"')+ ' on'+appFrame.getEventType("up")+'="changeNum(1)" id="plusBtn"></span>',
						buttonOK: {
							text: "<span class='inter_lang_font' langkey='lang_intro23'>" + getLangVal("lang_intro23") + "</span>"
						},
						buttonNO: {
							text: "<span class='inter_lang_font' langkey='lang_btn_cancel'>" + getLangVal("lang_btn_cancel") + "</span>"
						},
						confirmFunction: function(){checkInventory();},
						cancelFunction: function(){appFrame.closeConfirm();}
					}
				};
				appFrame.showConfirm(options, true, function(){
					$("#proNumInput").val(parseInt($("#buyNum").html()));
				});
		});
		//注册确认购买事件
		$("#confirmPurchaseBtn").on(appFrame.getEventType("up"), function(){
			server.getGoodsStatusData(function(data){
				if(data.result==1){
					if(data.goods_status==-2){
						appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_intro44'>" + getLangVal("lang_intro44") + "</span>", 2000);
						setTimeout(function(){
							appFrame.close();
						},2000);
					}else{
						server.getGoodsSpecInfo(function(data){
							if(data.result==1){
								if($("#buyNum").html() > data.count){
									appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_out_stock'>" + getLangVal("lang_out_stock") + "</span>", 1000);
									$("#totalPrice").html(data.price);
									$("#buyNum").html(1);
									return;
								}
								if(buyORadd==0){//购买
									if($("#buyNum").html() == 0){
										appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_intro24'>" + getLangVal("lang_intro24") + "</span>", 1000);
										return;
									}
									var param={
										"goods_id": id, 
										"gsp_id": propertyArr.join(","), 
										"count": $("#buyNum").html(), 
										"price": $("#totalPrice").html(), 
										"user_id": window.localStorage.getItem("userId"),
										"seller_store_id": storeId
										};
									window.localStorage.setItem('buyNowParam',JSON.stringify(param));
									appFrame.open('confirm_order','html/pay/confirm_order.html');
								}else if(buyORadd==1){//加入购物车
									if($("#buyNum").html() == 0){
										appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_intro24'>" + getLangVal("lang_intro24") + "</span>", 1000);
										return;
									}
									server.addGoodsToCart(function(){
										$("#confirmPurchase").addClass("dn");
										appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_addtocart_s">' + getLangVal("lang_msg_addtocart_s") + '</span> ', 1000);
									}, {
										"goods_id": id, 
										"gsp_id": propertyArr.join(","), 
										"count": $("#buyNum").html(), 
										"price": $("#totalPrice").html(), 
										"user_id": window.localStorage.getItem("userId"),
										"seller_store_id": storeId
									});
								}
							}
						}, {"goods_id": id, "gsp_ids": propertyArr.join(",")});
					}
				}
			},{'goods_id':id});
			
		});

		$("#proImg").on("click", function(){
			appFrame.open("picViewer", "html/product/product_pics.html");
		});
	}
	exports.initPage = function(){
		id = window.localStorage.getItem("proId");
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		uName = window.localStorage.getItem("userName");
		appFrame.showShadowCover(true, null, "detail_info_wrap");
		server.getGoodsStatusData(goodsStatus,{'goods_id':id});
		addPageEvent();
	};
	appFrame.loadPage = function(){
		isCollect = false;
		$("#confirmPurchase").addClass("dn");
		uName = window.localStorage.getItem("userName");
		isLogin();
		checkUserFavorite();
		resetPage();
		id = window.localStorage.getItem("proId");
		appFrame.showShadowCover(true, null, "detail_info_wrap");
		server.getGoodsStatusData(goodsStatus,{'goods_id':id});
	};
	//进入商品详情时验证商品状态
	function goodsStatus(data){
		if(data.result==1){
			if(data.goods_status==-2){
				appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_intro44">' + getLangVal("lang_intro44") + '</span> ', 2000);
				setTimeout(function(){
					appFrame.close();
				},2000);
			}else{
				server.updateGoodsClick(function(){
					if(data.result==1){
						server.getGoodsDetailData(getProDetail, {id: id});
					}
				}, {'goods_id': id});
			}
		}
	}
	
	//转到购物车
	$('#cart').on(appFrame.getEventType("up"),OpenCart);
	function OpenCart(){
		appFrame.open("cart", "html/cart/cart.html");
	};
	//是否收藏
	window.favoriteBtn = favoriteBtn;
	function favoriteBtn(){
		if(uName){
			server.updateGoodsCollect(function(json){
				isCollect = !isCollect;
				if(isCollect){
					$("#proFavorite").attr("src", "../../images/pro_icon.png");
					appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_favor_s">' + getLangVal("lang_msg_favor_s") + '</span> ', 1000);
				}else{
					$("#proFavorite").attr("src", "../../images/pro_icon_gray.png");
					appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_favor_cancel">' + getLangVal("lang_msg_favor_cancel") + '</span> ', 1000);
				}
				$("#proFavoriteNum").html(json["goods_collect"]);
			}, {
				"goods_id": id, 
				"user_id": window.localStorage.getItem("userId"), 
				"store_id": storeId, 
				"opt_type": isCollect ? 1: 0
			});
		}else{
			window.localStorage.setItem("nextStep", "productDetail|favoriteBtn();");
			appFrame.open("login", "html/user/login.html");
		}
	}
	//添加购物车
	window.ToAddCart = ToAddCart;
	function ToAddCart(){
		if(!window.localStorage.getItem("userId")){
			window.localStorage.setItem("nextStep", "productDetail|ToAddCart();");
			appFrame.open("login", "html/user/login.html");
			return;
		}
		buyORadd=1;
		$('#confirmPurchaseBtn').html('<span class="fon_s6 inter_lang_font" langkey="lang_intro40">'+getLangVal('lang_intro40')+'</span>');
		$("#confirmPurchase").removeClass("dn");
	}
	//立即购买
	$('#buyNow').on(appFrame.getEventType("up"),ToBuyNow);
	window.ToBuyNow = ToBuyNow;
	function ToBuyNow(){
		if(!window.localStorage.getItem("userId")){
			window.localStorage.setItem("nextStep", "productDetail|ToBuyNow();");
			appFrame.open("login", "html/user/login.html");
			return;
		}
		buyORadd=0;
		$('#confirmPurchaseBtn').html('<span class="fon_s6 inter_lang_font" langkey="lang_confirm_inf">'+getLangVal('lang_confirm_inf')+'</span>');
		$("#confirmPurchase").removeClass("dn");
	};
});