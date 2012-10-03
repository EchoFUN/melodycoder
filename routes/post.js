/**
 * @fileoverview 文章的增，删，该，查文件修改和调整
 * @version 2012.10.02
 * 
 */

var config = require('../config').config,
    EventProxy = require('eventproxy').EventProxy;

var dh = dh || {},
    dbEvt = {},
    proxy = new EventProxy;

var _middle = function(req, resp, func) {
    dbEvt = req.dbEvt;
    var eventHooks = ['getMenus', 'getLinks'];
    proxy.assign(eventHooks, func);

    dbEvt.getAllMenus(function(menus) {
        dh.menus = menus;
        proxy.trigger('getMenus');
    });
    dbEvt.getLinks(function(links) {
        dh.links = links;
        proxy.trigger('getLinks');
    });
}

exports.index = function(req, resp) {
    _middle(req, resp, function(){
        var pid = req.query.pid;
        if(pid) {
            var render = function(view, options) {
                resp.render(view, options);
            }
            proxy.assign('view', 'options', render);
            proxy.trigger('view', 'index');
            dbEvt.getPost(pid, function(item) {
                var baseInfo = config.site;
                data = {vtype: 4, site: baseInfo, menus: dh.menus, url: req.url, links: dh.links};
                proxy.trigger('options', data);
            });
        } else {
            console.log('Not found');
        }
    });
}