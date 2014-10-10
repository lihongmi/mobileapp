define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var config = require('../../config');
	var userId="";
	//返回
	var prefix = "";
	var width = $(document.body).width();
	if(width > 630){
		prefix = config.IMG_PREFIX_GOODS_SMALL[0];
	}else if(width > 470){
		prefix = config.IMG_PREFIX_GOODS_SMALL[1];
	}else if(width > 310){
		prefix = config.IMG_PREFIX_GOODS_SMALL[1];
	}
	$('#back').on(appFrame.getEventType("up"),Goback);
	function Goback(){
		appFrame.close();
	};
	
	//获取收藏夹列表
	appFrame.loadPage = function(){
		userId=window.localStorage['userId'];
		var parme={'user_id':userId};
		$('#favoritesCont').html('');
		appFrame.showShadowCover(true,null,'favoritesCont');
		server.goodsFavorite(getFavorite,parme);
	};
	exports.initPage = function(){
		userId=window.localStorage['userId'];
		var parme={'user_id':userId};
		$('#favoritesCont').html('');
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		appFrame.showShadowCover(true,null,'favoritesCont');
		server.goodsFavorite(getFavorite,parme);
	};
	function getFavorite(data){
		if(data.result==1){
			var obj=data.favorites; 
			var temp='';
			if(obj.length<1){
				temp='<div>'+
					'<p class="No_payment_img txt_1"><img src="../../images/No_Payment.png"></p>'+
				    '<p class="No_payment_word txt_1"><span class="inter_lang_font" langkey="lang_msg_favor_empty">' + getLangVal("lang_msg_favor_empty") + '</span>'+
				    '<span style="margin:0 4.5em; margin-top:1em;padding:0.3em;" class="s_btn1 fon_s11 fon_c20 db rad_1 txt_1" on' + appFrame.getEventType("up") + '="CartGoBuy()"><span class="fon_s11 fon_c20 inter_lang_font" langkey="lang_continue_shipping">'+getLangVal('lang_continue_shipping')+'</span></span></p>'+
				'</div>';
				$('#favoritesCont').html(temp);//为空时。
				appFrame.closeShadowCover();
			}else{
				for(var i=0;i<obj.length;i++){
					var imgPath='';
					if(obj[i].goods.goods_main_photo==null){
						imgPath='../../images/home_noPic_06.png';
					}else{
						imgPath=config.IMG_HOST+obj[i].goods.goods_main_photo.path+'/'+prefix+obj[i].goods.goods_main_photo.name;
					}
					temp+='<div class="posi_1 favo_item" isUp="0" fid="'+obj[i].goods_id+'" store-id="'+obj[i].goods.goods_store.id+'">';
					temp+='<dl><dt><img src="'+imgPath+'"/></dt><dd style="margin:0 1.5em; width:16em;">';
					temp+='<p class="fon_s7 fa_cont_d1 word_all">'+obj[i].goods.goods_name+'</p>';
					temp+='<p class="fon_s10 fa_cont_d2">$'+obj[i].goods.store_price+'</p>';
					temp+='</dd></dl><img class="fa_list_arrow posi_2" src="../../images/Arrow.png"/></div>';
				}
				$('#favoritesCont').html(temp);
				appFrame.closeShadowCover();
				
				$('#favoritesCont div.favo_item').on(appFrame.getEventType("down"), function(){
					var $this = $(this);
					var pageX = window.event.targetTouches[0].pageX;
					var pageY = window.event.targetTouches[0].pageY;
					$this.attr("sX", pageX).attr("sY", pageY).attr("isMove", 0).attr("isShowTip", 0).attr("isUp", 1);
					setTimeout(function(){
						if($this.attr("isMove") == 1 || $this.attr("isUp") == 0)return;
						$this.attr("isShowTip", 1);
						var options = {
							id: "deleteC",
							header: {
								text: '<span class="inter_lang_font" langkey="lang_cancel_saving_pad">' + getLangVal("lang_cancel_saving_pad") + '</span>'
							},
							confirm: {
								text: '<span class="inter_lang_font" langkey="lang_intro53">' + getLangVal("lang_intro53") + '</span>',
								buttonOK: {
									text: '<span class="inter_lang_font" langkey="lang_delete">' + getLangVal("lang_delete") + '</span>'
								},
								buttonNO: {
									text: '<span class="inter_lang_font" langkey="lang_btn_cancel">' + getLangVal("lang_btn_cancel") + '</span>'
								},
								confirmFunction: function(){
									server.updateGoodsCollect(function(json){
										if(json.result == 1){
											$this.remove();
											appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_favor_cancel">' + getLangVal("lang_msg_favor_cancel") + '</span>',2000);
											appFrame.closeConfirm();
										}
									},{"goods_id": $this.attr('fid'),'store_id':$this.attr('store-id'),'user_id':userId,'opt_type':1});
								},
								cancelFunction: function(){appFrame.closeConfirm();}
							}
						};
			        	appFrame.showConfirm(options);
					}, 1500);
				}).on(appFrame.getEventType("move"),function(){
					var $this = $(this);
					if($this.attr("isMove") == 1 ){
						return;
					}
					var sX = $this.attr("sX");
					var sY = $this.attr("sY");
					var cX = window.event.targetTouches[0].pageX;
					var cY = window.event.targetTouches[0].pageY;
					var dist = Math.sqrt(Math.pow((sX - cX), 2) + Math.pow((sY - cY), 2));
					if(dist > 20){
						$this.attr("isMove", 1);
					}
				}).on(appFrame.getEventType("up"), function(){
					var $this = $(this);
					$this.attr("isUp", 0);
			        if($this.attr("isMove") == 1 || $this.attr("isShowTip") == 1){
			        	$this.attr("isMove", 0);
			        	$this.attr("isShowTip", 0);
						return;
					}
		        	window.localStorage.setItem('proId',$this.attr("fid"));
		        	appFrame.open('product_detail','html/product/product_detail.html');
				});
			}
		}
	};
});
