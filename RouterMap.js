
var site = require('./routes/index');
var user = require('./routes/user');

module.exports = function(app) {
    app.get('/', site.index);
    app.get('/about-me', site.about);
    app.get('/site/login', site.login);
    app.get('/experiment', site.experiment);

    app.post('/user/login', user.login);
    app.post('/widgetboxs/rest/execute.htm', site.test);
};