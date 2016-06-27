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
		localStorageService.deleteUserHistory(item.userId);
		$scope.getTalkList();
		$rootScope.noreadNumTotal = $rootScope.noreadNumTotal - item.noReadNum;
		$scope.showOptIndex = -1;
		//取消动画效果
		$($event.target).parent().removeClass('show-opt-wapper');
	};
});
