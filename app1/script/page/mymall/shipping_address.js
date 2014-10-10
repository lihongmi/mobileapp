define(function(require, exports, module) {
	require('../../ui/frame');
	require('../../common/common');
	var $ = require('../../common/zepto-1.1.2');
	var server = require('../../server/server');
	var areaObj = require('../../area');

	var userId = null;
	var dataAdd = null;
	var reg = /^\d{9,11}$/;
	var mobilePhone = false;
	var firstId = null;
	var areaId = null;
	var area = false;
	var datas = null;
	// 返回
	$('#back').on(appFrame.getEventType("up"), function() {
		appFrame.close();
	});
	// 重新加载
	appFrame.loadPage = function() {
		dataAdd = null;
		area = false;
		mobilePhone = false;
		userId = window.localStorage['userId'];
		$('#trueName').get(0).focus();
		var provinceTemp = '';
		for (var i = 0; i < areaObj.lev1Array.length; i++) {
			provinceTemp += '<option value="' + areaObj.lev1Array[i][0] + '">'
					+ areaObj.lev1Array[i][1] + '</option>';
		}
		$('#provinceList').html('<option id="no" value="0">' + getLangVal("lang_pc") + '</option>' + provinceTemp);
		$('#cityList').html('<option id="noTwo" value="1">' + getLangVal("lang_pc") + '</option>');
		addOrChange();
	};
	exports.initPage = function() {
		var lang = window.localStorage.getItem("lang");
		changeInterLang(lang);
		$('#trueName').get(0).focus();
		userId = window.localStorage['userId'];
		// 加载省
		var provinceTemp = '';
		for (var i = 0; i < areaObj.lev1Array.length; i++) {
			provinceTemp += '<option value="' + areaObj.lev1Array[i][0] + '">'
					+ areaObj.lev1Array[i][1] + '</option>';
		}
		$('#provinceList').html('<option id="no" value="0">' + getLangVal("lang_pc") + '</option>' + provinceTemp);
		$('#cityList').html('<option id="noTwo" value="1">' + getLangVal("lang_pc") + '</option>');
		addOrChange();
		// 加载市
		$('#provinceList').on('change', function() {
			secondAdd($(this).val());
		});

		// 返回三级id
		$('#cityList').on('change', function() {
			areaId = $(this).val();
		});
	};
	// 判断新增or修改
	function addOrChange() {
		if (window.localStorage['dataAddress']) {// 修改地址
			dataAdd = window.localStorage['dataAddress'];
			window.localStorage.removeItem('dataAddress');
			dataAdd = eval('(' + dataAdd + ')');
			var trueName = dataAdd.trueName, mobile = dataAdd.mobile, areaCityId = dataAdd.area.id;
			if(!dataAdd.area.parent){
				 var areaProvinceId = dataAdd.area.id;
			}else{
				 var areaProvinceId = dataAdd.area.parent.id;
			}
			areaId = areaCityId;
			var address = dataAdd.area_info;
			$('#trueName').val(trueName);
			$('#mobile').val(mobile);
			$('#provinceList').val(areaProvinceId);
			secondAdd($('#provinceList').val());
			$('#cityList').val(areaCityId);
			$('#address').val(address);
		} else {// 新增地址
			$('#trueName').val('');
			$('#mobile').val('');
			$('#address').val('');
			$('#provinceList').val('0');
			$('#cityList').val('1');
		}
	}
	function secondAdd(firstId) {
		var cityTemp = '';
		if (areaObj.lev2Object[firstId]) {
			var city = areaObj.lev2Object[firstId];
			for (var i = 0; i < city.length; i++) {
				cityTemp += '<option value="' + city[i][0] + '">' + city[i][1]
						+ '</option>';
			}
		} else {
			if(firstId != "no")
				var option=document.getElementById('provinceList');
				var optionVal = option.options[option.selectedIndex].text;
				cityTemp = '<option id="noTwo" value='+firstId+'>' + optionVal
					+ '</option>';
		}
		$('#cityList').html('<option id="noTwo" value="1">'+'<span class="inter_lang_font" langkey="lang_pc">' + getLangVal("lang_pc") + '</span>'+'</option>' + cityTemp);
	}
	// 编辑完成
	$('#addOver').on(appFrame.getEventType("up"), function() {
		var trueName = $('#trueName').val(), mobile = $('#mobile').val(), area = false, address = $('#address').val();
		if (areaId != 'noTwo' && areaId != null ) {
			area = true;
		}
		if (reg.test(mobile)) {
			mobilePhone = true;
		}
		if (trueName != '' && area && address != '' && mobilePhone) {
			if (dataAdd) {
				datas = {
					"id" : dataAdd.id,
					"trueName" : trueName,
					"area_id" : areaId,
					"area_info" : address,
					"mobile" : mobile,
					"isCheck" : 1,
					'user_id' : userId
				};
				toEditAddress(datas);// 修改地址
			} else {
				datas = {
					"trueName" : trueName,
					"area_id" : areaId,
					"area_info" : address,
					"mobile" : mobile,
					"isCheck" : 1,
					'user_id' : userId
				};
				toAddAddress(datas);// 新增地址
			}
		} else {
			appFrame.showTooltip('<span class="inter_lang_font" langkey="lang_msg_infor_incomplete">'
									+ getLangVal("lang_msg_infor_incomplete")
									+ '</span>', 1500);
		}
	});
	function toAddAddress(data) {
		server.addAddress(function(data) {
			if (data.result == 1) {
				appFrame.close();
			}
		}, datas);
	}
	function toEditAddress(data) {
		server.editAddress(function(data) {
			if (data.result == 1) {
				appFrame.close();
			}
		}, datas);
	}
});
