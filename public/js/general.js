/**
 * @fileverview 整个站点的入口执行js文件
 * @author xukai.ken@gmail.com
 */

seajs.config({
	alias : {
		'prototype' : YYMG.baseUrl + '/js/libs/prototype.js'
	}
});

YYMG.modules.push('prototype');
seajs.use(YYMG.modules, function() {
	var arg = arguments, argLen = arg.length;
	document.observe("dom:loaded", function() {
		try {
			for(var i=0; i<argLen; i++) {
				var module = arg[i];
				if(module && module.init && typeof module.init == 'function')
					module.init();
			}
		} catch(e) {
			alert(e);
		}
	});
}); 