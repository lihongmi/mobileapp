define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var userId=null;
	appFrame.loadPage = function(){
		isLogin();
		userId=window.localStorage['userId'];
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		userId=window.localStorage['userId'];
		$("#checkbox_1 li").each(function(){
			if($(this).attr("lng") == lang){
				$(this).find("img").attr("src", "../../images/more_check.png");
			}
		});
		isLogin();
		//home
		$('#home_btn').on(appFrame.getEventType("up"),OpenFrame);
		function OpenFrame(){
			appFrame.open("home", "html/home.html");
		}
		//help
		$('#help_btn').on("click",OpenHelp);
		function OpenHelp(){
			appFrame.open("help", "html/more/help.html");
		}
		//about
		$('#aboutBtn').on("click",OpenAbout);
		function OpenAbout(){
			appFrame.open("about", "html/more/about.html");
		} 
		//myMall
		$('#my_mall').on(appFrame.getEventType("up"),OpenMymall);
		function OpenMymall(){
			if(window.localStorage['userId']){
				appFrame.open("my_mall", "html/mymall/my_mall.html");
			}else{
				window.localStorage.setItem("nextStep", 'more|appFrame.open("my_mall", "html/mymall/my_mall.html");');
				appFrame.open("login", "html/user/login.html");
			}
		}
		//转到cart
		$('#cart').on(appFrame.getEventType("up"),OpenCart);
		function OpenCart(){
			if(!window.localStorage.getItem("userId")){
				window.localStorage.setItem("nextStep", "more|appFrame.open('cart','html/cart/cart.html')");
				appFrame.open("login", "html/user/login.html");
				return;
			}
			appFrame.open("cart", "html/cart/cart.html");
		};
		//转到category
		$('#category').on(appFrame.getEventType("up"),OpenCategory);
		function OpenCategory(){
			appFrame.open("category", "html/category/category.html");
		};
		//意见反馈
		$('#feedback_btn').on("click",OpenFeedback);
		function OpenFeedback(){
			if(!userId){
				window.localStorage.setItem("nextStep", "my_mall|appFrame.open('feedback','html/more/feedback.html')");
				appFrame.open('login','html/user/login.html');
			}else{
				appFrame.open('feedback','html/more/feedback.html');
			}
		}
		
		//新手指导
		$('#NoviceGuide').on("click",OpenGuide);
		function OpenGuide(){
			var lang=window.localStorage.getItem("lang");
			if(lang=='en_US'){
				appFrame.open("guide", "html/more/guide.html");
			}else if(lang=='zh_CN'){
				appFrame.open("guide_china", "html/more/guide_china.html");
			}
		}
		//注销
		$('#logout').on('click',function(){
			var options = {
				id: "abc",
				header: {
					text: '<span class="inter_lang_font" langkey="lang_log_out">' + getLangVal("lang_log_out") + '</span>'
				},
				confirm: {
					text: '<span class="inter_lang_font" langkey="lang_intro25">' + getLangVal("lang_intro25") + '</span>',
					buttonOK: {
						text: '<span class="inter_lang_font" langkey="lang_done">' + getLangVal("lang_done") + '</span>'
					},
					buttonNO: {
						text: '<span class="inter_lang_font" langkey="lang_btn_cancel">' + getLangVal("lang_btn_cancel") + '</span>'
					},
					confirmFunction: function(){
						window.localStorage.removeItem('userName');
						window.localStorage.removeItem('userId');
						window.localStorage.removeItem('pathUrl');
						appFrame.closeConfirm();
						appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_log_out">' + getLangVal("lang_log_out") + '</span>',1500);
						appFrame.open("home", "html/home.html");
					},
					cancelFunction: function(){
						appFrame.closeConfirm();
					}
				}
			};
			appFrame.showConfirm(options);
		});
		//清除缓存
		$('#clear_cache').on("click",function(){
			window.localStorage.removeItem('searchkeywords');
			window.localStorage.removeItem('userHistory');
			appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_cleancache_s">' + getLangVal("lang_msg_cleancache_s") + '</span>',1500);
		});
		
		$("#checkbox_1 li").on("click", function(){
			var lang = $(this).attr("lng");
			var clang = window.localStorage.getItem("lang");
			if(lang == "none" || lang == clang)return;
			$("#checkbox_1 li img").attr("src", "../../images/more_no_check.png");
			$(this).find("img").attr("src", "../../images/more_check.png");
			var time = window.localStorage.getItem("serverTime_" + lang);
			server.getInterLang(function(json){
				if(json.result == 1){
					if(json.infoApp && json.infoApp["lang_nav_home"]){
						window.localStorage.setItem("langs_" + lang, JSON.stringify(json.infoApp));
						window.localStorage.setItem("serverTime_" + lang, json.serverTime);
					}
					window.localStorage.setItem("lang", lang);
					appFrame.executePageScript("changeInterLang('" + lang + "')");
					appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_msg_edit_s'>" + getLangVal("lang_msg_edit_s") + "</span>", 1000);
				}
			}, {"langFlag": lang, "time": time || "0000-00-00"});
		});
	};
	function isLogin(){
		if(userId){
			$('#logout').removeClass('dn');
		}else{
			$('#logout').addClass('dn');
		}
	}
	
});