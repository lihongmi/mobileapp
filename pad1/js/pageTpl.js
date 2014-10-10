var PageTpl = {
	leftNav : '<#et nav nav>' +
	'<div class="info">\n' +
    '            <div class="face"><img evt-type="getQRCode" src="${nav.imgPath}" alt=""></div>\n' +
    '            <p class="name">${nav.name}</p>\n' +
    '            <p class="time">#L{营业时间}：</p>\n' +
    '            <p class="time">${nav.time}</p>\n' +
    '            <p class="address"><#if (!!nav.address)>{nav.address}</#if></p>\n' +
    '        </div>\n' +
    '        <nav>\n' +
    '            <#list nav.category as list>' +
	'               <a href="javascript:void(0);" evt-type="showMenuList" evt-data="id=${list.id}&_i=${list._i}">${list.name}</a>' +
	'            </#list>\n' +
    '        </nav>\n' +
	'<#if (nav.category.length>8)>' +
    '		 <div class="back" style="bottom:50px;">\n' +
    '		 <a href="javascript:void(0);" class="btn11" evt-type="showMore">#L{更多分类}</a>\n' +
    '		 </div>\n' +
	'</#if>'+
    '		 <div class="back">\n' +
    '		 <a href="javascript:void(0);" class="btn11" evt-type="goHome" >#L{返回首页}</a>\n' +
    '		 </div>\n'
    ,
	menuList: '<#et menuList list>' +
		'<div class="coverList">' +
		'<#list list as data>' +
		'           <div evt-type="showDetail" evt-data="category=#category#&id=${data.id}&type=1" class="cont${data.imgType||data.type}">\n' +
		'                <div class="img"><img src="${data.type==1?data.bigimg:data.image}" alt="">\n' +
		'                </div>\n' +
		'                <div class="info">\n' +
		'                    <em>${data.name}</em><#if (data.type)><i class="icon_type${data.type}"></i></#if><#if (data.memberprice!==null)><span class="fr color1">#L{会员价}:&yen;${data.memberprice}</span></#if>\n' +
		'                    <p class="color2">&yen;${data.price}</p>\n' +
		'                </div>\n' +
		'            </div>' +
		'</#list>' +
		'</div>',
	menuListCombo: '<#et menuList list>' +
			'<div class="coverList">' +
			'<#list list as data>' +
			'           <div evt-type="showDetail" evt-data="category=#category#&id=${data.id}&type=3" class="cont1">\n' +
			'                <div class="img"><img src="${data.image}" alt="">\n' +
			'                </div>\n' +
			'                <div class="info">\n' +
			'                    <em>${data.name}</em><#if (data.type)><i class="icon_type${data.type}"></i></#if><#if (data.memberprice!==null)><span class="fr color1">#L{会员价}:&yen;${data.memberprice}</span></#if>\n' +
			'                    <p class="color2">&yen;${data.price}</p>\n' +
			'                </div>\n' +
			'            </div>' +
			'</#list>' +
			'</div>',
	menuList2 : '<#et menuList list>' +
			'<ul class="list0">\n' +
			'<#list list as data>' +
			'            <li evt-type="showDetail" evt-data="category=#category#&type=${Base.getCategory().iscombo == \"1\" ? 3 : 1}&id=${data.id}">\n' +
			'                <div class="img"><img src="${data.thumbimage}" alt="">\n' +
			'                </div>\n' +
			'                <div class="info">\n' +
			'                    <em>${data.name}</em><span>&yen;${data.price}#L{元}</span>\n' +
			'                </div>\n' +
			'                   <div class="subinfo">\n' +
			'                       <p class="color1"><#if (data.memberprice!==null)>#L{会员价}:&yen;${data.memberprice}#L{元}</#if></p>\n' +
			'                   </div>\n' +
			'            </li>' +
			'</#list>' +
			'</ul>',
	orderConfirmPage : '<#et orderConfirmList data>' +
				'<tbody js-node="orderConfirmList">' +
				'</tbody>' +
				'            <tr>\n' +
				'                <td colspan="4" class="txl">\n' +
				'                    <em>#L{总价}：</em>\n' +
				'                    <span class="color1">${data.total}#L{元}</span>\n' +
				'                </td>\n' +
				'            </tr>',
	indexLeftNav :'<#et leftNav leftNav>' +
		'<#if (leftNav.en=="1")><a href="javascript:void(0);" evt-type="changeLang" evt-data="en=${leftNav.langData.en}">${leftNav.langData.txt}</a></#if>' +
		'<#list leftNav.service as data>' +
			'<a href="javascript:void(0);" evt-type="service" evt-data="type=4&msg=${data.name}">${data.name}</a>' +
			'</#list>',
	orderConfirmList : '<#et orderConfirmList data>' +
			'<#list data as orderItem>' +
			'           <tr>\n' +
			'                <td class="txl">${orderItem.index}.${orderItem.name}</td>\n' +
			'                <td>${orderItem.price}#L{元/${orderItem.unit||"份"}}</td>\n' +
			'                <td>${orderItem.count}</td>\n' +
			'                <td>' +
			'                   <#if (orderItem.tastes.length>0)><#list orderItem.tastes as taste><#if (taste)><span class="btn10">${taste}</span></#if></#list></#if>' +
			'               </td>\n' +
			'                <td><span class="btn7">#L{已点}</span></td>\n' +
			'            </tr>\n' +
			'</#list>',
	orderConfirmPageBase : '<div class="title">#L{已点菜品查询}</div>\n' +
	                '<table class="table1">\n' +
	                '    <thead>\n' +
	                '    <tr>\n' +
	                '        <th class="txl">#L{菜品}</th>\n' +
	                '        <th>#L{单价}</th>\n' +
	                '        <th>#L{数量}</th>\n' +
	                '        <th>#L{口味}</th>\n' +
	                '        <th>#L{操作}</th>\n' +
	                '    </tr>\n' +
	                '    </thead>\n' +
	                '    <tbody js-node="orderConfirmList">\n' +
	                '    </tbody>\n' +
	                '    <tfoot>\n' +
	                '    <tr js-node="totalContainer">\n' +
	                '        <td colspan="5" class="txl">\n' +
	                '            <em>#L{总价}：</em>\n' +
	                '            <span class="color1"><em js-node="total"></em>#L{元}</span>\n' +
	                '        </td>\n' +
	                '    </tr>\n' +
	                '    </tfoot>\n' +
	                '</table>\n' +
	                '<div class="txc" style="margin-top: 10px;">\n' +
	                '    <div class="pageBtn" js-node="pageBtn"><a href="javascript:void(0);" js-node="prev" evt-type="prev">#L{上一页}</a><a\n' +
	                '            href="javascript:void(0);" js-node="next" evt-type="next">#L{下一页}</a></div>\n' +
	                '</div>\n' +
	                '<div class="btn_cont txc">\n' +
	                '    <a href="javascript:void(0);" target="_self" evt-type="addFood" class="btn4">#L{加菜}</a>\n' +
	                '           <span class="btn5 miniLayer">\n' +
	                '               <a href="javascript:void(0);" evt-type="callService">#L{呼叫服务}&or;</a>\n' +
	                '                <span class="mini" style="display: none;">\n' +
	                '                    <a href="javascript:void(0);" evt-type="service" evt-data="type=4&msg=#L{人工服务}">#L{人工服务}</a>\n' +
	                '                    <a href="javascript:void(0);" evt-type="service" evt-data="type=1&msg=#L{添加茶水}">#L{添加茶水}</a>\n' +
	                '                    <a href="javascript:void(0);" evt-type="service" evt-data="type=3&msg=#L{增加餐位}">#L{增加餐位}</a>\n' +
	                '                    <a href="javascript:void(0);" evt-type="pay" evt-data="type=0&msg=#L{结账付款}">#L{结账付款}</a>\n' +
	                '                </span>\n' +
	                '            </span>\n' +
	                '\n' +
	                '    <p class="info" js-node="info"></p>\n' +
	                '</div>',
	kaitaiInfo : '<#et kaitaiInfo data>' +
			'<em>#L{开台信息}</em>（#L{房台号}：${data.tid}  #L{客人数}：${data.count}）',
	indexBgTpl:'<#et bginfo data>' +
		'<div class="menu1">\n' +
		'    <a href="javascript:void(0);" evt-type="goMenu" target="_self" class="btn20">#L{浏览菜谱}</a>\n' +
		'    <a href="javascript:void(0);" evt-type="service" evt-data="type=yidian" target="_self"\n' +
		'       class="btn20">#L{查看已点}</a>\n' +
		'    <a href="javascript:void(0);" evt-type="pay" target="_self" class="btn20">#L{结账付款}</a>\n' +
		'    <a href="javascript:void(0);" id="service" evt-type="serviceCall" evt-data="open=1" class="btn20">#L{呼叫/追加服务}&nbsp;<i\n' +
		'            class="arrow">&gt;</i></a>\n' +
		'    <div class="pop">\n' +
		'    </div>\n' +
		'</div>\n' +
		'<div class="menu2">\n' +
		'    <a href="javascript:void(0);" evt-type="clearData" class="btn11">#L{叫出租车}</a>\n' +
		'    <a href="javascript:void(0);" evt-type="clearData2" class="btn11">#L{呼叫代驾}</a>\n' +
		'</div>',
	/*//首页广告位模版
//	indexAD1:'<div id="AD_login_l_c1_r1" class="AD-480-360"><a href=""><img src="../Images/temp/AD-480-360.png" alt=""></a></div>',
	indexAD1:'<div id="AD_login_l_c1_r1" class="AD-480-360"><video id="example_video_1" class="video-js vjs-default-skin" src="http://video-js.zencoder.com/oceans-clip.webm"  width="480" height="360" autoplay="true"></video></div>',
	indexAD2:'<div id="AD_login_l_c1_r2" class="AD-480-200"><a href=""><img src="../Images/temp/AD-480-200.png" alt=""></a></div>',
	indexAD3:'<div id="AD_login_b_r1_c1" class="AD-240-60"><a href=""><img src="../Images/temp/AD-240-60.png" alt=""></a></div>',
	indexAD4:'<div id="AD_login_r_c1_r1" class="AD-240-360"><a href=""><img src="../Images/temp/AD-240-360.png" alt=""></a></div>',
	indexAD5:'<div id="AD_login_r_c1_r2" class="AD-240-360"><a href=""><img src="../Images/temp/AD-240-360.png" alt=""></a></div>',
	//首页广告位模版
	listAD1:'<div id="AD_list_b_r1_c1" class="AD-420-60"><a href=""><img src="../Images/temp/AD-420-60.png" alt=""></a></div>',
	listAD2:'<div id="AD_list_b_r1_c2" class="AD-420-60"><a href=""><img src="../Images/temp/AD-420-60.png" alt=""></a></div>',
	listAD3:'<div id="AD_side_b_r1_c1" class="AD-240-60"><a href=""><img src="../Images/temp/AD-240-60.png" alt=""></a></div>',
	//首页广告位模版
	confirmAD1:'<div id="AD_confirm_b_r1_c1" class="AD-240-160"><a href=""><img src="../Images/temp/AD-240-160.png" alt=""></a></div>',
	confirmAD2:'<div id="AD_confirm_b_r1_c2" class="AD-240-60"><a href=""><img src="../Images/temp/AD-240-60.png" alt=""></a></div>',
	confirmAD3:'<div id="AD_confirm_b_r1_c3" class="AD-240-160"><a href=""><img src="../Images/temp/AD-240-160.png" alt=""></a></div>'*/
	//首页广告位模版
	//	indexAD1:'<div id="AD_login_l_c1_r1" class="AD-480-360"><a href=""><img src="../Images/temp/AD-480-360.png" alt=""></a></div>',
	indexAD1:'<div id="AD_login_l_c1_r1" class="AD-480-360">$HTML$</div>',
	indexAD2:'<div id="AD_login_l_c1_r2" class="AD-480-200">$HTML$</div>',
	indexAD3:'<div id="AD_login_b_r1_c1" class="AD-240-60">$HTML$</div>',
	indexAD4:'<div id="AD_login_r_c1_r1" class="AD-240-360">$HTML$</div>',
	indexAD5:'<div id="AD_login_r_c1_r2" class="AD-240-360">$HTML$</div>',
	//首页广告位模版
	listAD1:'<div id="AD_list_b_r1_c1" class="AD-420-60">$HTML$</div>',
	listAD2:'<div id="AD_list_b_r1_c2" class="AD-420-60">$HTML$</div>',
	listAD3:'<div id="AD_side_b_r1_c1" class="AD-240-60">$HTML$</div>',
	//首页广告位模版
	confirmAD1:'<div id="AD_confirm_b_r1_c1" class="AD-240-160">$HTML$</div>',
	confirmAD2:'<div id="AD_confirm_b_r1_c2" class="AD-240-60">$HTML$</div>',
	confirmAD3:'<div id="AD_confirm_b_r1_c3" class="AD-240-160">$HTML$</div>',
	bottomAD:'<div class="AD-wrap"><div class="cell">$HTML$</div></div>'
};
