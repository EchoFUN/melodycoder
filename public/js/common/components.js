/**
 * @fileverview 前端基本组件库
 * @author xukai.ken@gmail.com
 */

define(function(require, exports, module) {

	// 弹框组件
	var dialog = Class.create({
		initialize : function(opts) {
			var scrollTop = document.viewport.getScrollOffsets().top;
			var dopts = {
				top : scrollTop + 200,
				left : 0,
				title : '提示',
				frame : '<div class="dialog"><div class="normal"><div class="title-bar"><a href="javascript:;" class="title left">提示</a><a href="javascript:;" class="close right">关闭</a></div><div class="content"></div><div class="footer-bar" ></div></div></div>',
				content : ''
			}
			opts = Object.extend(dopts, opts);
			this._opts = opts;
			this._ready();
			this._constructFrame();
		},

		_ready : function() {

			// 如果已经存在则删除
			var dialogs = $$('.dialog');
			dialogs.forEach(function(dia) {
				dia.remove();
			});
			this._dialogEl = new Element('div', {
				'class' : 'dialog'
			});
		},

		_constructFrame : function() {
			var dialogEl = this._dialogEl;
			document.body.appendChild(dialogEl);

			// var _diaW = dialog.getStyle('width'), _diaH = dialog.getStyle('height');
			// dialog.setStyle({
			//     top : this._opts.top,
			//	   left : this._opts.left
			// });
		},

		setWidth : function() {

		},

		setContent : function() {

		}
	});
	exports.dialog = dialog;

});
