/**
 * Created by zhaobo on 14-7-25.
 */

var initIndexAd = function() {
    if (!Base.init) return;
    /*Base.DataBase.loopad = {
		"starttime": "2014-07-31 00:00",
		"endtime"  : "2014-07-31 03:00",
		"info"     : [
			{
				"layout": 4,
				"time"  : "5",
				"info"  : [
					{
						"type": 2,
						"file": "1406263268.jpg"
					},
					{
						"type": 2,
						"file": "1406263270.jpg"
					},
					{
						"type": 2,
						"file": "1406263273.jpg"
					},
					{
						"type": 2,
						"file": "1406263275.jpg"
					}
				]
			},
			{
				"layout": 3,
				"time"  : "5",
				"info"  : [
					{
						"type": "2",
						"file": "1406263264.jpg"
					},
					{
						"type": 2,
						"file": "1406263266.jpg"
					}
				]
			},
			{
				"layout": 2,
				"time"  : "5",
				"info"  : [
					{
						"type": 2,
						"file": "1406263259.jpg"
					},
					{
						"type": 2,
						"file": "1406263262.jpg"
					}
				]
			},
			{
				"layout": 1,
				"time"  : "5",
				"info"  : [
					{
						"type": "2",
						"file": "1406263257.jpg"
					}
				]
			}
		]
	};*/
    console.log(222+"___"+window.loadCache);
    console.log(333, Base.DataBase.loopad);

    if (!(Base.DataBase.loopad && Base.DataBase.loopad.info)) {
		if(window.location.href.indexOf("adLayer")>=0){
			var indexFullScreenAd = Base.parseAD(18);
			if(indexFullScreenAd){
				try {
					window.AndroidFun.playVideo(indexFullScreenAd.file, 1280, 800, 0, 0);
				} catch (e) {
				}
			}
		}
		return;
	}
    var loopad = Base.DataBase.loopad.info;

    console.log(loopad);
    var timer = null;
    var len = loopad.length;
    var curIndex = 0;
    var getAdHtml = function() {
        var html = '';
        switch (parseInt(loopad[curIndex].layout)) {
            case 1:
                if (loopad[curIndex].info[0].type !== "3") {
                    html = '   <div class="cell"><div class="inner"><img src="' + loopad[curIndex].info[0].file + '"/></div></div>';
                }
                break;
            case 2:
                //位置2，图片、文字
                html = '       <div class="cell"><div class="inner"><img src="' + loopad[curIndex].info[0].file + '"/></div></div>' +
                    '       <div class="cell"><div class="inner"><img src="' + loopad[curIndex].info[1].file + '"/></div></div>';
                break;
            case 3:
                html = '       <div class="cell wider">';
                if (loopad[curIndex].info[0].type !== "3") {
                    //位置3，左，图片、文字
                    html += '<div class="inner"><img src="' + loopad[curIndex].info[0].file + '"/></div></div>' +
                        '       <div class="cell"><div class="inner"><img src="' + loopad[curIndex].info[1].file + '"/></div></div>' +
                        '       </div>';
                } else {
                    html += '</div>' +
                        '       <div class="cell"><div class="inner"><img src="' + loopad[curIndex].info[1].file + '"/></div></div>';
                }
                //位置3，右，图片、文字
                html += '';
                break;
            case 4:
                html += '<div class="row">';
                //位置4，左上，图片、文字
                html += '<div class="cell"><div class="inner"><img src="' + loopad[curIndex].info[0].file + '"/></div></div>';
                //位置4，右上，图片、文字
                html += '<div class="cell"><div class="inner"><img src="' + loopad[curIndex].info[1].file + '"/></div></div>';
                html += '</div><div class="row">';
                //位置4，左下，图片、文字
                html += '<div class="cell"><div class="inner"><img src="' + loopad[curIndex].info[2].file + '"/></div></div>';
                //位置4，右下，图片、文字
                html += '<div class="cell"><div class="inner"><img src="' + loopad[curIndex].info[3].file + '"/></div></div></div>';
                break;
            default:
                break;
        }
        return html;
    };
    var getVideoADOpts = function() {
        var ad = loopad[curIndex];
        var layout = ad.layout;
        if (layout == 1) {
            if (ad.info[0].type == "3") {
				return {url:ad.info[0].file, size : [1000,680,264,12]};
            } else {
                return null;
            }
        } else if (layout == 3) {
            if (ad.info[0].type == "3") {
				return {url:ad.info[0].file, size : [720,680,264,12]};
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
    var isPlaying = false;
	var lockLoopAD = false;
    //启动轮播
    var start = function() {
	    if(lockLoopAD)return;
        console.log("start", curIndex);
        var ad = loopad[curIndex];
        if (!ad) return;
        stop();
        isPlaying = true;
        console.log("start2");
        var videoOpts = getVideoADOpts();
        var html = getAdHtml();
        console.log("start html:", html);
        $(".AD-index").find(".AD-wrap").html(html);
        if (videoOpts) {
            try {
                console.log("start3" + videoOpts);
                //呼出视频
                var s = videoOpts.size;
                console.log("start4");
                window.AndroidFun.playVideo(videoOpts.url, s[0], s[1], s[2], s[3]);
                return;
            } catch (e) {
	            if(loopad.length<=1) return;
                if (html == '') continueStart();
            }

        }
        //取当前广告位html

        //获取当前广告位时间
        var time = parseInt(ad.time?ad.time:5) * 1000;
		if(loopad.length<=1) return;
        timer = setTimeout(function() {
            continueStart();
        }, time)
    };
	window.lockLoopADFun = function(){
		lockLoopAD = true;
		stop();
	};
	window.unLockLoopADFun = function(){
		lockLoopAD = false;
		continueStart();
	};
    //停止轮播
    var stop = function() {
        clearTimeout(timer);
        timer = null;
    };
	window.stopLoopAd = stop;
    window.continueStart = function(_index) {
        console.log("continueStart");
        curIndex = (curIndex == len - 1) ? 0 : curIndex + 1;
        if (!isPlaying) curIndex = 0;
        if (!isNaN(_index)) curIndex = parseInt(_index);
        start();
    };
    //所有广告
    /*var ads = Base.DataBase.loopad;
	var arr = [];
	for (var i = 0; i < ads.length; i++) {
		var ad = ads[i];
		if(ad.pos == 'A'||ad.pos == 'B'||ad.pos == 'C'||ad.pos == 'D'){
			arr.push(ad);
		}
	}*/
    if (window.location.href.indexOf("adLayer") >= 0) {
        var indexFullScreenAd = Base.parseAD(18);
        console.log("show fullscreen video", indexFullScreenAd);
        if (indexFullScreenAd) {
            try {
                window.AndroidFun.playVideo(indexFullScreenAd.file, 1280, 800, 0, 0);
            } catch (e) {}
        } else {
            start();
        }
    } else {
        setTimeout(function() {
            if (!window.loadCache) start();
        }, 5000);
    }

};
