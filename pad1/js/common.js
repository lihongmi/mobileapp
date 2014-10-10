var DEBUG = false;
var VERSION = 0;
try {
	VERSION = parseInt(window.AndroidFun.getVersionCode());
} catch (e) {}
var winFun = {};
window.loadChacheFunCommon = function(){
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
				if($(".progress").length == 0){
					window.loadCache = true;
					$.showTips('<div>正在缓存离线菜单，请稍候</div>' +
						'<div class="progress">' +
						'   <span class="red" style="width: 0%;"><span>0%</span></span>' +
						'</div>', true, {owner:1});
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
//			console.log("manifest load : loaded "+evt.loaded+"/"+evt.total);
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
(function($){
	var payTips = '<div class="Wlayer" js-node="commonTips" style="display:none;z-index:1003;">\n' +
			'<strong class="common_tips" js-node="text">#L{已通知前台}#L{结账付款}，#{请稍候}！</strong>' +
			'</div>';
	var wLayer = $(EasyTemplate(payTips, {}).toString()).appendTo(document.body);
	var mask = $('<div class="WlayerMasker" style="display: none;z-index:1002;"></div>').appendTo(document.body);
	var show = function(opts){
		opts = opts||{};
		wLayer.css({display:'block', visibility : 'hidden'});
		var winHeight = $(window).height();
		var winWidth = $(window).width();
		var height = wLayer.height();
		var width = wLayer.width();
		var left = winWidth/2 - width/2;
		if(left<10)left = 10;
		var top = winHeight/2 - height/2;
		if(top<10)top = 10;
		top = opts.top||top;
		wLayer.css({left:left, top:top, visibility:'visible'});
		mask.show();
	};
	$.showCommonLayer = show;
	$.hideCommonLayer = function(){
		window.wwLayer = wLayer;
		window.mmask = mask;
		console.log(wLayer, mask);
		wLayer.hide();
		mask.hide();
	};
	$.showTips = function(text, noTimer, opts){
		console.log(text);
		opts = opts || {};
		if(opts.owner!==1){
			if(window.location.href.indexOf("index.html")>=0 && !window.loadCache){
				try {
					console.log("showAndroid tip");
					window.AndroidFun.showTips(text);
					return;
				} catch (e) {
				}
			}
		}
		if(text) wLayer.jsNode('text').html(text);
		console.log(wLayer);
		show(opts);
		if(!noTimer){
			setTimeout(function(){
				wLayer.hide();
				mask.hide();
			}, 3000);
		}
		return wLayer;
	};
	$.delegate('pay', 'tap', function(){
		var kaitaiInfo;
		if(!(kaitaiInfo = Base.checkKaitai())){
			setTimeout(Base.destroy, 3000);
			return;
		}
		var data = {apiType:1,tid:kaitaiInfo.tid, type:0};
		$.showTips('已通知前台结账付款，请稍候！', -1);
		Base.getData(data, function(){
			Base.destroy();
		}, function(msg){
			$.showTips("网络不稳定，请联系服务员");
		});

	});
	$.delegate('service', 'tap', function(obj){
		if(obj.data.id){
			window.location.href='./menu_list.html?category='+obj.data.id;
		}else{
			var kaitaiInfo;
			if(obj.data.type == "yidian"){
				window.location.href='./order_confirm.html';
				return false;
			}
			if(!(kaitaiInfo = Base.checkKaitai()))return;
			var data = $.tools.merge(obj.data, {apiType:1,tid:kaitaiInfo.tid});
			console.log(obj.data);
			Base.getData(data, function(){
				$.showTips(EasyTemplate('#L{已通知前台} '+(data.msg||'')+'，#L{请稍候}！').toString());
			});
		}
	});
	$.delegate('returnIt', 'tap', function(){
        $(this).html('申请退菜');
		$.showTips('已通知前台退菜，请稍候！');
    });
	$.delegate('goHome', 'tap', function(){
		window.location.href = './index.html';
	});
	$.delegate('goMenu', 'tap', function(){
		if(!Base.getPadData('kaitai') && Base.DataBase.version.welcome){
			window.location.href = Base.DataBase.version.welcome;
		}else{
			window.location.href = './menu_list.html';
		}
	});

	var settingIpFun = function(){
		if(!Base.setIp(wLayer.jsNode('ip').val())){
			wLayer.jsNode('errTips').show().html('地址或端口错误！');
			return;
		}
		Base.getData({}, function(){
			localStorage.setItem('ip', wLayer.jsNode('ip').val());
			wLayer.hide();
			mask.hide();
			window.location.reload();
		}, function(){
			console.log(1231321321);
			wLayer.jsNode('errTips').show().html('地址或端口错误！');
		});
	};
	$.delegate('settingIp', 'tap', settingIpFun, wLayer);
	winFun.settingIpFun = settingIpFun;

})(jQuery);

var Base = (function () {
	console.log("initBase");
	this.init = false;
	this.curCategoryIndex = 0;
	this.setPadData = function(key, value){
		localStorage.setItem(key, value);
	};
	this.getPadData = function(key){
		return localStorage.getItem(key);
	};
	this.removePadData = function(key){
		localStorage.removeItem(key);
	};
    this.checkKaitai = function(){
        var kaitaiInfo = Base.getKaiTaiInfo();
        if(!localStorage.getItem('kaitai') || !kaitaiInfo){
            $.showTips('未开台');
            return false;
        }
        return kaitaiInfo;
    };
	var adMap = {
		'1' : PageTpl.indexAD1,
		'2' : PageTpl.indexAD2,
		'3' : PageTpl.indexAD3,
		'4' : PageTpl.indexAD4,
		'5' : PageTpl.indexAD5,
		'6' : PageTpl.listAD1,
		'7' : PageTpl.listAD2,
		'8' : PageTpl.listAD3,
		'9' : PageTpl.confirmAD1,
		'10' : PageTpl.confirmAD2,
		'11' : PageTpl.confirmAD3,
		'12' : LayerTpl.detailAd1,
		'13' : LayerTpl.detailAd2,
		'14' : PageTpl.indexAD1,
		'15' : PageTpl.indexAD1,
		'16' : PageTpl.indexAD1,
		'17' : LayerTpl.adLayer,
		'18' : LayerTpl.adLayer2,
		'19' : LayerTpl.adLayer2,
		'21' : PageTpl.bottomAD,
		'22' : LayerTpl.adLayer3
	};
	this.parseAD = function(pos){
		var data = this.DataBase.ad;
		for (var i = 0; i < data.length; i++) {
			var ad = data[i];
			if(parseInt(ad['position']) == parseInt(pos)){
				return ad;
			}
		}

	};
	this.getAdHtml = function(pos){
		var data = this.parseAD(pos);

		var html = '';
		if(data && data.type){
			switch (data.type){
				case "1" :

				case "2" :
					console.log("DETAIL::::::::HTML",adMap[pos]);
					html = adMap[pos].replace('$HTML$', '<img src="'+data['file']+'" alt="">');
					break;
				case "3" :
					console.log("adMap[pos]:"+pos+ adMap[pos]);
					html = adMap[pos].replace('$HTML$', '<video id="example_video_1" oncanplay="this.play();" onended="this.play();" src="'+data['file']+'" autoplay="true" autobuffer loop></video>');
//					html = adMap[pos].replace('$HTML$', '<video id="example_video_1" class="video-js vjs-default-skin" src="http://video-js.zencoder.com/oceans-clip.webm"  width="480" height="360" autoplay="true"></video>');
					break;
			}
		}
		return html;
	};
	this.choose = function(value){
		var chooseData = this.getPadData('choose');
		if(!chooseData){
			this.setPadData('choose', value);
		}else{
			this.setPadData('choose', chooseData.concat(value));
		}
	};
	this.getKaiTaiInfo = function(){
		var kaitaiInfo = localStorage.getItem('kaitaiInfo');
		if(kaitaiInfo){
			kaitaiInfo = eval('('+kaitaiInfo+')');
			return kaitaiInfo;
		}
	};
	this.curCategory = null;
	this.setCategory = function (i) {
		this.curCategoryIndex = i;
		this.curCategory = this.DataBase.category[i];
	};
	this.menuArray = [];
	this.countTotal = function (obj) {
		var menuObj = obj || Base.getMenuArray();
		var total = 0;
		console.log("menuObj:", menuObj);
		for (var i = 0; i <= menuObj.length - 1; i++) {
			var item = menuObj[i];
			if(typeof item == "string") item = $.queryToJson(item);
			console.log("item:", item);
			total = total + (Number(item.price) * Number(item.count));
		}
		return total;
	};
	this.getHtml = function(tpl, data){
		return EasyTemplate(tpl, data).toString();
	};
	this.getComboByChoose = function(comboId, category, choose){
		choose = choose.split("");

//		var category = this.getCategoryById(category);
//		console.log(category);
		var detail = this.getCurDetailById(comboId, category);
		console.log(detail);
		var nameArr = [];
		for (var i = 0; i < choose.length; i++) {
			var item = choose[i];
			nameArr.push(detail['list'+(item == "1" ? "" : "2")][i].name);
		}
		return nameArr.join(",");
	};
	this.getCategoryById = function(id){
		for (var i = 0; i < this.DataBase.category.length; i++) {
			var obj = this.DataBase.category[i];
			if(obj.id == id){
				return obj;
			}
		}
	};
	this.getMenuArray = function(){
		var arr = [];
		for (var i = 0; i < this.menuArray.length; i++) {
			var item = $.queryToJson(this.menuArray[i]);
			item.tastes = item.tastes.split(",");
			item.category = Number(item.category);
			item.count = Number(item.count);
			item.id = Number(item.id);
			item.price = Number(item.price);
			item.index = Number(item.index);
			arr.push(item);
		}
		return arr;
	};
	this.setMenu = function(data){
		var food;
		if(data.combo){
			food = this.getComboDetailById(data.comboId, data.id, data.category);
		}else{
			food = this.getCurDetailById(data.id, data.category);
		}
		var isIn = false;
		var len = this.menuArray.length;

		/*for (var i = 0; i <= len-1; i++) {
			var item = $.queryToJson(this.menuArray[i]);

			item.id = parseInt(item.id);
			item.category = parseInt(item.category);
//			item.count = parseInt(item.count);
			console.log("bi:",item.count,data.count);
			if(item.id == data.id && item.category == data.category){
				isIn = true;
				item.count = data.count;
				item.tastes = data.tastes || "";
				this.menuArray[i] = $.jsonToQuery(item);
				break;
			}
		}*/
//		if(!isIn){
			var _data = $.tools.merge(data, {
				name:food.name,
				price:food.price,
				index:len+1
			});
			console.log("data1:", _data, $.jsonToQuery(_data), $.jsonToQuery(data));
			var str = $.jsonToQuery(_data);
			console.log("data:", str);
			this.menuArray.push(str);
//		}

		this.updateToMemory();
		return this.menuArray;
	};
	this.update = function(opts){
		var arr = this.getMenuArray();
		var data;
		var index;
		console.log("update:", this.menuArray.length);
		for (var i = 0; i <= arr.length - 1; i++) {
			var item = arr[i];
			console.log(parseInt(opts.category) , item.category, parseInt(opts.id) == item.id);
			if(parseInt(opts.category) == item.category && parseInt(opts.id) == item.id){
				item.count = opts.count;
				item.tastes = opts.tastes;
				index = parseInt(item.index);
				data = $.jsonToQuery(item);
				console.log("index::", data);
				this.menuArray[index - 1] = data;
				break;
			}
		}
		console.log(this.menuArray.length, ":::", this.menuArray[index]);


	};
	this.updateToMemory = function () {
		var arr = [];
		for (var i = 0; i < this.menuArray.length; i++) {
			var item = $.queryToJson(this.menuArray[i]);
			item.index = i+1;
			arr.push($.jsonToQuery(item));
		}
		this.menuArray = arr;
		this.setPadData('yidian', this.menuArray.join("||"));
	}
	this.getCategory = function () {
		return this.curCategory;
	};
	this.getCategoryByFoodId = function(id){
		var retV = null;
		for(var i =0 ;i<this.DataBase.category.length;i++){
			var retV = this.getDetailById(id, this.DataBase.category[i]);
			if(retV) {
				retV = this.DataBase.category[i];
				break;
			}
		}
		return retV;
	};
	this.getCategoryIndexByFoodId = function(id){
		var retV = this.getCategoryById(id);
		for(var i =0 ;i<this.DataBase.category.length;i++){
			var retV = this.getDetailById(id, this.DataBase.category[i]);
			if(retV) {
				retV = i;
				break;
			}
		}
		return retV;
	};
	window.setQRData = function(dataStr){
		var arr = dataStr.split("||");
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			var arr2 = item.split("=");
			var category = Base.getCategoryByFoodId(arr2[0]);
			var data = {id:arr2[0], category:Base.getCategoryIndexByFoodId(arr2[0]), count:arr2[2], tastes:"", choose:""};
			if(category.iscombo == "1"){
				var chooseStr = "";
				var foods = category.food;
				for (var j = 0; j < foods.length; j++) {
					chooseStr += "1";
				}
				data.choose = chooseStr;
			}

			Base.setMenu(data);
		}
		window.location.reload()
	};
	this.getDetailByIdOnly = function(id){
		var retV = null;
		for(var i =0 ;i<this.DataBase.category.length;i++){
			var retV = this.getDetailById(id, this.DataBase.category[i]);
			if(retV)break;
		}
		return retV;

	};
	this.getDetailById = function(id, category){
		var food = isNaN(category) ? category.food : this.DataBase.category[category||this.curCategoryIndex].food;;
		for (var i = 0; i < food.length; i++) {
			var f = food[i];
			if (f.id == id) {
				return f;
			}
		}
	};
	this.getCurDetailById = function (id, categoryId) {
		var food = this.DataBase.category[categoryId||this.curCategoryIndex].food;
		for (var i = 0; i < food.length; i++) {
			var f = food[i];
			if (f.id == id) {
				return f;
			}
		}
	};
	this.getComboDetailById = function (comboId, id, categoryId, choose) {
		var food = this.DataBase.category[categoryId||this.curCategoryIndex].food;
		console.log("food", food);
		for (var i = 0; i < food.length; i++) {
			var f = food[i];
			if (f.id == comboId) {
				var returnV;
				var listName = !choose ? "list" : "list2";
				$(f[listName]).each(function(j){
					if(f[listName][j].id == id) {
						returnV = f[listName][j];
						return;
					}
				});
				return returnV;
			}
		}
	};
	this.getCashData = function(key){
		var data = {};
		try {
			data = eval('(' + localStorage.getItem(key) + ')');
		} catch (e) {
		}
		return data;
	};
	this.destroy = function(){
		console.log("destroy");
		localStorage.removeItem('yidian');
		localStorage.removeItem('yidianDone');
		localStorage.removeItem("kaitai");
//		localStorage.removeItem("historyMenu");
		localStorage.setItem("DataBaseBack", localStorage.getItem("DataBase"));
		localStorage.removeItem("DataBase");
		window.location.href = './index.html';
	};
//	var url = "http://192.168.1.190:8070/web/?";

	this.setIp = function (ip) {

		var reg = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|(:\d{1,4})$/;
		if (!reg.test(ip)) return false;
		url = 'http://' + ip + '/web/?';
		return url;
	};
	var ip = localStorage.getItem('ip');
	var url = "/web/?";
	this.getData = function(data, callback, errorCallback){
//		data = $.extend(true, data, {rnd:Math.random()});
		data = $.jsonToQuery(data);
		if(!callback) callback = function(){};
		if(!errorCallback) errorCallback = function(){};
		data = data || ("apiType=3&version="+VERSION);
		if(!url){
			errorCallback && errorCallback();
		}
		console.log(123, url);
		/*$.getJSON(url+data, function (json) {
            if(json && json.code == "200"){
	            console.log(json.data);
	            callback(json.data);
            }
        }, errorCallback);*/
//		$.showTips("加载中...");
		if(DEBUG) {
			callback(DataBase);
			return;
		}
		var err = function(msg){
			$.showTips(msg);
		};
		$.ajax({
			url     : url,
			data    : data+"&rnd="+Math.random(),
			success : function(json){
				if(json){
					if(json.code == "200"){
						//window.AndroidFun.updateAPK("http://10.1.1.23:8070/video/Huapai.apk")
						if($.queryToJson(data).apiType == "3" && json.data.download){
							try {
//								window.AndroidFun.updateAPK(json.data.download);
							} catch (e) {
							}
						}
	                    if(json.data && json.data.version && json.data.version.css){
	                        localStorage.setItem('css', json.data.version.css);
	                    }
						callback(json.data);
					}else{
						err(json.msg);
					}
				}
			},
			dataType: 'json',
			fail    : errorCallback,
			timeout : 30000,
			error : errorCallback
		});
	};

	this.callService = function(data, callback){
		this.getData(data, callback);
	};
    var loadData = function(){

       /* $.getJSON(url, function(data) {
            var result = data.data;
            if (result) {
                localStorage.setItem('DataBase', JSON.stringify(result));
	            init();
            }
            else {
            }
        });*/
    };


	var init = function(){
		var yidian;
		this.DataBase = eval('('+localStorage.getItem('DataBase')+')');
		console.log(this.DataBase);
//		console.log(this.DataBase);
		if(yidian = this.getPadData('yidian')){
			this.menuArray = yidian.split("||");
		}
		this.init = true;
		try {
			initIndex();
			try {
				console.log("versionCODED:"+VERSION);
				var versionCode = parseInt(window.AndroidFun.getVersionCode());
				if(versionCode<parseInt(this.DataBase.lastversion)&& this.DataBase.download){
					window.AndroidFun.updateAPK(this.DataBase.download);
//					$.hideCommonLayer();
					return;
				}

			} catch (e) {
			}
			this.delVideoFiles();
		} catch (e) {
			loadChacheFunCommon();
		}
	};
	if(!localStorage.getItem('DataBase')) {
		console.log('loadData');
//		window.loadCache = true;
		$.showTips('数据加载中...', true);
		this.getData({}, function(json){
			console.log('load succ');
			localStorage.setItem('DataBase', JSON.stringify(json));
//			window.location.reload();
			$.hideCommonLayer();
			init();
			/*if(window.loadCache) {
				$.showTips('<div>正在缓存离线菜单，请稍候</div>' +
					'<div class="progress">' +
					'   <span class="red" style="width: 0%;"><span>0%</span></span>' +
					'</div>', true);
			}*/
			try {
				window.AndroidFun.loadBgImg(Base.DataBase.homepic ? Base.DataBase.homepic : "");
			} catch (e) {
			}

		}, function(){
			$.showTips("网络不稳定，请联系服务员");
			localStorage.setItem("DataBase", localStorage.getItem("DataBaseBack"));
			init();
		});
	} else {
		init();
	}

	this.delVideoFiles = function(){
		var videos = [];
		var FullScreenAd = this.parseAD(20);
		if(FullScreenAd) {
			var file = FullScreenAd.file.split("/");
			videos.push(file[file.length-1]);
		}
		if(this.DataBase.loopad.info){
			var adArr = this.DataBase.loopad.info;
			for (var i = 0; i < adArr.length; i++) {
				var ad = adArr[i];
				if(ad.layout == "1" ||ad.layout == "3" ){
					var file = ad.info[0].file.split("/");
					videos.push(file[file.length-1]);
				}

			}
		}
		var fullScreenAD = Base.parseAD(18);
		if(fullScreenAD){
			var file = ad.file.split("/");
			videos.push(file[file.length-1]);
		}
		window.AndroidFun.delOldVideo(videos.join(","));
	};
	return this;
})();
/**
 * 分页
 * @param tpl 模板
 * @param page 页码
 * @param content 插入的节点
 * @param container 页码容器
 * @param count 每页个数
 * @param data 数据对象
 */
function Page(tpl, page, content, container, count, data){
	container = container || $(document.body);
	tpl = tpl || "";

	page = parseInt(page||0);
	var start = 0;
	count = count || 6;
	var end = count;
	if(page>0){
		start = (page)*count;
		end = start+count;
	}
	console.log(start, end);
	data = data || Base.menuArray;
	var arrayTmp = data.slice(start, end);
	var array = [];
	$(arrayTmp).each(function(index, str){
		console.log("array:", index, str);
		var data = $.queryToJson(str);
		data.tastes = data.tastes.split(",");
		array.push(data);
	});



	console.log(content, tpl, array);
	var html =EasyTemplate(tpl, array).toString();
	content.html(html);

	var prev = container.jsNode('prev');
	var next = container.jsNode('next');
	console.log("prev:", prev, next, container);
	var prevData = $.queryToJson(prev.attr("evt-data"));
	var nextData = $.queryToJson(next.attr("evt-data"));
	if(start == 0) {

		console.log("prev", prev);
		prev.addClass('disable');
//		prev.hide();
	}else{
		prev.removeClass('disable');
		console.log("page::::::::_____", page-1);
		prev.attr("evt-data", $.jsonToQuery($.tools.merge(prevData||{}, {p:page-1})));
//		prev.show();

	}
	if(end<data.length){
		console.log("show page");
//		next.show();
		next.removeClass('disable');
		console.log("page::::::::_____", page+1);
		next.attr("evt-data", $.jsonToQuery($.tools.merge(nextData||{}, {p:page+1})));
	}else{
		console.log("hide page");
		next.addClass('disable');
//		next.hide();
	}
};

window.onbeforeunload = function(){
	try {
		window.AndroidFun.releaseVideo();
	} catch (e) {
	}
};

/*
$(document.body).ready(function(){
	$.mobile.loaderWidget.hide();
});*/
