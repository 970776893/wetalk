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
	//localStorageService.handlerRecentTalkList(3, '范冰冰', '/app/displaydata/imgs/fanbingbing.png');
	//console.log(window.localStorage);
});



// 确认框
app.factory('popup', function ($uibModal) {
    return {
        confim : function(title,msg){
            return $uibModal.open({
                animation : true,
                templateUrl : '/app/modules/base/htmls/confim.part.html',
                controller : function($scope, $uibModalInstance){
                    $scope.title = title;
                    $scope.msg = msg;

                    $scope.ok = function () {
                        $uibModalInstance.close("ok");
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            });
        }
    };
});

// 拦截器注入
app.config(function ($httpProvider) {
    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
});
/* 
 * 页面模板-内容 
 * eg:<we-layout></we-layout>
 */
app.directive('weLayout', function () {
    return {
        restrict: 'EA',
        templateUrl: '/app/modules/base/htmls/layout.part.html',
        controller : function($rootScope, $scope, $location){
        	$scope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl){
        		// url 便于下方导航栏的显示当前所在的按钮颜色
        		$scope.url = $location.$$url;
        		//为每个页面动态添加独自的url，便于定制化开发（eg：聊天页面不显示下方导航栏）
        		var className = 'we' + '-' + newUrl.substring(newUrl.indexOf('#') + 2).toLocaleLowerCase();
        		if(className.indexOf('/') > 0){
        			className = className.substring(0, className.indexOf('/'));
        		}
        		$('body').addClass(className);
        		if(newUrl !== oldUrl){
	        		//删除上一个页面class
	        		var rmClassName = 'we' + '-' +  oldUrl.substring(oldUrl.indexOf('#') + 2).toLocaleLowerCase();
	        		if(rmClassName.indexOf('/')  > 0){
	        			rmClassName = rmClassName.substring(0, rmClassName.indexOf('/') );
	        		}
	        		$('body').removeClass(rmClassName);
        		}
        	});
        }
    };
});


/* 
 *  封装三个滑动时间（开始时，滑动中，结束时） 
 *  eg:ng-touchmove="someFunction($event)"
*/
app.directive("ngTouchstart", function () {
	return {
		controller: function ($scope, $element, $attrs) {
			function onTouchStart(event) {
				var method = $element.attr('ng-touchstart');
				$scope.$event = event;
				$scope.$apply(method);
			}
			$element.bind('touchstart', onTouchStart);
		}
	};
});
app.directive("ngTouchmove", function () {
	return {
		controller: function ($scope, $element, $attrs) {
			function onTouchStart(event) {
				event.preventDefault();
				$element.bind('touchmove', onTouchMove);
				$element.bind('touchend', onTouchEnd);
			}
			function onTouchMove(event) {
				var method = $element.attr('ng-touchmove');
				$scope.$event = event;
				$scope.$apply(method);
			}
			function onTouchEnd(event) {
				event.preventDefault();
				$element.unbind('touchmove', onTouchMove);
				$element.unbind('touchend', onTouchEnd);
			}
			$element.bind('touchstart', onTouchStart);
		}
	};
});
app.directive("ngTouchend", function () {
	return {
		controller: function ($scope, $element, $attrs) {
			function onTouchEnd(event) {
				var method = $element.attr('ng-touchend');
				$scope.$event = event;
				$scope.$apply(method);
			}
			$element.bind('touchend', onTouchEnd);
		}
	};
});
// 用户状态 '状态[0-正常;1-冻结]'
app.filter('userStatusFilter', function($rootScope) {  
   return function(input) {
      var label = $rootScope.i18n.user;
      var status = Number(input);
      if(status === 0){
      	return label.statusNormal;
      }else if(status === 1){
      	return label.statusFrozen;
      }else{
      	return $rootScope.i18n.public.unKnow;
      }
   };  
 });
