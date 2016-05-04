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
