/* 用户列表 */

app.controller("talkWindowController", function ($rootScope, $scope, $location, $routeParams, $cookies, $timeout, popup, weService, localStorageService) {
	
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
	// 显示表情
	$scope.replaceEm = function(str){
		str = str.replace(/</g,'&lt;');
		str = str.replace(/>/g,'&gt;');
		str = str.replace(/\n/g,'<br/>');
		str = str.replace(/\[em-([0-9]*)\]/g, '<img src="/imgs/face/$1.gif"  border="0"/>');
		return str;
	};

	$rootScope.data = {};
	//发送消息
	$scope.sendMsg = function(){
		var inputContent = $rootScope.data.msgContent;
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
		$rootScope.data.msgContent = null;

		localStorageService.handlerSendMsg($scope.userInfo, msgInfo);
		localStorageService.handlerRecentTalkList($scope.userInfo);
		// TODO 发送消息到服务器 --------------------------------------------------------------------------
	};
	//播放声音
	$scope.sounding = function(item){
		$('audio')[0].src = item.src;
		$('audio')[0].play();
	};

	$rootScope.sendMsgByKeyup = function(event){
		if(event.keyCode === 13){
			$scope.sendMsg();
		}
	};
	$rootScope.sendMsgByButton = function(){
		//获取焦点
		// $rootScope.msgInputFocus = true;
		$scope.sendMsg();
	};

	$rootScope.focusInput = function(){
		//获取焦点
		$rootScope.msgInputFocus = false;
		$rootScope.showTools = 0;
		//$scope.changeBodyHeight();
	};
	// 监听了消息记录，保持滚动到最下方
	$scope.$watch('talkingList' , function(newValue, oldValue, scope){
		$timeout(function(){
			$('section')[0].scrollTop = $('section')[0].scrollHeight;
		});
	}, true);
	//监听了消息记录，保持滚动到最下方
	$scope.$watch('sectionStyle' , function(newValue, oldValue, scope){
		$timeout(function(){
			$('section')[0].scrollTop = $('section')[0].scrollHeight;
		});
	});


	// 消息工具
	$rootScope.handMsgTools = function(tools, $event){
		console.log('不支持类型:' + tools.text);
	};
	// 发送语音消息
	$rootScope.startRecordVoice = function(){
		$rootScope.strart4Voice = new Date();
	};
	$rootScope.sendMsg4Voice = function(){
		if($rootScope.strart4Voice == null){
			return;
		}
		var lengthInSecond = ((new Date().getTime()) - $rootScope.strart4Voice.getTime()) / 1000;
		if(lengthInSecond < 0.5){
			console.log('录制时间太短:' + lengthInSecond + 's');
			return ;
		}
		var msgInfo = {
			id : 1,
			status : Math.random() > 0.5 ? 0 : 1, // 0-成功，1-失败
			time : (new Date()).getTime(),
			src : '/app/displaydata/test.mp3', //音频存放位置
			lengthInSecond : lengthInSecond.toFixed(2),
			sourceType : 2, // 1-接收，2-发送
			msgType : 2  // 1-文本 2-语音
		};
		$rootScope.talkingList.push(msgInfo);
		localStorageService.handlerSendMsg($scope.userInfo, msgInfo);
		localStorageService.handlerRecentTalkList($scope.userInfo);
		console.log('发送语音:' + lengthInSecond + 's');
		$rootScope.strart4Voice = null;
	};
	// 消息重发
	$scope.reSendMsg = function(item){
		popup.confim('消息重发', '点击<strong>确定</strong>重新发送该消息').then(function(res){
			var msgInfo = angular.copy(item);
			msgInfo.status = 0;
			msgInfo.time = (new Date()).getTime();
			$rootScope.talkingList.push(msgInfo);
			localStorageService.handlerSendMsg($scope.userInfo, msgInfo);
			localStorageService.handlerRecentTalkList($scope.userInfo);
		});
	};
	
});
