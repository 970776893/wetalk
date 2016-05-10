/* app的总入口，定制angularJS接入总配置  */
var dependencies = ['ngAnimate', 'ngRoute', 'ngCookies', 'ngTouch'];
var app = angular.module("app", dependencies);


// 模拟当前登陆用户
app.run(function($cookies){
	//当前登陆用户
	var loginUser = {
		id : 10000,
		name : '张凯',
		'imgUrl' : '/app/displaydata/imgs/zhangkai.png'
	};
	$cookies.putObject('loginUser', loginUser);
});

// 模拟的消息接受
app.run(function($cookies, localStorageService){
	//localStorageService.handlerReceiveMsg(1, '陈奕迅', '/app/displaydata/imgs/chenyixun.png', '测试收到消息');
	//localStorageService.handlerReceiveMsg(3, '范冰冰', '/app/displaydata/imgs/fanbingbing.png', '测试收到消息-范冰冰');
	//console.log(window.localStorage);
});


