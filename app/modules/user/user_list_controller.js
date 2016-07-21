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
		myScroll.scrollToElement(targetHtml,300);
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

	$scope.pulldownFresh = function($event){
		if($('section').scrollTop() === 0){
			if($scope.swipeDownStartY === undefined){
				$scope.swipeDownStartY = $event.originalEvent.touches[0].pageY;
				return ;
			}
			if($event.originalEvent.touches[0].pageY - $scope.swipeDownStartY > 20){
				$scope.showTip = true;
				$scope.tip = '松手刷新';
			}
		}
	};
	$scope.fresh = function(){
		$scope.swipeDownStartY = undefined;
		if($scope.showTip){
			$scope.tip = '刷新中...';
			// 模拟1秒钟后，请求完成
			$timeout(function(){
				$scope.tip = '刷新成功';
				$scope.showTip = false;
			}, 1000);
		}
	};

});