app.config( function ($routeProvider) {

	$routeProvider
	.when('/userList', {
		templateUrl: "/app/modules/user/htmls/user_list.html",
		controller : "userListController"
	})
	.when('/talkList', {
		templateUrl: "/app/modules/talk/htmls/talk_list.html",
		controller : "talkListController"
	})
	.when('/talkWindow/:id', {
		templateUrl: "/app/modules/talk/htmls/talk_window.html",
		controller : "talkWindowController"
	})
	.otherwise({
		templateUrl: "/app/modules/base/htmls/unknow.part.html"
	});

});
//消息服务
app.service("weService", function ($http) {
    return {
        /*
        获取用户列表
            数据结构eg：
            [
                {
                "id": 1,  ----用户编码
                "name": "陈奕迅",   ----用户姓名
                "imgUrl": "/app/displaydata/imgs/chenyixun.png",   ----用户头像
                "initial":"C"   ----首字母，便于查询
                }
            ]
        */
        getUserList : function () {
            return $http({
                url : '/app/displaydata/userlist.json',
                method : 'get',
                dataType : 'json'
            });
        }
    };
});


//本地存储信息
app.service("localStorageService", function ($http, $cookies) {
    return {
            /*
                最近聊天记录
                [
                    {
                     userId : 2,
                     userName : "陈奕迅",
                     userImgUrl : "陈奕迅",
                     noReadNum: 2,
                     lastMsgContent : "最后一条内容",
                     lastMsgTime : 16711312832
                    }
                ];
            */
        getRecentTalkList : function () {
            // 当前登陆用户
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            var recentUsers = [];
            //是否支持本地存储
            if(storage){
                var key = loginUser.id + '_recent_users';
                recentUsers = storage.getItem(key);
                if(recentUsers === null){
                    recentUsers = [];
                }else{
                    recentUsers = JSON.parse(recentUsers);
                }
                angular.forEach(recentUsers, function(rUser){
                    var iKey =  loginUser.id + "_history_" + rUser.userId;
                    var historyList = storage.getItem(iKey);
                    if(historyList != null){
                        //最近消息
                        historyList = JSON.parse(historyList);
                        var lastmsg = historyList[historyList.length-1];
                        rUser.lastMsgContent = lastmsg.content;
                        rUser.lastMsgTime = lastmsg.time;
                        //未读数
                        var noReadNum = 0;
                        for(var i = 0; i < historyList.length; i++){
                            var historyItem = historyList[i];
                            if(historyItem.sourceType === 1){
                                if(!historyItem.isRead){
                                    noReadNum ++;
                                }else{
                                    break;
                                }
                            }
                        }
                        rUser.noReadNum =  noReadNum;
                    }
                });
            }else{
                console.log("不支持本地存储");
            }
            return recentUsers;
        },
        /*
            获取最近聊天记录

            [
              {
                "id": "1",
                "content": "我收到你得消息了。-测试",
                "time": 1465293529060,
                "sourceType": 1,
                "msgType": 1,
                "isRead": false
              },
              {
                "id": 1,
                "content": "nihao ",
                "time": 1465293529059,
                "sourceType": 2,
                "msgType": 1
              }
            ]

            @params userId 用户ID
        */
        getRecentMsgList : function (userId) {
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            var historyList;
            if(storage){
                // start-- 最近聊天记录 --
                var hKey =  loginUser.id + "_history_" + userId;
                historyList = storage.getItem(hKey);
                if(historyList !== null){
                    historyList = JSON.parse(historyList);
                }else {
                    historyList = [];
                }
                // 未读数
                for(var i = 0; i < historyList.length; i++){
                    var historyItem = historyList[i];
                    if(historyItem.sourceType === 1){
                        historyItem.isRead = true;
                    }
                }
                storage.setItem(hKey, JSON.stringify(historyList));
                // end -- 最近聊天记录 --
            }else{
                console.log("不支持本地存储");
            }
            return historyList;
        },
        /*
            收到消息后，缓存处理

            @params userId 发送人ID
            @params userName 发送人姓名
            @params userImgUrl 发送人头像
            @params lastmsgContent 接收到的消息
            @params msgId 消息ID
            @params talkingUserId 正在聊天的用户ID
        */
        handlerReceiveMsg : function (userId, userName, userImgUrl, msgContent, msgId) {
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            if(storage){
                // start -- 聊天记录 --
                var hKey =  loginUser.id + "_history_" + userId;
                var historyList = storage.getItem(hKey);
                if(historyList === null){
                    historyList = [];
                }else{
                    historyList = JSON.parse(historyList);
                }
                // 最多存储100条
                if(historyList.length === 100){
                    historyList.pop();
                }
                // 获取的消息是否是当前聊天页面
                var talkWindowUrl = '#/talkWindow/';
                var isTalkWindows = false;
                if(window.location.hash.indexOf(talkWindowUrl) !== -1){
                    var talkWindowId =　Number(window.location.hash.substring(talkWindowUrl.length));
                    if(userId === talkWindowId){
                        isTalkWindows = true;
                    }
                }

                historyList.push({
                    id : msgId,
                    content  : msgContent,
                    time : (new Date()).getTime(),
                    sourceType : 1,  // 1-接收，2-发送
                    msgType : 1,     // 1-文本，2-语音
                    isRead : isTalkWindows
                });
                storage.setItem(hKey, JSON.stringify(historyList));
                // end -- 聊天记录 --
            }else{
                console.log("不支持本地存储");
            }
        },
        /*
            收到消息后，缓存处理

            @params userId 接收人ID
            @params userName 接收人姓名
            @params userImgUrl 接收人头像
            @params lastmsgContent 发送的消息
            @params msgId 消息ID
        */
        handlerSendMsg : function (userId, userName, userImgUrl, msgContent, msgId) {
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            if(storage){
                // start -- 聊天记录 --
                var hKey =  loginUser.id + "_history_" + userId;
                var historyList = storage.getItem(hKey);
                if(historyList === null){
                    historyList = [];
                }else{
                    historyList = JSON.parse(historyList);
                }
                // 当前正在聊天窗口
                historyList.push({
                    id : msgId,
                    content  : msgContent,
                    time : (new Date()).getTime(),
                    sourceType : 2,  // 1-接收，2-发送
                    msgType : 1     // 1-文本，2-语音
                });
                storage.setItem(hKey, JSON.stringify(historyList));
                // end -- 聊天记录 --
            }else{
                console.log("不支持本地存储");
            }
        },
        handlerRecentTalkList : function(userId, userName, userImgUrl){
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            if(storage){
                // start-- 最近聊天列表 --
                var key = loginUser.id + '_recent_users';
                var recentUsers = storage.getItem(key);
                if(recentUsers === null){
                    recentUsers = [];
                }else{
                    recentUsers = JSON.parse(recentUsers);
                }
                var index = -1;
                for(var i = 0; i < recentUsers.length; i++){
                    var rUser = recentUsers[i];
                    if(String(rUser.userId) === String(userId)){
                        index = i;
                        break;
                    }
                }
                if(index > 0){
                    //不是第一个,删除原来的
                    recentUsers.splice(index, 1);
                }
                //添加最近的聊天
                if(index !== 0){
                    recentUsers.unshift({
                        userId : userId,
                        userName : userName,
                        userImgUrl : userImgUrl
                    });
                }
                storage.setItem(key, JSON.stringify(recentUsers));
                // end -- 最近聊天列表
            }else{
                console.log("不支持本地存储");
            }
        }

    };
});

