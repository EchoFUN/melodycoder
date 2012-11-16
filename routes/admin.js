/**
 * @fileoverview 管理员的一些列操作
 * @version 2012.11.16
 */

var config = require('../config').config, EventProxy = require('eventproxy').EventProxy;

var dh = dh || {}, dbEvt = {}, proxy = new EventProxy;

var _middle = function(req, resp, func) {
	var isLogin = req.session.isLogin;
	if (isLogin) {
		resp.redirect(config.site.SITE_BASE_URL);
	}
	func();
}

exports.comments = function(req, resp) {
	_middle(req, resp, function() {
		var baseInfo = config.site;
		var vtype = 5;
		var data = {
			vtype : vtype,
			site : baseInfo
		};
		resp.render('index', data);
	});
}