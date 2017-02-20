'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

// create schema
var userSchema = new Schema({
	fullName: {
		type: String,
		required: [true, 'Full Name is required']
	},
	emailAddress: {
		type: String,
		unique: [true, 'Email Address is already taken'],
		required: [true, 'Email Address is required'],
		validate: {
			validator: emailValidator,
			message: '{PATH} must be in a valid format.'
		}
	},
	password: {
		type: String,
		required: [true, 'Password is required']
	},
	confirmPassword: {
		type: String,
		required: [true, 'Confirm Password is required']
	}
});

function emailValidator(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}


// validate password
userSchema.path('password').validate(function(password) {
	var regEx = new RegExp("^(?=.{8,})");
  	return regEx.test(this.password);
}, "Password must contain at least 8 characters");

userSchema.pre('validate', function(next) {
	if (this.password !== this.confirmPassword) {

    	// invalidate password field if they don't match.
    	this.invalidate('password', 'Passwords must match.');
    	next();

    // If they match, continue.
  	} else {
    	next();
  	}
});

// Mongoose pre 'save' middleware hook
userSchema.pre('save', function(next) {
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		}
		user.password = hash;

		bcrypt.hash(user.confirmPassword, 10, function(err, hash) {
			if (err) {
				return next(err);
			}
			user.confirmPassword = hash;

			return next();
		});

		
	});
});

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email must be unique'));
  } else {
    next(error);
  }
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

		// If a user was found for the provided email address, 
		// then check the user's password.
        bcrypt.compare(password, user.password, function(error, result) {

        	if (error) {
        		return callback(error);	
        	} else if (result === true) {
        		// If they match, then set the user's information on the request 
        		// so that each following middleware function has access to it.
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