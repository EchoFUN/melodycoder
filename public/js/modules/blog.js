/**
 * @fileoverview 日志模块的执行
 * @author xukai.ken@gmail.com
 * 
 */

define(function(require, exports, module) {
	var i = require('../common/interface'); dialog = require('../common/components').dialog, tpl = require('../common/tpl');
	
	var commentTPL = new Template(tpl.commentTPL);
	
	exports.init = function() {
		
		// 回复区域的问题
		var submitEl = $('respond'), commentList = $('comment-list');
		Event.observe(submitEl, 'click', function(evt) {
			var This = Element.extend(this), target = Element.extend(evt.target);
			
			// 提交单表
			if(target.className == 'submit') {
				var authorEl = This.select('.author')[0], mailEl = This.select('.mail')[0], websideEl = This.select('.webside')[0], commentEl = This.select('.comment')[0];
				
				new Ajax.Request(i.ADD_COMMENT, {
					parameters: 'author=' + authorEl.value + '&mail=' + mailEl.value + '&webside=' + websideEl.value + '&comment=' + commentEl.value + '&postId=' + YYMG.pid,
					onSuccess: function(r) {
						var r = r.responseText.evalJSON();
						if (r.status.code == 1) {
							var date = new Date(r.data), m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Spt', 'Oct', 'Nov', 'Dec'];
							var view = {
								pid: YYMG.pid,
								author: authorEl.value,
								comment: commentEl.value,
								month: m[date.getMonth()],
								date: date.getDate(),
								year: date.getFullYear(),
								hour: date.getHours(),
								minute: date.getMinutes()
							}
							var commentHTML = commentTPL.evaluate(view);
							commentList.insert(commentHTML);
						} else {
							new dialog({content: r.status.content});
						}
					},
					onFailure: function() {
						new dialog({type: 'error', content: ''});
					}
				});
			}
		});
	}
	
	exports.listInit = Prototype.emptyFunction;
});