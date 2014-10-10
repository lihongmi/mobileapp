define(function(require, exports, module){
	//引入页面所需JS文件
	require('../../ui/frame');
	require('../../ui/util');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var doT = require('../../common/doT');
	var iScroll = require('../../common/iscroll');
	var proListTempl = require('../../template/productListADTemp');
	
	//初始化iscroll
	var proListScroll = null;
	//页面数据是否完结
	var isPageEnd = false;
	//查询参数
	var queryParam = window.localStorage.getItem("queryParam");
	var q = queryParam.split("=");
	var param = {};
	param[q[0]] = q[1];
	param["pageSize"] = 12;
	param["currentPage"] = 1;
	
	function initPageEvent(){
		$("span.feed_back").on("click", function(){
			appFrame.close();
		});
	}
	
	function doQueryData(t, param){
		if(param["currentPage"] > 1){
			appFrame.showShadowCover(false);
		}else{
			appFrame.showShadowCover(true,null,'productList');
		}
		server.getGoodsByClassData(getProductList, param);
	}
	
	function getProductList(json){
		if(json["goods"].length <= 0 || json["goods"].length < param["pageSize"]){
			isPageEnd = true;
		}
		var doTtmpl = doT.template(proListTempl);
		if($("#pullUp").length > 0){
			$(doTtmpl(json)).appendTo("#productList");
		}else{
			$("#productList").html(doTtmpl(json));
		}
		
		if($("#listContent").attr("scrollHeight") > $("#productListWrapper").height()){
			if($("#pullUp").length <= 0){
				var loadingDataString = "<div id='pullUp'><span class='pullUpIcon'></span><span class='pullUpLabel inter_lang_font' langkey='lang_intro31'>" + getLangVal("lang_intro31") + "</span></div>";
				$(loadingDataString).appendTo($("#listContent"));
			}
		}
		
		if(proListScroll){
			proListScroll.refresh();
		}else{
			var pullUpEl = document.getElementById('pullUp'),
			pullUpOffset = pullUpEl.offsetHeight | 0;
			proListScroll = new iScroll.iScroll("productListWrapper",{
				useTransition: true,
				onRefresh: function () {
					if (pullUpEl.className.match('loading')) {
						pullUpEl.className = '';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = "<span class='inter_lang_font' langkey='lang_intro31'>" + getLangVal("lang_intro31") + "</span>";
					}
				},
				onScrollMove: function () {
					if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
						pullUpEl.className = 'flip';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = "<span class='inter_lang_font' langkey='lang_release_refresh_pad'>" + getLangVal("lang_release_refresh_pad") + "</span>";
					} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
						pullUpEl.className = '';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = "<span class='inter_lang_font' langkey='lang_intro31'>" + getLangVal("lang_intro31") + "</span>";
						this.maxScrollY = pullUpOffset;
					}
				},
				onScrollEnd: function () {
					if (pullUpEl.className.match('flip')) {
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
		doQueryData(q[0], param);
	};
	appFrame.loadPage = function(){
		if(proListScroll){
			$("#pullUp").remove();
			$("#productList").empty().html("");
			proListScroll.destroy();
			proListScroll = null;
			isPageEnd = false;
		}
		q = queryParam.split("=");
		doQueryData(q[0], param);
	};
});