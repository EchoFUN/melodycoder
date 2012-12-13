/**
 * @fileOverview Melody coder 文章的发布器，包括了对文章的读取，分析，以及最后的发布一套流程
 * @author <a href="mailto:xukai.ken@gmail.com">(XU Kai)xukai.ken@gmail.com</a>
 * @version 0.1
 *
 */

var fs = require('fs');

var Publisher = function(opts) {
	this.opts = opts || {};
	this.init();
};

var fn = Publisher.prototype;
fn.init = function() {
	var articles = [];

	// 查找统计目录中扩展名为.json的文件
	var files = fs.readdirSync('./');
	for (var j = 0; j < files.length; j++) {
		var fName = files[j];
		var extName = fName.split('.').pop();
		if (extName == 'json') {
			articles.push(fName);
		}
	}

	// 分析该文件的结构是否合法

};

var parser = new require('./parser');
new Publisher(parser);
