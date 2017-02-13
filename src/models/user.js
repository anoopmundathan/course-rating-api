'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create schema
var userSchema = new Schema({
	fullName: String,
	emailAddress: String,
	hashedPassword: String
});

// create model
var User = mongoose.model('User', userSchema);

module.exports.User = User;