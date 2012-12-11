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
		if ( copy instanceof Array) {
			target[i] = this.extend(target[i], copy);
		} else if ( copy instanceof Object) {
			target[i] = this.extend(target[i], copy);
		} else {
			target[i] = copy;
		}
	}
	return target;
}
/**
 * @description 根据浏览器的版本做判断
 * @param {string} ua
 */
exports.browser = function(ua) {
	var reg = {
		webkit : /(webkit)[ \/]([\w.]+)/,
		opera : /(opera)(?:.*version)?[ \/]([\w.]+)/,
		msie : /(msie) ([\w.]+)/,
		mozilla : /(mozilla)(?:.*? rv:([\w.]+))?/
	}
	ua = ua.toLowerCase();
	var match = reg.webkit.exec(ua) || reg.opera.exec(ua) || reg.msie.exec(ua) || ua.indexOf("compatible") < 0 && reg.mozilla.exec(ua) || [];
	return {
		browser : match[1] || "",
		version : match[2] || "0"
	};
}
