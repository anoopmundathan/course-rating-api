'use strict';

var auth = require('basic-auth');
var User = require('../models/user').User;

function checkAuthorization(req, res, next) {

	// parse authorization header
	var user = auth(req);

	// If credentials are available, then attempt to get the user 
	// from the database by their email address.
	if (user.name && user.pass) {

		// Add a middleware function that attempts to get the user credentials from the request.
		User.authenticate(user.name, user.pass, function(err, user) {
			if (err || !user) {
				var err = new Error('Wrong email or Password');
				err.status = 401;
				return next(err);
			} else {
				req.user = user;
				next();
			}
		});

	} else {
		var err = new Error('Enter all fields');
		err.status = 404;
		return next(err);
	}

}

module.exports.checkAuthorization = checkAuthorization;
