define(function(require, exports, module){
	require('../../ui/frame');
	require('../../ui/util');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var userName=window.localStorage['userName'];
	var imgPath=window.localStorage['photoUrl'];
	//页面加载
	appFrame.loadPage = function(){
		userName=window.localStorage['userName'];
		imgPath=window.localStorage['photoUrl'];
		isLogin();
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		userName=window.localStorage['userName'];
		imgPath=window.localStorage['photoUrl'];
		isLogin();
	};
	//转到home
	$('#home_btn').on(appFrame.getEventType("up"),OpenFrame);
	function OpenFrame(){
		appFrame.open("home", "html/home.html");
	}
	//转到more
	$('#more_btn').on(appFrame.getEventType("up"),function(){
		appFrame.open("more", "html/more/more.html");
	});
	
	//转到cart
	$('#cart').on(appFrame.getEventType("up"),function (){
		if(!window.localStorage.getItem("userId")){
			window.localStorage.setItem("nextStep", "my_mall|appFrame.open('cart','html/cart/cart.html')");
			appFrame.open("login", "html/user/login.html");
			return;
		}else{
			appFrame.open("cart", "html/cart/cart.html");
		}
	});
	
	//转到category
	$('#category').on(appFrame.getEventType("up"),function(){
		appFrame.open("category", "html/category/category.html");
	});
	
	//转到收藏夹
	$('#myFavorites').on(appFrame.getEventType("up"),function(){
			appFrame.open('my_favorites','html/mymall/my_favorites.html');
	});
	
	//登录
	$('#toLogin').on(appFrame.getEventType("up"),function(){
		window.localStorage.setItem("nextStep","");
		appFrame.open("login", "html/user/login.html");
	});
	
	//判断是否登录
	window.isLogin=isLogin;
	function isLogin(){
		if(userName){
			$('#userNAME').text(userName);
			$('#userPath').attr({'src':imgPath});
		}
	}
	//收货地址和各个订单页
	$("#menuList li").on(appFrame.getEventType("down"), function(){
		var $this = $(this);
		var pageX = window.event.targetTouches[0].pageX;
		var pageY = window.event.targetTouches[0].pageY;
		$this.attr("sX", pageX).attr("sY", pageY).attr("isMove", 0).attr("isUp", 1);
	}).on(appFrame.getEventType("move"),function(){
		var $this = $(this);
		if($this.attr("isMove") == 1 ){
			return;
		}
		var sX = $this.attr("sX");
		var sY = $this.attr("sY");
		var cX = window.event.targetTouches[0].pageX;
		var cY = window.event.targetTouches[0].pageY;
		var dist = Math.sqrt(Math.pow((sX - cX), 2) + Math.pow((sY - cY), 2));
		if(dist > 20){
			$this.attr("isMove", 1);
		}
	}).on(appFrame.getEventType("up"), function(){
		var $this = $(this);
		$this.attr("isUp", 0);
        if($this.attr("isMove") == 1){
        	$this.attr("isMove", 0);
			return;
		}
		var id = $this.attr("id");
		var path = id.toSeparte("_");
		if(userName){
			if(id=='deliveryAddress'){
				window.localStorage.setItem("checkAddress",false);
			}
			appFrame.open(id, "html/mymall/" + path + ".html");
		}else{
			window.localStorage.setItem("nextStep", id+"|appFrame.open('"+id+"','html/mymall/" + path + ".html')");
			appFrame.open("login", "html/user/login.html");
		}
	});

});
