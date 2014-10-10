define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var config = require('../../config');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var arr=[];
	var autoLogin=false;
	//验证用户名
	function checkName(){
		var userName = $('#userName').val();
		if(userName == '' || userName == undefined){
			return false;
		}
		else{
			return true;
		}
	}
	//验证密码
	function checkPwd(){
		var passWord=$('#passWord').val();
		if(passWord == '' || passWord == undefined){
			return false;
		}
		else{
			return true;
		}
	}
	//登录
	function getLgoin(that){
		that.get(0).focus();
	    var userName = $('#userName').val();
	    var passWord = $('#passWord').val();
	    if (checkName()==true && checkPwd()==true) {
	        server.userLogin(success_login,{'userName':userName,'password':passWord});
	        function success_login(data){
	        	if(data.result==1){
		        	if(data.flag==0 || data.flag==1){
		        		var obj=data.user;
		        		$('#userName').val('');
		        	    $('#passWord').val('');
			        	window.localStorage['userName']=userName;
			        	window.localStorage['userId']=obj.id;
			        	window.localStorage['photoUrl']=config.IMG_HOST+obj.photo.path+'/'+obj.photo.name;
			        	if(window.localStorage['userHistory']){
			        		arr=window.localStorage['userHistory'].split(',');
			        	}
			        	if(arr.indexOf(userName)==-1){
			        		arr.push(userName);
			        		arr.push(passWord);
			        	}
			        	if(autoLogin){
			        		window.localStorage.setItem('userHistory',arr);
			        	}
		        		appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_login_s">' + getLangVal("lang_msg_login_s") + '</span>', 1000);
		        		var nextStep = window.localStorage.getItem("nextStep");
		        		if(nextStep!=''){
		        			nextStep=nextStep.split("|");
		        			appFrame.executePageScript(nextStep[1], nextStep[0]);/////为xxx()时，不执行；
		        		}
		        		appFrame.close();
		        	}else if(data.flag==2){
		        		appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_no_username">' + getLangVal("lang_msg_no_username") + '</span>', 1000);
		        	}else if(data.flag==3){
		        		appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_no_password">' + getLangVal("lang_msg_no_password") + '</span>', 1000);
		        	}else if(data.flag==4){
		        		appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_excepted_occur">' + getLangVal("lang_msg_excepted_occur") + '</span>', 1000);
		        	}
	        	}else{
	        		appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_login_f">' + getLangVal("lang_msg_login_f") + '</span>', 1000);
	        	}
	        };
	    }else{
	    	if(!checkName())
	    		appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_username_empty">' + getLangVal("lang_msg_username_empty") + '</span>', 3000);
	    	if(!checkPwd())
	    		appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_password_empty">' + getLangVal("lang_msg_password_empty") + '</span>', 3000);
		}
	}	
	//选取曾用用户名
	function chioseUser(){
		if(window.localStorage.getItem('userHistory')){
			$('#userHistory').removeClass('dn');
		}else{
			$('#userHistory').addClass('dn');
		}
	}

	appFrame.loadPage = function(){
		chioseUser();
		arr=[];
		autoLogin=false;
		$('#check').addClass('check_no');
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		chioseUser();
		arr=[];
		autoLogin=false;
		///是否记住密码
		$('#check').on(appFrame.getEventType("up"),function(){
			if(autoLogin==true){
				autoLogin=false;
				$('#check').addClass('check_no');
			}else{
				autoLogin=true;
				$('#check').removeClass('check_no');
			}
		});
		$('#userHistory').on(appFrame.getEventType("up"),function(){
			var arr=window.localStorage.getItem('userHistory').split(",");
			var options = {
					id: "abc",
					header: {
						text: '<span class="" langkey="lang_lable_account">'+getLangVal('lang_lable_account')+'</span>'
					},
					selectList: [],
					selectFunction: function(val, txt, index){
						$('#userName').val(txt);
						$('#passWord').val(val);
					}
				};
				for(var i=0;i<arr.length;i+=2){
					var j = {text: arr[i],value:arr[i+1]};
					options.selectList.push(j);
				};
				appFrame.showConfirm(options,true);
		});
		//登录
		$('#login_to').on(appFrame.getEventType("up"),function(){
			 getLgoin($(this));
		});
		
		//注册
		$('#registration').on(appFrame.getEventType("up"),function(){
			appFrame.open('registration','html/user/registration.html');
		});
		
		//返回
		$('#back').on(appFrame.getEventType("up"),function(){
			$('#login_to').get(0).focus();
			appFrame.close();
		});
		$('#userName').on('click', function() {
			$(this).get(0).focus();
		});
		$('#passWord').on('click', function() {
			$(this).get(0).focus();
		});
	};
});