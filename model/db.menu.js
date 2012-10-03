/**
 * @fileoverview 所有关于菜单的操作
 * @version 2012.10.03
 *
 */

/**
 * @description 获取所有的菜单的方法
 * @param {function} callback 获取成功后触发的回调函数
 */
exports.getAllMenus = function(callback) {
    var Menu = db.models.Menu;
    Menu.find(function(error, content){
        callback(content);
    });
}