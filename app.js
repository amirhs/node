
	var express		 	= require('express');
	var fs 					= require('fs');
	var fortune 		= require('./lib/fortune.js');
	var formidable  = require('formidable');
	var nodemailer  = require('nodemailer');
	var mongoose 		= require('mongoose');
	var morgan      = require('morgan');
	var connect 		= require('connect');
	var session 		= require('express-session');
	var MongoStore  = require('connect-mongo')(session);
	var vhost 			= require('vhost');
	var i18n 				= require('i18n');
	var cookieParser= require('cookie-parser')
	// var i18n				= require('i18n-abide');


	var api 					= express.Router();
	var conf 					= require('./config/conf.js');
	var dbConf    		= require('./config/database'); // get db config file
	var userModel			= require('./models/user'); // get the mongoose model
	var passport 			= require('passport');
	var jwt         	= require('jwt-simple');
	var thirdparty		= require('./config/passportThirdpartys')(passport);



	mongoose.connect(dbConf.mongo.development.connectionString);



	var app = express();
	app.use(cookieParser());
	app.use(i18n.init);

// 	app.use(i18n.abide({
//   supported_languages: ['en-US', 'de', 'ar'],
//   default_lang: 'en-US',
//   translation_directory: 'locales'
// }));


// cluster settings
app.use(function(req,res,next){
var cluster = require('cluster');
if(cluster.isWorker) console.log('Worker %d received request',
cluster.worker.id);
	next();
});


i18n.configure({
	locales: ['en', 'de', 'ar'],
	register: global,
	defaultLocale : "de",
	directory: __dirname + '/locales'
});



	// express settings
	app.enable('trust proxy');
	app.disable('x-powered-by');
	app.set('port', process.env.PORT || 3000);


	// set up handlebars view engine
	var handlebars = require('express3-handlebars')
		.create({defaultLayout:'main',
			helpers: {
				section: function(name, options){
				if(!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
				},
				__: function(text, lang){
					i18n.setLocale(lang);
					console.log(i18n.__(text));
					 return i18n.__(text);
				}
			}
		});




	app.engine('handlebars', handlebars.engine);
	app.set('view engine', 'handlebars');

	// handlebars.registerHelper('__', function(key, context) {
	// 	return context.data.root.__(key);
	// });

	// log to console
	app.use(morgan('dev'));



	// initial packages
	app.use(require('body-parser')());
	app.use(express.static(__dirname + '/public'));
	app.use(session({secret: 'anything',
					 saveUninitialized: true,
					 resave: true,
					 // cookie:{
					 //    maxAge : 360000 // one hour in millis
					 // },
					 // store: new MongoStore({mongooseConnection: mongoose.connection})
					}));
	// create "admin" subdomain...this should appear
	app.use(vhost('api.*', api));

	app.use(vhost('api.*', require('cors')()));
	// pass passport for configuration
	require('./config/passport')(passport);
	// Use the passport package in our application
	app.use(passport.initialize());
	app.use(passport.session());



	// Cookie and Session
	app.use(require('cookie-parser')(conf.cookieSecret));
	app.use(require('express-session')());

	// var auth = require('./lib/auth.js')(app, {
	// 	providers: credentials.authProviders,
	// 	successRedirect: '/account',
	// 	failureRedirect: '/unauthorized',
	// });
	// // auth.init() links in Passport middleware:
	// auth.init();
	// // now we can specify our auth routes:
	// auth.registerRoutes();




	// this must come after we link in cookie-parser and connect-session
	// app.use(require('csurf')());
	// app.use('/*', function(req, res, next){
	// 	res.locals._csrfToken = req.csrfToken();
	// 	next();
	// });

	// var autoViews = {};
	// var fs = require('fs');
	// app.use(function(req,res,next){
	// 	var path = req.path.toLowerCase();
	// 	// check cache; if it's there, render the view
	// 	if(autoViews[path]) return res.render(autoViews[path]);
	// 	// if it's not in the cache, see if there's
	// 	// a .handlebars file that matches
	// 	if(fs.existsSync(__dirname + '/views' + path + '.handlebars')){
	// 		autoViews[path] = path.replace(/^\//, '');
	// 		return res.render(autoViews[path]);
	// 	}
	// 	// no view found; pass on to 404 handler
	// 	next();
	// });


	// Session-mongoose
	// var MongoSessionStore = require('session-mongoose')(require('connect'));
	// var sessionStore = new MongoSessionStore({ url:
	// credentials.mongo.connectionString });
	// app.use(require('cookie-parser')(credentials.cookieSecret));
	// app.use(require('express-session')({ store: sessionStore }));





	// Functions
	function authorize(req, res, next){
		if(req.session.authorized) return next();
		res.render('not-authorized');
	}

	var modules = {
		passport:passport,
		i18n:i18n
	}


		// API configuration
		var apiOptions = {
		context: '',
		domain: require('domain').create(),
		};

		var rest = require('connect-rest').create( apiOptions );

			apiOptions.domain.on('error', function(err){
				console.log('API domain error.\n', err.stack);
				setTimeout(function(){
					console.log('Server shutting down after API domain error.');
					process.exit(1);
				}, 5000);
				server.close();
				var worker = require('cluster').worker;
				if(worker) worker.disconnect();
			});

			app.use(vhost('api.*', rest.processRequest()));


	// Routes
	require('./API/routes/api.js')(api, rest);
	require('./app/routes.js')(app, modules);



	// custom 404 page
	app.use(function(req, res){
		res.status(400);
		res.render('404');
	});

	// custom 500 page
	app.use(function(err, req, res, next){
		console.error(err.stack);
		res.status(500);
		res.render('500');
	});



	app.listen(app.get('port'), function(){
		console.log('Express started in ' + app.get('env') + ' mode on port ' + app.get('port') + '; press Ctrl-C to terminate.');
	});
