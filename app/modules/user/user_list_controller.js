/* 用户列表 */

app.controller("userListController", function ($rootScope, $scope, $location, $timeout, weService) {
	
	$rootScope.title = '通讯录';
	$scope.getUserList = function(){
		$scope.userList = [];
		//初始化数据-获取用户列表
		weService.getUserList().then(function(res){
			//原始数据
			$scope.userListOrg = res.data;
			// 搜索的时候回事是变化
			$scope.userList = res.data;
			//整理右侧的query
			$scope.queryKeyList = [];
			angular.forEach($scope.userList, function(user){
				var queryKey = user.initial;
				var flag = true;
				angular.forEach($scope.queryKeyList, function(qk){
					if(qk === queryKey){
						flag = false;
						return ;
					}
				});
				if(flag){
					$scope.queryKeyList.push(queryKey);
				}
			});
			//$timeout(function(){myScroll.refresh();},200);;	
		});
	};
	$scope.getUserList();

	$scope.talk = function(user){
		$location.path("/talkWindow/" + user.id);
	};

	$scope.queryByinitial = function($event){
		//隐藏其他按钮
		var initials = $($event.target).parent().children();
		var potionY = $event.originalEvent.touches[0].pageY;
		for(var index = 0; index < initials.length; index++){
			var top = $(initials[index]).offset().top;
			var height = $(initials[index]).height();
			if(potionY > top && (potionY <= top + height)){
				break;
			}
		}
		if(index === initials.length){
			return;
		}
		var key = $(initials[index]).text();
		var targetHtml = $('SUB:contains(' + key + ')').parent().parent().parent()[0];
		$scope.myScroll.scrollToElement(targetHtml,300);
	};
	//搜索
	$scope.queryByKey = function(){
		$scope.userList = [];
		angular.forEach($scope.userListOrg, function(user){
			if(user.name.indexOf($scope.queryData) !== -1){
				$scope.userList.push(user);
			}
		});
	};
	//搜索-结束
	$scope.queryByKeyBLur = function(){
		$scope.userList = $scope.userListOrg;
		$scope.queryData = null;
	};

		//显示操作
	$scope.showOpt = function(item){
		var index = 0;
		for(; index < $scope.userList.length; index++){
			if(String($scope.userList[index].id) === String(item.id)){
				break;
			}
		}
		$scope.showOptIndex = index;
	};
	$scope.hiddenOpt = function(){
		$scope.showOptIndex = undefined;
	};

	$scope.myScroll = new iScroll('wrapper-userlist', {
		useTransition : true,
		checkDOMChanges:true,
		hScroll : false,
		onScrollMove: function () {
			if(this.y < 10 ){
				$scope.tip = '下拉刷新';
			}
			if(this.y > 10){
				$scope.tipShow = true;
				$scope.tip = '释放刷新';
			}
		},
		onBeforeScrollStart: function (e) {
			//e.preventDefault();
		}, 
		onScrollEnd: function () {
			if($scope.tipShow){
				$scope.tip = '刷新中...';
				// 模拟2s请求
				setTimeout(function() {
					$scope.getUserList();
					$scope.tipShow = false;
				}, 2000);
			}
		}
	});

});
