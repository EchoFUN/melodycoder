/**
 * @fileoverview 文章的增，删，该，查文件修改和调整
 * @version 2012.10.02
 */

var config = require('../config').config, EventProxy = require('eventproxy').EventProxy;

var dh = dh || {}, dbEvt = {}, proxy = new EventProxy;

var _middle = function(req, resp, func) {
	dbEvt = req.dbEvt;
	var eventHooks = ['getMenus', 'getLinks', 'getRectPosts'];
	proxy.assign(eventHooks, func);

	dbEvt.getAllMenus(function(menus) {
		dh.menus = menus;
		proxy.trigger('getMenus');
	});
	dbEvt.getRectPosts(function(rectPosts) {
		dh.rectPosts = rectPosts;
		proxy.trigger('getRectPosts');
	});
	dbEvt.getLinks(function(links) {
		dh.links = links;
		proxy.trigger('getLinks');
	});
}

exports.index = function(req, resp) {
	_middle(req, resp, function() {
		var pid = req.query.pid, archive = req.query.archive;
		if (pid) {
			var render = function(view, options) {
				resp.render(view, options);
			}
			proxy.assign('view', 'options', render);
			proxy.trigger('view', 'index');
			dbEvt.getPostById(pid, function(post, tags, categories, comments) {
				post.tags = tags;
				post.categories = categories;
				post.comments = comments;
				var baseInfo = config.site;
				data = {
					vtype : 4,
					site : baseInfo,
					menus : dh.menus,
					url : req.url,
					links : dh.links,
					post : post,
					rectPosts : dh.rectPosts
				};
				proxy.trigger('options', data);
			});
		} else if (archive) {
			;
		} else {
			resp.redirect(config.site.SITE_BASE_URL);
		}
	});
}

exports.addComment = function(req, resp) {
	var ret = {
		status : {
			code : 0
		},
		data : new Date().getTime()
	};
	ret.status.code = dbEvt.addComment(req.body);
	resp.end(JSON.stringify(ret));
}