/**
 * @fileoverview 所有关于系统中对文档进行的相关操作的方法，包括增删查改等等的操作
 * @version 2012.10.03
 *
 */

var EventProxy = require('eventproxy').EventProxy;

/**
 * @description 获取所有的文章的方法
 * @param {function} callback 获取成功后触发的回调函数
 */
exports.getAllPosts = function(callback) {
    var Post = db.models.Post, Tag = db.models.Tag, Category = db.models.Category;

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
        Tag.find({pid: {'$in': pids}}, function(error, tags) {
            proxy.trigger('tags', tags)
        });
        proxy.trigger('posts', posts);
    });
}

/**
 * @description 获取单篇文章的内容
 * @param {string} pid 需要获取的文章的id
 * @param {function} callback 获取内容成功后的回调
 */
exports.getPost = function(pid, callback) {
    var Post = db.models.Post;
    Post.findById(pid, function(error, post) {
        callback(post);
    });
}