/**
 * Melodycoder botobe.net
 * 网站上线自动打包部署脚本，包括压缩合并css等等。
 *
 * Copyright (c) 2013 Kai.XU
 * Licensed under the MIT license.
 */

// 预定义变量
var VIEWS_FOLD = './view';
var CONFIG_FILE = './config.js';

var SOURCE_FOLD = './public';
var TARGET_FOLD = SOURCE_FOLD + '/dist';
var LOG_FILE = TARGET_FOLD + '/deploy.log';

// 使用基础包
var fs = require('fs'),
    path = require('path');

// 调用压缩css和js的工具包
var uglifyJS = require('uglify-js'),
    cleanCSS = require('clean-css');

// main
var targetPath = path.resolve(TARGET_FOLD),
    sourcePath = path.resolve(SOURCE_FOLD),
    viewsPath = path.resolve(VIEWS_FOLD),
    configPath = path.resolve(CONFIG_FILE);

if (!fs.existsSync(path.resolve(LOG_FILE))) {
    console.error('文件目录结构不正确！部署失败！');
    process.exit();
}

var currentVersion = 'v' + new Date().getTime();
targetPath = targetPath + '/' + currentVersion;
fs.mkdirSync(targetPath);
fs.appendFileSync(path.resolve(LOG_FILE), '------ VERSION: ' + currentVersion + ' ------\n');

// css归并压缩，合并成home.css文件
var copyFold = function() {

};
var cssFiles = [];
var getCssFiles = function(path) {
    var contentList = fs.readdirSync(path);
    for (var i in contentList) {
        var name = path + '/'　 + contentList[i];
        var isDir = fs.statSync(name).isDirectory();

        if (contentList[i] == 'ugc') {
            return;
        }
        if (isDir) {
            getCssFiles(name);
        } else {
            if (name.substr(-3) == 'css') cssFiles.push(name);
        }
    }
}
fs.mkdirSync(targetPath + '/css');
getCssFiles(sourcePath + '/css');

for (var i in cssFiles) {
    var cssName = cssFiles[i];
    var cssContent = fs.readFileSync(cssName);
    cssContent = cleanCSS.process(cssContent.toString(), {
        keepBreaks: true
    });
    fs.appendFileSync(targetPath + '/css/home.css', cssContent);
}

// js文件的压缩归并
var jsFiles = [],
    relaJsFiles = [];
var getJsFiles = function(path, relaPath) {
    var contentList = fs.readdirSync(path);
    for (var i in contentList) {
        var name = path + '/' + contentList[i],
            relaName = relaPath + '/' + contentList[i];
        var isDir = fs.statSync(name).isDirectory();
        if (isDir) {
            fs.mkdirSync(targetPath + relaName);
            getJsFiles(name, relaName);
        } else {
            if (name.substr(-2) == 'js') {

                // 压缩两份地址，一份是相对的，一份是绝对的
                jsFiles.push(name);
                relaJsFiles.push(relaName);
            }
        }
    }
}
fs.mkdirSync(targetPath + '/js');
getJsFiles(sourcePath + '/js', '/js');

for (var i in jsFiles) {
    var absolutePath = jsFiles[i];
    var relativePath = relaJsFiles[i];

    var content = uglifyJS.minify(absolutePath);
    fs.writeFileSync(targetPath + relativePath, content.code);
}

// 替换静态文件的版本号
var configContent = fs.readFileSync(configPath).toString();
var versionRegix = /\/v\d{13}/;
configContent = configContent.replace(versionRegix, '/' + currentVersion);
fs.writeFileSync(configPath, configContent);

console.log('部署成功！');