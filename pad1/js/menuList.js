$(function(){


	var EN = localStorage.getItem('en');
	var initLeftNav = function () {
		if(EN) Base.DataBase.name = Base.DataBase.enname;
		for (var i = 0; i < Base.DataBase.category.length; i++) {
			Base.DataBase.category[i]._i = i;
			if(EN)Base.DataBase.category[i].name = Base.DataBase.category[i].enname;

		}
		$(".leftNav").html(Base.getHtml(PageTpl.leftNav, Base.DataBase));
	};
	var initList = function () {
	};
	$.delegate('getQRCode', 'tap', function(){
		window.AndroidFun.getQRCode();
	});
	//收起左导
	var collapseLeftNav = function(){
		var leftNav = $('.leftNav');
		leftNav.css({width:leftNav.data('lastWidth')});
		var nav = $('nav');
		nav.css({width : ""});
		nav[0].style['-webkit-column-count'] = '';
		nav[0].style['writing-mode'] = '';
		leftNav.data('open', 0);
		var btns = nav.find("a");
		if($.inArray(this, btns)>7){
			var a = $(this);
			var b = btns.eq(7);
//			nav.css({width : 240});
//		$(this).before($('nav').find("a").eq(7));
			b.before(a);
		}
	};
	//展开左导
	 $.delegate('showMore', 'tap', function(){
		 var leftNav = $('.leftNav');
		 if(leftNav.data('open') == 1) {
			 collapseLeftNav.apply(this, []);
			 return;
		 }
		 var nav = $('nav');
		 var width = leftNav.width()-20;

		 var categories = nav.find('a');
		 var len = categories.length;
		 if(len<=8) return;
		 leftNav.data('lastWidth', width+20);
		 var column = Math.ceil(len/8);
		 var width = width*(column);
		 console.log(width);

		 leftNav.css({width : width-20});
		 nav.css({width : width-(column == 2 ? 26 : 34)});
		 nav[0].style['-webkit-column-count'] = column;
		 nav[0].style['writing-mode'] = 'tb-lr';
		 leftNav.data('open', 1);
//	 console.log(width);
	 });
	//弹层视频广告
	var showAd = function () {
		var html = Base.getAdHtml(17);
		if(!html) return;
		$.showLayer(html);
		var mask = $('<div class="WlayerMasker" style="z-index:10001;background: rgba(125,125,125,0);"></div>').appendTo(document.body);
		mask.on('click', function (e) {
			var closeBtn = $(document.body).jsNode('close');
			var closePos = closeBtn.position();
			var layerPos = $.wLayer.position();
			var x = e.clientX;
			var y = e.clientY;
			var t = closePos.top + layerPos.top;
			var l = closePos.left + layerPos.left;
			if (x >= l && x <= l + 60 && y >= t && y <= t + 60) {
				mask.remove();
				$("#example_video_1").remove();
				$.hideLayer();
			}
		});
		$("#example_video_1").on("ended", function () {
			window.alert('over');
		});
	};
	var initAD = function(){
		//广告模版
		$("#listAd").html([
			Base.getAdHtml(6),
			Base.getAdHtml(7)
		].join(''));
		if(window.location.href.indexOf("adLayer")>=0){
			showAd();
		}
	};

	var queryObj = $.queryToJson(window.location.hash.replace('#', ''));
	var categoryIndex = 0;
	if(queryObj.category){
		categoryIndex = parseInt(queryObj.category);
	}
	Base.setCategory(categoryIndex);


	var calPages = function (category, isCombo) {
		var len = 0;
		var cateData = category.food;
		var pageArr = category.templetset ? category.templetset.split(",") :[0];
		if(isCombo && !category.templetset){
			for (var i = 0; i < Math.floor(cateData.length/2); i++) {
				pageArr.push(0);
			}
		}
		$(pageArr).each(function(i){
			pageArr[i] = parseInt(pageArr[i]);
			if (len >= cateData.length) {
				pageArr.splice(i);
				return;
			}
			parseInt(pageArr[i]) == 0 ? len += (isCombo ? 2 : 3) : len += 12;
		});
		if (len < cateData.length) {
			var addC = Math.ceil((cateData.length - len) / 12);
			for (var j = 0; j < addC; j++) {
				pageArr.push(1);
			}
		}
		console.log("pageArr*****************", pageArr);
		return pageArr;
	};
	var calList = function(category, isCombo, pageArr){
		var list = [];
		var cateData = category.food;

		$(pageArr).each(function(i){
			var start = 0,end = (pageArr[0] == 0 ? (isCombo ? 2 : 3) : 12);
			if(i>0)$(pageArr.slice(0,i+1)).each(function(j,pType){
				if(j>0){
					start = end;
					end += ((pType == 0) ? (isCombo ? 2 : 3) : 12);
				}
			});
			var _list = cateData.slice(start, end);
			list.push(_list);
		});
		console.log("list****************", list, cateData);
		return list;
	};
	var food = Base.DataBase.category[categoryIndex].food;

	var jumpPage = function(page){
		page = page||0;

		var curCategory = Base.getCategory();
		//是否套餐
		var isCombo = (curCategory && curCategory.type) ? parseInt(curCategory.type) == 2 : false;
		//计算出页码数据[0,1,1]
		var _pages = calPages(curCategory, isCombo);

		//计算出当前类型按页分组数据
		var _list = calList(curCategory, isCombo, _pages);

		var totalPage = _pages.length;

		totalPage = totalPage == 0 ? 1 : totalPage;

		pages.html(page+1+'/'+totalPage);

		//当页数据
		var array = _list.length>0 ? _list[page] : [];

		var tpl = isCombo ? (_pages[page] == 0 ? PageTpl.menuListCombo : PageTpl.menuList2) : (_pages[page] == 0 ? PageTpl.menuList : PageTpl.menuList2);

		if(_pages[page] == 0) {
			$(array).each(function(i){
				array[i].type = (i == 0) ? 1 : 2;
			});
		}
		if(page == 0){
			prevPage.css('visibility', 'hidden');
		}else{
			prevPage.attr("evt-data", "p="+(page-1));
			prevPage.css('visibility', 'visible');

		}
		if(page !== (totalPage - 1)){
			nextPage.css('visibility', 'visible');
			nextPage.attr("evt-data", "p="+(page+1));
		}else{
			nextPage.css('visibility', 'hidden');
		}

		$(array).each(function(i, obj){
			if(EN) {
				obj.name = obj.enname;
				obj.taste = obj.entaste;
				obj.desc = obj.endesc;
			}
		});
		$(".mainList").html(EasyTemplate(tpl, array).toString().replace("#category#", Base.curCategoryIndex));
	};

//	var food;
/*
	var jumpPage = function(page){
		var curCategory = Base.getCategory();
		console.log("curCategory.type", curCategory.type);
		var isCombo = (curCategory && curCategory.type) ? parseInt(curCategory.type) == 2 : false;
		page = page||0;
		var start = 0;
		var count = isCombo ? 2 : 3;
		var end = isCombo ? 2 : 3;
		if(page>0){
			count = isCombo ? 2 : 12;
			start = isCombo ? (page-1)*count+2 :(page-1)*count+3;
			end = start+count;
		}
		var page1 = food.length-(isCombo? 2 : 3);
		var totalPage = 1;
		if(page1>0){
			totalPage += Math.ceil(page1/(isCombo ? 2 : 12));
		}
		console.log("jumpPage:::",start, end);
		pages.html(page+1+'/'+totalPage);
		var array = food.slice(start, end);
		var tpl;
		if(start == 0) {
			tpl = isCombo ? PageTpl.menuListCombo : PageTpl.menuList;
			for (var i = 0; i < array.length; i++) {
				array[i].type = (i == 0) ? 1 : 2;
				if(array[i].type == 1){
					console.log("333333", array[i]);
//					if(array[i].bigimg)array[i].image = array[i].bigimg;
				}else{
				}
			}

			console.log("prev", prevPage);
//			prevPage.hide();
			prevPage.css('visibility', 'hidden');
		}else{
			tpl = isCombo ? PageTpl.menuListCombo : PageTpl.menuList2;
			prevPage.attr("evt-data", "p="+(page-1));
//			prevPage.show();
			prevPage.css('visibility', 'visible');

		}
		if(end<food.length){
//			nextPage.show();
			nextPage.css('visibility', 'visible');
			nextPage.attr("evt-data", "p="+(page+1));
		}else{
//			nextPage.hide();
			nextPage.css('visibility', 'hidden');
		}

		$(".mainList").html(EasyTemplate(tpl, array).toString().replace("#category#", Base.curCategoryIndex));
	};
*/
	var jpage = function(obj){
		if($(this).hasClass('disable')) return;
		jumpPage(parseInt(obj.data.p));
	};
	var showMenuList = function(obj){
		console.log(1);
		Base.setCategory(obj.data._i);
		food = Base.DataBase.category[parseInt(obj.data._i)].food;
		console.log(2);
		jumpPage();
		collapseLeftNav.apply(this, [obj]);
	};
	$.delegate('prevPage', 'tap', jpage);
	$.delegate('nextPage', 'tap', jpage);
	$(".mainList").on("swipeLeft", function(){
		var nextBtn = $('[evt-type=nextPage]');
		if(nextBtn.css("visibility") == "hidden") return;
		nextBtn.trigger('tap');
	});
	$(".mainList").on("swipeRight", function(){
		var prevBtn = $('[evt-type=prevPage]');
		if(prevBtn.css("visibility") == "hidden") return;
		prevBtn.trigger('tap');
	});
	$.delegate('showMenuList', 'tap', showMenuList);
	var prevPage = $(document.body).jsNode('prevPage');
	var nextPage = $(document.body).jsNode('nextPage');
	var pages = $(".menuPage").jsNode('pages');
	var page = 0;
	var refreshImg = function(){
		$('[t-src]').each(function(){
			$(this).attr("src", $(this).attr("t-src"));
		});
	};
	var initPage = function () {
		initLeftNav();
		initList();
		jumpPage();
		initAD();
		refreshImg();
	};
	initPage();



	$('.leftNav nav a:first').addClass('cur');
	$('.leftNav a').click(function(){
		$(this).addClass('cur').siblings().removeClass('cur');
	})
});