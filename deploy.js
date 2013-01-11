/**
 * Melodycoder
 * http://botobe.net/
 * 网站上线自动打包部署脚本，包括压缩合并css等等。
 *
 * Copyright (c) 2013 Kai.XU
 * Licensed under the MIT license.
 */

// 预定义变量
var SOURCE_FOLD = "./public";
var TARGET_FOLD = "./dist";
var LOG_FILE = TARGET_FOLD + "deplay.log";

// 使用基础包
var fs = require("fs"), path = require("path");

// 调用压缩css和js的工具包
var uglifyJS = require("uglify-js"), cleanCSS = require("clean-css");

// main
var targetPath = path.resolve(TARGET_FOLD), sourcePath = path.resolve(SOURCE_FOLD);

if (fs.existsSync(path.resolve(LOG_FILE))) {
    console.error("文件目录结构不正确！");
    return;
}

var currentVersion = 'v' + new Date().getTime();
fs.mkdirSync(targetPath + '/' + currentVersion);


console.log('部署成功！');