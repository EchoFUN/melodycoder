/**
 * @fileoverview 对评论的操作
 * @version 2012.10.04
 */

var async = require('async');

/**
 * @description 获取某个文章的所有评论
 * @param {string} pid 需要获取评论数目的文章的id
 */
exports.getComments = function(pid) {
	var Comment = db.models.Comment;
	Comment.find({
		pid : pid
	}, function(error, comments) {

	});
};

/**
 * @description 保存评论
 * @param {Object} author 用户名
 * @param {Object} webside
 * @param {Object} mail
 * @param {Object} comment
 */
exports.addComment = function(cmt, callback) {
	var Comment = db.models.Comment;
	Comment.find({
		name : cmt.author
	}, function(error, comments) {
		if (error)
			throw Error();

		var isApproved = false;
		if (comments.length != 0) {
			for (var i in comments) {
				var tmpCmt = comments[i];
				if (tmpCmt.approved) {
					isApproved = true;
					break;					
				}
			}
		}
		var c = new Comment({
			pid : cmt.postId,
			name : cmt.author,
			email : cmt.mail,
			webside : cmt.webside,
			content : cmt.comment,
			date : new Date(),
			approved : isApproved
		});
		c.save(function(error, commentHook) {
			if (error) {
				callback(0, isApproved, error);
			} else {
				if (commentHook.id) {
					callback(1, isApproved);
				}
			}
		});
	});
};

/**
 * 
 * 
 */
exports.getRemainedComments = function(callback) {
	var Comment = db.models.Comment;
	
	callback(null, 1);
};