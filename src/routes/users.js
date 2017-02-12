'use strict';

var express = require('express');
var router = express.Router();

// GET /api/users - Returns the current user
router.get('/', function(req, res) {
	res.send('GET - Returns the current user');
});

// POST /api/users - Creates a user
router.post('/', function(req, res) {
	res.status(201);
	res.send('POST - Creates a user');
});

module.exports = router;
