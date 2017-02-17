'use strict';

var express = require('express');
var auth = require('basic-auth');
var User = require('../models/user').User;
var router = express.Router();

// GET /api/users - Returns the current user
router.get('/', function(req, res) {

	// parse authorization header
	var user = auth(req);

	// validate email and password
	if (user.name && user.pass) {

		User.find({
			emailAddress: user.name
		}, function(err, user) {
			if (err) return next(err);
			res.send(user);
		});
	} else {
		// send error
	}
	
});

// POST /api/users - Creates a user
router.post('/', function(req, res, next) {

	// all fields are available in the request
	if (req.body.fullName && 
		req.body.emailAddress &&
		req.body.password &&
		req.body.confirmPassword) {

		// confirm password is matching
		if (req.body.password !== req.body.confirmPassword) {
			var err = new Error('Password is not matching');
			err.status = 404;
			return next(err);
		}

		req.body.hashedPassword = req.body.password;
		// save to database
		User.create(req.body, function(err, user) {
			if (err) {
				return next(err);
			} else {
				// res.location('/');
				// res.send(201, null);
				return res.status(201)
						  .location('/')
						  .end()
			}
		});
		
	} else {
		var err = new Error('All fields are required');
		err.status = 404;
		return next(err);
	}
});

module.exports = router;
