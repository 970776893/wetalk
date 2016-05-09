/* 用户列表 */

app.controller("talkListController", function ($rootScope, $scope, $location) {
	//初始化数据
	$scope.talkList = [
		{
			userId : 2,
			userName : "陈奕迅",
			userImgUrl : "陈奕迅",
			noReadNum: 2,
			lastMsgContent : "最后一条内容",
			lastMsgTime : 16711312832
		}
	];


	$scope.talk = function(talkItem){
		$location.path("/talkWindow/" + talkItem.userId);
	};

});
