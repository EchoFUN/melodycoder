/**
 * @fileoverview 基础的页面模块
 * @author xukai.ken@gmail.com
 *
 */

define(['libs/jquery', 'music'], function($, music) {
    var init = function() {
        var navigatorEl = $('#navigator'), scrolltopEl = $('#scrolltop'), headerEl = $('#header');

        $(window).bind('scroll', function(evt) {
            var self = $(this);

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
        
        music.sideBarPlayer();
    };

    return {
        init: init
    };
});