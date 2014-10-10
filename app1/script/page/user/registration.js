define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var isUser=0,isMail=0,pass1=0,pass2=0;
	//返回
	$('#back').on(appFrame.getEventType("up"),function(){
		$(this).addClass('feed_back_click');
		appFrame.close();
	});
	//初始化
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		$('#uesrName').val('');
		$('#email').val('');
		$('#passWord').val('');
		$('#passWord2').val('');
	};
	appFrame.loadPage = function(){
		$('#uesrName').val('');
		$('#email').val('');
		$('#passWord').val('');
		$('#passWord2').val('');
		isUser=0;
		isMail=0;
	};
	//用户协议
	$('#server').on(appFrame.getEventType("up"),function(){
		appFrame.open('userAgreement','html/user/user_agreement.html');
	});
	//验证用户名
	function checkName(){
		var userName = $('#uesrName').val();
		var myreg1= /^([0-9]|[a-zA-Z]|[0-9A-Za-z]){6,16}$/;
		var myreg2 = /^038\d[\d]*$|^02\d[\d]*$/;////^(038)[0-9]{7}$/;/^038\d[\d]*$|^02\d[\d]*$/;
		var myreg_special=/[\W|\u4e00-\u9fa5]/;
		if(userName == ''){
			//不能为空
			isUser=2;
			document.getElementById('usernameParam').value=false;
		}else if(myreg_special.test(userName)){//不含有中文及特殊字符
			isUser=3;
			document.getElementById('usernameParam').value=false;
		}else if(!myreg1.test(userName)){
			//格式不对
			isUser=5;
			document.getElementById('usernameParam').value=false;
		}else if(myreg2.test(userName) && userName.length>=9 && userName.length<=11){
			//Cootell账户
			isUser=4;
			document.getElementById('usernameParam').value=false;
		}else{
			//验证是否存在
			server.checkUser(function(data){
				if(data.result==1){
					if(data.flag == 2){
						isUser=1;
						document.getElementById('usernameParam').value=true;
					}else if(data.flag == 1){
						isUser=0;
						document.getElementById('usernameParam').value=false;
					}
				}
			},{'userName':userName});
		}
	}
	$('#uesrName').blur(function(){
		checkName();
	});
	//验证邮箱
	function checkEmail(){
		var email = $('#email').val();
		var userName = '';
		var passWord = '';
	    var myreg3 = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(email == ''){
			isMail=2;
			document.getElementById('emailParam').value=false;
		}else if(!myreg3.test(email)){
			document.getElementById('emailParam').value=false;
		}else{
			//验证邮箱是否使用过
			server.checkMail(mail_is,{'email':email});
			function mail_is(data){
				if(data.result==1){
					if(data.flag == 5 ){
						//已使用
						document.getElementById('emailParam').value=false;
						isMail=1;
					}else{
						isMail=0;
						document.getElementById('emailParam').value=true;
					}
				}
			};
		}
	}
	$('#email').blur(function(){
		checkEmail();
	});
	//验证密码
	function checkPwd(){
		var passWord=$('#passWord').val();
		var myreg4 = /^[1-9][0-9]{5,8}$/;
		var myPows=/^0\d*$/;
		if(passWord == ''){
			document.getElementById('pwdParam').value=false;
		}
		else{
			if(myPows.test(passWord)){
				pass1=1;
				document.getElementById('pwdParam').value=false;
			}else if(!myreg4.test(passWord)){
				pass1=1;
				document.getElementById('pwdParam').value=false;
			}
			else{
				pass1=2;
				document.getElementById('pwdParam').value=true;
			}
		}
	}

	//二次密码
	function checkPwd2(){
		var passWord=$('#passWord').val();
		var passWord2=$('#passWord2').val();
		if(passWord2==''){
			pass2=0;
			document.getElementById('pwd2Param').value=false;
		}else if(passWord != passWord2){
			pass2=1;
			document.getElementById('pwd2Param').value=false;
		}
		else{
			pass2=2;
			document.getElementById('pwd2Param').value=true;
		}
	}

	
	//注册
	$('#reBtn').on(appFrame.getEventType("up"),registration);
	function registration(){
		checkName();
		checkEmail();
		checkPwd();
		checkPwd2();
		var userName=$('#uesrName').val();
		var passWord=$('#passWord').val();
		var email=$('#email').val();
		var flag=[];
		flag[0]=document.getElementById('usernameParam').value;
		flag[1]=document.getElementById('emailParam').value;
		flag[2]=document.getElementById('pwdParam').value;
		flag[3]=document.getElementById('pwd2Param').value;
		
		if( flag[0] == 'true' && flag[1] == 'true' && flag[2] == 'true' && flag[3] == 'true'){
				var param={"userName":userName,'password':passWord,'email':email};
				server.userRegister(registration_success,param);
				function registration_success(data){
					if(data.result==1){
						$('#uesrName').val('');
						$('#email').val('');
						$('#passWord').val('');
						$('#passWord2').val('');
						appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_register_s">' + getLangVal("lang_msg_register_s") + '</span>',1500);
						setTimeout(function(){
							appFrame.close();
						},1500);
					}
					if(data.result==0){
						appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_register_f">' + getLangVal("lang_msg_register_f") + '</span>',1500);
					}
				};
		}else{
					if(flag[0]=='false'){
						if(isUser==0){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_account_registered_reenter">' + getLangVal("lang_account_registered_reenter") + '</span>',1500);
							setTimeout(function(){
								$('#uesrName').focus();
							},1500);
							return;
						}else if(isUser==2){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_username_empty">' + getLangVal("lang_msg_username_empty") + '</span>',1500);
							setTimeout(function(){
								$('#uesrName').focus();
							},1500);
							return;
						}else if(isUser==3){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_intro54">' + getLangVal("lang_intro54") + '</span>',1500);
							setTimeout(function(){
								$('#uesrName').focus();
							},1500);
							return;
						}else if(isUser==4){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_cootel_account_login">' + getLangVal("lang_cootel_account_login") + '</span>',1500);
							setTimeout(function(){
								$('#uesrName').focus();
							},1500);
							return;
						}else{
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_username_length">' + getLangVal("lang_msg_username_length") + '</span>',1500);
							setTimeout(function(){
								$('#uesrName').focus();
							},1500);
							return;
						}
					}else if(flag[1] == 'false'){
						if(isMail==1){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_email_registered_reenter">' + getLangVal("lang_email_registered_reenter") + '</span>',1500);
							setTimeout(function(){
								$('#email').focus();
							},1500);
							return;
						}else if(isMail==2){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_email_empty">' + getLangVal("lang_msg_email_empty") + '</span>',1500);
							setTimeout(function(){
								$('#email').focus();
							},1500);
							return;
						}else{
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_email_format">' + getLangVal("lang_msg_email_format") + '</span>',1500);
							setTimeout(function(){
								$('#email').focus();
							},1500);
							return;
						}
					}else if(flag[2] == 'false'){
						if(pass1==0){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_password_empty">' + getLangVal("lang_msg_password_empty") + '</span>',1500);
							setTimeout(function(){
								$('#passWord').focus();
							},1500);
							return;
						}else if(pass1==1){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_password_length">' + getLangVal("lang_msg_password_length") + '</span>',1500);
							setTimeout(function(){
								$('#passWord').focus();
							},1500);
							return;
						}
						
					}else if(flag[3] == 'false'){
						if(pass2==0){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_password_again">' + getLangVal("lang_msg_password_again") + '</span>',1500);
							setTimeout(function(){
								$('#passWord2').focus();
							},1500);
							return;
						}else if(pass2==1){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_passwords_consistency">' + getLangVal("lang_passwords_consistency") + '</span>',1500);
							setTimeout(function(){
								$('#passWord2').focus();
							},1500);
							return;
						}
					}
		}
	}
});