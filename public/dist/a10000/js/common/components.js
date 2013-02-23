/**
 * @fileverview 前端基本组件库
 * @author xukai.ken@gmail.com
 */

define(function(require, exports, module) {

	// 弹框组件
	var dialog = Class.create({
		initialize : function(opts) {
			var dopts = {
				top : undefined,
				left : undefined,
				autoHide: undefined,
				title : '提示',
				frameTPL : new Template('<div class="normal"><div class="dialog-title"><a href="javascript:;" class="title left">#{title}</a><a href="javascript:;" class="close right">关闭</a></div><div class="dialog-content">#{content}</div><div class="dialog-footer" ></div></div>'),
				content : '',
				showClose : true
			}
			opts = Object.extend(dopts, opts);
			this._opts = opts;
			this._ready();
			this._constructFrame();
			this._end();
			return this;
		},

		_ready : function() {

			// 如果已经存在则删除
			var dialogs = $$('.dialog');
			dialogs.each(function(dia) {
				dia.remove();
			});
			this._dialogEl = new Element('div', {
				'class' : 'dialog'
			});
		},

		_constructFrame : function() {
			var opts = this._opts;

			var dialogEl = this._dialogEl;
			var frameHTML = opts.frameTPL.evaluate({
				title : opts.title,
				content:　opts.content
			});

			dialogEl.update(frameHTML);
			
			document.body.appendChild(dialogEl);
			this.resetPos();
			
			// 获取footer部分
			this._footerEl = dialogEl.select('.dialog-footer').pop();
			
			// 设置关闭按钮
			var close = this._closeEl = dialogEl.select('.close').pop();				
			if (opts.showClose) {
				close.observe('click', function() {
					dialogEl.remove();
				});
			} else {
				close.remove();
			}
			
			// 设置自动隐藏
			var ah = opts.autoHide;
			if (ah) {
				if (typeof ah == 'number') {
					window.setTimeout(function() {
						dialogEl.remove();
					}, ah * 1000);
				}
			}
		},

		_end : function() {
			var self = this;
			Event.observe(window, 'resize', function() {
				self.resetPos.call(self);
			});
		},

		setWidth : function() {
			return this;
		},

		setContent : function() {
			return this;
		},
		
		addButton : function(value, callback) {
			var button = new Element('a', {'class': 'button', 'href': 'javascript:;'}).update(value);
			if (Object.isFunction(callback)) {
				var self = this;
				button.observe('click', function() {
					callback.call(self);
				});
			}
			
			var footer = this._footerEl;
			footer.appendChild(button);
			return this;
		},

		resetPos : function() {
			var dialogEl = this._dialogEl;

			var _diaW = dialogEl.getStyle('width'), _diaH = dialogEl.getStyle('height');

			var vp = document.viewport;
			var left = this._opts.left || (vp.getWidth() - parseInt(_diaW)) / 2, top = this._opts.top || vp.getScrollOffsets().top + (vp.getHeight() - parseInt(_diaH)) / 2;
			dialogEl.setStyle({
				top : top + 'px',
				left : left + 'px'
			});
			return this;
		},
		
		close : function() {
			this._dialogEl.remove();
		}
	});
	
	exports.dialog = dialog;

});
