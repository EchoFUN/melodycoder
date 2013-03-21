/**
 * @fileoverview 基础的页面模块
 * @author xukai.ken@gmail.com
 *
 */

define(function(require, exports, module) {
	var tween = require('components').tween;

	var _registerMap = new Hash({

		// 滚动事件监听列表
		'always-0' : function(hook) {
			var topBannerEl = $('navigator'), scrollTopEl = $('scrolltop'), headerEl = $('header');
			if (hook < 68) {
				topBannerEl.setStyle({
					'position' : 'static'
				});
				headerEl.setStyle({
					'height' : '70px'
				});
				scrollTopEl.hide();
			} else {
				topBannerEl.setStyle({
					'position' : 'fixed'
				});
				headerEl.setStyle({
					'height' : '102px'
				});
				scrollTopEl.show();
			}
		}
	});

	exports.init = function() {
		$('scrolltop').observe('click', function() {
			$(window).scrollTo(0);
		});

		// IE6不支持fixed属性
		if (YYMG.isIE6) {
			$('scrolltop').remove();
		} else {

			// 设置头部吸顶
			Event.observe(window, 'scroll', function(evt) {
				var viewPort = document.viewport;
				var offsets = viewPort.getScrollOffsets();
				var yOffset = offsets[1];
				_registerMap.each(function(pair) {
					if (pair.key.indexOf('always') != -1)
						pair.value(yOffset);
					else if (yOffset == pair.key)
						pair.value(yOffset);
				});
			});
		}

		// 增加对全局键盘事件的监听
		Event.observe(document, 'keydown', function(evt) {

			// 全局ESC键
			if (evt.keyCode == Event.KEY_ESC) {
				$$('.dialog').each(function(dialog) {
					dialog.remove();
				});
			}
		});
	};
});
