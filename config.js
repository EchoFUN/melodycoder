exports.config = {
    site: {
        
        // 网站名称
        SITE_NAME: '音韵码工',

        // 网站最基本的URL地址
        SITE_BASE_URL: 'http://localhost:3000',
        
        // 站点静态网址
        SITE_STATIC_URL: 'http://localhost:3000',
        
        // 文章上传接口
        ARTICLE_PUBLISH_URL: '/publish',
        
        // 每页显示的文章数目
        PAGE_COUNT: 10
    },

    db: {

    	DB_HOST: '127.0.0.1',

		// 数据库名称
        DB_NAME: 'yymg'
    },

    SESSION_SECRET: '音韵码工'
}