// Callbacks
var userRoutes 			= require('../handlers/user');
var Routes 					= require('../handlers/url');

var DB_Product  = require('../models/product');
var passport 	= require('passport');
var Attraction = require('../models/attraction.js');


	//User Authentication
	module.exports = function(api){
		// api.all('/about', Routes.notFound);
		api.post('/signup', userRoutes.signup);
		api.post('/authenticate', userRoutes.authenticate);
		api.get('/memberinfo', passport.authenticate('jwt', { session: false}), userRoutes.memberinfo);
	};



	module.exports = function(api){
		DB_Product.methods(['get', 'put', 'post', 'delete']);
		DB_Product.register(api, '/products');
	};

	module.exports = function(api, rest){

			//rest
		rest.get('/attraction', function(req, content, cb){
			Attraction.find({ approved: true }, function(err, attractions){
					if(err) return cb({ error: 'Internal error.' });
					cb(null, attractions.map(function(a){
						return {
							name: a.name,
							description: a.description,
							location: a.location,
						}
					}));
				});
			});
			rest.post('/attraction', function(req, content, cb){
				var a = new Attraction({
					name: req.body.name,
					description: req.body.description,
					location: { lat: req.body.lat, lng: req.body.lng },
					history: {
						event: 'created',
						email: req.body.email,
						date: new Date(),
					},
					approved: true,
				});
				a.save(function(err, a){
					if(err) return cb({ error: 'Unable to add attraction.' });
					cb(null, { id: a._id });
				});
			});

			rest.get('/attraction/:id', function(req, content, cb){
				Attraction.findById(req.params.id, function(err, a){
					if(err) return cb({ error: 'Unable to retrieve attraction.' });
					cb(null, {
						name: attraction.name,
						description: attraction.description,
						location: attraction.location,
					});
				});
			});
	};
