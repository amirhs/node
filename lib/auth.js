var User = require('../models/user.js'),
passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;



module.exports = function(app, options){

	passport.serializeUser(function(user, done){
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			if(err || !user) return done(err, null);
			done(null, user);
		});
	});

		// set some reasonable defaults
	if(!options.successRedirect)
		options.successRedirect = '/account';
	if(!options.failureRedirect)
		options.failureRedirect = '/login';

	return {
		init: function() {
			var env = app.get('env');
			var config = options.providers;
			// configure Facebook strategy
			passport.use(new FacebookStrategy({
				clientID: config.facebook[env].appId,
				clientSecret: config.facebook[env].appSecret,
				callbackURL: '/auth/facebook/callback',
			}, function(accessToken, refreshToken, profile, done){
				var authId = 'facebook:' + profile.id;
				User.findOne({ authId: authId }, function(err, user){
					if(err) return done(err, null);
					if(user) return done(null, user);
					user = new User({
						authId: authId,
						name: profile.displayName,
						created: Date.now(),
						role: 'customer',
					});
					user.save(function(err){
						if(err) return done(err, null);
						done(null, user);
					});
				});
			}));
			app.use(passport.initialize());
			app.use(passport.session());
		},
		registerRoutes: function(){
			// register Facebook routes
			app.get('/auth/facebook', function(req, res, next){
				passport.authenticate('facebook', {
					callbackURL: '/auth/facebook/callback?redirect=' +
					encodeURIComponent(req.query.redirect),
				})(req, res, next);
			});
			app.get('/auth/facebook/callback', passport.authenticate('facebook',
				{ failureRedirect: options.failureRedirect },
				function(req, res){
					console.log(res);
					// we only get here on successful authentication
					res.redirect(303, req.query.redirect || options.successRedirect);
				}
			));
		},
	};


};