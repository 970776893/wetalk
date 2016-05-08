/* app的总入口，定制angularJS接入总配置  */
var dependencies = ['ngAnimate', 'ngRoute', 'ngTouch'];
var app = angular.module("app", dependencies);


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
        		var className = 'we' + '-' + newUrl.substring(newUrl.indexOf('#') + 2).toLocaleLowerCase().replace("/","-");
        		$('body').addClass(className);
        		if(newUrl !== oldUrl){
	        		//删除上一个页面class
	        		var rmClassName = 'we' + '-' +  oldUrl.substring(oldUrl.indexOf('#') + 2).toLocaleLowerCase().replace("/","-");
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
	.when('/talkWindow', {
		templateUrl: "/app/modules/talk/htmls/talk_window.html",
		controller : "talkWindowController"
	})
	.otherwise({
		templateUrl: "/app/modules/base/htmls/unknow.part.html"
	});

});
//登陆信息
app.service("commonService", function ($http) {
    return {
        //登陆
        getPublicKey : function (userId) {
            return $http({
                url : '/easyShopping/rsa/getPublicKey.json',
                method : 'get',
                dataType : 'json',
                params : {
                    userId : userId
                }
            });
        }
    };
});

/* 用户列表 */

app.controller("talkListController", function ($rootScope, $scope, $location) {
	//初始化数据
	$scope.talkList = [
		{
			id : 1,
			name : '陈奕迅1',
			isRead: 0
		},{
			id : 1,
			name : '陈奕迅1',
			isRead: 1
		},{
			id : 1,
			name : '陈奕迅1',
			isRead: 1
		},{
			id : 1,
			name : '陈奕迅1',
			isRead: 0
		},{
			id : 1,
			name : '陈奕迅1',
			isRead: 1
		},{
			id : 1,
			name : '陈奕迅1',
			isRead: 0
		}
	];
	$scope.queryKeyList = ['A','B','C','D','E','F'];

	$scope.showUserOpt = function($event, item){
		//隐藏其他按钮
		angular.forEach($scope.userList, function(user){
			if(user.id !== item.id){
				user.isShow = false;
			}
		});
		item.isShow = !item.isShow;
	};

	$scope.talk = function(user){
		$location.path("/talkWindow");
	};

});

/* 用户列表 */

app.controller("talkWindowController", function ($rootScope, $scope, $location) {
	//初始化数据
	$scope.historyList = [
		{
			id : 1,
			content : '双双真矫情',
			isMine: 0
		},{
			id : 1,
			content : '对呀对呀',
			isMine: 1
		},{
			id : 1,
			content : '反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污',
			isMine: 1
		},{
			id : 1,
			content : '有多污啊',
			isMine: 0
		},{
			id : 1,
			content : '反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污',
			isMine: 1
		},{
			id : 1,
			content : '对呀对呀',
			isMine: 1
		},{
			id : 1,
			content : '反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污',
			isMine: 1
		},{
			id : 1,
			content : '有多污啊',
			isMine: 0
		},{
			id : 1,
			content : '反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污',
			isMine: 1
		},{
			id : 1,
			content : '对呀对呀',
			isMine: 1
		},{
			id : 1,
			content : '反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污',
			isMine: 1
		},{
			id : 1,
			content : '有多污啊',
			isMine: 0
		},{
			id : 1,
			content : '反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污',
			isMine: 1
		}
	];

	// 回车键发送消息
	$scope.keySend = function($event, inputContent){
		
	};
	//收取消息
	$scope.getMsg = function(){
		var msgContent = '测试受到消息';
		//内容为空则不发送信息
		if(!msgContent){
			return ;
		}
		//正在发送，置灰发送按钮
		$scope.sending = true;
		$scope.historyList.push({
			id : 1,
			content : msgContent,
			isMine : 0
		});
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
		$scope.historyList.push({
			id : 1,
			content : inputContent,
			isMine : 1
		});
		//手动渲染
		$scope.$apply();
		//滚动条滚动到底部
		$(document).scrollTop(100000000);
		//清空输入框内容
		$("#msgInput").val(null);
		//获取焦点
		//$("#msgInput").focus();
		// TODO 测试收到回复 
		$scope.getMsg();
	};
	//监听滚动事件
	$(window).scroll(function(){
		var top =$(window).scrollTop();
		if(top == 0){
			// 滚动到顶部
			$scope.showLoading = true;
		}
	});

	$("#msgInput").bind('keyup', function(event){
		if(event.keyCode === 13){
			$scope.sendMsg();
		}
	});
	$("#msgBtn").bind('click', function(){
		$scope.sendMsg();
	});
});

/* 用户列表 */

app.controller("userListController", function ($rootScope, $scope, $location) {
	//初始化数据
	$scope.userList = [
		{
			id : 1,
			name : '陈奕迅1'
		},{
			id : 2,
			name : '陈奕迅2'
		},{
			id : 3,
			name : '陈奕迅3'
		},{
			id : 4,
			name : '陈奕迅4'
		}
	];
	$scope.queryKeyList = ['A','B','C','D','E','F'];

	$scope.showUserOpt = function($event, item){
		//隐藏其他按钮
		angular.forEach($scope.userList, function(user){
			if(user.id !== item.id){
				user.isShow = false;
			}
		});
		item.isShow = !item.isShow;
	};

});
