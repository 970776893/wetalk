//消息服务
app.service("weService", function ($http) {
    return {
        /*
        获取用户列表
            数据结构eg：
            [
                {
                "id": 1,  ----用户编码
                "name": "陈奕迅",   ----用户姓名
                "imgUrl": "/app/displaydata/imgs/chenyixun.png",   ----用户头像
                "initial":"C"   ----首字母，便于查询
                }
            ]
        */
        getUserList : function () {
            return $http({
                url : '/app/displaydata/userlist.json',
                method : 'get',
                dataType : 'json'
            });
        }
    };
});


//登陆信息
app.service("localStorageService", function ($http, $cookies) {
    return {
            /*
                最近聊天记录
                [
                    {
                     userId : 2,
                     userName : "陈奕迅",
                     userImgUrl : "陈奕迅",
                     noReadNum: 2,
                     lastMsgContent : "最后一条内容",
                     lastMsgTime : 16711312832
                    }
                ];
            */
        getRecentTalkList : function () {
            // 当前登陆用户
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            var recentUsers = [];
            //是否支持本地存储
            if(storage){
                var key = loginUser.id + '_recent_users';
                recentUsers = storage.getItem(key);
                if(recentUsers === null){
                    recentUsers = [];
                }else{
                    recentUsers = JSON.parse(recentUsers);
                }
                angular.forEach(recentUsers, function(rUser){
                    var iKey =  loginUser.id + "_recent_user_" + rUser.userId;
                    var talkItem = storage.getItem(iKey);
                    if(talkItem != null){
                        //最近消息
                        angular.extend(rUser, JSON.parse(talkItem));
                    }
                });
            }else{
                // TODO 请求服务器
                console.log("不支持本地存储");
            }
            return recentUsers;
        },
        /*
            收到消息后，缓存处理
        */
        handlerReceiveMsg : function (userId, userName, userImgUrl, lastMsgContent) {
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            if(storage){
                var key = loginUser.id + '_recent_users';
                var recentUsers = storage.getItem(key);
                if(recentUsers === null){
                    recentUsers = [];
                }else{
                    recentUsers = JSON.parse(recentUsers);
                }
                var isFirst = true;
                angular.forEach(recentUsers, function(rUser){
                    if(Number(rUser.userId) === Number(userId)){
                        isFirst = false;
                    }
                });
                //之前没有聊天-添加最近聊天记录
                if(isFirst){
                    recentUsers.unshift({
                        userId : userId,
                        userName : userName,
                        userImgUrl : userImgUrl
                    });
                }
                storage.setItem(key, JSON.stringify(recentUsers));
                var iKey =  loginUser.id + "_recent_user_" + userId;
                // 页面是否－当前页面
                console.log(window.location.hash);
                // 获取的消息是否是当前聊天页面
                var talkWindowUrl = '#/talkWindow/';
                var noReadNum = 1;
                if(window.location.hash.indexOf(talkWindowUrl) !== -1){
                    var talkWindowId =　Number(window.location.hash.substring(talkWindowUrl.length));
                    if(userId === talkWindowId){
                        noReadNum = 0;
                    }
                }
                //　非当前聊天页面
                if(noReadNum === 1){
                    var talkItem = storage.getItem(iKey);
                    if(talkItem !== null){
                        noReadNum = JSON.parse(talkItem).noReadNum + 1;
                    }
                }
                var content = {
                    noReadNum: noReadNum,
                    lastMsgContent : lastMsgContent,
                    lastMsgTime : (new Date()).getTime()
                };
                storage.setItem(iKey, JSON.stringify(content));
            }else{
                // TODO 请求服务器
                console.log("不支持本地存储");
            }
        }
    };
});
