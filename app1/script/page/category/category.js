define(function(require, exports, module){
	require('../../ui/frame');
	require('../../ui/util');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var iScroll = require('../../common/iscroll');
	var server = require('../../server/server');
	var config = require('../../config');

	var serverTime = null, categoryArr = null, listScroll = null;
	
	function getGoodsClass(json){
		if(json.gc){
			window.localStorage.setItem("serverTime", json.serverTime);
			window.localStorage.setItem("categoryObj", JSON.stringify(json.gc.childs));
			categoryArr = json.gc.childs;
		}else{
			categoryArr = JSON.parse(window.localStorage.getItem("categoryObj"));
		}
		var html = "<ul>";
		for(var i = 0; i < categoryArr.length; i ++){
			var obj = categoryArr[i];
			html += '<li gid="' + obj["id"] + '">' +
				'<div class="Category_img posi_2">' +
					'<img src="' + (obj["classIcon"] ? (config.IMG_HOST + obj["classIcon"]["path"] + "/" + obj["classIcon"]["name"]) : "../../images/home_noPic_06.png") + '" onerror="javascript:this.src=\'../../images/home_noPic_06.png\'">' +
				'</div> <span class="Category_tit posi_2">' + obj["className"] + '</span>' +
			'</li>';
		}
		html += "</ul>";
		$("#categoryLv1").html(html);
		
		setTimeout(function(){
			listScroll = new iScroll.iScroll("categoryList");
			$("#categoryLv1 li").on("click", function(){
				var idx = $(this).index();
				if(categoryArr[idx]["childs"]){
					$("#backBtn").attr("level", 2).attr("categoryTitle", $(this).find("span.Category_tit").html()).removeClass("dn");
					$("#headerTitle").html($(this).find("span.Category_tit").html());
					var leve2Arr = categoryArr[idx]["childs"];
					var html = createHTML(leve2Arr);
					$("#categoryLv1, #categoryLv3").addClass("dn");
					$("#categoryLv2").removeClass("dn").html(html);
					listScroll.scrollTo(0,0);
					setTimeout(function(){
						listScroll.refresh();
						$("#categoryLv2 li").on("click", function(){
							var lv2Idx = $(this).index();
							if(categoryArr[idx]["childs"][lv2Idx]["childs"]){
								$("#backBtn").attr("level", 3);
								$("#headerTitle").html($(this).find("span.Category_tit").html());
								var leve3Arr = categoryArr[idx]["childs"][lv2Idx]["childs"];
								var html = createHTML(leve3Arr);
								$("#categoryLv1,#categoryLv2").addClass("dn");
								$("#categoryLv3").removeClass("dn").html(html);
								listScroll.scrollTo(0,0);
								listScroll.refresh();
								$("#categoryLv3 li").on("click",function(){
									window.localStorage.setItem("queryParam", "gc_id=" + $(this).attr("gid"));
									appFrame.open("productListAD", "html/product/product_list.html");
								});
							}
						});
					}, 300);
				}
			});
			appFrame.closeShadowCover();
		}, 300);
	}
	
	function createHTML(arr){
		var html = "<ul>";
		for(var i = 0; i < arr.length; i ++){
			var obj = arr[i];
			html += '<li gid="' + obj["id"] + '">' +
				'<span class="Category_tit posi_2" style="left:2em;">' + obj["className"] + '</span>' +
			'</li>';
		}
		html += "</ul>";
		return html;
	}
	appFrame.loadPage = function(){};
	exports.initPage = function(){
		appFrame.showShadowCover(true,null,'categoryList');
//		window.localStorage.removeItem("serverTime");
//		window.localStorage.removeItem("categoryObj");
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		serverTime = window.localStorage.getItem("serverTime") || "0000-00-00 00:00:00";
		server.getGoodsClassData(getGoodsClass, {"Time": serverTime});

		$("#backBtn").on(appFrame.getEventType("up"), function(){
			var lv = $(this).attr("level");
			if(lv == 2){
				$("#categoryLv2,#categoryLv3").addClass("dn");
				$("#categoryLv1").removeClass("dn");
				$("#headerTitle").html("Category");
				$("#backBtn").addClass("dn");
			}else if(lv == 3){
				$("#backBtn").attr("level", 2);
				$("#categoryLv1,#categoryLv3").addClass("dn");
				$("#categoryLv2").removeClass("dn");
				$("#headerTitle").html($(this).attr("categoryTitle"));
			}
			listScroll.scrollTo(0,0);
			listScroll.refresh();
		});
		
		$("#footerMenu li:not(.more_on)").on(appFrame.getEventType("up"), function(){
			var id = $(this).attr("id");
			var name = $(this).attr("id").toSeparte("_");
			var url = "html/" + id.toLowerCase() + "/" + name + ".html";
			if(id == "home"){
				url = "html/" + name + ".html";
			}else if(id=='cart'){
				if(!window.localStorage.getItem("userId")){
					window.localStorage.setItem("nextStep", "category|appFrame.open('cart','html/cart/cart.html')");
					appFrame.open("login", "html/user/login.html");
					return;
				};
			}else if(id == "myMall"){
				if(!window.localStorage.getItem("userId")){
					window.localStorage.setItem("nextStep", 'category|appFrame.open("my_mall", "html/mymall/my_mall.html");');
					appFrame.open("login", "html/user/login.html");
					return;
				}
			}
			appFrame.open(name, url);
		});
	};
});