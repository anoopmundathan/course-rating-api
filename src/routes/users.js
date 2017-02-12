'use strict';

var express = require('express');
var router = express.Router();

// /api/users/
// GET - Returns the current user
router.get('/', function(req, res) {
	res.send('GET - Returns the current user');
});

// /api/users/
// POST - Creates a user
router.post('/', function(req, res) {
	res.send('POST - Creates a user');
});

module.exports = router;
