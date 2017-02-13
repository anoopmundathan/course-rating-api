'use strict';

var mongoose = require('mongoose');
var Review = require('./review').Review;
var User = require('./user').User;

var Schema = mongoose.Schema;

// create schema
var courseSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: User
	},
	title: String,
	description: String,
	estimatedTime: String,
	materialsNeeded: String,
	steps: [
		{
			stepNumber: Number,
			title: String,
			description: String
		}
	],
	reviews: [
		{
			type: Schema.ObjectId,
			ref: Review
		}

	]
});

// create model
var Course = mongoose.model('Course', courseSchema);

module.exports.Course = Course;