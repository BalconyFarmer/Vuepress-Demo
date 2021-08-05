# 组件库指南

## 前言

::: tip 前言
为了解决项目搬来搬去修改重复bug的问题,把一些基本上不会动并且复用性特别高的页面封装成组件,以组件的形式在项目中调用,
然后把一些常用的小组件封装起来,还有统一的样式和iconfont都放到一块
:::

## 规划目录结构
现在咱们需要一个`packages`存放组件,然后`example`存放示例

现在先新建一个`packages`,然后把现有的`src`改成`example`,把项目改成这个结构之后会造成两个问题:
1. `src`改成`example`之后项目跑不起来
2. 新增的`packages`,不会被`webpack`编译,所以需要添加配置对该目录的支持

需要把`vue.config.js`修改为如下
```javascript
// 这是vue.config.js的部分配置,其他的配置不用动
module.exports = {
    pages: {
        index: {
            entry: "example/main.js",
            template: "public/index.html",
            filename: "index.html"
        }
    },
    chainWebpack: config => {
        config.module.rule("js").include.add(__dirname + "packages").end().use("babel").loader("babel-loader");
    }
};
```
## 创建一个新组件
上面我们配置好了新的目录结构

``` js
├─ public  /*这个里面放不需要编译的静态文件,可以用过/根目录来访问到*/
└─ example
└─ packages
   ├─ api 
   ├─ assets /*静态文件目录*/
   ├─ commonComponents /*公共组件目录*/
   ├─ config
   │    └─ index.js /*全局变量*/
   ├─ libs 
   ├─ Plugins
      ├─ PartyOrgPortrait 
      └─ Zbgf 
        └─ src /*组件源码*/
        └─ index.js  /*对外提供对组件的引用*/
      └─ idnex.js /*整合所有的组件，对外导出，即一个完整的组件库*/
   ├─ router
   ├─ store /*Vuex仓库,每个模块对应一个js*/
   ├─ styles /*样式文件目录*/
 ├─ .env.development /*开发环境的配置*/
 └─ .env.production /*生产环境的配置*/
 └─ package.json
 └─ vue.config.js
```

首先先看下`packages/Plugins/Zbgf/index.js`
```javascript
// 导入组件，组件必须声明 name
import Zbgfh from "./src";
import zbgfhAtlas from "./src/centerPart/org-atlas.vue";

// 为组件提供 install 安装方法，供按需引入
Zbgfh.install = function(Vue) {
    Vue.component(Zbgfh.name, Zbgfh);
    Vue.component(zbgfhAtlas.name, zbgfhAtlas);
};

// 默认导出组件
export { Zbgfh, zbgfhAtlas };
```

`packages/Plugins/index.js`这个文件是整合这个页面里面所有的组件对外导出,比如支部规范化就有一个支规的页面和一个详情的弹窗,其他页面可能会有更多.

::: tip 注意事项
1.我们的页面是带有store的,在编写页面的store时,都要加上namespaced,防止和宿主项目的store冲突,Vuex会报混淆的错误

2.导出的时候不仅要导出组件,还要导出install方法
:::
```javascript
// 组件
import { Zbgfh, zbgfhAtlas } from "./Zbgf";

// vuex的store文件
import zbgfhstore from "../store/modules/zbgf";
import "../echarts/echarts";
console.log("Zbgfh", Zbgfh);
console.log("zbgfhAtlas", zbgfhAtlas);

const components = [Zbgfh, zbgfhAtlas];

// 这一步判断window.Vue是否存在，因为直接引用vue.min.js， 它会把Vue绑到Window上，我们直接引用打包好的js才能正常跑起来。
if(typeof window !== "undefined" && window.Vue) {
    window.Vue.component("redrcd-zbgfh", components);
}

// opts是用户传入的store
const install = function(Vue, opts = {}) {
    console.log(opts);
    if(!opts.store) {
        console.log("Please provide a store!");
    }
    // 动态注册store
    if(opts.store) {
        opts.store.registerModule("zbgfh", zbgfhstore);
        console.log(opts.store);
        components.map(component => {
            Vue.component(component.name, component);
        });
    }
};

if(typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    Zbgfh,
    zbgfhAtlas
};
```

## 编写示例

在组件项目中测试就用这种方法,带上需要传的参数
`example/zbgfh.vue`

``` vue
<template>
    <div class="height-full width-full">
        <zbgf :po-code="poCode" :region-code="regionCode" :po-name="poName" @zbgf-goto-hx="zbgfGotoHx"></zbgf>
    </div>
</template>

<script>
import zbgfhh from "../packages/Plugins/Zbgf/src/index";
export default {
    name: "zbgfh",
    components: { zbgf: zbgfhh },
    data() {
        return {
            poCode: "001.001.053",
            regionCode: "53",
            poName: "云南省"
        };
    },
    methods: {
        zbgfGotoHx(params) {
            console.log(params);
        }
    }
};
</script>

<style scoped>

</style>

```

## 打包

在根目录下面的`package.json`中`scripts`下面新增一条lib
```json
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "lib": "vue-cli-service build --target lib --name zbgfh packages/Plugins/index.js"
},
```

