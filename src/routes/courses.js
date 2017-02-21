'use strict';

var express = require('express');
var router = express.Router();

var formatError = require('../middleware/format-error');

// import models
var Course = require('../models/course').Course;

// GET /api/courses - Returns a list of courses
router.get('/', function(req, res, next) {

	Course.find({}, '_id title')
		.exec(function(err, courses) {
			if (err) return next(err);
			res.json(courses);
		});
});

// POST /api/courses - Create a course
router.post('/', function(req, res, next) {

	Course.create(req.body, function(err) {
		
		if (err) {
			formatError(err, req, res, next);
		} else {
			return res.status(201)
				  .location('/')
				  .end();
		}
	});
});

// GET /api/course/:id - Returns a single course
router.get('/:cID', function(req, res, next) {
	
	// When returning a single course for the GET /api/courses/:id route, 
	// use Mongoose population to load the related user and reviews documents.
	Course.findById(req.params.cID)
		.populate('reviews')
		.populate('user' , '_id fullName')
		.exec(function(err, course) {
			if (err) return next(err);
			res.json(course);
		});
});

// PUT /api/courses/:id - Updates a course
router.put('/:cID', function(req, res, next) {
	
	console.log(req.body);

	Course.findByIdAndUpdate(req.body._id, req.body, function(err, course) {
		if(!course) {
			var err = new Error('No Document found');
			err.status = 401;
			return next(err);
		} else if (err) {
			formatError(err, req, res, next);
		}
		return res.status(204)
				  .end();
	});
});

// POST /api/courses/:courseId/reviews - Creates a review for the specified course
router.post('/:cID/reviews', function(req, res) {
	res.status(201);
	res.send('POST - Creates a review for the specified course');
});

// DELETE /api/courses/:courseId/reviews/:id - Deletes a review
router.delete('/:cID/reviews/:rID', function(req, res) {
	res.status(204);
	res.send('DELETE - Deletes a review');
});

module.exports = router;