/* 用户列表 */

app.controller("talkListController", function ($rootScope, $scope, $location, localStorageService) {
	//初始化数据
	$scope.talkList = localStorageService.getRecentTalkList();
	var today = new Date();
	angular.forEach($scope.talkList, function(talk){
		var msgTime = new Date(talk.lastMsgTime);
		if(today.getFullYear() === msgTime.getFullYear() && today.getMonth() === msgTime.getMonth() && today.getDate() === msgTime.getDate()){
			talk.isToday = true;
		} 
	});

	$scope.talk = function(talkItem){
		console.log(talkItem);
		$location.path("/talkWindow/" + talkItem.userId);
	};

});

/* 用户列表 */

app.controller("talkWindowController", function ($rootScope, $scope, $location, $routeParams, $cookies, weService, localStorageService) {
	
	var userId = String($routeParams.id);
	// 根据用户ID获取用户信息
	weService.getUserList().then(function(res){
		angular.forEach(res.data, function(user){
			if(String(user.id) === userId){
				$scope.userInfo = user;
			}
		});
	});

	$scope.loginUser = $cookies.getObject('loginUser');

	//初始化数据
	$rootScope.talkingList = localStorageService.getRecentMsgList(userId);

	//收取消息
	$scope.getMsg = function(){
		var msgContent = '我收到你得消息了。-测试';
		//内容为空则不发送信息
		if(!msgContent){
			return ;
		}
		//正在发送，置灰发送按钮
		$scope.sending = true;
		$rootScope.talkingList.push({
			id : 1,
			content : msgContent,
			sourceType : 1
		});
		var msgId = 1;
		localStorageService.handlerReceiveMsg($scope.userInfo.id, $scope.userInfo.name, $scope.userInfo.imgUrl, msgContent);
		localStorageService.handlerRecentTalkList($scope.userInfo.id, $scope.userInfo.name, $scope.userInfo.imgUrl);
		//手动渲染
		$scope.$apply();
		//滚动条滚动到底部
		$(document).scrollTop(100000000);
	};
	//发送消息
	$scope.sendMsg = function(){
		var inputContent = $("#msgInput").val();
		//内容为空则不发送信息
		if(!inputContent){
			return ;
		}
		//正在发送，置灰发送按钮
		$scope.sending = true;
		$rootScope.talkingList.push({
			id : 1,
			content : inputContent,
			sourceType : 2
		});
		//滚动条滚动到底部
		$(document).scrollTop(100000000);
		//清空输入框内容
		$("#msgInput").val(null);
		//获取焦点
		//$("#msgInput").focus();
		var msgId = 1;
		localStorageService.handlerSendMsg($scope.userInfo.id, $scope.userInfo.name, $scope.userInfo.imgUrl, inputContent, msgId);
		localStorageService.handlerRecentTalkList($scope.userInfo.id, $scope.userInfo.name, $scope.userInfo.imgUrl);

		// TODO 测试收到回复 
		//$scope.getMsg();
	};
	//监听滚动事件
	$(window).scroll(function(){
		var top = $(window).scrollTop();
		if(top === 0){
			// 滚动到顶部
			$scope.showLoading = true;
			console.log($scope.showLoading);
		}
	});
	$rootScope.sendMsgByKeyup = function(event){
		if(event.keyCode === 13){
			$scope.sendMsg();
		}
	}
	$rootScope.sendMsgByButton = function(){
		$scope.sendMsg();
	}
});

