define(function(require, exports, module){
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var userId='';
	//返回
	var parme= null;
	$('#back').on(appFrame.getEventType("up"),function(){
		appFrame.close();
	});
	
	var checkAddress = false;
	
	//加载页面
	var prame=null;
	appFrame.loadPage = function(){
		userId=window.localStorage['userId'];
		$('#shipAddress').html('');
		prame={'user_id':userId};
		checkAddress = window.localStorage.getItem("checkAddress");
		loadAddress();
	};
	exports.initPage = function(){
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		userId=window.localStorage['userId'];
		$('#shipAddress').html('');
		prame={'user_id':userId};
		checkAddress = window.localStorage.getItem("checkAddress");
		loadAddress();
	};
	//加载收货地址列表
	
	function loadAddress(){
		appFrame.showShadowCover(true,null,'shipAddress');
		server.getAddressListData(getAddressList,prame);
	};
	function getAddressList(data){
		if(data.result==1){
			var obj=data.addrs; 
			var temp='';
			if(obj.length<1){
				temp='<div>'+
						'<p class="No_payment_img txt_1"><img src="../../images/noDeliveryAddress.png"></p>'+
					    '<p class="No_payment_word txt_1">'+'<span class="inter_lang_font" langkey="lang_msg_no_address">' + getLangVal("lang_msg_no_address") + '</span>'+'</p>'+
					'</div>';
				$('#shipAddress').html(temp);//收货地址为空
				appFrame.closeShadowCover();
			}else{
				for(var i=0;i<obj.length;i++){
					temp+='<li' + (obj[i]["isCheck"] == 1?' class="cur"':'') + ' aid="'+obj[i]["id"]+'"><div class="addr_list_word word_all">';
					temp+=obj[i].area_info+'&nbsp';
					if(obj[i].area.areaName){
						temp+=obj[i].area.areaName;
					}
					if(obj[i].area.parent){
						temp+=obj[i].area.parent.areaName;
					}
					temp+='<p>'+obj[i].trueName+'&nbsp&nbsp'+obj[i].mobile+'</p>';
					temp+='</div><div class="addr_list_edit">';
					temp+='<div class="edit_div' + (checkAddress == "true"? " dn" : "") + '" edit-type="del" add-id="'+obj[i].id+'" style="float:right; margin-left:0.5em;"><a>'+"<span class='inter_lang_font' langkey='lang_delete'>" + getLangVal("lang_delete") + "</span>"+'</a>';
		            temp+='<img src="../../images/delectAddress.png"></div>';
		            temp+='<div class="edit_div fr" edit-type="write" add-id=\''+JSON.stringify(obj[i])+'\'><a>'+"<span class='inter_lang_font' langkey='lang_edit'>" + getLangVal("lang_edit") + "</span>"+'</a>';
		            temp+='<img src="../../images/edit_addr.png"></div>';
		            temp+='</div></li>';
				}
				$('#shipAddress').html(temp);
				setTimeout(function(){
					$('#shipAddress div.edit_div').on('click', function(e){
						e = e || window.event;  
					    if(e.stopPropagation) { //阻止冒泡
					        e.stopPropagation();  
					    }
						var $this = $(this);
						editAddress($this.attr("add-id"), $this.attr("edit-type"));
					});
					if(checkAddress){
						$("#shipAddress li").on('click', function(e){
							var $this = $(this);
							$this.siblings(".cur").removeClass("cur");
							$this.addClass("cur");
							server.setDefaultAddress(function(json){
								if(json.result == 1)
									appFrame.close();
							},{"user_id":userId, "id": $this.attr("aid"), "isCheck": 1});
						});
					}else{
						$("#shipAddress li").off('click');
					}
				}, 300);
				appFrame.closeShadowCover();
			}
		}
	};
	function editAddress(id, type){
		if(type == "del"){
			deleteAddress(id);
		}else if(type == "write"){
			writeAddress(id);
		}
	}
	//确认删除
	function deleteAddress(addr_id){
		parme= {'id':addr_id,'user_id':userId};
		var options = {
			id: "abc",
			header: {
				text: '<span class="inter_lang_font" langkey="lang_confirm_del">' + getLangVal("lang_confirm_del") + '</span>'
			},
			confirm: {
				text: '<span class="inter_lang_font" langkey="lang_intro33">' + getLangVal("lang_intro33") + '</span>',
				buttonOK: {
					text: '<span class="inter_lang_font" langkey="lang_done">' + getLangVal("lang_done") + '</span>'
				},
				buttonNO: {
					text: '<span class="inter_lang_font" langkey="lang_btn_cancel">' + getLangVal("lang_btn_cancel") + '</span>'
				},
				confirmFunction: function(){
					server.deleteAddress(function(data){
						if(data.result==1){
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_delete_s">' + getLangVal("lang_msg_delete_s") + '</span>', 1000);
							loadAddress();
						}else{
							appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_delete_f">' + getLangVal("lang_msg_delete_f") + '</span>', 1000);
						}
						appFrame.closeConfirm();
					},parme);
				},
				cancelFunction: function(){
					appFrame.closeConfirm();
				}
			}
		};
		appFrame.showConfirm(options);
	}
    //增加新地址
	$('#addNewAddress').on(appFrame.getEventType("up"),addAddress);
	function addAddress(){
		appFrame.open('shipping_address','html/mymall/shipping_address.html');
	};
	//修改地址
	function writeAddress(jsons){
		window.localStorage['dataAddress']=jsons;
		appFrame.open('shipping_address','html/mymall/shipping_address.html');
	};
});
