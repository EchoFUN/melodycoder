
/*
 * GET home page.
 */

var config = require('../config').config,
    db = require('../model/db');

exports.index = function(req, resp) {
    var baseInfo = config.site;
    var vtype = 1;
    var dh = req.dataHandler;
    var data = {
        vtype: vtype, 
        site: baseInfo, 
        menus: dh.menus, 
        posts: dh.posts, 
        tags: dh.tags,
        categories: dh.categories,  
        url: req.url, 
        links: dh.links
    }
    resp.render('index', data);
};

exports.test = function(req, res) {
    console.log(new Date());
    var data = [{result: {isLike: 0}}, {result: {isPlayHd: 0}}]
    res.end(JSON.stringify(data));
};

exports.about = function(req, resp) {
    var baseInfo = config.site;
    var vtype = 2;
    var dh = req.dataHandler;
    resp.render('index', {vtype: vtype, site: baseInfo, menus: dh.menus, url: req.url, links: dh.links});
};

exports.experiment = function(req, resp) {
    var baseInfo = config.site;
    var vtype = 3;
    var dh = req.dataHandler;
    resp.render('index', {vtype: vtype, site: baseInfo, menus: dh.menus, url: req.url, links: dh.links});
};