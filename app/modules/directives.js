/* 
 * 页面模板-内容 
 * eg:<we-layout></we-layout>
 */
app.directive('weLayout', function () {
    return {
        restrict: 'EA',
        templateUrl: '/app/modules/base/htmls/layout.part.html',
        controller : function($rootScope, $scope, $location){
        	$scope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl){
        		// url 便于下方导航栏的显示当前所在的按钮颜色
        		$scope.url = $location.$$url;
        		//为每个页面动态添加独自的url，便于定制化开发（eg：聊天页面不显示下方导航栏）
        		var className = 'we' + '-' + newUrl.substring(newUrl.indexOf('#') + 2).toLocaleLowerCase();
        		className = className.substring(0, className.indexOf('/'))
        		$('body').addClass(className);
        		if(newUrl !== oldUrl){
	        		//删除上一个页面class
	        		var rmClassName = 'we' + '-' +  oldUrl.substring(oldUrl.indexOf('#') + 2).toLocaleLowerCase();
	        		rmClassName = rmClassName.substring(0, rmClassName.indexOf('/') );
	        		$('body').removeClass(rmClassName);
        		}
        	});
        }
    };
});


/* 
 *  封装三个滑动时间（开始时，滑动中，结束时） 
 *  eg:ng-touchmove="someFunction($event)"
*/
app.directive("ngTouchstart", function () {
	return {
		controller: function ($scope, $element, $attrs) {
			function onTouchStart(event) {
				var method = $element.attr('ng-touchstart');
				$scope.$event = event;
				$scope.$apply(method);
			}
			$element.bind('touchstart', onTouchStart);
		}
	};
});
app.directive("ngTouchmove", function () {
	return {
		controller: function ($scope, $element, $attrs) {
			function onTouchStart(event) {
				event.preventDefault();
				$element.bind('touchmove', onTouchMove);
				$element.bind('touchend', onTouchEnd);
			}
			function onTouchMove(event) {
				var method = $element.attr('ng-touchmove');
				$scope.$event = event;
				$scope.$apply(method);
			}
			function onTouchEnd(event) {
				event.preventDefault();
				$element.unbind('touchmove', onTouchMove);
				$element.unbind('touchend', onTouchEnd);
			}
			$element.bind('touchstart', onTouchStart);
		}
	};
});
app.directive("ngTouchend", function () {
	return {
		controller: function ($scope, $element, $attrs) {
			function onTouchEnd(event) {
				var method = $element.attr('ng-touchend');
				$scope.$event = event;
				$scope.$apply(method);
			}
			$element.bind('touchend', onTouchEnd);
		}
	};
});