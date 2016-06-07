/* 用户列表 */

app.controller("talkWindowController", function ($rootScope, $scope, $location, $routeParams, $cookies, weService, localStorageService) {
	
	var userId = String($routeParams.id);
	// 根据用户ID获取用户信息
	weService.getUserList().then(function(res){
		angular.forEach(res.data, function(user){
			if(String(user.id) === userId){
				$scope.userInfo = user;
			}
		});
	});

	$scope.loginUser = $cookies.getObject('loginUser');

	//初始化数据
	$rootScope.talkingList = localStorageService.getRecentMsgList(userId);

	//收取消息
	$scope.getMsg = function(){
		var msgContent = '我收到你得消息了。-测试';
		//内容为空则不发送信息
		if(!msgContent){
			return ;
		}
		//正在发送，置灰发送按钮
		$scope.sending = true;
		$rootScope.talkingList.push({
			id : 1,
			content : msgContent,
			sourceType : 1
		});
		var msgId = 1;
		localStorageService.handlerReceiveMsg($scope.userInfo.id, $scope.userInfo.name, $scope.userInfo.imgUrl, msgContent);
		localStorageService.handlerRecentTalkList($scope.userInfo.id, $scope.userInfo.name, $scope.userInfo.imgUrl);
		//手动渲染
		$scope.$apply();
		//滚动条滚动到底部
		$(document).scrollTop(100000000);
	};
	//发送消息
	$scope.sendMsg = function(){
		var inputContent = $("#msgInput").val();
		//内容为空则不发送信息
		if(!inputContent){
			return ;
		}
		//正在发送，置灰发送按钮
		$scope.sending = true;
		$rootScope.talkingList.push({
			id : 1,
			content : inputContent,
			sourceType : 2
		});
		//滚动条滚动到底部
		$(document).scrollTop(100000000);
		//清空输入框内容
		$("#msgInput").val(null);
		//获取焦点
		//$("#msgInput").focus();
		var msgId = 1;
		localStorageService.handlerSendMsg($scope.userInfo.id, $scope.userInfo.name, $scope.userInfo.imgUrl, inputContent, msgId);
		localStorageService.handlerRecentTalkList($scope.userInfo.id, $scope.userInfo.name, $scope.userInfo.imgUrl);

		// TODO 测试收到回复 
		//$scope.getMsg();
	};
	//监听滚动事件
	$(window).scroll(function(){
		var top = $(window).scrollTop();
		if(top === 0){
			// 滚动到顶部
			$scope.showLoading = true;
			console.log($scope.showLoading);
		}
	});
	$rootScope.sendMsgByKeyup = function(event){
		if(event.keyCode === 13){
			$scope.sendMsg();
		}
	}
	$rootScope.sendMsgByButton = function(){
		$scope.sendMsg();
	}
});
