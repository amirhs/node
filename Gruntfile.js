var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;


module.exports = function(grunt){
// load plugins
		[
		'grunt-cafe-mocha',
		'grunt-contrib-jshint',
		'grunt-exec',
		].forEach(function(task){
			grunt.loadNpmTasks(task);
		});



// configure plugins
grunt.initConfig({
	surge: {
		node:{
			options: {
				project: '/',
				domain:'api.localhost:3000'
			}
		}
	},

	// connect: {
	// 	server:{
	// 		proxies:[
	// 			{
	// 				context: '/',
	// 				host:			'api.localhost:3000',
	// 				changeOrigin: true
	// 			}
	// 		]
	// 	},
	// 	livereload: {
	// 		options: {
	// 			middleware: function (connect) {
	// 				return [
	// 					lrSnippet,
	// 					mountFolder(connect, '.tmp'),
	// 					mountFolder(connect, youmanConfig.app),
	// 					proxySnippet
	// 				];
	// 			}
	// 		}
	// 	}
	// },

	cafemocha: {
	all: { src: 'qa/tests-*.js', options: { ui: 'tdd' }, }
	},
	jshint: {
	app: ['meadowlark.js', 'public/js/**/*.js',
	'lib/**/*.js'],
	qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
	},
	exec: {

	linkchecker:
	{ cmd: 'linkchecker http://localhost:3000' }

	},
});


// register tasks
grunt.registerTask('default', ['cafemocha','jshint','exec']);
};
