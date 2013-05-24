/**
 * @fileverview 整个站点的入口执行js文件
 * @author xukai.ken@gmail.com
 */

require.config({
    baseUrl: 'js/modules',

    paths: {
        libs: '../libs',
        common: '../common'
    }
});

YYMG.modules.push('base');
require(YYMG.modules, function() {

    var arg = arguments, argLen = arg.length;
    for (var i = 0; i < argLen; i++) {
        var module = arg[i];
        if (module && module.init && typeof module.init == 'function')
            module.init();
    }
});