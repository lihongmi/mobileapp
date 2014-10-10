define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var userId=null;
	var feedValue='';
	var userNums='';
	//返回
	$('#back').on(appFrame.getEventType("up"),function(){
		$('#submit').get(0).focus();
		appFrame.close();
	});
	
	appFrame.loadPage = function(){
		$('#opinion').val('');
		$('#user').val('');
		userId=window.localStorage['userId'];
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		userId=window.localStorage['userId'];
		$('#opinion').val('');
		$('#user').val('');
	};
	
	var feedbackValue=0;
	function isValue(){
		feedValue=$('#opinion').val();
		userNums=$('#user').val();
		if(feedValue == '' && userNums==''){
			feedbackValue=0;
			return false;
		}
		if(userNums != ''){
			feedbackValue=1;
			return true;
		}
	}
	$('#submit').on(appFrame.getEventType("up"),function(){
		$(this).get(0).focus();
		isValue();
		if(feedbackValue==1){
			var parme={'user_id':userId,'user_contact':feedValue,'advice':userNums};
			server.submitAdvice(function(data){
				if(data.result==1){
					appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_intro35'>" + getLangVal("lang_intro35") + "</span>",1000);
					setTimeout(function(){
						appFrame.open("more", "html/more/more.html");
					},1010);
				}else{
					appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_intro42'>" + getLangVal("lang_intro42") + "</span>",1000);
				}
			},parme);
		}else{
			appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_intro48'>" + getLangVal("lang_intro48") + "</span>",1000);
		}
	});
});