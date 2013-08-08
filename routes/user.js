/**
 * @fileOverview 登陆控制器
 * @author EchoFUN(xukai.ken@gmail.com)
 */

var dbEvt;

var _renderLoginPage = function(resp, isLogin) {
  var view = {
    isLogin : isLogin
  };

  resp.render('login', view);
};

exports.login = function(req, resp) {
  var isLogin = false;

  if (req.body.name && req.body.password) {
    dbEvt = req.dbEvt;

    var name = req.body.name, password = req.body.password;
    dbEvt.checkUser(name, password, function(isUser, uid) {
      if ( typeof isUser == 'number') {
        req.session.user = {
          id   : uid,
          name : name,
          time : new Date()
        };

        isLogin = true;
      }
      _renderLoginPage(resp, isLogin);
    });
  } else {
    if (req.session.user)
      isLogin = true;

    _renderLoginPage(resp, isLogin);
  }
};