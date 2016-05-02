//登陆信息
app.service("commonService", function ($http) {
    return {
        //登陆
        getPublicKey : function (userId) {
            return $http({
                url : '/easyShopping/rsa/getPublicKey.json',
                method : 'get',
                dataType : 'json',
                params : {
                    userId : userId
                }
            });
        }
    };
});
