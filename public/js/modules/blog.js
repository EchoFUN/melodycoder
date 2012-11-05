/**
 * @fileoverview 日志模块的执行
 * @author xukai.ken@gmail.com
 * 
 */

define(function(require, exports, module) {
	var i = require('../common/interface');
	
	exports.init = function() {
		
		// 回复区域的问题
		var submitEl = $('respond');
		Event.observe(submitEl, 'click', function(evt) {
			var This = Element.extend(this), target = Element.extend(evt.target);
			
			// 提交单表
			if(target.className == 'submit') {
				var authorEl = This.select('.author')[0], mailEl = This.select('.mail')[0], websideEl = This.select('.webside')[0], commentEl = This.select('.comment')[0];
				
				new Ajax.Request(i.ADD_COMMENT, {
					parameters: 'author=' + authorEl.value + '&mail=' + mailEl.value + '&webside=' + websideEl.value + '&comment=' + commentEl.value,
					onSuccess: function(r) {
						
					},
					onFailure: function() {}
				});
			}
		});
	}
	
	exports.listInit = Prototype.emptyFunction;
});