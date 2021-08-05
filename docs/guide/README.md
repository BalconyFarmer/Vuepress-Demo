## 前后端分离框架

## 所需环境

::: tip 前端:
<strong><em>Node v10.13.0</em></strong>, <strong><em>vue-cli3.0</em></strong>, <strong><em>Vue 2.x</em></strong>
:::
::: tip 后端: 
<strong><em>JDK 1.8</em></strong>
:::

## 前端部分

### 前端代码规范

#### CSS部分

<ol>
    <li>采用sass编写</li>
    <li>类的名字全部 - 连接,不能用驼峰 比如head-bg,而不是headBg</li>
    <li>.vue文件下面的style加上scope属性,约束样式生效的范围,防止css污染,如果要改UI库的样式,请到element-ui里面修改</li>
    <li>避免使用标签选择器（效率低、损耗性能）,比如 div { color: "#fff" }</li>
    <li>CSS 属性书写顺序：先决定定位宽高显示大小，再做局部细节修饰！推荐顺序：定位属性(或显示属性，display)->宽高属性->边距属性(margin, padding)->字体，背景，颜色等，修饰属性的定义</li>
</ol>

#### js部分

<ol>
    <li><strong>所有的代码4个空格缩进,最外层使用双引号,语句末尾要加分号</strong></li>
    <li>无特殊情况不允许使用原生API操作dom,谨慎使用this.$refs直接操作dom</li>
    <li>使用ES6风格编码源码,定义变量使用let,定义常量使用const,使用export,import模块化</li>
    <li>在/api/url.js下面统一定义api路径,模块太多的话新建不同模块的url.js</li>
    <li>api/xxx.js,每一个模块新建一个js,用来存放http请求方法</li>
</ol>

### 代码目录结构

``` js
├─ public  /*这个里面放不需要编译的静态文件,可以用过/根目录来访问到*/
└─ src
   ├─ api 
   │    ├─ xxx.js /*每个页面对应一个js,请求接口的方法统一放到这里*/
   │    └─ url.js /*这里放后端接口的api路径*/
   ├─ assets /*静态文件目录*/
   ├─ components /*组件目录*/
   ├─ config
   │    └─ index.js /*全局变量*/
   ├─ libs 
   ├─ plugin
   ├─ router
   ├─ store /*Vuex仓库,每个模块对应一个js*/
   ├─ styles /*样式文件*/
   │    ├─ base.scss /*字体定义以及存放公共组件的样式*/
   │    ├─ element-ui.scss /*重写element-ui样式*/
   │    ├─ index.scss /*调用其他scss文件,css的入口文件*/
   │    ├─ mixin.scss /*scss混合器,里面定义常用的类,以及css使用频率很高的css片段*/
   │    ├─ reset.scss /*重置浏览器默认样式*/
   │    ├─ transition.scss /*过渡动画样式*/
   │    └─ variables.scss /*全局变量*/
   ├─ views /*页面全部放到这里*/
   ├─ App.vue /*项目入口文件*/
   ├─ main.js 
   ├─ .env.development /*开发环境的配置*/
   ├─ .env.production /*生产环境的配置*/
   ├─ package.json
   └─ vue.config.js
```

`config/index.js`这个文件里面

``` js
baseURL: process.env.VUE_APP_API /**这里是axios请求的api基本路劲*/
// 这里的VUE_APP_API 开发的时候对应.env.development文件下面, 
// 打包的时候 对应.env.production
```

#### http请求的方法

首先我们先封装了<strong>axios</strong>在`libs/axios`,跑出了post,get和导出三个方法,一般情况下我们使用的是get方法,下面看一个实例

```js
/*
1、首先引入url接口地址和封装好的axios。
2、传参的格式{ params: {  } }。
3、没有传pageNum和pageSize的方法返回的是对象,传了pageNum和pageSize的方法返回的是数组。
4、如果在我们调用的时候没有传pageNum和pageSize,pageNum默认1,pageSize默认0, 这个时候返回所有数据。
5、如果我们传了pageSize,就会返回第pageNum页的pageSize条数据，这时具备了分页功能。
*/
import { url } from "./url";
import axios from "@/libs/axios";
export const xxx = (params) => {
    return axios.getEnDe({
        url: url.xxx,
        params: { paramMap: { params } }
    });
};
export const xxx = (params, pageNum = 1, pageSize = 0) => {
    return axios.getEnDe({
        url: url.xxx,
        params: { paramMap: { params }, pageNum, pageSize }
    });
};
```

## 后端部分

由于我们的业务只涉及到查的功能, 后端采用`SpringBoot`+`mybatis`的框架,把后端查的逻辑封装好,只需要把`sql`语句放入`mybatis`的`xml`文件中,就能生成一个后端接口,极大地提高了开发效率。

