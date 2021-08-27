# 1Vue配置

## vue打包前,修改vue.config.js文件的如下内容

```
const BASE_URL = process.env.NODE_ENV === "production" ? "/3DEditor" : "/";
```

## 修改router/index.js

```
const router = new Router({
	...
    base: process.env.NODE_ENV === "development" ? "/test" : "/3DEditor",
})
```

## 新建nginx静态服务资源文件夹(3DEditor可替换成任意名称,但必须保持三处一致.)

![](vue%E6%89%93%E5%8C%85%E5%8F%91%E5%B8%83%E5%88%B0Nginx.assets/image-20210817140819513.png)

# 2nginx重定向配置文件修改

```
vim /etc/nginx/sites-available/defaul  // ubuntu 和 树莓派系统适用,其他操作系统或nginx版本不一样,配置文件路径可能不一样,原理一样. 
```

```
server {
	listen 8080;     #1.你想让你的这个项目跑在哪个端口
	server_name 101.34.131.94;     #2.当前服务器ip
	location / {
		      root   /var/www/html/;     #3.dist文件的位置(我是直接放在home目录下了) 
		      try_files $uri $uri/ /3Deditor/index.html;     #4.重定向(解决浏览器刷新后找不到项目文件的问题),内部文件的指向(照写)
			}
			
    location /api {  #4.当请求跨域时配置端口转发
            	proxy_pass http://47.92.76.97:8848/api; #5.转发地址
             } 
             
    location /0staticFixed { #5.设置静态资源文件夹
            	 alias /var/www/html/0staticFixed/;
             }

}

server {
	listen 8081;     #1.你想让你的这个项目跑在哪个端口
	server_name 101.34.131.94;     #2.当前服务器ip
	location / {
		      root   /var/www/html/3Deditor/;     #3.dist文件的位置(我是直接放在home目录下了) 
		      try_files $uri $uri/ /index.html;     #4.重定向(解决浏览器刷新后找不到项目文件的问题),内部文件的指向(照写)
			}

}
```

nginx -s reload 重启nginx
