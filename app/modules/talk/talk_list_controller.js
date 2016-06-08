/* 用户列表 */

app.controller("talkListController", function ($rootScope, $scope, $location, localStorageService) {
	$rootScope.title = '聊天';
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
		$location.path("/talkWindow/" + talkItem.userId);
	};

});
