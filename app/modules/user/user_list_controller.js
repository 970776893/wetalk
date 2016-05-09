/* 用户列表 */

app.controller("userListController", function ($rootScope, $scope, $location, weService) {
	//初始化数据
	//$scope.userList = [];
	weService.getUserList().then(function(res){
		$scope.userList = res.data;
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
	// $scope.queryKeyList = [];
	// for(var i = 0 ; i < 26; i ++){
	// 	$scope.queryKeyList.push(String.fromCharCode(65 + i));
	// }

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
