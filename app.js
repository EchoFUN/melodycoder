/*
 * Melodycoder, an personal webside.
 * http://botobe.net/
 *
 * Copyright (c) 2013 Kai.XU
 * Licensed under the MIT license.
 */

var express = require('express'), map = require('./map'), http = require('http'), path = require('path'), db = require('./model/db'), config = require('./config').config, cluster = require('cluster'), os = require('os'), RedisStore = require('connect-redis')(express);

var app = express();

// 开发环境
app.configure('development', function() {
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

// 生产环境
app.configure('production', function() { 
  app.use(express.compress());
  app.use(function(req, resp, next) {
    resp.setHeader('X-Powered-By', 'He he !');
    next();
  });
});

app.configure(function() {
  app.use(express.cookieParser());

  // 采用redis储存session
  app.use(express.session({
    secret : config.SESSION_SECRET,
    store : new RedisStore(),
    key : 'yymg.sid'
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

map(app);

var _userCluster = function(callback) {
  var numCPUs = os.cpus().length;
  if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
      console.log('worker ' + worker.process.pid + ' died');
    });
  } else {
    callback();
  }
};

if (process.env.NODE_ENV == 'production') {
  _userCluster(function() {
    http.createServer(app).listen(app.get('port'));
  });
} else {
  http.createServer(app).listen(app.get('port'));
}
