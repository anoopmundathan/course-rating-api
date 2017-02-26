'use strict';

var User = require('../models/user').User;

var auth = require('basic-auth');
var bcrypt = require('bcrypt');

function authenticate(req, res, next) {

	// If credentials are available, then attempt to get the user 
	// from the database by their email address.
	if (auth(req)) {
		
		// parse authorization header
		var userCredential = auth(req);

		// check email in the database
		User.findOne({ 
			emailAddress: userCredential.name
		}).exec(function(err, user) {
			if (error) {
				return next(err);
			} else if (!user) {
				var error = new Error('User is not found');
	          	error.status = 401;
	          	return next(err);
			}

			// If a user was found for the provided email address, 
			// then check the user's password.
	        bcrypt.compare(userCredential.pass, user.password, function(err, result) {

	        	if (error) {
	        		return next(err);
	        	} else if (result === true) {
	        		// If they match, then set the user's information on the request 
	        		// so that each following middleware function has access to it.
	        		
	        		req.user = user;

	        		return next();
	        	} else {
	        		var error = new Error('Password is not matching');
	          		error.status = 401;
	          		return next(err);
	        	}
	        
	        }); // end of bcrypt

		}); // end of User.findOne

	} else {
		var err = new Error('You are not authorized');
		err.status = 404;
		return next(err);
	}

}

module.exports.authenticate = authenticate
