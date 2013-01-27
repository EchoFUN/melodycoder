/**
 * @fileoverview 基础的页面模块
 * @author xukai.ken@gmail.com
 *
 */

define(function(require, exports, module) {

    _registerMap = new Hash({

        // 导航栏吸顶
        'always-0': function(hook) {
        	
        	// IE6不支持fixed属性
        	if (Prototype.Browser.IE && parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) == 6)
        		return;
        	
            var topBannerEl = $('navigator'), scrollTopEl = $('scrolltop'), headerEl = $('header');
            if (hook < 68) {
                topBannerEl.setStyle({'position': 'static'});
                headerEl.setStyle({'height': '70px'});
                scrollTopEl.hide();
            } else {
                topBannerEl.setStyle({'position': 'fixed'});
                headerEl.setStyle({'height': '102px'});
                scrollTopEl.show();
            }
        }
    });

    exports.init = function() {
        Event.observe(window, 'scroll', function(evt) {
            var viewPort = document.viewport;
            var offsets = viewPort.getScrollOffsets();

            // 设置头部吸顶
            var yOffset = offsets[1];
            
            _registerMap.each(function(pair) {
                if (pair.key.indexOf('always') != -1)
                    pair.value(yOffset);
                else
                    if (yOffset == pair.key)    
                        pair.value(yOffset);
            });
        });

        $('scrolltop').observe('click', function() {

        });
    };
});
