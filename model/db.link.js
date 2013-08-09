/**
 * @fileoverview 对链接实例的一些基本操作
 * @version 2012.10.03
 *
 */

/**
 * @description 获取所有的链接的方法
 * @param {function} callback 获取成功后触发的回调函数
 */
exports.getLinks = function(callback) {
  var Link = db.models.Link;
  Link.find().sort({
    title: 1
  }).exec(function(error, content) {
    callback(error, content);
  });
};