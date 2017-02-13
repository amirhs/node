var vhost 		= require('vhost');


var user = require('../handlers/user.js');
var main = require('../handlers/main.js');

// var local = modules.i18n.getLocale();



module.exports = function(app, modules) {
  var passport = modules.passport;

  app.use(vhost('api.*', function(req, res, next){
    res.json();
  }));

  app.get('/', main.home);
  app.get('/:lang?/about', main.about);
  app.get('/amir', function(req, res){
    res.json();
  });

  // route for showing the profile page
  app.get('/:lang?/profile', user.isLoggedIn, user.profile);
  app.get('/account', user.account);


  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
          successRedirect : '/'+ modules.i18n.getLocale() +'/profile',
          failureRedirect : '/'
      }));

  // route for logging out
  app.get('/logout', user.logout);

};

// route middleware to make sure a user is logged in
