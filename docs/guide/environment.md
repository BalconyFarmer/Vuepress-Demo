# 部署文档

## 环境安装

### Nginx

1.安装gcc gcc是用来编译下载下来的nginx源码

``` shell
 yum install gcc-c++
```

2.安装pcre和pcre-devel
 PCRE(Perl Compatible Regular Expressions) 是一个Perl库，包括 perl 兼容的正则表达式库。<br>
nginx 的 http 模块使用 pcre 来解析正则表达式，pcre-devel 是使用 pcre 开发的一个二次开发库。

``` shell
yum install -y pcre pcre-devel
```

3.安装zlib zlib提供了很多压缩和解方式，nginx需要zlib对http进行gzip

``` shell
yum install -y zlib zlib-devel
```

4.安装openssl openssl是一个安全套接字层密码库，nginx要支持https，需要使用openssl

``` shell
 yum install -y openssl openssl-devel
```

5.下载nginx

``` shell
wget http://nginx.org/download/nginx-1.18.0.tar.gz
```

6.解压

``` shell
tar -zxvf nginx-1.18.0.tar.gz -C  /usr/local
```

7.cd到文件路劲,下的是什么版本就到哪个版本下面

``` shell
cd /usr/local/nginx-1.18.0
```

8.编译

``` shell
./configure --prefix=/usr --sbin-path=/usr/sbin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --pid-path=/var/run/nginx/nginx.pid --lock-path=/var/lock/nginx.lock --user=nginx --group=nginx --with-http_ssl_module --with-http_flv_module --with-http_gzip_static_module --http-log-path=/var/log/nginx/access.log --http-client-body-temp-path=/var/tem/nginx/client --http-proxy-temp-path=/var/tem/nginx/proxy --http-fastcgi-temp-path=/var/tem/nginx/fcgi --with-http_stub_status_module
```

9.安装

``` shell
make && make install
```

10.启动

``` shell
nginx -c /etc/nginx/nginx.conf
```

11. 如果出现[emerg] getpwnam("nginx") failed 错误 执行

``` shell
useradd -s /sbin/nologin -M nginx
id nginx
```

12.如果出现 [emerg] mkdir() "/var/temp/nginx/client" failed (2: No such file or directory) 错误 执行

``` shell
sudo mkdir -p /var/tem/nginx/client
```

13.如果您正在运行防火墙，请运行以下命令以允许HTTP和HTTPS通信

``` shell
sudo firewall-cmd --permanent --zone=public --add-service=http 
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload
```

14.nginx 重启<br>
<strong>进入nginx可执行目录sbin下，输入命令./nginx -s reload 即可</strong>

### JAVA环境安装

1.验证是否有了java环境

``` shell
java -version
```

如果是未找到命令就是没有安装

2.上官网下载jdk

现在的JDK需要登录Orlcle才能下载,先上官网

<a href="https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html" target="_blank">https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html</a>

<img :src="$withBase('/img/java.png')">

找到这个版本下载, 先登录oracle账号,没有的注册一个,登录成功之后就会跳到下载界面

3.解压安装

安装目录:  /usr/local<br>
解压<br>

``` shell
tar zxvf jdk-8u271-linux-x64.tar.gz -C /usr/local/
```

tar命令是用来解压压缩包的, -C 参数, 是直接压缩到哪个目录上, 这里我解压到/usr/local上面

4.配置环境变量
编辑 vim /etc/profile<br>
在这个全局环境文件最后追加下面的内容

``` shell
export JAVA_HOME=/usr/local/jdk1.8.0_271
export CLASSPATH=.:${JAVA_HOME}/jre/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar
export PATH=$PATH:${JAVA_HOME}/bin
```

然后wq!保存退出

6.刷新环境变量

``` shell
source /etc/profile
```

7.查看JDK是否已经生效

``` shell
java -version
```

<img :src="$withBase('/img/java-version.png')">
这样就是已经成功了!!


