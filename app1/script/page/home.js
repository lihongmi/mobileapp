define(function(require, exports, module){
	require('../ui/frame');
	require('../ui/util');
	require('../common/common');
	var $ = require('../common/zepto-1.1.2');
	var server = require('../server/server');
	var Swipe = require('../common/swipe');
	var doT = require('../common/doT');
	var iScroll = require('../common/iscroll');

	var swipeTempl = require('../template/advertsListTemp');
	var proModelListTempl = require('../template/proModelListTemp');
	
	function initHbanner(json){
		var doTtmpl = doT.template(swipeTempl);
		$("#Hbanner").html(doTtmpl(json));
		Swipe( document.getElementById("HbannerList"), {
			continuous: true,
			auto: 2000,
			speed: 1000,
			callback: function(index,e) {
				$("#corBarList li").addClass("opac50").eq(index).removeClass("opac50");
			}
		});
		$("#HbannerList .swipe-wrap div").on("click", function(){
			window.localStorage.setItem("detailUrl", $(this).attr("goTo"));
		});
	}
	function initProModelList(id, json){
		var doTtmpl = doT.template(proModelListTempl);
		$("#" + id).html(doTtmpl(json));
		Swipe( document.getElementById(id + "List"), {
			continuous: false,
			callback: function(index,e) {
				$("#" + id + "Points li a").removeClass("Hbut_on").eq(index).addClass("Hbut_on");
			}
		});
	}
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		$("#searchButton").on("click", function(){
			appFrame.open("search", "html/search.html");
		});
		appFrame.loadPage = function(){
		};
		$("#moreButton").on("click", function(){
			appFrame.open("more", "html/more/more.html");
		});
		server.getAdvertsData(initHbanner);
		server.getRecommendedData(function(json){
			json.model = "recommend";
			json.title = '<span class="inter_lang_font" langkey="lang_index_recommend">' + getLangVal("lang_index_recommend") + '</span>';
			initProModelList("recommend", json);
		}, {pageSize: 12, currentPage: 1});
		server.getNewData(function(json){
			json.model = "new";
			json.title = '<span class="inter_lang_font" langkey="lang_index_new">' + getLangVal("lang_index_new") + '</span>';
			initProModelList("new", json);
		}, {pageSize: 12, currentPage: 1});
		server.getSaleData(function(json){
			json.model = "sale";
			json.title = '<span class="inter_lang_font" langkey="lang_index_sale">' + getLangVal("lang_index_sale") + '</span>';
			initProModelList("sale", json);
		}, {pageSize: 12, currentPage: 1});
		new iScroll.iScroll("coutList", {useTransition: true});
		$("#footerMenu li:not(.more_on)").on("click", function(){
			var id = $(this).attr("id");
			var name = $(this).attr("id").toSeparte("_");
			if(id == "cart"){
				if(!window.localStorage.getItem("userId")){
					window.localStorage.setItem("nextStep", "home|appFrame.open('cart','html/cart/cart.html')");
					appFrame.open("login", "html/user/login.html");
					return;
				}
			}else if(id == "myMall"){
				if(!window.localStorage.getItem("userId")){
					window.localStorage.setItem("nextStep", "home|appFrame.open('my_mall','html/mymall/my_mall.html')");
					appFrame.open("login", "html/user/login.html");
					return;
				}
			}
			appFrame.open(name, "html/" + id.toLowerCase() + "/" + name + ".html");
		});
//		appFrame.executePageScript("changeInterLang('lang_zh')");
	};
});