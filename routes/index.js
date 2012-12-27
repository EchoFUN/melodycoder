/**
 * @fileoverview 站点核心部分控制器
 * @version 2012.10.03
 *
 */

var config = require('../config').config, EventProxy = require('eventproxy').EventProxy, utils = require('../utils');

var isIE6 = function(req) {
	var userAgent = req.headers['user-agent'], browser = utils.browser(userAgent);
	var isIE6 = false;
	if (browser.browser == 'msie' && browser.version == 6) {
		isIE6 = true;
	}
	return isIE6;
};

var _middle = function(req, resp, func, params) {
	var proxy = new EventProxy();
	var eventHooks = ['menus', 'links', 'archives', 'widgetTags'];
	if (params.hasPost)
		eventHooks.push('posts');
	proxy.assign(eventHooks, func);

	var dbEvt = req.dbEvt;
	dbEvt.getAllMenus(function(menus) {
		proxy.trigger('menus', menus);
	});
	dbEvt.getLinks(function(links) {
		proxy.trigger('links', links);
	})
	dbEvt.getArchives(function(archives) {
		proxy.trigger('archives', archives);
	});
	dbEvt.getWidgetTags(function(widgetTags) {
		proxy.trigger('widgetTags', widgetTags);
	});
	if (params.hasPost) {
		dbEvt.getPosts(params.startPost, params.endPost, function(posts, categories, tags, comments) {
			proxy.trigger('posts', {
				posts : posts,
				tags : tags,
				comments : comments,
				categories : categories
			});
		});
	}
};

exports.index = function(req, resp) {
	var PAGE_COUNT = config.site.PAGE_COUNT, page = (!isNaN(Number(req.query.page))) ? Number(req.query.page) : 1;

	var params = {
		hasPost : true,
		startPost : (page - 1) * PAGE_COUNT,
		endPost : page * PAGE_COUNT
	}
	_middle(req, resp, function(menus, links, archives, widgetTags, posts) {
		var proxy = new EventProxy();
		proxy.assign('postCount', 'data', function(postCount, data) {
			data.postCount = postCount;
			resp.render('index', data);
		});

		// 页面的基本数据
		var baseInfo = config.site;
		var vtype = 1;
		var data = {
			vtype : vtype,
			site : baseInfo,
			menus : menus,
			links : links,
			currentPage : page,
			widgetTags : widgetTags,
			archives : archives,
			posts : posts.posts,
			tags : posts.tags,
			comments : posts.comments,
			categories : posts.categories,
			url : req.url
		};
		proxy.trigger('data', data);

		// 翻页信息
		var dbEvt = req.dbEvt;
		dbEvt.getPostCount(function(postCount) {
			proxy.trigger('postCount', postCount);
		});
	}, params);
};

exports.about = function(req, resp) {
	var params = {
		hasPost : false
	}
	_middle(req, resp, function(menus, links, archives) {
		var baseInfo = config.site;
		var vtype = 2;
		var data = {
			menus : menus,
			links : links,
			vtype : vtype,
			site : baseInfo,
			url : req.url
		};
		resp.render('index', data);
	}, params);
};

exports.experiment = function(req, resp) {
	var params = {
		hasPost : false
	}
	_middle(req, resp, function(menus, links, archives) {
		var baseInfo = config.site;
		var vtype = 3;
		var data = {
			links : links,
			menus : menus,
			vtype : vtype,
			site : baseInfo,
			url : req.url,
			isIE6 : isIE6(req)
		};
		resp.render('index', data);
	}, params);
};

// 获取当前网站的状态信息
exports.information = function() {
	
};
