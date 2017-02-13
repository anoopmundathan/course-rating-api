'use strict';

var mongoose = require('mongoose');

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

});

var user = new User({
		fullName: "Anoop Mundathan",
		emailAddress: "anoop.mundathan@gmail.com",
		hashedPassword: "abcd"
	});

	user.save(function(err, user) {
		if(err) return next(err);
		console.log(user);
		var review = new Review({
			user: user._id,
			postedOn: "2017-10-01",
			rating: "5",
			review: "Good course"
		});
		review.save(function(err, review) {
			var course = new Course({
				user: user._id,
				title: "JavaScript",
				description: "Web development",
				estimatedTime: "10",
				materialsNeeded: "HTML, CSS",
				steps: [
					{
						stepNumber: 1,
						title: "Step1",
						description: "This is step1 description"
					},

					{
						stepNumber: 2,
						title: "Step2",
						description: "This is step2 description"
					}
				],
				reviews: review._id
			});

			course.save(function(err, course) {
				console.log(course);
			});3
		});
	});