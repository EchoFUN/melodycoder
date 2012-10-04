/**
 * @fileoverview 一些公共的工具包，包括对象的拷贝，数组的重复使用，等等。
 * @version 2012.10.04
 *
 */

/**
 * @description 对象的扩展，将target中的元素进行拷贝复制
 * @param {object} target 原对象
 * @param {object} options 需要拷贝的目标对象
 */
exports.extend = function(target, options) {
    for (var i in options) {
        var copy = options[i];
        if (copy instanceof Array) {
            target[i] = this.extend(target[i], copy);
        } else if (copy instanceof Object) {
            target[i] = this.extend(target[i], copy);
        } else {
            target[i] = copy;
        }
    }
    return target;
}