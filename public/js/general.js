/**
 * @fileverview 整个站点的入口执行js文件
 * @author xukai.ken@gmail.com
 */

seajs.config({
	alias: {
		'prototype': 'http://127.0.0.1:3000/js/libs/prototype.js'
	}
});

seajs.use(YYMG.modules, function(module) {
	module.init();
});