define(function(require, exports, module){
	require('../../ui/frame');
	require('../../ui/util');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var doT = require('../../common/doT');
	var iScroll = require('../../common/iscroll');
	var proListTempl = require('../../template/productListTemp');
	
	var proListScroll = null;
	var isPageEnd = false;
	var queryParam = window.localStorage.getItem("queryParam");
	var param = {};
	var q = [];
	
	function initQueryParam(){
		q = queryParam.split("=");
		param[q[0]] = q[1];
		param["pageSize"] = 12;
		param["currentPage"] = 1;
	}
	
	function initPageEvent(){
		$("span.feed_back").on("click", function(){
			appFrame.close();
			$("#searchButton").html("");
		});
		
		$("#queryMenu li:not(.last)").on(appFrame.getEventType("up"), function(){
			var $this = $(this);
			if(!$this.hasClass("list_on")){
				$this.siblings(".list_on")
					 .removeClass("list_on")
					 .attr("order-type", 0)
					 .find("img")
					 .attr("src", $this.find("img").attr("src").replace(/([0-9])\.png/g, "0.png"));
				$this.addClass("list_on");
			}
			var orderBy = $this.attr("order-by");
			var orderType = $this.attr("order-type");
			var $img = $this.find("img");
			$img.attr("src", $img.attr("src").replace(/([0-9])\.png/g, (parseInt(orderType) + 1) + ".png"));
			param["currentPage"] = 1;
			isPageEnd = false;
			if(proListScroll){
				$("#pullUp").remove();
				$("#productList").empty().html("");
				proListScroll.destroy();
				proListScroll = null;
			}
			param["orderBy"] = orderBy;
			param["orderType"] = orderType;
			$this.attr("order-type", Math.abs(orderType - 1));
			doQueryData(q[0], param);
		});
		$("#queryMenu li.last").on(appFrame.getEventType("up"), function(){
			$("#priceRange").css({
				left: 0
			});
		});
		$("#remove").on(appFrame.getEventType("up"), function(){
			$("#lowPrice, #highPrice").val("");
			$("#priceRange").css({
				left: "100%"
			});
		});
		$("#queryPrice").on(appFrame.getEventType("up"), function(){
			var l = $("#lowPrice").val() | 0;
			var h = $("#highPrice").val();
			if(l >= 0){
				param["lowprice"] = l;
			}else{
				appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_intro41">' + getLangVal("lang_intro41") + '</span> ', 1000);
				return;
			}
			if(h > 0 && h > l){
				param["highprice"] = h;
			}else{
				appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_intro41">' + getLangVal("lang_intro41") + '</span> ', 1000);
				return;
			}
			if(proListScroll){
				$("#pullUp").remove();
				$("#productList").empty().html("");
				proListScroll.destroy();
				proListScroll = null;
			}
			doQueryData(q[0], param);
			$("#priceRange").css({
				left: "100%"
			});
		});
	}
	
	function doQueryData(t, param){
		if(param["currentPage"] > 1){
			appFrame.showShadowCover(false);
		}else{
			appFrame.showShadowCover(true, null, "productListWrapper");
		}
		if(q[0] == "gc_id"){
			server.getGoodsByClassData(getProductList, param);
		}else if(q[0] == "keyword"){
			server.getGoodsByKeywordsData(getProductList, param);
		}
	}
	
	function getProductList(json){
		if(json["goods"].length <= 0 || json["goods"].length < param["pageSize"]){
			isPageEnd = true;
		}
		var doTtmpl = doT.template(proListTempl);
		if($("#pullUp").length > 0){
			$(doTtmpl(json)).insertBefore("#pullUp");
		}else{
			if(json["goods"].length ==0){
				var temp='<div class="search_list mt100" id="noKeyword">'+
			    			'<h2>'+'<span class="inter_lang_font" langkey="lang_intro32">' + getLangVal("lang_intro32") + '</span>'+'</h2>'+
			    			'<p class="txt_1"><img src="../../images/search_empty.png"></p>'+
			    		'</div>';
				$("#productList").html(temp);
			}else{
				$("#productList").html(doTtmpl(json));
			}
		}
		
		if($("#productList").attr("scrollHeight") > $("#productListWrapper").height()){
			if($("#pullUp").length <= 0){
				var loadingDataString = "<div id='pullUp'><span class='pullUpIcon'></span><span class='pullUpLabel inter_lang_font' langkey='lang_intro31'>" + getLangVal("lang_intro31") + "</span></div>";
				$(loadingDataString).appendTo($("#productList"));
			}
		}
		
		if(proListScroll){
			proListScroll.refresh();
		}else{
			var pullUpEl = document.getElementById('pullUp'),
			pullUpOffset = pullUpEl ? pullUpEl.offsetHeight : 0;
			proListScroll = new iScroll.iScroll("productListWrapper",{
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
	
	function getNextPageData(){
		if(isPageEnd){
			proListScroll.refresh();
			return;
		}
		param["currentPage"] = parseInt(param["currentPage"]) + 1 ;
		doQueryData(q[0], param);
	}
	$("#searchButton").on(appFrame.getEventType("up"), function(){
		appFrame.open("search", "html/search.html");
	});
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		initPageEvent();
		initQueryParam();
		doQueryData(q[0], param);
		if(q[0] == "keyword"){
			$("#searchButton").html(q[1]);
		}
	};
	appFrame.loadPage = function(){
		if(proListScroll){
			$("#pullUp").remove();
			$("#productList").empty().html("");
			proListScroll.destroy();
			proListScroll = null;
			isPageEnd = false;
		}
		queryParam = window.localStorage.getItem("queryParam");
		initQueryParam();
		if(q[0] == "gc_id"){
			delete param.keyword;
		}else if(q[0] == "keyword"){
			delete param.gc_id;
		}
		var $menu = $("#queryMenu li.list_on");
		if($menu.length > 0){
			$menu.removeClass("list_on").attr("order-type", 0);
			var $img = $menu.find("img");
			$img.attr("src", $img.attr("src").replace(/([0-9])\.png/g, "0.png"));
		}
		delete param.orderBy;
		delete param.orderType;
		param["currentPage"] = 1;
		doQueryData(q[0], param);
		if(q[0] == "keyword"){
			$("#searchButton").html(q[1]);
		}
	};
});