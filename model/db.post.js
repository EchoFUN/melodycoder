/**
 * @fileoverview 所有关于系统中对文档进行的相关操作的方法，包括增删查改等等的操作
 * @version 2012.10.03
 *
 */

var config = require('../config').config, async = require('async');

var _authentication = function(name, password, callback) {

};

/**
 * @description 获取所有的文章的方法
 * @param {function} callback 获取成功后触发的回调函数
 */
exports.getPosts = function(startPost, callback) {
	var Post = db.models.Post, Tag = db.models.Tag, Category = db.models.Category, Comment = db.models.Comment;

	Post.find().skip(startPost).limit(config.site.PAGE_COUNT).sort({
		date : -1
	}).exec(function(error, posts) {
		var pids = [];
		for (var i in posts) {
			var pid = posts[i]._id;
			pids.push(pid.toString());
		}

		async.parallel({
			categories : function(callback) {
				Category.find({
					pid : {
						'$in' : pids
					}
				}, callback);
			},
			tags : function(callback) {
				Tag.find({
					pid : {
						'$in' : pids
					}
				}, callback)
			},
			comments : function(callback) {
				Comment.find({
					pid : {
						'$in' : pids
					},
					approved : true
				}, callback);
			}
		}, function(error, result) {
			result.posts = posts;
			callback(error, result);
		});
	});
};

/**
 * @description 获取单篇文章的内容
 * @param {string} pid 需要获取的文章的id
 * @param {function} callback 获取内容成功后的回调
 */
exports.getPostById = function(pid, callback) {
	var Post = db.models.Post, Tag = db.models.Tag, Category = db.models.Category, Comment = db.models.Comment;

	Post.findById(pid, function(error, post) {
		async.parallel({
			tags : function(callback) {
				Tag.find({
					pid : pid
				}, callback);
			},
			categories : function(callback) {
				Category.find({
					pid : pid
				}, callback);
			},
			comments : function(callback) {
				Comment.find({
					pid : pid,
					approved : true
				}, callback);
			}
		}, function(error, result) {
			if (post) {
				for (var i in result)
				post[i] = result[i];
				callback(post);
			} else {
				callback();
			}
		});
	});
};

/**
 * @description 获取近期发表的文章
 * @param {function} callback 获取内容成功后的回调
 */
exports.getRectPosts = function(callback) {
	var Post = db.models.Post;
	Post.find({}, '_id, title').sort({
		date : -1
	}).limit(10).exec(function(error, Posts) {
		for (var i in Posts) {
			var title = Posts[i].title;
			Posts[i].shortTitle = (title.substr(0, 24) == title) ? title : title.substr(0, 24) + '...';
		}
		callback(error, Posts);
	});
};

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
			var month = _a.getMonth() + 1 + '';
			if (month.length == 1) {
				month = '0' + month;
			}
			var date = _a.getFullYear() + '年' + month + '月';
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
		callback(error, Archives);
	});
};

/**
 * @description 获取所有文章的总数
 * @param {function} callback
 */
exports.getPostCount = function(callback) {
	var Post = db.models.Post;
	Post.count(function(error, postCount) {
		callback(error, postCount);
	});
};

/**
 * @description 添加文章
 */
exports.addPost = function(pst) {
	var Post = db.models.Post, Tag = db.models.Tag, Category = db.models.Category;
	var date = (pst.time && pst.time.length != 0) ? new Date(parseInt(pst.time)) : new Date();
	var p = new Post({
		date : date,
		author : pst.author,
		title : pst.title,
		content : pst.content
	});

	try {
		var saveHook = function(error, postHook) {
			if (error)
				throw error;

			var pid = postHook.id;
			var tags = pst.tags.split(',');
			tags.forEach(function(tag, index) {
				new Tag({
					pid : pid,
					title : tag
				}).save();
			});
			var c = new Category({
				pid : pid,
				title : pst.category
			});
			c.save();
		};
		p.save(saveHook);
	} catch (e) {
		return 0;
	}
	return 1;
};

/**
 * @description 删除文章
 */
exports.delPost = function(pid, callback) {
	var Post = db.models.Post, Tag = db.models.Tag, Category = db.models.Category, Comment = db.models.Comment;

	var _delPost = function(callback) {
		Post.remove({
			'_id' : pid
		}, callback);
	}, _delTags = function(callback) {
		Tag.remove({
			'pid' : pid
		}, callback);
	}, _delComments = function(callback) {
		Comment.remove({
			'pid' : pid
		}, callback);
	}, _delCategory = function(callback) {
		Category.remove({
			'pid' : pid
		}, callback);
	};

	async.parallel([_delPost, _delTags, _delComments, _delCategory], function(error) {
		callback(error);
	});
};
