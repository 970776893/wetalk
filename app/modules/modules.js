app.config( function ($routeProvider) {

	$routeProvider
	.when('/userList', {
		templateUrl: "/app/modules/user/htmls/user_list.html",
		controller : 'userListController'
	})
	.otherwise({
		templateUrl: "/app/modules/base/htmls/unknow.part.html"
	});

});