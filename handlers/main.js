var fortune = require('../lib/fortune.js');
var db 			= require('../lib/database');


exports.home = function(req, res){
	res.render('index');
};

exports.about = function(req, res){
	res.setLocale(res, req.params.lang);

	// console.log(db.connection());
	var connection = db.connection();

	db.query('SELECT * from users',
	function(err, rows, fields) {
		if (!err)
			console.log('The solution is: ', rows[0].name),
			db.end();
		else
			console.log("Error while perdorming Query.");
	});

	// console.log(db.end());

	res.render('about', {
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js',
		word: res.__("Hello"),
		big: res.__("big"),
		father: res.__("father")
	});
	// res.cookie('language', 'de', { maxAge: 900000, httpOnly: true });
};
