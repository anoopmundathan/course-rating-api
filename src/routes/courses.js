'use strict';

var express = require('express');
var router = express.Router();

// import models
var Course = require('../models/course').Course;
var User = require('../models/review').User;
var Review = require('../models/review').Review;

// import middleware
var formatError = require('../middleware/format-error');
var mid = require('../middleware/auth');


// GET /api/courses - Returns a list of courses
router.get('/', function(req, res, next) {

	Course.find({}, '_id title')
		.exec(function(err, courses) {
			if (err) return next(err);
			res.json(courses);
		});
});

// POST /api/courses - Create a course
router.post('/', mid.authenticate, function(req, res, next) {

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
   			res.send(course.toJSON( { virtuals: true }));
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
				err.status = 404;
				return next(err);
			} else {
				return res.status(204).end();
			}
    	}); // end of findOneAndUpdate

  	} else {
    	var err = new Error("Sorry, you can only edit a course for yourself.");
    	err.status = 401;
    	return next(err);
  	}

});

// POST /api/courses/:courseId/reviews - Creates a review for a specified course
router.post('/:cID/reviews', mid.authenticate, function(req, res, next) {
	
	// find course
	Course.findById(req.params.cID)
		.populate('user')
		.populate('reviews')
		.exec(function(err, course) {
			if (err) return next(err);
		
			if (!course) {
				var err = new Error('No document found');
				err.status = 404;
				return next(err);
			} else {

				//TODO: owner of the course can not review
				if (req.user._id === course.user._id) {
					var err = new Error('You can not review your own course');
					err.status = 401;
					return next(err);
				}
				
				//TODO: user can only post one review per course
				// not happy with for loop here, need to explore better option
				for (var i = 0; i < course.reviews.length; i++) {
        			if (course.reviews[i].user.toJSON() === req.user._id.toJSON()) {
          				var err = new Error('You can not have more than one review for this course');
						err.status = 401;
						return next(err);
        			}
      			}

				//TODO: create review
				var review = new Review(req.body);

				//TODO: assign user to review
				if (req.user._id) {
					review.user = req.user._id;
				} else {
					var err = new Error('You must be logged in to post a review');
					err.status = 401;
					return next(err);
				}

				//TODO: posted date
				review.postedOn = Date.now();

				//TODO: push review to course 
				course.reviews.push(review);

				//TODO: save course
				course.save(function(err) {
					if (err) return next(err);
				});

				//TODO: save review
				review.save(function(err) {
					if (err) {
						formatError(err, req, res, next);
					} else {

						//TODO: send response
          				res.status(201);
          				res.location('/courses/' + req.params.cID);
          				res.end();
        			}
				});
				
			}
		});
});

// DELETE /api/courses/:courseId/reviews/:id - Deletes a review
router.delete('/:cID/reviews/:rID', mid.authenticate, function(req, res, next) {

	var courseID = req.params.cID;
	var reviewID = req.params.rID;
	
	Review.findById(reviewID)
		.exec(function(err, review) {
			if (err) return next(err);

			if (!review) {
				var err = new Error('Review is not found');
				err.status = 404;
				return next(err);
			}

			Course.findById(courseID)
				.populate('user')
				.exec(function(err, course) {
					
					if (err) return next(err);

					if(!course) {
						var err = new Error('Course is not Found');
						err.status = 404;
						return next(err);
					} 

					// Don't allow anyone to delete a review other than the course owner.
					if (req.user._id.toJSON() === course.user._id.toJSON()) {
						
						// Remove review from reviews array
						review.remove(function(err) {
							if (err) return next(err);
							
							if (course.reviews.indexOf(reviewID) !== -1) {
								course.reviews.splice(courseID, 1);
							} 
							course.save(function(err) {
								if (err) return next(err);
								res.status(204);
								res.end();
							}); // course.save
						}); // end of review.remove

					} else {
						var err = new Error('Only review course owner can delete review');
						err.status = 404;
						return next(err);
					}
			}); // End of Course.findById
	}); // End of Review.findById
});

/*** UNSUPPORTED ROUTE HANDLING ***/

// PUT /api/courses
router.put('/', function(req, res, next) {
	var err = new Error('Cannot edit a collection of courses');
	err.status = 403;
	return next(err);
});

// DELETE /api/courses 
router.delete('/', function(req, res, next) {
	var err = new Error('Cannot delete a collection of courses');
	err.status = 403;
	return next(err);
});

// POST /api/courses/:id
router.post('/:id', function(req, res, next) {
	var err = new Error("Use the '/api/courses' route to create a course");
	res.setHeader('Allow', 'GET,PUT');
	err.status = 405;
	return next(err);
});

// DELETE /api/courses/:id
router.delete('/:id', function(req, res, next) {
	var err = new Error('Cannot delete a course');
	err.status = 403;
	return next(err);
});

// PUT /api/courses/:courseId/reviews
router.put('/:courseId/reviews', function(req, res, next) {
	var err = new Error('Cannot edit a collection of reviews');
	err.status = 403;
	return next(err);
});

// PUT /api/courses/:courseId/reviews
router.delete('/:courseId/reviews', function(req, res, next) {
	var err = new Error('Cannot delete a collection of reviews');
	err.status = 403;
	return next(err);
});

// GET /api/courses/:courseId/reviews/:id
router.get('/:courseId/reviews/:id', function(req, res, next) {
	var err = new Error("Cannot get a single review. Use the '/api/courses/:id' route instead to get the reviews for a specific course");
	err.status = 403;
	return next(err);
});

// POST /api/courses/:courseId/reviews/:id
router.post('/:courseId/reviews/:id', function(req, res, next) {
	var err = new Error("Use the '/api/courses/:courseId/reviews' route to create a review");
	err.status = 405;
	res.setHeader('Allow', 'DELETE');
	return next(err);
});

// PUT /api/courses/:courseId/reviews/:id
router.put('/:courseId/reviews/:id', function(req, res, next) {
	var err = new Error('Cannot edit a review');
	err.status = 403;
	return next(err);
});

module.exports = router;