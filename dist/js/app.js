/* app的总入口，定制angularJS接入总配置  */
var dependencies = ['ngAnimate', 'ngRoute', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.bootstrap'];
var app = angular.module("app", dependencies);


// 用户登陆
app.run(function($rootScope, $cookies){
	$rootScope.login = function(){
		//当前登陆用户
		var loginUser = {
			id : 10000,
			name : '张凯',
			'imgUrl' : './app/displaydata/imgs/zhangkai.png'
		};
		$cookies.putObject('loginUser', loginUser);
		return loginUser;
	};
	$rootScope.loginUser = $rootScope.login();
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
	//禁止safari可以拖动整个页面
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
});

// 创建全局函数
app.run(function($rootScope, $timeout){
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


	//判断是否微信浏览器
	$rootScope.isWeiXin = function() {
	    var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) === 'micromessenger'){
	        return true;
	    }else{
	        return false;
	    }
	};

	// 只有header和footer不参与滚动
	$rootScope.changeSectionHeight = function(){
		var sectionHeight = (window.innerHeight - $("footer").outerHeight() - $("header").outerHeight()) + 'px';
		if($rootScope.sectionStyle === undefined || $rootScope.sectionStyle.height !== sectionHeight){
			$rootScope.sectionStyle = {
				'height' : sectionHeight
			};
			//body滚动到最顶部
			if($rootScope.isWeiXin()){
				$('body')[0].scrollTop = 0;
			}
		}
		$timeout($rootScope.changeSectionHeight, 300).then(function(){}, function(){});
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
			if($rootScope.talkingList === null){
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

// 获取发送消息类型列表+相应的处理
app.run(function($rootScope, weService){
	weService.getMsgToolsList().then(function(res){
		$rootScope.msgTools = [];
		var columns = 4; //每行几个-显示
		var line = [];
		for(var i = 0; i < res.data.length; i++){
			if((i % columns === 0 && i !== 0)) {
				$rootScope.msgTools.push(line);
				line = [];
			}
			line.push(res.data[i]);
		}
		if(line.length > 0){
			$rootScope.msgTools.push(line);
		}
	});
	
});

// 获取表情列表
app.run(function($rootScope){
	$rootScope.emList = {
		faceList : []
	};
	var facePath = "./imgs/face/"; //脸表情保存路径
	var _suffix = ".gif"; //脸表情后缀名
	var startIndex = 1; //脸表情开始
	var size = 75; //脸表情数量
	var showColoum = 6; //显示的总列数
	var showRow = 3; //显示的总列数
	var lineFace = []; //每一行
	var pageFace = []; //每一页
	for(var index = startIndex; index < size + startIndex; index++){
		var face = {
			code : index,
			path : facePath + index + _suffix
		};
		//分行
		if((index - startIndex) % showColoum === 0 && index !== startIndex){
			pageFace.push(lineFace);
			lineFace = [];
			if(pageFace.length === showRow){
				$rootScope.emList.faceList.push(pageFace);
				pageFace = [];
			}
		}
		lineFace.push(face);
	}
	if(lineFace.length > 0){
		pageFace.push(lineFace);
	}
	if(pageFace.length > 0){
		$rootScope.emList.faceList.push(pageFace);
	}
	//表情轮播图-手势左划
	$rootScope.prevCarousel = function($event){
		$('#faceList').carousel('next');
	};
	//表情轮播图-手势右划
	$rootScope.nextCarousel = function($event){
		$('#faceList').carousel('prev');
	};
	$rootScope.addEm = function(em){
		var emCode = '[em-' + em.code + ']';
		if($rootScope.data.msgContent){
			$rootScope.data.msgContent += emCode;
		}else{
			$rootScope.data.msgContent = emCode;
		}
	};
});

// 模拟收到消息   测试数据--------------------------------------------------start
app.run(function($rootScope, $cookies, $timeout, dialog, weService){
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
             };
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
             };
             $rootScope.getMsg(fromUser, msgInfo);
         });
	};

	//初始化数据
	$rootScope.confirm = function(number){
		var btns = [];
		var title;
		if(number === 1){
			title = '祝您身体健康，万事如意！！';
			btns.push('确认');
		}else{
			title = '删除订单';
			btns.push('强制删除');
			btns.push('删除');
			btns.push('取消');
		}
		var instance = dialog.confirm(title ,btns);
		instance.result.then(function(mark){
			console.log(mark);
			$rootScope.alerts.push({msg:mark});
		});
	};
	$rootScope.loading = function(){
		var instance = dialog.loading('加载中');
		$timeout(function(){
			instance.close();
			$rootScope.alerts.push({msg:'加载成功'});
		}, 3000);
	};
	var index = 0;
	$rootScope.tip = function(){
		$rootScope.alerts.push({msg:'信息提示' + index});
		index = index + 1;
	};
	$rootScope.option = function(){
		var instance = dialog.options('请选择操作',['买入', '卖出'], '取消');
		instance.result.then(function(mark){
			console.log(mark);
			$rootScope.alerts.push({msg:mark});
		});
	};
	$rootScope.alerts = [];
});
//测试数据-------------------------------------------------------------------end





