'use strict';

var mongoose = require('mongoose');
var User = require('./user').User;

var Schema = mongoose.Schema;

// create schema
var reviewSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: User
	},
	postedOn: Date,
	rating: Number,
	review: String 
});

// create model
var Review = mongoose.model('Review', reviewSchema);

module.exports.Review = Review;