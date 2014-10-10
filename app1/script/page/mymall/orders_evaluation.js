define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var config = require('../../config');
	var userId=window.localStorage['userId'];
	var order_id='';
	var store_id='';
	var temp='';
	var seller_service_attitude=0;
	var seller_shipping_speed=0;
	var logistics_speed=0;
	var isAnony=1;
	var goodsNum=0;
	var parme=null;
	var parme1=null;
	//返回
	$('#back').on(appFrame.getEventType("up"),Goback);
	function Goback(){
		$('#submit').get(0).focus();
		appFrame.close();
		window.localStorage.removeItem('evaluation_orderId');
	};
	
	appFrame.loadPage = function(){
		temp='';
		$('#goodsEv').html('');
		order_id=window.localStorage['evaluation_orderId'];
		parme={'id':order_id};
		server.getOrderDetailData(getGoods,parme);
		$('#starOne li').removeClass('qStarOn');
		$('#starTwo li').removeClass('qStarOn');
		$('#starThree li').removeClass('qStarOn');
		seller_service_attitude=0;
		seller_shipping_speed=0;
		logistics_speed=0;
		starOne();
		starTwo();
		starThree();
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		temp='';
		$('#goodsEv').html('');
		order_id=window.localStorage['evaluation_orderId'];
		parme={'id':order_id};
		server.getOrderDetailData(getGoods,parme);
		starOne();
		starTwo();
		starThree();
	};
	
	function getGoods(data){
		if(data.result==1){
			var obj=data.goodsCart;
			store_id=obj[0].store.id;
			goodsNum=obj.length;
			for(var i=0; i<obj.length;i++){
				var imgPath='';
				if(obj[i].goods.goods_main_photo==null){
					imgPath='../../images/cart_null.png';
				}else{
					imgPath=config.IMG_HOST+obj[i].goods.goods_main_photo.path+'/'+obj[i].goods.goods_main_photo.name;
				}
				temp+='<li class="qConBox_9 qPl_1">'+
	            '<img class="fl qImg_1 shadow" src="'+imgPath+'">'+
	            '<ul class="fr clearfix qConBox_11" id="good'+i+'" good-ev="1" good-id="'+obj[i].id+'">'+
	            	'<li class="fl qConBoxOn" on'+appFrame.getEventType("up")+'="GoodsEv(1,'+i+')"><span class="qScore_1 db qScoreOn_1"></span><span class="fon_s10 fon_c13 qtit_1 inter_lang_font" langkey="lang_positive_pad">'+getLangVal("lang_positive_pad")+'</span></li>'+
	            	'<li class="fl txt_1" on'+appFrame.getEventType("up")+'="GoodsEv(0,'+i+')"><span class="qScore_2 db qScoreOn_2"></span><span class="fon_s10 fon_c13 qtit_2 inter_lang_font" langkey="lang_neutral_pad">'+getLangVal("lang_neutral_pad")+'</span></li>'+
	            	'<li class="fl" on'+appFrame.getEventType("up")+'="GoodsEv(-1,'+i+')"><span class="qScore_3 db qScoreOn_3"></span><span class="fon_s10 fon_c13 qtit_3 inter_lang_font" langkey="lang_negative_pad">'+getLangVal("lang_negative_pad")+'</span></li>'+
	            '</ul>'+
	        '</li>'+
	       ' <li>'+
	            '<div class="qBox_6 bg_c1  posi_r qMt_n posi_r">'+
	            '<textarea id="textarea'+i+'" class="qAre_1 rad_3"></textarea>'+
	           ' <span class="posi_a fon_s11 fon_c12 qBox_8 db inter_lang_font"  langkey="lang_total_amount_3">'+getLangVal("lang_msg_words")+'</span>'+
	           ' </div>'+
	        '</li>';
				$('#textarea'+i).on('click', function() {
					$(this).get(0).focus();
				});
			}
			$('#goodsEv').html(temp);
		}
	}

	//星星第一行
	function starOne(){
		var StarOne = $('#starOne').find('li');
		StarOne.each(function(){
			var $this=$(this);
			$this.on(appFrame.getEventType("up"),function(){
				var index=$(this).index();
				$('#starOne li').removeClass('qStarOn');
				for(var i=0;i<index+1;i++){
					StarOne.eq(i).addClass('qStarOn');
				}
				seller_service_attitude=index+1;
			});
		});
	}
	//星星第二行
	function starTwo(){
		var StarTwo = $('#starTwo').find('li');
		StarTwo.each(function(){
			var $this=$(this);
			$this.on(appFrame.getEventType("up"),function(){
				var index=$(this).index();
				$('#starTwo li').removeClass('qStarOn');
				for(var i=0;i<index+1;i++){
					StarTwo.eq(i).addClass('qStarOn');
				}
				seller_shipping_speed=index+1;
			});
		});
	}
	//星星第三行
	function starThree(){
		var StarThree = $('#starThree').find('li');
		StarThree.each(function(){
			var $this=$(this);
			$this.on(appFrame.getEventType("up"),function(){
				var index=$(this).index();
				$('#starThree li').removeClass('qStarOn');
				for(var i=0;i<index+1;i++){
					StarThree.eq(i).addClass('qStarOn');
				}
				logistics_speed=index+1;
			});
		});
	}

	//是否匿名
	$('#isAnony').on(appFrame.getEventType("up"),function(){
		if(isAnony==1){
			$(this).find('div').removeClass('qCheckBoxOn');
			isAnony=0;
		}else{
			$(this).find('div').addClass('qCheckBoxOn');
			isAnony=1;
		}
	});
	$('#submit').on(appFrame.getEventType("up"),function(){
		$(this).get(0).focus();
		parme1={'order_id':order_id,
				'user_id':userId,
				'is_anony':isAnony,
				'store_id':store_id,
				'description_evaluate':seller_service_attitude,
				'service_evaluate':seller_shipping_speed,
				'ship_evaluate':logistics_speed
		};
		for(var i=0;i<goodsNum;i++){
			var good_ev=$('#good'+i).attr('good-ev');
			var good_id=$('#good'+i).attr('good-id');
			var good_value=encodeURIComponent($('#textarea'+i).val());
			parme1['evaluate_buyer_val_'+good_id]=good_ev;
			parme1['evaluate_info_'+good_id]=good_value;
		}
		server.saveOrderEvalute(function(data){
			if(data.result==1){
				appFrame.showTooltip("<span class='inter_lang_font' langkey='lang_rs'>" + getLangVal("lang_rs") + "</span>",1500);
				setTimeout(function(){
					appFrame.close();
					appFrame.close('order_details');
				},1500);
			}
		},parme1);
	});
});
