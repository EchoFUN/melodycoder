/**
 * @fileverview 通用工具方法
 * @author xukai.ken@gmail.com
 * @version 2013.01.05
 */

define(function(require, exports, module) {

  var regExpress = {

    // 邮箱
    EMAIL : /^[a-zA-Z0-9_\-\.]{1,}@[a-zA-Z0-9_\-]{1,}\.[a-zA-Z0-9_\-.]{1,}$/,

    // 昵称
    NICKNAME : /^[\u4e00-\u9fa5\w_]+$/i,

    // 网站地址
    URL : /^(http)s?:\/\/(?:[\w-]+\.?)+[\.\/\?%&=#@\[\]\-+_!:*~\w-]+|(www)\.(?:[\w-]+\.?)+[\.\/\?%&=#@\[\]\-+_!:*~\w-]+$/i
  };

  return {
    regs : regExpress
  };

});
