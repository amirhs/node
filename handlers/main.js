var fortune = require('../lib/fortune.js');


exports.home = function(req, res){
	res.render('index');
};

exports.about = function(req, res){
	res.setLocale(res, req.params.lang);
	console.log(res.__("Hello"));
	res.render('about', {
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js',
		word: res.__("Hello"),
		big: res.__("big"),
		father: res.__("father")
	});
	// res.cookie('language', 'de', { maxAge: 900000, httpOnly: true });
};
