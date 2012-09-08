
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

    // 创建分类模型
    var categorySchema = mongoose.Schema({pid: String, title: String});
    db.model('Category', categorySchema);

    // 创建标签模型
    var tagSchema = mongoose.Schema({pid: String, title: String});
    db.model('Tag', tagSchema);

    var self = this;
    return function initialize(req, resp, next) {

        // 如果是静态文件则跨过数据库层
        var staticExts = ['jpg', 'png', 'gif', 'js', 'css'];
        var ext = req.url.split('.').pop();

        if (staticExts.indexOf(ext) == -1) {
            var proxy = new EventProxy();
            var eventHooks = ['getPosts', 'getMenus', 'getLinks'];
            proxy.assign(eventHooks, next);
            
            // 存放预处理的所有的公共数据，菜单，所有的文章，etc.
            var dh = req.dataHandler = {};
            self.getAllMenus(function(menus) {
                dh.menus = menus;
                proxy.trigger('getPosts');
            });
            self.getAllPosts(function(posts, categories, tags) {
                dh.posts = posts;
                dh .categories = categories;
                dh.tags = tags;
                proxy.trigger('getMenus');
            });
            self.getLinks(function(links) {
                dh.links = links;
                proxy.trigger('getLinks');
            })
        } else {
            req.dataHandler = {};
            next();
        }
    }
}

// 获取所有的菜单选项
exports.getAllMenus = function(callback) {
    var Menu = db.models.Menu;
    Menu.find(function(error, content){
        callback(content);
    });
}

// 获取所有的文章列表
exports.getAllPosts = function(callback) {
    var Post = db.models.Post,
        Tag = db.models.Tag,
        Category = db.models.Category;

    var proxy = new EventProxy;
    var eventHooks = ['posts', 'categories', 'tags'];
    proxy.assign(eventHooks, callback);

    Post.find(function(error, posts) {
        var pids = [];
        for(var i in posts) {
            var pid = posts[i]._id;
            pids.push(pid.toString());
        }
        Category.find({pid: {'$in': pids}}, function(error, categories) {
            proxy.trigger('categories', categories);
        });
        Category.find({pid: {'$in': pids}}, function(error, tags) {
            proxy.trigger('tags', tags)
        });
        proxy.trigger('posts', posts);
    });

}

// 获取所有的链接的列表
exports.getLinks = function(callback) {
    var Link = db.models.Link;
    Link.find(function(error, content) {
        callback(content);
    });
}

























