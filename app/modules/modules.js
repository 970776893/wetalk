app.config( function ($routeProvider) {

	$routeProvider
	.when('/userList', {
		templateUrl: "/app/modules/user/htmls/user_list.html",
		controller : "userListController"
	})
	.when('/talkList', {
		templateUrl: "/app/modules/talk/htmls/talk_list.html",
		controller : "talkListController"
	})
	.when('/talkWindow/:id', {
		templateUrl: "/app/modules/talk/htmls/talk_window.html",
		controller : "talkWindowController"
	})
	.otherwise({
		templateUrl: "/app/modules/base/htmls/unknow.part.html",
		controller : function($scope){
			$('body').addClass('error-page');
		}
	});

});