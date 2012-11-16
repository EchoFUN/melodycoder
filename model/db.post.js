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
exports.getPosts = function() {
	var Post = db.models.Post, Tag = db.models.Tag, Category = db.models.Category, Comment = db.models.Comment;
	var proxy = new EventProxy;

	var arg = arguments, startPost = 0, endPost = 10, callback = function() {
	};
	if ( typeof arg[0] == 'function') {
		callback = arg[0];
	} else {
		startPost = arg[0];
		endPost = arg[1];
		callback = arg[2];
	}

	var eventHooks = ['posts', 'categories', 'tags', 'comments'];
	proxy.assign(eventHooks, callback);
	Post.find().skip(startPost).limit(endPost).sort({
		date : 1
	}).exec(function(error, posts) {
		var pids = [];
		for (var i in posts) {
			var pid = posts[i]._id;
			pids.push(pid.toString());
		}
		Category.find({
			pid : {
				'$in' : pids
			}
		}, function(error, categories) {
			proxy.trigger('categories', categories);
		});
		Tag.find({
			pid : {
				'$in' : pids
			}
		}, function(error, tags) {
			proxy.trigger('tags', tags);
		});
		Comment.find({
			pid : {
				'$in' : pids
			}
		}, function(error, comments) {
			proxy.trigger('comments', comments);
		});
		proxy.trigger('posts', posts);
	});
}

/**
 * @description 获取单篇文章的内容
 * @param {string} pid 需要获取的文章的id
 * @param {function} callback 获取内容成功后的回调
 */
exports.getPostById = function(pid, callback) {
	var Post = db.models.Post, Tag = db.models.Tag, Category = db.models.Category, Comment = db.models.Comment;
	var proxy = new EventProxy;
	var eventHooks = ['post', 'tags', 'categories', 'comments'];
	proxy.assign(eventHooks, callback);
	Post.findById(pid, function(error, post) {
		var date = post.date;
		Post.find({}, '_id title', function() {

		});

		// 更具时间获取前后两篇文章
		// var postTime = post.date;
		// console.log(postTime.toString());

		proxy.trigger('post', post);
	});
	Tag.find({
		pid : pid
	}, function(error, tags) {
		proxy.trigger('tags', tags);
	});
	Category.find({
		pid : pid
	}, function(error, categories) {
		proxy.trigger('categories', categories);
	});
	Comment.find({
		pid : pid
	}, function(error, comments) {
		proxy.trigger('comments', comments);
	});
}

/**
 * @description 获取近期发表的文章
 * @param {function} callback 获取内容成功后的回调
 */
exports.getRectPosts = function(callback) {
	var Post = db.models.Post;
	Post.find({}, '_id, title').sort({
		date : 1
	}).limit(5).exec(function(error, Posts) {
		callback(Posts);
	});
}

/**
 * @description 获取所有的归档文件
 * @param {function} callback 获取内容成功后的回调
 */
exports.getArchives = function(callback) {
	var Post = db.models.Post;
	Post.find({}, 'date').sort({
		date : 1
	}).exec(function(error, oriArchives) {
		var Archives = [];
		for (var i = 0; i < oriArchives.length; i++) {
			var _a = oriArchives[i].date;
			var date = _a.getFullYear() + '年' + _a.getMonth() + '月';
			var _has = false;
			for (var j = 0; j < Archives.length; j++) {
				if (Archives[j].summary == date) {
					_has = true;
					break;
				}
			}
			if (!_has) {
				Archives.push({
					full : _a,
					summary : date
				});
			}
		}
		callback(Archives);
	});
}

