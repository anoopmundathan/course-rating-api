'use strict';

function formatError(err, req, res, next) {

	if (err.name === 'ValidationError') {
		
	 	var errMessage = {
			message: "Validation Failed",
			errors: {}
		};

		for (var i in err.errors) {
			errMessage.errors[i] = [
				{
					code: 400,
					message: err.errors[i].message
				}
			];
		}

		res.status(400);
		return res.json(errMessage);
	} else {
	 	return next(err);
	}
}

module.exports = formatError;
