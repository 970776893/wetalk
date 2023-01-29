app.config( function ($routeProvider) {

	$routeProvider
	.when('/userList', {
		templateUrl: "/wetalk/app/modules/user/htmls/user_list.html",
		controller : "userListController"
	})
	.when('/talkList', {
		templateUrl: "/wetalk/app/modules/talk/htmls/talk_list.html",
		controller : "talkListController"
	})
	.when('/talkWindow/:id', {
		templateUrl: "/wetalk/app/modules/talk/htmls/talk_window.html",
		controller : "talkWindowController"
	})
	.otherwise({
		templateUrl: "/wetalk/app/modules/base/htmls/unknow.part.html",
		controller : function($rootScope, $scope){
			$rootScope.bodyClass = 'error-page';
		}
	});

});
