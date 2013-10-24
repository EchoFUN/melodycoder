/**
 * @fileoverview 基础的页面模块
 * @author xukai.ken@gmail.com
 *
 */

define(['l/jquery', 'c/components'], function(_, compts) {
  var Dialog = compts.Dialog;

  var init = function() {
    var navigatorEl = _('#navigator'), scrolltopEl = _('#scrolltop'), headerEl = _('#header'), flashLiteEl = _('#flashLite');

    _(window).bind('scroll', function(evt) {
      var self = _(this);

      var st = self.scrollTop();
      if (st < 68) {
        navigatorEl.css('position', 'static');
        headerEl.css('height', '70px');
        scrolltopEl.hide();
      } else {
        navigatorEl.css('position', 'fixed');
        headerEl.css('height', '102px');
        scrolltopEl.show();
      }
    });

    _(window).bind('resize', function() {
      var dialog = YYMG._tp.dialog;
      if (dialog) {
        dialog.resetPos();
      }
    });

    _(document).bind('keydown', function(event) {
      var dialog = YYMG._tp.dialog;
      if (event.keyCode == 27) {
        if (dialog) {
          dialog.close();
        }
      }
    });

    scrolltopEl.bind('click', function() {
      _(document).scrollTop(0);
    });

    _(document).delegate('.underConstruct', 'click', function() {
      new Dialog({
        content : '哎呀，被你发现啦，程序猿正在抓狂中！',
        showClose : false,
        autoHide : 2,
      });
    });

    setInterval(function() {
      var content = _.trim(flashLiteEl.text());
      if (content) {
        flashLiteEl.text('');
      } else {
        flashLiteEl.text('_');
      }
    }, 500);
  };

  return {
    init : init
  };
});
