/**
 * Melodycoder botobe.net
 * 网站上线自动打包部署脚本，包括压缩合并css等等。
 * Version:2.0
 *
 * Copyright (c) 2013 Kai.XU
 * Licensed under the MIT license.
 */

// 包依赖，基础包
var fs = require('fs'), async = require('async'), path = require('path');

// 进行css和js压缩的包
var uglifyJS = require('uglify-js'), cleanCSS = require('clean-css');

// 检测静态文件的目录结构是否完整，以及生成对应的目录结构
var isFilesReady = true;
var filesPath = ['./public', './public/dist', './public/dist/deploy.log', './public/css'];
filesPath.forEach(function(filePath, range) {
	var absolutePath = path.resolve(filePath);

	filesPath[range] = absolutePath;
	if (!fs.existsSync(absolutePath))
		isFilesReady = false;
});

if (!isFilesReady) {
	console.error('文件结构不正确！');
	process.exit();
}

// 生成对应的目录结构
var tpVersions = fs.readdirSync(filesPath[1]), versions = [];
tpVersions.forEach(function(version, range) {
	var versionNumber = parseInt(version.slice(1));
	if(!isNaN(versionNumber)) {
		versions.push(versionNumber);
	}
});
var newVersion = eval('Math.max(' + (versions).join(',') + ')') + 1;


// 合并css文件成home.css，除了ugc目录，单独至于版本文件夹下
// 获取出所有的css文件
var cssFolder = filesPath[3];
var cssFiles = [];
(function(folder) {
	var contentList = fs.readdirSync(folder);

	var argu = arguments;
	contentList.forEach(function(name) {
		if (name == 'ugc')
			return;
			
		var oriName = folder + '/' + name;
		if (fs.statSync(oriName).isDirectory()) {
			argu.callee(oriName);
		} else {
			cssFiles.push(oriName);
		}
	});
})(cssFolder);

// 归并css文件
cssFiles.forEach(function(cssFile) {
    var cssContent = fs.readFileSync(cssFile);
    cssContent = cleanCSS.process(cssContent.toString(), {
        keepBreaks: true
    });
    // fs.appendFileSync(filesPath[3] + '/css/home.css', cssContent);
});

console.log('部署成功！');
