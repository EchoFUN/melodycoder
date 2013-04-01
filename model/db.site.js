/**
 * 获取网站通用信息的接口
 */

var async = require('async'), commentModule = require('./db.comment');

exports.getSiteStatus = function(callback) {

    var status = {
        code: 0,
        content: ''
    };
    var data = {};

    async.parallel({
        commentStatus: function() {
            
        }
    }, function() {
        callback(status, data);
    });
};