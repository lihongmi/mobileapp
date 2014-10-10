define(function(require, exports, module){
	require('../../ui/frame');
	var $ = require('../../common/zepto-1.1.2');
	//返回
	$('#back').on(appFrame.getEventType("up"),Goback);
	function Goback(){
		appFrame.close();
	};
});
