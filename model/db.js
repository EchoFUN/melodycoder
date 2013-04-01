/**
 * For the database connection
 */
 
var mongoose = require('mongoose'),
    config = require('../config').config,
    EventProxy = require('eventproxy').EventProxy,
    utils = require('../utils');

exports.initialize = function() { 
    var db = mongoose.createConnection(config.db.DB_HOST, config.db.DB_NAME);
    global.db = db;
    
    var menuSchema = mongoose.Schema({title: String, url: String, weight: Number});
    db.model('Menu', menuSchema);

    var postSchema = mongoose.Schema({date: Date, author: String, title: String, content: String});
    db.model('Post', postSchema);

    var linkSchema = mongoose.Schema({title: String, url: String});
    db.model('Link', linkSchema);

    var categorySchema = mongoose.Schema({pid: String, title: String});
    db.model('Category', categorySchema);

    var tagSchema = mongoose.Schema({pid: String, title: String});
    db.model('Tag', tagSchema);

    var commentSchema = mongoose.Schema({pid: String, name: String, email: String, webisde: String, content: String, date: Date, approved: false});
    db.model('Comment', commentSchema);

    var self = this;
    return function initialize(req, resp, next) {
        req.dbEvt = self;
        next();
    }
}

var dbSite = require('./db.site'), dbMenu = require('./db.menu'), dbPost = require('./db.post'), dbLink = require('./db.link'), dbComment = require('./db.comment'), dbTag = require('./db.tag');
for(var i in dbMenu)
    exports[i] = dbMenu[i];
for(var i in dbPost)
    exports[i] = dbPost[i];
for(var i in dbLink)
    exports[i] = dbLink[i];
for(var i in dbComment)
    exports[i] = dbComment[i];
for(var i in dbTag)
	exports[i] = dbTag[i];
for(var i in dbSite)
    exports[i] = dbSite[i];
