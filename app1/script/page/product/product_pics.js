define(function(require, exports, module){
	require('../../ui/frame');
	require('../../ui/util');
	require('../../common/common');
	var config = require('../../config');
	var Swipe = require('../../common/swipe');
	var $ = require('../../common/zepto-1.1.2');
	var prefix = "";
	var width = $(document.body).width();
	if(width > 630){
		prefix = config.IMG_PREFIX_GOODS_BIG[0];
	}else if(width > 470){
		prefix = config.IMG_PREFIX_GOODS_BIG[1];
	}else if(width > 310){
		prefix = config.IMG_PREFIX_GOODS_BIG[2];
	}
	var list = null, sp = null;
	function initPicViewer(){
		if(list && list.length > 0){
			var html = "";
			for(var i = 0; i < list.length; i ++){
				var url = config.IMG_HOST + list[i].path + "/" + prefix + list[i].name;
				html += "<div><img style='width:100%;' src='" +url+ "'></div>";
			}
			$(html).appendTo("#picList");
		}
	}
	exports.initPage = function(){
		$("span.feed_back").on("click", function(){
			appFrame.close();
		});
		list = JSON.parse(window.localStorage.getItem("picViewerArray"));
		initPicViewer();
		sp = new Swipe( document.getElementById("productPics"), {
			continuous: true
		});
	};
	appFrame.loadPage = function(){
		list = JSON.parse(window.localStorage.getItem("picViewerArray"));
		sp.kill();
		$("#picList").html("");
		initPicViewer();
		sp.setup();
	};
});