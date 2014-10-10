$(function(){
	var timer;
	var turnOff = false;
	var speed = 2*60*1000;
	var autoTurnOff = function(){
		timer = window.setTimeout(function(){
			try {
				if(window.location.href.indexOf('index.html')>=0){
					window.AndroidFun.turnOff();
//                    window.AndroidFun.lockScreen();
					turnOff = true;
				}else{
					if(window.waitVideo){
						clearTimeout(timer);
						timer = null;
						autoTurnOff();
					}else{
						window.location.href = "./index.html";
					}
				}
			} catch (e) {
			}
		}, speed);
	};
	$(document.body).on('tap', function(){
		try {
			clearTimeout(timer);
			timer = null;
			autoTurnOff();
			if(turnOff){
				window.AndroidFun.turnOn();
				turnOff = false;
			}
		} catch (e) {
			turnOff = true;
		}
	});
	autoTurnOff();
});