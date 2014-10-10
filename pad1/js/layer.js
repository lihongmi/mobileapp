$(function() {
    var template = '<div class="Wlayer" style="display:none;">\n' +
        '        <a href="javascript:void(0);" evt-type="close" js-node="close" class="close">&times;</a>\n' +
        '       <div js-node="content"></div>' +
        '</div>';

    var wLayer = $(template).appendTo(document.body);
    $.wLayer = wLayer;
    var mask = $('<div class="WlayerMasker" style="display: none;"></div>').appendTo(document.body);
    console.log(wLayer[0]);
    //弹层视频广告
    /*var showAd = function(){
		showLayer(LayerTpl.ad);
		var mask = $('<div class="WlayerMasker" style="z-index:10001;background: rgba(125,125,125,0);"></div>').appendTo(document.body);
		mask.on('click', function(e){
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
		});
		$("#example_video_1").on("ended", function(){
			window.alert('over');
		});
	};
	window.showAd = showAd;
	setTimeout(showAd, 5000);*/
    var show = function(opts, adLayerHtml) {
        opts = opts || {};
        wLayer.css({
            display: 'block',
            visibility: 'hidden'
        });
        var winHeight = $(window).height();
        var winWidth = $(window).width();
        var height = wLayer.height();
        var width = wLayer.width();
        var left = winWidth / 2 - width / 2;
        if (left < 10) left = 10;
        var top = winHeight / 2 - height / 2;
        if (top < 10) top = 10;
        top = opts.top || top;
        if (adLayerHtml) {
            wLayer.css({
                left: 0,
                top: top,
                visibility: 'visible'
            });
            wLayer.after(adLayerHtml);
            $(".AD-sidelayer").css({
                top: top
            });

        } else {
            wLayer.css({
                left: left,
                top: top,
                visibility: 'visible'
            });
        }
        mask.show();
    };
    var tmpCloseFun = null;
    var showLayer = function(tmp, delClose, opts, adLayerHtml) {
        //		adLayerHtml = '<div class="AD-sidelayer"> <div class="AD-wrap ">  <div class="row"> <div class="cell"><img src="/img/1406263257.jpg"/></div> </div> </div> </div>';
        wLayer.jsNode('content').html(tmp);
        wLayer.jsNode('close').css('display', delClose ? 'none' : 'block');
        if (opts && opts.closeFun) tmpCloseFun = opts.closeFun;
        show(opts, adLayerHtml);
    };
    var hideLayer = function() {
        wLayer.hide();
        mask.hide();
        $(".AD-sidelayer").hide();
    };
    $.showLayer = showLayer;
    $.hideLayer = hideLayer;
    $.delegate('close', 'tap', function() {
        hideLayer();
        if (tmpCloseFun) {
            tmpCloseFun();
            tmpCloseFun = null;
        }
    });
    var kaitaiLayer = function() {
        var kaitaiInfo = Base.getCashData('kaitaiInfo');
        if (!kaitaiInfo) {
            kaitaiInfo = {
                tid: '',
                eid: ''
            };
        }
        kaitaiInfo = $.tools.merge(kaitaiInfo, {
            tablenum: Base.DataBase.tablenum,
            staffnum: Base.DataBase.staffnum
        })
        showLayer(Base.getHtml(LayerTpl.kaitai, kaitaiInfo), false, {
            top: 40,
            closeFun: function() {
//                window.location.href = "./index.html";
            }
        });
    };
    var kaitaiFun = function() {
        var data = wLayer.htmlToJson();
        $.showTips('开台中，请稍候...', -1);
        Base.getData($.tools.merge(wLayer.htmlToJson(), {
            apiType: 1,
            type: 5
        }), function() {
            localStorage.setItem("kaitai", "1");
            localStorage.setItem('kaitaiInfo', JSON.stringify(data));
            hideLayer();
            tmpCloseFun = null;
            localStorage.removeItem("historyMenu");
            try {
                $.showTips('开台成功');
                //				if (Base.DataBase.version.welcome)window.AndroidFun.gotoUrl(Base.DataBase.version.welcome);
                if (Base.DataBase.method == "1") {
                    sendOrder();
                } else {
                    //					if (Base.DataBase.version.welcome)window.location.href = Base.DataBase.version.welcome;
                }
            } catch (e) {}
        }, function(json) {
            $.showTips('网络不稳定，请联系服务员');
            //			window.location.reload();
        });
    };

    //开台
    $.delegate('kaitai', 'tap', kaitaiFun);
    /*$(document.body).jsNode("showDetail").find('li').tap(function(){
		console.log(123123);
		showLayer(LayerTpl.detail);
	});*/
    $.delegate('chooseItem', 'tap', function(obj) {
        var nodeName = 'tp' + obj.data.tp;
        console.log(parseInt(obj.data.i) - 1);
        $(this).addClass('cur');
        console.log(wLayer.jsNode(nodeName));
        wLayer.jsNode(nodeName).find('tr').eq(parseInt(obj.data.i) - 1).find('.btnChoose').removeClass('cur');
    });
    $.delegate('showDetail', 'tap', function(obj) {
        var data = obj.data;
        var tmpl;
        rightPanelFun(0);
        var food = $.tools.merge(Base.getCurDetailById(obj.data.id), {
            category: Base.curCategoryIndex
        });
        switch (data.type) {
            case "1":
                if (data.combo) {
                    var _foodData = Base.getComboDetailById(data.comboId, data.id, undefined, data.l);
                    console.log("_foodData:", _foodData, data.comboId, data.id, undefined, data.l);
                    food = $.tools.merge(_foodData, {
                        category: Base.curCategoryIndex
                    });

                    food = $.tools.merge(food, getSaveData());
                }
                tmpl = LayerTpl.detail;
                break;
            case "2":
                tmpl = LayerTpl.yidian;
                break;
            case "3":

                $(food.list).each(function(i) {
                    food.list[i].index = (i + 1);
                    if (food.list2[i]) food.list2[i].index = (i + 1);
                });
                tmpl = LayerTpl.detailCombo;
                break;
            default:
                tmpl = LayerTpl.detail;
        }
        tmpl = tmpl.replace(/#category#/gi, Base.curCategoryIndex);
        console.log("food::::::", food);
        food = $.tools.merge(data, food);
        //广告
        var adHtml = [
            Base.getAdHtml(12),
            Base.getAdHtml(13)
        ].join('');
        food = $.tools.merge(food, {
            adHtml: adHtml
        });
        console.log(adHtml, food);
        var html = Base.getHtml(tmpl, food);
        var adLayer = Base.getAdHtml(22);
        console.log("adLayer:", typeof adLayer);
        showLayer(html, undefined, undefined, adLayer);
        if (data.type == "3") {
            console.log("data.count", data.count, wLayer.jsNode('numbers').find('input'));
            wLayer.find('.numbers').find('input').val(data.count || 1);
            if (data.tastes) {
                wLayer.jsNode('taste').find("a").each(function(i, node) {
                    console.log(data.tastes);
                    //				console.log(123123, $(node).text(), data.tastes.split(","), $.inArray($(node).text(), data.tastes.split(",")));
                    if ($.inArray($(node).text(), data.tastes.split(",")) >= 0) {
                        $(node).addClass("cur");
                    }
                });
            }
            if (!data.choose) return;
            var chooseDomList = wLayer.jsNode('tp1').find('.btnChoose');
            var chooseDomList2 = wLayer.jsNode('tp2').find('tr');
            var arr = data.choose.split("");
            chooseDomList.each(function(i, item) {
                $(item)[(arr[i] == "1") ? 'addClass' : 'removeClass']("cur");
                var btn = chooseDomList2.eq(i).find(".btnChoose");
                console.log(item, arr[i] == "1", btn[0]);
                if (btn.length > 0) btn[(arr[i] == "1") ? 'removeClass' : 'addClass']("cur");
            });
        }

/*

*/




/*$('.food_cont').bind('tap',function(){
    $('.flexslider').flexslider({
        animation: "slide"
      });
})*/

//滑动
 $('.flexslider').flexslider({
        animation: "slide"
      });






    });
    if (localStorage.getItem("kaitai") !== "1" && Base.DataBase.method !== "1") {
        //		localStorage.setItem("kaitai", "1");

        kaitaiLayer();
        //开台Go键盘事件
        /*wLayer.find('input').on('keyup', function(evt){
			if(evt.keyCode == 13){
				if($(this).attr("evt-data")){
					kaitaiFun();
				}else{
					$(this).parents("dl").next().find("input").focus();
				}
			}
		});*/
    }

    var loop = function(count) {
        count--;
        var node = $(".menuOrder");
        //        console.log(count, node.style.right, parseInt(node.style.right));
        node.css("right", parseInt(node.css("right")) - 50);
        console.log(node.css("right"));
        if (count > 0) {
            setTimeout(function() {
                loop(count);
            }, 50);
        }
    };
    wLayer[0].addEventListener("webkitAnimationEnd", function() {
        wLayer.removeClass('animation');
        hideLayer();
    }, true);
    var getSaveData = function() {
        var tastes = wLayer.jsNode('taste').find("a.cur");
        var tastesArr = [];
        tastes.each(function(i, obj) {
            tastesArr.push($(obj).text());
        });
        var choose = wLayer.jsNode('tp1').find('tr');
        var tpArr = [];
        choose.each(function(i, obj) {
            tpArr.push($(obj).find('.btnChoose').hasClass('cur') ? "1" : "0");
        });
        console.log("getSaveData:******************:", tpArr);
        return {
            count: wLayer.find("input").val(),
            tastes: tastesArr.join(","),
            choose: tpArr.join("")
        };
    };
    //确定点这个菜
    $.delegate('saveItem', 'tap', function(obj) {
        wLayer.addClass('animation');
        var data = obj.data;
        data.category = parseInt(data.category);
        if (data.combo == "1") {

        }
        var yidianData = Base.setMenu($.tools.merge(data, getSaveData()));
        console.log(EasyTemplate(LayerTpl.menuYidian, yidianData).toString());

        yidianPage(0);
    });
    var prev, next;
    var yidianPage = function(page) {
        page = page || 0;
        var start = 0;
        var count = 10;
        var end = 10;
        if (page > 0) {
            start = (page) * count;
            end = start + count;
        }
        console.log(start, end);
        var arrayTmp = Base.menuArray.slice(start, end);
        var array = [];
        $(arrayTmp).each(function(index, str) {
            console.log("array:", index, str);
            array.push($.queryToJson(str));
        });

        var tpl = LayerTpl.menuYidian;
        if (start == 0) {

            console.log("prev", prev);
            //			prev.hide();
            prev.attr("evt-data", "p=0");
            prev.addClass('disable');
        } else {

            prev.attr("evt-data", "p=" + (page - 1));
            //			prev.show();
            prev.removeClass('disable');

        }
        if (end < Base.menuArray.length) {
            console.log("show page");
            //			next.show();
            next.removeClass('disable');
            next.attr("evt-data", "p=" + (page + 1));
        } else {
            console.log("hide page");
            //			next.hide();
            next.attr("evt-data", "p=" + (page + 1));
            next.addClass('disable');
        }
        rightPanel.jsNode('count').html(Base.menuArray.length);
        wLayer.jsNode('total').html(Base.countTotal());
        rightPanel.jsNode('yidianList').html(EasyTemplate(tpl, array).toString());
    };
    var jpage = function(obj) {
        if ($(this).hasClass('disable')) return;
        if (obj.data.type == "1") {
            commitPage(obj.data);
        }
        yidianPage(parseInt(obj.data.p));
    };
    var jpageLayer = function(obj) {
        /*var html = EasyTemplate(LayerTpl.yidian, {}).toString();
		showLayer(html);*/
        if ($(this).hasClass('disable')) return;
        yidianLayerPage(obj.data.p ? parseInt(obj.data.p) : 0);
    };

    $.delegate('prev', 'tap', jpage);
    $.delegate('next', 'tap', jpage);
    $.delegate('prevYidianLayer', 'tap', jpageLayer);
    $.delegate('nextYidianLayer', 'tap', jpageLayer);
    var rightPanel, menuPage;
    var initRightPanel = function() {
        rightPanel = $($.language(LayerTpl.menuOrder)).appendTo(document.body);
        $("#listADLayer").html(Base.getAdHtml(8));
        rightPanel.jsNode('count').html(Base.menuArray.length);
        prev = rightPanel.jsNode("prev");
        next = rightPanel.jsNode("next");
        rightPanel.css({
            right: -(rightPanel.width())
        });
        menuPage = $($.language(LayerTpl.menuPage)).appendTo(document.body);
        yidianPage(0);
    };

    var rightPanelFun = function(type) {
        //        loop(6);
        var isShow = rightPanel.attr("is-show") == "1";
        if (type !== undefined) {
            if (type == 1 && isShow) return;
            if (type == 0 && !isShow) return;
        }
        var right = isShow ? (-(rightPanel.width())) : 0;
        rightPanel.animate({
            right: right
        }, 40, undefined, function() {
            rightPanel.attr('is-show', isShow ? "0" : "1")
        });
    };
    $.delegate("rightBtn", 'tap', rightPanelFun);

    var initTasteTag = function() {


    };
    $.delegate('delCount', 'tap', function(obj) {
        var _input = $(this).next();
        var val = parseInt(_input.val());
        if (val <= 1) {
            val = 1;
            return;
        } else {
            val -= 1;
        }

        _input.val(val);
        if (obj.data.type == "1") {
            var data = obj.data;
            data.count = val;
            Base.update(data);
        }
        updateTotal(obj.data, -1);
    });
    $.delegate('addCount', 'tap', function(obj) {
        var _input = $(this).prev();
        var val = parseInt(_input.val()) + 1;
        _input.val(val);
        if (obj.data.type == "1") {
            var data = obj.data;
            data.count = val;
            Base.update(data);
        }
        updateTotal(obj.data, 1);
    });

    $.delegate('countInput', 'change', function(obj) {
        console.log("type", obj.data.type);
        if (obj.data.type == "1") {
            console.log("test:::::::::::");
            var data = obj.data;
            console.log("data:::::", $(this));
            data.count = Number($(this).val());
            console.log("count", data);

            Base.update(data);
            console.log(data);
        }
        wLayer.jsNode('total').html(Base.countTotal());
    });

	$.delegate('tasteInput', 'change', function(obj) {
		var data = obj.data;
		data.tastes = $.trim($(this).val()).replace(/，/g,",");
		console.log("tasteInput::::::::::::::",data);
		Base.update(data);
    });


    var updateTotal = function(data, vt) {
        var val = data.price ? Number(data.price) : 0;
        var totalNode = wLayer.jsNode('total');
        console.log(totalNode, data);
        var total = Number(totalNode.html());
        console.log(totalNode.html(), total, val, total + val);
        totalNode.html(total + (val * vt));
    };
    $.delegate('tasteTag', 'tap', function(obj) {
        var _this = $(this);
        if (_this.hasClass('cur')) {
            _this.removeClass('cur');
        } else {
            _this.addClass('cur');
        }

    });
    initTasteTag();
    //已点分页
    var yidianLayerPage = function(page) {
        Page(LayerTpl.yidianList, page, wLayer.jsNode('list'), wLayer, 5);
        /*var prev = wLayer.jsNode('prev');
		var next = wLayer.jsNode('next');
		page = page||0;
		var start = 0;
		var count = 6;
		var end = count;
		if(page>0){
			start = (page)*count;
			end = start+count;
		}
		console.log(start, end);
		var arrayTmp = Base.menuArray.slice(start, end);
		var array = [];
		$(arrayTmp).each(function(index, str){
			console.log("array:", index, str);
			var data = $.queryToJson(str);
			data.tastes = data.tastes.split(",");
			array.push(data);
		});

		var tpl = LayerTpl.yidianList;
		if(start == 0) {

			console.log("prev", prev);
			prev.hide();
		}else{

			prev.attr("evt-data", "p="+(page-1));
			prev.show();

		}
		if(end<Base.menuArray.length){
			console.log("show page");
			next.show();
			next.attr("evt-data", "p="+(page+1));
		}else{
			console.log("hide page");
			next.hide();
		}

		wLayer.jsNode('list').html(EasyTemplate(tpl, array).toString());*/
    };
    //就点这么多
    $.delegate('yidian', 'tap', function() {
        rightPanelFun();
        var data = $.tools.merge({
            list: Base.getMenuArray()
        }, {
            total: Base.countTotal(),
            flag: Base.DataBase.flag
        });
        var html = EasyTemplate(LayerTpl.yidian, data).toString();
        showLayer(html);
        yidianLayerPage(0);
    });
    $.delegate('goOn', 'tap', rightPanelFun);
    $.delegate('delYidian', 'tap', function(obj) {
        console.log(this);
        var tr = $(this).parents("tr");
        var index = parseInt(obj.data.index);
        tr.fadeOut(function() {
            tr.remove();
            Base.menuArray.splice(index - 1, 1);
            Base.updateToMemory();
            yidianLayerPage();
            yidianPage(0);
        });
    });
    var commitPage = function(data) {

        Page(LayerTpl.commitList, data.p ? parseInt(data.p) : 0, wLayer.jsNode('commitList'), wLayer, 5);
    };
    var showCommitPage = function() {
        wLayer.jsNode('content').html(Base.getHtml(LayerTpl.commit, {
            total: Base.countTotal(),
            flag: Base.DataBase.flag
        }));
        commitPage({});
    };
    $.delegate('commit', 'tap', showCommitPage);

    var getTaocan = function() {

    };
    var tmpOrderData = {};
    var sendOrder = function() {
        var kaitaiInfo = Base.getKaiTaiInfo();
        tmpOrderData = $.tools.merge(tmpOrderData, {
            tid: kaitaiInfo.tid,
            eid: kaitaiInfo.eid
        });
        $.showTips("正在下单，请稍候...", -1);
        Base.getData(tmpOrderData, function() {
            Base.setPadData('yidianDone', Base.getPadData('yidian'));
            Base.removePadData('yidian');
            window.location.href = "./index.html#adLayer=1";
        }, function(json) {
            $.showTips('网络不稳定，请联系服务员');
        });
    };
    $.delegate('submit', 'tap', function(obj) {
        var remark = wLayer.jsNode("remark").val();
        if (remark.length > 10) {
            $.showTips('备注不能超过10个字');
            return;
        }
        Base.updateToMemory();
        var data = {};
        for (var i = 0; i <= Base.menuArray.length - 1; i++) {
            var obj = $.queryToJson(Base.menuArray[i]);
            //			obj.chooseName =

            for (var id in obj) {
                if (!data[id]) {
                    data[id] = [];
                }
                data[id].push(obj[id]);
            }
            console.log("menuarr:", obj);
            if (!data.chooseName) data.chooseName = [];
            data.chooseName.push(Base.getComboByChoose(obj.id, obj.category, obj.choose));
        }
        var postData = {};
        if (data.id) {
            postData.fids = data.id.join("||");
            postData.taste = data.tastes.join("||");
            postData.count = data.count.join("||");
            postData.names = data.name.join("||");
            postData.choose = data.choose.join("||");
            if (data.chooseName) postData.chooseName = data.chooseName.join("||");
        }
        postData = $.tools.merge(postData, {
            apiType: 2,
            type: 1,
            remark: remark
        });
        tmpOrderData = postData;
        var isKaitai = localStorage.getItem("kaitai");
        if (isKaitai !== "1") {
            kaitaiLayer();
        } else {
            sendOrder();
        }

        //		postData = $.tools.merge(postData, {year:date.getFullYear(),month:date.getMonth(),day:date.getDate()})
    });
    initRightPanel();


 /*   $('.flexslider').flexslider({
            animation: "slide"
       });*/
    /*	$.mobile.loaderWidget.hide();
	$( "." + $.mobile.activePageClass).css('min-height', '');*/




    
});