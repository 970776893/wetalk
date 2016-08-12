// 确认框
app.factory('dialog', function ($uibModal) {
    return {
        confirm : function(msg,buttons){

            return $uibModal.open({
                animation : true,
                templateUrl : './app/modules/base/htmls/confirm.part.html',
                windowClass : 'dialog-confirm',
                controller : function($scope, $uibModalInstance){
                    $scope.msg = msg;
                    $scope.buttons = buttons;

                    $scope.ok = function (value) {
                        $uibModalInstance.close(value);
                    };
                }
            });
        },
        loading : function(title){
            return $uibModal.open({
                animation : true,
                size : 'sm',
                windowClass : 'dialog-loading',
                backdrop : false,
                templateUrl : './app/modules/base/htmls/loading.part.html',
                controller : function($scope, $uibModalInstance){
                    $scope.title = title;
                }
            });
        },
        options : function(title, options, cancel){
            return $uibModal.open({
                animation : true,
                windowClass : 'dialog-options',
                templateUrl : './app/modules/base/htmls/options.part.html',
                controller : function($scope, $uibModalInstance){
                    $scope.title = title;
                    $scope.options = options;
                    $scope.cancel = cancel || 'Cancel';
                    $scope.ok = function (value) {
                        $uibModalInstance.close(value);
                    };
                }
            });
        }
    };
});


// 拦截器注入
app.config(function ($httpProvider) {
    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
});