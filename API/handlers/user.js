
var dbConfig      = require('../../config/database');
var jwt         = require('jwt-simple');
var passport 	= require('passport');

// additinal functions
var Token	= require('../../lib/token');

exports.signup = function(req, res){
	  if (!req.body.name || !req.body.password) {
	    res.json({success: false, msg: 'Please pass name and password.'});
	  } else {
	    var newUser = new User({
	      name: req.body.name,
	      password: req.body.password
	    });
	    // save the user
	    newUser.save(function(err) {
	      if (err) {
	        return res.json({success: false, msg: 'Username already exists.'});
	      }
	      res.json({success: true, msg: 'Successful created new user.'});
	    });
	  }
}

exports.authenticate = function(req, res){
	  User.findOne({
	    name: req.body.name
	  }, function(err, user) {
	    if (err) throw err;

	    if (!user) {
	      res.send({success: false, msg: 'Authentication failed. User not found.'});
	    } else {
	      // check if password matches
	      user.comparePassword(req.body.password, function (err, isMatch) {
	        if (isMatch && !err) {
	          // if user is found and password is right create a token
	          var token = jwt.encode(user, dbConfig.secret);
	          // return the information including token as JSON
	          res.json({success: true, token: 'JWT ' + token});
	        } else {
	          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
	        }
	      });
	    }
	  });
}

exports.memberinfo = function(req, res){
	  var token = Token.getToken(req.headers);
	  if (token) {
	    var decoded = jwt.decode(token, dbConfig.secret);
	    User.findOne({
	      name: decoded.name
	    }, function(err, user) {
	        if (err) throw err;

	        if (!user) {
	          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
	        } else {
	          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
	        }
	    });
	  } else {
	    return res.status(403).send({success: false, msg: 'No token provided.'});
	  }


}
