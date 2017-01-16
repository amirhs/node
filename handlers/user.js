var qr = require('qr-image');
var i18n      = require('i18n');

exports.profile = function(req, res) {
  res.setLocale(res, req.params.lang);
var svg_string = qr.imageSync(Math.floor(Math.random()), { type: 'svg' });
    res.render('profile', {
        user : req.user,
        Hello: res.__("Hello"),
        HelloWorld: res.__("Hello World"),
        qr: svg_string // get the user out of session and pass to template
    });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};


// Functions

exports.isLoggedIn = function(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

exports.account = function(req, res){
  console.log(req.session.passport);
  if(!req.session.passport.user)
    return res.redirect(303, '/unauthorized');
  res.render('account');
};
