$(function(){
	var data = DataObj.getFoodData('http://foodorder.sinaapp.com/Admin/Data/getData?id=1');
	
});

var DataObj = (function () {
	/**
	 * 获取菜品数据
	 */
	this.getFoodData = function (url) {
		$.getJSON(url, function(result) {
			var data = result.data;
			if (data) {
				return data;
			}
			else {
				console.log("getFoodData error!!!");
			}
		});	
	};
});