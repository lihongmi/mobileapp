define(function(require, exports, module){
	require('../ui/frame');
	require('../ui/util');
	require('../common/common');
	var $ = require('../common/zepto-1.1.2');
	var keyArr = JSON.parse(window.localStorage.getItem("searchkeywords"));
	keyArr = keyArr || [];
	$("#backButton").on("click", function(){
		appFrame.open("home", "html/home.html");
	});
	$("#searchBtn").on("click", function(){
		var val = $("#keywordsInput").val();
		$(this).get(0).focus();
		if(val != ""){
			window.localStorage.setItem("queryParam", "keyword=" + val);
			addKeyList(val);
			showSearchHistory();
			window.localStorage.setItem("searchkeywords", JSON.stringify(keyArr));
			doQueryByKeyword();
		}
	});
	$("#emptyBtn").on("click", function(){
		window.localStorage.removeItem("searchkeywords");
		$("#keywordList").addClass("dn");
		$("#noKeyword").removeClass("dn");
		keyArr = [];
		appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_delete_s">' + getLangVal("lang_msg_delete_s") + '</span>', 1000);
	});
	function doQueryByKeyword(){
		appFrame.open("productList", "html/product/product_list.html");
	}
	function initHistory(){
		keyArr = keyArr || [];
		if(keyArr.length > 0){
			showSearchHistory();
		}else{
			$("#keywordList").addClass("dn");
			$("#noKeyword").removeClass("dn");
		}
	}
	function addKeyList(keyword){
		var idx = keyArr.indexOf(keyword);
		if(idx != -1){
			var k = keyArr.splice(idx, 1);
			keyArr.unshift(k);
		}else{
			if(keyArr.length == 30){
				keyArr.splice(keyArr.length - 1, 1);
			}
			keyArr.unshift(keyword);
		}
	}
	
	function showSearchHistory(){
		var html = "";
		for(var i = 0; i < keyArr.length; i ++){
			html += "<li>" + keyArr[i] + "</li>";
		}
		$("#noKeyword").addClass("dn");
		$("#keyList").html(html);
		$("#keywordList").removeClass("dn");
		
		window.setTimeout(function(){
			$("#keyList li").off("click");
			$("#keyList li").on("click", function(e){
				var k = $(this).html();
				addKeyList(k);
				window.localStorage.setItem("queryParam", "keyword=" + k);
				doQueryByKeyword();
			});
		}, 300);
	}
	exports.initPage = function(){
		initHistory();
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		setTimeout(function(){
			document.getElementById("keywordsInput").focus();
		}, 500);
	};
	appFrame.loadPage = function(){
		$('#keywordsInput').val('');
		showSearchHistory();
		keyArr = JSON.parse(window.localStorage.getItem("searchkeywords"));
		initHistory();
		setTimeout(function(){
			$("#keywordsInput").get(0).focus();
		}, 500);
	};
});