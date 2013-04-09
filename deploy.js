/**
 * Melodycoder botobe.net
 * 网站上线自动打包部署脚本，包括压缩合并css等等。
 * Version:2.0
 *
 * Copyright (c) 2013 Kai.XU
 * Licensed under the MIT license.
 */

// 包依赖，基础包
var fs = require('fs'), async = require('async'), path = require('path'), util = require('util');

// 进行css和js压缩的包
var uglifyJS = require('uglify-js'), cleanCSS = require('clean-css');

// 对数组的修改
Array.prototype.add = function(element) {
	this.push(element);
	return this;
};

// 检测静态文件的目录结构是否完整，以及生成对应的目录结构
var isFilesReady = true;
var filesPath = ['./public', './public/dist', './public/dist/deploy.log', './public/css', './public/css/ugc', './public/js'];
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

try {
	// 生成对应的目录结构
	var tpVersions = fs.readdirSync(filesPath[1]), versions = [];
	tpVersions.forEach(function(version, range) {
		var versionNumber = parseInt(version.slice(1));
		if (!isNaN(versionNumber)) {
			versions.push(versionNumber);
		}
	});
	var newVersion = eval('Math.max(' + (versions).join(',') + ')') + 1;
	var disPath = filesPath[1] + '/v' + newVersion;
	filesPath.add(disPath).add(disPath + '/css').add(disPath + '/js').add(disPath + '/css/ugc');
	filesPath.forEach(function(filePath) {
		if (!fs.existsSync(filePath))
			fs.mkdirSync(filePath);
	});
	
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
	var executeCSS = function(targetFile, sourceFile) {
		var cssContent = fs.readFileSync(sourceFile);
		cssContent = cleanCSS.process(cssContent.toString(), {
			keepBreaks : true
		});
		fs.appendFileSync(targetFile, cssContent);
	};
	cssFiles.forEach(function(cssFile) {
		executeCSS(filesPath[7] + '/home.css', cssFile);
	});
	fs.readdirSync(filesPath[3] + '/ugc').forEach(function(ugcCssFile) {
		executeCSS(filesPath[9] + '/' + ugcCssFile, filesPath[4] + '/' + ugcCssFile);
	});
	
	// 处理js文件，这块暂先不处理
 	var jsFiles = [], relaJsFiles = [];
	var getJsFiles = function(absoPath, relaPath) {
	    var contentList = fs.readdirSync(absoPath);
	    contentList.forEach(function(content) {
	        var name = absoPath + '/' + content, relaName = relaPath + '/' + content;
	        var isDir = fs.statSync(name).isDirectory();
	        if (isDir) {
	            fs.mkdirSync(disPath + relaName);
	            getJsFiles(name, relaName);
	        } else {
	            if (name.substr(-2) == 'js') {
	
	                // 压缩两份地址，一份是相对的，一份是绝对的
	                jsFiles.push(name);
	                relaJsFiles.push(relaName);
	            }
	        }
	    });
	}
	getJsFiles(filesPath[5], '/js');
	
	jsFiles.forEach(function(jsFile, range) {
	    var absolutePath = jsFile, relativePath = relaJsFiles[range];
	
	    var content = uglifyJS.minify(absolutePath, {
	    	mangle: false,
	    	warnings: true
	    });
	    
	    // var content = fs.readFileSync(absolutePath);
	    fs.writeFileSync(disPath + relativePath, content.code);
	});
	
	// 修改静态文件的版本号
	var configPath = path.resolve('./config.js');
	var configContent = fs.readFileSync(configPath).toString();
	var versionRegix = /\/v\d{1,}/;
	configContent = configContent.replace(versionRegix, '/v' + newVersion);
	fs.writeFileSync(configPath, configContent);
} catch(e) {
	console.error(e.message);
	process.exit();
}
console.log('部署成功！');