// doT.js
// 2011, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

define(function(require, exports, module){
	if(!window.changeInterLang){
		window.changeInterLang = function(langType){
			var langs = JSON.parse(window.localStorage.getItem("langs_" + langType));
			$("span.inter_lang_font").each(function(){
				var $this = $(this);
				$this.html(langs[$this.attr("langkey")]);
			});
			$("input.inter_lang_button").each(function(){
				var $this = $(this);
				$this.val(langs[$this.attr("langkey")]);
			});
		};
		window.getLangVal = function(key){
			var clang = window.localStorage.getItem("lang");
			var langs = JSON.parse(window.localStorage.getItem("langs_" + clang));
			return langs[key];
		};
	}
});
