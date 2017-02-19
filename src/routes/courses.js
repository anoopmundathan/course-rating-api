'use strict';

var express = require('express');
var router = express.Router();

// import models
var Course = require('../models/course').Course;

// GET /api/courses - Returns a list of courses
router.get('/', function(req, res) {

	Course.find({}, '_id title')
		.exec(function(err, courses) {
			if (err) return next(err);
			res.json(courses);
		});
});

// POST /api/courses - Create a course
router.post('/', function(req, res, next) {

	if (req.body.title &&
		req.body.description) {	

		req.body.steps.forEach(function(step) {
			
			if (!step.title || !step.description) {
				var err = new Error('Step should have title and description');
				err.status = 201;
				return next(err);
			}

		});

		Course.create(req.body, function(err) {
			if (err) return next(err);
			return res.status(201)
						  .location('/')
						  .end();
		});

	} else {
		var err = new Error('All fields are required');
		err.status = 404;
		return next(err);
	}

});

// GET /api/course/:id - Returns a single course
router.get('/:cID', function(req, res) {
	
	// When returning a single course for the GET /api/courses/:id route, 
	// use Mongoose population to load the related user and reviews documents.
	Course.findById(req.params.cID)
		.populate('reviews')
		.populate('user')
		.exec(function(err, course) {
			if (err) return next(err);
			res.json(course);
		});
});

// PUT /api/courses/:id - Updates a course
router.put('/:cID', function(req, res) {
	res.status(204);
	res.send('PUT - Updates a course');
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