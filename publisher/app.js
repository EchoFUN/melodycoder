/**
 * @fileOverview Melody coder 文章的发布器，包括了对文章的读取，分析，以及最后的发布一套流程
 * @author <a href="mailto:xukai.ken@gmail.com">(XU Kai)xukai.ken@gmail.com</a>
 * @version 0.1
 *
 */

var fs = require('fs'), http = require('http'), log = require('./logger'), config = require('../config').config, parser = require('./parser');

var Parser = parser.Parser;
var Logger = log.Logger;

var Publisher = function(opts) {
  this.opts = opts || {};
  this.init();
};

var pFn = Publisher.prototype;

// 初始化
pFn.init = function() {
  var articles = [], isSuccess = false;

  // 查找统计目录中扩展名为.json的文件
  var files = fs.readdirSync('./');
  for (var j = 0; j < files.length; j++) {
    var fName = files[j];
    var extName = fName.split('.').pop();
    if (extName == 'json') {
      articles.push({
        title : fName
      });
    }
  }

  // 分析该文件的结构是否合法
  for (var t = 0; t < articles.length; t++) {
    var article = articles[t];

    try {
      var content = fs.readFileSync('./' + article.title);
      Logger.log('Read the content from article ' + article.title + ' .');

      var hook = this.opts.parser.parse(content);
      if (hook) {
        for (var i in hook) {
          article[i] = hook[i];
        }
      }
    } catch (e) {
      Logger.log(e.message);
      return;
    }
  }
  this.publish(articles, function() {
    Logger.log('Publish the article successfully !');
  });
};

// 拼装命令行后边的参数列表
pFn.getParams = function() {
  var flag = false;
  
  var arguments = process.argv.splice(2);
  arguments.forEach(function(item) {
    if (item === '--update') {
      flag = true;
    }
  });
  
  if (flag) {
    return '&isupdate=' + flag;
  } else {
    return '';
  }
};

// 发布文章
pFn.publish = function(articles, callback) {
  var self = this;

  var send = function(article, index) {
    var reqData = 'r=' + encodeURIComponent(JSON.stringify(article)) + self.getParams();

    // 发送文章到服务器
    var options = {
      hostname : '127.0.0.1',
      port : 3000,
      path : config.site.ARTICLE_PUBLISH_URL,
      method : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : reqData.length,

        'Cookie' : 'yymg.sid=s%3AkSrezO1HD7KlrDCLXXAZr7ol.Q8InmOCLZK%2Bo4I18lcZzM9oAYzwMFYl4N%2BTMjtglwaA'
      }
    };

    Logger.log('Request the interface form server side .');

    return;
    var req = http.request(options, function(resp) {
      if (resp.statusCode == 200) {
        resp.on('data', function(chunk) {
          chunk = JSON.parse(chunk);
          if (chunk.status.code == 1) {
            callback();
          } else {
            Logger.error(chunk.status.content);
          }
        });
      }
    });
    req.on('error', function(e) {
      Logger.log('Problem with request: ' + e.message);
    });

    // 写数据
    req.write(reqData);
    req.end();
  };
  articles.forEach(send);
};

new Publisher({
  parser : new Parser('BASIC')
});

