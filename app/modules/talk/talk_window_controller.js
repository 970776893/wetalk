/* 用户列表 */

app.controller("talkWindowController", function ($rootScope, $scope, $location, $routeParams, $cookies, $timeout, weService, localStorageService) {
	
	var userId = String($routeParams.id);
	// 根据用户ID获取用户信息 --------------------------------------------------------------------------
	weService.getUserList().then(function(res){
		angular.forEach(res.data, function(user){
			if(String(user.id) === userId){
				$scope.userInfo = user;
				$rootScope.title = $scope.userInfo.name;
			}
		});
	});

	$scope.loginUser = $cookies.getObject('loginUser');
	$scope.pageNo = 1;
	$scope.pageSize = 3;
	//初始化数据
	$rootScope.talkingList = localStorageService.getRecentMsgList(userId, $scope.pageNo, $scope.pageSize);

	//发送消息
	$scope.sendMsg = function(){
		var inputContent = $("#msgInput").val();
		//内容为空则不发送信息
		if(!inputContent){
			return ;
		}
		//正在发送，置灰发送按钮
		$scope.sending = true;
		var msgInfo = {
			id : 1,
			content : inputContent,
			status : Math.random() > 0.5 ? 0 : 1, // 0-成功，1-失败
			time : (new Date()).getTime(),
			sourceType : 2, // 1-接收，2-发送
			msgType : 1  // 1-文本
		};
		$rootScope.talkingList.push(msgInfo);
		
		//清空输入框内容
		$("#msgInput").val(null);

		localStorageService.handlerSendMsg($scope.userInfo, msgInfo);
		localStorageService.handlerRecentTalkList($scope.userInfo);
		// TODO 发送消息到服务器 --------------------------------------------------------------------------
	};

	$rootScope.sendMsgByKeyup = function(event){
		if(event.keyCode === 13){
			$scope.sendMsg();
		}
	};
	$rootScope.sendMsgByButton = function(){
		//获取焦点
		$rootScope.msgInputFocus = true;
		$scope.sendMsg();
	};

	$rootScope.focusInput = function(){
		//获取焦点
		$rootScope.msgInputFocus = false;
		$rootScope.showTools = false;
		//$scope.changeBodyHeight();
	};
	// 监听了消息记录，保持滚动到最下方
	$scope.$watch('talkingList' , function(newValue, oldValue, scope){
		$timeout(function(){
			$('section')[0].scrollTop = $('section')[0].scrollHeight;
		});
	}, true);
});