在`vue cli`的官方文档中,我们可以找到打包库模式的方法.详细了解参考[vue-cli 构建目标库方法](https://cli.vuejs.org/zh/guide/build-targets.html#%E6%9E%84%E5%BB%BA%E7%9B%AE%E6%A0%87)

::: tip 注意对Vue的依赖
在库模式中，`Vue` 是外置的。这意味着包中不会有 `Vue`，即便你在代码中导入了 `Vue`。如果这个库会通过一个打包器使用，它将尝试通过打包器以依赖的方式加载 `Vue`；否则就会回退到一个全局的 `Vue` 变量。
:::

你可以通过下面的命令将一个单独的入口构建为一个库：
```shell
vue-cli-service build --target lib --name myLib [entry]
```

打包后的结构是这样的
```shell
File                     Size                     Gzipped

dist/myLib.umd.min.js    13.28 kb                 8.42 kb
dist/myLib.umd.js        20.95 kb                 10.22 kb
dist/myLib.common.js     20.57 kb                 10.09 kb
dist/myLib.css           0.33 kb                  0.23 kb
```

这个入口可以是一个 .js 或一个 .vue 文件。如果没有指定入口，则会使用 src/App.vue。
构建一个库会输出：
+ `dist/myLib.common.js`: 一个给打包器用的 CommonJS 包 (不幸的是，webpack 目前还并没有支持 ES modules 输出格式的包)
+ `dist/myLib.umd.js`: 一个直接给浏览器或 AMD loader 使用的 UMD 包
+ `dist/myLib.umd.min.js`: 压缩后的 UMD 构建版本
+ `dist/myLib.css`: 提取出来的 CSS 文件 (可以通过在 vue.config.js 中设置 css: { extract: false } 强制内联)

::: tip 什么是UMD
`commonJS`、`requireJS` 都是用来处理JS模块化的，其中 `commonJS` 用来给 `nodejs` 使用（使用了 `module.exports` 的用法）。后来使用 `import/export` 来导出/引入模块。`umd` 是统一模块定义方法，可以兼容所有其他的模块定义方法。
:::

到这为止, 要么就是打包上传的`npm`上面,要么直接把`umd`文件引入到项目当中去,因为考虑到上传到`npm`,需要创建`npm`私服,因为数据请求也封装在里面了,不能直接放到互联网上
;第二就是每次有改动的时候宿主项目都需要手动去`npm install` 最新的版本才能使用, 对于已经上线了的项目很不方便,因为我们后续的改动几率还挺大的.
所以先暂时把打包后的js放到党建云上,其他项目直接调用这个script标签就行了.

## 使用方法

以支部规范化为例子

::: warning 提示
+ 每个宿主项目的高德地图key可能都不一样,宿主项目需要引入高德地图(我们的项目基本上都有),然后由于mapStyle是和key一一对应的,所以有地图的组件mapStyle都需要传进去
+ 因为有一些项目是https域名的,所以统一打包放到服务器上都需要做https的映射,现在先统一放到`10.10.3.79`上`/data/apache/commoncomponents`上面.
+ 组件的名字在IDE里面会报错找不到,这个不用管,`console.log(zbgfh)`能打印出来就行.
:::
  
+ 第一步在`public/index.html`里面引入`umd`的js
```javascript
<script type="text/javascript" src="https://sj.bigdata.1237125.cn/commoncomponents/zbgfh/zbgfh.umd.min.js"></script>
```

+ 第二步,如果组件里面有store,那需要在在`main.js`里面把组件的store注册到项目的store上面
```javascript
Vue.use(zbgfh.default, { store });
```

+ 第三步,把组件引入到页面中去
```vue
<template>
  <div class="zbgf-box">
    <zbgfh
        :po-code="poCode"
        :region-code="regionCode"
        :po-name="poName"
        :token="token"
        :mapStyle="mapStyle"
        :background-image="backgroundImage"
        @zbgf-goto-hx="zbgfGotoHx"
    ></zbgfh>
  </div>
</template>
<script >
export default {
  name: "index",
  components: { zbgfh: zbgfh.default.Zbgfh },
  data() {
    return {
      dyhxShow: false,
      poCode: "001.001.053", // 传入的poCode,看不同地方的数据
      isHasChildren: "1", // 有没有下级, 1代表有下级, 0代表没有下级, 是支部
      regionCode: "53", // 传入的regionCode, 一般用做画地图的轮廓和处理数据
      poName: "云南省", // 根组织的名称
      mapStyle: "", // 每个项目自己的mapStyle
      token: "", // 预留的token,等统一的用户中心做起来之后token再用
      backgroundImage: require("../../assets/images/container-bg.jpg") // 每个项目的背景图片不一样, 这里需要传入该项目的背景图片
    };
  },
  methods: {
    zbgfGotoHx() {
      // TODO 去党组织画像
    }
  }
};
</script>
<style lang="scss">
.zbgf-box { height: 100%; width: 100%; 
  /*TODO 这里可以改一些局部的样式*/
}
</style>
```
