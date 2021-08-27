module.exports = {
    dest: 'dist', // (输出目录)
    title: 'Adroi媒体API 接口文档',  // 设置网站标题
    description: 'Adroi',
    base: '/vuepressDemo/dist/',
    themeConfig: {
        //配置顶部导航栏
        nav: [
            {
                text: '首页',
                link: '/'
            },
            {
                text: '组件',
                link: '/comps/'
            },
            {
                text: '测试',
                link: '/comps1/'
            },
        ],
        //配置组件页文档的侧边栏
        sidebar: { // 配置侧边栏部分 //增加文档,配置此处.
            '/comps/': ['/comps/', '/comps/select.md'],
            '/comps1/': [
                { title: 'Ubuntu18.04安装MySQL',path:'/comps1/UbuntuMySQL/UbuntuMySQL.md'},
                { title: 'vue打包发布到Nginx',path:'/comps1/vue打包发布到Nginx/vue打包发布到Nginx.md'},
            ]
        },

        displayAllHeaders: true // 默认值：false
    },

}
