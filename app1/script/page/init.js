define(function(require, exports, module){
	window.pageInfo = "initialization";
	require('../ui/frame');
	var server = require('../server/server');
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang") || "zh_CN";
		var time = window.localStorage.getItem("serverTime_" + lang);
		server.getInterLang(function(json){
			if(json.result == 1){
				if(json.infoApp && json.infoApp["lang_nav_home"]){
					window.localStorage.setItem("langs_" + lang, JSON.stringify(json.infoApp));
					window.localStorage.setItem("serverTime_" + lang, json.serverTime);
				}
				window.localStorage.setItem("lang", lang);
				appFrame.open("home", "html/home.html");
			}
		}, {"langFlag": lang, "time": time || "0000-00-00"});
	};
});