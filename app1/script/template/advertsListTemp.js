define(function(require, exports, module){
	var config = require('../config');
	var $ = require('../common/zepto-1.1.2');
	var prefix = "";
	var width = $(document.body).width();
	if(width > 630){
		prefix = config.IMG_PREFIX_ADVERT[0];
	}else if(width > 470){
		prefix = config.IMG_PREFIX_ADVERT[1];
	}else if(width > 310){
		prefix = config.IMG_PREFIX_ADVERT[1];
	}
	
	var idx_swipe_template = 
		'<div class="Hbanner_list swipe" id="HbannerList">' + 
			'<div class="swipe-wrap">' + 
			'{{for(var i = 0; i < it.adverts.length; i ++){}}' +
				'<div><a href="javascript:goTo(\'{{=it.adverts[i]["ad_url"]}}\')"><img src="' + config.IMG_HOST + '{{=it.adverts[i]["ad_acc"].path}}/' + prefix + '{{=it.adverts[i]["ad_acc"].name}}"></a></div>' +
			'{{}}}' +
			'</div>' +
		'</div>' + 
		'<div class="cor_bar">' + 
			'<ul id="corBarList">' + 
				'<li class="cor_bar1"></li>' + 
				'<li class="cor_bar2 opac50"></li>' + 
				'<li class="cor_bar3 opac50"></li>' + 
				'<li class="cor_bar4 opac50"></li>' + 
				'<li class="cor_bar5 opac50"></li>' + 
			'</ul>' + 
		'</div>';
	module.exports = idx_swipe_template;
});