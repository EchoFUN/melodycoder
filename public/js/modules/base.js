/**
 * @fileoverview 基础的页面模块
 * @author xukai.ken@gmail.com
 *
 */

define(['libs/jquery', 'common/components'], function(_, compts) {
    var Dialog = compts.Dialog;
    
    var init = function() {
        var navigatorEl = _('#navigator'), scrolltopEl = _('#scrolltop'), headerEl = _('#header');

        _(window).bind('scroll', function(evt) {
            var self = _(this);

            var st = self.scrollTop();
            if (st < 68) {
                navigatorEl.css('position', 'static');
                headerEl.css('height', '70px');
                scrolltopEl.show();
            } else {
                navigatorEl.css('position', 'fixed');
                headerEl.css('height', '102px');
                scrolltopEl.hide();
            }
        });
        
        _(window).bind('resize', function() {
            var dialog = YYMG._tp.dialog;
            dialog && dialog.resetPos();
        });
        
        _(document).bind('keydown', function(event) {
            var dialog = YYMG._tp.dialog;
            if (event.keyCode == 27)
                dialog && dialog.close();
        });
    };

    return {
        init: init
    };
});