'use strict';

var mongoose = require('mongoose');

// var User = require('./user').User;
// var Review = require('./review').Review;
// var Course = require('./course').Course;

mongoose.connect('mongodb://localhost/course-rating-test');
var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Error in Mongoose connection');
});

db.once('open', function() {
	console.log('Succesfully connected to Database');

	var Schema = mongoose.Schema;
	
	// user schema
	var userSchema = new Schema({
		fullName: String
	});
	var User = mongoose.model('User', userSchema);

	// review schema
	var reviewSchema = new Schema({
		status: String
	});
	var Review = mongoose.model('Review', reviewSchema);

	// course schema
	var courseSchema = new Schema({
		title: String,
		description: String,
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		review: {
			type: Schema.ObjectId,
			ref: 'Review'
		}
	});

	var Course = mongoose.model('Course', courseSchema);

	// create documents
	var user = new User({
		fullName: "Anoop"
	});

	user.save(function(err) {
		var review = new Review({
			status: "Good"
		});
		review.save(function(err) {
			var course = new Course({
				title: "Java",
				description: "Java book",
				user: user._id,
				review: review._id
			});
			course.save();
		}); // review.save
	}); // user.save
	
	// User.findOne({}, function(err, user) {
	// 	Review.findOne({}, function(err, review) {
	// 		var course = new Course({
	// 			title: "Java",
	// 			description: "Java book",
	// 			user: user._id,
	// 			review: review._id
	// 		});
	// 		course.save();
	// 	});
	// });

	// Find course

	Course.findOne({})
		.populate('user')
		.populate('review')
		.exec(function(err, course) {
			console.log(course.review.status);
			console.log(course.user.fullName);
		})


});

// var user = new User({
// 		fullName: "Anoop Mundathan",
// 		emailAddress: "anoop.mundathan@gmail.com",
// 		hashedPassword: "abcd"
// 	});

// 	user.save(function(err, user) {
// 		if(err) return next(err);
// 		console.log(user);
// 		var review = new Review({
// 			user: user._id,
// 			postedOn: "2017-10-01",
// 			rating: "5",
// 			review: "Good course"
// 		});
// 		review.save(function(err, review) {
// 			var course = new Course({
// 				user: user._id,
// 				title: "JavaScript",
// 				description: "Web development",
// 				estimatedTime: "10",
// 				materialsNeeded: "HTML, CSS",
// 				steps: [
// 					{
// 						stepNumber: 1,
// 						title: "Step1",
// 						description: "This is step1 description"
// 					},

// 					{
// 						stepNumber: 2,
// 						title: "Step2",
// 						description: "This is step2 description"
// 					}
// 				],
// 				reviews: review._id
// 			});

// 			course.save(function(err, course) {
// 				console.log(course);
// 			});3
// 		});
// 	});