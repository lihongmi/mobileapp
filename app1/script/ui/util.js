define(function(require, exports, module){
	String.prototype.toCamel = function(s){
		eval("var re = /\\"+s+"([A-Za-z0-9])/g");
		return this.replace(re, function(all, letter){
			return letter.toUpperCase();
        });
	};
	String.prototype.toSeparte = function(s){
		return this.replace(/([A-Z])/g, s + "$1").toLowerCase();
	};
	Array.prototype.inArray = function(s){
		for(var i = 0; i < this.length; i ++){
			if(this[i] === s){
				return true;
			}
		}
		return false;
	};
	Array.prototype.indexOf = function(s){
		for(var i = 0; i < this.length; i ++){
			if(this[i] == s){
				return i;
			}
		}
		return -1;
	};
	Image.prototype.preLoad = function(ids, url, errurl){
		var idArr = ids.split(",");
		var img = new Image();
		img.onload = function(){
			for(var i = 0; i < idArr.length; i ++)
				document.getElementById(idArr[i]).src = url;
		};
		img.onerror = function(){
			for(var i = 0; i < idArr.length; i ++)
				document.getElementById(idArr[i]).src = url;
		};
		img.src = url;
	};
});