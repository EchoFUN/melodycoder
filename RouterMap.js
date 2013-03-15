var site = require('./routes/index'), user = require('./routes/user'), post = require('./routes/post'), admin = require('./routes/admin');
var config = require('./config').config;

module.exports = function(app) {
	app.get('/', site.index);
	app.get('/about-me', site.about);
	app.get('/site/login', site.login);
	app.get('/experiment', site.experiment);

	// post页面
	app.get('/post', post.index);

	// ajax 交互请求
	app.post('/comment/add', post.addComment);

	// 管理评论
	app.get('/admin/comments', admin.comments);
	
	// 文章发布
	var publishUrl = config.site.ARTICLE_PUBLISH_URL;
	app.post(publishUrl, post.publishPost);
	app.get(publishUrl, post.publishPost);
	
	// 获取当前网站的基本信息
	app.get('/site/status', site.status);
	app.post('/site/status', site.status);
}; 