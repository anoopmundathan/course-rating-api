'use strict';

var express = require('express');
var router = express.Router();

var formatError = require('../middleware/format-error');
var mid = require('../middleware/auth');
// import models
var Course = require('../models/course').Course;
var Review = require('../models/review').Review;

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
			return res.status(201).location('/').end();
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
router.put('/:cID', mid.authenticate, function(req, res, next) {


	// The current user can only edit courses for themselves
  if (req.body.user._id === req.user._id.toJSON()) {

  	var opt = { 
		runValidators: true
	}

    Course.findOneAndUpdate({
      _id: req.params.cID
    }, req.body, function(err, course) {
      if (err) {
			formatError(err, req, res, next);
		} else if (!course) {
			var err = new Error('No Document found');
			err.status = 401;
			return next(err);
		} 

		return res.status(204).end();
    });
  } else {
    var err = new Error("Sorry, you can only edit a course for yourself.");
    err.status = 401;
    return next(err);
  }

});

// POST /api/courses/:courseId/reviews - Creates a review for a specified course
router.post('/:cID/reviews', function(req, res, next) {

	// 1. Find user
	// 2. Create review and assign to user
	// 3. Update course with created review

	Course.findById(req.params.cID, function(err, course) {
		
		if (err) { 
			return next(err);
		} else if (!course) {
			var err = new Error('No Document found');
			err.status = 401;
			return next(err);
		} 

		Review.create({
			user: course.user,
			rating: req.body.rating,
			review: req.body.review
		}, function(err, review) {
			if (err) return next(err);

			Course.findByIdAndUpdate(course._id, {
				$set: {
					reviews: review._id
				}
			}, function(err) {
				if (err) return next(err);
				return res.status(204).location('/').end();
			});
		});
	});
});

// DELETE /api/courses/:courseId/reviews/:id - Deletes a review
router.delete('/:cID/reviews/:rID', function(req, res) {
	res.status(204);
	res.send('DELETE - Deletes a review');
});

module.exports = router;