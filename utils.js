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
};

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
  };
  ua = ua.toLowerCase();
  var match = reg.webkit.exec(ua) || reg.opera.exec(ua) || reg.msie.exec(ua) || ua.indexOf("compatible") < 0 && reg.mozilla.exec(ua) || [];
  return {
    browser : match[1] || "",
    version : match[2] || "0"
  };
};

/**
 * @description 获取字符串的md5数值
 * @param {string} str
 */
var crypto = require('crypto');
exports.getMD5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

/**
 * 转义字符串中的特殊HTML符号
 * @param {String} str 要替换的字符串
 * @return {String}
 */
exports.encodeSpecialHtmlChar = function(str) {
  if (str) {
    var codingchar = ['"', '&', '<', '>'];
    var sepchar = ['&quot;', '&amp;', '&lt;', '&gt;'];
    var len = sepchar.length;

    for (var i = 0; i < len; i++) {
      str = str.replace(new RegExp(codingchar[i], "g"), sepchar[i]);
    }
    return str;
  } else {
    return "";
  }
};

/**
 * 反转义字符串中的特殊HTML符号
 * @param {String} str 要替换的字符串
 * @return {String}
 */
exports.decodeSpecialHtmlChar = function(str) {
  if (str) {
    var codingchar = ['&quot;', '&amp;', '&lt;', '&gt;'];
    var sepchar = ['"', '&', '<', '>'];
    var len = sepchar.length;

    for (var i = 0; i < len; i++) {
      str = str.replace(new RegExp(codingchar[i], "g"), sepchar[i]);
    }
    return str;
  } else {
    return "";
  }
};

/**
 * 获取整个字符的长度
 * 
 */
exports.countChars = function(str, len, flag) {
  if (str) {
    var strLen = str.replace(/[\u4e00-\u9fa5\s]/g, '**').length, newStr = [], totalCount = 0;
 
    if (strLen <= len) {
      return str;
    } else {
      for (var i = 0; i < strLen; i++) {
        var nowValue = str.charAt(i);
        if (/[^\x00-\xff]/.test(nowValue)) {
          totalCount += 2;
        } else {
          totalCount += 1;
        }
        newStr.push(nowValue);
        if (totalCount >= len) {
          break;
        }
      }
      if (flag) {
        return newStr.join('');
      } else {
        return newStr.join('') + '...';
      }
    }
  } else {
    return '';
  }
};

