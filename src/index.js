'use strict';

// load modules
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

// routes
var courses = require('./routes/courses');
var users = require('./routes/users');

var app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/course-rating');
// mongoose.connect('mongodb://heroku_1qv8ngq4:ghkb8l9929m25aee3p02sk5atb@ds161169.mlab.com:61169/heroku_1qv8ngq4');
var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Error connecting to the database', err);
});

db.once('open', function() {
	console.log('Succesfully connected to the database');
});
// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// parse incoming requests
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

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
	res.json({ "message": err.message });
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);  
});
