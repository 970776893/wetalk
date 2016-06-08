/* app的总入口，定制angularJS接入总配置  */
var dependencies = ['ngAnimate', 'ngRoute', 'ngCookies', 'ngTouch'];
var app = angular.module("app", dependencies);


// 模拟当前登陆用户
app.run(function($rootScope){
	//根据用户ID判断是否是正在聊天的用户
	$rootScope.isTalkingUser = function(userId){
        var talkWindowUrl = '#/talkWindow/';
        var isTalkWindows = false;
        if(window.location.hash.indexOf(talkWindowUrl) !== -1){
            var talkWindowId =　Number(window.location.hash.substring(talkWindowUrl.length));
            if(userId === talkWindowId){
                isTalkWindows = true;
            }
        }
        return isTalkWindows;
	};
});

// 监听接收消息
app.run(function($rootScope, localStorageService){
	//收取消息之后的处理
	$rootScope.getMsg = function(userInfo, msgInfo){
		// 处理缓存信息
		localStorageService.handlerReceiveMsg(userInfo, msgInfo);
		localStorageService.handlerRecentTalkList(userInfo);
		//是否是当前聊天页面
		var isTalkWindows = $rootScope.isTalkingUser(userInfo.id);
		if(isTalkWindows){
			// 正在聊天的人
			$rootScope.talkingList.push(msgInfo);
		}else{
			// TODO 非当前页面
		}
	};
	// 模拟收到消息
});

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



