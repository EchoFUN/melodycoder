/**
 * @fileOverview Melody coder 文章的发布器，包括了对文章的读取，分析，以及最后的发布一套流程
 * @author <a href="mailto:xukai.ken@gmail.com">(XU Kai)xukai.ken@gmail.com</a>
 * @version 0.1
 *
 */

var fs = require('fs'), 
	http = require('http'),
	log = require('./logger'),
	config = require('../config').config;
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
				name : fName
			});
		}
	}

	// 分析该文件的结构是否合法
	for (var j = 0; j < articles.length; j++) {
		var article = articles[j];

		try {
			var content = fs.readFileSync('./' + article.name);

			var Parser;
			if (this.opts.parser)
				Parser = this.opts.parser
			var hook = Parser.parse(content);
			if (hook)
				for (var i in hook)
				article[i] = hook[i];
		} catch (e) {
			Logger.log('Error getting the content for the file .');
		}
	}
	this.publish(articles, function() {
		
	});
};

// 发布文章
pFn.publish = function(articles, callback) {
	var send = function(article, index) {

		// 发送文章到服务器
		var options = {
			hostname : config.SITE_BASE_URL,
			port : 80,
			path : config.ARTICLE_PUBLISH_URL,
			method : 'POST'
		}
		Logger.log('Request the interface form server side .');
		var req = http.request(options, function(resp) {
			
			callback();
		});
	};
	articles.forEach(send);
};

var Parser = parser.Parser;
new Publisher({
	parser : new Parser('BASIC')
});

