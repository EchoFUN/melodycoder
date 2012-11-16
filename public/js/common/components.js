/**
 * @fileverview 前端基本组件库
 * @author xukai.ken@gmail.com
 */

define(function(require, exports, module) {
	
	// 弹框组件	
	var dialogHTML = '';
	var dialogTPL = new Template('');
	
	var dialog = Class.create({
		initialize: function(opts) {
			var dopts = {
				title: '提示',
				top: 0,
				left: 0,
				content: ''
			}
			opts = Object.extend(dopts, opts);
			this.opts = opts;
		},
		
		setWidth: function() {
			
		},
		
		setContent: function() {
			
		}
	});
	exports.dialog = dialog;
		
});