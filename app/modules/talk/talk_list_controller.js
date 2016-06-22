/* 用户列表 */

app.controller("talkListController", function ($rootScope, $scope, $location, localStorageService) {
	$rootScope.title = '消息';
	//初始化数据
	$scope.getTalkList = function(){
		$scope.talkList = localStorageService.getRecentTalkList();
		var today = new Date();
		angular.forEach($scope.talkList, function(talk){
			var msgTime = new Date(talk.lastMsgTime);
			if(today.getFullYear() === msgTime.getFullYear() && today.getMonth() === msgTime.getMonth() && today.getDate() === msgTime.getDate()){
				talk.isToday = true;
			} 
		});
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
	$scope.optHistory = function(item){
		var userId = item.userId;
		var index = 0;
		for(; index < $scope.talkList.length; index++){
			if(String($scope.talkList[index].userId) === String(item.userId)){
				break;
			}
		}
		console.log(index);
		$scope.showOptIndex = index;
	};
	$scope.hiddenOpt = function(){
		$scope.showOptIndex = -1;
	}

});
