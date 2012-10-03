/**
 * @fileoverview 文章的增，删，该，查文件修改和调整
 * @version 2012.10.02
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
        var pid = req.query.pid;
        if(pid) {
            var baseInfo = config.site;
            var vtype = 1;
            data = {vtype: vtype, site: baseInfo, menus: dh.menus, url: req.url, links: dh.links};
            resp.render('index', data);
        } else {
            console.log('Not found');
        }
    });
}