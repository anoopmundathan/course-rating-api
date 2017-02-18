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

// authenticate user
userSchema.statics.authenticate = function(email, password, callback) {

	// check email in the database
	User.findOne({ 
		emailAddress: email
	}).exec(function(error, user) {
		if (error) {
			return callback(error);	
		} else if (!user) {
			var error = new Error('User is not found');
          	error.status = 401;
          	return callback(error);
		}

		// is password matching 
        bcrypt.compare(password, user.hashedPassword, function(error, result) {

        	if (error) {
        		return callback(error);	
        	} else if (result === true) {
        		return callback(null, user);
        	} else {
        		var error = new Error('Password is not matching');
          		error.status = 401;
          		return callback(error);
        	}
        
        }); // end of bcrypt

	}); // end of User.findOne

}

// create model
var User = mongoose.model('User', userSchema);

module.exports.User = User;