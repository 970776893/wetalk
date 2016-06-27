/* 用户列表 */

app.controller("talkListController", function ($rootScope, $scope, $location, localStorageService) {
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

});
