define(function(require, exports, module){
	var $ = require('../common/zepto-1.1.2');
	var frame = {
		_frames: {},
		_frames_id: 0,
		_curfr: null,
		_frindex: 1,
		_frqueue: [],
		_scindex: 1000,
		_cfindex: 1100,
		_ttindex: 1200,
		_delay: 50,
		_shadowOnShow: false,
		_onlyBack: false,
		getEventType: function(type){
			var userAgentInfo = navigator.userAgent;  
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
			var flag = true;  
			for (var v = 0; v < Agents.length; v++) {  
				if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
			}  
			var types = {
					"down":["mousedown", "touchstart"],
					"move":["mousemove", "touchmove"],
					"up":["mouseup", "touchend"]};
			return flag ? types[type][0] : types[type][1];  
		},
		open: function(frname, frurl, frwidth, frheight, franimate){
			if(window.pageInfo != "initialization"){
				window.parent.appFrame.open(frname, frurl, frwidth, frheight, franimate);
				return;
			}
			franimate = franimate | 0;
			var $fr = null;
			if(frname in this._frames){
				$fr = $("#" + this._frames[frname]);
				if(!this._onlyBack)
					$fr.get(0).contentWindow.appFrame.loadPage();
				this._onlyBack = false;
			}else{
				var id = frname + this._frames_id;
				this._frames_id ++;
				this._frames[frname] = id;
				$fr = this._createFrame(id, frname, frurl);
				$fr.appendTo(document.body);
			}
			if(frname != this._frqueue[this._frqueue.length - 1])
				this._frqueue.push(frname);
			$fr.attr("frAnim", franimate);
			this._executeAnimate(franimate, $fr);
			setTimeout(function(){
				if(appFrame._curfr){
					appFrame.close(appFrame._curfr);
				}
				appFrame._curfr = frname;
			}, this._delay);
		},
		close: function(frname){
			if(window.pageInfo != "initialization"){
				window.parent.appFrame.close(frname);
				return;
			}
			if(!frname){
				frname = this._curfr;
			}
			if(frname in this._frames){
				if(frname == this._frqueue[this._frqueue.length - 1]){
					this._frqueue.splice(this._frqueue.length - 1, 1);
					var prevFrname = this._frqueue[this._frqueue.length - 1];
					this._curfr = null;
					this.open(prevFrname);
				}
				var $fr = $("#" + this._frames[frname]);
				this._executeAnimate(parseInt($fr.attr("frAnim")) + 3, $fr);
			}
		},
		back: function(frname){
			if(window.pageInfo != "initialization"){
				window.parent.appFrame.back(frname);
				return;
			}
			this._onlyBack = true;
			this.close(frname);
		},
		refresh: function(frname){
			if(window.pageInfo != "initialization"){
				window.parent.appFrame.refresh(frname);
				return;
			}
			if(frname in this._frames){
				$("#" + this._frames[frname]).get(0).contentWindow.appFrame.loadPage();
			}
		},
		openFrame: function(frname, frurl, frwidth, frheight, franimate){},
		closeFrame: function(frname){},
		refreshFrame: function(frname){},
		showTooltip: function(tipString, delay){
			var $tt = null;
			if($("._tooltip_").length > 0){
				$tt = $("._tooltip_");
			}else{
				$tt = this._createTooltip();
				$tt.appendTo(document.body);
			}
			if($tt.find("._tooltip_center_").html() != tipString){
				$tt.find("._tooltip_center_").html(tipString);
			}
			$tt.css("top", 0);
			if(delay){
				setTimeout(this.closeTooltip, delay);
			}
		},
		closeTooltip: function(){
			$("._tooltip_").css("top", -10000);
		},
		showConfirm: function(options, refresh, callback){
			var cType = options.type || "alert";
			var $cf = null;
			this._showShadowCover(0.5);
			if($("._confirm_wrapper_").length > 0 && !refresh){
				$cf = $("._confirm_wrapper_");
			}else{
				if($("._confirm_wrapper_").length > 0){
					$("._confirm_wrapper_").empty().remove();
				}
				$cf = this._createConfirm(options);
				$cf.appendTo(document.body);
				if(options.selectList){
					$cf.find("li").each(function(index){
						$(this).on("touchstart", function(){
							$(this).addClass("down");
						}).on("touchend", function(){
							$(this).removeClass("down");
							options["selectFunction"].apply(this, [$(this).attr("data-val"), $(this).text(), index]);
							appFrame.closeConfirm();
						});
					});
				}
				if(options.confirm){
					if(options.confirm.confirmFunction){
						$cf.find("div.cf_button_ok").bind(this.getEventType("up"), function(){
							options.confirm.confirmFunction();
							$("#_focustBtn_").get(0).focus();
						});
					}
					if(options.confirm.cancelFunction){
						$cf.find("div.cf_button_no").bind(this.getEventType("up"), function(){
							options.confirm.cancelFunction();
							$("#_focustBtn_").get(0).focus();
						});
					}
				}
			}
			var t = ($(document.body).height() - $cf.height()) / 2;
			$cf.css("top", t);
			callback && callback();
		},
		closeConfirm: function(){
			$("._confirm_wrapper_").css("top", -10000);
			appFrame._closeShadowCover();
		},
		_showShadowCover: function(opacity){
			var $sc = null;
			this._shadowOnShow = true;
			if($("._confirm_shadow_cover_").length > 0){
				$sc = $("._confirm_shadow_cover_");
			}else{
				$sc = this._createShadowCover(null, "_confirm_shadow_cover_");
				$sc.appendTo(document.body);
				$sc.on(this.getEventType("up"), function(e){
					e = e || window.event;  
				    if(e.stopPropagation) { //阻止冒泡
				        e.stopPropagation();  
				    }
					appFrame.closeConfirm();
				});
			}
			$sc.css({
				opacity: opacity,
				"background-color": "#000000"
			});
			$sc.css({top: 0, display: "block"});
		},
		_closeShadowCover: function(){
			this._shadowOnShow = false;
			$("._confirm_shadow_cover_").css({top: -10000});
		},
		showShadowCover: function(isLoading, opacity, domId){
			var $sc = null;
			this._shadowOnShow = true;
			if($("._shadow_cover_").length > 0){
				$sc = $("._shadow_cover_");
			}else{
				$sc = this._createShadowCover(domId);
				$sc.appendTo(document.body);
			}
			if(isLoading){
				if($sc.find(".loading-bg").length > 0){
					$sc.find(".loading-bg").css("display", "block");
				}else{
					$sc.html("<div class='loading-bg'><div style='height:1.5em;'></div><div class='loading-img'></div><div class='loading-word'>请稍后</div></div>");
					var t = ($(document.body).height() - $sc.children().height()) / 2;
					$sc.children().css("margin-top", t);
				}
			}else{
				if($sc.find(".loading-bg").length > 0){
					$sc.find(".loading-bg").css("display", "none");
				}
			}
			if(opacity){
				$sc.css({
					opacity: opacity,
					"background-color": "#000000"
				});
			}
			var top = 0;
			if(domId){
				top = $("#" + domId).position().top;
			}
			$sc.css({top: top});
		},
		closeShadowCover: function(){
			this._shadowOnShow = false;
			$("._shadow_cover_").css({top: -10000});
		},
		isShadowCoverOnShow: function(){
			return this._shadowOnShow;
		},
		executePageScript: function(funString, frname){
			if(window.pageInfo != "initialization"){
				window.parent.appFrame.executePageScript(funString, frname);
				return;
			}
			if(frname && frname in this._frames){
				var cWindow = $("#" + this._frames[frname]).get(0).contentWindow;
				try{
					cWindow.eval(funString);
				}catch(ex){
					console.log(funString + " is not exist.");
				}
			}else{
				for(var f in this._frames){
					var cWindow = $("#" + this._frames[f]).get(0).contentWindow;
					try{
						cWindow.eval(funString);
					}catch(ex){
						console.log(funString + " is not exist.");
					}
				}
			}
		},
		loadPage: function(){},
		getLoactionHref: function(){
			
		},
		_executeAnimate: function(animate, $fr){
			animate = parseInt(animate);
			switch(animate){
				case 0 :
					setTimeout(function(){
						$fr.css({
							top: 0,
							left: 0,
							"margin-top": 0,
							display: "block"
						});
					}, 300);
				break;
				case 1 :
					$fr.css({
						left : "100%",
						top: 0,
						display: "block"
					}).animate({
						left: 0
					}, this._delay);
				break;
				case 2 :
					$fr.css({
						left: 0,
						top: "100%",
						display: "block"
					}).animate({
						top: 0
					}, this._delay);
				break;
				case 3 :
					setTimeout(function(){
						$fr.css({
							top: 0,
							left: 0,
							"margin-top": -10000
						});
					}, 300);
				break;
				case 4 :
					$fr.css({
						left : 0,
						top: 0,
						display: "block"
					}).animate({
						left: "100%"
					}, this._delay);
				break;
				default:
					$fr.css({
						top: 0,
						left: 0
					}).show();
			}
		},
		_createFrame: function(id, name, url){
			return $("<iframe>", {
				id: id,
				name: name,
				src: url
			}).css({
				position: "absolute",
				width: "100%",
				height: "100%",
				border: "0 none",
				"margin-top": -10000,
				"background-color": "#FFFFFF",
				"z-index": this._frindex ++
			});
		},
		_createConfirm: function(options){
			if(!options.id){
				return;
			}
			var $cf = $("<div>", {
				id: options.id,
				"class": "_confirm_wrapper_" 
			}).css({
				"top": -10000,
				"z-index": this._cfindex
			});
			if(options.header){
				var headerHtml = "<div class='cf_header'>";
				headerHtml += options.header.icon ? "<span class='cf_header_icon'></span>" : "";
				headerHtml += "<span><b class='cf_header_text'>" + options.header.text + "</b></span>";
				$(headerHtml).appendTo($cf);
			}
			if(options.selectList){
				var list = options.selectList;
				var listHtml = "<ul class='cf_select_list'>";
				for(var i = 0; i < list.length; i ++){
					var s = list[i];
					listHtml += "<li data-val='" + s["value"] + "'><span class='cf_list_text'>" + s["text"] + "</span></li>";
				}
				listHtml += "</ul>";
				$(listHtml).appendTo($cf);
			}
			if(options.confirm){
				var confirmHtml = "<div class='cf_confirm'>";
				confirmHtml += "<p>" + options.confirm.text + "</p>";
				confirmHtml += "<div class='cf_button_list'><div class='cf_button_ok'>" + options.confirm.buttonOK.text + "</div><div class='cf_button_no'>" + options.confirm.buttonNO.text + "</div></div>";
				confirmHtml += "</div>";
				confirmHtml += "<input type='button' id='_focustBtn_' style='position:absolute;top:-10000px;'>";
				$(confirmHtml).appendTo($cf);
			}
			
			return $cf;
		},
		_createShadowCover: function(domId, className){
			var height = "100%";
			if(domId){
				height = $("#" + domId).height();
			}
			return $("<div>", {
				"class": className || "_shadow_cover_"
			}).css({
				position: "absolute",
				top: -10000,
				left: 0,
				"z-index": this._scindex,
				width: "100%",
				height: height
			});
		},
		_createTooltip: function(){
			return $("<div>", {
				"class": "_tooltip_"
			}).css({
				top: -10000,
				"z-index": this._ttindex
			}).html("<div class='_tooltip_center_'></div>");
		}
	};
	window.appFrame = frame;
});