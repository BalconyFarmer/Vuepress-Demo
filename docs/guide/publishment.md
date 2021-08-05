# 部署手册

## 前端

咱们的项目前端部署分为`Nginx`和`Apache`以及`Tomcat`,后面会统一用`Nginx`,现在只有省级的`10.10.3.79`用的是`Apache`,但是后面我们要统一用Gitlab和jenkins来部署,这种手动部署的模式只是暂时的.

### Nginx的部署
1.查看nignx所在的目录
```shell
nginx -t 
```
一般情况下`Nignx`的静态资源目录在`/usr/local/nginx/html/`下面


一个新的服务器,如果没有配置过nginx的配置文件,都要加上类似下面的server
```shell
server {
    listen 8083; #这个是外网的端口号
    server_name  localhost;
    client_max_body_size 1024M;
    root   /usr/local/html; # 这个是前端静态资源目录
    index  index.html index.htm;
    # 每一个项目进来都要写一下重定向，这面这行是解决使用了history模式刷新404的问题 e.g /**/index.html;
    location /demo1/ { try_files $uri $uri/ /demo1/index.html;}
    location /demo2/ { try_files $uri $uri/ /demo2/index.html;}
}
```


已经配置好了`Nginx`,为了保证一个端口下面能放多个项目,打包后的静态文件不能直接放到静态资源的跟目录下面.
比如demo1的项目,前端的文件需要这样

首先路由文件
```javascript
const router = new Router({
    base: process.env.NODE_ENV === "development" ? "/" : "demo1/",
    mode: "history",
    routes
});
```

`vue.config.js`文件
```javascript
module.exports = {
    publicPath: process.env.NODE_ENV === "development" ? "/" : "demo1/"
}
```

demo1的项目需要放在`/usr/local/nginx/html/demo1`下面, demo2的项目需要放在`/usr/local/nginx/html/demo2`下面

每次修改了`Nginx`的配置,都需要重启`Nginx`
```shell
cd /usr/local/nginx/sbin

./nginx -s reload
```

### Apache和Tomcat的部署



## 后端

1.首先看下数据库连接的是不是正式数据库
```yml
# application-druid.yml
# 220.163.102.112:4417是测试数据库,开发的时候用,部署的时候要切换到正式的数据库上,下面是雄安的数据库实例
# 部署的时候下面的几行要一定要对齐,不然会出现一些神奇的bug
source:
  # - { id: master, default: true, url: jdbc:mysql://220.163.102.112:4417/db_bigdata_XiongAn, username: root, password: Ssdsj_!&*_RedRcd_77925, driverClassName: com.mysql.cj.jdbc.Driver }
  - { id: master, default: true, url: jdbc:mysql://172.16.139.175:3306/db_zhdj_dwd, username: redrcd_dws , password: gE7CzhUZlZs242xr, driverClassName: com.mysql.cj.jdbc.Driver }
  # - { id: base, default: false, url: jdbc:mysql://220.163.102.112:4417/db_bigdata_XiongAn, username: root, password: Ssdsj_!&*_RedRcd_77925, driverClassName: com.mysql.cj.jdbc.Driver }
  - { id: base, default: true, url: jdbc:mysql://172.16.139.175:3306/db_zhdj_dwd, username: redrcd_dws , password: gE7CzhUZlZs242xr, driverClassName: com.mysql.cj.jdbc.Driver }
```

然后使用`Maven`的`clean`,随后`package`,后端的Jar包就ok了,目录在`/src/target/xxx.jar`

随后进入服务器
```shell
# 1.查看java的进程
ps -ef | grep java
```

<img :src="$withBase('/img/java-port.png')">

以支部规范化为例,找到进程号32655
```shell
# 杀掉进程
kill 32655
```

随后进入到jar包所在的位置

把现有的jar包名字后面加上今天的日期作为备份,然后把新的jar包放进去,

最后
```shell
# java -jar xxx.jar 是启动jar包, 加上前面的nohup 和后面的& 是为了后台起服务,就算这个命令行工具关了jar包任然在执行.
nohup java -jar bigdata-zbgfh-0.0.1.jar &
```
