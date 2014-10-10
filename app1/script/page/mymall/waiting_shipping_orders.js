define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var config = require('../../config');
	var doT = require('../../common/doT');
	var iScroll = require('../../common/iscroll');
	var temp = require('../../template/orderListTemp');
	
	var userId=window.localStorage['userId'];
	var orderListScroll = null;
	var isPageEnd = false;
	var param = {};
	var datas=null;
	
	function initQueryParam(){
		param["pageSize"] = 6;
		param["currentPage"] = 1;
		datas={'user_id':userId,'pageSize':param["pageSize"],'currentPage':param["currentPage"]};
	}
	//加载页面
	appFrame.loadPage = function(){
		userId=window.localStorage['userId'];
		$("#waitShip").html('');
		initQueryParam();
		loadWaitShip();
	};
	
	//返回
	$('#back').on(appFrame.getEventType("up"),Goback);
	function Goback(){
		appFrame.close();
	};
	
	//待付款
	function loadWaitShip(){
		appFrame.showShadowCover(true,null,'waitShipWrap');
		server.getWaitShipOrderData(getWaitShip,datas);
	}
	function getWaitShip(data){
		if(data.result==1){
			if(data["orders"].length <= 0 || data["orders"].length < param["pageSize"]){
				isPageEnd = true;
			}
			var doTtmpl = doT.template(temp.replace(/%%(\w*)%%/g, function($0,$1,$2){
				return getLangVal($1);
			}));
			if($("#pullUp").length > 0){
				$(doTtmpl(data)).insertBefore("#pullUp");
				appFrame.closeShadowCover();
			}else{
					if( data.orders.length<1){
						var html = '<div>'+
							'<p class="No_payment_img txt_1"><img src="../../images/No_Payment.png"></p>'+
						    '<p class="No_payment_word txt_1"><span class="inter_lang_font" langkey="lang_msg_no_unshipped">' + getLangVal("lang_msg_no_unshipped") + '</span></p>'+
						'</div>';
						$("#waitShip").html(html);
					}else{
						$("#waitShip").html(doTtmpl(data));
					}
					appFrame.closeShadowCover();
			}
			
			if($("#waitShip").attr("scrollHeight") > $("#waitShipWrap").height()){
				if($("#pullUp").length <= 0){
					var loadingDataString = "<div id='pullUp'><span class='pullUpIcon'></span><span class='pullUpLabel inter_lang_font' langkey='lang_intro31'>" + getLangVal("lang_intro31") + "</span></div>";
					$(loadingDataString).appendTo($("#waitShip"));
				}
			}
			
			if(orderListScroll){
				orderListScroll.refresh();
			}else{
				var pullUpEl = document.getElementById('pullUp'),
				pullUpOffset = pullUpEl ? pullUpEl.offsetHeight : 0;
				orderListScroll = new iScroll.iScroll("waitShipWrap",{
					useTransition: true,
					onRefresh: function () {
						if (pullUpEl && pullUpEl.className.match('loading')) {
							pullUpEl.className = '';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = "<span class='inter_lang_font' langkey='lang_intro31'>" + getLangVal("lang_intro31") + "</span>";
						}
					},
					onScrollMove: function () {
						if(pullUpEl){
							if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
								pullUpEl.className = 'flip';
								pullUpEl.querySelector('.pullUpLabel').innerHTML = "<span class='inter_lang_font' langkey='lang_release_refresh_pad'>" + getLangVal("lang_release_refresh_pad") + "</span>";
							} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
								pullUpEl.className = '';
								pullUpEl.querySelector('.pullUpLabel').innerHTML = "<span class='inter_lang_font' langkey='lang_intro31'>" + getLangVal("lang_intro31") + "</span>";
								this.maxScrollY = pullUpOffset;
							}
						}
					},
					onScrollEnd: function () {
						if (pullUpEl && pullUpEl.className.match('flip')) {
							pullUpEl.className = 'loading';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = "<span class='inter_lang_font' langkey='lang_list_loading'>" + getLangVal("lang_list_loading") + "</span>";				
							getNextPageData();	// Execute custom function (ajax call?)
						}
					}
				});
			}
			appFrame.closeShadowCover();
		}
	};
	
	function getNextPageData(){
		if(isPageEnd){
			orderListScroll.refresh();
			return;
		}
		param["currentPage"] = parseInt(param["currentPage"]) + 1 ;
		datas={'user_id':userId,'pageSize':param["pageSize"],'currentPage':param["currentPage"]};
		server.getWaitShipOrderData(getWaitShip,datas);
	}
	
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		initQueryParam();
		appFrame.showShadowCover(true,null,'waitShipWrap');
		server.getWaitShipOrderData(getWaitShip,datas);
	};

});



