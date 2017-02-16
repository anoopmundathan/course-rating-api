'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

// create schema
var userSchema = new Schema({
	fullName: String,
	emailAddress: String,
	hashedPassword: String
});

// Mongoose pre 'save' middleware hook
userSchema.pre('save', function(next) {
	var user = this;
	bcrypt.hash(user.hashedPassword, 10, function(err, hash) {
		if(err) return next(err);
		user.hashedPassword = hash;
		next();
	});
});

// create model
var User = mongoose.model('User', userSchema);

module.exports.User = User;