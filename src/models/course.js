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
		required: true
	},
	description: {
		type: String,
		required: true
	},
	estimatedTime: String,
	materialsNeeded: String,
	steps: [
		{
			stepNumber: Number,
			title: {
				type: String,
				required: true
			},
			description: {
				type: String,
				required: true
			}
		}
	],
	reviews: [
		{
			type: Schema.ObjectId,
			ref: 'Review'
		}

	]
});

courseSchema.virtual('overallRating').get(function() {
});

// create model
var Course = mongoose.model('Course', courseSchema);

module.exports.Course = Course;