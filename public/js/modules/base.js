/**
 * @fileoverview 基础的页面模块
 * @author xukai.ken@gmail.com
 *
 */

define(function(require, exports, module) {

    _registerMap = new Hash({

        // 导航栏吸顶
        'always-0': function(hook) {
            var topBannerEl = $('navigator');
            if (hook < 68) 
                topBannerEl.setStyle({'position': 'static', 'margin-top': '20px'});
            else
                topBannerEl.setStyle({'position': 'fixed', 'margin-top': '0'});
        },

        // 取消和影藏移动到最顶部按钮
        'always-1': function(hook) {
            var scrollTopEl = $('scrolltop');
            if (hook == 0)
                scrollTopEl.hide();
            else 
                scrollTopEl.show();
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
