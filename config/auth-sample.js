module.exports = {
	authProviders: {
		facebook: {
			development: {
				appId: '',
				appSecret: '',
				callbackURL: 'http://localhost:3000/auth/facebook/callback',
				passReqToCallback: true
			},
		},
	},
};
