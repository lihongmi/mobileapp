define(function(require, exports, module){
	require('../../style/common.css');
	require('../../style/main.css');
	require('../../style/frame.css');
	require('../ui/frame');
	var $ = require('../common/zepto-1.1.2.js');
	
	exports.initPage = function(){
		$("#contentWrapper").css({
			"background-color" : "#FFFFFF"
		});
		appFrame.open("product_list", "html/product/product_list.html");
		appFrame.loadPage = function(){
			alert("reload111");
		}
	}
});