$(function() {
    var EN = localStorage.getItem('en');
    if (EN) Base.DataBase.name = Base.DataBase.enname;
    for (var i = 0; i < Base.DataBase.category.length; i++) {
        Base.DataBase.category[i]._i = i;
        if (EN) Base.DataBase.category[i].name = Base.DataBase.category[i].enname;
    }
    $(".leftNav").html(EasyTemplate(PageTpl.leftNav, Base.DataBase).toString());
    $.delegate('showMenuList', 'tap', function(obj) {
        if (window.location.href.indexOf('order_confirm') > 0) {
            window.location.href = './menu_list.html#category=' + obj.data._i;
        }
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
    // 右侧滑动
    // var rightBtn = $('.leftNav [evt-type="rightBtn"]');
    // var $leftNav = $('.leftNav nav'),
    //     nodeWidth = 232,
    //     nodeHeight = 75;
    // rightBtn.on('tap', function() {
    //     var heightRate = Math.ceil((nodeHeight * $leftNav.find('a').length) / $leftNav.height()),
    //         navWidth = nodeWidth * heightRate;
    //     var showOrHide;
    //     if (!$leftNav.attr('navOpen')) {
    //         $leftNav.attr('navOpen', 'true').width(navWidth);
    //     }
    // })
});