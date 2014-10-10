define(function(require, exports, module){
	require('../../ui/frame');
	require('../../ui/util');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var doT = require('../../common/doT');
	var iScroll = require('../../common/iscroll');
	var cartListTempl = require('../../template/cartListTemp');
	
	var userId = null, currentPage = 1, pageSize = 10000, ids = [];
	var sumCaller = 0;
	var dataObj = null;
	var g_id=null;
	function getCartList(json){
		var doTtmpl = doT.template(cartListTempl);
		if(json.store.length>0){
			for(var i = 0; i < json.store.length; i ++){
				var s = json.store[i];
				var g = s.gcs;
				var arr = new Array();
				for(var j = 0; j < g.length; j ++){
					if(g[j].goods.goods_status == 0){
						arr.push(g[j]);
					}else{
						arr.reverse();
						arr.push(g[j]);
						arr.reverse();
					}
				}
				json.store[i].gcs = arr.reverse();
			}
			$("#cartList").html(doTtmpl(json));
			$('#checkAllBtn').removeClass('dn');
			$('.settlement').removeClass('dn');
		}else{
			var temp='<div  class="qCartNullBox txt_1"><img class="qCartNullBox_img" src="../../images/cart_null.png"><p class="text_1 mt10"><span class="inter_lang_font fon_s7" langkey="lang_msg_cart">'+getLangVal('lang_msg_cart')+'</span></p></div>'+
			 '<div class="txt_1 pt5"><p class="s_btn1 qCartNullBox_btn dib rad_1" on' + appFrame.getEventType("up") + '="CartGoBuy()"><span class="fon_s6 fon_c20 inter_lang_font" langkey="lang_continue_shipping">'+getLangVal('lang_continue_shipping')+'</span></p></div>';
			$("#cartList").html(temp);
			$('.settlement').addClass('dn');
			$('#checkAllBtn').addClass('dn');
		}
		
		setTimeout(function(){
			$("#cartList span.store_check_btn").off(appFrame.getEventType("up")).on(appFrame.getEventType("up"), function(){
				if(sumCaller != 2){
					sumCaller = 1;
				}
				var t = $("#editMenu li").first().attr("edit-type");
				var $this = $(this).find("img.check_img_btn");
				var id = $this.attr("cid");
				if($this.attr("check-status") == 0 || (t == 1 && sumCaller == 2)){
					$this.attr("check-status", 1);
					$this.attr("src", "../../images/cart_check.png");
					$("#" + id + " img.check_img_list_btn").each(function(){
						if($(this).attr("ocount") == 1)return;
						$(this).attr("check-status", 0).trigger(appFrame.getEventType("up"));
					});
				}else{
					$this.attr("check-status", 0);
					$this.attr("src", "../../images/cart_check_all.png");
					$("#" + id + " img.check_img_list_btn").each(function(){
						if($(this).attr("ocount") == 1)return;
						$(this).attr("check-status", 1).trigger(appFrame.getEventType("up"));
					});
				}
				if(sumCaller != 2){
					sattlement();
				}
				sumCaller = 0;
			});
			$("#cartList div.goods_check_btn").off(appFrame.getEventType("up")).on(appFrame.getEventType("up"), function(e){
				var $this = $(this).find("img.check_img_list_btn");
				if($this.attr("ocount") == 1)return;
				var sid = $(this).attr("sid");
				var id = $this.attr("gid");
				if($this.attr("check-status") == 0){
					$this.attr("check-status", 1);
					$this.attr("src", "../../images/cart_check.png");
					if(ids.indexOf(id) == -1) 
						ids.push(id);
				}else{
					$this.attr("check-status", 0);
					$this.attr("src", "../../images/cart_check_all.png");
					$("#cart_" + $this.attr("box-idx") + " img.check_img_btn").attr("check-status", 0)
						.attr("src", "../../images/cart_check_all.png");
					var idx = ids.indexOf(id);
					ids.splice(idx, 1);
					
					if($("#editMenu li").first().attr("edit-type") == 1)
						$("#editMenu li").first().attr("edit-type", 0).html('<span class="inter_lang_font" langkey="lang_intro34">' + getLangVal("lang_intro34") + '</span>');
				}
				var all_check = true;
				$("#" +sid + " img.check_img_list_btn").each(function(){
					if($(this).attr("check-status") == 0){
						all_check = false;
					}
				});
				if(all_check){
					$("#cart_" + $this.attr("box-idx") + " img.check_img_btn").attr("check-status", 1)
						.attr("src", "../../images/cart_check.png");
				}
				
				if(sumCaller != 2){
					var all_check2 = true;
					$("#cartList img.check_img_btn").each(function(){
						if($(this).attr("check-status") == 0){
							all_check2 = false;
						}
					});
					if(all_check2){
						$("#editMenu li").first().attr("edit-type", 1).html('<span class="inter_lang_font" langkey="lang_inverse_pad">' + getLangVal("lang_inverse_pad") + '</span>');
					}
				}
				
				if(sumCaller == 0){
					sattlement();
				}
			});
			$("#cartList div.goods_delete_btn").off(appFrame.getEventType("up")).on(appFrame.getEventType("up"), function(){
				var sid = $(this).attr("sid");
				var $this = $(this).find("img.delete_img_list_btn");
				var options = {
						id: "deleteCC",
						header: {
							text: '<span class="inter_lang_font" langkey="lang_confirm_del">' + getLangVal("lang_confirm_del") + '</span>'
						},
						confirm: {
							text: '<span class="inter_lang_font" langkey="lang_msg_delete">' + getLangVal("lang_msg_delete") + '</span>',
							buttonOK: {
								text: '<span class="inter_lang_font" langkey="lang_done">' + getLangVal("lang_done") + '</span>'
							},
							buttonNO: {
								text: '<span class="inter_lang_font" langkey="lang_btn_cancel">' + getLangVal("lang_btn_cancel") + '</span>'
							},
							confirmFunction: function(){
								var parma={"gc_id": $this.attr("gid")};
								server.deleteGoodsFromCartData(function(json){
									if(json.result == 1){
										appFrame.loadPage();
										appFrame.closeConfirm();
									}
								},parma);
							},
							cancelFunction: function(){appFrame.closeConfirm();}
						}
					};
				appFrame.showConfirm(options, true);
			});
			$("#cartList span.shadow_4").off(appFrame.getEventType("up")).on(appFrame.getEventType("up"), function(){
				$("#boxIdxVal").val($(this).attr("box-idx"));
				var num = $(this).find("b").html();
				var options = {
						id: "confirmPopup",
						header: {
							text: '<span class="inter_lang_font" langkey="lang_change_quantity">' + getLangVal("lang_change_quantity") + '</span>'
						},
						confirm: {
							text: '<span class="dib qBtn_7 ml2" style="width:3em;"><img src="../../images/cart_minus.png" on' + appFrame.getEventType("up") + '="changeNum(-1)"></span>'+
						        	'<span class="dib ml1"> <span class="bg_c1 qConBox_6 rad_1 mt1 shadow_4 db txt_1"><input class="fon_s10 qInt_1 fon_c23 txt_1" type="text" value="' + num + '" onkeypress="return checkInput()" id="proNumInput"/></span></span>'+
						        	'<span class="dib qBtn_7 ml1" style="width:3em;"><img src="../../images/cart_plus.png" on' + appFrame.getEventType("up") + '="changeNum(1)"></span>',
							buttonOK: {
								text: '<span class="inter_lang_font" langkey="lang_done">' + getLangVal("lang_done") + '</span>'
							},
							buttonNO: {
								text: '<span class="inter_lang_font" langkey="lang_btn_cancel">' + getLangVal("lang_btn_cancel") + '</span>'
							},
							confirmFunction: function(){
								checkInventory($("#boxIdxVal").val());
							},
							cancelFunction: function(){appFrame.closeConfirm();}
						}
					};
					appFrame.showConfirm(options, true);
			});
		}, 300);
		
		appFrame.closeShadowCover();
	}
	
	function checkInventory(boxIdx){
		var $box = $("#ckbox" + boxIdx);
		var $numBox = $("#buyNumBtn" + boxIdx);
		server.getGoodsSpecInfo(function(json){
			if(json["result"] != 1){
				return;
			}
			if($("#proNumInput").val() > json["count"]){
				$("#proNumInput").val(1);
				appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_lable_exceeded_stock'>" + getLangVal("lang_lable_exceeded_stock") + "</span>", 1000);
				return;
			}else if($("#proNumInput").val() == 0){
				$("#proNumInput").val(1);
				appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_intro24'>" + getLangVal("lang_intro24") + "</span>", 1000);
				return;
			}else if($("#proNumInput").val() > 999){
				$("#proNumInput").val(999);
//				appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_lable_exceeded_stock'>" + getLangVal("lang_lable_exceeded_stock") + "</span>", 1000);
				return;
			}
			$box.attr("pcount", $("#proNumInput").val());
			$("#buyNum" + boxIdx).html($("#proNumInput").val());
			$("#pprice" + boxIdx).html(parseFloat($box.attr("pprice")) * parseInt($box.attr("pcount")));
			sattlement();
			appFrame.closeConfirm();
			server.modifyGoodsNum(function(){
				if($box.attr("ocount") == 1){
					$box.attr("ocount", 0);
					$box.attr("src", "../../images/cart_check_all.png").trigger(appFrame.getEventType("up"));
					$("#tip" + boxIdx).remove();
				}
			},{"cartsIds": $numBox.attr("gid"), "counts": $("#proNumInput").val()});
		}, {"goods_id": $box.attr("pid"), "gsp_ids": $box.attr("sidx").replace(/_$/, "").replace(/_/ig,",")});
	}
	
	function sattlement(){
		var count = 0, tprice = 0;
		$("#cartList img.check_img_list_btn").each(function(){
			var $this = $(this);
			if($this.attr("check-status") == 1){
				count ++;
				tprice += parseFloat($this.attr("pprice"))*1000 * parseInt($this.attr("pcount"));
			}
		});
		if(count == 0){
			$("#setBtn").addClass("Settlement_btn_no");
		}else{
			$("#setBtn").removeClass("Settlement_btn_no");
		}
		$("#totalPay").html(tprice/1000);
		$("#totalCount").html("(" + count + ")");
	}
	
	function initPageEvent(){
		$("#checkAllBtn").on(appFrame.getEventType("up"), function(){
			$("#editMenu").toggleClass("dn");
		});
		$("#editMenu li").on(appFrame.getEventType("up"), function(){
			var $this = $(this);
			var type = parseInt($this.attr("edit-type"));
			switch(type){
			case 0:
				sumCaller = 2;
				$this.attr("edit-type", 1);
				$this.html('<span class="inter_lang_font" langkey="lang_inverse_pad">' + getLangVal("lang_inverse_pad") + '</span>');
				$("#cartList span.store_check_btn").attr("check-status", 0).trigger(appFrame.getEventType("up"));
				break;
			case 1:
				sumCaller = 2;
				$this.attr("edit-type", 0);
				$this.html('<span class="inter_lang_font" langkey="lang_intro34">' + getLangVal("lang_intro34") + '</span>');
				$("#cartList span.store_check_btn").attr("check-status", 1).trigger(appFrame.getEventType("up"));
				break;
			case 2:
				if(ids.length <= 0){
					appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_select_goods">' + getLangVal("lang_msg_select_goods") + '</span>', 1000);
					return;
				}
				var options = {
						id: "deleteC",
						header: {
							text: '<span class="inter_lang_font" langkey="lang_confirm_del">' + getLangVal("lang_confirm_del") + '</span>'
						},
						confirm: {
							text: '<span class="inter_lang_font" langkey="lang_msg_delete">' + getLangVal("lang_msg_delete") + '</span>',
							buttonOK: {
								text: '<span class="inter_lang_font" langkey="lang_done">' + getLangVal("lang_done") + '</span>'
							},
							buttonNO: {
								text: '<span class="inter_lang_font" langkey="lang_btn_cancel">' + getLangVal("lang_btn_cancel") + '</span>'
							},
							confirmFunction: function(){
								var parma={"gc_id": ids.join(",")};
								server.deleteGoodsFromCartData(function(json){
									if(json.result == 1){
										appFrame.loadPage();
										appFrame.closeConfirm();
									}
								},parma);
							},
							cancelFunction: function(){appFrame.closeConfirm();}
						}
					};
				appFrame.showConfirm(options, true);
				break;
			}
			$("#editMenu").toggleClass("dn");
			sattlement();
			sumCaller = 0;
		});
		
		$("#setBtn").on(appFrame.getEventType("up"), function(){
			if($(this).hasClass("Settlement_btn_no")){
				return;
			}
			window.localStorage.setItem("cartIdx", ids);
			window.localStorage.removeItem('buyNowParam');
			appFrame.open("confirmOrder", "html/pay/confirm_order.html");
		});
		
		$("#footerMenu li:not(.more_on)").on(appFrame.getEventType("up"), function(){
			var id = $(this).attr("id");
			var name = $(this).attr("id").toSeparte("_");
			var url = "html/" + id.toLowerCase() + "/" + name + ".html";
			if(id == "home"){
				url = "html/" + name + ".html";
			}
			appFrame.open(name, url);
		});
	}
	
	function pageReset(){
		$("#cartList").html("");
	}
	
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		appFrame.showShadowCover(true,null,'cartListWrapper');
		userId = window.localStorage.getItem("userId");
		server.getGoodsCartData(getCartList, {"user_id": userId, "currentPage": currentPage, "pageSize": pageSize});
		initPageEvent();
		ids=[];
	};
	
	appFrame.loadPage = function(){
		$("#setBtn").addClass("Settlement_btn_no");
		$("#totalCount, #totalPay").html(0);
		appFrame.showShadowCover(true,null,'cartListWrapper');
		userId = window.localStorage.getItem("userId");
		pageReset();
		server.getGoodsCartData(getCartList, {"user_id": userId, "currentPage": currentPage, "pageSize": pageSize});
		ids=[];
		$("#editMenu li").first().attr("edit-type", 0).html('<span class="inter_lang_font" langkey="lang_intro34">' + getLangVal("lang_intro34") + '</span>');
	};
});