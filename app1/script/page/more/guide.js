define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var Swipe = require('../../common/swipe');
	
	
	exports.initPage = function(){
		//返回
		$('#back').on(appFrame.getEventType("up"),function(){
			appFrame.close();
		});
		Swipe( document.getElementById("productPics"), {
			continuous: false
		});
	};
});