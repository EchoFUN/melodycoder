var site = require('./routes/index'),
	user = require('./routes/user');

module.exports = function(app) {
    app.get('/', site.index);
    app.get('/about-me', site.about);
    app.get('/site/login', site.login);
    app.get('/experiment', site.experiment);
};