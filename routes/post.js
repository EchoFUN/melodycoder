/**
 * @fileoverview 文章的增，删，该，查文件修改和调整
 * @version 2012.10.02
 * 
 */

 var db = require('../model/db');

exports.index = function(req, resp) {
    var pid = req.query.pid;
    if(pid) {

    } else {

    }
    
    resp.end('test');
}