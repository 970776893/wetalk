/* 用户列表 */

app.controller("talkWindowController", function ($rootScope, $scope, $location) {
	//初始化数据
	$scope.historyList = [
		{
			id : 1,
			content : '双双真矫情',
			isMine: 0
		},{
			id : 1,
			content : '对呀对呀',
			isMine: 1
		},{
			id : 1,
			content : '反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污',
			isMine: 1
		},{
			id : 1,
			content : '有多污啊',
			isMine: 0
		},{
			id : 1,
			content : '反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污反正是很污',
			isMine: 0
		}
	];

	// 回车键发送消息
	$scope.keySend = function($event){
		if($event.keyCode === 13){
			$scope.sendMsg();
		}
	};
	//发送消息
	$scope.sendMsg = function(){
		//内容为空则不发送信息
		if(!$scope.inputContent){
			return ;
		}
		//正在发送，置灰发送按钮
		$scope.sending = true;
		$scope.historyList.push({
			id : 1,
			content : $scope.inputContent,
			isMine : 1
		});
		//滚动条滚动到底部
		$(document).scrollTop($(document).height());
		//清空输入框内容
		$scope.inputContent = null;
		//正在完毕，启动发送按钮
		$scope.sending = false;
	};

});
