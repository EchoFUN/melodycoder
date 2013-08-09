/**
 * @fileoverview 站点核心部分控制器
 * @version 2012.10.03
 *
 */

var config = require('../config').config, utils = require('../utils'), fs = require('fs'), path = require('path'), async = require('async');

var isIE6 = function(req) {
  var userAgent = req.headers['user-agent'], browser = utils.browser(userAgent);
  var isIE6 = false;
  if (browser.browser == 'msie' && browser.version == 6) {
    isIE6 = true;
  }
  return isIE6;
};

var dbEvt;
var _middle = function(req, resp, func, params) {
  dbEvt = req.dbEvt;

  var callbackStack = {
    menus : function(callback) {
      dbEvt.getAllMenus(callback);
    },
    links : function(callback) {
      dbEvt.getLinks(callback);
    },
    archives : function(callback) {
      dbEvt.getArchives(callback);
    },
    rectPosts : function(callback) {
      dbEvt.getRectPosts(callback);
    },
    widgetTags : function(callback) {
      dbEvt.getWidgetTags(callback);
    }
  };

  if (params.hasPost) {
    callbackStack.posts = function(callback) {
      dbEvt.getPosts(params.startPost, callback);
    };
  }
  async.parallel(callbackStack, function(error, result) {
    
    //判断当前用户是否登录
    config.site.user = req.session.user;
    func(result);
  });
};

exports.index = function(req, resp) {
  var PAGE_COUNT = config.site.PAGE_COUNT, page = (!isNaN(Number(req.query.page))) ? Number(req.query.page) : 1;

  var params = {
    hasPost : true,
    startPost : (page - 1) * PAGE_COUNT
  };
  _middle(req, resp, function(result) {
    var dbEvt = req.dbEvt;

    async.parallel({
      postCount : function(callback) {
        dbEvt.getPostCount(callback);
      },
      data : function(callback) {

        // 处理加载的css
        var ugcCss = [];
        var posts = result.posts;
        if (posts.posts) {
          for (var i in posts.posts) {
            var tpst = posts.posts[i];

            var tpth = '/css/ugc/' + tpst._id.toString() + '.css';
            if (fs.existsSync(path.resolve('./public' + tpth)))
              ugcCss.push(tpth);
          }
        }

        callback(null, {
          result : result,
          vtype : 1,
          site : config.site,
          currentPage : page,
          tags : posts.tags,
          comments : posts.comments,
          categories : posts.categories,
          url : req.url,
          ugcCss : ugcCss,
          env : process.env.NODE_ENV
        });
      }
    }, function(error, data) {
      var result = data.data;
      result.postCount = data.postCount;
      resp.render('index', result);
    });
  }, params);
};

exports.about = function(req, resp) {
  var params = {
    hasPost : false
  };

  _middle(req, resp, function(result) {
    var data = {
      result : result,
      vtype : 2,
      site : config.site,
      url : req.url,
      env : process.env.NODE_ENV
    };
    resp.render('index', data);
  }, params);
};

exports.experiment = function(req, resp) {
  var params = {
    hasPost : false
  };

  _middle(req, resp, function(result) {
    var data = {
      result : result,
      vtype : 3,
      site : config.site,
      url : req.url,
      env : process.env.NODE_ENV,
      isIE6 : isIE6(req)
    };
    resp.render('index', data);
  }, params);
};

// 获取当前网站的状态信息
exports.status = function(req, resp) {
  dbEvt = req.dbEvt;
  var query = {
    hasRight : false,
    site : config.site
  };
  if (req.session.user) {
    query.hasRight = true;
    dbEvt.getSiteStatus(function(status, data) {
      query.status = status;
      query.comments = data.comments;
      resp.render('status', query);
    });
  } else {
    resp.render('status', query);
  }
};

exports.notfound = function(req, resp) {
  var params = {
    hasPost : false
  };

  _middle(req, resp, function(result) {
    var data = {
      result : result,
      // vtype : 3,
      site : config.site,
      url : req.url,
      env : process.env.NODE_ENV
    };
    resp.render('index', data);
  }, params);
};
