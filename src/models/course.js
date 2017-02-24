'use strict';

var mongoose = require('mongoose');
var Review = require('./review').Review;
var User = require('./user').User;

var Schema = mongoose.Schema;

// create schema
var courseSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	title: {
		type: String,
		required: [true, 'Course title is required']
	},
	description: {
		type: String,
		required: [true, 'Course description is required']
	},
	estimatedTime: String,
	materialsNeeded: String,
	steps: {
		type: [
			{
				stepNumber: Number,
				title: {
					type: String,
					required: [true, 'Steps title is required']
				},
				description: {
					type: String,
					required: [true, 'Steps description is required']
				}
			}
		],
		required: [true, 'At least one step is required']
	},
	reviews: [
		{
			type: Schema.ObjectId,
			ref: 'Review'
		}

	]
});

// overallRating is a calculated, read only property that returns the average 
// of all of the review ratings for this course rounded to the nearest whole number.
courseSchema.virtual('overallRating').get(function() {

	var total = 0;
	var result = 0;

	if (this.reviews) {
    	for (var i = 0; i < this.reviews.length; i++) {
      		total = total + this.reviews[i].rating;
    	}
    	result = Math.round(total / this.reviews.length);
  	}
  return result;

});

// create model
var Course = mongoose.model('Course', courseSchema);

module.exports.Course = Course;