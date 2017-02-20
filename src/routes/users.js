'use strict';

var express = require('express');
var auth = require('basic-auth');
var formatError = require('../middleware/format-error');
var router = express.Router();

var User = require('../models/user').User;

// GET /api/users - Returns the current user
router.get('/', function(req, res, next) {

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
				res.send({
					_id: user._id,
					fullName: user.fullName
				});
			}
		});

	} else {
		var err = new Error('Enter all fields');
		err.status = 404;
		return next(err);
	}
	
});

// POST /api/users - Creates a user
router.post('/', function(req, res, next) {

		User.create(req.body, function(err) {
			if (err) {
				return formatError(err, req, res, next);
			} else {
				return res.status(201)
					.location('/')
					.end();	
			}
		});
});

module.exports = router;
