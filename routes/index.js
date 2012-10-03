/**
 * @fileoverview 站点核心部分控制器
 * @version 2012.10.03
 *
 */

var config = require('../config').config,
    EventProxy = require('eventproxy').EventProxy;

var dh = dh || {};

var _middle = function(req, resp, func) {
    var proxy = new EventProxy();
    var eventHooks = ['getPosts', 'getMenus', 'getLinks'];
    proxy.assign(eventHooks, func);

    var dbEvt = req.dbEvt;
    dbEvt.getAllMenus(function(menus) {
        dh.menus = menus;
        proxy.trigger('getMenus');
    });
    dbEvt.getAllPosts(function(posts, categories, tags) {
        dh.posts = posts;
        dh.categories = categories;
        dh.tags = tags;
        proxy.trigger('getPosts');
    });
    dbEvt.getLinks(function(links) {
        dh.links = links;
        proxy.trigger('getLinks');
    })
}

exports.index = function(req, resp) {
    _middle(req, resp, function(){
        var baseInfo = config.site;
        var vtype = 1;
        var data = {vtype: vtype, site: baseInfo, menus: dh.menus, posts: dh.posts, tags: dh.tags, categories: dh.categories,  url: req.url, links: dh.links};
        resp.render('index', data);
    });
};

exports.test = function(req, res) {
    console.log(new Date());
    var data = [{result: {isLike: 0}}, {result: {isPlayHd: 0}}]
    res.end(JSON.stringify(data));
};

exports.about = function(req, resp) {
    _middle(req, resp, function(){
        var baseInfo = config.site;
        var vtype = 2;
        resp.render('index', {vtype: vtype, site: baseInfo, menus: dh.menus, url: req.url, links: dh.links});
    });
};

exports.experiment = function(req, resp) {
    _middle(req, resp, function(){
        var baseInfo = config.site;
        var vtype = 3;
        resp.render('index', {vtype: vtype, site: baseInfo, menus: dh.menus, url: req.url, links: dh.links});
    });
};