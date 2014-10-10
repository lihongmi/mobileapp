var LayerTpl = {
	detail   : '<#et detail data>' +
			'       <div class="flexslider">' +
			'       <ul class="slides">' +
			'       <li>' +
			'       <div class="food_cont">' +
			'            <div class="title"><strong><span>${data.name}</span></strong><b class="color1">&yen;${data.price}#L{元/${data.unit||"份"}}</b><#if (data.memberprice!==null)><b class="color1">#L{会员价}:&yen;${data.memberprice}#L{元/${data.unit||"份"}}</b></#if>' +
			'               <#if (data.combo)><div class="fr"><a href="javascript:void(0);" evt-type="showDetail" evt-data="category=#category#&id=${data.comboId}&type=3&count=${data.count}&tastes=${data.tastes}&choose=${data.choose}" class="btn5">#L{返回情侣套餐}</a></div></#if>' +
			'            </div>' +
			'            <div class="info big_img">' +
			'                <div class="img"><img src="${data.image}" alt=""></div>' +
			'                <div class="text">' +
			'<#if (data.desc)>' +
			'<#list data.desc as list>' +
			'<#if (list.title && list.context)>' +
			'                    <b>${list.title}：</b>' +
			'                    <p>${list.context}</p>' +
			'</#if>' +
			'</#list></#if>' +
			'                </div>' +
			'           <div class="AD-block">${data.adHtml}</div>' +
			'            </div>' +
			'            <div class="subinfo">' +
			'                <dl class="list3 list_bottom">' +
			'                    <dt>#L{数量}：</dt>' +
			'                    <dd>' +
			'                        <div class="numbers">' +
			'                            <a href="javascript:void(0);" evt-type="delCount" evt-data="category=${data.category}&id=${data.id}">&minus;</a>' +
			'                            <input type="number" value="1" disabled="disabled">' +
			'                            <a href="javascript:void(0);" evt-type="addCount" evt-data="category=${data.category}&id=${data.id}">+</a>' +
			'                        </div>' +
			'                    </dd>' +
			'                </dl>' +
			'<#if (data.taste && data.taste.length>0)>' +
			'                <dl class="list3 list_top">' +
			'                    <dt>#L{口味}：</dt>' +
			'                    <dd js-node="taste">' +
			'<#list data.taste as list>' +
			'<a href="javascript:void(0);" evt-type="tasteTag" evt-data="category=${data.category}&id=${data.id}" class="btn10">${list}<i></i></a>' +
			'</#list>' +
			'</dd>' +
			'                </dl>' +
			'</#if>' +
			'            </div>' +
			'            <div class="btn_cont txr">' +
			'                <a href="javascript:void(0);" evt-type="saveItem" evt-data="category=${data.category}&id=${data.id}<#if (data.combo)>&combo=1&comboId=${data.comboId}</#if>" class="btn4">#L{我确定要点这个菜}</a>' +
			'            </div>' +
			'            </div>' +
			'            </li>' +
			'            </ul>' +			
			'        </div>',
	detailCombo   : '<#et detail data>' +
			'       <div class="food_cont">' +
			'            <div class="title"><strong>[<span>${data.name}</span>]</strong><b class="color1">&yen;${data.price}#L{元/${data.unit||"份"}}</b><#if (data.memberprice!==null)><b class="color1">#L{会员价}:&yen;${data.memberprice}#L{元/${data.unit||"份"}}</b></#if></div>' +
			'           <div class="info">\n' +
			'           <div class="setmeal" js-node="tp1">\n' +
			'           <table class="table1 setmeal_list">\n' +
            '                <caption><b>#L{套餐组成}：</b></caption>\n' +
            '                <tbody>\n' +
			'<#list data.list as list>' +
            '                <tr>\n' +
            '                    <td><a class="btnChoose cur" evt-type="chooseItem" evt-data="i=${list.index}&tp=2&category=#category#&comboId=${data.id}&id=${list.id}&type=1&combo=1"><i></i><img src="${list.image}" alt=""></a></td>\n' +
            '                    <td evt-type="showDetail" evt-data="category=#category#&comboId=${data.id}&id=${list.id}&type=1&combo=1">${list.index}.${list.name}</td>\n' +
            '                    <td evt-type="showDetail" evt-data="category=#category#&comboId=${data.id}&id=${list.id}&type=1&combo=1">${list.count||1}#L{${data.unit||"份"}}</td>\n' +
            '                    <td evt-type="showDetail" evt-data="category=#category#&comboId=${data.id}&id=${list.id}&type=1&combo=1">#L{单价}:${list.price}#L{元}</td>\n' +
            '                </tr>\n' +
			'</#list>' +
            '                </tbody>\n' +
            '            </table>' +
			'</div>' +
			'           <div class="setmeal" js-node="tp2">\n' +
			'           <table class="table1 setmeal_list">\n' +
            '                <caption><b>#L{套餐组成}：</b></caption>\n' +
            '                <tbody>\n' +
			'<#list data.list2 as list>' +
			'<#if (list)>' +
            '                <tr>\n' +
            '                    <td><a class="btnChoose" evt-type="chooseItem" evt-data="i=${list.index}&tp=1&category=#category#&comboId=${data.id}&id=${list.id}&type=1&combo=1"><i></i><img src="${list.image}" alt=""></a></td>\n' +
            '                    <td evt-type="showDetail" evt-data="category=#category#&comboId=${data.id}&id=${list.id}&l=2&type=1&combo=1">${list.name}</td>\n' +
            '                    <td evt-type="showDetail" evt-data="category=#category#&comboId=${data.id}&id=${list.id}&l=2&type=1&combo=1">${list.count||1}#L{${data.unit||"份"}}</td>\n' +
            '                    <td evt-type="showDetail" evt-data="category=#category#&comboId=${data.id}&id=${list.id}&l=2&type=1&combo=1">#L{单价}:${list.price}#L{元}</td>\n' +
            '                </tr>\n' +
		'<#else>' +
		'<tr><td colspan="4">&nbsp;</td></tr>' +
		'</#if>' +
			'</#list>' +
            '                </tbody>\n' +
            '            </table>' +
			'</div>' +
			/*'<div class="text">' +
			'<#if (data.desc)>' +
			'<#list data.desc as list>' +
			'<#if (list.title && list.context)>' +
			'                    <b>${list.title}：</b>' +
			'                    <p>${list.context}</p>' +
			'</#if>' +
			'</#list></#if>' +
			'</div>' +*/
			'<div class="AD-block">${data.adHtml}</div>' +
			'</div>' +
			'            <div class="subinfo">' +
			'                <dl class="list3 list_bottom">' +
			'                    <dt>#L{数量}：</dt>' +
			'                    <dd>' +
			'                        <div class="numbers">' +
			'                            <a href="javascript:void(0);" evt-type="delCount" evt-data="category=${data.category}&id=${data.id}">&minus;</a>' +
			'                            <input type="number" value="1" disabled="disabled">' +
			'                            <a href="javascript:void(0);" evt-type="addCount" evt-data="category=${data.category}&id=${data.id}">+</a>' +
			'                        </div>' +
			'                    </dd>' +
			'                </dl>' +
			'<#if (data.taste && data.taste.length>0)>' +
			'                <dl class="list3 list_top">' +
			'                    <dt>#L{口味}：</dt>' +
			'                    <dd js-node="taste">' +
			'<#list data.taste as list>' +
			'<a href="javascript:void(0);" evt-type="tasteTag" evt-data="category=${data.category}&id=${data.id}" class="btn10">${list}<i></i></a>' +
			'</#list>' +
			'</dd>' +
			'                </dl>' +
			'</#if>' +
			'            </div>' +
			'            <div class="btn_cont txr">' +
			'                <a href="javascript:void(0);" evt-type="saveItem" evt-data="category=${data.category}&id=${data.id}" class="btn4">#L{我确定要点这个菜}</a>' +
			'            </div>' +
			'        </div>',
	kaitai   : ' <#et detail data>' +
		'       <div class="login_cont">\n' +
		'            <div class="title"><strong>开台信息</strong></div>\n' +
		'            <dl class="list4">\n' +
		'                <dt>房台号：</dt>\n' +
		'                <dd><input evt-type="inputGo" <#if (data.tablenum == "1")>type="number"<#else>type="text"</#if> value="${data.tid}" class="input_text" name="tid"></dd>\n' +
		'			</dl>\n' +
		'  			<dl class="list4">\n' +
		'                <dt>客人数：</dt>\n' +
		'                <dd><input evt-type="inputGo" type="number" name="count" class="input_text"></dd>\n' +
		'			</dl>\n' +
		'  			<dl class="list4">\n' +
		'                <dt>员工号：</dt>\n' +
		'                <dd><input evt-type="inputGo" evt-data="sub=1" <#if (data.staffnum == "1")>type="number"<#else>type="text"</#if> class="input_text" value="${data.eid}" name="eid"></dd>\n' +
		'            </dl>\n' +
		'            <div class="btn_cont txc">\n' +
		'                <a href="javascript:void(0);" evt-type="kaitai" class="btn4">开台</a>\n' +
		'            </div>\n' +
		'        </div>\n',
	yidian: '<#et yidian data>' +
		'       <div class="order_cont">\n' +
		'            <div class="title"><strong>#L{已点菜品查询}</strong></div>\n' +
		'            <table class="table1">\n' +
		'				<thead>\n' +
		'                <tr>\n' +
		'                    <th class="txl">#L{菜品}</th>\n' +
		'                    <th>#L{单价}</th>\n' +
		'                    <th>#L{数量}</th>\n' +
		'                    <th>#L{口味}</th>\n' +
		'                    <th>#L{操作}</th>\n' +
		'                </tr>' +
		'				</thead>\n' +
		'<tbody js-node="list">' +
		'</tbody>' +
		'				<tfoot> \n' +
		'                <tr<#if (data.flag=="0")> style="display: none;"</#if>>\n' +
		'                    <td colspan="5" class="txl">\n' +
		'                        <em>#L{总价}：</em>\n' +
		'                        <span class="color1"><em js-node="total">${data.total}</em>#L{元}</span>\n' +
		'                    </td>\n' +
		'                </tr>\n' +
		'				</tfoot> \n' +
		'            </table>\n' +
		'            <div class="txc">\n' +
		'                <div class="pageBtn"><a js-node="prev" evt-type="prevYidianLayer" href="javascript:void(0);">#L{上一页}</a><a js-node="next" evt-type="nextYidianLayer" href="javascript:void(0);">#L{下一页}</a></div>\n' +
		'            </div>\n' +
		'            <div class="btn_cont txc">\n' +
		'                <a href="javascript:void(0);" evt-type="commit" class="btn4">#L{确定点这么多，通知服务员}</a>\n' +
		'            </div>\n' +
		'        </div>',
	yidianList :'<#et yidian yidian>' +
		'<#list yidian as data>' +
					'                <tr>\n' +
					'                    <td class="txl">${data.index}.${data.name}</td>\n' +
					'                    <td>${data.price}#L{元/${data.unit||"份"}}</td>\n' +
					'                    <td>\n' +
					'                        <div class="numbers" style="margin: auto;">\n' +
					//'                            <a href="javascript:void(0);" evt-type="delCount" evt-data="type=1&category=${data.category}&id=${data.id}&price=${data.price}">&minus;</a>\n' +
					'                            <input type="number" style="width:50px;" evt-type="countInput" evt-data="type=1&category=${data.category}&id=${data.id}&price=${data.price}&tastes=${data.tastes.join(\',\')}" value="${data.count}" >\n' +
					//'                            <a href="javascript:void(0);" evt-type="addCount" evt-data="type=1&category=${data.category}&id=${data.id}&price=${data.price}">+</a>\n' +
					'                        </div>\n' +
					'                    </td>\n' +
					'                    <td>\n' +
					'                        <div class="numbers" style="margin: auto;">\n' +
					'                            <input type="text" style="width:200px;" evt-type="tasteInput" evt-data="type=1&category=${data.category}&id=${data.id}&price=${data.price}&tastes=${data.tastes.join(\',\')}" value="${data.tastes.join(\',\')}" >\n' +
					'                        </div>\n' +
					'                    </td>\n' +
//					'                    <td><div class="cont1"><#list data.tastes as tastes><#if (tastes)><span class="btn10">${tastes}</span></#if></#list></div></td>\n' +
					'                    <td><a href="javascript:void(0);" evt-type="delYidian" evt-data="index=${data.index}" class="btn6">#L{不点了}</a></td>\n' +
					'                </tr>' +
					'</#list>\n',
	commit   : '<#et commitLayer commitLayer>' +
		'       <div class="order_cont">\n' +
		'            <div class="title"><strong>#L{已点菜品查询}</strong></div>\n' +
		'            <div class="list_cont">' +
		'               <table class="table1">\n' +
		'				<thead> \n' +
		'                <tr>\n' +
		'                    <th class="txl">#L{菜品}</th>\n' +
		'                    <th>#L{单价}</th>\n' +
		'                    <th>#L{数量}</th>\n' +
		'                    <th>#L{口味}</th>\n' +
		'                </tr>\n' +
		'				</thead> \n' +
		'           <tbody js-node="commitList"></tbody>'+
		'				<tfoot> \n' +
		'                <tr<#if (commitLayer.flag=="0")> style="display: none;"</#if>>\n' +
		'                    <td colspan="4" class="txl">\n' +
		'                        <em>#L{总价}：</em>\n' +
		'                        <span class="color1">${commitLayer.total}#L{元}</span>&nbsp;<input type="text" js-node="remark" placeholder="请输入10个字以内的备注信息" style="width:200px;"/>\n' +
		'                    </td>\n' +
		'                </tr>\n' +
		'				</tfoot> \n' +
		'            </table>\n' +
		'           </div>' +
		'            <div class="pageBtn" js-node="pageBtn"><a js-node="prev" evt-data="type=1" evt-type="prev" href="javascript:void(0);">#L{上一页}</a><a evt-type="next" js-node="next" evt-data="type=1" href="javascript:void(0);">#L{下一页}</a></div>\n' +
		'            <div class="notice1">\n' +
		'                <p>#L{请再次确认所点菜品，本次提交后将不可更改！}</p> \n' +
		'            </div>\n' +
		'            <div class="btn_cont txc">\n' +
		'                <a href="javascript:void(0);" target="_self" evt-type="submit" class="btn4"><i class="icon_conform"></i>#L{确定}</a>\n' +
		'                <a href="javascript:void(0);" evt-type="close" class="btn5">#L{我再看看}</a>\n' +
		'            </div>\n' +
		'        </div>\n',
	commitList : '<#et commitLayerList commitLayerList>' +
		'<#list commitLayerList as data>' +
				'                <tr>\n' +
				'                    <td class="txl"><p>${data.index}.${data.name}</p></td>\n' +
				'                    <td>${data.price}#L{元/${data.unit||"份"}}</td>\n' +
				'                    <td>${data.count}</td>\n' +
				'                    <td><div class="cont1" style="width: 100%;margin: auto;"><#if (data.tastes.length>0)><#list data.tastes as tastes><#if (tastes)><span class="btn10">${tastes}</span></#if></#list></#if></div></td>\n' +
				'                </tr>\n' +
				'</#list>' ,
	menuOrder: '<div class="menuOrder" is-show="0">\n' +
		'        <a href="javascript:void(0);" evt-type="rightBtn" class="info">#L{已点菜品}<b js-node="count"></b><i class="icon_arrow"></i></a>\n' +
		'\n' +
		'        <div class="list2">\n' +
		'            <ul  js-node="yidianList">\n' +
		'            </ul>\n' +
		'        </div>\n' +
		'<div class="AD-block" id="listADLayer"></div>' +
		'        <div class="pageCont">\n' +
		'            <div class="pageBtn"><a js-node="prev" evt-type="prev" href="javascript:void(0);">#L{上一页}</a><a evt-type="next" js-node="next" href="javascript:void(0);">#L{下一页}</a></div>\n' +
		'            <a href="javascript:void(0);" evt-type="goOn" class="btn8">#L{继续点菜}</a>\n' +
		'            <a href="javascript:void(0);" evt-type="yidian" class="btn4">#L{就点这么多}</a>\n' +
		'        </div>\n' +
		'    </div>',
	menuYidian : '<#et detail menuYidian>' +
		'<#list menuYidian as data>' +
		'<li>\n' +
		'                    <b>${data.index}.${data.name}</b>\n' +
		'                    <span>${data.price}#L{元/${data.unit||"份"}}</span>\n' +
		'                    <span>${data.count}#L{${data.unit||"份"}}</span>\n' +
		'                </li>\n' +
		'</#list>' ,
	menuPage: '<div class="menuPage">' +
		'           <a evt-type="prevPage" js-node="prevPage" evt-data="p=0"><i class="icon_arrow"></i>#L{<em>上一页</em>}</a>' +
		'<span class="num" js-node="pages"></span>'+
		'           <a evt-type="nextPage" js-node="nextPage" evt-data="p=2">#L{<em>下一页</em>}<i class="icon_arrow"></i></a>' +
		'       </div>',
	settingip   : '<#et ipInfo data>' +
			'        <div class="login_cont">\n' +
		'            <div class="title"><strong>内网服务器IP</strong></div>\n' +
		'            <dl class="list4">\n' +
		'                <dt>服务器IP：</dt>\n' +
		'                <dd><input type="text" js-node="ip"></dd>\n' +
		'			</dl>' +
		'           <#if (data.ip)><dl class="list4">' +
		'                <dt>本机IP：</dt>\n' +
		'                <dd>${data.ip}</dd>\n' +
		'           </dl>' +
		'</#if>' +
		'           <div class="notice1" style="display: none;" js-node="errTips"></div>\n' +
		'            <div class="btn_cont txc">\n' +
		'                <a href="javascript:void(0);" evt-type="settingIp" class="btn4">保存</a>\n' +
		'            </div>\n' +
		'        </div>\n',
	/*adLayer      : '<div class="AD-800-600 AD_layer_a"><video id="example_video_1" class="video-js vjs-default-skin" src="http://video-js.zencoder.com/oceans-clip.webm"  width="800" height="600" autoplay="true"></video></video></div>',
	detailAd1    :'<div id="AD_layer_l_c1_r1" class="AD-100-360"><a href=""><img src="../Images/temp/AD-100-360.png" alt=""></a></div>',
	detailAd2    :'<div id="AD_layer_r_c1_r1" class="AD-100-360"><a href=""><img src="../Images/temp/AD-100-360.png" alt=""></a></div>'*/
	adLayer      : '<div class="AD-800-600 AD_layer_a">$HTML$</div>',
	adLayer2      : '<div class="AD-1280-800 AD_layer_a">$HTML$</div>',
	detailAd1    :'<div id="AD_layer_l_c1_r1" class="AD-100-360">$HTML$</div>',
	detailAd2    :'<div id="AD_layer_r_c1_r1" class="AD-100-360">$HTML$</div>',
	adLayer3     :'<div class="AD-sidelayer"> <div class="AD-wrap ">  <div class="row"> <div class="cell">$HTML$</div> </div> </div> </div>'
};
