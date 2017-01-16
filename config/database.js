module.exports = {
	secret: 'devdacticIsAwesome',
	mongo: {
		development: {
			connectionString: 'mongodb://localhost/node',
		},
		production: {
			connectionString: 'mongodb://localhost/node',
		}
	},
};