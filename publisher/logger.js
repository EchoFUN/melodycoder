/**
 * @fileOverview Melody coder 发布器的日志打印
 * @author <a href="mailto:xukai.ken@gmail.com">(XU Kai)xukai.ken@gmail.com</a>
 * @version 0.1
 *
 */

var fs = require('fs');

var LOGGER = './puglisher.log';
var Logger = {
	toFile : false,

	_check : function() {
		var isExist = fs.existsSync(LOGGER);
		if (!this.toFile)
			if (!isExist)
				return fs.openSync(LOGGER, "w");
	},

	log : function(message) {
		this._check();
		var prefix = '------ Log ------ + ';
		message = prefix + message;
		if (this.toFile)
			fs.appendFile(LOGGER, message, encoding = 'utf8');
		else
			console.log(message);
	},

	warm : function() {
		this._check();
	},

	error : function() {
		this._check();
	},

	success : function() {

	}
};

exports.Logger = Logger;
