/**
 * @fileoverview 对评论的操作
 * @version 2012.10.04
 *
 */

/**
 * @description 获取某个文章的所有评论
 * @param {string} pid 需要获取评论数目的文章的id
 *
 */
exports.getComments = function(pid) {
    var Comment = db.models.Comment;
    Comment.find({pid: pid}, function(error, comments) {

    });
}