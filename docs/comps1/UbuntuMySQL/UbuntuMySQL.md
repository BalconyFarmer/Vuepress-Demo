# ubuntu安装mysql : 

参考链接:https://www.cnblogs.com/zhuyp1015/p/3561470.html

```
1. sudo apt-get install mysql-server

2. apt-get isntall mysql-client

3. sudo apt-get install libmysqlclient-dev

4. sudo netstat -tap | grep mysql //通过上述命令检查之后，如果看到有mysql 的socket处于 listen 状态则表示安装成功。

5. mysql -u root -p //登陆mysql
```



# 本地连接数据库错误解决方法:

 https://blog.csdn.net/u013700358/article/details/80306560

# 远程连接数据库错误解决方法 : 

- ## 尝试Mysql配置文件/etc/my.cnf解析(成功)

https://www.jianshu.com/p/5f39c486561b

注销掉 12.0.0.1 这段代码,这段代码的意思是端口只对localhost开放.

- ### 配置文件在这里:

https://www.cnblogs.com/kerrycode/p/9749096.html

- ## 尝试 给root增加权限可以被远程访问


GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;

- ## 尝试创建可以被远程访问的用户和密码:


https://cloud.tencent.com/developer/article/1004788



