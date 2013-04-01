/**
 * 获取网站通用信息的接口
 */

var async = require('async'), commentModule = require('./db.comment');

exports.getSiteStatus = function(callback) {
    var status = {
        code: 0,
        content: '请求成功'
    };

    async.parallel({
        comments: function(callback) {
            commentModule.getRemainedComments(callback)
        }
    }, function(err, results) {
        if (!err)
            status.code = 1; 
        else 
            status.content = err.getMessage();
        
        callback(status, results, err);
    });
};