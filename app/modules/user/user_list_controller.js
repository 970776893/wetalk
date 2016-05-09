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
