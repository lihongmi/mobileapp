define(function(require, exports, module){
	var config = {
		DEBUG: false,
		URL_HOST: "http://10.0.19.39:8080/coomarts_app_new/app/",
		URL_HOST2:"http://10.0.19.39:8080/coomarts_app_new/",
		IMG_HOST: "http://10.0.19.37/",
		IMG_PREFIX_GOODS_BIG: ["big_phone_big_", "medium_phone_big_", "small_phone_big_"],
		IMG_PREFIX_GOODS_MEDIUM: ["big_phone_medium_", "medium_phone_medium_", "small_phone_medium_"],
		IMG_PREFIX_GOODS_SMALL: ["big_phone_small_", "medium_phone_small_", "small_phone_small_"],
		IMG_PREFIX_INDEX_BIG: ["big_phone_index_big_", "medium_phone_index_big_", "small_phone_index_big_"],
		IMG_PREFIX_INDEX_SMALL: ["big_phone_index_small_", "medium_phone_index_small_", "small_phone_index_small_"],
		IMG_PREFIX_ADVERT: ["advert_big_", "advert_medium_", "advert_small_"],
		IMG_PREFIX_SPEC_BIG: ["advert_spec_big_phone_big_", "advert_spec_medium_phone_big_", "advert_spec_small_phone_big_"],
		IMG_PREFIX_SPEC_SMALL: ["advert_spec_big_phone_small_", "advert_spec_medium_phone_small_", "advert_spec_small_phone_small_"],
		IMG_REEFIX_CATEGORY: ["goodsclass_big_phone_icon_", "goodsclass_medium_phone_icon_", "goodsclass_small_phone_icon_"],
		ADVERTS_LIST: "advertsList.htm",
		QUERY_RECOMMENDED: "queryRecommendedGoodsView.htm",
		QUERY_NEW: "queryNewGoodsView.htm",
		QUERY_SALE: "queryGoodsOnSalenum.htm",
		QUERY_GOOD_CLASS: "queryGoodsClassApp.htm",
		QUERY_GOOD_BY_CLASS: "queryGoodsByClassApp.htm",
		QUERY_GOOD_BY_KEYWORDS: "searchGoodsListApp.htm",
		QUERY_GOODS_DETAIL: "queryGoodsViewApp.htm",
		QUERY_GOODS_STATUS: "queryGoodsStatus.htm",
		UPDATE_GOODS_CLICK: "updateGoodsClick.htm",
		
		IS_GOODS_COLLECT: "wetherGoodsCollectApp.htm",
		UPDATE_GOODS_COLLECT: "updateGoodsCollectApp.htm",
		QUERY_GOODS_EVAL: "queryGoodsEvaluationApp.htm",
		QUERY_GOODS_SPEC_INFO: "queryGoodsSpecInfoApp.htm",
		
		ADD_GOODS_TO_CART: "addGoodsToCartApp.htm",
		QUERY_GOODS_CART: "queryGoodsCartsApp.htm",
		DELETE_GOODS_FROM_CART: "deleteGoodsInCartApp.htm",
		BUY_DIRECTLY_LIST: "buyDirectlyListApp.htm",
		BUY_DIRECTLY_NO_CART: "buyGoodsNotCartDirectly.htm",
		GEN_ORDER_CART: "orderGenerateCartApp.htm",
		MODIFY_GOODS_NUM: "batchUpdateGoodsNumApp.htm",
		
		SAVE_ORDER: "saveOrderViewPad.htm",
		QUERY_NONPAY_ORDER: "queryNonpayOrderViewApp.htm",
		QUERY_WAIT_SHIP_ORDER: "queryWaitShipOrderViewApp.htm",
		SEND_REMINDER_SMS: "sendReminderSmsApp.htm",
		QUERY_NON_RECEIVE_ORDER: "queryNonReceiveOrderApp.htm",
		QUERY_FINISHED_ORDER: "queryFinishedOrderViewApp.htm",
		QUERY_ORDER_DETAIL: "queryOrderDetailViewApp.htm",
		UPDATE_ORDER_STATUS: "updateOrderStatusApp.htm",
		
		SAVE_COOBILL_PAY: "saveCoobillPayApp.htm",
		QUERY_COOBILL_STATUS: "queryOrderStatusApp.htm",
		
		QUERY_ADDRESS_LIST: "queryUserAddressListApp.htm",
		ADD_ADDRESS: "addUserAddressApp.htm",
		UPDATE_ADDRESS: "updateUserAddressApp.htm",
		DELETE_ADDRESS: "deleteUserAddressApp.htm",
		SET_DEFAULT_ADDRESS: "updateDefaultAddresApp.htm",
		GET_DEFALUT_ADDRESS: "queryAddressByUserIdApp.htm",
		
		SAVE_ORDER_EVALUTE: "saveOrderEvaluateApp.htm",
		
		CHECK_USER: "checkUserApp.htm",
		CHECK_MAIL: "checkMailApp.htm",
		USER_REGISTER: "registerUserApp.htm",
		USER_LOGIN: "userLoginApp.htm",
		USER_SERVICE_AGREE: "queryUserServiceAgreeApp.htm",
		
		GET_INTER_LANG: "INITDATAApp.htm",
		SUBMIT_ADVICE: "submitAdviceApp.htm",
		GOODS_FAVORITE: "queryFavoriteGoodsApp.htm"
	};
	module.exports = config;
});