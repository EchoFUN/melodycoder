/**
 * @fileOverview Melody coder 文章的发布器，包括了对文章的读取，分析，以及最后的发布一套流程
 * @author <a href="mailto:xukai.ken@gmail.com">(XU Kai)xukai.ken@gmail.com</a>
 * @version 0.1
 *
 */

var fs = require('fs'), http = require('http'), log = require('./logger'), config = require('../config').config;
parser = require('./parser');

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

      var Parser;
      if (this.opts.parser)
        Parser = this.opts.parser;
      var hook = Parser.parse(content);
      if (hook)
        for (var i in hook)
        article[i] = hook[i];
    } catch (e) {
      Logger.log('Error getting the content for the file .');
    }
  }
  this.publish(articles, function() {
    Logger.log('Publish the article successfully !');
  });
};

// 发布文章
pFn.publish = function(articles, callback) {
  var send = function(article, index) {
    var reqData = 'r=' + encodeURIComponent(JSON.stringify(article));

    // 发送文章到服务器
    var options = {
      hostname : 'botobe.net',
      port : 3000,
      path : config.site.ARTICLE_PUBLISH_URL,
      method : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : reqData.length,

        'Cookie' : 'connect.sid=s%3AzsXGa3tei0xpkt_SKFpPa-4B.XgODjFzn2uWalE3ENJwJhc6nEaEGUrqb%2BAsWfbLhODk; __utma=209434753.1298129426.1372405898.1372405898.1372405898.1; __utmb=209434753.13.10.1372405898; __utmc=209434753; __utmz=209434753.1372405898.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
      }
    };

    Logger.log('Request the interface form server side .');
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

var Parser = parser.Parser;
new Publisher({
  parser : new Parser('BASIC')
});

