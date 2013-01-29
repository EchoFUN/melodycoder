/**
 * @fileoverview 基础的页面模块
 * @author xukai.ken@gmail.com
 *
 */

define(function(require, exports, module) {

	_registerMap = new Hash({

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
		if (Prototype.Browser.IE && parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE") + 5)) == 6) {
			$('scrolltop').remove();
			return;
		}

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
	};
});
