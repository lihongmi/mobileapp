var initIndex = function () {
	if(!Base.init) return;
	loadChacheFun();
	initIndexAd();
	var EN = localStorage.getItem('en');
	var langData = {en: (EN ? '2' : '1'), txt: (EN ? '中文' : 'English')};
	$(".bg").html(Base.getHtml(PageTpl.indexBgTpl, langData));
	var bottomBtn = $(".menu2").find("a");
	bottomBtn.eq(0).html(Base.DataBase.btn1||$.language("#L{叫出租车}"));
	bottomBtn.eq(1).html(Base.DataBase.btn2||$.language("#L{呼叫代驾}"));
	var homepic = Base.DataBase.homepic ? Base.DataBase.homepic : "../Images/bg_cover.png";
	$(".bg").css({"background-image": 'url(' + homepic + ')'});
	$.delegate('changeLang', 'tap', function(evt){
		var en = evt.data.en === '1';
		if(en){
			localStorage.setItem('en', '1');
		}else{
			localStorage.removeItem('en');
		}
		window.location.reload();
	});
	var service = $.tools.merge({service:Base.DataBase.service}, {en:Base.DataBase.english, langData:langData});
	if(EN){
		$(service.service).each(function(i, item){
			item.name = item.enname;
		});
	}
	/*$("#service").on("taphold", function(){
		localStorage.clear();
		window.location.reload();
	});*/
	$(".pop").html(Base.getHtml(PageTpl.indexLeftNav, service));
	//处理广告逻辑
	var adNode = $("#indexAd");
	/*adNode.html([
		Base.getHtml(PageTpl.indexAD1, {}),
		Base.getHtml(PageTpl.indexAD2, {}),
		Base.getHtml(PageTpl.indexAD3, {}),
		Base.getHtml(PageTpl.indexAD4, {}),
		Base.getHtml(PageTpl.indexAD5, {})
	].join(''));*/
	adNode.html([
		Base.getAdHtml(1),
		Base.getAdHtml(2),
		Base.getAdHtml(3),
		Base.getAdHtml(4),
		Base.getAdHtml(5)
	].join(''));
	$(".AD-index-bottom").html(Base.getAdHtml(21));
//	$(".AD-index-bottom").html(PageTpl.bottomAD.replace("$HTML$", '<img src="/img/1406263257.jpg"/>'));
	console.log(222);
	$.delegate('getData', 'tap', function () {
		//        var url = 'http://192.168.1.154:8070/web/?apiType=2&type=1&tid=13&fids=1,2,3,4&taste=�嵭��΢��|����|����|����&count=1,1,1,1';
		var url = 'http://192.168.1.154:8070/web/?apiType=3';
		$.getJSON(url, function (data) {
			var result = data.data;
			console.log(data);
			if (result) {
				$("#img").attr("src", result.category[1].food[0].image)
			}
			else {
			}
		});
		/* $.ajax({
		 type: "get",
		 async: false,
		 url: url,
		 data: {},
		 contentType: "application/json; charset=utf-8",
		 dataType: "json",
		 cache: false,
		 success: function (data) {
		 var result = data.data;
		 console.log(data)
		 if (result) {

		 }
		 else {
		 }
		 },
		 error: function (err) {
		 alert(err);
		 }
		 });*/
	});
	/*$(document.body).ready(function () {
		$.mobile.loaderWidget.hide();
	});*/
	var isShow = false;
	var lock = false;
	$.delegate('serviceCall', 'tap', function (obj) {
		console.log(3222, obj.data);
		if (lock) return;
		lock = true;
		var speed = 100;
		var isOpen = obj.data.open == "1";
		var nodes = $(".pop a")
		$(".arrow").html(isOpen ? "&and;" : "&or;");
		var count = nodes.length;
		var index = isOpen ? 0 : count - 1;
		if(isOpen)$(".pop").show();
		var looper = function () {
			lock = true;
			nodes.eq(index)[isOpen ? 'addClass' : 'removeClass']('rotate');
			var bClear = isOpen ? (index == count - 1) : (index == 0);
			if (bClear) {
				clearTimeout(timer);
				timer = null;
//				lock = false;
				setTimeout(function(){
					lock = false;
				}, 500);
				$("#service").attr("evt-data", isOpen ? "" : "open=1");
				console.log(index, isOpen);
				if(!isOpen){
					console.log(11111);
					setTimeout(function(){
						$(".pop").hide();
					}, 500);
				}

			} else {
				timer = setTimeout(looper, speed);
			}
			isOpen ? index++ : index--;

		};
		var timer;
		setTimeout(looper, 100);
	});
	var clearData = function(){

	};
	var cTimer = null;
	var cLock = false;
	var cCount = 0;
	/*$.delegate("clearData", "longTap", function(){
		localStorage.clear();
		window.location.reload();
	});
	$.delegate("clearData2", "longTap", function(){
		try {
			window.AndroidFun.restartActivity();
			//window.AndroidFun.gotoUrl(window.location.href);
		} catch (e) {
			alert(e.message);
		}
	});*/

	$.delegate("clearData", "tap", function(){
		if(!cTimer){
			cTimer = setTimeout(function(){
				cCount = 0;
				clearTimeout(cTimer);
				cTimer = null;
			}, 2000);
		}else{

		}
		cCount++;
		if(cCount>=4){
			Base.destroy();
			window.location.reload();
			cCount = 0;
			clearTimeout(cTimer);
			cTimer = null;
		}
	});
	var cTimer2 = null;
	var cCount2 = 0;
	$.delegate("clearData2", "tap", function(){
		if(!cTimer2){
			cTimer2 = setTimeout(function(){
				cCount2 = 0;
				clearTimeout(cTimer2);
				cTimer2 = null;
			}, 2000);
		}else{

		}
		cCount2++;
		if(cCount2>=4){
			/*localStorage.removeItem('DataBase');
			Base.getData(undefined, function(){
				//window.location.reload();
				//window.AndroidFun.gotoUrl(window.location.href);
				try {
					window.AndroidFun.restartActivity();
				} catch (e) {
					alert(e.message);
				}
			});*/
			try {
//				window.AndroidFun.restartActivity();
				//window.AndroidFun.gotoUrl(window.location.href);
			} catch (e) {
				console.log(e.message);
			}
			cCount2 = 0;
			clearTimeout(cTimer2);
			cTimer2 = null;
		}
	});
	/*
	 $(".pop")[isShow ? 'fadeOut' : 'fadeIn'](function(){
	 isShow = !isShow;
	 $(".arrow").html(isShow ? "&lt;" : "&gt;");

	 });
	 });*/
};
$(function () {
	initIndex();
});
window.loadChacheFun = function(){
	try {
		console.log("manifest load : load111.........."+typeof applicationCache);
		var progressVal,progressTxt;
		applicationCache.onchecking = function () {
			//检查manifest文件是否存在
			console.log("manifest load : cunzai");
		}

		applicationCache.ondownloading = function () {
			//检查到有manifest或者manifest文件
			//已更新就执行下载操作
			//即使需要缓存的文件在请求时服务器已经返回过了
			console.log("manifest load : downloading");
			window.loadCache = true;
			$.showTips('<div>正在缓存离线菜单，请稍候</div>' +
					'<div class="progress">' +
					'   <span class="red" style="width: 0%;"><span>0%</span></span>' +
					'</div>', true, {owner:1});
		}

		applicationCache.onnoupdate = function () {
			//返回304表示没有更新，通知浏览器直接使用本地文件
			console.log("manifest load : onnoupdate");
			$.hideCommonLayer();
		}

		applicationCache.onprogress = function (evt) {
			//下载的时候周期性的触发，可以通过它
			//获取已经下载的文件个数
			try{
				console.log("progress"+$(".progress").length);
				if($(".progress").length == 0){
					$.showTips('<div>正在缓存离线菜单，请稍候</div>' +
						'<div class="progress">' +
						'   <span class="red" style="width: 0%;"><span>0%</span></span>' +
						'</div>', true, {owner:1});
					window.loadCache = true;
				}
				//if(!progressTxt||!progressVal){
					progressVal = $(".progress").find("span").eq(0);
					progressTxt = $(".progress").find("span").eq(1);
				//}
				var val = Math.ceil(parseInt(evt.loaded)/parseInt(evt.total)*100);
				if(val == 100&& parseInt(evt.loaded)<parseInt(evt.total))val = 99;
				val += "%";
				progressVal.css("width", val);
				progressTxt.html(val);
			}catch(e){alert(e.message);}
			console.log("manifest load : loaded "+evt.loaded+"/"+evt.total);
		}

		applicationCache.oncached = function () {
			//下载结束后触发，表示缓存成功
			console.log("manifest load : cached");
			$.hideCommonLayer();
			$.showTips("离线文件保存成功！",undefined, {owner : 1});
			setTimeout(function(){
				window.location.reload();
				//window.AndroidFun.restartActivity();
			}, 2000);
		}

		applicationCache.onupdateready = function () {
			//第二次载入，如果manifest被更新
			//在下载结束时候触发
			//不触发onchched
			//alert('update');
			console.log("manifest load : 本地缓存正在更新中。。。");
//			if (confirm("是否重新载入已更新文件")) {
				applicationCache.swapCache();
				location.reload();
//			}
		}

		applicationCache.onobsolete = function () {
			//未找到文件，返回404或者401时候触发
			console.log("manifest load : onobsolete");
		}

		applicationCache.onerror = function (evt) {
			//其他和离线存储有关的错误
			console.log("manifest load : onerror");
			window.loadCache = false;
			/*if(confirm("离线出错，是否重试？")){
				window.location.reload();
			}*/
			/*for (var k in evt) {

			 console.log("manifest load : onerror1:"+k+":"+evt[k]);
			 }*/
		}
	} catch (e) {
		console.log("manifest load : err:"+ e.message);
	}
};