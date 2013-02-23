/*
 * Melodycoder
 * http://botobe.net/
 *
 * Copyright (c) 2013 Kai.XU
 * Licensed under the MIT license.
 */

var express = require('express'), route = require('./RouterMap'), http = require('http'), path = require('path'), db = require('./model/db'), config = require('./config').config;

var app = express();

app.configure(function() {
	app.use(express.cookieParser());
	app.use(express.session({
		secret : config.SESSION_SECRET
	}));
	app.use(db.initialize());
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

// 开发环境
app.configure('development', function() {
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
});

// 生产环境
app.configure('production', function() {
	app.use(express.compress());
});

route(app);
http.createServer(app).listen(app.get('port'));