### 后端代码目录结构

``` shell
└─ main
   ├─ java /* springBoot的配置文件,已经封装好的查询逻辑和登录逻辑*/
   ├─ resources /*静态文件目录*/
   │    ├─ mapping
   │    ├─ secret /*公钥和私钥*/
   │    ├─ application.yml /*配置文件, 设置后端服务端口号*/
   │    ├─ application-api.yml /*配置文件, 设置是否加密*/
   │    ├─ application-druid.yml /*配置文件, 设置数据库配置文件*/
   │    ├─ application-namespace.yml /*配置文件, 多数据库的映射关系*/
   │    ├─ application-shiro.yml /*配置文件, 后端接口拦截*/
   │    ├─ mapping
   │    ├─ mapping
   │    └─ secret /*公钥和私钥*/
   pom.xml /*maven配置文件*/   
```

### 项目配置

#### `application.yml` 基础配置

::: warning 
数据sql语句存放路径文件名称必须是Mapping.xml结尾
:::

``` yml
mybatis.mapper-locations: classpath:mapping/*Mapping.xml
```

#### `application-api.yml` 接口配置

`api.encrypt` 接口加密配置<br> 
`api.decrypt` 接口解密配置<br>
`api.rsaKey` 服务器rsa密钥对存放路径<br>
`api.encrypt.enabled` 是否开启接口返回数据加密 默认为true<br>
`api.encrypt. jwtAlgorithm` 返回数据jwt签名算法 支持HS256 HS384 HS512 默认HS256<br>
`api.encrypt. jwtExpiration`  jwt签名过期时间，最小值为5，单位秒 默认5<br>
`api.encrypt. jwtSecret`  jwt签名密钥 客户端需使用该钥匙验证数据是否被篡改<br>
`api. decrypt. Enabled` 是否开启接口响应解密 默认true<br>
`api. decrypt. jwtSecret`  jwt签名密钥 服务端需使用该钥匙验证参数是否被篡改

#### `application-druid.yml` 数据库配置

`spring. Datasource. Druid. statViewServlet. enabled`  是否开sql监控<br>
`spring. Datasource. Druid. statViewServlet.allow`  设置白名单，不填则允许所有访问<br>
`spring. Datasource. Druid. statViewServlet.deny`  设置黑名单<br>
`spring. Datasource. Druid. statViewServlet. url-pattern`  监控页面访问路径<br>
`spring. Datasource. Druid. statViewServlet. login-username`  登录用户名<br>
`spring. Datasource. Druid. statViewServlet. login-password`  登录密码<br>
`spring. Datasource. Druid. Source`  多数据源配置<br>
`id：`  数据源唯一编号<br>
`default：`  是否是默认数据源 默认数据源只能设置一个<br>
`url：`  数据库地址jdbc:`mysql:`// `ip` `端口`/`库名`<br>
`username:`   数据库用户名<br>
`password：`  数据库密码<br>
`driverClassName：`  数据库驱动

#### `application-namespace.yml`  数据源配置

namespace.point.`数据源编号` 需要与druid中的数据源id对应<br>
`-` `命名空间名称` sql语句的namespace<br>

例如 数据库配置文件是这样的

``` yml
- { id: master, default: true, url: jdbc:mysql://xx.x.x.x:xxxx/xx, username: xx, password: xx, driverClassName: com.mysql.cj.jdbc.Driver }
- { id: sub, default: true, url: jdbc:mysql://xx.x.x.x:xxxx/xx, username: xx, password: xx, driverClassName: com.mysql.cj.jdbc.Driver }
```

那在数据源配置里面,module1和module2的mapping.xml文件对应master库,module3和module4的mapping文件对应sub这个库

``` yml
namespace:
  point:
    master:
      - module1
      - module2
    sub:
      - module3
      - module4

```

#### mapping文件详解

<ul>
    <li>配置文件里面的namespace的值就对应<strong>application-namespace.yml</strong>里面的 - module1</li>
    <li>我们开发的时候每个页面对应一个<strong>mapping.xml</strong>文件,而这个module1里面的所有sql就就查的是master这个库里面的数据</li>
    <li>每一个<strong>select</strong>对应一个接口</li>
    <li><strong>resultType="Map"</strong> 就是返回一个对象,<strong>这个必须加上,不加上会报错</strong></li>
    <li>#{username}就是前端传过来的参数</li>
    <li>mybatis里面主要用到<strong> if </strong>和<strong> choose>when </strong>的语法</li>
</ul>

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="module1">
   <select id="api1" resultType="Map">
       select po_name, org_code from table1 where po_name = #{username}
   </select>
</mapper>
```
