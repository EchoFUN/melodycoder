/**
 * @fileoverview 日志模块的执行
 * @author xukai.ken@gmail.com
 * 
 */

define(function(require, exports, module) {
	exports.init = function() {
		
		// 回复区域的问题
		var submitEl = $('respond');
		Event.observe(submitEl, 'click', function(evt) {
			var This = Element.extend(this), target = evt.target;
			
			// 提交单表
			if(target.className == 'submit') {
				
				new Ajax.Request({
					
				});
			}
		});
	}
	
	exports.listInit = Prototype.emptyFunction;
});