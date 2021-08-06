module.exports = {
    dest: 'dist', // (输出目录)
    title: 'Adroi媒体API 接口文档',  // 设置网站标题
    description: 'Adroi',
    base: '/vuepressDemo/dist',
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
        sidebar: { // 配置侧边栏部分
            '/comps/': ['/comps/', '/comps/select.md'],
            '/comps1/': ['/comps1/', '/comps1/comps1Fist.md']
        },

        displayAllHeaders: true // 默认值：false
    },

}