/* 用户列表 */

app.controller("userListController", function ($rootScope, $scope, $location, weService) {
	//初始化数据-获取用户列表
	weService.getUserList().then(function(res){
		//原始数据
		$scope.userListOrg = res.data;
		// 搜索的时候回事是变化
		$scope.userList = res.data;
		//整理右侧的query
		$scope.queryKeyList = [];
		angular.forEach($scope.userList, function(user){
			var queryKey = user.initial;
			var flag = true;
			angular.forEach($scope.queryKeyList, function(qk){
				if(qk === queryKey){
					flag = false;
					return ;
				}
			});
			if(flag){
				$scope.queryKeyList.push(queryKey);
			}
		});
	});

	$scope.talk = function(user){
		$location.path("/talkWindow/" + user.id);
	};

	$scope.queryByinitial = function(key){
		//隐藏其他按钮
		console.log(key);
	};
	//搜索
	$scope.queryByKey = function(){
		$scope.userList = [];
		angular.forEach($scope.userListOrg, function(user){
			if(user.name.indexOf($scope.queryData) !== -1){
				$scope.userList.push(user);
			}
		});
	};
	//搜索-结束
	$scope.queryByKeyBLur = function(){
		$scope.userList = $scope.userListOrg;
		$scope.queryData = null;
	};
	//搜索-开始
	$scope.queryByKeyFocus = function(){
		$scope.userList = [];
	};

});
