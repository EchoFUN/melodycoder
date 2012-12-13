/**
 * @fileOverview Melody coder 发布器的日志打印
 * @author <a href="mailto:xukai.ken@gmail.com">(XU Kai)xukai.ken@gmail.com</a>
 * @version 0.1
 *
 */

var LOGGER = './puglisher.log';
var Logger = {
	_check : function() {
		var isExist = fs.existsSync(LOGGER);
		if (!isExist) {
			return fs.openSync(LOGGER, "w");
		}
	},

	log : function(message) {
		var handle = this._check();
	},

	warm : function() {
		var handle = this._check();
	},

	error : function() {
		var handle = this._check();
	}
};

exports.Logger = Logger;
