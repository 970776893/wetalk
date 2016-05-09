//登陆信息
app.service("weService", function ($http) {
    return {
        //获取用户列表
        getUserList : function () {
            return $http({
                url : '/app/displaydata/userlist.json',
                method : 'get',
                dataType : 'json'
            });
        }
    };
});
