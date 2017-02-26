'use strict';

var mongoose = require('mongoose');
var seeder = require('mongoose-seeder');
var data = require('../data/data.json');

// models
var User = require('./user').User;
var Review = require('./review').Review;
var Course = require('./course').Course;

mongoose.connect('mongodb://localhost/course-rating');
var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Error in Mongoose connection');
});

db.once('open', function() {
	console.log('Succesfully connected to Database');
	seeder.seed(data).then(function(dbData) {
		console.log('Created database');
	}).catch(function(err) {
		console.log('mongoose-seeder error', err);
	});


});
