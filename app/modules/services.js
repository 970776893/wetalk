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


//本地存储信息
app.service("localStorageService", function ($rootScope, $http, $cookies) {
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
                    var iKey =  loginUser.id + "_history_" + rUser.userId;
                    var historyList = storage.getItem(iKey);
                    if(historyList != null){
                        //最近消息
                        historyList = JSON.parse(historyList);
                        var lastmsg = historyList[historyList.length-1];
                        rUser.lastMsgContent = lastmsg.content;
                        rUser.lastMsgTime = lastmsg.time;
                        //未读数
                        var noReadNum = 0;
                        for(var i = 0; i < historyList.length; i++){
                            var historyItem = historyList[historyList.length - i - 1];
                            if(historyItem.sourceType === 1){
                                if(!historyItem.isRead){
                                    noReadNum ++;
                                }else{
                                    break;
                                }
                            }
                        }
                        rUser.noReadNum =  noReadNum;
                    }
                });
            }else{
                console.log("不支持本地存储");
            }
            return recentUsers;
        },
        /*
            获取最近聊天记录

            [
              {
                "id": "1",
                "content": "我收到你得消息了。-测试",
                "time": 1465293529060,
                "sourceType": 1,
                "msgType": 1,
                "isRead": false
              },
              {
                "id": 1,
                "content": "nihao ",
                "time": 1465293529059,
                "sourceType": 2,
                "msgType": 1
              }
            ]

            @params userId 用户ID
        */
        getRecentMsgList : function (userId) {
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            var historyList;
            if(storage){
                // start-- 最近聊天记录 --
                var hKey =  loginUser.id + "_history_" + userId;
                historyList = storage.getItem(hKey);
                if(historyList !== null){
                    historyList = JSON.parse(historyList);
                }else {
                    historyList = [];
                }
                // 未读数
                for(var i = 0; i < historyList.length; i++){
                    var historyItem = historyList[i];
                    if(historyItem.sourceType === 1){
                        historyItem.isRead = true;
                    }
                }
                storage.setItem(hKey, JSON.stringify(historyList));
                // end -- 最近聊天记录 --
            }else{
                console.log("不支持本地存储");
            }
            return historyList;
        },
        /*
            收到消息后，缓存处理

            @params userInfo 发送人信息
            @params msgInfo  收到的消息信息
        */
        handlerReceiveMsg : function (userInfo, msgInfo) {
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            if(storage){
                // start -- 聊天记录 --
                var hKey =  loginUser.id + "_history_" + userInfo.id;
                var historyList = storage.getItem(hKey);
                if(historyList === null){
                    historyList = [];
                }else{
                    historyList = JSON.parse(historyList);
                }
                // 最多存储100条
                if(historyList.length === 100){
                    historyList.pop();
                }
                // 获取的消息是否是当前聊天页面
                var isTalkWindows = $rootScope.isTalkingUser(userInfo.id);
                var storeMsg = {
                    id : msgInfo.id,
                    content  : msgInfo.content,
                    time : (new Date()).getTime(),
                    sourceType : 1,  // 1-接收，2-发送
                    msgType : msgInfo.msgType,     // 1-文本，2-语音
                    isRead : isTalkWindows //当前才窗口默认已读
                };
                historyList.push(storeMsg);
                storage.setItem(hKey, JSON.stringify(historyList));
                // end -- 聊天记录 --
            }else{
                console.log("不支持本地存储");
            }
        },
        /*
            收到消息后，缓存处理

            @params userInfo 接收人
            @params msgInfo 消息
        */
        handlerSendMsg : function (userInfo, msgInfo) {
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            if(storage){
                // start -- 聊天记录 --
                var hKey =  loginUser.id + "_history_" + userInfo.id;
                var historyList = storage.getItem(hKey);
                if(historyList === null){
                    historyList = [];
                }else{
                    historyList = JSON.parse(historyList);
                }
                // 当前正在聊天窗口
                historyList.push(msgInfo);
                storage.setItem(hKey, JSON.stringify(historyList));
                // end -- 聊天记录 --
            }else{
                console.log("不支持本地存储");
            }
        },
        /*
            最近联系人

            @params userInfo 用户信息
        */
        handlerRecentTalkList : function(userInfo){
            var loginUser = $cookies.getObject('loginUser');
            var storage = window.localStorage;
            if(storage){
                // start-- 最近聊天列表 --
                var key = loginUser.id + '_recent_users';
                var recentUsers = storage.getItem(key);
                if(recentUsers === null){
                    recentUsers = [];
                }else{
                    recentUsers = JSON.parse(recentUsers);
                }
                var index = -1;
                for(var i = 0; i < recentUsers.length; i++){
                    var rUser = recentUsers[i];
                    if(String(rUser.userId) === String(userInfo.id)){
                        index = i;
                        break;
                    }
                }
                if(index > 0){
                    //不是第一个,删除原来的
                    recentUsers.splice(index, 1);
                }
                //添加最近的聊天
                if(index !== 0){
                    recentUsers.unshift({
                        userId : userInfo.id,
                        userName : userInfo.name,
                        userImgUrl : userInfo.imgUrl
                    });
                }
                storage.setItem(key, JSON.stringify(recentUsers));
                // end -- 最近聊天列表
            }else{
                console.log("不支持本地存储");
            }
        }

    };
});
