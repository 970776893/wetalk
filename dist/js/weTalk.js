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
        	$scope.$on('$locationChangeSuccess', function(item){
        		$scope.url = $location.$$url;
        	});
        	// $scope.$on('$locationChangeStart', function(item){
        	// 	$('.container').addClass('page-is-changing');
        	// });

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
			name : '陈奕迅1'
		},{
			id : 1,
			name : '陈奕迅1'
		},{
			id : 1,
			name : '陈奕迅1'
		},{
			id : 1,
			name : '陈奕迅1'
		},{
			id : 1,
			name : '陈奕迅1'
		},{
			id : 1,
			name : '陈奕迅1'
		}
	];
	$scope.queryKeyList = ['A','B','C','D','E','F'];

	$scope.showUserOpt = function($event, item){
		//隐藏其他按钮
		angular.forEach($scope.userList, function(user){
			if(user.id != item.id){
				user.isShow = false;
			}
		});
		item.isShow = !item.isShow;
	};

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
			if(user.id != item.id){
				user.isShow = false;
			}
		});
		item.isShow = !item.isShow;
	};

});