// 确认框
app.factory('dialog', function ($uibModal) {
    return {
        confirm : function(msg,buttons){

            return $uibModal.open({
                animation : true,
                templateUrl : './app/modules/base/htmls/confirm.part.html',
                windowClass : 'dialog-confirm',
                controller : function($scope, $uibModalInstance){
                    $scope.msg = msg;
                    $scope.buttons = buttons;

                    $scope.ok = function (value) {
                        $uibModalInstance.close(value);
                    };
                }
            });
        },
        loading : function(title){
            return $uibModal.open({
                animation : true,
                size : 'sm',
                windowClass : 'dialog-loading',
                backdrop : false,
                templateUrl : './app/modules/base/htmls/loading.part.html',
                controller : function($scope, $uibModalInstance){
                    $scope.title = title;
                }
            });
        },
        options : function(title, options, cancel){
            return $uibModal.open({
                animation : true,
                windowClass : 'dialog-options',
                templateUrl : './app/modules/base/htmls/options.part.html',
                controller : function($scope, $uibModalInstance){
                    $scope.title = title;
                    $scope.options = options;
                    $scope.cancel = cancel || 'Cancel';
                    $scope.ok = function (value) {
                        $uibModalInstance.close(value);
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
        templateUrl: './app/modules/base/htmls/layout.part.html'
    };
});
app.directive('weHeader', function () {
    return {
        restrict: 'EA',
        replace : true,
        templateUrl: './app/modules/base/htmls/header.part.html'
    };
});
app.directive('weFooter', function () {
    return {
        restrict: 'EA',
        replace : true,
        templateUrl: './app/modules/base/htmls/footer.part.html'
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

// 定位焦点
app.directive('focusable', function() {
	return {
		restrict: 'A',
		scope: {
			focusable: '='
		},
		link: function(scope, elm, attrs) {
			scope.$watch('focusable', function (value) {
				if (value) {
					setTimeout(function(){
						elm[0].focus();
					}, 0);
				}
			});
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
		templateUrl: "./app/modules/user/htmls/user_list.html",
		controller : "userListController"
	})
	.when('/talkList', {
		templateUrl: "./app/modules/talk/htmls/talk_list.html",
		controller : "talkListController"
	})
	.when('/talkWindow/:id', {
		templateUrl: "./app/modules/talk/htmls/talk_window.html",
		controller : "talkWindowController"
	})
	.otherwise({
		templateUrl: "./app/modules/base/htmls/unknow.part.html",
		controller : function($rootScope, $scope){
			$rootScope.bodyClass = 'error-page';
		}
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
                url : './app/displaydata/userlist.json',
                method : 'get',
                dataType : 'json'
            });
        },
        /*
        获取聊天界面的操作列表
            数据结构eg：
            [
                [
                    {
                      "type": "pictures",
                      "text": "图片",
                      "icon": "/imgs/pictures.png",
                      "remark":"第一行第一列"
                    },
                    {
                      "type": "location",
                      "text": "位置",
                      "icon": "/imgs/location.png",
                      "remark":"第二行第一列"
                    }
                ]
            ]
        */
        getMsgToolsList : function () {
            return $http({
                url : './app/modules/base/data/messageTools.json',
                method : 'get',
                dataType : 'json'
            });
        }
    };
});


//本地存储信息
app.service("localStorageService", function ($rootScope, $http, $cookies) {
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
                    if(historyList !== null){
                        //最近消息
                        historyList = JSON.parse(historyList);
                        var lastmsg = historyList[0];
                        rUser.lastMsgContent = lastmsg.content;
                        rUser.lastMsgTime = lastmsg.time;
                        //未读数
                        var noReadNum = 0;
                        for(var i = 0 ; i < historyList.length; i++){
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
            @params pageNo 页码
            @params pageSize 页大小
        */
        getRecentMsgList : function (userId, pageNo, pageSize) {
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
                    if(historyItem.sourceType === 1 && !historyItem.isRead){
                        historyItem.isRead = true;
                        $rootScope.noreadNumTotal = $rootScope.noreadNumTotal - 1;
                    }else if(historyItem.isRead){
                        break;
                    }
                }
                storage.setItem(hKey, JSON.stringify(historyList));
                historyList = historyList.slice((pageNo - 1 ) * pageSize, pageNo * pageSize);
                // end -- 最近聊天记录 --
            }else{
                console.log("不支持本地存储");
            }
            return historyList;
        },
        /*
            收到消息后，缓存处理

            @params userInfo 发送人信息
            @params msgInfo  收到的消息信息
        */
        handlerReceiveMsg : function (userInfo, msgInfo) {
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            if(storage){
                // start -- 聊天记录 --
                var hKey =  loginUser.id + "_history_" + userInfo.id;
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
                var isTalkWindows = $rootScope.isTalkingUser(userInfo.id);
                msgInfo.time = (new Date()).getTime();
                msgInfo.status = 0;
                msgInfo.isRead = isTalkWindows;
                historyList.unshift(msgInfo);
                storage.setItem(hKey, JSON.stringify(historyList));
                // end -- 聊天记录 --
            }else{
                console.log("不支持本地存储");
            }
        },
        /*
            收到消息后，缓存处理

            @params userInfo 接收人
            @params msgInfo 消息
        */
        handlerSendMsg : function (userInfo, msgInfo) {
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            if(storage){
                // start -- 聊天记录 --
                var hKey =  loginUser.id + "_history_" + userInfo.id;
                var historyList = storage.getItem(hKey);
                if(historyList === null){
                    historyList = [];
                }else{
                    historyList = JSON.parse(historyList);
                }
                // 当前正在聊天窗口
                historyList.unshift(msgInfo);
                storage.setItem(hKey, JSON.stringify(historyList));
                // end -- 聊天记录 --
            }else{
                console.log("不支持本地存储");
            }
        },
        /*
            最近联系人列表

            @params userInfo 用户信息
        */
        handlerRecentTalkList : function(userInfo){
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
                    if(String(rUser.userId) === String(userInfo.id)){
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
                        userId : userInfo.id,
                        userName : userInfo.name,
                        userImgUrl : userInfo.imgUrl
                    });
                }
                storage.setItem(key, JSON.stringify(recentUsers));
                // end -- 最近聊天列表
            }else{
                console.log("不支持本地存储");
            }
        },
        /*
            获取未读消息总数

        */
        getNoreadNumTotal : function(){
            var total = 0;
            // 当前登陆用户
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            var recentUsers = [];
            //是否支持本地存储
            if(storage){
                var key = loginUser.id + '_recent_users';
                recentUsers = storage.getItem(key);
                if(recentUsers === null){
                    return total;
                }
                recentUsers = JSON.parse(recentUsers);
                angular.forEach(recentUsers, function(rUser){
                    var iKey =  loginUser.id + "_history_" + rUser.userId;
                    var historyList = storage.getItem(iKey);
                    if(historyList !== null){
                        //最近消息
                        historyList = JSON.parse(historyList);
                        var lastmsg = historyList[0];
                        rUser.lastMsgContent = lastmsg.content;
                        rUser.lastMsgTime = lastmsg.time;
                        //未读数
                        var noReadNum = 0;
                        for(var i = 0 ; i < historyList.length; i++){
                            var historyItem = historyList[i];
                            if(historyItem.sourceType === 1){
                                if(!historyItem.isRead){
                                    noReadNum ++;
                                }else{
                                    break;
                                }
                            }
                        }
                        total =  total + noReadNum;
                    }
                });
            }else{
                console.log("不支持本地存储");
            }
            return total;
        },
        /*
            删除用户聊天

        */
        deleteUserHistory : function(userId){
            // 当前登陆用户
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            var recentUsers = [];
            //是否支持本地存储
            if(storage){
                var key = loginUser.id + '_recent_users';
                recentUsers = storage.getItem(key);
                if(recentUsers === null){
                    return ;
                }
                recentUsers = JSON.parse(recentUsers);
                var index = 0;
                for(; index < recentUsers.length; index++){
                    if(String(recentUsers[index].userId) === String(userId)){
                        break;
                    }
                }
                
                recentUsers.splice(index,1);
                storage.setItem(key, JSON.stringify(recentUsers));
                var iKey =  loginUser.id + "_history_" + userId;
                storage.removeItem(iKey);
            }else{
                console.log("不支持本地存储");
            }
        }

    };
});

/* 用户列表 */

app.controller("talkListController", function ($rootScope, $scope, $location, dialog, $timeout, localStorageService) {
	$rootScope.title = '消息';
	//初始化数据
	$scope.getTalkList = function(){
		$scope.talkList = localStorageService.getRecentTalkList();
		$scope.talkListOrg = $scope.talkList;
		$rootScope.refreshTalkList = false;
	};
	$scope.getTalkList();

	$scope.talk = function(talkItem){
		$location.path("/talkWindow/" + talkItem.userId);
	};

	$rootScope.$watch('refreshTalkList', function(newValue, oldValue, scope){
		console.log(newValue);
		if(newValue){
			$scope.getTalkList();
		}
	});
	//搜索
	$scope.queryByKey = function(){
		$scope.talkList = [];
		angular.forEach($scope.talkListOrg, function(item){
			if(item.userName.indexOf($scope.queryData) !== -1 || (String(item.lastMsgContent).indexOf($scope.queryData) !== -1)){
				$scope.talkList.push(item);
			}
		});
	};
	//搜索-结束
	$scope.queryByKeyBLur = function(){
		$scope.talkList = $scope.talkListOrg;
		$scope.queryData = null;
	};
	//显示操作
	$scope.optHistory = function(item){
		var index = 0;
		for(; index < $scope.talkList.length; index++){
			if(String($scope.talkList[index].userId) === String(item.userId)){
				break;
			}
		}
		$scope.showOptIndex = index;
	};
	$scope.hiddenOpt = function(){
		$scope.showOptIndex = -1;
	};
	//删除
	$scope.delete = function(item, $event){
		dialog.confirm('确定删除【' + item.userName +'】的聊天', ['删除','取消']).result.then(function(res){
			if(res === '删除'){
				localStorageService.deleteUserHistory(item.userId);
				$scope.getTalkList();
				$rootScope.noreadNumTotal = $rootScope.noreadNumTotal - item.noReadNum;
				$scope.showOptIndex = -1;
				//取消动画效果
				$($event.target).parent().removeClass('show-opt-wapper');
			}
		});
	};

	$scope.myScroll = new iScroll('wrapper-talklist', {
		useTransition : true,
		checkDOMChanges:true,
		hScroll : false,
		onScrollMove: function () {
			if(this.y < 10 ){
				$scope.tip = '下拉刷新';
			}
			if(this.y > 10){
				$scope.tipShow = true;
				$scope.tip = '释放刷新';
			}
		},
		onBeforeScrollStart: function (e) {
			//e.preventDefault();
		}, 
		onScrollEnd: function () {
			if($scope.tipShow){
				$scope.tip = '刷新中...';
				// 模拟2s请求
				setTimeout(function() {
					$scope.tipShow = false;
					$scope.getTalkList();
				}, 2000);
			}
		}
	});

});

/* 用户列表 */

app.controller("talkWindowController", function ($rootScope, $scope, $location, $routeParams, $cookies, $timeout, popup, weService, localStorageService) {
	
	var userId = String($routeParams.id);
	// 根据用户ID获取用户信息 --------------------------------------------------------------------------
	weService.getUserList().then(function(res){
		angular.forEach(res.data, function(user){
			if(String(user.id) === userId){
				$scope.userInfo = user;
				$rootScope.title = $scope.userInfo.name;
			}
		});
	});

	$scope.loginUser = $cookies.getObject('loginUser');
	$scope.pageNo = 1;
	$scope.pageSize = 3;
	//初始化数据
	$rootScope.talkingList = localStorageService.getRecentMsgList(userId, $scope.pageNo, $scope.pageSize);
	// 显示表情
	$scope.replaceEm = function(str){
		str = str.replace(/</g,'&lt;');
		str = str.replace(/>/g,'&gt;');
		str = str.replace(/\n/g,'<br/>');
		str = str.replace(/\[em-([0-9]*)\]/g, '<img src="./imgs/face/$1.gif"  border="0"/>');
		return str;
	};

	$rootScope.data = {};
	//发送消息
	$scope.sendMsg = function(){
		var inputContent = $rootScope.data.msgContent;
		//内容为空则不发送信息
		if(!inputContent){
			return ;
		}
		//正在发送，置灰发送按钮
		$scope.sending = true;
		var msgInfo = {
			id : 1,
			content : inputContent,
			status : Math.random() > 0.5 ? 0 : 1, // 0-成功，1-失败
			time : (new Date()).getTime(),
			sourceType : 2, // 1-接收，2-发送
			msgType : 1  // 1-文本
		};
		$rootScope.talkingList.push(msgInfo);
		
		//清空输入框内容
		$rootScope.data.msgContent = null;

		localStorageService.handlerSendMsg($scope.userInfo, msgInfo);
		localStorageService.handlerRecentTalkList($scope.userInfo);
		// TODO 发送消息到服务器 --------------------------------------------------------------------------
	};
	//播放声音
	$scope.sounding = function(item){
		$('audio')[0].src = item.src;
		$('audio')[0].play();
	};

	$rootScope.sendMsgByKeyup = function(event){
		if(event.keyCode === 13){
			$scope.sendMsg();
		}
	};
	$rootScope.sendMsgByButton = function(){
		//获取焦点
		// $rootScope.msgInputFocus = true;
		$scope.sendMsg();
	};

	$rootScope.focusInput = function(){
		//获取焦点
		$rootScope.msgInputFocus = false;
		$rootScope.showTools = 0;
		//$scope.changeBodyHeight();
	};
	// 监听了消息记录，保持滚动到最下方
	$scope.$watch('talkingList' , function(newValue, oldValue, scope){
		$timeout(function(){
			$scope.myScroll.refresh();
			if($scope.myScroll.maxScrollY < 0){
				var targetHtml = $(".talk-window-item:last");
				$scope.myScroll.scrollToElement(targetHtml[0] ,200);
			}
		});
	}, true);
	//监听了消息记录，保持滚动到最下方
	$scope.$watch('sectionStyle' , function(newValue, oldValue, scope){
		$timeout(function(){
			$scope.myScroll.refresh();
			var targetHtml = $(".talk-window-item:last");
			if(targetHtml.length > 0) {
				$scope.myScroll.scrollToElement(targetHtml[0],0);
			}
		});
	});


	// 消息工具
	$rootScope.handMsgTools = function(tools, $event){
		console.log('不支持类型:' + tools.text);
	};
	// 发送语音消息
	$rootScope.startRecordVoice = function(){
		$rootScope.strart4Voice = new Date();
	};
	$rootScope.sendMsg4Voice = function(){
		if($rootScope.strart4Voice === null){
			return;
		}
		var lengthInSecond = ((new Date().getTime()) - $rootScope.strart4Voice.getTime()) / 1000;
		if(lengthInSecond < 0.5){
			console.log('录制时间太短:' + lengthInSecond + 's');
			return ;
		}
		var msgInfo = {
			id : 1,
			status : Math.random() > 0.5 ? 0 : 1, // 0-成功，1-失败
			time : (new Date()).getTime(),
			src : './app/displaydata/test.mp3', //音频存放位置
			lengthInSecond : lengthInSecond.toFixed(2),
			sourceType : 2, // 1-接收，2-发送
			msgType : 2  // 1-文本 2-语音
		};
		$rootScope.talkingList.push(msgInfo);
		localStorageService.handlerSendMsg($scope.userInfo, msgInfo);
		localStorageService.handlerRecentTalkList($scope.userInfo);
		console.log('发送语音:' + lengthInSecond + 's');
		$rootScope.strart4Voice = null;
	};
	// 消息重发
	$scope.reSendMsg = function(item){
		popup.confim('消息重发', '点击<strong>确定</strong>重新发送该消息').then(function(res){
			var msgInfo = angular.copy(item);
			msgInfo.status = 0;
			msgInfo.time = (new Date()).getTime();
			$rootScope.talkingList.push(msgInfo);
			localStorageService.handlerSendMsg($scope.userInfo, msgInfo);
			localStorageService.handlerRecentTalkList($scope.userInfo);
		});
	};

	
	$scope.myScroll = new iScroll('wrapper-talkwindow', {
		useTransition : true,
		checkDOMChanges:true,
		hScroll : false,
		onScrollMove: function () {
			if(this.y < 10 ){
				$scope.tip = '下拉刷新';
			}
			if(this.y > 10){
				$scope.tipShow = true;
				$scope.tip = '释放刷新';
			}
		},
		onBeforeScrollStart: function (e) {
			//e.preventDefault();
		}, 
		onScrollEnd: function () {
			if($scope.tipShow){
				$scope.tip = '刷新中...';
				// 模拟2s请求
				setTimeout(function() {
					$scope.pageNo = $scope.pageNo + 1;
					var result = localStorageService.getRecentMsgList(userId, $scope.pageNo, $scope.pageSize);
					$rootScope.talkingList = $rootScope.talkingList.concat(result);
					$scope.tip = '刷新成功';
					$scope.tipShow = false;
				}, 1000);
			}
		}
	});

});

/* 用户列表 */

app.controller("userListController", function ($rootScope, $scope, $location, $timeout, weService) {
	
	$rootScope.title = '通讯录';
	$scope.getUserList = function(){
		$scope.userList = [];
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
			//$timeout(function(){myScroll.refresh();},200);;	
		});
	};
	$scope.getUserList();

	$scope.talk = function(user){
		$location.path("/talkWindow/" + user.id);
	};

	$scope.queryByinitial = function($event){
		//隐藏其他按钮
		var initials = $($event.target).parent().children();
		var potionY = $event.originalEvent.touches[0].pageY;
		for(var index = 0; index < initials.length; index++){
			var top = $(initials[index]).offset().top;
			var height = $(initials[index]).height();
			if(potionY > top && (potionY <= top + height)){
				break;
			}
		}
		if(index === initials.length){
			return;
		}
		var key = $(initials[index]).text();
		var targetHtml = $('SUB:contains(' + key + ')').parent().parent().parent()[0];
		$scope.myScroll.scrollToElement(targetHtml,300);
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

		//显示操作
	$scope.showOpt = function(item){
		var index = 0;
		for(; index < $scope.userList.length; index++){
			if(String($scope.userList[index].id) === String(item.id)){
				break;
			}
		}
		$scope.showOptIndex = index;
	};
	$scope.hiddenOpt = function(){
		$scope.showOptIndex = undefined;
	};

	$scope.myScroll = new iScroll('wrapper-userlist', {
		useTransition : true,
		checkDOMChanges:true,
		hScroll : false,
		onScrollMove: function () {
			if(this.y < 10 ){
				$scope.tip = '下拉刷新';
			}
			if(this.y > 10){
				$scope.tipShow = true;
				$scope.tip = '释放刷新';
			}
		},
		onBeforeScrollStart: function (e) {
			//e.preventDefault();
		}, 
		onScrollEnd: function () {
			if($scope.tipShow){
				$scope.tip = '刷新中...';
				// 模拟2s请求
				setTimeout(function() {
					$scope.getUserList();
					$scope.tipShow = false;
				}, 2000);
			}
		}
	});

});
