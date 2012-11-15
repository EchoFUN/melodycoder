/**
 * @fileoverview 站点核心部分控制器
 * @version 2012.10.03
 *
 */

var config = require('../config').config,
    EventProxy = require('eventproxy').EventProxy;

var dh = dh || {};

var _middle = function(req, resp, func, params) {
    var proxy = new EventProxy();
    var eventHooks = ['getPosts', 'getMenus', 'getLinks'];
    proxy.assign(eventHooks, func);

    var dbEvt = req.dbEvt;
    dbEvt.getAllMenus(function(menus) {
        dh.menus = menus;
        proxy.trigger('getMenus');
    });
    dbEvt.getPosts(function(posts, categories, tags, comments) {
        dh.tags = tags;
        dh.posts = posts;
        dh.comments = comments;
        dh.categories = categories;
        proxy.trigger('getPosts');
    });
    dbEvt.getLinks(function(links) {
        dh.links = links;
        proxy.trigger('getLinks');
    })
}

exports.index = function(req, resp) {
	var PAGE_COUNT = config.site.PAGE_COUNT, page = (!isNaN(Number(req.query.page)))? Number(req.query.page) : 1; 
	
	var params = {
		startPost: (page - 1) * PAGE_COUNT,
		endPost: page * PAGE_COUNT
	}
    _middle(req, resp, function(){
        var baseInfo = config.site;
        var vtype = 1;
        var data = {vtype: vtype, site: baseInfo, menus: dh.menus, posts: dh.posts, tags: dh.tags, comments: dh.comments, categories: dh.categories,  url: req.url, links: dh.links};
        resp.render('index', data);
    }, params);
};

exports.about = function(req, resp) {
    var params = {
    	hasPost: false
    }
    _middle(req, resp, function(){
        var baseInfo = config.site;
        var vtype = 2;
        resp.render('index', {vtype: vtype, site: baseInfo, menus: dh.menus, url: req.url, links: dh.links});
    });
};

exports.experiment = function(req, resp) {
	var params = {
		hasPost: false
	}
    _middle(req, resp, function(){
        var baseInfo = config.site;
        var vtype = 3;
        resp.render('index', {vtype: vtype, site: baseInfo, menus: dh.menus, url: req.url, links: dh.links});
    });
};