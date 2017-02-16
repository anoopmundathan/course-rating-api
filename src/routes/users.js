'use strict';

var express = require('express');
var User = require('../models/user').User;
var router = express.Router();

// GET /api/users - Returns the current user
router.get('/', function(req, res) {
	res.send('GET - Returns the current user');
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

		var user = {
			fullName: req.body.fullName,
			emailAddress: req.body.emailAddress,
			hashedPassword: req.body.password
		}

		// save to database
		User.create(user, function(err, user) {
			if (err) {
				return next(err);
			} else {
				res.status(201);
				res.json(user);
			}
		});
		
	} else {
		var err = new Error('All fields are required');
		err.status = 404;
		return next(err);
	}
});

module.exports = router;
