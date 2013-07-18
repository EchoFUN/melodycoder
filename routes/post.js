/**
 * @fileoverview 文章的增，删，该，查文件修改和调整
 * @version 2012.10.02
 */

var config = require('../config').config, fs = require('fs'), path = require('path'), async = require('async');

var dbEvt;
var _middle = function (req, resp, func) {
    dbEvt = req.dbEvt;

    var callbackStack = {
        menus: function (callback) {
            dbEvt.getAllMenus(callback)
        },
        links: function (callback) {
            dbEvt.getLinks(callback);
        },
        rectPosts: function (callback) {
            dbEvt.getRectPosts(callback);
        },
        archives: function (callback) {
            dbEvt.getArchives(callback);
        },
        widgetTags: function (callback) {
            dbEvt.getWidgetTags(callback);
        }
    };

    async.parallel(callbackStack, function (error, result) {
        func(result);
    });
};

// 检测修改的权限
var _checkRight = function(req, resp, func) {
	if (req.session.user)
		func(1);
	else
		func(0);
};

exports.index = function (req, resp) {
    _middle(req, resp, function (result) {
        var pid = req.query.pid;
        // if (pid) {
            dbEvt.getPostById(pid, function (post) {
                var ugcCss = [];
                if (post) {
                    var tpth = '/css/ugc/' + post._id.toString() + '.css';

                    if (fs.existsSync(path.resolve('./public' + tpth)))
                        ugcCss.push(tpth);
                }
                data = {
                    post: post,
                    result: result,
                    vtype: 4,
                    site: config.site,
                    url: req.url,
                    ugcCss: ugcCss,
                    env: process.env.NODE_ENV
                };

                resp.render('index', data);
            });
        // }
    });
};

exports.addComment = function (req, resp) {
    var ret = {
        status: {
            code: 0
        },
        data: {
            time: new Date().getTime()
        }
    };
    dbEvt.addComment(req.body, function (code, isApproved, content) {
        ret.status.code = code;
        ret.status.content = content || '';
        ret.data.isApproved = isApproved || false;
        resp.end(JSON.stringify(ret));
    });
};

exports.publishPost = function (req, resp) {
	_checkRight(req, resp, function(token) {
	    dbEvt = req.dbEvt;
	    var ret = {
	        status: {
	            code: 0
	        }
	    };
	    
	    if (token) {
	        var postData = JSON.parse(req.body.r);
	    	
	    	dbEvt.addPost(postData, function(code, content) {
	    		if (code)
		   			ret.status.code = code;
	    		else
	    			ret.status.content = content;
	    	});
	    } else {
	    	ret.status.content = '用户没有权限！';
	    }
	    resp.end(JSON.stringify(ret));
    });
};

exports.delPost = function(req, resp) {
	_checkRight(req, resp, function(token) {
		var ret = {
			status: {
				code: 0
			}
		};
		
		if (token) {
			dbEvt = req.dbEvt;
			
			var postId = req.body.pid || req.query.pid;
			dbEvt.delPost(postId, function(error) {
				if (error)
					ret.status.content = error.message;
				else
					ret.status.code = 1;
			});			
		} else {
			ret.status.content = '没有登录！';
		}
		resp.end(JSON.stringify(ret));
	});
};

