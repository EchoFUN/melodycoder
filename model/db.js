
/**
 * For the database connection
 */

var mongoose = require('mongoose'),
    config = require('../config').config,
    EventProxy = require('eventproxy').EventProxy;

exports.initialize = function() { 
    var db = mongoose.createConnection(config.db.DB_HOST, config.db.DB_NAME);
    global.db = db;
    
    var menuSchema = mongoose.Schema({title: String, url: String});
    db.model('Menu', menuSchema);

    var postSchema = mongoose.Schema({date: Date, author: String, title: String, content: String});
    db.model('Post', postSchema);

    var linkSchema = mongoose.Schema({title: String, url: String});
    db.model('Link', linkSchema);

    var categorySchema = mongoose.Schema({pid: String, title: String});
    db.model('Category', categorySchema);

    var tagSchema = mongoose.Schema({pid: String, title: String});
    db.model('Tag', tagSchema);

    var commentSchema = mongoose.Schema({pid: String});
    db.model('Comment', commentSchema);

    var self = this;
    return function initialize(req, resp, next) {
        req.dbEvt = self;
        next();
    }
}

var dbMenu = require('./db.menu'),
    dbPost = require('./db.post'),
    dbLink = require('./db.link');

// 获取所有的菜单选项
exports.getAllMenus = dbMenu.getAllMenus

// 获取所有的文章列表
exports.getAllPosts = dbPost.getAllPosts;

// 获取所有的链接的列表
exports.getLinks = dbLink.getLinks;

// 获取单篇文章
exports.getPost = dbPost.getPost;