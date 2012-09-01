
/**
 * For the database connection
 */

var mongoose = require('mongoose'),
    config = require('../config').config,
    EventProxy = require('eventproxy').EventProxy;

exports.initialize = function() {

    // 取出公用的组件，将其放入到界面上
    var db = mongoose.createConnection(config.db.DB_HOST, config.db.DB_NAME);
    global.db = db;
    
    // 创建菜单选项模型
    var menuSchema = mongoose.Schema({title: String, url: String});
    db.model('Menu', menuSchema);

    // 创建文章选项的模型
    var postSchema = mongoose.Schema({date: Date, author: String, title: String, content: String});
    db.model('Post', postSchema);

    // 创建连接部分的模型
    var linkSchema = mongoose.Schema({title: String, url: String});
    db.model('Link', linkSchema);

    var self = this;
    return function initialize(req, resp, next) {

        // 如果是静态文件则不走数据库层 
        // if (!静态文件) {
            var proxy = new EventProxy();
            var eventHooks = ['getPosts', 'getMenus', 'getLinks'];
            proxy.assign(eventHooks, next);
            
            // 存放预处理的所有的公共数据，菜单，所有的文章，etc.
            req.dataHandler = {};
            self.getAllMenus(function(menus) {
                req.dataHandler.menus = menus;
                proxy.trigger('getPosts');
            });
            self.getAllPosts(function(posts) {
                req.dataHandler.posts = posts;
                proxy.trigger('getMenus');
            });
            self.getLinks(function(links) {
                req.dataHandler.links = links;
                proxy.trigger('getLinks');
            })
        // } else {
        //     next();
        // }
    }
}

// 获取所有的菜单选项
exports.getAllMenus = function(callback) {
    var handler = db.models.Menu;
    handler.find(function(error, content){
        callback(content);
    });
}

// 获取所有的文章列表
exports.getAllPosts = function(callback) {
    var handler = db.models.Post;
    handler.find(function(error, content) {
        callback(content);
    });
}

// 获取所有的链接的列表
exports.getLinks = function(callback) {
    var handler = db.models.Link;
    handler.find(function(error, content) {
        callback(content);
    });
}