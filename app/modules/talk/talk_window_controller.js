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
			isMine: 1
		}
	];

	// 回车键发送消息
	$scope.keySend = function($event, inputContent){
		
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
		$scope.historyList.push({
			id : 1,
			content : inputContent,
			isMine : 1
		});
		//手动渲染
		$scope.$digest();
		//滚动条滚动到底部
		//$('table').scrollTop(100000000);
		//清空输入框内容
		$("#msgInput").val(null);
		//获取焦点
		//$("#msgInput").focus(); 
		
	};

	$(window).scroll(function(){
		var s=$(window).scrollTop();
		console.log(s);
	});

	$("#msgInput").bind('keyup', function(event){
		if(event.keyCode === 13){
			$scope.sendMsg();
		}
	});
	$("#msgBtn").bind('click', function(){
		$scope.sendMsg();
	});

});
