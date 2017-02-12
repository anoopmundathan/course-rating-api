'use strict';

// load modules
var express = require('express');
var morgan = require('morgan');
var courses = require('./routes/courses');
var users = require('./routes/users');

var app = express();

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// routes handling 
app.use('/api/courses', courses);
app.use('/api/users', users);

// middleware function to catch 404 error
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// global error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);  
});
