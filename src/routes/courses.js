'use strict';

var express = require('express');
var router = express.Router();

// GET /api/courses - Returns a list of courses
router.get('/', function(req, res) {
	var courses = [
		{
			_id: 1,
			title: "Java"
		},
		{
			_id: 2,
			title: "XML"
		}
	];

	// res.send('GET - Returns a list of courses');
	res.json(courses);
});

// POST /api/courses - Create a course
router.post('/', function(req, res) {
	res.status(201);
	res.send('PUT - Create a course');
});

// GET /api/course/:id - Returns a single course
router.get('/:cID', function(req, res) {
	res.send('GET - Returns a single course');
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