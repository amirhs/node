var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
		authId: String,
		name: String,
		email: String,
		role: String,
		created: Date,
	});

var User = mongoose.model('user', userSchema);
module.exports = User;