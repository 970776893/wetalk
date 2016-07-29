#WeTalk
部署步骤：<br/>
1. 安装nodeJS，安装步骤很简单，请自行查阅资料<br/>
2. 进入该目录（eg：cd ~/code/Wetalk/）<br/>
3. 安装grunt：<br/>
&nbsp;&nbsp; * npm install grunt-cli -g<br/>
&nbsp;&nbsp; * npm install grunt<br/>
&nbsp;&nbsp; * npm install<br/>
4. 运行（grunt）进行构建（这是开发环境，实时监测代码变更并自动更新）<br/>
5. 运行（grunt online）进行构建（这是生产环境，取消实时监测，也不会自动更新）<br/>
6. 安装nginx
7. 配置nginx，在nginx.conf的http下如下配置

` 
server {
	listen 4000;
	add_header Access-Control-Allow-Origin *;
	access_log /soft/nginx-1.9.0/logs/weTalk/access.log;
	error_log /soft/nginx-1.9.0/logs/weTalk/error.log;
	location / {
		charset utf-8;
		root /home/zhangkai/code/WeTalk/;
		index app/modules/index.html;
	}
}
` 

8. 在浏览器中输入http://localhost:4000/#/userList即可看到页面

>开发环境请运执行步骤1,2,3,4,6,7,8
>生产环境请运执行步骤1,2,3,5,6,7,8

<br/>
如果您有疑问，或者好的建议，欢迎联系我（970776893@qq.com）.<br/>