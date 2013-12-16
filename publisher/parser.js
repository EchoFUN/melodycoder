/**
 * @fileOverview Melody coder 文章的解析工具
 * @author <a href="mailto:xukai.ken@gmail.com">(XU Kai)xukai.ken@gmail.com</a>
 * @version 0.1
 *
 */

var Logger = require('./logger'), fs = require('fs');

var Parser = function(type) {
  this.type = type;
  if ( typeof this[type] == 'undefined')
    Logger.error('Has no parser for pasrsing the document !');
};

var fn = Parser.prototype;
fn.BASIC = function(content) {
  var artInfo = JSON.parse(content);
  var artPath = artInfo.path;
  if (fs.existsSync(artPath)) {
    var artContent = fs.readFileSync(artPath).toString();
    artInfo.content = artContent;
    return artInfo;
  } else {
    throw new Error('Article file not exist !');
  }
};

fn.parse = function(content) {
  var parser = this[this.type];
  return parser(content);
};

exports.Parser = Parser;
