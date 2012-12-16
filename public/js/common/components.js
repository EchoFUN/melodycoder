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
				title : '提示',
				top : scrollTop + 200,
				left : 0,
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
			
			var _diaW = dialog.getStyle('width'), _diaH = dialog.getStyle('height');
			dialog.setStyle({
				top : this.opts.top,
				left : this.opts.left 
			});
		},

		setWidth : function() {

		},

		setContent : function() {

		}
	});
	exports.dialog = dialog;

});
