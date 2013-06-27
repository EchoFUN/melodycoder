/**
 * @fileoverview 用户权限相关的操作
 * @user XU Kai(xukai.ken@gmail.com)
 * @date 2013.06.27
 */

var utils = require('../utils');

exports.checkUser = function(name, password, callback) {
	var User = db.models.User;
	var MD5Password = utils.getMD5(password);
	
	User.find({'name':name, 'password': MD5Password}, function(error, user) {
		if (error)
			callback(error);
			
		if (user.length != 0) {
			user = user[0];			
			callback(1, user._id.toString());
		}
	});
};
