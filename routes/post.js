/**
 * @fileoverview 文章的增，删，该，查文件修改和调整
 * @version 2012.10.02
 */

var config = require('../config').config, EventProxy = require('eventproxy').EventProxy;

var dbEvt = {}, proxy = new EventProxy;

var _middle = function(req, resp, func) {
	dbEvt = req.dbEvt;
	var eventHooks = ['menus', 'links', 'rectPosts'];
	proxy.assign(eventHooks, func);

	dbEvt.getAllMenus(function(menus) {
		proxy.trigger('menus', menus);
	});
	dbEvt.getRectPosts(function(rectPosts) {
		proxy.trigger('rectPosts', rectPosts);
	});
	dbEvt.getLinks(function(links) {
		proxy.trigger('links', links);
	});
}

exports.index = function(req, resp) {
	_middle(req, resp, function(menus, links, rectPosts) {
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
					post : post,
					menus : menus,
					links : links,
					rectPosts : rectPosts,
					vtype : 4,
					site : baseInfo,
					url : req.url
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

exports.publishPost = function(req, resp) {
	resp.end(JSON.stringify({
		status: {
			code: 1
		}
	}));
}





