/* app的总入口，定制angularJS接入总配置  */
var dependencies = ['ngAnimate', 'ngRoute', 'ngCookies', 'ngTouch'];
var app = angular.module("app", dependencies);


// 用户登陆
app.run(function($rootScope, $cookies){
	$rootScope.login = function(){
		//当前登陆用户
		var loginUser = {
			id : 10000,
			name : '张凯',
			'imgUrl' : '/app/displaydata/imgs/zhangkai.png'
		};
		$cookies.putObject('loginUser', loginUser);
		return loginUser;
	}
	$rootScope.loginUser = $rootScope.login();
});

// 获取发送消息类型列表+相应的处理
app.run(function($rootScope, weService){
	weService.getMsgToolsList().then(function(res){
		$rootScope.msgTools = res.data;
	});
	$rootScope.handMsgTools = function(tools, $event){
		console.log($event.target);
		$($event.target).css("animation","anim 2s");
		console.log('不支持类型:' + tools.text);
	}
});

// 添加个性化class
app.run(function($rootScope,$route){

	$rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl){
		// url 便于下方导航栏的显示当前所在的按钮颜色
		$rootScope.url = window.location.hash;
		//为每个页面动态添加独自的url，便于定制化开发（eg：聊天页面不显示下方导航栏）
		var className = 'we' + $route.current.$$route.originalPath.toLocaleLowerCase();
		//去掉参数
		if(className.indexOf(':') > 0){
			className = className.substring(0, className.indexOf(':') - 1);
		}
		className = className.replace("/", "-");
		$rootScope.bodyClass = className;
	});

});

// 创建公共函数
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

	// 只有header和footer不参与滚动
	$rootScope.changeSectionHeight = function(){
		var sectionHeight = (window.innerHeight - 102) + 'px';
		$rootScope.sectionStyle = {
			'max-height' : sectionHeight
		};
	};
	$rootScope.changeSectionHeight();
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
			if($rootScope.talkingList == null){
				$rootScope.talkingList = [];
			}
			$rootScope.talkingList.push(msgInfo);
		}else{
			// TODO 非当前页面
			$rootScope.refreshTalkList = true;
			$rootScope.noreadNumTotal = $rootScope.noreadNumTotal + 1;
		}
	};
	// 模拟收到消息
});

// 获取未读的消息总数
app.run(function($rootScope, localStorageService){
	$rootScope.noreadNumTotal = localStorageService.getNoreadNumTotal();
});



// 模拟收到消息   测试数据--------------------------------------------------start
app.run(function($rootScope, $cookies, weService){
	$rootScope.testGetMessageRondom = function(){
		// 发送人id
		var fromUserId = Math.floor(Math.random() * 9 + 1);
		weService.getUserList().then(function(res){
			var fromUser;
			var userList = res.data;
			angular.forEach(userList, function(user){
				if(String(user.id) === String(fromUserId)){
					fromUser = user;
					return ;
				}
			});
			var msgInfo = {
                "id": 1,
                "content": "测试-收到消息 ",
                "time": (new Date()).getTime(),
                "sourceType": 1,
                "msgType": 1
             }
             $rootScope.getMsg(fromUser, msgInfo);
         });
	};

	$rootScope.testGetMessageWindow = function(){
		// 发送人id
		var talkWindowUrl = '#/talkWindow/';
        var isTalkWindows = false;
        if(window.location.hash.indexOf(talkWindowUrl) === -1){
        	console.log('不是聊天窗口');
           return ;
        }
        var fromUserId =　Number(window.location.hash.substring(talkWindowUrl.length));
		weService.getUserList().then(function(res){
			var fromUser;
			var userList = res.data;
			angular.forEach(userList, function(user){
				if(String(user.id) === String(fromUserId)){
					fromUser = user;
					return ;
				}
			});
			var msgInfo = {
                "id": 1,
                "content": "测试-收到消息 ",
                "time": (new Date()).getTime(),
                "sourceType": 1,
                "msgType": 1
             }
             $rootScope.getMsg(fromUser, msgInfo);
         });
	}
});
//测试数据-------------------------------------------------------------------end




