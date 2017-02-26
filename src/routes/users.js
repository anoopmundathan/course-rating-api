'use strict';

var express = require('express');
var router = express.Router();

// import model
var User = require('../models/user').User;

// import middleware
var mid = require('../middleware/auth');
var formatError = require('../middleware/format-error');

// GET /api/users - Returns the current user
router.get('/', mid.authenticate, function(req, res, next) {
	
	res.send({
		_id: req.user._id,
		fullName: req.user.fullName
	});

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

/*** UNSUPPORTED ROUTE HANDLING ***/

// PUT /api/users 
router.put('/', function(req, res, next) {
	var err = new Error('Cannot edit a collection of users');
	err.status = 403;
	return next(err);
});

// DELETE /api/users 
router.delete('/', function(req, res, next) {
	var err = new Error('Cannot delete a collection of users');
	err.status = 403;
	return next(err);
});

module.exports = router;
