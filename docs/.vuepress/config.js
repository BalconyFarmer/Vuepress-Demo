module.exports = {
    title: 'Adroi媒体API 接口文档',  // 设置网站标题
    description : 'Adroi',
    base : '/v1/adroi-h5/adroiapi/',
    themeConfig : {
        nav: [
            {text: '首页', link: '/'},
            {text: '前端文档', link: '/guide/'},
            {text: '组件库', link: '/component/'},
            {text: '问题库', link: '/issues/'},
        ],
        sidebar: {
            '/guide/': [
                '',     /* /foo/ */
                'environment',  /* /部署环境安装 */
                'publishment'  /* /部署环境安装 */
            ],

            '/component/': [
                ''      /* /bar/ */
            ],
            '/issuse/': [
                ''      /* /bar/ */
            ]
        },
        displayAllHeaders: false // 默认值：false
    }
}
