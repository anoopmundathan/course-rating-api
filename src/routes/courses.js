'use strict';

var express = require('express');
var router = express.Router();

// /api/courses
// GET - Returns a list of courses
router.get('/', function(req, res) {
	res.send('GET - Returns a list of courses');
});

// /api/courses
// POST - Create a course
router.post('/', function(req, res) {
	res.send('PUT - Create a course');
});

// /api/courses/:id
// GET - Returns a single course
router.get('/:cID', function(req, res) {
	res.send('GET - Returns a single course');
});

// /api/courses/:id
// PUT - Updates a course
router.put('/:cID', function(req, res) {
	res.send('PUT - Updates a course');
});

// /api/courses/:courseId/reviews
// POST - Creates a review for the specified course
router.post('/:cID/reviews', function(req, res) {
	res.send('POST - Creates a review for the specified course');
});

// /api/courses/:courseId/reviews/:id
// DELETE - Deletes a review
router.delete('/:cID/reviews/:rID', function(req, res) {
	res.send('DELETE - Deletes a review');
});

module.exports = router;