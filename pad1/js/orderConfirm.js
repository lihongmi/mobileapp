$(function(){
	$('.mainList').html(Base.getHtml(PageTpl.orderConfirmPageBase, {}));

	var template = '<div class="Wlayer" style="display:none;">\n' +
		'        <a href="javascript:void(0);" evt-type="close" js-node="close" class="close">&times;</a>\n' +
		'       <div js-node="content"></div>' +
		'</div>';
	var adTemplate = '<div style="position:absolute;z-index:1000;background-color:#FFF;left:0;top:0;">\n' +
		'       <div style="width:1280px;height:800px;" js-node="content"></div>' +
		'</div>';

	var wLayer = $(template).appendTo(document.body);
	$.wLayer = wLayer;
	var mask = $('<div class="WlayerMasker" style="display: none;"></div>').appendTo(document.body);
	console.log(wLayer[0]);
	//弹层视频广告
	var showAd = function (id) {
		id = id || 18;
		var html = Base.getAdHtml(id);
		if(!html)return;
		var adLayer = $(adTemplate).appendTo(document.body);

		adLayer.jsNode('content').html(html+'<span style="font-size: 1.8em;position: absolute;right:0;top:0;padding: 10px;margin: 0;text-shadow: 2px 2px 1px #fff,2px 0 1px #fff,0 2px 1px #fff,0 -2px 1px #fff,-2px 0 1px #fff,-2px -2px 1px #fff;">双击屏幕关闭当前广告</span>');
		var mask = $('<div class="WlayerMasker" style="z-index:10001;background: rgba(125,125,125,0);"></div>').appendTo(document.body);
		try {
			console.log('video!!!!!!!!!!!!!!!!', $('video'));
			$('video').bind('stalled', function(){
				adLayer.remove();
				mask.remove();
			});
			window.AndroidFun.loadVideo();
		} catch (e) {
		}
		mask.on('doubleTap', function (e) {
			adLayer.remove();
			mask.remove();
			if(id == 18){
				var timer;
				var speed = 30000;
				var autoTurnOff = function(){
					timer = window.setTimeout(function(){
						showAd(19);
						window.waitVideo = true;
						$(document.body).unbind('tap', restart);
					}, speed);
				};
				var restart = function() {
					clearTimeout(timer);
					timer = null;
					autoTurnOff();
				};
				$(document.body).bind('tap', restart);
				autoTurnOff();
			}else{
				window.waitVideo = false;
			}
		});
		/*showLayer(html);
		var mask = $('<div class="WlayerMasker" style="z-index:10001;background: rgba(125,125,125,0);"></div>').appendTo(document.body);
		mask.on('click', function (e) {
			var closeBtn = $(document.body).jsNode('close');
			var closePos = closeBtn.position();
			var layerPos = wLayer.position();
			var x = e.clientX;
			var y = e.clientY;
			var t = closePos.top + layerPos.top;
			var l = closePos.left + layerPos.left;
			if (x >= l && x <= l + 60 && y >= t && y <= t + 60) {
				mask.remove();
				$("#example_video_1").remove();
				hideLayer();
			}
		});*/
		$("#example_video_1").on("ended", function () {

		});
	};
	var show = function(opts){
		opts = opts || {};
		wLayer.css({display:'block', visibility : 'hidden'});
		var winHeight = $(window).height();
		var winWidth = $(window).width();
		var height = wLayer.height();
		var width = wLayer.width();
		var left = winWidth/2 - width/2;
		if(left<10)left = 10;
		var top = winHeight/2 - height/2;
		if(top<10)top = 10;
		top = opts.top || top
		wLayer.css({left:left, top:top, visibility:'visible'});
		mask.show();
	};
	var tmpCloseFun = null;
	var showLayer = function(tmp, delClose, opts){

		wLayer.jsNode('content').html(tmp);
		wLayer.jsNode('close').css('display', delClose ? 'none' : 'block');
		if(opts && opts.closeFun)tmpCloseFun = opts.closeFun;
		show(opts);
	};
	var hideLayer = function(){
		wLayer.hide();
		mask.hide();
	};
	$.showLayer = showLayer;
	$.hideLayer = hideLayer;
	$.delegate('close', 'tap', function(){
		hideLayer();
		if (tmpCloseFun) {
			tmpCloseFun();
			tmpCloseFun = null;
		}
	});

	//广告模版
	$("#confirmAd").html([
		Base.getAdHtml(9),
		Base.getAdHtml(10),
		Base.getAdHtml(11)
	]);

	/*if(window.location.href.indexOf("adLayer")>=0){
		$.showTips("前台已确认您的点餐下单，请放心！");
		if(Base.parseAD(18)){
			showAd();
		}else{
			showAd(19);
		}
	}else{
		showAd(19);
	}*/

	var historyMenu = Base.getPadData('historyMenu');
	historyMenu = historyMenu ? historyMenu.split("||") : [];
	var yidianDone = Base.getPadData('yidianDone');
	yidianDone = yidianDone ? yidianDone.split("||") : [];
	historyMenu = historyMenu.concat(yidianDone);
	var total = Base.countTotal(historyMenu);
	$(document.body).jsNode('total').html(total);
	$(document.body).jsNode('totalContainer').css('display', Base.DataBase.flag == '1' ? '' :'none');
	var kaitaiInfo = Base.getKaiTaiInfo();
	if(localStorage.getItem('kaitai') && kaitaiInfo)$(document.body).jsNode('info').html(Base.getHtml(PageTpl.kaitaiInfo, kaitaiInfo));
	$(historyMenu).each(function(i, obj){
		var _data = $.queryToJson(obj);
		_data.index = i+1;
		historyMenu[i] = $.jsonToQuery(_data);
	});
	var jumpPage = function(obj){
		var p = (obj && obj.data&&obj.data.p) ? obj.data.p : 0;
//		console.log("page::::::", obj.data, p)
		Page(PageTpl.orderConfirmList, p , $(document.body).jsNode('orderConfirmList'), $(document.body).jsNode('pageBtn'), 6, historyMenu);
	};
	$.delegate('prev', 'tap', jumpPage);
	$.delegate('next', 'tap', jumpPage);
	jumpPage();
	Base.setPadData('historyMenu', historyMenu.join("||"));
	Base.removePadData('yidianDone');
	$.delegate('addFood', 'tap', function(){



		window.location.href="./menu_list.html";
	});
});


