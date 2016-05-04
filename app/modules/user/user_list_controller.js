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
